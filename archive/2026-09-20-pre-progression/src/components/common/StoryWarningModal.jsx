import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// THE CONTENT WARNING, BEFORE THE FIRST LINE OF THE STORY.
//
// ⚠️ WHY THIS EXISTS AS A SCREEN AND NOT A BLURB — 2026-09-13. The warning for
// `story-zong-vang` lived in the library card's `blurb`, which is a sales line
// doing a safety job: it is one sentence, it is skimmed, and it is gone the
// moment the story opens. A reader who tapped through from search or from a
// bookmark never saw it at all.
//
// ⚠️ NOT AN RN <Modal>, for the two reasons LimitModal.jsx documents: on this
// build a Modal's buttons render UNDER the system nav bar, and themed NativeWind
// classes resolve to TRANSPARENT inside one because a Modal is a separate native
// root without the CSS variables. An absolute-fill overlay has neither problem.
//
// ⚠️ EVERY COLOUR IS RESOLVED BY HAND for the same reason — and because a class
// that fails to resolve renders INVISIBLE rather than throwing, which on a
// content warning is the worst possible failure.
//
// ⚠️ NO SCRIM-TAP-TO-DISMISS, unlike every other overlay in this app. Tapping
// outside is how you dismiss something you opened by accident; it is not how
// anyone should get past a mature-content gate. The only ways out are the two
// buttons, and they say what they do.
export default function StoryWarningModal({ warning, onAccept, onDecline }) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const c = (name) => (t[name] ? `rgb(${t[name]})` : '#000')

  const card = c('--c-cream-50')
  const ink = c('--c-stone-900')
  const body = c('--c-stone-700')
  const muted = c('--c-stone-500')
  const rule = c('--c-cream-300')
  const alarm = c('--c-danger-700')

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[
        StyleSheet.absoluteFill,
        {
          // Deliberately heavier than LimitModal's 0.55 — this one should read
          // as a stop, not as a sheet floating over a page you can still see.
          backgroundColor: 'rgba(12, 10, 9, 0.82)',
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
      <Animated.View
        entering={FadeInUp.duration(260).delay(60)}
        style={{
          width: '100%',
          maxWidth: 460,
          maxHeight: '100%',
          backgroundColor: card,
          borderRadius: 14,
          borderWidth: 2,
          borderColor: alarm,
          overflow: 'hidden',
        }}
      >
        <ScrollView contentContainerStyle={{ padding: 22 }}>
          <Text
            style={{
              color: alarm,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 1.6,
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            Content warning
          </Text>

          <Text style={{ color: ink, fontSize: 21, fontWeight: '700', lineHeight: 28, marginBottom: 12 }}>
            {warning.title}
          </Text>

          <Text style={{ color: body, fontSize: 15, lineHeight: 23, marginBottom: 16 }}>
            {warning.body}
          </Text>

          {!!warning.includes?.length && (
            <View
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: rule,
                paddingVertical: 14,
                marginBottom: 18,
              }}
            >
              <Text
                style={{
                  color: muted,
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Includes
              </Text>
              {warning.includes.map((item) => (
                // ⚠️ A real bullet in its own <Text>, not a "• " prefix inside
                // the string: a wrapped line then indents under the text rather
                // than under the bullet, which is what makes a list read as one.
                <View key={item} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={{ color: alarm, fontSize: 15, lineHeight: 22, width: 16 }}>•</Text>
                  <Text style={{ color: body, fontSize: 15, lineHeight: 22, flex: 1 }}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* The destructive-looking action is the one that CONTINUES, and the
              safe-looking one leaves. That is the right way round here. */}
          <Pressable
            onPress={onAccept}
            accessibilityRole="button"
            accessibilityLabel="I understand, continue to the story"
            style={{
              backgroundColor: alarm,
              borderRadius: 10,
              paddingVertical: 14,
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ color: card, fontSize: 15, fontWeight: '700' }}>I understand — continue</Text>
          </Pressable>

          <Pressable
            onPress={onDecline}
            accessibilityRole="button"
            accessibilityLabel="Go back to the library"
            style={{
              borderRadius: 10,
              borderWidth: 2,
              borderColor: rule,
              paddingVertical: 13,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: body, fontSize: 15, fontWeight: '600' }}>Take me back</Text>
          </Pressable>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  )
}
