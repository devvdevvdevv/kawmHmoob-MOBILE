# Search: alphabet results link to Reference, not the placeholder (2026-08-06)

## Problem
Search (`GlobalSearch.jsx`) indexed alphabet letters/vowels/tones and linked them to
`/alphabet/consonants|vowels|tones` — the **placeholder** alphabet pages. The real,
maintained alphabet content lives in the **Reference** tabbed page
(`app/(tabs)/reference.jsx`, tabs: consonants / vowels / tones / grammar / search).
So tapping an alphabet search hit sent users to a dead placeholder.

## Goal
Alphabet hits should open the **Reference** page on the right tab, **while still
appearing as their own "Alphabet" group** in search results (not merged into
Reference/other kinds).

## Fix (two parts)

1. **Reference page is now deep-linkable by tab.** `app/(tabs)/reference.jsx` reads a
   `?tab=` param via `useLocalSearchParams()`:
   - seeds `useState(validTab(tabParam) || 'consonants')`,
   - and an effect re-syncs `tab` if the param changes while the screen is already
     mounted (e.g. tapping a result from the Reference → Search tab itself).
   - `validTab()` guards against a bad param (only the 5 real tab ids pass), so a junk
     `?tab=` can't break the page.

2. **Search links repointed.** In `GlobalSearch.buildIndex()`, the alphabet items'
   `to` changed:
   - `/alphabet/consonants` → `/reference?tab=consonants`
   - `/alphabet/vowels`     → `/reference?tab=vowels`
   - `/alphabet/tones`      → `/reference?tab=tones`

## Why it keeps "separateness in search"
The items keep `kind: 'alphabet'`, so search still groups them under the **Alphabet**
heading (`KIND_LABEL.alphabet`). Only the *destination* changed, not the grouping —
alphabet is still its own searchable domain; it just lands on the real page now.

## Notes / follow-ups
- The placeholder `/alphabet/[tab]` route still exists but is no longer linked from
  search. Can be retired later if nothing else points to it.
- Deep-linking a tab relies on the Reference page owning tab state locally (not the
  URL). The param seeds/syncs that state; the tabs remain user-clickable.
- Same `GlobalSearch` renders at `/search` (drawer) and the Reference Search tab, so
  this fix applies to both automatically.
