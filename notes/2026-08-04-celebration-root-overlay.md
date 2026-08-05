# Celebration confetti → root-level overlay (top z, centered) (2026-08-04)

## Problem (3rd pass on this)

The lesson-complete confetti kept being wrong:
- Modal version → glitchy confetti.
- In-screen overlay version → sat UNDER the floating header/tab bar (low z), and was
  clipped to the right (constrained by the screen's centered max-width column).

Root cause of the last two: it was rendered INSIDE the screen. The header/tab bar
are rendered by the root layout AFTER the `<Stack>`, so nothing inside a screen can
z-index above them; and the screen's content column isn't the full viewport.

## Fix: render the celebration ONCE at the root, above everything

- `src/context/CelebrationContext.jsx` — global state: `celebrate(title, onDone?)`
  and `dismiss()`.
- `src/components/common/CelebrationOverlay.jsx` — reads that state; renders a
  full-viewport `StyleSheet.absoluteFill` overlay (`zIndex/elevation 9999`) with
  `<Confetti/>` (normal tree → animates) behind a centered card. Colors inline;
  button = raw Pressable.
- `app/_layout.jsx` — `<CelebrationProvider>` wraps `ThemedShell`, and
  `<CelebrationOverlay/>` is rendered **LAST in ThemedShell** (after GlobalHeader /
  GlobalTabBar / DrawerHost / WelcomeTour) so it's on top of the floating bars.
- `app/learn/[unitId]/[lessonId].jsx` — finishing the last step now calls
  `celebrate(lesson.title, () => router.push('/learn/${unit.id}'))`; removed the
  local `showComplete` state, the Fragment, and the old `LessonCompleteModal`
  (file deleted).

Net: confetti is on top of the whole app, centered on the viewport, full-width (no
right clip), and animates cleanly.

## Note

The 100%-quiz confetti in `QuizResults` is separate (inline in its card) and was
left as-is. If you want that one on top too, route it through `celebrate()` as well.

## Verify
Finish a lesson (Continue/Finish path): confetti fills the whole screen ABOVE the
header + tab bar, the "completed [lesson]" card is centered, and "Back to lessons"
returns to the unit.
