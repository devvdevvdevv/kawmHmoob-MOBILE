import { createContext, useContext, useMemo, useState } from 'react'
import PathLockModal from '../components/path/PathLockModal.jsx'

// The path's lock / Pro modal, root-mounted — 2026-09-28. PathList rows live inside a scrolling
// screen; an absolute-fill overlay drawn there would cover only the list and scroll with it. So a
// row calls showLock(), and PathLockHost (mounted in app/_layout.jsx beside NavGuardHost) draws
// the modal over everything, header and tab bar included. Same shape as NavGuardContext.
const PathLockState = createContext({ lock: null, close: () => {} })
const PathLockActions = createContext({ showLock: () => {} })

export function PathLockProvider({ children }) {
  const [lock, setLock] = useState(null)
  const actions = useMemo(() => ({ showLock: (info) => setLock(info) }), [])
  const state = useMemo(() => ({ lock, close: () => setLock(null) }), [lock])
  return (
    <PathLockActions.Provider value={actions}>
      <PathLockState.Provider value={state}>{children}</PathLockState.Provider>
    </PathLockActions.Provider>
  )
}

export function PathLockHost() {
  const { lock, close } = useContext(PathLockState)
  return <PathLockModal lock={lock} onClose={close} />
}

/** `showLock({ unit, prev, reason: 'locked' | 'pro', needsPro })` */
export function usePathLock() {
  return useContext(PathLockActions).showLock
}
