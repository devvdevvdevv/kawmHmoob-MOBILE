import { Modal, View, Text, ScrollView, Pressable } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// A single-notice modal — the "one-time ribbon" replacement. Shows a title + one
// or more paragraphs and a primary dismiss button (plus an optional secondary
// action, e.g. "Create account" / "Maybe later").
//
// Buttons are RAW inline Pressables (not the shared <Button>): inside a RN <Modal>
// the theme CSS variables don't cascade, and the shared Button is cache-prone, so
// inlining the colors from theme tokens is the reliable way to get the brown
// primary (see notes/2026-08-04-onboarding-progressive-disclosure).
export default function InfoModal({
  visible,
  emoji,
  title,
  body,                    // string | string[]
  primaryLabel = 'Got it',
  onPrimary,
  secondaryLabel,
  onSecondary,
}) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const primaryBg = `rgb(${t['--c-clay-600']})`   // the brown
  const primaryText = `rgb(${t['--c-cream-50']})`
  const ghostText = `rgb(${t['--c-stone-800']})`
  const paras = Array.isArray(body) ? body : body ? [body] : []

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onPrimary} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ width: '100%', maxWidth: 420, maxHeight: '80%', backgroundColor: cardBg, borderColor: border, borderWidth: 2, borderRadius: 18, padding: 24 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {emoji ? <Text style={{ fontSize: 40, marginBottom: 8 }}>{emoji}</Text> : null}
            <Text className="font-serif" style={{ color: titleColor, fontSize: 24, fontWeight: '700', marginBottom: 12 }}>
              {title}
            </Text>
            {paras.map((p, i) => (
              <Text key={i} style={{ color: bodyColor, fontSize: 15, lineHeight: 23, marginBottom: i < paras.length - 1 ? 12 : 0 }}>
                {p}
              </Text>
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            {secondaryLabel ? (
              <Pressable
                onPress={onSecondary}
                style={({ pressed }) => ({ minHeight: 48, paddingHorizontal: 20, borderRadius: 10, borderWidth: 2, borderColor: border, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.7 : 1 })}
              >
                <Text style={{ color: ghostText, fontSize: 16, fontWeight: '600' }}>{secondaryLabel}</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={onPrimary}
              style={({ pressed }) => ({ minHeight: 48, paddingHorizontal: 24, borderRadius: 10, backgroundColor: primaryBg, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.85 : 1 })}
            >
              <Text style={{ color: primaryText, fontSize: 16, fontWeight: '700' }}>{primaryLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
