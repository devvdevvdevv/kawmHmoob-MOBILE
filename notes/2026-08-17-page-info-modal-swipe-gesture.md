# PageInfoModal: touch-swipe between slides (2026-08-17)

Follow-up to `2026-08-06-header-page-info-button.md`, which ended with "if real
swipe is wanted later, use `react-native-gesture-handler`, NOT a raw ScrollView."
This is that. Back/Next + dots still work; swipe is added alongside them.

⚠️ **NOT YET VERIFIED ON DEVICE** — the dev build had to be uninstalled to make
room for the Play Store testing APK, and gesture-handler behaves differently on
web, so web testing proves nothing here. Reinstall the dev build before trusting
any of this.

## The pieces

```js
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated'
```

- `tx = useSharedValue(0)` — drag distance in px, lives on the UI thread.
- `goTo(i)` — `setIndex(Math.max(0, Math.min(count - 1, i)))`. Clamps, so callers
  can pass any number and overshooting at either end is a no-op instead of a crash.
- `Gesture.Pan()` with `.activeOffsetX([-10, 10])` — only claims the gesture on a
  HORIZONTAL drag, so the vertical body ScrollView still scrolls.
- `slideStyle = useAnimatedStyle(...)` — `translateX: tx.value`, so the card
  follows the finger; `tx.value = withTiming(0)` in `onEnd` springs it back.

## Three things that are easy to get wrong

### 1. Hooks can never sit behind an early return

The `if (!visible || count === 0) return null` guard used to be near the top. With
`useSharedValue` / `useAnimatedStyle` added BELOW it, React saw 5 hooks while the
modal was closed and 7 while open → **"Rendered more hooks than during the previous
render."**

**Fix: the guard moved below the last hook.** `s` and `paras` stay below it too
(they'd throw on an empty `slides` array). RULE: in any component, every hook runs
before the first conditional return, always.

### 2. `-THRESH` — translationX is signed

`e.translationX` is negative for a left swipe, positive for a right swipe. `THRESH`
is stored as a plain positive distance (60), and the DIRECTION comes from the sign
at the comparison:

```js
if (e.translationX <= -THRESH && index < count - 1) runOnJS(goTo)(index + 1)   // left → next
else if (e.translationX >= THRESH && index > 0)    runOnJS(goTo)(index - 1)   // right → prev
```

One constant, two directions. Comparing against a bare `THRESH` on the left branch
would fire on essentially every drag.

### 3. `runOnJS(goTo)(index + 1)` — two sets of parens, and both are needed

`onEnd` runs on the UI thread; `setIndex` is React state on the JS thread.
`runOnJS(goTo)` WRAPS and returns a new function — it doesn't call anything. The
second `(...)` is the actual call, with the argument. Calling `setIndex` directly
from a worklet is the classic silent failure.

Also: `goTo` needs `index + 1`, not bare `goTo`. It means "go to slide N", not "go
forward" — it has no idea where you currently are. And `count - 1` is the last
valid INDEX (3 slides → indexes 0,1,2), which is unrelated to `i - 1`.

## GestureHandlerRootView placement — differs from the guide

`learning/ui-patterns/modal-swipe-gesture-guide.md` says put it INSIDE the
`<Modal>`. That guidance has two reasons, and only one applies here:

- ✅ **App root has none.** `app/_layout.jsx` has no `GestureHandlerRootView`, so
  nothing above the detector is a gesture root. Still true — this is why one is needed.
- ❌ **RN `<Modal>` is a separate native window.** Doesn't apply. `PageInfoModal`
  is deliberately NOT an RN `<Modal>` (see the 08-06 note — its buttons rendered
  under the system nav bar); it's a plain absolute-fill View in the main tree.

**So: the overlay's outermost `<View>` BECAME the `<GestureHandlerRootView>`.** It
renders a View and takes the same `style`, so it's a swap, not extra nesting — the
`absoluteFill` + `zIndex/elevation: 9999` overlay styles moved onto it unchanged.

If swipe is ever wanted on non-modal screens, add a root one in `_layout.jsx`
instead and revert this to a plain View.

## Still to check on the dev build

- [ ] Swipe actually fires (nothing above it is a gesture root on Android otherwise).
- [ ] Vertical scrolling still works on a long slide body — the pan and the
      ScrollView share the same area; `activeOffsetX` is the only thing separating them.
- [ ] Footer buttons still visible — the `flexShrink: 1` trap from the 08-06 note
      is exactly the kind of thing new nesting can reintroduce.
- [ ] If gestures act dead after edits, restart Metro with `-c` (reanimated babel
      plugin must stay LAST in `babel.config.js`).
