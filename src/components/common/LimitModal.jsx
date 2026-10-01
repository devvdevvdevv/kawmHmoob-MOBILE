import { Text, Pressable, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// THE LIMIT, SHOWN WITHOUT LEAVING THE PAGE.
//
// ⚠️ WHY A MODAL AND NOT A NAVIGATION — 2026-09-12. Lessons link straight out to
// a quiz or a speaking module. When the daily allowance is gone, following that
// link used to dump the learner on a different screen, wearing a wall, with
// their place in the lesson lost behind a back button. The answer to "can I do
// this?" should arrive where the question was asked.
//
// ⚠️ NOT AN RN <Modal>. Two known failures in this app, both documented:
// a Modal's buttons render UNDER the system nav bar on this build
// (notes/2026-08-06-header-page-info-button.md), and themed NativeWind classes
// resolve to TRANSPARENT inside one because a Modal is a separate native root
// that the CSS variables are not on. An absolute-fill overlay with a high
// zIndex has neither problem. Same pattern as SpeakSettingsSheet.
//
// ⚠️ COLOURS ARE RESOLVED BY HAND for the same reason the sheets do it — and
// because a class that fails to resolve renders invisible rather than erroring.
export default function LimitModal({ visible, onClose, feature = 'this' }) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const router = useRouter()

  if (!visible) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const c = (name) => (t[name] ? `rgb(${t[name]})` : '#000')

  const go = () => {
    // Close FIRST. Pushing underneath leaves the overlay floating on top of the
    // paywall it just opened — the same ordering the reader's word sheet needs.
    onClose()
    router.push('/paywall')
  }

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
      {/* Tapping the scrim closes — the first thing anyone who opened this by
          accident will try. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        entering={FadeInUp.duration(260).delay(40)}
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: c('--c-cream-50'),
          borderRadius: 18,
          padding: 24,
        }}
      >
        <Text
          style={{ color: c('--c-clay-600'), fontSize: 11, letterSpacing: 2, marginBottom: 10 }}
        >
          DAILY LIMIT REACHED
        </Text>

        <Text
          className="font-serif"
          style={{ color: c('--c-stone-900'), fontSize: 24, fontWeight: '700', marginBottom: 8 }}
        >
          That&apos;s today&apos;s {feature}
        </Text>

        <Text style={{ color: c('--c-stone-700'), fontSize: 14, lineHeight: 21, marginBottom: 20 }}>
          Come back tomorrow, or go Pro for unlimited practice. Your place in this
          lesson is right where you left it.
        </Text>

        <Pressable
          onPress={go}
          style={{
            backgroundColor: c('--c-clay-600'),
            borderRadius: 8,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={{ color: c('--c-cream-50'), fontSize: 15, fontWeight: '700' }}>
            See KawmHmong Pro
          </Text>
        </Pressable>

        <Pressable onPress={onClose} style={{ paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: c('--c-stone-600'), fontSize: 14, fontWeight: '600' }}>
            Stay in the lesson
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}
