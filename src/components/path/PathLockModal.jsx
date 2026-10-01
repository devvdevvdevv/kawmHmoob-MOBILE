import { Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import { FREE_PATH_UNITS } from '../../data/path.js'

// WHAT A LEARNER SEES ON TAPPING A UNIT THEY CAN'T OPEN — 2026-09-28 (author: "make the lock a
// modal, and importantly, paywall, users MUST be pro in order to continue down the paths").
// Replaces the inline LockedPanel in PathList.jsx.
//
// Two cases:
//   reason 'locked' — the unit before it isn't finished. If the learner isn't Pro, the unit is
//                     Pro too (everything past the first four is), so both are said and both
//                     ways forward are offered.
//   reason 'pro'    — reachable, but Pro. The upgrade is the only way on.
//
// ⚠️ NOT AN RN <Modal>, for the reasons LimitModal.jsx documents (buttons under the system nav
// bar; themed classes transparent inside one). Root-mounted through PathLockHost so the overlay
// covers the header and tab bar, like QuizSettingsHost and NavGuardHost. Colours resolved by hand.
export default function PathLockModal({ lock, onClose }) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const router = useRouter()
  if (!lock) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const c = (name) => (t[name] ? `rgb(${t[name]})` : '#000')
  const { unit, prev, reason, needsPro } = lock

  // Close FIRST, then navigate — otherwise the overlay floats over the next screen.
  const go = (href) => { onClose(); router.push(href) }

  const locked = reason === 'locked'
  const eyebrow = locked ? 'LOCKED' : 'KAWMHMONG PRO'
  const title = locked ? `${unit.title} is locked` : `Keep going with Pro`
  const prevName = prev ? prev.title : 'the unit before it'

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(28, 25, 23, 0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
          zIndex: 9999,
          elevation: 9999,
        },
      ]}
    >
      {/* Tapping the scrim closes — nothing here is a gate you can slip past by accident. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        entering={FadeInUp.duration(260).delay(40)}
        style={{ width: '100%', maxWidth: 420, backgroundColor: c('--c-cream-50'), borderRadius: 18, padding: 24 }}
      >
        <Text style={{ color: c('--c-clay-600'), fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>{eyebrow}</Text>
        <Text className="font-serif" style={{ color: c('--c-stone-900'), fontSize: 24, fontWeight: '700', marginBottom: 8 }}>
          {title}
        </Text>

        {locked && (
          <Text style={{ color: c('--c-stone-700'), fontSize: 14, lineHeight: 21, marginBottom: needsPro ? 8 : 20 }}>
            Finish {prevName} to open it. Units open one at a time, so each one builds on the last.
          </Text>
        )}
        {needsPro && (
          <Text style={{ color: c('--c-stone-700'), fontSize: 14, lineHeight: 21, marginBottom: 20 }}>
            {locked
              ? `Everything past the first ${FREE_PATH_UNITS} units is part of KawmHmong Pro, so you will need Pro to continue.`
              : `${unit.title} and everything past the first ${FREE_PATH_UNITS} units are part of KawmHmong Pro. Your progress stays exactly where it is.`}
          </Text>
        )}

        {needsPro && (
          <Pressable
            onPress={() => go('/paywall')}
            accessibilityRole="button"
            style={{ backgroundColor: c('--c-clay-600'), borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 10 }}
          >
            <Text style={{ color: c('--c-cream-50'), fontSize: 15, fontWeight: '700' }}>See KawmHmong Pro</Text>
          </Pressable>
        )}
        {locked && prev && (
          <Pressable
            onPress={() => go(`/path/${prev.id}`)}
            accessibilityRole="button"
            style={{
              borderRadius: 8, borderWidth: 2, borderColor: c('--c-cream-300'),
              paddingVertical: 12, alignItems: 'center', marginBottom: 10,
              ...(needsPro ? {} : { backgroundColor: c('--c-clay-600'), borderColor: c('--c-clay-600') }),
            }}
          >
            <Text style={{ color: needsPro ? c('--c-stone-800') : c('--c-cream-50'), fontSize: 15, fontWeight: '700' }}>
              Go to {prev.title}
            </Text>
          </Pressable>
        )}
        <Pressable onPress={onClose} accessibilityRole="button" style={{ paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: c('--c-stone-600'), fontSize: 14, fontWeight: '600' }}>Not now</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}
