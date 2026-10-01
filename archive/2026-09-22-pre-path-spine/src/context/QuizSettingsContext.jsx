import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Lets any screen open the quiz/study settings sheet, while the sheet itself is
// RENDERED AT THE ROOT.
//
// ⚠️ WHY THIS EXISTS AT ALL — the bug it fixes:
// The sheet is an absolute-fill overlay. Mounted inside a screen, `absoluteFill`
// only covers the SCREEN's box, not the whole app: `GlobalHeader` and
// `GlobalTabBar` are absolutely-positioned siblings of the <Stack> at the
// ThemedShell root, both at zIndex 30. A zIndex of 9999 on a view nested deep
// inside the Stack cannot lift it above a sibling of one of its ancestors — CSS
// and RN stacking both work that way. So the header and tab bar drew straight
// over the "full screen" overlay and the dim stopped short of both edges.
//
// The fix is not a bigger zIndex; it is mounting the overlay where PageInfoModal
// and CelebrationOverlay already mount theirs — at the root, as a sibling of the
// header and tab bar. This context is the wire between "a screen wants it open"
// and "the root renders it".
//
// Same shape as CelebrationContext deliberately: one piece of state, an opener
// that carries its payload, and a closer.
const QuizSettingsContext = createContext(null)

export function QuizSettingsProvider({ children }) {
  // null = closed. An object = open, carrying the contextual notes the calling
  // screen wants shown inside the sheet ("flashcard order applies here", etc).
  const [settings, setSettings] = useState(null)

  const openQuizSettings = useCallback((notes = []) => setSettings({ notes }), [])
  const closeQuizSettings = useCallback(() => setSettings(null), [])

  const value = useMemo(
    () => ({ settings, openQuizSettings, closeQuizSettings }),
    [settings, openQuizSettings, closeQuizSettings]
  )

  return <QuizSettingsContext.Provider value={value}>{children}</QuizSettingsContext.Provider>
}

export function useQuizSettings() {
  const ctx = useContext(QuizSettingsContext)
  if (!ctx) throw new Error('useQuizSettings must be used inside QuizSettingsProvider')
  return ctx
}
