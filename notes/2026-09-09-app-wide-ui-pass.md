# App-wide UI pass — the four gaps the audit did not catch (2026-09-09)

`check-theme.mjs` guards *class-level* consistency: eyebrows, radii, palette,
hairlines, hex, themed-classes-in-Modal. It passes on 209 files.

It cannot see any of the four things below, and that is the point worth keeping:
**a screen can use every house token correctly and still be composed
differently from its neighbours.** Drift moves up a level once you close it at
the level below.

## 1 & 2 — two of five hubs never got a masthead

Speak, Words and Reading all open the same way: dot-eyebrow → serif title → one
sentence → progress bar. **Learn opened with a bare `text-3xl "Learn"` and one
line. Reference the same.**

Both now open like the others. Two details worth keeping:

**Learn's progress bar is the bigger half of the fix.** Speak says "12 of 88
phrases practiced"; Reading says "3 of 10 read"; Learn — the structured
curriculum someone is meant to work *through* — said nothing at all about where
they were in it.

⚠️ **The filter had to be hoisted first.** The Readings unit is hidden outside
`__DEV__`, and that filter lived inline in the `.map()`. Counting from `units`
while rendering from the filtered set would have the masthead advertising a
lesson total the release build never shows. `visibleUnits` is now the single
array both read from.

⚠️ **Reference deliberately has NO progress bar**, and this is the interesting
half. Every other hub got one; this is the screen where it would be wrong.
Reference is a place you *look things up*, not a thing you work through. "12 of
62 letters" would invent a goal nobody has and make a dictionary feel like
homework. It shares the eyebrow and the heading step; it correctly does not
share the bar.

The dots use each section's own tab-indicator token — `bg-seafoam-500` for
Learn, `bg-cream-600` for Reference — so the mark at the top of the screen and
the highlighted tab at the bottom are visibly the same fact.

## 3 — `TodayCard` knew about two modules and the app has five

It suggested a vocabulary review and an undone quiz. It had **no idea the Speak
course or the reading library existed** — the two places the most content has
been written. The one card whose job is answering *"what should I do right
now?"* was blind to most of the answers.

It now also offers the next Speak lesson and the next unread story.

⚠️ **The Speak suggestion is gated three ways**, and each one is a dead end
otherwise:

| gate | what it prevents |
|---|---|
| `SPEAK_ENABLED` | suggesting a lesson from a section that renders "coming soon" |
| `l.free \|\| isPro` | a suggestion that bounces straight to the paywall |
| in-progress before fresh | "begin" offered to someone with a half-done lesson |

⚠️ **Reading gates on the GENRE, not the story** — `GENRES.filter(g => g.free)`
— because that is where the library's own gating lives. Duplicating the rule
per-story here is exactly how the two would drift.

⚠️ **Order is the design.** Due reviews first *because they decay* — a word
reviewed late is the only item on the card that gets worse for waiting. Then
the half-finished lesson, then something new to read, then a quiz, notebook
last as the always-available fallback. Capped at four: with five sources
feeding it, an uncapped list is a menu, and a menu is what "Today" exists to
save you from.

## 4 — `SkeletonCard` was imported by zero files

Written, never wired. Part of the reason is that **a skeleton that does not move
does not read as loading** — it reads as content that failed, or a UI someone
forgot to finish. It now breathes (opacity, `withRepeat` + reverse), and
`SkeletonList` staggers each row by `i * 120`ms so the shimmer travels instead
of the page throbbing in lockstep.

⚠️ **`withDelay`, not a style `animationDelay`.** The first version passed
`{ animationDelay: delay }` as a style. That is a **CSS** property — React
Native has no such style prop, so it does nothing at all, and the whole list
would have pulsed in unison with nothing in the code looking wrong.

⚠️ **Opacity, not a travelling highlight.** A real shimmer needs a gradient and
this app has no gradient library; faking one with stacked views costs more than
the effect is worth.

### When to use which

- **Skeleton** — the shape is known before the data is: a list of rows, a card
  with a title and a line. It holds the layout so nothing jumps on arrival.
- **Spinner** — the shape is not known: a purchase round-trip, an unknown-length
  action. A fake row there would be a lie about what is coming back.

The leaderboard is the first case and now uses `SkeletonList` (its centred
spinner collapsed the page to nothing, then pushed the whole board down in one
frame). **The paywall keeps its spinner on purpose.**

## Deferred: #5, the undifferentiated row

`h-11 w-11 rounded-full bg-clay-600/12` is on Speak categories, Words tiles and
Home doors alike. Consistency is good; undifferentiated *weight* is not — a
200-lesson course, a 15-word notebook and the leaderboard all look equally
important, so the eye has nothing to prioritise. Reading solved this by giving
its main object a genuinely different shape (a cover).

**Held deliberately until the next ~25 Speak lessons land.** The right shape for
a category card depends on how many categories there end up being, and designing
it against three is how you get something that breaks at twelve — the same
mistake `shelfCoverWidth()` was corrected for.

## Already done by the time this note was written

**#6, hardcoded hex → theme tokens.** `src/lib/themeColor.js` now resolves a
token to an `rgb()` string for the props a className cannot reach —
`ActivityIndicator color`, `placeholderTextColor`, anything inside a `<Modal>`.
`check-theme.mjs` guards it. Every one of those sites used to be a hex that
looked right in the light theme and never changed when the theme did.

---

## Where the rest of this day is written up

Two other pieces of 2026-09-09 work live in the reading module's note
(`2026-09-08-reading-module-visual-system.md`) rather than here, because they
are that module's decisions rather than app-wide ones:

- **The shelf divider** — why 56px of whitespace could not separate a "See all"
  action from the next shelf's heading, and why the rule is inset rather than
  full-bleed. It also *corrects* the vertical-rhythm section above it, which had
  claimed space alone was sufficient.
- **Cover art scaffolding** — `src/data/storyCovers.js`, why Metro forces a
  static-`require()` map, and the `check-reading.mjs` rule that catches a cover
  keyed to a story id that does not exist.

## The pattern across every fix this week

Worth writing down once, because it has now happened at four different levels:

| level | the drift | what closed it |
|---|---|---|
| class | six eyebrow specs | `<Eyebrow>` + `check-theme.mjs` |
| colour value | hex where a class cannot reach | `themeColor.js` + a check |
| composition | two hubs with no masthead | this note |
| data | a cover keyed to a story that does not exist | `check-reading.mjs` |

**Closing drift at one level exposes it at the next.** The eyebrow audit only
became possible once the palette was consistent; the composition gap only became
visible once every eyebrow was identical. Expect the next one to be about
*motion* — the reading module now has a considered animation and nothing else in
the app has any.

⚠️ **The checks are the durable part, not the fixes.** Every category in
`check-theme.mjs` is something the app decided, wrote down, and then broke
anyway — because none of it renders as an error. A screen with its own eyebrow
spec and a hardcoded hex looks perfectly fine on its own. It only looks wrong
next to the other twenty, which is a view nobody has while writing one of them.

---

## `scripts/check-notes.mjs` — the notes now have a compiler

106 notes deep, the design reasoning in `notes/` is the most valuable thing in
this repo: it is the part that **cannot be re-derived by reading the code**.

But a note has no compiler. It goes stale silently, and a stale note is worse
than no note, because it is believed. This has already happened twice:

- a blanket `rounded-xl`→`rounded-md` replace rewrote its own "Was:" comment,
  leaving the comment describing a change it had just undone;
- the reading note argued for 56px of whitespace as the shelf separator for a
  day after a hairline rule replaced it.

Neither was caught by reading. Both would have been caught by this.

⚠️ **It checks CLAIMS, not keywords.** `grep divider notes/` proves a topic was
written about and says nothing about whether the writing is still true. Each
entry pairs a sentence from a note with the thing in the code that must be true
for that sentence to hold — "no rule under the last shelf" is
`divider={i < shelves.length - 1}`; "the paywall keeps its spinner" is
`ActivityIndicator` still being in `paywall.jsx`.

⚠️ **A red line does not mean the code is broken.** It means the note and the
code disagree. Usually the code moved on and the note needs correcting;
occasionally the note is right and the code regressed. Fix one — never delete
the claim to silence it.

### The bug the checker had, which is the reason it masks comments

The first version reported `LinearTransition` still on the reader's line
wrappers. It was not. The only occurrence in the file was **the comment
explaining its removal**.

> A checker that reads comments as code fails on well-documented code precisely
> *because* it is well documented.

That is the worst possible incentive to build into a tool — it would push future
work toward deleting the explanation rather than keeping it. Comments are now
masked space-for-space, the same way `check-theme.mjs` and `check-reading.mjs`
do it.

**Verified by breaking it:** renamed `visibleUnits` in `learn.jsx` → exit 1 with
two claims red, restored, diffed byte-for-byte, exit 0.

Current: **24/24 claims hold** across the three notes from 2026-09-08/09.
