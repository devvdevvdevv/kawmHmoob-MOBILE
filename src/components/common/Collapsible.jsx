import { useCallback, useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import Icon from '../ui/Icon.jsx'

// A reusable accordion: a tappable title row + a body that shows only when open.
// The component owns the open/close state; the caller supplies the body as
// `children` (the children pattern — same shape as most accordion/menu components).
//
//   <Collapsible title="Why create an account?">
//     {REASONS.map((r, i) => <Row key={i} text={r} />)}
//   </Collapsible>
//
// See learning/ui-patterns/collapsible-dropdown-lesson.md.
//
// ── ⚠️ REWRITTEN ON REANIMATED — 2026-10-14 (author: "add a smooth animation
// that showcases it going down, rather than the basic collapsible") ──────────
//
// It used to be `LayoutAnimation.configureNext()` plus `{open && children}`.
// That works, but it is a BLUNT tool and it showed:
//
//   · LayoutAnimation animates whatever the next layout pass happens to change,
//     everywhere on screen — you cannot choose the curve per element, and a
//     sibling re-layout gets dragged into the same animation.
//   · It is a no-op on react-native-web, so the drawer just snapped there.
//   · `{open && children}` means the body does not exist until the tap, so
//     there is nothing to animate FROM: the height jumps from 0 to full in one
//     frame and only the surrounding layout eases. That is the "basic" feel.
//
// This version animates ONE value on the UI thread, and everything derives from
// it: height, opacity, and the chevron. The body stays mounted and is clipped,
// which is what makes both directions smooth.
//
// ⚠️ style, NEVER className, on a Reanimated.View — NativeWind does not process
// className on third-party animated components. Same rule as
// QuizSettingsSheet.jsx; see learning/concepts/nativewind-classname-on-third-party.md.

// 240ms: long enough to read as a movement, short enough that a learner opening
// four intros in a row is not waiting on it. `Easing.out(cubic)` starts fast and
// settles — the curve that feels like something falling into place rather than
// being dragged.
const DURATION = 240
const CURVE = Easing.out(Easing.cubic)

// ⚠️ `subtitle` AND `titleClassName` ARE OPTIONAL, AND THAT IS DELIBERATE —
// 2026-10-14 (author: "increase the title size for each lesson… add a subtitle
// that shows 'Drop down to learn more' — make it so that disappears once the
// lesson collapsible drop downs").
//
// Three screens share this component: the path unit's lesson intro, the Words
// hub's stats, and SentenceWords. Only the LESSON wanted a bigger title and a
// prompt — a stats row that said "drop down to learn more" would be lying. So
// both are opt-in and the other two callers were not touched.
export default function Collapsible({
  title,
  subtitle,
  titleClassName = 'text-lg font-semibold text-clay-700',
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen)
  // The measured height of the body. 0 until the first layout pass reports it.
  const [height, setHeight] = useState(0)
  // The subtitle's own measured height, so it can collapse out of the layout
  // rather than just fading and leaving a gap. Same measure-then-animate trick
  // as the body below.
  const [subHeight, setSubHeight] = useState(0)
  // ⚠️ ONE shared value drives the whole animation: 0 = closed, 1 = open. Height
  // and opacity and rotation all read it, so they cannot drift out of step the
  // way three separate timings would.
  const progress = useSharedValue(defaultOpen ? 1 : 0)

  const toggle = useCallback(() => {
    setOpen((wasOpen) => {
      progress.value = withTiming(wasOpen ? 0 : 1, { duration: DURATION, easing: CURVE })
      return !wasOpen
    })
  }, [progress])

  // ⚠️ KEEPS THE ANIMATION HONEST WHEN THE CONTENT CHANGES SIZE. A body that
  // grows while open (an image loading, a longer gloss arriving) would otherwise
  // stay clipped to its old measured height. Re-targeting on a height change
  // costs nothing when closed, because the target is 0 either way.
  useEffect(() => {
    if (open) progress.value = withTiming(1, { duration: DURATION, easing: CURVE })
  }, [height, open, progress])

  const bodyStyle = useAnimatedStyle(() => ({
    // Multiplying by the measured height is what makes this a real slide rather
    // than a fade: at 0.5 the body is literally half-revealed.
    height: progress.value * height,
    // Opacity lags slightly behind the height (squared), so the text does not
    // appear fully formed in a half-open box.
    opacity: progress.value * progress.value,
  }))

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 90}deg` }],
  }))

  // ⚠️ THE INVERSE OF THE BODY: the prompt is for a learner who has not opened
  // it yet, so it leaves as the body arrives, on the same timeline. Height goes
  // with the opacity so the title row tightens up instead of keeping a blank
  // line. Fading faster than it shrinks (1 − progress² would linger) keeps it
  // from being half-readable over the text sliding in behind it.
  const subtitleStyle = useAnimatedStyle(() => {
    const out = 1 - progress.value
    return { height: out * subHeight, opacity: out * out }
  })

  return (
    <View>
      <Pressable
        onPress={toggle}
        className="flex-row items-center justify-between py-3"
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        {/* flex-1 + mr-3 so a long title WRAPS instead of shoving the chevron off
            the row on a narrow phone. The title and its prompt stack, so they
            share one column and the chevron stays vertically centred on both. */}
        <View className="flex-1 mr-3">
          <Text className={titleClassName}>{title}</Text>

          {subtitle ? (
            <Reanimated.View style={[{ overflow: 'hidden' }, subtitleStyle]}>
              <View
                onLayout={(e) => {
                  const next = Math.round(e.nativeEvent.layout.height)
                  if (next > 0 && next !== subHeight) setSubHeight(next)
                }}
                style={{ position: 'absolute', width: '100%' }}
              >
                <Text className="text-sm font-medium text-stone-600">{subtitle}</Text>
              </View>
            </Reanimated.View>
          ) : null}
        </View>

        <Reanimated.View style={chevronStyle}>
          <Icon name="arrowRight" size={18} tone="accent" />
        </Reanimated.View>
      </Pressable>

      {/* ⚠️ TWO NESTED VIEWS, AND BOTH ARE LOAD-BEARING.
          · The OUTER one is the animated window: a clipped box whose height is
            driven by `progress`. overflow:'hidden' is what crops the body
            mid-slide instead of letting it spill over what is underneath.
          · The INNER one is measured. It must size itself naturally, so it is
            positioned absolutely while closed-or-measuring; `onLayout` reports
            its real height and the outer box animates to it.
          Measuring the same view you are resizing would be circular — the
          measurement would just report whatever the animation had set. */}
      <Reanimated.View style={[{ overflow: 'hidden' }, bodyStyle]}>
        <View
          onLayout={(e) => {
            const next = Math.round(e.nativeEvent.layout.height)
            // Guard the no-change case: onLayout fires on every pass, and
            // setting state to the value it already holds would re-render for
            // nothing (and re-run the effect above).
            if (next > 0 && next !== height) setHeight(next)
          }}
          // position:absolute takes the body out of flow so its natural height
          // can be measured without it also pushing the page down before the
          // animation has run. `width: '100%'` because an absolute child
          // otherwise shrinks to its content.
          style={{ position: 'absolute', width: '100%' }}
          className="pb-3"
        >
          {children}
        </View>
      </Reanimated.View>
    </View>
  )
}
