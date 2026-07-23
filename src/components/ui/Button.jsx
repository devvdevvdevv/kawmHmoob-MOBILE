import { Pressable, Text } from 'react-native'

// Shared button presets that mirror the web's .btn-primary / .btn-secondary
// / .btn-ghost classes. Variant picks the color treatment; size adjusts
// padding. Use `className` to add extra layout classes per-call.
//
// Web Tailwind utilities like `transition` are no-ops on native — that's fine.

const VARIANTS = {
  primary: {
    base: 'rounded bg-clay-600 shadow-warm',
    pressed: 'bg-clay-700',
    text: 'text-cream-50 font-semibold text-sm',
  },
  secondary: {
    base: 'rounded bg-stone-900',
    pressed: 'bg-stone-800',
    text: 'text-cream-50 font-semibold text-sm',
  },
  ghost: {
    base: 'rounded border border-cream-300',
    pressed: 'bg-cream-100',
    text: 'text-stone-800 font-semibold text-sm',
  },
}

const SIZES = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
}

export default function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  textClassName = '',
}) {
  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center ${s} ${v.base} ${disabled ? 'opacity-50' : ''} ${className}`}
      style={({ pressed }) => pressed && !disabled ? { opacity: 0.85 } : undefined}
    >
      {typeof children === 'string' ? (
        <Text className={`${v.text} ${textClassName}`}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
