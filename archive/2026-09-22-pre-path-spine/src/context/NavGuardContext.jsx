import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import LeaveReadingModal from '../components/common/LeaveReadingModal.jsx'

// NAV GUARD — "are you sure you want to leave?" for the global tab bar.
//
// THE PROBLEM IT SOLVES: the tab bar floats over every screen and is rendered
// ONCE by app/_layout.jsx, so it is not a child of the screen you are reading.
// A screen therefore cannot intercept a tab press by itself — by the time the
// reader knows anything happened, expo-router has already swapped the route and
// the story is gone. Reported as "I keep pressing the home icons accidentally
// and have to reopen the story."
//
// The reader ALREADY guarded the Android hardware back button, and the comment
// on that listener names this exact gap:
//
//   ⚠️ ANDROID HARDWARE BACK AND THE BACK GESTURE ONLY. This does not intercept
//   the breadcrumb links or the tab bar — those are ordinary <Link>s and would
//   each need their own guard.
//
// This is that guard, done once centrally instead of per link.
//
// THE SHAPE: a screen ARMS a guard while it is mounted; the tab bar ASKS before
// navigating. Nothing else changes.
//
//   reader     useNavGuard()                        ← arms on mount, disarms on unmount
//   tab bar    requestNavigation(() => router.navigate(to))
//
// ⚠️ ONLY THE TAB BAR IS GUARDED, AND THAT IS THE POINT. Navigation the reader
// itself offers — its own back control, "Take the quiz" — calls the router
// directly and is untouched. Those are deliberate presses; the tab bar is the
// one caught with the side of a thumb. A guard on every route change would make
// leaving the reader a two-tap chore in exactly the cases you meant to leave.

// ⚠️ TWO CONTEXTS, ON PURPOSE. The ACTIONS context wraps the entire app and must
// never change identity, or every consumer re-renders whenever a dialog opens.
// The PENDING context changes constantly and is read by exactly one component,
// the host below.
//
// ⚠️ The actions default is a PASS-THROUGH, and there is deliberately no "must
// be used inside a provider" throw. This wraps PRIMARY NAVIGATION: if the
// provider is ever missing or mounted below a nav surface, the tab bar must
// still navigate normally rather than red-boxing the whole shell. A missing
// guard degrades to the old behaviour, which is merely the bug we started with.
const NavGuardActions = createContext({
  arm: () => {},
  disarm: () => {},
  requestNavigation: (run) => run(),
})

const NavGuardPending = createContext({ pending: null, confirm: () => {}, cancel: () => {} })

export function NavGuardProvider({ children }) {
  // The armed guard lives in a REF, not state. Nothing RENDERS from it — the tab
  // bar only reads it at press time — so putting it in state would re-render
  // every screen under the provider each time a reader mounts, for nothing.
  const guardRef = useRef(null)

  // The pending navigation IS state: the dialog is what it draws.
  const [pending, setPending] = useState(null)

  const arm = useCallback((config) => {
    guardRef.current = config
  }, [])

  // ⚠️ TOKEN-MATCHED, and this is the bug it prevents. When one guarded screen
  // replaces another, React does not promise the outgoing screen's cleanup runs
  // before the incoming screen's effect. An unconditional `guardRef.current =
  // null` in cleanup can therefore wipe the guard the INCOMING screen just
  // armed, leaving it silently unprotected. Only clearing your own token makes
  // disarm safe in any order.
  const disarm = useCallback((token) => {
    if (guardRef.current && guardRef.current.token === token) guardRef.current = null
  }, [])

  const requestNavigation = useCallback((run) => {
    const guard = guardRef.current
    if (!guard || !guard.enabled) {
      run()
      return
    }
    setPending({ ...guard, run })
  }, [])

  const cancel = useCallback(() => setPending(null), [])

  const confirm = useCallback(() => {
    // Read the callback out BEFORE clearing. Running it inside the setState
    // updater would be a side effect in a reducer — React may invoke that twice
    // in development, which would fire the navigation twice.
    const run = pending?.run
    setPending(null)
    // The guarded screen is about to unmount. Clear the guard now rather than
    // waiting for its cleanup, so a second tab press during the transition
    // cannot re-prompt for a screen that is already leaving.
    guardRef.current = null
    run?.()
  }, [pending])

  const actions = useMemo(() => ({ arm, disarm, requestNavigation }), [arm, disarm, requestNavigation])
  const pendingValue = useMemo(() => ({ pending, confirm, cancel }), [pending, confirm, cancel])

  return (
    <NavGuardActions.Provider value={actions}>
      <NavGuardPending.Provider value={pendingValue}>{children}</NavGuardPending.Provider>
    </NavGuardActions.Provider>
  )
}

/**
 * The dialog itself. Mounted by ThemedShell beside the other root overlays —
 * NOT here inside the provider — for the reason app/_layout.jsx already
 * records for QuizSettingsHost: an absolute-fill overlay has to be a sibling of
 * the header and tab bar to cover them, since those are zIndex-30 siblings of
 * the Stack.
 *
 * ⚠️ REUSES LeaveReadingModal rather than ConfirmModal. ConfirmModal is a real
 * RN <Modal>, and this build renders a Modal's buttons UNDER the system
 * navigation bar — an "are you sure" whose buttons cannot be pressed is worse
 * than no guard at all. LeaveReadingModal is a plain absolute-fill overlay for
 * exactly that reason, and reusing it also means the tab-bar prompt and the
 * hardware-back prompt are the same dialog, with the same words.
 */
export function NavGuardHost() {
  const { pending, confirm, cancel } = useContext(NavGuardPending)

  return (
    <LeaveReadingModal
      visible={Boolean(pending)}
      title={pending?.title}
      message={pending?.message}
      stayLabel={pending?.stayLabel}
      leaveLabel={pending?.leaveLabel}
      onStay={cancel}
      onLeave={confirm}
    />
  )
}

/**
 * Called by navigation surfaces (the tab bar) instead of navigating directly.
 *
 * @returns {(run: () => void) => void} runs `run` immediately when nothing is
 *   guarded, otherwise shows the dialog and runs it only if the user confirms.
 */
export function useRequestNavigation() {
  return useContext(NavGuardActions).requestNavigation
}

/**
 * Arm a "leave this screen?" prompt for as long as the calling screen is
 * mounted. Disarms automatically on unmount — so leaving by any other route
 * (the reader's own back control, a deep link, the hardware back) needs no
 * cleanup at the call site and cannot strand a stale guard behind it.
 *
 * All copy is optional; LeaveReadingModal's own defaults are the story wording.
 * Pass `enabled: false` to hold the guard off conditionally.
 */
export function useNavGuard({
  enabled = true,
  title,
  message,
  stayLabel,
  leaveLabel,
} = {}) {
  const { arm, disarm } = useContext(NavGuardActions)

  useEffect(() => {
    if (!enabled) return undefined
    // A fresh object identity per arming — see disarm() for why this exists.
    const token = {}
    arm({ enabled, title, message, stayLabel, leaveLabel, token })
    return () => disarm(token)
  }, [enabled, title, message, stayLabel, leaveLabel, arm, disarm])
}
