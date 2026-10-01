# Learning: how the Beginner Path works (units, derived progress, unlocking)

The Beginner Path is the course: 10 units in a fixed order, each one a 5-step
mini-lesson (flashcards → quiz → tones → sentences → reading). Finish a unit
and the next one opens. The first two units are free.

It looks like a big feature. It is mostly **two small files of plain functions**
plus a few screens, and most of those screens already existed. This doc walks
through how it fits together so you could rebuild it, then gives you exercises
to do yourself.

The build record (what changed and why) is `notes/2026-09-22-path-spine.md`.
This doc is the "how does it work and how would I build one" version.

---

## 0. Start here: one learner, one unit

Here is what happens when someone does Greetings, in plain words:

1. They open Home. The **Continue** card says "Greetings → Flashcards".
2. They flip through the flashcards and mark each word. Each mark writes to
   `vocabProgress`, the same record the Vocabulary tab uses.
3. They take the quiz and score 80%. `QuizEngine` records the score like it
   does for any quiz.
4. They do a typing-drill session and a sentence-builder session, then read the
   mini-reading. Each one writes a step id like `path:u-greetings:tone`.
5. They go back to the unit screen. It **works out** that all 5 steps are done,
   shows the reward banner, and gives +10 XP once.
6. On `/path`, You & Me is now open. **No "unlocked" flag was saved anywhere.**
   The app simply sees that Greetings is complete, so the next unit opens.

Remember point 6. It is the whole design.

---

## 1. Two files, two questions

| file | question it answers | knows about the learner? |
|---|---|---|
| `src/data/path.js` | **What is the course?** Units, their order, their words, which are ready | ❌ no |
| `src/lib/pathProgress.js` | **Where is this learner in it?** Steps done, unit status, what's next | ✅ yes: takes `progress` as an argument |

Everything else (the screens, the Continue card) just calls these functions.

Why split them? `path.js` is **content**. You edit it when you change the
course. `pathProgress.js` is **logic**. You edit it when you change the rules.
When those two live in one file, every content edit risks breaking the rules.

Both are plain `.js` with no React in them. That's deliberate: a Node script
(`scripts/check-path.mjs`) can import them and test the course without a phone.
It's also why `unitStatus` takes `hasPro` as a plain `true`/`false` instead of
importing `canAccess` from `SubscriptionContext.jsx`. Node can't import a
`.jsx` file, so doing that broke the scripts (the note has the story).

---

## 2. A unit is NOT a category

A category is a bucket of words in `vocabulary.js`. A unit is **a lesson built
from one or more buckets**:

```js
{
  id: 'u-greetings',            // ⚠️ progress is keyed off this, never rename it
  title: 'Greetings',
  order: 1,
  categories: ['greetings', 'politeness', 'introductions'],   // 3 buckets → 1 unit
  free: true,
  blurb: 'Nyob zoo, ua tsaug — your first real exchange.',
  why: 'First conversation. Free, so it sets the tone for the whole app.',
}
```

`unitWords(unit)` turns that into the actual word list:

```js
const pool = unit.categories.flatMap((id) => getCategory(id)?.words || [])
if (unit.words) return unit.words.map((id) => byId.get(id)).filter(Boolean)   // hand-picked
return typeof unit.limit === 'number' ? pool.slice(0, unit.limit) : pool      // capped
```

There are three ways to decide a unit's words:
- **All of them.** Greetings uses every word in its three categories.
- **The first N** with `limit: UNIT_WORD_CAP` (20). This is quick, but it takes
  the first 20 *in the order they sit in the data file*. That order is not a
  teaching order.
- **Hand-picked** with `words: [...]`. Core Verbs does this. It's the best
  option, and it's more work.

⚠️ **Why not "the 20 words that have sentences"?** Because when a new sentence
got written, the list would change under the learner. "18 of 20 done" could
quietly become "18 of 23", and a word they already finished could drop out of
the unit. **Anything a learner's progress is measured against must not move.**

---

## 3. Readiness: a unit only appears when its content can carry it

`unitReadiness(unit)` checks whether every word has an example to read.
`livePath()` returns only the units that pass. **The rest of the app only ever
looks at `livePath()`.** A unit that isn't ready doesn't show as broken. It
just isn't in the course yet.

Right now 9 of 10 units are live. Food & Drinks is one sentence short.

### The phrase rule, and why it lives in ONE place

"koj lub npe hu li cas?" is already a sentence. It doesn't need an example
sentence of its own, because it *is* one. So:

```js
export function isPhraseEntry(word) { ... }   // greetings/politeness/intros/daily-life, or ends in "?"
export function hasExample(word) {
  return Boolean(word?.exampleSentence?.hmong) || isPhraseEntry(word)
}
```

This rule used to exist in **two** places: the sentence-export script and
`path.js`. The export was told "phrases don't need sentences", but `path.js`
wasn't. So Greetings and You & Me could **never** go live, and the first unit a
learner saw would have been Numbers, which is behind the paywall. Nothing in
the course would have been free.

The fix was one function that both of them import. **When two places must
agree, make it one place.** Copies drift apart. An import can't.

---

## 4. Derive, don't store (the heart of it)

This is the notebook guide's `savedWordCount` rule, used on a bigger scale.

`stepsDone(unit, progress)` answers "which of the 5 steps has this learner
done?" **only from records the app already had**:

| step | "done" means | record read |
|---|---|---|
| flashcards | every unit word has *any* status | `vocabProgress` (written by `Flashcard`) |
| quiz | best score on `path-<unit>` ≥ `PASS_MARK` (70) | `quizScores` (written by `QuizEngine`) |
| tone | `path:<unit>:tone` is in the list | `completedSteps` |
| sentences | `path:<unit>:sentences` is in the list | `completedSteps` |
| reading | `path:<unit>:reading` is in the list | `completedSteps` |

Then everything is built on top of that, like stacked blocks:

```
stepsDone ─┐
           ├─► isUnitComplete ─► completedUnitIds ─► unitStatus ─► continueTarget
stepAvailability ┘                                   (+ isUnitUnlocked from path.js)
```

Nothing along that chain is saved. Each function is recomputed from scratch
every time it's called.

**What you get for free:**
- Words studied in the **Vocabulary tab** count toward the flashcard step.
  Nobody wrote code for that. It falls out of reading `vocabProgress`.
- There's no "unit complete" flag that can drift out of sync with reality. For
  it to be wrong, the underlying records would have to be wrong.
- Signing in on a new phone restores the path, because Supabase already syncs
  those three records.

**The trade-off (see exercise 6):** when you change a rule, it applies to
everyone's *past* work too, not just new work.

---

## 5. Unlocking is positional

```js
export function isUnitUnlocked(unitId, completedUnitIds = []) {
  const live = livePath()
  const i = live.findIndex((u) => u.id === unitId)
  if (i < 0) return false        // not live → not in the course
  if (i === 0) return true       // the first unit is always open
  return completedUnitIds.includes(live[i - 1].id)   // open if the one before is done
}
```

Picture a row of doors: **a door opens when the door before it is finished.**
Nothing gets counted, spent or stored.

Why it works this way: if you add a unit in the middle later, a learner who
already went past it just sees one open unit they haven't done. Their progress
isn't reset.

### `unitStatus`: which wall does the learner hit first?

```js
if (isUnitComplete(...))            return 'complete'
if (!isUnitUnlocked(...))           return 'locked'   // ← checked BEFORE pro
if (!unit.free && !hasPro)          return 'pro'
return 'available'
```

**The order of the `if`s is the product decision.** 'locked' comes before
'pro', so a free learner doesn't see a price tag on unit 3 until they've
finished unit 2. You don't ask for money before the free units have made their
case.

`hasPro` is `useSubscription().isPro`. While `MONETIZATION_ENABLED` is off,
that's already `true` for everyone, so the path follows the app's one paywall
switch without needing its own.

---

## 6. The reward is recorded once, and only as a reward

When the unit screen sees the unit is complete, it pays out:

```js
useEffect(() => {
  if (unit && complete && !rewarded) markLessonComplete(unitLessonId(unit.id))
}, [unit, complete, rewarded, markLessonComplete])
```

- `markLessonComplete` is **idempotent**: it does nothing if the id is already
  in `completedLessons`. So re-renders, revisits and a second phone can't pay
  twice.
- **Nothing reads `completedLessons` back to decide unlocking.** If the reward
  somehow failed to save, the next unit would *still* open, because unlocking
  comes from §4, not from this.

Rule: **a record that grants something should never also be the thing that
gates something.** Keep "you earned XP" and "you may enter" separate.

---

## 7. Reuse screens with a scoping id

Three of the five steps are screens the app already had. Each one learned to
say "only this unit's words, please":

| step | URL | how the screen knows |
|---|---|---|
| quiz | `/quiz/path-u-greetings` | `getQuizConfig` sees the `path-` prefix and builds a config on demand |
| tones | `/words/typing?unit=u-greetings` | reads the `unit` search param |
| sentences | `/words/sentences/path-u-greetings` | `exercisesInGroup` sees the `path-` prefix |

Each reused screen got the **same three small changes**, and that's the
pattern to copy:

1. **Scope.** Build the session from `unitWords(unit)` instead of everything.
   (`typingExercisesFor(ids)` came from pulling the old loop out into
   `buildExercises(entries)`. It was checked to produce exactly the same 919
   exercises as before, so nothing outside the path changed.)
2. **Mark done.** When the session ends, call
   `markStepComplete('path:<unit>:tone')`.
3. **Way back.** The breadcrumbs and the "Back to…" button point at the unit
   when there is one.

Only flashcards and reading got **new** screens. Flashcards got one because the
category deck at `/vocabulary/<id>` uses up the daily allowance (3 a day, and
Greetings alone is 3 categories) and shows the whole category, not the unit's
slice. Reading got one because nothing like it existed.

⚠️ Path quizzes are **not** added to the public `quizzes` list. That list feeds
the Vocabulary page's counts, and 10 fake "quizzes" would show up there.

---

## 8. Money: paywall and daily allowance

Two different limits, two different rules:

- **Paywall (Pro units).** `unitStatus` → `'pro'` covers the path screens. For
  a quiz opened directly by URL, the quiz config carries
  `tier: unit.free ? 'free' : 'pro'`, and `PaywallGate` (already wrapped around
  every quiz) enforces it.
- **Daily allowance.** Path screens skip it, **but only for free units**:
  ```js
  useDailyQuota('typing', LIMIT, { enabled: !isPro && !pathUnit?.free })
  ```
  If the guard were just `!pathUnit`, a free learner could type
  `/words/typing?unit=u-verbs` and get unlimited free practice on a Pro unit.
  Always ask: **"what if someone opens this URL directly?"**

---

## 9. Two small but important details

**A step with no content is skipped, not blocking.** `stepAvailability(unit)`
checks whether each step has enough material (the quiz needs ≥4 words, the
others ≥3 items). Steps that come back `false` show "not ready yet" and aren't
required. Daily Life completes on 4 steps. A step that can never be finished
would be a bug report. A skipped step turns on by itself once the content is
written.

**Caching.** `stepAvailability` tokenises every sentence in the app. On the
`/path` screen, `unitStatus` → `completedUnitIds` → `isUnitComplete` →
`stepAvailability` gets called about 100 times per render. The content is
bundled, so it can't change while the app is running. That makes it safe to
cache per unit in a `Map`: 24 ms the first time, 0.8 ms after that.

The rule: **cache only what can't change during the run.** `stepsDone` changes
every time the learner does something, so it isn't cached.

---

## 10. Gotchas that actually happened

- **Overwriting a file you didn't know existed.** `path.js` already existed
  (18 KB) and got overwritten. The archive snapshot saved it. **Check that a
  path exists before creating a file there.**
- **Two copies of one rule** → the free units could never go live (§3).
- **Importing `.jsx` from a plain `.js` file** → the Node check scripts broke (§1).
- **NativeWind:** classes have to be literal strings. `` `bg-${color}` `` is
  never compiled. The pip colours on `/path` are written out in full for this
  reason.
- **A Pressable with a function `style`** is invisible on native. Use a static
  style or `className` plus `active:`.

---

## How you'd build it from scratch (the order)

1. **Data first.** Write the units array and `unitWords`. Before any screen,
   print each unit's words with a Node script and read them.
2. **A checker.** A script that fails if a unit id is duplicated, a listed word
   isn't in the unit's categories, or a unit has 0 words.
3. **Readiness + `livePath`.** Decide what "ready" means. Share any rule that
   another script also uses.
4. **`stepsDone` from existing records.** Write down, for each step, which
   record already proves it. Invent a new record only when nothing fits.
5. **`isUnitComplete` → `completedUnitIds` → `isUnitUnlocked` → `unitStatus`.**
   Test all of them in Node with fake `progress` objects before writing any UI.
6. **Screens last:** the list, the unit screen, then the three scoping changes
   to each reused screen.
7. **The reward.** An idempotent call in an effect.
8. **Money.** Paywall on content and allowance rules. Test by typing URLs by hand.

---

## Rebuild-it checklist

1. Separate *what the course is* (data) from *where the learner is* (logic). Keep both React-free.
2. Unit ≠ category. Word lists are deterministic: all, first-N, or hand-picked. Never "whichever have content today".
3. `livePath()` is the only list the rest of the app sees.
4. Rules used by two places are one exported function.
5. Step completion comes from records that already exist. Never store "unit complete".
6. Unlocking is positional over the live path.
7. The order of the status checks is the product decision. 'locked' beats 'pro'.
8. The reward is idempotent and never gates anything.
9. Reuse screens with a scoping id: scope, mark done, way back.
10. Exemptions (like the quota) apply to *free* content only. Check what a hand-typed URL can reach.
11. Missing content means the step is skipped, not blocking.
12. Cache only what's constant for the life of the run.

---

# Exercises

These are yours to do: **you write it, I don't.** Run the app with `npx expo start`
and keep a terminal open for `node scripts/check-path.mjs`. Predict the outcome
*before* you run each one. The prediction is the exercise.

**1. Prove the derivation (no code).**
Fresh guest. In the **Vocabulary tab**, not the path, mark every Greetings
word. Now open `/path/u-greetings`. Is Flashcards ticked? Find the exact line
in `pathProgress.js` that made that happen. Nobody wrote a feature for it, so
explain why it works anyway.

**2. Four out of five.**
Finish every Greetings step except Reading. What does `/path` show for
Greetings, and for You & Me? Which function gives You & Me its state? Follow
the call chain from §4 by hand.

**3. Swap the walls.**
In `unitStatus`, move the `'pro'` check above the `'locked'` check. Turn on
`MONETIZATION_ENABLED` locally and look at `/path` as a free learner. What do
they see on units 3–10 now? Write two sentences on why the original order is
the better product. Then put it back.

**4. Make Food & Drinks go live.** ✍️
Run `node scripts/check-path.mjs` and find which word is blocking it. Write
that one example sentence in `vocabulary.js` (real Hmong, your call). Re-run
the checker, then check `/path`. You shouldn't have touched any path code at
all, so why didn't you need to?

**5. Hand-pick Food's words.** ✍️
`u-food` uses `limit: UNIT_WORD_CAP`, so it gets the first 20 in data order.
Replace it with a `words: [...]` list of the 20 food words a beginner actually
needs first (Core Verbs is your model). Then add an id that's in *no* food
category on purpose. What does `unitWords` do with it, and does the checker
catch it? It should. If it doesn't, you've found a gap in the checker.

**6. Feel the trade-off of deriving.**
Change `PASS_MARK` from 70 to 80. A learner who passed Greetings with 75%
yesterday opens the app. What happens to their Greetings? To You & Me? To their
XP? Now imagine unit completion had been *stored* as a flag instead. Which
version is more honest, and which is kinder? Write down which you'd pick when
raising a pass mark, and how you'd soften it.

**7. The URL attack.**
In `app/words/typing.jsx`, change `enabled: !isPro && !pathUnit?.free` to
`enabled: !isPro && !pathUnit`. As a free learner with monetization on, type
`/words/typing?unit=u-verbs` into the dev URL. What did you just give away?
Find the matching guard in `app/words/sentences/[groupId].jsx`. Is there a
third screen that needs one?

**8. Delete the cache.**
Comment out the two cache lines in `stepAvailability` and add
`console.time('path')` / `console.timeEnd('path')` around the list in
`PathList.jsx`. Compare the numbers. Then answer this: if sentences were
fetched from Supabase at runtime instead of bundled, would the cache still be
safe? What would you have to add?

**9. Add an 11th unit.** ✍️
Pick a category that isn't in any unit yet (e.g. animals or body) and add
`u-<name>` at `order: 11`. Say what a learner who has finished all 10 units
sees, and confirm it. Then move it to `order: 4`. What does someone who is
halfway through Family see now? Anything reset? Explain using `isUnitUnlocked`.

**10. Rename a unit id (thought experiment, don't ship it).**
Suppose you renamed `u-greetings` to `u-hello`. List every stored string that
becomes an orphan: step ids, the quiz id, the lesson id. Which of the §4
records *doesn't* strand, and why? That answer is why the ids comment in
`pathProgress.js` says what it says.

**11. Design a real tone step (sketch, don't build).**
For units whose words have audio, the tone step could be `PronounceStep`
(record and compare) instead of the typing drill. Sketch it: which function
decides which one a unit gets? Where does `markStepComplete` get called? What
does `stepAvailability.tone` become? What happens to learners who already
finished the tone step by typing?
