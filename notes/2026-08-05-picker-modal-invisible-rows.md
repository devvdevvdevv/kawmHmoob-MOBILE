# 2026-08-05 — Picker modal rows invisible ("modal buttons don't show up")

## Cause
Inside a RN `<Modal>`, NativeWind's theme CSS variables don't cascade — the Modal
is a separate native root, so the css-interop VariableContext + `--c-*` tokens
don't reach it. Color classes like `bg-cream-50`, `border-cream-200`,
`text-stone-800` therefore silently no-op.

`src/components/ui/Picker.jsx` was the ONE modal still styling its interactive
rows (and card/backdrop) with `className`, so its option rows rendered with no
background/border and (near-)invisible text — i.e. "the buttons don't show up."
The other modals (ConfirmModal, InfoModal, WelcomeTour) already followed the
app convention of INLINE styles from theme tokens, so their buttons were fine.

## Fix
Rewrote `Picker.jsx` to use inline styles from `THEME_TOKENS[theme]` (same
pattern as ConfirmModal/InfoModal): trigger, backdrop, card, and each option row
(selected/pressed → cream-100). No `className` anywhere inside the Modal.
Validated with `npx expo export` (to scratchpad, outside the project so it can't
disturb Metro's file watcher).

## Rule of thumb (reinforced)
NEVER use `className` for anything inside a RN `<Modal>` in this app — inline the
colors from `THEME_TOKENS`. Static layout utilities may work, but color/theme
classes won't. See also [[nativewind-text-color-inline]].

## If the OTHER modals also show missing buttons
Those use bulletproof inline styles, so styling isn't the cause. That would point
to a New-Architecture RN `<Modal>` layout/touch issue (RN 0.81 + Fabric). The
app already has a working non-Modal overlay pattern (DrawerHost / CelebrationOverlay
use root absoluteFill overlays) — converting the modals to that pattern would be
the fallback. Needs a device repro (missing vs invisible vs untappable) first.
