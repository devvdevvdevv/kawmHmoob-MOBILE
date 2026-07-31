import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { loadJSON, saveJSON } from '../lib/storage.js'

// Three themes on one token engine (see src/lib/themes.js), mirroring the web:
//   'light' — warm brand palette (default)
//   'dark'  — warm charcoal
//   'neon'  — vibrant violet/coral/teal skin
//
// The web keeps the source of truth on <html>; RN has no DOM cascade, so this
// context holds the choice, persists it in AsyncStorage, and the root layout
// applies the matching THEME_VARS as a style so every className restyles.
const KEY = 'kawmhmoob.theme'
export const THEMES = ['light', 'dark', 'neon']

const ThemeContext = createContext({ theme: 'light', setTheme: () => {}, cycle: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light')

  // Restore the saved choice once on mount.
  useEffect(() => {
    let alive = true
    loadJSON(KEY, 'light').then((saved) => {
      if (alive && THEMES.includes(saved)) setThemeState(saved)
    })
    return () => { alive = false }
  }, [])

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return
    setThemeState(next)
    saveJSON(KEY, next)
  }, [])

  const cycle = useCallback(() => {
    setThemeState((cur) => {
      const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]
      saveJSON(KEY, next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
