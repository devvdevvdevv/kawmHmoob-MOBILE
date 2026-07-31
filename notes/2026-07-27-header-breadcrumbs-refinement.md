# Header + breadcrumbs refinement (2026-07-27)

Small UI polish pass after the header got its SVG icons.

## Header (`src/components/GlobalHeader.jsx`)

- **Bigger** — `HEADER_CONTENT_HEIGHT` 52 → **64**, icons 18 → **23px**
  (`TabScreen` reads the exported height, so top clearance auto-tracks it).
- **Wordmark removed** — "Kawm Hmoob" is redundant in a mobile app. The bar is
  now a clean **status-left / utilities-right** split:
  - Left cluster: `LevelBadge` (→ pass) + `StreakBadge`.
  - Right cluster: Tiers (pass), Trophy (leaderboard), theme toggle
    (Sun/Moon/Spark), Search, Settings, Person (account).
- **Spaced out** — removed the dividers; the right cluster uses `gap: 10` and the
  bar has `paddingHorizontal: 16`, so the icons breathe. `justifyContent:
  'space-between'` pushes status and utilities to opposite edges. Freeing the
  wordmark's width is what makes room for the spacing (no more clipping).
- Everything stays theme-aware (icon stroke = `tok(theme, --c-stone-800)`, active
  route = `--c-clay-600`) and navigates via `router.navigate()` on Pressables.

## Breadcrumbs (`src/components/common/Breadcrumbs.jsx`)

Ported the web Breadcrumbs' two missing pieces:

- **"← Back" button** — a crisp `react-native-svg` left-arrow + "Back", linking to
  the page's **tree parent** (the nearest ancestor crumb that has a `to`:
  `items.slice(0,-1).reverse().find(it => it.to)`). Linking to the tree parent —
  not `history.back()` — is predictable: "up" is always the same place. Shows only
  when a parent exists (every child page that renders Breadcrumbs).
- **Bigger** — trail text `text-sm` → **`text-base`**; a `|` separates the Back
  button from the trail, `/` between crumbs (unchanged).
- The arrow color is themed (`--c-stone-700`); trail colors already themed.

Affects every screen that renders Breadcrumbs (lesson, unit, quiz, speak
detail, contact, tone-eval, notebook via tabs, etc.).

## Verify

```bash
npx expo start --port 8231
# /quiz → header shows Lv+streak on the left, spaced icons on the right (no
#          wordmark); breadcrumbs read "← Back | Home / Words / Quizzes", bigger.
```

Last verified 2026-07-27: bundle 200, screenshot confirmed both. Device pass still
recommended.

## Watch out (dev-server hygiene)
Repeated `npx expo start` launches this session piled up node processes until the
machine couldn't fork ("Resource temporarily unavailable"). Kill node between
runs (`Stop-Process -Name node -Force` in PowerShell — it doesn't hit the bash
fork limit) and keep ONE server.
