import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import Confetti from '../common/Confetti.jsx'

// Shown when a Speak lesson's last step is completed.
//
// Differs from the shared CelebrationOverlay (used by the Learn module) because
// that one offers a SINGLE action. A finished Speak lesson has three sensible
// next moves — redo it, start another lesson, or leave — and which one the
// learner wants is genuinely unknown. Redo matters here in a way it doesn't for
// Learn: pronunciation improves by repetition, so "again" is often the RIGHT
// choice rather than a failure state.
//
// ⚠️ NOT a React Native <Modal>. Same reason as PageInfoModal: on this build a
// Modal's buttons render under the system nav bar. This is a plain absolute-fill
// overlay with a high elevation/zIndex — the proven pattern.
// See notes/2026-08-06-header-page-info-button.md.
//
// ⚠️ Static style OBJECTS only, never style FUNCTIONS — NativeWind drops the
// function form on native and the element renders invisible.
// See notes/2026-08-06-nativewind-drops-function-style-invisible-buttons.md.

export default function LessonCompleteModal({
  visible,
  lessonTitle,
  stats,          // { attempted, total }
  nextLesson,     // { id, title } | null
  onRedo,
  onNextLesson,
  onExit,
}) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  if (!visible) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const mutedColor = `rgb(${t['--c-stone-500'] || t['--c-stone-700']})`
  const primaryBg = `rgb(${t['--c-clay-600']})`
  const primaryText = `rgb(${t['--c-cream-50']})`
  const ghostText = `rgb(${t['--c-stone-800']})`
  const chipBg = `rgb(${t['--c-cream-100']})`

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
      {/* Full-viewport confetti behind the card. Not a Modal, so it animates in
          the normal tree. */}
      <Confetti />

      <Animated.View
        // Card rises while the backdrop fades — 40ms behind it, so the dim lands
        // first and the card arrives ON something rather than with it.
        entering={FadeInUp.duration(260).delay(40)}
        style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: cardBg,
          borderColor: border,
          borderWidth: 2,
          borderRadius: 18,
          padding: 24,
          position: 'relative',
        }}
      >
        {/* Always-visible close — leaves without choosing a next action. */}
        <Pressable
          onPress={onExit}
          hitSlop={12}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: ghostText, fontSize: 26, fontWeight: '600', lineHeight: 26 }}>
            ×
          </Text>
        </Pressable>

        {/* flexShrink:1 on the scroll body + flexShrink:0 on the footer is the
            rule from notes/2026-08-06 — without it the buttons get pushed off
            the bottom edge on device while looking fine on web. */}
        <ScrollView style={{ maxHeight: 280, flexShrink: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={{ fontSize: 52, textAlign: 'center', marginBottom: 6 }}>🎉</Text>
          <Text
            className="font-serif"
            style={{
              color: titleColor,
              fontSize: 24,
              fontWeight: '700',
              marginBottom: 8,
              textAlign: 'center',
              paddingHorizontal: 20,
            }}
          >
            Lesson complete!
          </Text>
          <Text
            style={{
              color: bodyColor,
              fontSize: 15,
              lineHeight: 22,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            You finished “{lessonTitle}.”
          </Text>

          {stats?.total ? (
            <View
              style={{
                backgroundColor: chipBg,
                borderColor: border,
                borderWidth: 1,
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 14,
                marginBottom: 4,
              }}
            >
              <Text style={{ color: bodyColor, fontSize: 13, textAlign: 'center' }}>
                {stats.attempted} of {stats.total} speaking steps recorded
              </Text>
              {/* Deliberately NOT a grade. It reports what happened; it does not
                  judge it. Repetition is the goal, not a high score. */}
            </View>
          ) : null}
        </ScrollView>

        <View style={{ flexShrink: 0, marginTop: 18, gap: 10 }}>
          {/* REDO FIRST, deliberately. For pronunciation, going again is usually
              the most valuable next action — not a consolation prize. */}
          <Pressable
            onPress={onRedo}
            style={{
              minHeight: 50,
              borderRadius: 10,
              backgroundColor: primaryBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: primaryText, fontSize: 16, fontWeight: '700' }}>
              Practise again
            </Text>
          </Pressable>

          {nextLesson ? (
            <Pressable
              onPress={onNextLesson}
              style={{
                minHeight: 50,
                borderRadius: 10,
                backgroundColor: chipBg,
                borderColor: border,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{ color: ghostText, fontSize: 15, fontWeight: '600' }}
                numberOfLines={1}
              >
                Next: {nextLesson.title}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={onExit}
            style={{
              minHeight: 44,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: mutedColor, fontSize: 14, fontWeight: '600' }}>
              All lessons
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  )
}
