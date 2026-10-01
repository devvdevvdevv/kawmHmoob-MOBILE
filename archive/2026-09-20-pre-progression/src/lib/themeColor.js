import { useTheme } from '../context/ThemeContext.jsx'
import { THEME_TOKENS } from './themes.js'

// RESOLVE A THEME TOKEN TO A REAL COLOUR STRING.
//
// ⚠️ FOR THE PLACES A className CANNOT REACH. Most of the app colours itself
// with NativeWind classes and should keep doing that. This is for the props
// that take a colour VALUE rather than a class:
//
//   • <ActivityIndicator color={…} />
//   • <TextInput placeholderTextColor={…} />
//   • <Icon color={…} />  (the shared Icon takes a colour for one-offs)
//   • anything inside an RN <Modal>, where themed classes resolve to nothing
//     and therefore render TRANSPARENT — see the reader's useSheetPalette
//
// Before this existed, every one of those sites had a hardcoded hex pasted in:
// #b45309 for a spinner, #dc2626 for a delete icon, #9c918a for placeholder
// text. They all looked right in the light theme and none of them changed when
// the theme did — a permanent amber spinner on a dark screen.
//
// ⚠️ Tokens are stored as space-separated channels ("251 246 236"), the same
// shape GlobalHeader's private tok() reads. Kept identical on purpose.

/** Pure — for code that already has `theme` in hand. */
export function tokenColor(theme, name) {
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  return t[name] ? `rgb(${t[name]})` : '#000'
}

/**
 * Hook form: returns a resolver, not a single colour.
 *
 * ⚠️ ONE HOOK, ANY NUMBER OF COLOURS. A useThemeColor(name) that returned one
 * colour would mean N hook calls for N colours, and the count would change with
 * the branch a component took — which is exactly how hook-order bugs start.
 *
 *   const c = useThemeColor()
 *   <ActivityIndicator color={c('--c-clay-600')} />
 */
export function useThemeColor() {
  const { theme } = useTheme()
  return (name) => tokenColor(theme, name)
}
