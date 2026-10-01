import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import {
  DIRECTION_OPTIONS,
  COUNT_OPTIONS,
  // TYPE_OPTIONS,  ← restore with the Question type control below
  FILTER_OPTIONS,
  ORDER_OPTIONS,
} from '../../lib/quizPrefs.js'

// Settings that apply to EVERY quiz, plus the study deck's order. Opened from the
// ⚙ above the quiz button on a vocabulary category page.
//
// Same shape and reasoning as SpeakSettingsSheet — deliberately, so the two gears
// in this app behave identically. Both carry the same two traps:
//
//   ⚠️ NOT a React Native <Modal>. On this build a Modal's buttons render under
//   the system nav bar. A plain absolute-fill overlay with a high zIndex and
//   elevation is the pattern that works.
//   See notes/2026-08-06-header-page-info-button.md.
//
//   ⚠️ style, never className, on any Animated.View — NativeWind does not process
//   className on third-party animated components.
//   See learning/concepts/nativewind-classname-on-third-party.md.
//
// Every control writes straight through to the stored preference: no Save button
// and no local draft state. A settings sheet with a Save button invites you to
// close it and wonder whether anything took effect. "Done" below just closes.
export default function QuizSettingsSheet({ visible, onClose, prefs, setPref, notes = [] }) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  if (!visible) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const railBg = `rgb(${t['--c-cream-100']})`
  // const border = `rgb(${t['--c-cream-200']})` — the card uses a shadow now, not a hairline
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const mutedColor = `rgb(${t['--c-stone-500']})`
  const accent = `rgb(${t['--c-clay-600']})`
  const onAccent = `rgb(${t['--c-cream-50']})`

  // ⚠️ EQUAL vertical padding, deliberately — not `insets.top` on top and
  // `insets.bottom` on the bottom. Those differ (a notch is ~50pt, a home
  // indicator ~34pt), and unequal padding on a `justifyContent: 'center'` box
  // shifts the card off true centre by the difference. Taking the LARGER of the
  // two for both sides keeps the card optically centred AND clear of both.
  const vPad = Math.max(insets.top, insets.bottom, 20) + 16

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'rgba(0,0,0,0.6)',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: vPad,
          paddingBottom: vPad,
          paddingHorizontal: 20,
          zIndex: 9999,
          elevation: 9999,
        },
      ]}
    >
      {/* Tapping the backdrop closes — the first thing anyone who opened this by
          accident will try. */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <Animated.View
        entering={FadeInUp.duration(240).delay(40)}
        style={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: cardBg,
          borderRadius: 20,
          overflow: 'hidden',
          // A real shadow instead of a border: the card should read as lifted off
          // the dimmed page, and a hairline on cream reads as grubby (the same
          // reason the card borders came off elsewhere on 2026-08-29).
          shadowColor: '#000',
          shadowOpacity: 0.28,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 12 },
          elevation: 14,
          maxHeight: '100%',
        }}
      >
        {/* Header on its own tinted rail, so the title stays put while the
            controls scroll under it. */}
        <View
          style={{
            backgroundColor: railBg,
            paddingHorizontal: 22,
            paddingTop: 18,
            paddingBottom: 14,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text className="font-serif" style={{ color: titleColor, fontSize: 21, fontWeight: '700' }}>
              Quiz &amp; study settings
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={14}
              accessibilityRole="button"
              accessibilityLabel="Close settings"
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: cardBg,
              }}
            >
              <Text style={{ color: bodyColor, fontSize: 17, fontWeight: '700', lineHeight: 20 }}>×</Text>
            </Pressable>
          </View>
          <Text style={{ color: mutedColor, fontSize: 12.5, marginTop: 4 }}>
            Applies to every quiz, and is remembered.
          </Text>
        </View>

        <ScrollView
          style={{ flexShrink: 1 }}
          contentContainerStyle={{ padding: 22, paddingBottom: 6 }}
          showsVerticalScrollIndicator={false}
        >
          <Choice
            t={t}
            label="Direction"
            hint="Recognising Hmong is easier than producing it."
            options={DIRECTION_OPTIONS}
            value={prefs.direction}
            onChange={(v) => setPref('direction', v)}
          />
          <Choice
            t={t}
            label="Length"
            hint="How many questions a quiz asks."
            options={COUNT_OPTIONS}
            value={prefs.questionCount}
            onChange={(v) => setPref('questionCount', v)}
          />
          {/* QUESTION TYPE — commented out 2026-08-29. The engine supports
              `matching`, but no quiz has ever declared it, so the mode has never
              actually run; offering it as a setting shipped untested code as a
              user-facing choice. Restore this block AND the override in
              buildQuestions() (QuizEngine.jsx) together — the control alone does
              nothing, and the override alone is unreachable.
          <Choice
            t={t}
            label="Question type"
            options={TYPE_OPTIONS}
            value={prefs.questionType}
            onChange={(v) => setPref('questionType', v)}
          /> */}
          <Choice
            t={t}
            label="Words to include"
            hint="Vocabulary quizzes only — filters by how you've marked each word."
            options={FILTER_OPTIONS}
            value={prefs.statusFilter}
            onChange={(v) => setPref('statusFilter', v)}
          />
          <Choice
            t={t}
            label="Flashcard order"
            hint="Study mode. Shuffle once the sequence itself becomes the memory."
            options={ORDER_OPTIONS}
            value={prefs.cardOrder}
            onChange={(v) => setPref('cardOrder', v)}
            last
          />

          {/* Live notes from the page that opened this — e.g. "this quiz can only
              be asked one way". Shown HERE, next to the controls, rather than as
              a toast that appears and leaves. */}
          {notes.length > 0 && (
            <View
              style={{
                marginTop: 20,
                padding: 13,
                borderRadius: 12,
                backgroundColor: railBg,
                gap: 6,
              }}
            >
              {notes.map((n, i) => (
                <Text key={i} style={{ color: bodyColor, fontSize: 12, lineHeight: 17 }}>
                  {n}
                </Text>
              ))}
            </View>
          )}
        </ScrollView>

        {/* A Done button because the × is small and a backdrop tap is not
            discoverable. It only closes — nothing here needs saving. */}
        <View style={{ paddingHorizontal: 22, paddingTop: 12, paddingBottom: 18 }}>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            style={{
              backgroundColor: accent,
              borderRadius: 12,
              minHeight: 46,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: onAccent, fontSize: 15, fontWeight: '700' }}>Done</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

// A labelled row of pills. Pills rather than a dropdown because every one of
// these has 2-4 short options: showing them all costs one line and removes a tap.
function Choice({ t, label, hint, options, value, onChange, last = false }) {
  const labelColor = `rgb(${t['--c-stone-800']})`
  const mutedColor = `rgb(${t['--c-stone-500']})`
  const activeBg = `rgb(${t['--c-clay-600']})`
  const activeText = `rgb(${t['--c-cream-50']})`
  const idleBg = `rgb(${t['--c-cream-100']})`
  const idleText = `rgb(${t['--c-stone-700']})`

  return (
    <View style={{ marginBottom: last ? 0 : 20 }}>
      <Text style={{ color: labelColor, fontSize: 14, fontWeight: '700', marginBottom: hint ? 2 : 9 }}>
        {label}
      </Text>
      {hint && <Text style={{ color: mutedColor, fontSize: 12, marginBottom: 9, lineHeight: 16 }}>{hint}</Text>}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {options.map((o) => {
          const active = o.value === value
          return (
            <Pressable
              key={String(o.value)}
              onPress={() => onChange(o.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                minHeight: 38,
                justifyContent: 'center',
                backgroundColor: active ? activeBg : idleBg,
              }}
            >
              <Text
                style={{
                  color: active ? activeText : idleText,
                  fontSize: 13,
                  fontWeight: active ? '700' : '500',
                }}
              >
                {o.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
