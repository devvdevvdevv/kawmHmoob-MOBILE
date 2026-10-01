# Every "tus" meant "tus xov": the lookup was answering with the wrong sense (2026-09-13)

Two separate bugs, both reported as "the definitions are wrong", both actually
about **which sense wins** rather than about a bad translation.

## 1. A partial match was beating an exact one

The tiers ran:

```
1  story glossary, exact
2  story glossary PHRASE containing the word     ← partial
3  the dictionary, exact
```

So in a story that glosses **"tus xov"** (thread), tapping the classifier **`tus`**
returned *"string, thread, cord"*. Tapping **`lub`** returned *"lock"*, because
the story glosses "lub xauv". The dictionary knew both words perfectly well and
was never reached.

⚠️ **The reader was most confidently wrong about the words a learner presses
most** — `tus` and `lub` are on nearly every line of Hmong ever written.

**Fix: swap 2 and 3.** An exact match beats a partial one; the phrase fallback is
still there, last, for when nothing knows the word itself ("zos" → "lub zos" is
still a real answer).

Measured across all 150 tokens in the two stories, **5 change** — and all five
were wrong before:

| word | was | now |
|---|---|---|
| `tus` | string, thread, cord | classifier for people & animals |
| `lub` | lock | classifier for round or solid objects |
| `pom` | to want to see | to see |
| `xav` | to want to see | to want, to think |
| `pog` | great-grandmother | paternal grandmother |

Only five, because a partial match only misfires when the tapped word happens to
sit inside a glossed phrase. That is rare — and it lands on exactly the highest-
frequency words.

## 2. Extra senses were being thrown away

The dictionary was built "first writer wins", and the loser was **discarded**.
Which sense survived was decided by the order categories happen to sit in
`vocabulary.js`.

`rau` is the case that exposed it. It has **three** entries:

```
wear-verbs   (verb: to put on footwear — shoes, socks)   ← won, by position
misc          to, for
numbers       six
```

A learner tapping `rau` in *"muab rau kuv"* (give it **to** me) was told it means
putting on shoes. Not a wrong definition — a wrong sense, chosen by array index.

**Fix: keep every sense.** The first entry still wins for identity (`id`,
`category`, `example`) so the notebook keeps saving the same word, and the rest
are collected in `senses` and shown joined:

```
rau — (verb: to put on footwear — shoes, socks) · to, for · six
```

⚠️ **The join is deliberately neutral.** Category order is arbitrary, so it
presents alternatives rather than ranking them. Ranking would be a second
arbitrary order dressed up as knowledge.

## 3. Where a context-specific sense belongs

Showing three senses is honest but it is not the same as being *useful*. The
right answer for "in THIS story `rau` means to/for" already existed in the
design: **tier 1, the story's own glossary, which outranks everything.**

Two added, both marked as Claude's rather than the author's:

- **Ntxawm Lub Xauv** → `rau` — "to, for, into — *muab rau nws*, gave it to her"
- **Tus Miv** → `li` — "like, as if — *li nws tawm los*, as if it were coming out"
  (the dictionary has `li` as "belonging to", a real sense and the wrong one
  here; every use in that story is comparative)

⚠️ **This is the pattern for every future case.** A word whose general sense
misleads in one text gets a story glossary entry. **Never reorder the dictionary
to suit one story** — it has to stay true for every other text, and the next
story will want the opposite.

## The shape of both bugs

Neither was a translation error. Both were **ranking** errors: one ranked partial
above exact, the other ranked by array position and hid the rest.

> A dictionary that returns one answer has to be right about *which* answer, and
> "whichever we indexed first" is not a ranking — it is an accident that looks
> like a decision.

## 4. And then: a tap on half a compound finds the whole thing

Added the same day, once the ordering above made it safe.

Hmong is full of two-word compounds and a tap lands on ONE of the two. `kis`
means nothing alone — **"tag kis" means morning** — so a learner tapping `kis`
got "no entry for this word yet" while the dictionary sat there holding the
answer.

**Tier 4** indexes every word of every multi-word entry back to that entry:

```
kis  →  tag kis — tomorrow (also: morning)   (also in: nag kis, tag kis no)
tsi  →  dab tsi? — what?
tab  →  tab tom — (past continuous marker: currently)
```

⚠️ **THE ANSWER IS THE COMPOUND, AND IT SAYS SO.** `hmong` is set to the
compound, never to the tapped word, so the sheet reads "tag kis — morning" and
not "kis — morning". The learner has to see that what they pressed is half of
something; that distinction is the whole point of the feature.

### The three guards that make it safe

1. **Whole tokens, never substrings.** A substring match would have `ua` hitting
   "nkauj" and `si` hitting "sim" — the usual way this kind of fallback rots.
2. **Skipped for any word with its own exact entry.** This is what defuses the
   false positive I had been worried about: `li` has an entry, so tapping `li`
   never reaches tier 4 and can never be dragged into "li cas?". Only a word
   that nothing can define alone gets here — exactly the set this is for.
3. **Shortest compound wins.** `kis` sits in "tag kis", "nag kis" and "tag kis
   no"; the shortest is almost always the BASE the others are built from. The
   rest are named but not glossed — "(also in: …)" — which shows the word turns
   up elsewhere without turning one definition into a paragraph.

⚠️ **No `id` on a tier-4 hit**, deliberately: saving "kis" to the notebook would
save a fragment. The notebook already refuses entries without an id.

### It replaced the ten entries that came out this morning

`kis`, `tsi`, `tab`, `to`, `si`, `sis`, `maj`, `laim` were commented out of
the dictionary hours earlier for being fragments. **Tier 4 is what makes that
removal free**: the word still answers when tapped, but it answers with the
compound instead of pretending to be a word. Deleting the entry and adding this
tier were two halves of one fix.

## Still open
- **54 draft glosses** remain unreviewed — including some of the senses now being
  joined and shown.
