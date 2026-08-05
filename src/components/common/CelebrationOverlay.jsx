import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import { useCelebration } from '../../context/CelebrationContext.jsx'
import Confetti from './Confetti.jsx'

// Rendered ONCE at the root (in ThemedShell, AFTER the header/tab bar) so it sits
// on top of everything and fills the whole viewport — fixing the earlier problems
// where the in-screen version was under the floating bars and clipped to the right.
// Confetti is in the normal tree (not a Modal) so it animates cleanly.
export default function CelebrationOverlay() {
  const { celebration, dismiss } = useCelebration()
  const { theme } = useTheme()

  if (!celebration) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const primaryBg = `rgb(${t['--c-clay-600']})`
  const primaryText = `rgb(${t['--c-cream-50']})`

  const done = () => {
    const cb = celebration.onDone
    dismiss()
    if (cb) cb()
  }

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 9999, elevation: 9999 },
      ]}
    >
      {/* full-viewport confetti behind the card */}
      <Confetti />

      <View style={{ width: '100%', maxWidth: 420, backgroundColor: cardBg, borderColor: border, borderWidth: 2, borderRadius: 18, padding: 28, alignItems: 'center' }}>
        <Text style={{ fontSize: 56, marginBottom: 8 }}>🎉</Text>
        <Text className="font-serif" style={{ color: titleColor, fontSize: 26, fontWeight: '700', marginBottom: 10, textAlign: 'center' }}>
          Lesson complete!
        </Text>
        <Text style={{ color: bodyColor, fontSize: 16, lineHeight: 24, textAlign: 'center', marginBottom: 24 }}>
          You’ve successfully completed “{celebration.title}.”
        </Text>
        <Pressable
          onPress={done}
          style={({ pressed }) => ({ minHeight: 50, paddingHorizontal: 28, borderRadius: 10, backgroundColor: primaryBg, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', opacity: pressed ? 0.85 : 1 })}
        >
          <Text style={{ color: primaryText, fontSize: 16, fontWeight: '700' }}>Back to lessons</Text>
        </Pressable>
      </View>
    </View>
  )
}
