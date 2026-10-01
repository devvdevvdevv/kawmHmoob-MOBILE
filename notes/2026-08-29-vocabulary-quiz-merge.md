# Vocabulary + Quizzes merged into one page (2026-08-29)

Reference guide for the merge: what moved, where every feature lives now, how the
routes behave, and exactly how to bring the old quiz menu back for debugging.

## Why

`/vocabulary` and `/quiz` were the SAME list twice. Both pages enumerated the same
~35 vocab categories, one card each; the only difference was that the quiz page put
a score badge on the card and linked to `/quiz/vocab-<id>` instead of
`/vocabulary/<id>`. Two doors, one room — and a learner had to bounce between them
to answer "have I studied this, and did I pass it?"

**Vocabulary is now the single page.** It is the word bank AND the quiz hub. The
quiz MENU is retired; the quiz ENGINE is untouched and still runs every quiz.

## The merged page, top to bottom

`src/components/vocabulary/VocabCategoryGrid.jsx` (rendered by
`app/(tabs)/vocabulary.jsx` at `/vocabulary`):

| Section | What it shows |
|---|---|
| Header | "Vocabulary", total words × categories, and the daily **quiz quota badge** |
| Progress card | **"X of Y quizzes taken"** + percentage + bar — the whole-app quiz completion number |
| Themed groups | Categories grouped by `categoryGroups` (Nature & Food, Describing, …), each with its blurb and a category count |
| Category card | Emoji, title, description, **N words · N question quiz**, a **studied X/N bar**, a **Best NN%** badge, and a quiz row footer |
| Drills | The non-vocab quizzes (Alphabet, Tones, Grammar, Speak) — one compact row each with its own best score |

The category card has two tap targets on purpose:

- **Top half** → `/vocabulary/<categoryId>` (the word deck — the primary act on a
  Vocabulary page).
- **Footer row** → `/quiz/vocab-<categoryId>` when unlocked, or a flat
  "🔒 Study N more to unlock the quiz" line when it isn't. A lock with no path
  forward is a wall; this one names the way through.

## Feature map — quiz menu → where it lives now

| Old `QuizMenu` feature | Now |
|---|---|
| `bestByQuiz` (max accuracy per quiz id) | Same reduction in `VocabCategoryGrid`; drives the card badge |
| "You've taken X of Y quizzes" + bar | Progress card in the Vocabulary header |
| Per-card best score `NN%` | `Best NN%` badge on the category card (and on the category page header) |
| `quizUnlock()` lock + "Study N more" | Card footer swaps to the lock line; also on `/vocabulary/<id>` |
| `QuotaBadge` ("N left today") | Vocabulary header, labeled "quizzes left" |
| Vocab quizzes grouped by `categoryGroups` | The Vocabulary page's own theme groups (categories were a flat list before — 35 cards in one column is a wall) |
| Non-vocab quiz groups (Alphabet/Tones/Grammar/Speak) | "Drills" section at the bottom. **Without this they'd be stranded** — the menu was their only entry point |

`quizScores` is an append-only log of every attempt, so "your score" is always the
MAX accuracy for that `quizId`, never the latest.

## Routes after the merge

| Route | Behavior |
|---|---|
| `/vocabulary` | The merged page (word bank + quiz hub) |
| `/vocabulary/<categoryId>` | Word deck / study mode, now with the quiz's best score + lock state in its header |
| `/quiz` | **`<Redirect href="/vocabulary" />`** — old links don't 404 |
| `/quiz/<topicId>` | **Unchanged and alive.** Every quiz still runs here |

### Every exit leads to Vocabulary

`QuizEngine` used to send you "Back to Quizzes". There is no menu to go back to, so:

```js
const isVocabQuiz = quizId.startsWith('vocab-')
const backTo   = isVocabQuiz ? `/vocabulary/${quizId.slice(6)}` : '/vocabulary'
const backLabel = isVocabQuiz ? 'Back to the words' : 'Back to Vocabulary'
```

A vocab quiz returns to **its own category deck** — the words it just tested, which
is where you go to fix a bad score. Everything else returns to the Vocabulary index.
This covers the not-found branch, the empty-dataset branch, QUIT QUIZ, the results
screen's back button (`backLabel` prop on `QuizResults`), and the breadcrumbs
(`crumbs`, which insert the category crumb for vocab quizzes).

## Files changed

| File | Change |
|---|---|
| `src/components/vocabulary/VocabCategoryGrid.jsx` | **Rewritten** — the merged page |
| `src/components/vocabulary/VocabList.jsx` | Category header gained `Best NN%` + the lock line; end-of-deck "Take the quiz" hides when locked |
| `app/quiz/index.jsx` | Redirect to `/vocabulary`; original screen preserved in a block comment |
| `src/components/quiz/QuizMenu.jsx` | **Kept whole**, unmounted, with a RETIRED banner at the top |
| `src/components/quiz/QuizEngine.jsx` | `backTo` / `backLabel` / `crumbs`; every `/quiz` exit rewired |
| `src/components/quiz/QuizResults.jsx` | New `backLabel` prop (defaults to "Back to Vocabulary") |
| `app/(tabs)/index.jsx` | Home "Quizzes" door commented out; Vocabulary blurb now "study, then quiz" |
| `app/words/index.jsx` | "Quizzes" drill tile commented out; "Browse Vocabulary" → "Vocabulary & quizzes" |
| `src/components/Footer.jsx`, `Navbar.jsx` | `/quiz` link commented out |
| `src/data/pageInfo.js` | `/vocabulary` help covers both halves; `/quiz` entry KEPT (the engine's screens inherit it by longest-prefix) |

Nothing was deleted — every removal is a comment with a restore hint, per house rule.

## Restoring the quiz menu (for debugging)

1. `app/quiz/index.jsx` — delete the `<Redirect>` and uncomment the original
   screen in the block comment below it.
2. Optional, to reach it from the UI again: uncomment the `/quiz` entries in
   `app/(tabs)/index.jsx`, `app/words/index.jsx`, `Footer.jsx`, `Navbar.jsx`.
3. `QuizMenu.jsx` needs no changes — it was never modified, only unmounted.

The merged Vocabulary page keeps working the whole time; the two can coexist.

## Decisions worth remembering

- **The engine was NOT touched functionally.** Only its exits changed. Quiz ids
  (`vocab-<catId>`, `alphabet-tones`, `tone-drill`, …) are progress keys inside
  `quizScores` — renaming or dropping one silently orphans people's scores.
- **Empty categories show no quiz row.** Every category auto-generates a quiz
  (`vocabQuizzes` in `src/data/quizzes.js`), including ones still being written, and
  a 0-question quiz dead-ends at "No data available". `hasQuiz = quiz && total > 0`.
- **`GlobalTabBar` still matches `/quiz`** — deliberately. The engine lives there, so
  the Words tab must stay lit while a quiz is running.
- **The lock is derived, never stored.** `quizUnlock()` recounts
  `vocabProgress` every render (studied ≥ 50% of the category), so it can't drift.
- Study progress on the card counts words marked Learning/Known — the same number
  the lock counts, shown BEFORE you hit the lock.

## Verify

- `/vocabulary` shows the quota badge, the "X of Y quizzes taken" bar, themed
  groups, and per-card word/question counts.
- A category you've studied ≥ 50% of shows "Take the quiz"; one you haven't shows
  "Study N more to unlock the quiz".
- Finish a quiz → the results screen's back button reads "Back to the words" and
  lands on that category's deck; the score badge appears on its card.
- Visiting `/quiz` lands on `/vocabulary` (no 404); `/quiz/tone-drill` still runs
  and exits to `/vocabulary`.
- Tone drill, Tone Markers, Pronouns, and Greetings are all reachable from the
  "Drills" section.

---

# Exercises — learn what changed by poking it

Work top to bottom; each tier builds on the one before. **Predict the answer before
you look.** Answer key is at the very bottom — try first, it's the whole point.

Two commands you'll want:

```bash
npm start                        # run the app (Expo)
npx expo export --platform web   # compile-check everything without running it
```

`git diff` and `git checkout -- <file>` are your undo for the "break it" exercises.

## Tier 1 — Read it (no edits)

### 1. Follow one number end to end
Open `/vocabulary`, take any unlocked quiz, come back. A `Best NN%` badge appears
on that card.

Trace where that number was born, in order. Write down the four hops:

1. Which function CREATED the score entry? (hint: search `recordQuizScore`)
2. What shape is a `quizScores` entry, and what does the list do on a second
   attempt — overwrite, or append?
3. Which block in `VocabCategoryGrid.jsx` turns that list into one number per quiz?
4. Which line renders it?

> **Why it matters:** if scores were overwritten instead of appended, "best" would
> silently become "latest". The reduction in step 3 is the only thing making the
> word *Best* true.

### 2. Do the lock math on paper
`quizUnlock()` lives in `src/lib/access.js`. Given `QUIZ_UNLOCK_RATIO = 0.5`, a
category with **12 words** where you've marked **5**:

- What is `needed`?
- Is the quiz unlocked?
- What exact sentence does the card footer show?

Now: how many words must you mark in a **13-word** category? (Careful —
`Math.ceil`.)

### 3. Find the duplicated magic number
`80` is the pass threshold (green badge vs. grey). Find **every** place it appears
in the merged UI:

```bash
grep -rn ">= 80" src/components
```

How many hits, in how many files? If you wanted a pass mark of 90, how many edits
is that today — and what would you change so it's one edit forever?

> This is a real smell I left in on purpose so you'd find it. See exercise 9.

## Tier 2 — Poke it (small edits, then undo)

### 4. Break the empty-category guard on purpose
`nature` is a real category with `words: []` (see `src/data/vocabulary.js`).

1. Find `hasQuiz` in `VocabCategoryGrid.jsx`. **Predict** what the Nature card
   looks like right now.
2. Change `const hasQuiz = Boolean(quiz) && total > 0` to `const hasQuiz = Boolean(quiz)`.
3. Reload, find Nature under "Nature & Food", tap its quiz row.
4. What dead end do you hit? Which file printed that message?
5. `git checkout -- src/components/vocabulary/VocabCategoryGrid.jsx`.

> **Lesson:** every category auto-generates a quiz (`vocabQuizzes` in
> `src/data/quizzes.js` maps ALL categories), so the UI — not the data — is what
> keeps half-written categories from dead-ending.

### 5. Predict two exit paths
Without running anything, read `backTo` / `backLabel` near the top of
`QuizEngine.jsx` and predict where you land after tapping **QUIT QUIZ** in:

- `/quiz/vocab-animals`
- `/quiz/tone-drill`

Then run both and check. Why does one land deeper than the other? Which line of
`crumbs` explains the difference in the breadcrumb trail?

### 6. Resurrect the retired page
Bring the old quiz menu back, look at it side by side with the merged page, then
put it away again:

1. In `app/quiz/index.jsx`, comment the `<Redirect>` line and uncomment the
   original screen in the block below.
2. Visit `/quiz` and `/vocabulary`. List three things the old menu showed that the
   new page shows too, and one thing the new page shows that it never did.
3. Restore the redirect.

> **Lesson:** this is why the file was commented, not deleted. Nothing about the
> merged page depends on the menu being gone — they can coexist.

## Tier 3 — Extend it (write real code)

### 7. Add an attempt count to the card
`quizScores` is append-only, so "how many times have I taken this?" is already in
the data — nobody is rendering it.

On the category card, under the `Best NN%` badge, show `3 attempts` (and `1 attempt`
for one). Constraints:

- Compute it the same way `bestByQuiz` is computed — one pass in the parent, not a
  `.filter()` inside every card (35 cards × a full scan is wasteful).
- The card must render correctly when the count is 0 (show nothing).

Hint: your reduction produces a second object, `attemptsByQuiz`, right beside
`bestByQuiz`, and rides down as one more prop.

### 8. Add a "needs work" cue
Any category whose best score is **below 80** is the one worth redoing. Make those
cards say so — your call how: a small label, a tinted footer, whatever reads
clearly. Rules:

- A category you've never quizzed is NOT "needs work" — it's untouched. Keep those
  two states distinct.
- A locked category can't say "needs work" either. Which existing variable already
  tells you that?

### 9. Kill the magic number you found in exercise 3
Move `80` into a named export next to `QUIZ_UNLOCK_RATIO` in `src/lib/access.js`
(e.g. `QUIZ_PASS_SCORE`), then use it in all four places. Compile-check with
`npx expo export --platform web`.

Ask yourself: why does `access.js` deserve this constant more than
`VocabCategoryGrid.jsx` does?

### 10. Stretch — order the groups by what you owe
Inside one theme group, sort categories so the ones needing attention come first:
locked-and-partly-studied → taken-but-under-80 → never-taken → passed.

Do it without mutating `categoryGroups` (it's module-level shared data — mutating it
would reorder the list for every other consumer, permanently). What's the safe way
to sort an array you don't own?

---

## Answer key

**1.** `recordQuizScore` in `src/context/ProgressContext.jsx:126` **appends**
`{ quizId, score, maxScore, accuracy, date }` (and grants +5 XP). It never
overwrites, so a quiz can have many entries. `VocabCategoryGrid.jsx:37-43` reduces
them into `bestByQuiz` by keeping the MAX accuracy per `quizId`; the badge renders
at `VocabCategoryGrid.jsx:188-193`.

**2.** `needed = Math.ceil(12 * 0.5) = 6`; 5 < 6, so **locked**, and the footer
reads "Study 1 more to unlock the quiz" (`unlock.remaining`). For 13 words:
`Math.ceil(6.5) = 7`.

**3.** Four hits in two files — `VocabCategoryGrid.jsx:173` (category card) and
`:263` (drill card), `VocabList.jsx:83` and `:84` (badge background and text color).
Pass mark 90 = four edits today. One shared exported constant = one edit forever.

**4.** Nature shows word count 0 and **no quiz row**. Remove the `total > 0` half and
it offers a 0-question quiz that dead-ends at "No data available for this quiz yet."
— printed by `QuizEngine.jsx` (the `dataset.length === 0` branch).

**5.** `vocab-animals` → `/vocabulary/animals` (its own deck, button reads "Back to
the words"); `tone-drill` → `/vocabulary` (the index, "Back to Vocabulary"). A vocab
quiz has a deck to return to; a drill doesn't. The spread line in `crumbs` inserts
the category crumb only when `isVocabQuiz && unlock.category`.

**6.** Shared: best-score badges, the study lock with "study N more", the quota
badge, the overall taken X/Y bar, the drill quizzes. New: the word counts and the
`studied X/N` bar — the study side the menu never knew about.

**7.** Beside `bestByQuiz`, add a second accumulator in the same loop:
`counts[s.quizId] = (counts[s.quizId] || 0) + 1`. One pass over `quizScores`,
`attempts={quiz ? attemptsByQuiz[quiz.id] : 0}` down to the card, render only when
`attempts > 0`.

**8.** `taken` distinguishes never-quizzed from quizzed (`best != null`), and
`locked` is already computed in `CategoryCard`. So: `taken && !passed && !locked`.

**9.** Because the pass mark is an *access/progress rule*, not a display detail —
same category of decision as `QUIZ_UNLOCK_RATIO`. `access.js` is where a rule about
what counts as "good enough" belongs; components should render decisions, not own
them. (Note `QuizResults.jsx` has its own `accuracy === 100` perfect-score check —
that one is genuinely about the celebration, not passing.)

**10.** Copy before sorting: `[...group.items].sort(...)`. `Array.prototype.sort`
mutates in place, and `categoryGroups` is built once at module load and shared by
every importer — sorting it directly would reorder the list app-wide for the rest of
the session.
