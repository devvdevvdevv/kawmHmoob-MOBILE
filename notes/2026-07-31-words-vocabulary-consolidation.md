# Bottom tab: Vocabulary → Words hub (2026-07-31)

## Why

The bottom "Vocabulary" tab opened `/vocabulary` — the bare category GRID — while
the richer `/words` hub (streak/XP/reviews stats, today's SRS session, and
"Drill another way" tiles) was only reachable from the Home "Words" door. They felt
redundant. Consolidated so the primary vocab tab is the Words hub.

## Change (one line)

`src/components/GlobalTabBar.jsx` — the `vocabulary` section now points at the
Words hub and is labeled "Words":

```js
{ id: 'vocabulary', to: '/words', label: 'Words', icon: CardsIcon, ind: '--c-blush-500',
  match: (p) => ['/vocabulary','/words','/quiz','/notebook','/review','/search'].some(r => p.startsWith(r)) }
```

- `to`: `/vocabulary` → `/words`
- `label`: `Vocabulary` → `Words`
- `id` kept `vocabulary` (drives the active-indicator index) and `match` unchanged,
  so the tab still lights up across /words, /vocabulary, /quiz, /notebook, etc.

## Nothing broke

- The category grid still lives at `/vocabulary` (`app/(tabs)/vocabulary.jsx` →
  `VocabCategoryGrid`) and is reached from the Words hub's "Browse words" tile.
- Category detail (`/vocabulary/[categoryId]`), Home's "Words" door, and the
  Explore "Vocabulary" link all still resolve.

## If you'd rather

- Keep the label "Vocabulary" (just change `label` back) — the tab would still open
  the Words hub.
- Fully retire the standalone grid later by moving `VocabCategoryGrid` under the
  Words hub as a section instead of a separate route.
