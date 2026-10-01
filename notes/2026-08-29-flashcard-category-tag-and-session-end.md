# Flashcard category tag + session complete screen (2026-08-29)

Two changes to the study flow: flashcards now say which category a word came from,
and the end-of-session screen is a centered card with confetti and one way out.

## 1. Category tag on every flashcard

### Why

Hmong reuses one spelling across senses — which meaning a card is testing often
depends entirely on the domain it came from. That was survivable when you only met
flashcards inside a category (`/vocabulary/<cat>` study mode, where the heading told
you). It isn't, because three other screens feed the SAME component a **shuffled,
cross-category deck**:

| Screen | Deck |
|---|---|
| `app/words/session.jsx` | today's SRS queue — every category mixed |
| `app/review.jsx` | due reviews — same |
| `app/notebook/[tab].jsx` | saved words — same |

In those, a bare `tsev` on a card is genuinely ambiguous. The tag removes the
ambiguity without giving the answer away.

### How

`CategoryTag` in `src/components/vocabulary/Flashcard.jsx`, absolutely positioned
bottom-right, rendered on **both faces** (either can be facing up — same reasoning
as the status badge in the opposite corner).

- Color: `--c-stone-500` — the same gray as "Tap to flip".
- Size: 12px (the "Tap to flip" line is 14px), so it reads as a caption, not a label.
- Inline styles + theme tokens, **not className** — NativeWind's interop is
  unreliable on the animated card faces (same reason `StatusBadge` does it).
- `numberOfLines={2}`, `maxWidth: '62%'`, right-aligned. Some titles are long and
  bilingual — "Tsev Neeg — Family (Female Speaker)",
  "Hmoob Cov Cuab Yeej — Tools & Household Items" — and truncating mid-phrase would
  throw away the half that does the disambiguating.

Source of the title: `getCategory(word.category)?.title`. Verified against the data —
**all 523 words across 46 categories carry a `category` id, none missing, no
duplicate word ids** — so the lookup never comes up empty in practice, and the tag
is skipped rather than rendering blank if it ever does.

## 2. Session complete screen

`SessionEnd` in `app/words/session.jsx` — shared by "Session complete! 🎉" and
"All caught up."

| Was | Now |
|---|---|
| Full-width panel pinned to the top of a scrolling page | Card centered on the screen, `max-w-md` |
| No confetti | `<Confetti />` on completion (`celebrate` only) |
| Two buttons: Back to Words + bonus drill / browse | Just **Back to Words** |

### How the centering works

`<TabScreen scroll={false}>` renders a `flex: 1` column instead of a ScrollView, so
the child can claim the full height; `flex-1 justify-center items-center` then
centers the card vertically, and TabScreen's own `alignItems` centers it
horizontally. In the scrolling variant a child can't center vertically — the content
container only grows to fit its content.

Confetti is mounted on the **column**, not inside the card, so pieces fall across the
full width instead of a narrow ribbon. It's `pointerEvents="none"` and self-removes
when the last piece lands, so it never blocks the button.

The second button is commented, not deleted (restore hint in place). The
"All caught up" copy lost its "Browse vocabulary to go deeper" line, since that
button no longer exists.

## Verify

- Open a word from the daily session or notebook → category title in the bottom-right
  corner, gray, on both the Hmong and English faces.
- A long-titled category (Family, Tools) wraps to two right-aligned lines and doesn't
  collide with the card's centered content.
- Finish a session → card sits in the middle of the screen, confetti falls once and
  disappears, one "Back to Words" button.
- Start a session with nothing due → same centered card, no confetti.
