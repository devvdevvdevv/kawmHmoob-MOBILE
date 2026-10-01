# Words hub: condensed, stats collapsed, 25-word session cap (2026-08-29)

Four changes to `app/words/index.jsx` and the session selector behind it.

## 1. A session is now 25 words, sampled at random

`src/context/ProgressContext.jsx` → `selectSession`

A mature schedule can put **300 reviews** due on one day. The queue was
`[...allReviews, ...fresh]` with no ceiling, so "Today's session" became a session
nobody finishes, and the page's own promise — *a few words a day* — stopped being
true.

```js
export const SESSION_LIMIT = 25
```

Reviews fill the 25 first (they're actually due); new words take whatever room is
left. `DAILY_NEW_LIMIT` (10) still caps new words on a quiet day.

| due | new available | → session |
|---|---|---|
| 300 | 10 | 25 reviews + 0 new |
| 20 | 10 | 20 reviews + 5 new |
| 5 | 10 | 5 reviews + 10 new |
| 0 | 10 | 0 + 10 new |

### Why the sample is seeded, not `Math.random()`

**Random, not the first 25.** Slicing the head of the queue would drill the same
words every day and starve the tail of a backlog forever.

**But three screens call `selectSession` independently** — the home card
(`app/(tabs)/index.jsx` due count), the Words hub, and `app/words/session.jsx`. An
unseeded shuffle would hand each of them a *different* 25, and reshuffle on every
re-render — the hub would advertise words the session then didn't show.

So the shuffle is seeded from `todayISO()`: same day → same deck everywhere, a new
deck tomorrow. It's a plain LCG; this picks flashcards, not crypto keys.

Knock-on: the home screen's "Review N words due" now tops out at 25 rather than
reporting the raw backlog. That's the honest number now — 25 is what a session will
actually contain.

## 2. Stats are a collapsible, closed by default

The four stat tiles took ~235px above the fold — the session card, the thing the
page exists to launch, started below it. They now live in the shared
`src/components/common/Collapsible.jsx` (the same accordion as the account page).

The streak rides in the **title** (`Your stats · 7-day streak`) so the one number
worth seeing at a glance survives the panel being shut. Tiles are `bg-cream-100`
inside the collapsible's `bg-cream-50` card — at cream-50 on cream-50 they'd vanish.

## 3. Condensed layout

No structural changes, just spacing and type:

- hero `mb-8` → `mb-4`, body copy `text-base leading-relaxed` → `font-sans text-sm`
- session card `p-6 mb-10` → `p-5 mb-6`, internal margins each down a step
- drill list `gap-3` → `gap-2`; tiles `p-4` → `p-3`, icon well 44 → 40px
- tile titles `font-semibold` → `font-serif`, blurbs `text-sm` → `font-sans text-xs`

Roughly 300px of vertical space recovered, most of it from the stats collapse.

`font-semibold` → `font-serif` is the same fix as the notebook pass: `font-semibold`
on an unmapped Nunito Sans weight does nothing on Android, and `font-serif` is
Nunito Bold. See [2026-08-28-notebook-cap-study-and-notes-hidden].

## 4. "Drill another way" → "Hmong Vocabulary Hub"

Section heading renamed on request. **Note for whoever reads this later:** the name
came from the user's phrasing, not from an existing component — there was no
"Hmong Vocabulary Hub" anywhere in the codebase before this.

## Untouched on purpose

The hero line "A few words a day." — the user is rewording it by hand.
