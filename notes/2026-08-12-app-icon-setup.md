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

---

## Fix: foreground was oversized (2026-08-18)

**Symptom:** on the home screen the icon looked "way too big" — the outer petals ran
to the edge of the circular mask and got clipped.

**Measured cause.** The foreground art's content diameter was **72.5% of the canvas**
against a **66% safe zone**. The trap is that the adaptive canvas is 108dp but only
~72dp survives the mask — a **1.5x visual zoom**. So 72.5% x 1.5 ~= 108% of the
visible tile: the art was mathematically guaranteed to overflow.

Bounding box alone is misleading; the number that matters is the **radius of the
farthest opaque pixel from center**, since the mask is a circle.

**Fix.** Scaled the art to 0.828x and re-centered on the same 1024x1024 transparent
canvas → content diameter now **60.2%**, comfortably inside the safe zone.

- `assets/adaptive-icon.png` — corrected (60.2%).
- `assets/adaptive-icon-oversized-backup.png` — the previous 72.5% version, kept in
  case the smaller mark reads as too timid on device.

`icon.png` was NOT touched: full-bleed and fully opaque is CORRECT for iOS (iOS
applies its own rounded mask and forbids transparency). Only the Android adaptive
foreground needs the safe-zone padding.

⚠️ Still needs `npx expo prebuild --clean` + a fresh build — icons bake in at BUILD
time, a JS reload will not show this.
