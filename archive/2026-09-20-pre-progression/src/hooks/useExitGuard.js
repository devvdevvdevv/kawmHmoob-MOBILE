import { useCallback, useEffect, useRef, useState } from 'react'
import { BackHandler } from 'react-native'
import { useNavigation } from 'expo-router'
import { usePreventRemove } from '@react-navigation/native'

// Confirm before abandoning a lesson in progress.
//
// ⚠️ WHAT IS ACTUALLY LOST — the message must be honest about this.
// `markStepComplete` fires on every Continue, so completed steps and the XP they
// earned ARE saved, permanently, in ProgressContext.
//
// What leaving DOES lose:
//   • your POSITION in the lesson — LessonScroll state, wiped on unmount
//   • this session's recordings — temp files, and `uri` state goes with the
//     component
//   • scores and self-assessments for the current run
//
// THREE WAYS OUT, all funnelled through the same confirm:
//   1. Android hardware back      → BackHandler
//   2. back gesture / header back → usePreventRemove
//   3. the breadcrumb "Speak" pill → the route renders its own guarded button
//
// ⚠️⚠️ THE TRAP THAT BIT US: once the learner CONFIRMS, the guard has to actually
// let go. Calling router.replace() while `preventRemove` is still true means the
// navigation is blocked and the confirm re-opens — an inescapable screen.
//
// So confirming sets `allowLeave`, and the ACTUAL navigation happens in an
// effect on the next render, once `preventRemove` has flipped false. Two steps,
// because React state is not visible until the re-render.

/**
 * @param {boolean}  active   guard armed (lesson started, not finished/leaving)
 * @param {function} onLeave  fallback navigation when there is no pending action
 * @returns {{ asking, ask, confirm, cancel }}
 */
export function useExitGuard(active, onLeave) {
  const navigation = useNavigation()
  const [asking, setAsking] = useState(false)
  const [allowLeave, setAllowLeave] = useState(false)
  // The navigation action react-navigation was about to perform, held so it can
  // be replayed after confirmation. A ref: it is read by an effect, never drawn.
  const pendingAction = useRef(null)

  const armed = active && !allowLeave

  usePreventRemove(armed, ({ data }) => {
    pendingAction.current = data?.action ?? null
    setAsking(true)
  })

  // Android hardware back is not reliably covered by usePreventRemove.
  // Returning true means "handled, do not go back".
  useEffect(() => {
    if (!armed) return
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      pendingAction.current = null // no navigation action to replay
      setAsking(true)
      return true
    })
    return () => sub.remove()
  }, [armed])

  // Once the guard is down, actually leave. This runs on the render AFTER
  // setAllowLeave(true), which is exactly what makes it work — by now
  // `preventRemove` is false, so the navigation is not blocked.
  useEffect(() => {
    if (!allowLeave) return
    const action = pendingAction.current
    pendingAction.current = null
    if (action) navigation.dispatch(action) // replay what they originally tried
    else onLeave() // the "Speak" pill, or hardware back
  }, [allowLeave, navigation, onLeave])

  const ask = useCallback(() => {
    if (!active) {
      onLeave() // nothing to lose — go straight there
      return
    }
    pendingAction.current = null
    setAsking(true)
  }, [active, onLeave])

  const confirm = useCallback(() => {
    setAsking(false)
    setAllowLeave(true) // disarm; the effect above does the navigating
  }, [])

  const cancel = useCallback(() => {
    pendingAction.current = null
    setAsking(false)
  }, [])

  return { asking, ask, confirm, cancel }
}
