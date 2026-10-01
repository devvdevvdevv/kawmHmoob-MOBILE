import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// Settings that apply to EVERY Speak lesson, reachable from the ⚙ in a lesson's
// header. A centred modal card. Deliberately empty for now — the shell exists so the entry point is
// consistent from the first lesson a learner ever opens, rather than appearing
// later and moving things around.
//
// WHAT BELONGS HERE (all of it already decided elsewhere, none of it built):
//   • auto-advance on/off + speed — currently hardcoded in LessonScroll's
//     AUTO_ADVANCE_MS
//   • A/B compare order and gap — currently GAP_MS = 300, native→you→native
//   • require-a-recording gate — currently on for everyone but admins
//   • dialect preference — already on the account (dialectPreference: 'white'),
//     but a per-session override may make sense for Speak specifically
//   • playback speed for native clips — the obvious first request from learners
//
// ⚠️ Whatever lands here must PERSIST across lessons, which means it belongs in
// a context or AsyncStorage, NOT in LessonScroll state — that component is
// remounted on every "Practise again" (see the key={runKey} trick in the route),
// so anything held there is wiped on redo.
//
// Centred card rather than a bottom sheet: it holds a handful of toggles, not a
// long list, and a sheet that only fills a third of the screen reads as unfinished.
//
// ⚠️ NOT a React Native <Modal>. On this build a Modal's buttons render under
// the system nav bar — plain absolute-fill overlay with a high zIndex/elevation
// is the proven pattern. See notes/2026-08-06-header-page-info-button.md.

export default function SpeakSettingsSheet({ visible, onClose }) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  if (!visible) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const mutedColor = `rgb(${t['--c-stone-500']})`
  const ghostText = `rgb(${t['--c-stone-800']})`

  return (
    <Animated.View
      // Backdrop fades; the card rises. Two separate motions so the dim reads as
      // "the app receded" and the card as "this arrived".
      // ⚠️ style, never className — NativeWind does not process className on
      // Animated.View. See learning/concepts/nativewind-classname-on-third-party.md
      entering={FadeIn.duration(180)}
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.55)',
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
      {/* Tapping the backdrop closes — the first thing anyone who opened this by
          accident will try. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        // Card rises while the backdrop fades — 40ms behind it, so the dim lands
        // first and the card arrives ON something rather than with it.
        entering={FadeInUp.duration(260).delay(40)}
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: cardBg,
          borderWidth: 2,
          borderColor: border,
          borderRadius: 18,
          padding: 24,
          maxHeight: '75%',
        }}
      >
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="font-serif"
            style={{ color: titleColor, fontSize: 22, fontWeight: '700' }}
          >
            Speaking settings
          </Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={{ color: ghostText, fontSize: 24, fontWeight: '600', lineHeight: 24 }}>
              ×
            </Text>
          </Pressable>
        </View>
        <Text style={{ color: mutedColor, fontSize: 13, marginBottom: 20 }}>
          These apply to every lesson.
        </Text>

        <ScrollView style={{ flexShrink: 1 }} showsVerticalScrollIndicator={false}>
          <View
            style={{
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: border,
              borderRadius: 12,
              paddingVertical: 32,
              paddingHorizontal: 20,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>⚙️</Text>
            <Text
              style={{
                color: bodyColor,
                fontSize: 14,
                textAlign: 'center',
                lineHeight: 20,
              }}
            >
              Nothing to change yet.
            </Text>
            <Text
              style={{
                color: mutedColor,
                fontSize: 12,
                textAlign: 'center',
                lineHeight: 18,
                marginTop: 6,
              }}
            >
              Auto-advance, playback speed, and A/B order will live here.
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  )
}
