# Learning: how the Words page works (`app/words/index.jsx`)

The Words page is the **spaced-repetition (SRS) practice hub**: it answers "what
should I drill today?" It pulls your review schedule, splits it into what's *due*
vs *new*, shows progress, and fans out to every way of practicing. This doc walks
the whole file plus the SRS logic it leans on.

---

## 1. Where the data comes from

Two sources, and the split matters:

```js
import { categories } from '../../src/data/vocabulary.js'   // STATIC content
import { useProgress } from '../../src/hooks/useProgress.js' // LIVE user state
import { selectSession } from '../../src/context/ProgressContext.jsx'
```

- **`categories`** — the fixed word bank (every category → its words). Never changes
  at runtime.
- **`useProgress()`** — the user's live state: `xp`, `streakData`, and crucially
  `vocabSchedule` (the SRS memory of every word you've touched).

The page's whole job is to **cross the static word list against the live schedule**
to decide today's session.

---

## 2. The SRS model (what `vocabSchedule` holds)

`vocabSchedule` is an object keyed by word id. Each entry (see `nextSchedule()` in
`ProgressContext.jsx`) looks like:

```js
{ intervalIdx, dueDate, lastReviewedAt }
```

- `intervalIdx` — index into `SRS_INTERVALS` (e.g. `[1, 3, 7, 14, …]` days). Get a
  word right → `intervalIdx + 1` (wait longer next time); get it wrong → back to `0`.
- `dueDate` — `today + SRS_INTERVALS[intervalIdx]` days, stored as a `YYYY-MM-DD`
  string.
- `lastReviewedAt` — the day you last saw it (`YYYY-MM-DD`).

A word with **no entry** = never studied (a "new" word). That absence is itself
information — it's how new words are detected.

---

## 3. `selectSession` — the heart of it

```js
export const DAILY_NEW_LIMIT = 10

export function selectSession(words, schedule, limit = DAILY_NEW_LIMIT) {
  const reviews = selectReviewWords(words, schedule)     // studied before AND due
  const fresh   = selectNewWords(words, schedule, limit) // never studied, capped
  return { reviews, fresh, queue: [...reviews, ...fresh] }
}
```

- **`reviews`** = words that HAVE a schedule entry whose `dueDate <= today`
  (`sched && sched.dueDate <= today`). You've seen them; they've come back around.
- **`fresh`** = words with NO schedule entry, **capped at `limit` (10)**. The cap is
  the important design call — uncapped, day one asked for all ~391 words at once.
- **`queue`** = `reviews` first, then `fresh`. Reviews come first on purpose: clear
  your debt before taking on new material. (The session screen relies on this
  order — anything past `reviews.length` in the queue is a new word.)

The date comparison works because dates are **`YYYY-MM-DD` strings**: that format
sorts/compares lexicographically the same as chronologically, so `<=` "just works"
without parsing into `Date` objects.

---

## 4. The derived values in the component

```js
const { xp, streakData, vocabSchedule } = useProgress()
const allWords = categories.flatMap((c) => c.words)          // flatten cats → one list
const { reviews, fresh, queue } = selectSession(allWords, vocabSchedule)
```

Then a handful of read-only derivations drive the UI:

```js
const reviewedToday = Object.values(vocabSchedule)
  .filter((s) => s.lastReviewedAt === todayISO()).length      // done so far today
const learnedTotal = Object.keys(vocabSchedule).length        // words ever started

const goal    = reviewedToday + queue.length                  // today's total workload
const goalPct = goal === 0 ? 100 : Math.round((reviewedToday / goal) * 100)
const caughtUp = queue.length === 0
```

- **`reviewedToday`** counts schedule entries whose `lastReviewedAt` is today —
  `Object.values(...)` because we're inspecting the entries, not their keys.
- **`learnedTotal`** = `Object.keys(...).length` — every word with any entry.
- **`goal`** = what you've already done today + what's still queued = the full bar.
- **`goalPct`** guards divide-by-zero (`goal === 0 ? 100`), so an empty day reads
  100% (done) rather than `NaN%`.
- **`caughtUp`** = nothing left in the queue → drives the "All caught up 🎉" state.

### The summary-string idiom worth stealing

```js
const sessionSummary = [
  reviews.length > 0 && `${reviews.length} review${reviews.length === 1 ? '' : 's'} due`,
  fresh.length   > 0 && `${fresh.length} new word${fresh.length === 1 ? '' : 's'}`,
].filter(Boolean).join(' · ')
```

Each line is `condition && string`: if the condition is false you get `false`,
which `.filter(Boolean)` drops; `.join(' · ')` glues the survivors with a middot.
So you get "3 reviews due · 5 new words", or just one half, or "" — no dangling
separators. The `s = length === 1 ? '' : 's'` handles pluralization inline.

### `todayISO()` — why a string helper

```js
function todayISO() { return new Date().toISOString().slice(0, 10) }  // "2026-07-31"
```

Everything SRS is compared as `YYYY-MM-DD` strings (see §3), so the page uses the
same format to test `lastReviewedAt === todayISO()`. Comparing date STRINGS avoids
timezone/`Date`-equality headaches.

---

## 5. What it renders (top to bottom)

1. **Hero** — the section eyebrow + "A few words a day." + blurb.
2. **Stat tiles** (`StatTile`) — Day streak, Total XP, Reviews due, Words started.
   A small presentational helper: emoji + big number + label, `grow basis-[40%]`
   so they wrap two-up.
3. **Today's session card** — the focal point:
   - Title flips on `caughtUp` ("All caught up. 🎉" vs "Today's session").
   - Body shows `sessionSummary` (or the caught-up message).
   - A progress bar driven by `goalPct` (inline `style={{ width: `${goalPct}%` }}`
     because a dynamic width can't be a static class).
   - **`{!caughtUp && <Link href="/words/session"><Button size="lg">Start session →`**
     — the CTA only exists when there's something to do.
4. **"Drill another way"** — a list of `DrillTile`s linking out: Browse words
   (`/vocabulary` — the category grid), Quizzes, Tone drill, Notebook, Sentence
   builder. This is the fan-out to the rest of the vocab surface.

### The two sub-components

- **`StatTile({ label, value, emoji })`** — pure presentational card. No state.
- **`DrillTile({ to, emoji, title, blurb })`** — a `<Link href={to} asChild>` around
  a `Pressable` card. `asChild` = the Pressable *is* the link (see the notebook/
  search docs for the same pattern).

---

## 6. The mental model

**Static word bank × live schedule → today's queue → UI.** Everything on the page
is a *derivation* of `vocabSchedule` crossed with `categories`; the component holds
**no state of its own** (all reads come from `useProgress`). That's why it always
reflects reality the moment you finish a session and come back — the schedule
changed, so every derived number recomputes on the next render.

---

## 7. Gotchas / notes

- **Reviews-before-new ordering** is load-bearing: `app/words/session.jsx` figures
  out whether a card is "New" or "Review" purely from its index vs `reviews.length`.
  Don't reorder `queue`.
- **The 10-new cap** (`DAILY_NEW_LIMIT`) is intentional — raising it makes day one
  brutal.
- **No component state** here by design; if you add interactivity, prefer deriving
  from `useProgress` over duplicating it into local state.
- **`/vocabulary`** (the "Browse words" tile) is the category GRID — a different
  page from this hub. This hub is now also the bottom "Words" tab (see
  `notes/2026-07-31-words-vocabulary-consolidation.md`).
