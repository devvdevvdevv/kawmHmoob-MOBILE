import { View, Pressable } from 'react-native'
import { Link } from 'expo-router'

// Mirrors the web's .surface and .surface-elevated component classes.
// Pass `href` to make it a navigable card (acts like the original <Link className="surface">).

export function Surface({ children, elevated = false, className = '' }) {
  const base = elevated
    ? 'rounded-md bg-cream-50 border border-cream-200 shadow-warm'
    : 'rounded-md bg-cream-50 border border-cream-200'
  return <View className={`${base} ${className}`}>{children}</View>
}

export function SurfaceLink({ href, children, className = '' }) {
  return (
    <Link href={href} asChild>
      <Pressable
        className={`rounded-md bg-cream-50 border border-cream-200 ${className}`}
        style={({ pressed }) => pressed && { opacity: 0.85 }}
      >
        {children}
      </Pressable>
    </Link>
  )
}
