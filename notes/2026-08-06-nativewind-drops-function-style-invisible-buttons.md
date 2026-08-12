# NativeWind drops function-form `style` → invisible buttons (2026-08-06)

## Symptom
On the DEV BUILD (native), modal buttons were invisible: the "Got it / Next / Back /
Maybe later" buttons rendered nothing, while the "×" and "Skip" showed fine. Web
looked correct. Reloading didn't help. Cost hours of chasing the wrong causes
(Modal type, statusBarTranslucent, safe area, flexShrink, percentage maxHeight —
ALL red herrings).

## Root cause
With `jsxImportSource: 'nativewind'` (babel.config), every RN component is a
NativeWind component. **NativeWind drops the FUNCTION form of the `style` prop on
native** — `style={({ pressed }) => ({...})}`. A Pressable whose visible styling
(backgroundColor / flex / minHeight / padding) lived ONLY in that function got NO
styles → collapsed to zero size → invisible.

The tell (from a screenshot): elements with a STATIC `style={{...}}` object rendered
(×, Skip, the dots, the card); every element with a `style={(...)=>({...})}` FUNCTION
did not. Almost certainly regressed in the SDK 51→54 bump
([2026-08-03-sdk-51-to-54-migration]).

## The mechanism, precisely

1. `babel.config.js` sets `jsxImportSource: 'nativewind'`. That rewrites EVERY JSX
   element in the app to a NativeWind-wrapped component — even a plain
   `<Pressable>` you think is "raw React Native." NativeWind is now in the middle of
   every element's props.
2. NativeWind's job is to read `className`, turn it into styles, and MERGE that with
   any `style` you passed. To merge, it needs `style` to be a value it can read — an
   object or an array of objects.
3. A `style` FUNCTION (`({ pressed }) => ({...})`) is React Native's own API for
   press-reactive styling. NativeWind's prop pipeline does not preserve/forward that
   function on native, so the function never reaches the underlying RN Pressable.
4. Result: the Pressable renders with `style === undefined`. If ALL of its visible
   styling (backgroundColor, flex, minHeight, padding) was in that function, it now
   has NONE → it lays out at zero size → you see nothing. A `<Text>` child with its
   own static style may still exist but has no box around it and no room.

Why the survivors survived:
- `×`, `Skip`, the dots, the card: all use a STATIC `style={{...}}` object →
  NativeWind reads and forwards it → they render.
- Shared `Button` / `SurfaceLink`: their box comes from `className`; the `style`
  function only added press-opacity. Losing a cosmetic opacity ≠ invisible.

## The debugging journey (each wrong turn, and why it was wrong)

Recorded so the reasoning isn't lost — most of these SOUNDED right and were not:
- **"Horizontal ScrollView eats the footer"** → real for the first swipe attempt, but
  removing it didn't fix it → not the core bug.
- **"flexShrink defaults differ web(1)/native(0)"** → a true fact, but the buttons
  were missing even for SHORT content that never overflowed → not it.
- **"`maxHeight: '82%'` percentage fights native"** → plausible; switching to a
  concrete pixel height didn't help → not it.
- **"`statusBarTranslucent` hides content under the Android nav bar"** → the best
  wrong theory (fit "top shows, bottom hidden"); removing it + safe-area padding
  didn't help → not it.
- **"RN `<Modal>` is broken on this build, use an overlay View like Celebration"** →
  Celebration ALSO had no button (later shown to be the SAME function-style bug, not
  the Modal) → not it. (This detour also introduced a syntax error that broke the
  whole bundle, which made every reload show stale code — compounding the confusion.)
- **What actually cracked it: a SCREENSHOT.** Static-styled elements rendered;
  every function-styled button did not. That one correlation named the cause. Lesson:
  ask for a screenshot of a visual bug EARLY instead of reasoning in the dark.

## The rule
**Never put a Pressable's visible styling in a `style` FUNCTION. Use a static
`style={{...}}` object.** A function `style` is fine ONLY for a cosmetic press effect
WHEN the visible styling comes from `className` (as in the shared `Button` and
`SurfaceLink` — those were fine).

## Fixed (function → static object)
`PageInfoModal`, `InfoModal`, `WelcomeTour`, `CelebrationOverlay`, `ConfirmModal`,
`Picker`. (Dropped the press-dim animation; visibility > animation. Re-add press
feedback via `className="active:opacity-80"` if wanted.)

Not affected: `Button.jsx`, `Surface.jsx` — visible styles come from `className`, so
the function only carried press opacity.

## If you add a modal/button later
Style it with a static object, or with `className`. If a button ever renders
invisible on device but fine on web, this is the first thing to check. Relates to the
inlined-modal-buttons work in [2026-08-04-modal-buttons-and-box-style] and the
[2026-08-06-header-page-info-button] modal saga.
