import { forwardRef } from 'react'
import { Pressable, Text } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// Shared button presets mirroring the web's .btn-primary / -secondary / -ghost.
//
// BACKGROUND/border come from `className` (works fine anywhere this shared Button
// is used — it's only ever rendered inside the themed root, NEVER inside a RN
// <Modal>; modals use raw inline Pressables instead, because a Modal is a separate
// native root the theme CSS vars don't reach). TEXT color is set INLINE from the
// theme token, because NativeWind's `text-*` classes are unreliable here (they
// silently no-op — the "hny nkh" black-label bug). See notes + memory
// [[nativewind-text-color-inline]].
//
// IMPORTANT: do NOT move the background into the `style` FUNCTION — NativeWind
// ignores a `style` function when `className` is present, which made every button
// transparent/invisible. Background stays in className; the style function is only
// for the pressed-opacity flash.
//
// forwardRef so `<Link asChild><Button/></Link>` can pass its press ref through.

const VARIANTS = {
  primary:   { base: 'rounded shadow-warm bg-clay-600',  textToken: '--c-cream-50' },
  secondary: { base: 'rounded bg-stone-900',             textToken: '--c-cream-50' },
  ghost:     { base: 'rounded border border-cream-300',  textToken: '--c-stone-800' },
  danger:    { base: 'rounded bg-red-600',               textToken: '--c-cream-50' },
}

const SIZES = {
  sm: 'px-4 py-2',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3.5',
}

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
      // min-h-[44px] via className (a static value — applies reliably); bg via
      // className (v.base). The style function is opacity-only on purpose.
      className={`flex-row items-center justify-center min-h-[44px] ${s} ${v.base} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={({ pressed }) => (pressed && !disabled ? { opacity: 0.7 } : undefined)}
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
