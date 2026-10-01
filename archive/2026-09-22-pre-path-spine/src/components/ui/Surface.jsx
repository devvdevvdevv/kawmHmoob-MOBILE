import { View, Pressable } from 'react-native'
import { Link } from 'expo-router'

// Mirrors the web's .surface and .surface-elevated component classes.
// Pass `href` to make it a navigable card (acts like the original <Link className="surface">).

export function Surface({ children, elevated = false, className = '' }) {
  const base = elevated
    ? 'rounded-md bg-cream-50 shadow-warm'
    : 'rounded-md bg-cream-50'
  return <View className={`${base} ${className}`}>{children}</View>
}

export function SurfaceLink({ href, children, className = '' }) {
  return (
    <Link href={href} asChild>
      {/* Press feedback via the `active:` VARIANT, not a style function. A
          function `style` on a Pressable is dropped by NativeWind on native and
          the card renders invisible — see
          notes/2026-08-06-nativewind-drops-function-style-invisible-buttons.
          Was: style={({ pressed }) => pressed && { opacity: 0.85 }} */}
      <Pressable
        className={`rounded-md bg-cream-50 active:opacity-85 ${className}`}
      >
        {children}
      </Pressable>
    </Link>
  )
}
