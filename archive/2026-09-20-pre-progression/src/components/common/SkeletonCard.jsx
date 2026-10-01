import { View } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing,
} from 'react-native-reanimated'
import { useEffect } from 'react'

// A PLACEHOLDER IN THE SHAPE OF THE THING THAT IS COMING.
//
// ⚠️ IT WAS IMPORTED BY ZERO FILES until 2026-09-09 — written, never wired.
// Part of the reason is below: a skeleton that does not move does not read as
// loading. It reads as content that failed, or as a UI someone forgot to
// finish. The pulse is what makes it legible as "wait".
//
// ── When to use this instead of a spinner ───────────────────────────────────
//
//   Skeleton — when you KNOW the shape of what is arriving: a list of rows, a
//              card with a title and a line under it. It holds the layout, so
//              the page does not jump when the data lands.
//   Spinner  — when you do not: a single unknown-duration action, a purchase
//              round-trip, anything where a fake row would be a lie about what
//              is coming back.
//
// The leaderboard is the first case — it is always a list of rows. The paywall
// is the second, so it keeps its spinner.

/**
 * @param lines  how many text bars under the title bar. 1 for a compact row,
 *               2 for a card with a description.
 * @param delay  ms to offset the pulse by. Passing i * 120 down a list makes
 *               the shimmer travel instead of the whole page throbbing at once,
 *               which is the difference between "loading" and "strobing".
 */
export default function SkeletonCard({ className = '', lines = 1, delay = 0 }) {

  const pulse = useSharedValue(0.55)

  useEffect(() => {
    // ⚠️ OPACITY, NOT A MOVING HIGHLIGHT. A travelling shimmer needs a gradient,
    // and this app has no gradient library — faking one with stacked views
    // costs more than the effect is worth. A slow breath reads as "working" on
    // its own.
    // ⚠️ withDelay, NOT a style animationDelay. animationDelay is a CSS
    // property; React Native has no such style prop, so setting it does
    // nothing at all — the whole list would pulse in lockstep and the bug
    // would be invisible in code review.
    pulse.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1,     // forever
        true,   // reverse — so it breathes rather than snapping back to dim
      ),
    )
  }, [pulse, delay])

  const style = useAnimatedStyle(() => ({ opacity: pulse.value }))

  return (
    // ⚠️ className on the plain inner View, never on Animated.View — NativeWind
    // only maps the core components and silently drops it otherwise.
    <Animated.View style={style}>
      <View className={`rounded-md bg-cream-200/60 p-4 ${className}`}>
        <View className="h-5 w-1/3 bg-cream-300/70 rounded mb-3" />
        <View className="h-3 w-2/3 bg-cream-300/50 rounded" />
        {lines > 1 && <View className="h-3 w-1/2 bg-cream-300/50 rounded mt-2" />}
      </View>
    </Animated.View>
  )
}

/**
 * A stack of them, for a list whose length you do not know yet.
 *
 * Six is deliberate: enough to fill a phone screen, so the skeleton occupies
 * the space the real list will and nothing scrolls out from under a thumb when
 * the data arrives.
 */
export function SkeletonList({ count = 6, lines = 1 }) {
  return (
    <View className="gap-3">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} lines={lines} delay={i * 120} />
      ))}
    </View>
  )
}
