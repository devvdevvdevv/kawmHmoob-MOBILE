# Modal buttons inlined + global box style (softer radius, bolder border) (2026-08-04)

## 1. Modal buttons → raw inline Pressables (InfoModal + ConfirmModal)

The Speak beta notice (InfoModal) and the quit-quiz dialog (ConfirmModal) still
routed their buttons through the shared `<Button>`, which — inside a RN `<Modal>` —
renders white/wrong (the theme CSS vars don't cascade into a modal's separate native
root, and the shared Button is cache-prone). Same problem the WelcomeTour "Next"
button had.

Fixed both by dropping the shared `<Button>` and using **raw inline `Pressable`s**
with colors from theme tokens (the proven WelcomeTour pattern):
- `InfoModal`: primary = clay-600 bg + cream text; secondary = cream-200 border +
  stone-800 text.
- `ConfirmModal`: cancel = outlined; confirm = clay, or a static red `#dc2626` when
  `destructive` (danger should read as danger in any theme).
- Removed the `import Button` from both.

Now every modal button (tour, Speak notice, quit-quiz) is a solid, visible button
regardless of caching or modal-root issues.

## 2. Global box style — softer radius + bolder border

Done in ONE place — `tailwind.config.js` `theme.extend` — so every card/box updates
at once (they all share `rounded-md ... border ...`):
```js
borderRadius: { md: '0.625rem' /*~10px, was 6px*/, lg: '0.875rem', xl: '1.125rem' },
borderWidth:  { DEFAULT: '2px' /* was 1px */ },
```
- `rounded-md` (the app-wide card corner) is now a softer ~10px roundrect — gentler,
  still clearly rectangular, not pill-round.
- `border` is now 2px everywhere it's used — boxes read as more defined/bolder.
- Buttons (`rounded`) and pills (`rounded-full`) are unaffected by the md change.
- The modal cards (InfoModal/ConfirmModal/WelcomeTour) set radius/border inline; I
  bumped those inline `borderWidth` to 2 to match.

## ⚠️ Requires a cache-clear to see

Tailwind config changes are baked at bundle time — **`npx expo start -c`** (not a
plain reload) to pick up the new radius/border. (Validated with `expo export`.)

## 3. Regression fix: shared Button went invisible (bg in a style function)

After the tour work, the shared `Button` had its background moved into the inline
`style` FUNCTION (`({pressed}) => ({ backgroundColor })`). **NativeWind ignores a
`style` function when `className` is also present** — so the background silently
dropped and every non-modal button (Speak prev/next, Words "Start session", etc.)
rendered transparent → invisible cream text.

Fix: background/border back in `className` (variant `base`, e.g. `bg-clay-600`),
text color inline on the child `<Text>`, `min-h-[44px]` via className, and the
`style` function reduced to pressed-opacity only. Safe because the shared `Button`
is NEVER used inside a `<Modal>` (verified — modals use raw Pressables), so the
className-bg-fails-in-a-modal issue doesn't apply to it.

Rule recorded in memory [[nativewind-text-color-inline]]: **never put bg in a
`style` function alongside `className`.**

## Verify
- Speak buttons (prev/next, Practice, Mark practiced) and Words "Start session" are
  solid/visible again.
- Speak → first visit: the notice modal's "Got it" is a solid brown button.
- Quiz → "QUIT QUIZ": the dialog's Quit is red, Keep going is outlined.
- Every card (Home, Learn, Words, Reference, lists) has softer corners + a bolder
  2px border.
