import { createContext, useContext, useState, useCallback } from 'react'

// Global celebration state so a confetti + "complete!" overlay can be rendered ONCE
// at the root layout — ABOVE the floating header/tab bar and centered on the
// viewport — instead of inside a screen (where it sits under the bars and is
// clipped by the screen's centered column).
//
//   const { celebrate } = useCelebration()
//   celebrate('Pronouns', () => router.push('/learn/grammar'))  // title + optional
//                                                               // action for the button
const CelebrationContext = createContext(null)

export function CelebrationProvider({ children }) {
  const [celebration, setCelebration] = useState(null) // { title, onDone } | null

  // ⚠️ `extra` IS OPTIONAL AND BACKWARDS-COMPATIBLE. Every existing caller passes
  // (title, onDone) and gets the lesson-completion copy it always got. A caller
  // that is celebrating something other than finishing a lesson — a purchase,
  // say — can override the body and the button without a second overlay
  // component, which is how two celebration surfaces would start to drift apart.
  const celebrate = useCallback((title, onDone, extra = {}) => {
    setCelebration({ title, onDone: onDone || null, ...extra })
  }, [])

  const dismiss = useCallback(() => setCelebration(null), [])

  return (
    <CelebrationContext.Provider value={{ celebration, celebrate, dismiss }}>
      {children}
    </CelebrationContext.Provider>
  )
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext)
  if (!ctx) throw new Error('useCelebration must be used inside CelebrationProvider')
  return ctx
}
