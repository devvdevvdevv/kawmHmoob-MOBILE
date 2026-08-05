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

  const celebrate = useCallback((title, onDone) => {
    setCelebration({ title, onDone: onDone || null })
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
