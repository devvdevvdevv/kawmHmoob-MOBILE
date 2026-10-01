# Guide (DRAFT): putting the Beginner Path inside the Learn module

**Status: a plan for you to build. No code has been written for this.**
Read `path-spine-explained.md` first. This guide assumes you know how
`path.js` and `pathProgress.js` work.

---

## 0. What "integrate" should mean, in one picture

Right now the app has two courses that don't know about each other:

```
Learn tab                          Beginner Path (/path, reached from Home)
─────────                          ─────────────────────────────────────
Foundations  (alphabet)            1 Greetings   flashcards → quiz → tones → sentences → reading
Grammar      (pronouns, verbs…)    2 You & Me
Conversational (greetings…)        3 Numbers …
Numbers & Time
   ↑ lessons that EXPLAIN             ↑ units that DRILL
```

They teach the **same material from two sides.** The Learn lesson "Greetings and
Farewells" explains *why* `nyob zoo` means "live well". The path unit
"Greetings" drills the words until you know them. Right now a learner has to
find both on their own.

The integration this guide recommends has two parts:

1. **The Learn tab becomes the path's home.** The path list sits at the top of
   Learn. The existing lessons stay below it as the library.
2. **Each path unit gets a 6th step, "Lesson", placed first.** It points at the
   Learn lessons that explain that unit. You read the explanation, then drill.
   That's the order `lessons.js` already argues for: *"The lesson explains;
   Words drills; the quiz tests."*

```
Greetings:  Lesson → Flashcards → Quiz → Tones → Sentences → Reading
              ↑ opens the existing Learn lesson screen, unchanged
```

**What this does NOT mean:** rewriting path units as `lessons.js` units, or
moving the `/path/...` routes under `/learn/...`. The two data models are
different on purpose (§2), and moving routes buys nothing (§7).

---

## 1. Check your understanding first (5 minutes, no code)

Answer these from the code before building. If you can't, re-read the file.

1. In `src/data/lessons.js`, what is a "unit"? And in `src/data/path.js`?
   (Spoiler: two different things with the same name, **and both files export a
   function called `getUnit`**.)
2. How does the Learn hub decide a lesson is done? Find `lessonProgress`. Is it
   stored or derived?
3. How does `pathProgress.js` decide a path step is done? Same question.
4. What does the lesson screen (`app/learn/[unitId]/[lessonId].jsx`) do when
   you finish the last step? Where does it send you?

Answers: (1) Learn unit = a chapter of lessons; path unit = a drill bundle of
words. (2) Derived: it compares a lesson's step ids against `completedSteps`.
(3) Also derived. (4) It fires `celebrate(...)` and then
`router.push('/learn/<learnUnitId>')`. **Hold on to answer 4. It becomes a bug
in §5.**

The good news in answers 2 and 3: **both systems already derive from the same
`completedSteps` list.** So linking them doesn't need a new record.

---

## 2. Why not just merge the two data models?

It's tempting to turn each path unit into a `lessons.js` unit and have one
course. Don't. Look at what each one is made of:

| | Learn (`lessons.js`) | Path (`path.js`) |
|---|---|---|
| made of | **hand-written steps** (intro text, example tables, a quiz) | **words** pulled from vocabulary categories |
| a step is | one screen of authored content | a whole drill session over the unit's words |
| "done" means | every step id is in `completedSteps` | derived from vocab statuses, quiz scores, step ids |
| grows when | you write a lesson | you add words or sentences |

These are two different kinds of thing. The path shouldn't *become* Learn. It
should **point at** Learn. When two models work differently, **link them, don't
merge them.**

---

## 3. The link: which lessons belong to which unit

### Decide how to link: derived or listed?

Every Learn lesson with vocabulary has a `vocab: '<categoryId>'` field, and every
path unit has `categories: [...]`. So you *could* derive the link: "a unit's
lessons are the lessons whose `vocab` is one of the unit's categories."

Test that idea against Greetings before you trust it:

| Greetings' categories | Learn lesson | has `vocab`? |
|---|---|---|
| `greetings` | `vocab-greetings-farewells` | ✅ `vocab: 'greetings'` |
| `politeness` | `conversational-politeness` | ❌ no `vocab` field |
| `introductions` | `conversational-introductions` | ❌ no `vocab` field |

Derivation would find **1 of 3**. It's the same lesson as `unitWords` in the
path guide: when a rule gives the wrong answer, **hand-pick an explicit list.**

### The shape (you write it)

Add an optional field to each unit in `path.js`:

```js
lessons: ['vocab-greetings-farewells', 'conversational-politeness', 'conversational-introductions'],
```

It's a list of **Learn lesson ids, as plain strings.** `path.js` must NOT
import `lessons.js` (§6 explains why).

### A starting mapping, for you to judge

I built this from the `vocab` fields and titles. **You're the teacher here.**
Change it wherever the lesson doesn't actually prepare someone for the unit.

| unit | candidate Learn lessons | notes |
|---|---|---|
| u-greetings | `vocab-greetings-farewells`, `conversational-politeness`, `conversational-introductions` | |
| u-pronouns | `foundations-pronouns`, `foundations-yog-to-be` | `foundations-possessive-pronouns` too? It's also `vocab: 'pronouns'` |
| u-numbers | `numbers-counting` | `numbers-how-much` is `vocab: 'money'`, not in the unit |
| u-family | — | no lesson exists: the step is skipped |
| u-classifiers | `foundations-noun-classifiers` | |
| u-food | — | skipped |
| u-colors | — | skipped |
| u-verbs | `foundations-action-verbs` | `foundations-tense-markers`? |
| u-time | `time-explained`, `numbers-time` | both are `vocab: 'timeframes'` |
| u-daily | `conversational-daily-life` | |

⚠️ **Don't "fix" lesson ids that look wrong.** `foundations-pronouns` lives in
the *Grammar* unit, and the id says "foundations". Ids are progress keys.
Renaming one wipes everyone's progress on that lesson. Leave them alone.

---

## 4. The new step inside `pathProgress.js`

Adding a step touches **four places**, always the same four. Find each one in
the file before you start:

| place | what you add |
|---|---|
| `STEPS` | `{ key: 'lesson', title: 'Lesson', icon: 'bookOpen', blurb: '…' }`, **first** in the array |
| `stepAvailability` | `lesson:` true when the unit lists at least one lesson that actually exists |
| `stepsDone` | `lesson:` true when every linked lesson is "done" (see below) |
| `stepHref` | `case 'lesson':` the first linked lesson not done yet |

Units with no lessons (Family, Food, Colours) need **no special code.** The
"skipped, not blocking" rule from the path guide already covers them. That's
the payoff for building it that way.

### What does "done" mean for the lesson step? (a real decision)

Most Learn vocab lessons **end in a `quiz` step**: the `vocab-<category>` quiz,
locked until you study. The path already has its own quiz, `path-<unit>`. If the
lesson step means "every step of the lesson is done", a path learner has to
take **two quizzes on the same words** in a row.

Two options:
- **(a) Accept it.** Simple, but it'll feel repetitive.
- **(b) Define "done" for the path as "every *teaching* step done":** every step
  whose `kind` isn't `'quiz'` or `'mini-quiz'`. The lesson explains, and the
  path's own quiz does the testing.

I'd pick (b). It's still derived from `completedSteps` and `lesson.steps`, with
nothing new stored. Write it as a small named function like
`lessonTaughtDone(lesson, completedSteps)` with a comment saying *why* quizzes
are excluded. Otherwise someone will "fix" it later.

The side effect you should know about: under (b), the Learn library will still
show that lesson as *not* ✓ Done, because the library uses the full rule.
That's honest: the learner didn't take that quiz. It's worth one line in the
comment.

### `stepHref` needs the Learn unit id

Lesson URLs are `/learn/<learnUnitId>/<lessonId>`, but you only stored the
lesson id. Write a helper that finds which Learn unit contains a lesson id by
searching `units` from `lessons.js`. Return `null` if the id isn't found. A typo
in your `lessons:` list should show up as "step not available", not as a broken
link.

⚠️ **Adding a step changes completion for everyone** (path guide, exercise 6).
A learner who finished Greetings yesterday will see it as incomplete today,
because a new required step appeared. That's fine right now: the path was
built today and nobody is on it. Once real learners are on the path, adding a
step is a decision about their progress, not just a code change.

---

## 5. The way back: the lesson screen doesn't know about the path

This is the §1 answer 4 bug. A learner taps **Lesson** in Greetings, reads the
lesson, finishes, and gets sent to `/learn/conversational`. That's the Learn
chapter, not their unit. They're lost.

It's the same "reuse a screen" pattern from the path guide, needing the **same
three changes**:

1. **Scope:** the URL carries where you came from, e.g.
   `/learn/conversational/vocab-greetings-farewells?unit=u-greetings`. The
   typing drill already uses `?unit=`, so reuse that name.
2. **Mark done:** nothing to do. The lesson screen already writes its step ids
   to `completedSteps`, and your derived rule reads them.
3. **Way back:** when `?unit=` is present:
   - breadcrumbs: Home › Path › Greetings › *lesson title*
   - the celebration's button returns to `/path/<unit>` instead of `/learn/<learnUnit>`
   - under option (b), the learner is "done" *before* the lesson's quiz step. Look
     at what that quiz step shows (`QuizStep`) and decide what a path learner
     should see there. A "Back to Greetings" button is probably enough.

⚠️ The lesson screen imports `getUnit` from `lessons.js`. When you import the path's
`getUnit` into the same file, **rename one on import**:
`import { getUnit as getPathUnit } from '../../../src/data/path.js'`. If you
don't, the second import errors, or worse, you call the wrong one and get
`null` for every id.

---

## 6. The trap: `lessons.js` can't be loaded by Node

`pathProgress.js` is plain JS **so Node scripts can import it** (path guide §1).
The moment it imports `lessons.js`, that stops being true. `lessons.js` imports
its lesson files **without file extensions**:

```js
import { pronouns } from './lessons/pronouns'      // Metro: fine.  Node: ERR_MODULE_NOT_FOUND
```

Metro (the app bundler) guesses the `.js` extension. Node doesn't. The app will
work, but any Node script that imports `pathProgress.js` will break.

Two ways out. Try them in this order:

- **(a) Add `.js` to the imports in `lessons.js`.** It's a mechanical change and
  Metro doesn't care either way. Then test it:
  `node -e "import('./src/data/lessons.js').then(m => console.log(m.units.length))"`.
  **Predict the result first.** Three lesson files import `../reference.js`, so
  whatever *that* imports now has to load in Node too. If it prints `4`, you're done.
- **(b) Pass the lesson lookup in (dependency injection).** `stepsDone` takes
  an extra argument, a function `lessonDone(lessonId) → boolean`, and the
  screens pass one built from `lessons.js`. `pathProgress.js` never imports
  Learn at all. This is more wiring, but it keeps the file dependency-free
  whatever happens to `lessons.js` later.

Either way, **`path.js` stays import-free of Learn.** It only holds id strings.

---

## 7. The Learn tab screen

Now the visible part, `app/(tabs)/learn.jsx`. Recommended layout:

```
[eyebrow] Learn
One step at a time.                      ← keep, it fits the path better than before
<one sentence: the course, then the library>

── The course ─────────────────
<PathList>                               ← the SAME component /path uses
                                            (it takes progress + hasPro; check its props)

── All lessons ────────────────
Foundations / Grammar / Conversational / Numbers & Time   ← today's list, unchanged
```

Decisions for you:

- **Which progress bar goes in the masthead?** Today it says "X of Y lessons
  done". With the path on top, a lessons count up there describes the part
  *below the fold*. I'd move it down to sit with "All lessons" and let the
  path's pips speak for the course. Two bars one above the other invite "which
  one is my progress?".
- **Naming.** Both lists call their groups "units". In the UI, keep "Unit" for
  path units (that's what the path already shows) and call Learn's chapters
  something else in headings, e.g. just their titles under "All lessons". Don't
  rename ids or routes for this. It's copy only.
- **Routes stay at `/path/...`.** Moving them under `/learn/path/...` would
  compete with `app/learn/[unitId]` (the URL `/learn/path` looks like a Learn
  unit called "path") and strands every `stepHref` for nothing. Check one thing,
  though: does the tab bar highlight **Learn** when you're on `/path/...`? See
  `notes/2026-07-25-global-tab-architecture.md` for how the tab bar works out
  which tab is active.
- **Visual system.** Cream-50 cards on seafoam-300, and the Learn eyebrow dot is
  `bg-seafoam-500`. `PathList` was built for `/path`, so check it looks like it
  belongs on this screen.

Then tidy Home: the Explore list has both **"Beginner path"** and **"Learn"**.
Once the path lives in Learn, one of them is a duplicate door. **Comment it out
with a restore hint rather than deleting it.** Home's Continue card needs no
change, because it calls `stepHref`, which you already taught about `'lesson'`.

---

## 8. Build order

Each stage should work before you start the next. Stop and run the app at each ✅.

1. **Mapping.** Add `lessons: [...]` to the units in `path.js`. Only strings.
2. **Checker.** In `scripts/check-path.mjs`, fail if a listed lesson id doesn't
   exist, and if a **free** unit links a lesson with `tier: 'pro'`. That would
   put a paywall inside the free course. (This needs §6 solved first, so do §6
   as part of this stage.)
3. **Logic.** The four places in `pathProgress.js`, plus the find-the-Learn-unit
   helper. Test in Node with a fake `progress` object: Greetings with no lesson
   steps done, then with all teaching steps done. ✅
4. **Way back.** `?unit=` on the lesson screen: breadcrumbs, celebration target,
   the quiz-step exit. ✅ Walk Greetings → Lesson on the device.
5. **Learn tab.** `PathList` on top, library below, progress bar moved. ✅
6. **Home.** Comment out the duplicate Explore door. ✅
7. **Full walk on the device.** A fresh guest does Greetings end to end,
   *starting from the Learn tab*.
8. **Note it.** Add a dated note in `notes/`, and link it from
   `notes/2026-09-22-path-spine.md`.

---

## Checklist

- [ ] Path units **point at** Learn lessons; the two data models aren't merged.
- [ ] `lessons: [...]` is hand-picked, not derived from `vocab`.
- [ ] `path.js` holds id strings only and never imports `lessons.js`.
- [ ] The new step touches exactly four places in `pathProgress.js`.
- [ ] Units without lessons skip the step with no special code.
- [ ] "Done" for the lesson step is defined on purpose, with the reason in a comment.
- [ ] No lesson id was renamed.
- [ ] `getUnit` is renamed on import wherever both are used.
- [ ] Node can still import `pathProgress.js` (§6).
- [ ] The checker rejects missing lesson ids and Pro lessons in free units.
- [ ] A path learner is always returned to their path unit.
- [ ] One progress story per screen area; one door per destination on Home.

---

# Exercises: do these while building

**1. Predict the derived mapping.** Before you write `lessons:`, write a
10-line Node snippet that derives the mapping from `vocab` fields and prints it.
Compare it with the table in §3. How many units does it get right? That number
is your argument for the explicit list.

**2. Find the double-quiz yourself.** Before choosing (a) or (b) in §4, open
`vocab-greetings-farewells` in the app and walk to the end. Write down every
quiz you'd take if you then did the path's Greetings unit. Then choose.

**3. Break the link on purpose.** Put a typo in one lesson id in `lessons:`.
What should each of these show: the checker, the unit screen, the Continue
card? Build it so all three do what you predicted.

**4. The free-course leak.** Temporarily set `tier: 'pro'` on
`conversational-politeness`, turn monetization on, and walk Greetings as a free
learner. Where do you hit the wall? Does your checker catch it before the app
does? It should.

**5. Explain the §6 error to yourself.** Run the `node -e` line from §6 *before*
changing anything, and read the error. Then explain in one sentence why Metro
doesn't have the same problem.

**6. The returning learner.** Finish Greetings *before* you add the lesson step.
Then add it. What does your learner see now? Write the sentence you'd put in the
note explaining why that's acceptable today, and what you'd do instead once real
learners are on the path.
