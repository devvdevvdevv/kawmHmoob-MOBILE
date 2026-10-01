# Sentence Builder — barebones, but real (2026-08-29)

`/words/sentences` was a placeholder that said "Not built" and listed the shape it
would take. It's now a working drill: read an English meaning, tap the shuffled
Hmong words back into order.

## No new content file

306 of the 523 words already carry an `exampleSentence` ({ hmong, english }),
written alongside the words themselves. The exercises are derived from those, so
the builder only ever asks about sentences the app has already taught — and it
grows on its own whenever a word gets an example.

`src/lib/sentenceBuilder.js`:

| Export | Does |
|---|---|
| `allSentenceExercises()` | every usable sentence, in data order |
| `buildSentenceSession(n)` | n random exercises, each with its chips pre-shuffled |
| `isSentenceCorrect(placed, ex)` | compares the built string to the answer |
| `tokenizeSentence`, `shuffle` | the two primitives above use |

**Window: 3–9 tokens.** Under 3 the sentence rebuilds itself; past 9 the tray wraps
into a wall of chips on a phone. That leaves **243 of the 306** — the distribution
is 58 two-word, 137 three-word, and a thin tail out to 22.

## Three things that would have been bugs

1. **Punctuation isn't a word.** Tokens are stripped of `.,!?;:` — nobody should
   have to place a comma to be told they got the word order right. The unstripped
   sentence comes back on the answer reveal.
2. **Chips are identity-based, not value-based.** Nine sentences repeat a token
   ("Nws siab dawb siab zoo."). With value keys, removing one `siab` would have
   removed both.
3. **The answer compares as a string, not chip-by-chip.** In that same sentence,
   swapping the two identical `siab` chips still reads correctly — marking it wrong
   would be a failure the learner cannot see. Verified: correct order accepted,
   reversed order rejected, identical chips swapped still accepted.

## The screen

`idle → active → done`, one session = 5 sentences drawn once (so the deck can't
reshuffle mid-round).

- Tray is dashed while empty so it reads as a slot; placed chips are clay, the bank
  is cream. Tap a placed chip to take it back.
- **Check** unlocks only when every chip is placed; **Clear** empties the tray.
- Feedback shows the full sentence with its punctuation either way — lime when
  correct, cream when not.
- Finish → centered card, score, confetti on a clean sweep, **Back to Words**, plus
  "Another 5" while quota remains.

## Quota

Wired exactly as the placeholder's own TODO specified: `useDailyQuota`
(`sentence-builder`, already in `quotaLimits.js` at guest 1 / free 3), consumed when
a **session** starts, `QuotaWall` when exhausted, `QuotaBadge` on the intro.

## Second pass: parts of speech + grammar hints

### Layout

Everything on the drill is centre-aligned — the sentence under construction is the
only thing that matters, and a centred tray reads as one line of language instead
of a left-justified list of controls. Chips are `text-xl` **bold** (was `text-base`
regular), 64pt minimum width. **Clear** is `variant="danger"` — filled, not a ghost;
it's a real action and it was disappearing into the page.

### Chips were clipping — why, and the fix

Reported as "sometimes they clip". Two causes, and a measurement that explains
both:

> The longest Hmong token in the whole exercise set is **7 characters**
> (`ntxhais`, `nplhaib`, `tiamsis`). The label "Classifier" is **10**. So the
> LABEL — not the word — sets the chip's width for **all 316 distinct tokens**.

1. **`tracking-wider` on the label.** React Native puts the trailing letter-space
   INSIDE the text box, so on Android the last letter of "CLASSIFIER" gets cut and
   the label sits visibly off-centre. Removed from the chips and the legend;
   uppercase + semibold does the same job without the cut.
2. **No width ceiling.** A chip sized by a label wider than the row could push past
   the edge instead of wrapping. Now `style={{ maxWidth: '100%' }}` — a static
   style OBJECT, never a style function (NativeWind drops those on native and the
   element renders invisible: see
   notes/2026-08-06-nativewind-drops-function-style-invisible-buttons).

Also `px-4` → `px-3` to fit more per row, and `justify-center` + `text-center` on
both lines so the word and its label centre on each other regardless of which one
is wider. Worst case is 9 chips in one exercise
("Cov Luav ntawd ntxuas ntxiv peb cov qoob loo!"), which wraps to three centred
rows on a phone.

### Tagging words — `src/lib/partsOfSpeech.js`

Chips carry a **Classifier / Noun / Adjective** label and a colour (ocean / cream /
blush). It's a lookup, not a parser: the vocabulary already sorts words into
categories, and some of those categories ARE a part of speech, so the tag is a fact
the data knows.

**The tagger refuses more than it guesses**, because a wrong label in a
structure drill teaches a wrong rule. Three ways a word ends up unlabelled — the
first two found by checking the data, not by guessing:

| Rejected | Why | Example |
|---|---|---|
| Function words | `kuv` is filed under `relatives` as "(pronoun: I, me)" — it would have tagged as a **noun** | `kuv`, `nws` |
| Homographs | `siab` is "tall" in `descriptions` AND "liver" in the anatomy list | `siab` |
| Multi-word entries | indexing "taub hau" would tag a bare `hau` as a noun | `hau` |

Coverage: **217 of 910 tokens (24%)** — 111 classifiers, 75 nouns, 31 adjectives.
It was 38% before the exclusions; the drop is the price of not lying.

### Two rules — `src/lib/grammarHints.js`

A hint fires only when **both**: the answer puts A before B, *and* the learner put
B before A. It's never "you used an adjective, here's the adjective rule" — it's
"you moved *this* adjective in front of *this* noun, which is the English order".
The answer is the ground truth, so a hint can't contradict the sentence.

| Rule | Fires when | Lesson |
|---|---|---|
| Classifiers come before the noun | noun placed before its classifier | `/learn/grammar/foundations-noun-classifiers` |
| Describing words come after the noun | adjective placed before its noun | `/learn/grammar/grammar-adjectives` |

Both lesson ids verified present in the `grammar` unit. The hint explains the rule
inline — "Hmong puts it LAST: *tsev dawb*, literally *house, white*" — with the
learner's own two words substituted in, then links out. One hint at a time: a wall
of grammar after a wrong answer is how people stop reading grammar.

The **(i)** pulses (`Animated.loop`, 650ms each way) because it appears mid-drill
under an answer the learner is already reading. Inline styles, not className —
NativeWind's interop is unreliable on animated nodes, same reason `StatusBadge`
does it.

### ⚠️ The adjective rule has almost nothing to fire on

Measured across all 243 exercises by simulating the exact English-order mistake:

| Rule | Sentences that can trigger it |
|---|---|
| classifier-before-noun | **47** |
| adjective-after-noun | **4** |

Adjectives are simply rare in the example sentences (31 tagged tokens in 910), and
relaxing adjacency to "any distance" only moved it from 3 to 5 candidates. The rule
is correct and will fire when it applies — but a learner could drill for a long time
without seeing it. Fixing that means **more adjective-bearing example sentences**,
not more code.

## Third pass: multi-word entries are ONE word

### The bug

Tokenizing on spaces is wrong for Hmong. `vim hais tias` ("because") is a single
conjunction the vocabulary lists as ONE entry, and the *siab* (liver) expressions —
`siab zoo` kind, `siab ntev` patient — are single adjectives. The builder was
handing out three chips reading "vim", "hais", "tias", which teaches the learner to
think of it as three words. That's the opposite of what the drill is for.

**This is the common case, not an edge case: 272 of the 523 entries are
multi-word.**

### The fix

`tokenizeSentence` is now phrase-aware. The phrase list IS the vocabulary — nothing
is hardcoded: every multi-word `hmongRPA` becomes a phrase, indexed by first word,
longest-first, and matched greedily against the sentence.

```
"Kuv tsis mus vim hais tias kuv nyuaj siab."
  before → Kuv · tsis · mus · vim · hais · tias · kuv · nyuaj · siab   (9 chips)
  after  → Kuv · tsis · mus · [vim hais tias] · kuv · [nyuaj siab]     (6 chips)
```

`partsOfSpeech` now indexes phrases whole, so `siab zoo` tags **adjective** and
`taub hau` tags **noun**. A bare `hau` still matches nothing, which stays correct —
it isn't a word on its own.

### One data entry added — please confirm the gloss

`nyuaj siab` had no entry, so it kept splitting. It wasn't invented: the phrase and
its meaning were already in this file, inside the `conjunctions` example sentence
*"Kuv tsis mus vim hais tias kuv nyuaj siab." / "I do not go because I am sad."*
Added to `personality-siab` as **"sad, troubled (lit. 'difficult liver')"**, tagged
`emotion`, marked in the file with a ⚠️ asking for confirmation. Note it runs the
other way from its neighbours: X + siab, not siab + X.

### Duplicate sentences, found on the way

13 sentences are attached to more than one entry — the male- and
female-perspective family lists share `Kuv leej txiv.` and a dozen like it — so a
five-question session could have drawn the same sentence twice. `allSentenceExercises`
now dedupes by sentence text; first entry to claim one keeps it.

### What it cost and what it bought

| | before | after |
|---|---|---|
| Exercises | 243 | **183** (phrases shorten sentences below the 3-chip floor; dedupe removes 8 more) |
| Multi-word chips | 0 | 68 (10% of all chips) |
| Tagged tokens | 24% | **28%** |
| classifier hint fires on | 47 | **52** |
| adjective hint fires on | 4 | **5** |

183 is still ample for 5-sentence sessions, and every remaining exercise is now
honest about where its word boundaries are.

## ⚠️ 217 of 524 words have no example sentence

Which is also 217 words that can never appear in this drill. Worst offenders:

| Missing | Category |
|---|---|
| 26 of 31 | Cov Txheeb Ze — Relatives & Extended Family |
| 12 of 12 | Months |
| 12 of 12 | Human Anatomy Internal Organs |
| 12 of 26 | Hmong Clothing Words |
| 11 of 11 | Human Anatomy Lower Body |
| 11 of 25 | Common Descriptions |
| 10 of 10 | Human Anatomy Upper Body |
| 9 of 24 | High-Frequency Conjunctions |
| 7 of 7 | Question Words |

Four categories have NO examples at all, so they contribute nothing to the builder.
Writing them is authoring Hmong, not engineering — it needs someone who speaks it.
**Common Descriptions is the highest-value gap**: it's the adjective source, and
filling it is what would finally give the adjective word-order rule something to
fire on.

## How it works, end to end

Follow ONE sentence all the way through. The word `animals-cat` in
`src/data/vocabulary.js` carries:

```js
{ id: 'animals-cat', hmongRPA: 'miv', english: 'cat',
  exampleSentence: { hmong: 'Tus miv noj nas.', english: 'The cat eats mice.' } }
```

**1. Collect** — `allSentenceExercises()` walks every category, every word, and
keeps the ones with an example inside the 3–9 token window:

```js
{ id: 'animals-cat',
  hmong: 'Tus miv noj nas.',        // kept whole, for the answer reveal
  english: 'The cat eats mice.',    // the prompt
  tokens: ['Tus', 'miv', 'noj', 'nas'],   // the '.' is gone
  word: 'miv', categoryTitle: 'Animals' }
```

**2. Deal a session** — `buildSentenceSession(5)` shuffles all 243, takes 5, and
turns each exercise's tokens into chips *with ids*, then shuffles those:

```js
chips: [ { id: 'animals-cat-2', text: 'noj' },
         { id: 'animals-cat-0', text: 'Tus' },
         { id: 'animals-cat-3', text: 'nas' },
         { id: 'animals-cat-1', text: 'miv' } ]
```

The id is `<exerciseId>-<originalIndex>`, so a chip always knows where it came
from even after shuffling.

**3. Play** — the screen holds ONE list: `placed`. The word bank is *derived*:

```js
const remaining = exercise.chips.filter((c) => !placed.some((p) => p.id === c.id))
```

That's the whole trick, and it's worth internalising: there is no second array to
keep in sync, so a chip can never be in both places or neither. Tapping a bank chip
appends to `placed`; tapping a placed chip filters it out; `Clear` sets `placed` to
`[]`. Nothing else moves.

**4. Check** — `isSentenceCorrect(placed, exercise)` joins what you built and
compares it to the answer, lowercased:

```
'Tus miv noj nas'  ===  'Tus miv noj nas'   → correct
```

**5. Advance** — `next()` clears `placed` and `result`, then either bumps `index`
or flips `phase` to `'done'`.

The whole screen is that five-step loop plus three phases: `idle` (intro + Start),
`active` (the loop), `done` (score card).

---

## Exercises

Predict first, then check. Answers at the bottom.

### 1. Follow the period
`'Tus miv noj nas.'` has a `.`; the chips don't.

- Which function removes it, and what regex does the work?
- The reveal after you answer shows the period again — where did it come back from?
- **Why not just leave it on the last chip?** Say what would go wrong for the
  learner.

### 2. Break the chip ids on purpose
Chips carry `{ id, text }`. Suppose they were just strings, and `unplace` filtered
by text instead of id.

1. Find a sentence in the app where that breaks. (Hint: `grep` won't do it — think
   about what property the sentence needs, then look at the note above.)
2. **Predict** exactly what a learner would see when they tap one of the twins.
3. Now try it: in `unplace`, change `c.id !== chip.id` to `c.text !== chip.text`,
   play until that sentence comes up, and watch.
4. Undo it.

### 3. Derived vs stored state
`remaining` is computed on every render instead of being kept in `useState`.

Convert it to state — `const [remaining, setRemaining] = useState(exercise.chips)` —
and make `place`/`unplace`/`Clear`/`next` all keep it correct. Count how many places
you have to touch, and how many chances you now have to get it wrong.

> This is the single most transferable idea in the file. State what you can't
> derive; derive everything else.

### 4. Where does "Sentence 3 of 5" come from?
`SESSION_LENGTH` is 5. Change it to 3 in `lib/sentenceBuilder.js`.

- Does the header change? Why does it read `session.length` and not the constant?
- What else in the screen would break if a session came back SHORTER than
  `SESSION_LENGTH` (say only 2 sentences existed)?

### 5. Widen the window
The token distribution across all 306 example sentences:

```
2:58   3:137   4:61   5:28   6:10   7:3   8:2   9:2   10:2   11:1   12:1   22:1
```

- With `MIN_TOKENS = 3, MAX_TOKENS = 9` we get 243. Verify that from the numbers.
- **Predict** the count for `MAX_TOKENS = 12`, then change it and confirm.
- Why is `MIN_TOKENS = 2` a bad idea even though it would add 58 exercises?

### 6. Spend the quota
As a guest the limit is 1 session per day (`quotaLimits.js`).

- **Predict**: you start a session, then the quota is exhausted. Do you get kicked
  out mid-sentence? Find the line that decides.
- Where exactly is the session spent — on opening the page, on Start, or per
  sentence? Which is right, and why?

### 7. Build something
Add a **Skip** button next to Check that reveals the answer and counts it wrong.
Constraints: the sentence must not be re-drawn later in the same session, and the
score line must stay truthful.

### 8. Stretch
Only draw sentences whose source word you've actually studied (`vocabProgress`).
Then answer the hard part: what should the screen do when a learner has studied
fewer than 5 such words?

### 9. Re-create the clipping bug
Put `tracking-wider` back on the chip label in `Chip`.

- **Predict first**: which is wider on a labelled chip — the Hmong word or the
  word "Classifier"? Check your answer against the measurement above.
- Where does the letter-space actually go, and why does that cut a glyph rather
  than just adding a gap?
- Why does `style={{ maxWidth: '100%' }}` have to be an object here, and what
  happens if you write it as `style={() => ({ maxWidth: '100%' })}`?

---

## Answer key

**1.** `stripPunctuation()` inside `tokenizeSentence()`, with
`/^[¿¡"'([]+|[.,!?;:"')\]]+$/g`. The reveal prints `exercise.hmong`, the original
string, which was never modified. Leaving the period on `nas.` would mean the
learner has to notice which word ends the sentence *before* they build it — that's
a punctuation puzzle, not a word-order exercise, and it also leaks the answer.

**2.** `'Nws siab dawb siab zoo.'` — the sentence needs a **repeated token**; nine
do. Filtering by text would remove BOTH `siab` chips when you tap one, and the tray
would go from 5 chips to 3 in a single tap with no explanation.

**3.** Four places (`place`, `unplace`, `Clear`, and the reset in `next`), plus the
initial value when the exercise changes — five chances for the bank and the tray to
disagree. Derived: zero.

**4.** The header reads `session.length`, so it stays honest if the session is
shorter than requested — `buildSentenceSession` uses `.slice(0, count)`, which
returns fewer when fewer exist. Anything comparing against `SESSION_LENGTH` instead
would announce "Sentence 3 of 5" for a 2-sentence session.

**5.** 137+61+28+10+3+2+2 = **243** ✓. `MAX_TOKENS = 12` adds 10:2, 11:1, 12:1 =
**247**. Two-token sentences are a coin flip — "Kuv noj" has exactly two possible
orders, so it tests nothing.

**6.** `if (quota.exhausted && phase !== 'active')` — the `phase !== 'active'` half
is what protects a session in progress; you finish what you started. It's spent in
`start()`, on the Start press: spending on page *open* would burn a session for
someone who just looked, and spending *per sentence* would make the limit
5× stricter than the number in `quotaLimits.js` claims.

**7.** Skip = set `result` to `'incorrect'` without touching `score`. Re-drawing
isn't a risk: the session is dealt ONCE in `start()` and never refilled, so a
skipped sentence can't come back. The score line already reads "N of session.length
built correctly", which stays true with no change.

**8.** Filter `allSentenceExercises()` by `vocabProgress[ex.id]`. With fewer than 5
studied, the honest options are a shorter session (`buildSentenceSession` already
handles it via `slice`) or an empty state pointing at Vocabulary — NOT topping up
with unstudied sentences, which would quietly break the promise the filter makes.

**9.** "Classifier" (10 chars) is wider than every token in the set (longest is 7),
so the label sets the width of every labelled chip. `letterSpacing` in React Native
is applied AFTER the last character too, and that trailing space counts inside the
text's measured box — Android then clips the glyph rather than growing the box, so
you lose the final `R`. The `maxWidth` must be a plain object because NativeWind
IGNORES a `style` FUNCTION when `className` is also present: the function's styles
are silently dropped, which is the same failure that once made every Button in the
app transparent.

## Deliberately not in v1

- **No XP or progress writes.** Nothing is recorded except the quota. A score lives
  and dies with the session.
- **No audio** on the sentence.
- **No part-of-speech labelling.** The old placeholder sketched "classifier → noun →
  verb" tagging; the grammar lessons it linked to still exist, and that's the
  obvious next step if this earns it.
- Sentences aren't filtered by what you've studied — any of the 243 can come up.
