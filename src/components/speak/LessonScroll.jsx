import { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Button from '../ui/Button.jsx'
import { Step } from './LessonSteps.jsx'
import { useProgress } from '../../hooks/useProgress.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { isAdmin } from '../../lib/admin.js'

// THE LESSON PRESENTATION — a chat-style scroll.
//
// Steps REVEAL one at a time but STAY ON SCREEN, stacking downward like a
// conversation. You can always scroll back to a phrase you met four steps ago
// and hear it again.
//
// WHY THIS OVER PAGING (the archived LessonRunner.jsx):
//   • Language learning is cumulative — seeing the earlier sentence still above
//     you while you practise the next one is the point. A pager hides it.
//   • Scrolling back costs one gesture instead of five taps backwards.
//   • It reads like the dialogue step already did, so the lesson has one visual
//     grammar instead of two.
//
// The step COMPONENTS live in LessonSteps.jsx and are shared with the archived
// pager — so the two presentations can never disagree about what a step is.

// ── Auto-advance ────────────────────────────────────────────────────────────
//
// Passive steps move on by themselves so the learner isn't tapping Continue
// every few seconds. ACTIVE steps never do.
//
// ⚠️ THE RULE THAT MATTERS: a step that asks the learner to DO something must
// never advance on a timer. Auto-advancing out of a `say` step mid-recording
// would be infuriating and could cut a take off.
//
// null = manual only.
const AUTO_ADVANCE_MS = {
  intro: 7000, // reading time for 2-3 short lines
  hear: 6000, // long enough to tap play and listen once
  word: 5000, // (currently disabled as a type, kept for when it returns)
  listen: null, // ← never. The learner is thinking, then choosing to reveal.
  say: null, // ← never. The learner is recording.
  recall: null, // ← never. The learner is recording AND retrieving from memory.
  dialogue: null, // ← never. Turns are tapped through inside the step.
}

// ── Eye-height positioning ──────────────────────────────────────────────────
//
// The active card should land where the eye naturally rests — upper-middle of
// the viewport — NOT at the bottom edge where `scrollToEnd` would leave it.
//
// Reading a phrase pinned to the bottom of a screen means looking down, and on a
// phone held at chest height that is the worst spot. Roughly the top third is
// where people actually look.
//
// 0.22 = the new card's top sits 22% down the visible area.
const EYE_FRACTION = 0.22

// How long the drift to the next card takes. RN's built-in animated scroll is
// ~250ms and feels abrupt in a reading context; this is deliberately unhurried.
const SCROLL_MS = 650

// ── Which steps require an attempt before Continue unlocks ─────────────────
//
// ⚠️ THE DISTINCTION THAT MATTERS: this gates on HAVING ATTEMPTED, never on the
// SCORE. A score can be impossible — no reference contour, or a level tone the
// scorer cannot judge (see the 08-18 note). Recording always works, so requiring
// a recording never traps anyone.
//
// Passive steps (intro, hear) are never gated: there is nothing to attempt.
const REQUIRES_ATTEMPT = { say: true, recall: true, dialogue: true }

export default function LessonScroll({ lesson, onStep, onFinish, onProgress }) {
  // How many steps are visible. Starts at 1: the intro, alone, with nothing else
  // competing for attention.
  const [revealed, setRevealed] = useState(1)
  // Once the learner taps Continue themselves, stop auto-advancing for the rest
  // of the lesson — they've shown they want to set the pace.
  const [autoOn, setAutoOn] = useState(true)
  const { markStepComplete } = useProgress()
  const { user } = useAuth()
  // Admins skip the gate — clicking straight through a lesson is how you review
  // pacing and copy without recording 17 takes. Normal learners must attempt.
  const bypassGate = isAdmin(user)
  // Which step indexes have reported an attempt. A ref would not work: the
  // Continue button must RE-RENDER when this changes.
  const [attempted, setAttempted] = useState({})

  const scrollRef = useRef(null)
  // Where each revealed card sits inside the scroll content, by index. Filled by
  // onLayout. A REF, not state: it is read by a scroll callback after the fact
  // and must never trigger a re-render. (See learning/concepts/useref-vs-usestate.md)
  const cardTops = useRef({})
  // Card HEIGHTS, so a card that grows (revealing a recall answer) can be
  // re-centred instead of spilling below the fold.
  const cardHeights = useRef({})
  // Visible height of the scroll viewport, needed to compute eye height.
  const viewportH = useRef(0)
  // Current scroll offset, tracked so the hand-rolled animation knows where it
  // is starting from. A ref: read by a timer, never drawn.
  const scrollY = useRef(0)
  const scrollAnim = useRef(null)

  const steps = lesson?.steps || []
  const allRevealed = revealed >= steps.length
  const current = steps[revealed - 1]
  // Tail space: enough that the newest card can rise to eye height, not enough
  // to scroll into a void beyond it.
  const tailPad = Math.max(80, viewportH.current * (1 - EYE_FRACTION) - 200)

  // Is Continue locked right now?
  const gated = !bypassGate && !!REQUIRES_ATTEMPT[current?.type]
  const locked = gated && !attempted[revealed - 1]
  // Auto-advance never applies to gated types anyway (say/recall/dialogue are all
  // null), but guard explicitly so a future timing value cannot skip a gate.
  const autoMs =
    autoOn && !allRevealed ? AUTO_ADVANCE_MS[current?.type] ?? null : null

  /**
   * Scroll so the card at `index` sits at eye height.
   *
   * Hand-animated rather than `scrollTo({ animated: true })`, because RN gives
   * that a fixed, snappy duration you cannot configure — it lands like a jump
   * cut. Stepping the offset ourselves over SCROLL_MS with an ease-in-out curve
   * makes the lesson feel like it is drifting to the next card rather than
   * teleporting.
   */
  const scrollCardToEye = (index) => {
    const top = cardTops.current[index]
    if (top == null) return
    const h = cardHeights.current[index] || 0
    const vh = viewportH.current || 1
    // A short card sits at eye height (top ~22% down). A TALL one — a recall
    // card with its answer revealed, say — gets CENTRED instead, because
    // pinning its top would push the bottom half off screen. Below 60% of the
    // viewport, eye height reads better; above it, centring wins.
    const target =
      h > vh * 0.6
        ? Math.max(0, top - Math.max(0, (vh - h) / 2))
        : Math.max(0, top - vh * EYE_FRACTION)
    const from = scrollY.current
    const dist = target - from
    if (Math.abs(dist) < 2) return

    // Cancel any scroll already in flight so two animations cannot fight.
    if (scrollAnim.current) clearInterval(scrollAnim.current)

    const startedAt = Date.now()
    scrollAnim.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - startedAt) / SCROLL_MS)
      // ease-in-out cubic: slow start, slow finish, quick middle
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
      scrollRef.current?.scrollTo({ y: from + dist * eased, animated: false })
      if (p >= 1) {
        clearInterval(scrollAnim.current)
        scrollAnim.current = null
      }
    }, 16) // ~60fps
  }

  const advance = (manual) => {
    if (manual) setAutoOn(false) // learner took the wheel
    if (current) {
      // markStepComplete is IDEMPOTENT — replaying a step cannot double-count XP.
      markStepComplete(current.id, {
        lessonId: lesson.id,
        lessonComplete: revealed >= steps.length,
      })
      onStep?.(current, revealed - 1)
    }
    if (allRevealed) {
      // The finish MODAL is owned by the route, not by this component.
      // StyleSheet.absoluteFill only fills its PARENT — and this component lives
      // inside TabScreen's padded container, so a modal rendered here is clipped
      // to the lesson area instead of covering the screen. The route renders it
      // as a SIBLING of TabScreen, where absoluteFill means what it says.
      onFinish?.({
        attempted: Object.keys(attempted).length,
        total: steps.filter((st) => REQUIRES_ATTEMPT[st.type]).length,
      })
      return
    }
    const nextIndex = revealed // the about-to-be-revealed card's index
    setRevealed((n) => n + 1)
    // Let the new card mount AND report its layout before scrolling. Without the
    // delay we would scroll against a position that does not exist yet.
    setTimeout(() => scrollCardToEye(nextIndex), 120)
  }

  // Let the route know how far in we are, so it can decide whether leaving
  // needs a confirmation. Reported rather than lifted: the route should not own
  // the step index, it just needs to know if there IS one worth losing.
  useEffect(() => {
    onProgress?.(revealed)
  }, [revealed, onProgress])

  // Stop any in-flight scroll animation if the screen goes away. A timer that
  // outlives the component keeps calling scrollTo on a ref that no longer exists.
  useEffect(() => {
    return () => {
      if (scrollAnim.current) clearInterval(scrollAnim.current)
    }
  }, [])

  // The auto-advance timer. Re-armed whenever the step changes; cleared on
  // unmount or when the learner takes over. `revealed` in the deps is what makes
  // it fire once per step rather than once ever.
  useEffect(() => {
    if (!autoMs) return
    const t = setTimeout(() => advance(false), autoMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, autoMs])

  // Guard AFTER the hooks — hook order must be identical on every render.
  if (steps.length === 0) {
    return (
      <View className="rounded-md border-2 border-dashed border-cream-200 p-6">
        <Text className="text-stone-500 text-center">This lesson has no steps.</Text>
      </View>
    )
  }

  return (
    <View className="flex-1">
      {/* Progress stays pinned so it doesn't scroll away mid-lesson. */}
      {/* Just the bar. A step counter alongside it was a second way of saying
          the same thing, and neither number is something a learner acts on. */}
      <View className="mb-5">
        <View className="h-2 rounded-full bg-cream-200 overflow-hidden">
          <View
            className="h-full bg-clay-600"
            style={{ width: `${(revealed / steps.length) * 100}%` }}
          />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        className="flex-1"
        onLayout={(e) => {
          viewportH.current = e.nativeEvent.layout.height
        }}
        onScroll={(e) => {
          scrollY.current = e.nativeEvent.contentOffset.y
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{
          // Just enough tail for the CURRENT card to reach eye height — and no
          // more. A big fixed padding lets the learner fling past the newest
          // card into a wall of blank space, which reads as "the lesson ended"
          // when it has not. See the end-marker below.
          paddingBottom: tailPad + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {steps.slice(0, revealed).map((step, idx) => {
          const isCurrent = idx === revealed - 1
          return (
            <Animated.View
              key={step.id}
              // New cards drift UP into place, matching the direction the scroll
              // is travelling. Slightly longer than the dialogue turns (320ms)
              // because a whole card is a bigger visual event than one line.
              entering={FadeInDown.duration(320)}
              // ⚠️ style, NOT className. NativeWind does not process className on
              // reanimated's Animated.View — the class is silently dropped and the
              // margin never applies.
              style={{ marginBottom: 14 }}
              onLayout={(e) => {
                const { y, height } = e.nativeEvent.layout
                cardTops.current[idx] = y
                const prev = cardHeights.current[idx]
                cardHeights.current[idx] = height
                // If the CURRENT card grew — the learner revealed a recall
                // answer, or a score + curve appeared — re-position so it stays
                // comfortably in view instead of spilling below the fold.
                // Threshold of 24px so ordinary re-layout noise does not scroll.
                if (isCurrent && prev != null && height - prev > 24) {
                  requestAnimationFrame(() => scrollCardToEye(idx))
                }
              }}
            >
              {/* Past steps dim so the eye lands on what is new — but stay
                  readable and interactive. 0.7, not lower: these cards are still
                  tappable, and dimming interactive content too far makes it look
                  disabled. */}
              <View style={{ opacity: isCurrent ? 1 : 0.7 }}>
                <Step
                  step={step}
                  onReady={
                    isCurrent
                      ? () => setAttempted((a) => (a[idx] ? a : { ...a, [idx]: true }))
                      : undefined
                  }
                />
              </View>
            </Animated.View>
          )
        })}

        {/* SUBTLE BLOCK — a soft floor so the newest card does not sit above an
            unexplained void. It says "there is more, it is not here yet" rather
            than letting the scroll trail into blank space that reads as the end
            of the lesson. */}
        {!allRevealed && (
          <View className="items-center py-5">
            <View className="h-px w-16 bg-cream-200 mb-2" />
            <Text className="text-[10px] text-stone-400">
              more after this
            </Text>
          </View>
        )}
      </ScrollView>

      <View className="pt-4 border-t border-cream-200">
        <Button onPress={() => advance(true)} disabled={locked}>
          {allRevealed ? 'Finish 🎉' : 'Continue'}
        </Button>

        {/* Auto-advance is visible, not sneaky — a card moving on its own with no
            warning reads as a bug. Tapping the notice turns it off WITHOUT
            advancing, for a learner who wants to sit on a step. */}
        {locked ? (
          <Text className="text-[10px] text-stone-500 text-center mt-3">
            record your answer to continue
          </Text>
        ) : bypassGate && REQUIRES_ATTEMPT[current?.type] ? (
          <Text className="text-[10px] text-stone-400 text-center mt-3">
            admin — gate bypassed
          </Text>
        ) : autoMs ? (
          <Pressable onPress={() => setAutoOn(false)} hitSlop={8}>
            <Text className="text-[10px] text-stone-500 text-center mt-3">
              auto-continues in a moment · tap to stay here
            </Text>
          </Pressable>
        ) : (
          !allRevealed && (
            <Text className="text-[10px] text-stone-400 text-center mt-3">
              {AUTO_ADVANCE_MS[current?.type] == null
                ? 'take your time'
                : 'manual — you set the pace'}
            </Text>
          )
        )}
      </View>

    </View>
  )
}
