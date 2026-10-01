import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// "ARE YOU SURE YOU WANT TO LEAVE?" — the reader's exit confirmation.
//
// ⚠️ NOT AN RN <Modal>, and every colour resolved by hand — the same two
// reasons LimitModal.jsx and StoryWarningModal.jsx document: a Modal's buttons
// render under the system nav bar on this build, and themed NativeWind classes
// resolve to TRANSPARENT inside one.
//
// ⚠️ THE SCRIM DOES DISMISS THIS ONE, unlike the content warning. The two
// overlays look alike and are opposites: a content gate must not be escapable by
// a stray tap, but an "are you sure" that traps you is a worse bug than the
// thing it prevents. Tapping outside means "no, stay" — the safe answer.
//
// ⚠️ IT SAYS PROGRESS IS KEPT, because it is. readingProgress.js bookmarks the
// scroll offset and every revealed line. A confirmation that implies loss where
// there is none trains people to ignore confirmations.
//
// The copy props are all OPTIONAL and default to the story wording below — the
// reader's hardware-back call site passes none of them and is unchanged. They
// exist so NavGuardContext can reuse this exact dialog (and so the tab-bar
// prompt and the back prompt are visibly the same thing) without this component
// having to know what a nav guard is.
export default function LeaveReadingModal({
  visible,
  onStay,
  onLeave,
  title = 'Leave this story?',
  message = 'Your place is saved — the line you reached and everything you have revealed will be here when you come back.',
  stayLabel = 'Keep reading',
  leaveLabel = 'Leave',
}) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  if (!visible) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const c = (name) => (t[name] ? `rgb(${t[name]})` : '#000')

  const card = c('--c-cream-50')
  const ink = c('--c-stone-900')
  const body = c('--c-stone-700')
  const rule = c('--c-cream-300')
  const accent = c('--c-clay-600')

  return (
    <Animated.View
      entering={FadeIn.duration(160)}
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(28, 25, 23, 0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
          zIndex: 9998,
          elevation: 9998,
        },
      ]}
    >
      {/* The scrim is the "stay" target — see the note above. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onStay} accessibilityElementsHidden />

      <Animated.View
        entering={FadeInUp.duration(220).delay(40)}
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: card,
          borderRadius: 14,
          padding: 22,
        }}
      >
        <Text style={{ color: ink, fontSize: 19, fontWeight: '700', lineHeight: 26, marginBottom: 10 }}>
          {title}
        </Text>

        <Text style={{ color: body, fontSize: 15, lineHeight: 23, marginBottom: 20 }}>
          {message}
        </Text>

        <Pressable
          onPress={onStay}
          accessibilityRole="button"
          accessibilityLabel={stayLabel}
          style={{
            backgroundColor: accent,
            borderRadius: 10,
            paddingVertical: 14,
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={{ color: card, fontSize: 15, fontWeight: '700' }}>{stayLabel}</Text>
        </Pressable>

        <Pressable
          onPress={onLeave}
          accessibilityRole="button"
          accessibilityLabel={leaveLabel}
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: rule,
            paddingVertical: 13,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: body, fontSize: 15, fontWeight: '600' }}>{leaveLabel}</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  )
}
