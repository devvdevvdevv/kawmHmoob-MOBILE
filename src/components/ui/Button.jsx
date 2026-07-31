import { forwardRef } from 'react'
import { Pressable, Text } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// Shared button presets that mirror the web's .btn-primary / .btn-secondary
// / .btn-ghost classes. Variant picks the color treatment; size adjusts padding.
//
// The label COLOR is set inline from the active theme token, NOT via a `text-*`
// className. NativeWind's text-color classes are unreliable in this project
// (they silently no-op on some elements — the flashcard, the drawer, and these
// button labels all hit it), which left labels rendering default black. Inline
// rgb() from THEME_TOKENS is the reliable path and still themes correctly.
//
// forwardRef so `<Link asChild><Button/></Link>` (expo-router) can pass its
// press ref through.

const VARIANTS = {
  primary:   { base: 'rounded bg-clay-600 shadow-warm', textToken: '--c-cream-50' },
  secondary: { base: 'rounded bg-stone-900',            textToken: '--c-cream-50' },
  ghost:     { base: 'rounded border border-cream-300', textToken: '--c-stone-800' },
}

const SIZES = {
  sm: 'px-4 py-2',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3.5',
}

// Accessibility: every button is at least 44px tall (Apple HIG / WCAG target size).
const MIN_TAP = 44

const Button = forwardRef(function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  textClassName = '',
  ...rest
}, ref) {
  const { theme } = useTheme()
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  const tok = THEME_TOKENS[theme] || THEME_TOKENS.light
  // Tokens are stored as space-separated "R G B"; use comma form so it's a valid
  // color on BOTH native and web.
  const textColor = `rgb(${(tok[v.textToken] || '0 0 0').split(' ').join(', ')})`

  // Wrap text-like children (string, number, or an array of them like `← {word}`)
  // in a styled Text; only real elements (icons/custom nodes) render as-is.
  const isTextLike =
    typeof children === 'string' ||
    typeof children === 'number' ||
    (Array.isArray(children) && children.every((c) => typeof c === 'string' || typeof c === 'number'))

  return (
    <Pressable
      ref={ref}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center ${s} ${v.base} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={({ pressed }) => [{ minHeight: MIN_TAP }, pressed && !disabled ? { opacity: 0.7 } : null]}
      {...rest}
    >
      {isTextLike ? (
        <Text style={{ color: textColor, fontWeight: '600', fontSize: 14 }} className={textClassName}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
})

export default Button
