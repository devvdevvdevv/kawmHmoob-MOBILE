# Learning: add real swipe to PageInfoModal (gesture-handler + reanimated)

Goal: bring back touch-swipe on the multi-slide help modal — the RIGHT way this
time (a Pan gesture), not the horizontal-ScrollView hack that broke the footer on
native (see [[2026-08-06-header-page-info-button]]). You keep Back/Next as the
fallback; swipe is an enhancement on top.

Everything needed is already installed: `react-native-gesture-handler`,
`react-native-reanimated` (v4), and the `react-native-worklets/plugin` in
`babel.config.js`. No new deps.

---

## The one concept that makes this work: a Modal is its own native root

Gesture-handler only sees gestures inside a **`GestureHandlerRootView`**. Your app
root (`app/_layout.jsx`) does NOT have one, and — even if it did — a React Native
`<Modal>` renders in a **separate native window**. Gestures registered in the main
tree do NOT reach inside a Modal.

**So the rule: wrap the Modal's CONTENT in its own `<GestureHandlerRootView>`.**
This is the single thing people miss; without it, your Pan gesture silently never
fires and you'll think the code is wrong when it's just in the wrong root.

```
<Modal ...>
  <GestureHandlerRootView style={{ flex: 1 }}>   ← REQUIRED, inside the Modal
    ...overlay + card...
  </GestureHandlerRootView>
</Modal>
```

(You do not need to touch `_layout.jsx`. Wrapping inside the Modal is enough for the
modal's own gestures. If you later want swipe on NON-modal screens too, then add a
root `GestureHandlerRootView` at the top of `_layout.jsx`.)

---

## The moving parts (what each library does)

- **gesture-handler** — recognizes the finger drag. You describe a `Gesture.Pan()`
  and attach it with `<GestureDetector>`.
- **reanimated** — moves the slide with the finger at 60fps on the UI thread (not
  JS), so it feels native. You store the drag offset in a `useSharedValue` and map
  it to a `transform: translateX` via `useAnimatedStyle`.
- **runOnJS** — the bridge back. Gesture/animation callbacks run as *worklets* on the
  UI thread; to call a normal JS function from them (like your `setIndex`), you must
  wrap it: `runOnJS(setIndex)(next)`. Forgetting this = a crash/silent no-op.

---

## The shape to build (you write it)

Imports:
```js
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
```

State/values inside the component:
```js
const tx = useSharedValue(0)                 // how far the slide is dragged, in px

const goTo = (i) => setIndex(Math.max(0, Math.min(count - 1, i)))  // clamp at ends

const pan = Gesture.Pan()
  .activeOffsetX([-10, 10])                  // only start on a horizontal drag
  .onUpdate((e) => { tx.value = e.translationX })     // follow the finger
  .onEnd((e) => {
    const THRESH = 60                        // px needed to count as a swipe
    if (e.translationX <= -THRESH && index < count - 1) runOnJS(goTo)(index + 1)
    else if (e.translationX >= THRESH && index > 0)     runOnJS(goTo)(index - 1)
    tx.value = withTiming(0)                 // snap back to center either way
  })

const slideStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }))
```

Wrap the SLIDE (the vertical ScrollView + its content) in the detector + animated
view:
```jsx
<GestureDetector gesture={pan}>
  <Animated.View style={slideStyle}>
    {/* the current slide's ScrollView / title / body — unchanged */}
  </Animated.View>
</GestureDetector>
```

Then, as said above, wrap the whole Modal body in `<GestureHandlerRootView style={{ flex: 1 }}>`.

---

## Keep it robust

- **Keep Back/Next + dots.** Swipe is additive; buttons are the guaranteed path and
  your accessibility/web story. Don't remove them.
- **Clamp at the ends** (the `goTo` min/max) so a swipe past slide 0 or the last
  slide just rubber-bands back instead of showing blank.
- **Footer stays a sibling of the gesture area**, not inside it — you're animating
  only the slide body, so the buttons never move and never get clipped (the bug you
  already fixed).
- **`activeOffsetX`** keeps a vertical scroll (long slide body) from being hijacked
  by the pan — horizontal drags swipe, vertical drags scroll.

## Gotchas checklist

- [ ] `GestureHandlerRootView` is INSIDE the `<Modal>` (the #1 miss).
- [ ] `setIndex` is called via `runOnJS(...)` from `onEnd`, never directly.
- [ ] Reanimated worklets rely on the babel plugin being LAST in `babel.config.js`
      (it already is) — if gestures act dead after edits, restart Metro with `-c`.
- [ ] Test on the DEV BUILD, not web — gesture-handler behaves differently on web.

## Optional polish (later)

- Animate the OUTGOING + INCOMING slide together (translate a row of two) for a true
  carousel feel — bigger change; the single-slide translate above is the simple,
  reliable v1.
- A little `withSpring` instead of `withTiming` for a bouncier snap-back.

Reference the current modal it plugs into: `src/components/common/PageInfoModal.jsx`.
