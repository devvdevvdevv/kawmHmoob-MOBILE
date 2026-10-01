# Concept: ranking answers when several sources can answer

Learned from `src/lib/wordLookup.js` on 2026-09-13, after two bugs that both
looked like "the translations are wrong" and were actually **"the right answer
lost to the wrong one."**

This shows up any time more than one place can answer a question: a cache and a
database, a user setting and a default, a local file and a remote one.

---

## The bug you could see

A learner reading a story taps the word **`tus`**. The app says:

> **tus** — string, thread, cord

That is wrong. `tus` is a classifier — the little word before people and animals,
closest to "the". It does not mean thread.

Where did "thread" come from? The story's glossary contains **"tus xov"**
(thread). The lookup searched that glossary for a phrase *containing* the tapped
word, found "tus xov", and handed back its meaning.

> ⚠️ **That glossary entry no longer exists** — on 2026-09-13 the author
> corrected it to `xov` (the classifier is `lub`, not `tus`). The bug is
> reported here as it happened, because the shape of it is the lesson. Reproduce
> it with `tus kas` (goat) instead, which is still there and still contains
> `tus`.

Same story, tap **`lub`** → "lock", because the glossary has "lub xauv".

⚠️ **Notice which words broke.** `tus` and `lub` are on almost every line of
Hmong. The app was most confidently wrong about the words people press most.

---

## Idea 1: sources are ranked, and the ranking IS the design

The lookup had three sources:

```
1  the story's own glossary, exact match     ← the author wrote it for THIS text
2  a glossary phrase CONTAINING the word     ← "tus" found inside "tus xov"
3  the dictionary, exact match               ← 600 words
```

Reading that list, the bug is already visible: **number 2 is a partial match and
number 3 is an exact one.** A guess was ranked above a fact.

### The rule

> **An exact match beats a partial match. Always.**

A partial match means "I don't know your word, but I know something it appears
inside." That is a *fallback* — the answer you give when nothing better exists.
Putting it above the dictionary means the fallback fires even when something
better exists.

The fix was moving one block of code:

```
1  story glossary, exact
2  the dictionary, exact        ← promoted
3  glossary phrase containing   ← demoted to last
```

**Five words changed across 150.** Small, because a partial match only misfires
when the tapped word happens to sit inside a glossed phrase — and all five were
wrong before.

### Analogy

Someone asks what "bank" means. You could:

- **exact** — look up *bank* in a dictionary;
- **partial** — remember you once read the phrase *river bank* and answer "the
  edge of a river".

Both are real. But if you have a dictionary open in front of you, answering from
the half-remembered phrase is not "a fallback", it is **skipping the answer you
already had.**

---

## Idea 2: `if (!map.has(key))` silently throws data away

The dictionary is a `Map`, built once at module load:

```js
if (key && !dictionary.has(key)) {
  dictionary.set(key, { ...entry })
}
```

Read that carefully. If the key is **already there**, nothing happens — and the
new entry is **gone**. Not stored elsewhere, not logged. Gone.

That is fine when duplicates are duplicates. It is a bug when they are
**different senses of the same word**.

`rau` has three entries in `vocabulary.js`:

| category | meaning |
|---|---|
| `wear-verbs` | to put on footwear — shoes, socks |
| `misc` | to, for |
| `numbers` | six |

Which one survived? **The one whose category sits earliest in the file.** So a
learner tapping `rau` in *"muab rau kuv"* (give it **to** me) was told it means
putting on shoes.

⚠️ Nobody chose that. It fell out of array order.

> **A ranking you did not design is not a ranking. It is an accident that looks
> like a decision.**

### The fix: collect instead of discard

```js
if (key && dictionary.has(key)) {
  dictionary.get(key).senses.push(word.english)   // keep it
} else if (key) {
  dictionary.set(key, { ...entry, senses: [word.english] })
}
```

The first entry still wins for **identity** — the `id` the notebook saves, the
category, the example — so nothing downstream changed. Only the display gained
the others:

```
rau — (verb: to put on footwear — shoes, socks) · to, for · six
```

⚠️ **The join is deliberately unranked.** Category order is arbitrary, so sorting
by it would be a second accident wearing a suit. Showing all three says "this
word has several senses", which is *true*, instead of picking one and implying
it is *the* one.

---

## Idea 3: a precomputed index beats searching every time

Hmong is full of two-word compounds, and a tap lands on **one** of the two. `kis`
means nothing alone — **"tag kis"** means morning. So tapping `kis` said "no entry
for this word yet" while the dictionary sat there holding the answer.

You could search for it on every tap:

```js
// works, but scans 600 entries every single tap
[...dictionary].find(([k]) => k.split(' ').includes(word))
```

Better: build the answer **once**, when the module loads.

```js
const insideCompound = new Map()
for (const [key, entry] of dictionary) {
  const parts = key.split(/\s+/)
  if (parts.length < 2) continue          // single words are already exact-matchable
  for (const part of parts) {
    if (!part || dictionary.has(part)) continue   // an exact entry always wins
    if (!insideCompound.has(part)) insideCompound.set(part, [])
    insideCompound.get(part).push(entry)
  }
}
```

Now a tap is one `Map.get`. This is the same trick as the dictionary itself —
**do the work once at load, not once per interaction** — and it is why both are
built at the top of the file rather than inside `lookupWord`.

### Read the two `continue` lines again

They are not tidying. They are the guards:

- `parts.length < 2` — a single-word entry is already reachable exactly; indexing
  it here would duplicate work and create ties.
- `dictionary.has(part)` — **if the word has its own entry, never index it as
  part of something else.** This is the line that makes the whole feature safe.

---

## Idea 4: a fallback needs guards, and you should be able to name them

Adding "match inside a compound" is the kind of feature that quietly rots. Three
guards keep it honest:

**1. Whole tokens, never substrings.**

```js
key.split(/\s+/)            // ✅ "tag kis" → ["tag", "kis"]
key.includes(word)          // ❌ "ua" matches inside "nkauj"
```

A substring match feels equivalent and is not. `si` would match `sim`, `ua` would
match `nkauj`. It fails on the words you never test.

**2. Skip any word that has its own entry.**

The worry with this feature was `li` getting dragged into `li cas?`. It cannot:
`li` has its own dictionary entry, so it is excluded from the index. Only a word
that **nothing** can define alone ever reaches the fallback — which is exactly
the set the fallback is for.

**3. Say what you actually matched.**

```js
hmong: primary.hmong,   // "tag kis" — NOT the tapped word
```

The sheet reads **"tag kis — morning"**, not "kis — morning". The learner must
see that what they pressed is half of something. A fallback that disguises itself
as an exact answer teaches a wrong thing confidently — the worst possible
outcome, and worse than saying nothing.

---

## The finished ladder

```
1  story glossary, exact        the author wrote it for this text
2  dictionary, exact            the word itself, all senses
3  story glossary, phrase       this text glosses something containing it
4  dictionary, compound         "kis" → "tag kis"
   ─ nothing ─                  "no entry for this word yet"
```

Each rung is **less specific and less certain** than the one above. That is the
whole principle: *most specific first, most confident first, and say which rung
answered.*

Note rung 5. **"No entry yet" is a real answer** and belongs in the ladder. The
temptation is always to squeeze one more guess out; an honest miss is better than
a confident wrong, because a learner can act on "we don't know" and cannot act on
a plausible lie.

---

## Checklist for your next lookup

- [ ] List every source that could answer. Write them in order.
- [ ] Is any **partial** match ranked above an **exact** one? Fix that first.
- [ ] Does a collision **discard** data? (`if (!map.has(k))` — look hard at it.)
- [ ] Is anything ranked by array position, category order, or file order? Did
      you *choose* that order, or did it just happen?
- [ ] Does each fallback match whole units, not substrings?
- [ ] Does the answer say which rung it came from, so a fallback can't pass as
      an exact hit?
- [ ] Is "I don't know" one of the outcomes?

---

## Exercises

### 1. Reproduce the original bug
Temporarily move the phrase block back above the dictionary block in
`lookupWord`. Open "Ntxawm Lub Xauv", tap `tus`. Watch it answer with **"goat"**
— from `tus kas`, the glossary entry that still contains `tus`. Put it back.
Feeling the bug is worth more than reading about it.

(It said "string, thread, cord" when this was written, from `tus xov`. That
entry was corrected to `xov` on 2026-09-13. **A glossary with any multi-word
entry will reproduce this** — which is the point: the bug was never about one
word.)

### 2. Break guard 2
Delete `if (!part || dictionary.has(part)) continue` from the index builder. Now
tap `li` in "Tus Miv". Predict what happens **before** you run it, then check.

### 3. Count the damage
Write a script that walks every token in every story and prints which rung
answers it. How many land on rung 4? How many on "nothing"? That number is your
reading module's real coverage — and it is a better metric than the size of the
dictionary.

### 4. Judgement, no code
`rau` shows three senses joined with `·`. At what number of senses does that stop
being helpful and start being noise? What would you do instead at that point —
and who decides which sense leads?
