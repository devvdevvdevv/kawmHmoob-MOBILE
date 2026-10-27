# Learning: how the Paths work (units, lessons, steps, unlocking, access)

The Paths are the course: **41 units in a fixed order**, each one a lesson to read plus
five drills. Finish a unit and the next opens. **Units 1–7 are free**, the rest are Pro.

⚠️ **REWRITTEN 2026-10-16.** The first version of this guide (2026-09-22) described a
10-unit path with the first two free and no lesson wiring at all. Every number in it was
wrong within three weeks. If you find a copy of those claims anywhere else, they are
stale; this file is the one kept current.

Read this before a path rewrite. The last section is the part that matters most: **which
fields you can change freely and which ones silently destroy learner progress.**

Files:

| file | what it holds |
|---|---|
| `src/data/path.js` | **the course** — the 41 units and the readiness rules |
| `src/lib/pathProgress.js` | where one learner stands in it |
| `src/lib/pathIntro.js` | the unit → Learn lesson bridge |
| `app/path/index.jsx`, `app/path/[unitId]/` | the screens |
| `scripts/check-path.mjs` | the checker that catches the invisible mistakes |

---

## 1. One unit, field by field

```js
{
  id: 'u-colors',                  // ⚠️ PROGRESS KEY — never rename (§8)
  title: 'Colors',                 // free to change
  hmongTitle: 'Cov Kob',           // free; shown under the title
  order: 40,                       // teaching order (§7)
  categories: ['colors'],          // which vocabulary sets feed it
  free: true,                      // outside the paywall
  limit: UNIT_WORD_CAP,            // 20 — or use `words: [...]` instead
  learnUnit: 'grammar',            // which Learn chapter its lesson lives in
  introLesson: 'grammar-colors',   // the lesson shown above step 1
  blurb: 'Liab, dub, dawb — naming the colors.',
  why: '...',                      // why it sits HERE — the argument that gets lost first
}
```

`why` is not decoration. It is the only record of the ordering argument, and the ordering
is what a rewrite changes. Write it as if to the person who will want to move the unit.

### The words a unit teaches

`unitWords(unit)` resolves them, three ways, in this precedence:

1. **`words: ['colors-red', …]`** — hand-picked, and looked up **against the unit's own
   categories only**. An id from outside them is silently dropped, which is what
   `check-path.mjs` exists to catch.
2. **`limit: UNIT_WORD_CAP`** — the first 20 **in data order**. Quick, and data order is
   not teaching order. A hand-picked list is the real answer.
3. **Neither** — every word in the categories.

⚠️ **CAP: 20 WORDS, AT MOST 3 CATEGORIES** (the playbook). A 38-word "lesson" is not one.

⚠️ **NEVER make the word list depend on content that is still being written.** The
temptation is "the 20 words that have example sentences". Write one more sentence and the
list changes under the learner: "18 of 20 done" becomes "18 of 23", and a word they
finished drops out of the unit that taught it. **Anything progress is measured against
must not move.**

---

## 2. A unit is not a category

A category is a bucket of words in `vocabulary.js`. A unit is a **lesson built from one or
more buckets**. Greetings draws on three; Colors on one. The two ideas are deliberately
separate, so a set can be reorganised without touching the course and vice versa.

### `path.js` holds the RECIPE. `vocabulary.js` holds the CONTENT

There are **no words in `path.js`**. A unit names the buckets it wants and nothing more:

```js
// src/data/path.js — the recipe
{
  id: 'u-colors',
  title: 'Colors',
  categories: ['colors'],     // ← a POINTER, not content
  limit: UNIT_WORD_CAP,
}
```

```js
// src/data/vocabulary.js — the content
{
  id: 'colors',               // ← what the pointer matches
  title: 'Colors',
  words: [
    { id: 'colors-red', hmongRPA: 'liab', english: 'red', … },
    … 15 of them
  ],
}
```

`unitWords()` is the one line that joins them:

```js
const pool = unit.categories.flatMap((id) => getCategory(id)?.words || [])
```

**Why split at all:** one category can feed several units, and one unit can draw on up to
three categories. More importantly, the flashcards, the Words tab, the quizzes, the reader
and the path all read the SAME entries — fix `liab` once and it is fixed everywhere.

⚠️ **SO A PATH REWRITE EDITS RECIPES, NOT WORDS.** Which categories, which order, what is
free, which lesson. You touch `vocabulary.js` only when a *word* is wrong — and a typo in
a category id does not error, it just produces a shorter unit (which is what the checker
is for).

### The whole chain, from a tap to a rendered unit

Worth having in one place, because five files are involved and only a **string** crosses
between them:

```
PathList.jsx          <Link href={`/path/${unit.id}`}>        → /path/u-colors
   ↓
expo-router           /path/u-colors matches app/path/[unitId]/index.jsx
                      and CAPTURES the text: unitId = "u-colors"
   ↓
the screen            const { unitId } = useLocalSearchParams()    // "u-colors"
   ↓
path.js               getUnit('u-colors')        → the unit object
   ↓
path.js               unit.categories            → ['colors']
   ↓
vocabulary.js         getCategory('colors').words → the 15 words
   ↓
render                unit.title, the five steps, the words
```

⚠️ **THE OBJECT IS NEVER PASSED BETWEEN SCREENS — only its id, in the URL.** Every path
screen does `params → getUnit → object`. Two consequences worth knowing:

- **A unit id must be stable**, because it is in URLs as well as in progress keys (§8).
- **Anyone can type a URL**, so `getUnit` can return `null`. That is why these screens
  open with a redirect guard rather than trusting the param.

⚠️ `[unitId]` in a FILENAME is the router's blank to fill, and the name inside the
brackets is the key you destructure. `[comp]` would give you `params.comp`. One file
serves all 41 units.

---

## 3. The lesson: `introLesson`

Each unit names one Learn lesson, shown above the first step so the learner reads what the
words are before drilling them. `src/lib/pathIntro.js` resolves it and ⚠️ **returns null
for every miss rather than throwing** — no `introLesson`, an id matching no lesson, a
lesson with no intro step. The unit then simply starts at Flashcards.

**Right now: 41 of 41 units have a lesson, and 7 of those lessons are placeholders.**

⚠️ **AN `introLesson` IS A HAND-PICKED ID, NOT DERIVED.** A lesson's `vocab` field matches
only some of a unit's categories, so derivation would pick the wrong one (or one of three
for Greetings).

⚠️ **TWO PAIRS OF UNITS SHARE A LESSON TODAY**, and that is a real decision each time:

- 6 Core Verbs and 7 Verb + Noun → both `foundations-action-verbs`
- 20 How Describing Works and 21 Common Describing Words → both `grammar-adjectives`

Sharing is legitimate (one explanation, two drill sets) but it means the lesson cannot
speak to either unit specifically. `pathReturnUnit()` in the lesson screen handles the
other half: a lesson opened from a path unit returns there, **but only when that unit's
`introLesson` really is this lesson**, so a shared lesson never sends a learner back to
the wrong unit.

### Placeholder lessons

`placeholder: true` on the lesson object shows an orange "✎ Placeholder" pill — **to
admins only**. Build one only from settled rules and reviewed sentences. To promote it:
write the real content and delete the flag. ⚠️ **Keep the id.** The id is a progress key,
and `placeholder-family` is a perfectly good id for a finished lesson.

---

## 4. The five steps

`STEPS` in `pathProgress.js`, in order: **Flashcards · Quiz · Tones · Sentences ·
Reading**. Each reuses a screen the app already had:

| step | screen | done when |
|---|---|---|
| Flashcards | `/path/<unit>/flashcards` | every unit word has a `vocabProgress` status |
| Quiz | `/quiz/path-<unit>` | best score ≥ `PASS_MARK` (70) |
| Tones | `/words/typing?unit=<unit>` | a session finished |
| Sentences | `/words/sentences/path-<unit>` | a session finished |
| Reading | `/path/<unit>/reading` | read to the end |

**Tones is the typing drill, not recording** — it grades the tone off the spelling, so it
works with no audio at all.

⚠️ **A STEP WITH NO CONTENT IS SKIPPED, NOT BLOCKING.** `stepAvailability(unit)` checks
each one has enough material (quiz ≥4 words, the others ≥3 items). A step that comes back
false shows "not ready yet" and is not required: **a unit with four working steps is a
unit; a unit with a dead step is a bug report.**

⚠️ `stepAvailability` is **cached per unit**, because it tokenises every sentence in the
app and `unitStatus` asks for every unit's completion. Safe only because the content is
bundled and cannot change while the app runs. `stepsDone` is never cached.

---

## 5. Completion and unlocking are DERIVED

Nothing about "where the learner is" is stored. `stepsDone(unit, progress)` reads records
the app already keeps:

```
vocabProgress   → flashcards        (written by Flashcard.jsx)
quizScores      → quiz              (written by QuizEngine)
completedSteps  → tone, sentences, reading
```

Then: `isUnitComplete` → `completedUnitIds` → `unitStatus`, recomputed every call.

**What that buys:** words studied in the Vocabulary tab count toward the flashcard step —
nobody wrote that feature, it falls out of reading `vocabProgress`. And no "unit complete"
flag can disagree with reality.

**What it costs:** change a rule and it applies to everyone's past work. Raise `PASS_MARK`
to 80 and yesterday's 75% unit becomes incomplete.

### Unlocking is positional

```js
const live = livePath()
const i = live.findIndex((u) => u.id === unitId)
if (i < 0) return false        // not ready → not in the course
if (i === 0) return true       // the first live unit is always open
return completedUnitIds.includes(live[i - 1].id)
```

A door opens when the door before it is finished. Nothing counted, nothing spent. **Insert
a unit mid-course later and nobody is reset** — they just see one open unit they have not
done.

### `unitStatus`: the order of the checks is the product decision

```js
if (isUnitComplete(...))   return 'complete'
if (!isUnitUnlocked(...))  return 'locked'    // ⚠️ BEFORE pro
if (!unit.free && !hasPro) return 'pro'
return 'available'
```

⚠️ **'locked' beats 'pro'** — a free learner sees unit 9 as locked-by-progress until they
finish unit 8, and only then as Pro. You don't show a price on a unit they cannot reach.

### The reward is recorded once, and only as a reward

Finishing a unit calls `markLessonComplete('path:<unit>')` — +10 XP, a streak tick,
idempotent. ⚠️ **Nothing reads it back to decide what is unlocked**, so a missed or
doubled reward can never lock or open anything. Steps add +2 XP each through
`markStepComplete`.

---

## 6. Readiness: which units the content can carry

`unitReadiness(unit)` counts words with an example (`hasExample`), and `livePath()`
returns only the units that pass. **The rest of the app only ever looks at `livePath()`.**

⚠️ **A PHRASE IS ITS OWN EXAMPLE SENTENCE** (author's ruling, 2026-09-21). `isPhraseEntry`
+ `hasExample` live in `path.js` and the sentence export **imports them** — that rule used
to exist in two places, and the copy here was never told, so Greetings could not go live
and the free course would have started behind the paywall.

⚠️ `AUDIO_COUNTS_TOWARD_READY = false` — audio is tracked but does not gate a unit.
Flipping it to `true` would take most of the course offline, since 211 of 2,056 words have
a clip.

**All 41 units are live today.**

---

## 7. Access, money and limits

- **`free: true` → units 1–7.** Enforced in `unitStatus` and, for a quiz opened by URL,
  by `PaywallGate` via the quiz config's `tier`.
- The word sets behind free units go in **`FREE_CATEGORY_IDS`** (`src/lib/vocabAccess.js`);
  a set that should appear only in the path goes in **`PATH_ONLY_CATEGORIES`**.
- **Daily allowance:** path screens skip it **for free units only** —
  `enabled: !isPro && !pathUnit?.free`. ⚠️ If the guard were just `!pathUnit`, a free
  learner could open `/words/typing?unit=u-food` by URL for unlimited practice on a Pro
  unit.

---

## 8. ⚠️ Rewriting the path: what is safe and what is not

**Free to change, no consequences:** `title`, `hmongTitle`, `blurb`, `why`, `order`,
`categories`, `words`, `limit`, `free`, `learnUnit`, `introLesson`.

**Never change:**

| thing | why |
|---|---|
| a unit `id` | progress keys: `path:<id>`, `path:<id>:tone`, the quiz id `path-<id>`, the sentence group `path-<id>`. Rename one and every learner's work on that unit detaches, silently |
| a lesson `id` or step id | same — including ids that read oddly (`foundations-pronouns` lives in the Grammar unit, `placeholder-family` may be a finished lesson) |
| a word `id` | the flashcard/vocabProgress key |

**Reordering** is the tedious part. The playbook's pattern: insert, shift every later
`order` by one, leave a `// was N` comment on each. Positional unlocking means a learner
mid-course is never reset by an insertion.

**Before you start:** save `node scripts/check-path.mjs` output. Diffing it afterwards is
how you catch a unit that quietly lost its words — a typo'd category id produces a
*shorter* unit, not an error.

The checker catches: duplicate unit ids, a word listed in two units (double-counted
progress), a `limit` above the cap, a `words` id outside the unit's own categories, and a
0-word unit. ⚠️ It does **not** yet check that every `introLesson` exists and is imported
in `lessons.js` — that check exists only as a script written by hand in
`notes/2026-10-15-colors-lesson-and-the-bad-scan.md`, and belongs here.

---

## Rebuild-it checklist

1. Separate *what the course is* (data) from *where the learner is* (logic). Keep both React-free so Node scripts can read them.
2. Unit ≠ category. Word lists are deterministic: all, first-N, or hand-picked — never "whichever have content today".
3. `livePath()` is the only list the rest of the app sees.
4. A rule two places need is one exported function, imported.
5. Step completion comes from records that already exist. Never store "unit complete".
6. Unlocking is positional over the live path.
7. The order of the status checks is the product decision. 'locked' beats 'pro'.
8. The reward is idempotent and gates nothing.
9. Reuse screens with a scoping param (`path-<unit>`, `?unit=`): scope, mark done, way back.
10. Exemptions (the daily allowance) apply to *free* content only — test by typing URLs.
11. Missing content means a skipped step, not a blocked unit.
12. Cache only what is constant for the life of the run.
13. Ids are forever. Everything else is editable.

---

# Exercises

**1. Read the baseline.** Run `node scripts/check-path.mjs` and save the output. Which
units are at the 20-word cap, and which use `limit` rather than a hand-picked `words`
list? Those are the units whose contents are decided by data order — i.e. by accident.

**2. Move a unit.** ✍️ Put Classifiers at position 3 by hand: shift every later `order`,
leave `// was N` on each. Then say what a learner who had finished units 1–5 sees. Check
it against `isUnitUnlocked`. (When it hurts enough, write the script.)

**3. Find the shared lessons.** Two pairs of units share one `introLesson` (§3). Open one
pair and decide: does one explanation serve both units, or does the second unit deserve
its own? Then check what `pathReturnUnit()` does when a learner opens that lesson from the
second unit.

**4. Promote a placeholder.** ✍️ Seven units have one. Pick the unit you know best, write
the real lesson, delete `placeholder: true` — **keeping the id**. Then explain why keeping
it matters even though it says "placeholder".

**5. Break a word list on purpose.** Add a word id from another category to a unit's
`words` list. What does the unit screen show? What does the checker say? Which of the two
would you have noticed in a month?

**6. Raise the pass mark.** Change `PASS_MARK` to 80 and open a unit you passed at 75%.
What happened, and why can a derived model not avoid it? Then decide what you would do for
real learners — and write that decision down somewhere.

**7. Add the missing check.** ✍️ Move the "every unit's `introLesson` exists and is
imported" scan into `check-path.mjs`. ⚠️ Two traps are already documented: `placeholders.js`
holds six lessons in one file, and `time.js` has a trailing comment after its `id:`. Your
version must catch both.
