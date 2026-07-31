# Aligning the RN design system to the web app (2026-07-25)

After the page port, the RN app still looked "a lot different" from the web app.
Cause: the **design system** (fonts + color tokens) had drifted, not the content.
The canonical source is the web repo — `KawmHmoob/Hmong-Language-App`, verified at
the SAME commit as the local copy we ported from (`887dfd4`), so the difference
was never stale content. The truth lives in that repo's `src/index.css` (tokens)
and `tailwind.config.js` (class → token mapping).

Scope this pass (user's call): **fonts + full light-theme palette**. Dark/Neon
themes were deliberately left for later (the web does them with CSS variables
that flip on `<html>`; RN needs a different mechanism).

## 1. Fonts — the biggest visible gap

The web app uses **Nunito** (rounded; headings + Hmong text, its `font-display`
token) and **Nunito Sans** (quieter body, `font-sans`). The RN config mapped
`serif → Fraunces` and `sans → Inter` — **and neither was ever loaded**, so RN
fell back to a system serif. That's why every heading looked like generic Times
instead of the web's warm rounded face.

Fix:

- `npx expo install expo-font @expo-google-fonts/nunito @expo-google-fonts/nunito-sans`
- `app/_layout.jsx` loads the weights with `useFonts({...})` and holds a seafoam
  splash `View` until they're ready (`if (!fontsLoaded && !fontError) return …`).
  The `!fontError` guard means a font-load failure falls through to system fonts
  instead of hanging on the splash forever.
- `tailwind.config.js` `fontFamily` now points at the loaded weight names:
  - `sans → NunitoSans_400Regular`
  - `serif → Nunito_700Bold`  ← keeps the ~38 existing `font-serif` heading
    usages working with **no rename**; they now render bold Nunito.
  - `display → Nunito_700Bold` (the web's real heading token, for new code)

**RN font-weight caveat:** unlike CSS, RN can't swap the font *file* by
`fontWeight` — each weight is a distinct family name. So the tokens point at
concrete weights (headings = Nunito bold, body = Nunito Sans regular). A
`font-semibold` on a heading won't change the file; headings are 700 in the web
anyway, so this matches. If per-weight body text ever matters, load that weight
and map a dedicated token to it.

## 2. Color palette — `seafoam` was missing, `blush-200` was a trap

The web palette (light-theme values, from `index.css`): `cream, clay, blush`
(a dusty **rose**), `seafoam` (the blue-green **page background**), `ocean`,
`success`, `danger`, `stone`. The RN config had **no `seafoam` and no `ocean`**,
and someone had overwritten **`blush-200` to `#B0E0E6`** — which is actually
**`seafoam-300`** — and used that as the page background. The background color
was right by accident; the token was a lie.

> The web repo's own config comment calls this exact mistake out: *"a token named
> for what it isn't is the blush-200 trap all over again."* We walked straight
> into it.

Fix in `tailwind.config.js` (all hex-for-hex from the web's `:root`):

- **Added** `seafoam` (50–500; `seafoam-300 = #B0E0E6` = the app background),
  `ocean` (50–700), `success` and `danger` (semantic feedback scales).
- **Corrected** `blush-200` back to the real rose `#F2C4BD`.
- **Kept** `emerald`/`red`/`orange` as-is — existing RN screens reference them
  directly (they double as aliases of `success`/`danger`). `clay` keeps its
  extra 100/300/800 tints the RN screens use; 500/600/700 already matched web.

The page background stays painted in `app/_layout.jsx` via `contentStyle`
(`#B0E0E6`, i.e. seafoam-300) because react-navigation's grey theme otherwise
shows through (see `2026-07-23-tab-navigation-fix.md`). `GlobalTabBar`'s accent
`TOKENS.light` were also re-pointed at the real palette hexes (e.g. `clay-600`
was the orange `#D97706`, now the palette's `#9C4F33`).

## What's still different from the web (not done this pass)

- **Dark + Neon themes.** Web ships three themes via CSS variables on `<html>`;
  RN is light-only. Porting them means a token-as-variable layer + a theme
  switch. Sizeable — deferred by choice.
- **Body font family for un-classed text.** Text with no `font-sans` class uses
  the system sans, not Nunito Sans (RN has no CSS cascade to set a global body
  font). Headings — the distinctive part — are covered. A global default would
  need a `Text` wrapper or defaultProps.
- **Component radii / effects.** Web `.surface` = `rounded-xl` (12px), buttons
  `rounded-lg` (8px), plus `hover:`/`backdrop-blur`/gradient/3D-flip niceties
  that are web-only. RN uses `rounded-md`/`rounded` and no hover. Cosmetic.

## Verify

```bash
npx expo start --clear --port 8213
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://localhost:8213/node_modules/expo-router/entry.bundle?platform=web&dev=true"   # 200
# screenshot / → headings render in rounded Nunito, background seafoam.
```

Last verified 2026-07-25: web bundle 200, no font/app/src resolution errors;
home screenshot shows Nunito headings on the seafoam background, font gate
resolves (page renders, no hang). Device/Expo Go pass still recommended.
