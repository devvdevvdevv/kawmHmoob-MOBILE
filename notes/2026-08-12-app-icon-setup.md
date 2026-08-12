# App icon wired (icon + Android adaptive) (2026-08-12)

The paj-ntaub / elephant-foot mark is now the app icon.

## Files (in `assets/`)
- `icon.png` — full-bleed mark on seafoam background. iOS + fallback.
  (was `KawmHmoobIconLogoPng.png` — renamed.)
- `adaptive-icon.png` — the Android **foreground** layer (mark padded into the center
  safe zone). (was `adaptive-icon.png.png` — **had a double `.png`**, renamed.)

## `app.json`
```jsonc
"icon": "./assets/icon.png",
"android": {
  "adaptiveIcon": {
    "foregroundImage": "./assets/adaptive-icon.png",
    "backgroundColor": "#B0E0E6"   // seafoam-300 = the app's page bg → masked edges blend
  }
}
```
`#B0E0E6` is `seafoam-300` (rgb 176 224 230) from `themes.js` — the same pale aqua as
the app background, so whatever the adaptive mask crops shows the same color.

## Concepts (why two files)
Android composites **background color + foreground image**, then a device-specific mask
(circle / squircle / rounded-square) crops the result. Only the center **~66%** is
guaranteed visible, so the foreground's mark must sit inside that safe circle with
transparent padding around it. The full-bleed `icon.png` is for iOS (its own rounded
mask) + as the generic fallback.

## Must do to see it
Icons bake in at BUILD time — a JS reload won't show them:
```
npx expo prebuild --clean
# then a fresh build (eas build --profile production, or run:android)
```

## Verify
On the home screen with a **circular** icon mask, the outer petals should be **whole,
not clipped**. If they're clipped, `adaptive-icon.png` needs the mark scaled smaller
(more transparent padding — keep it within the center 66%).

Related: [2026-08-06-launch-prep-account-readings-quiz-eas] (the rest of the launch
checklist).
