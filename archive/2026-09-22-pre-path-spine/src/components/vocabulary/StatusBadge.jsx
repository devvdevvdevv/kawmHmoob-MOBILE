import { View, Text } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// The one status flag for a vocabulary word: New / Learning / Known.
//
// Lifted out of Flashcard.jsx so the flashcard and the word detail page can't
// drift into two different visual languages for the same fact. `new` is the
// default for any word with no vocabProgress entry, so an unstudied word says
// so rather than showing nothing.
export const STATUS = {
  new: { label: 'New', pill: '--c-cream-200', text: '--c-stone-700' },
  learning: { label: 'Learning', pill: '--c-clay-600', text: '--c-cream-50' },
  known: { label: 'Known', pill: '--c-success-700', text: '--c-cream-50' },
}

export function statusLabel(status) {
  return (STATUS[status] || STATUS.new).label
}

// Fully inline styles (not className): NativeWind's className interop is
// unreliable on the flashcard's animated faces, so the pill's position and color
// come from theme tokens directly — same approach the card faces use.
//
// `floating` pins it to the top-left corner of a positioned parent (the card).
// Without it the pill sits in normal flow and shrinks to its own width.
export default function StatusBadge({ status, floating = false }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const s = STATUS[status] || STATUS.new

  return (
    <View
      style={{
        ...(floating
          ? { position: 'absolute', top: 12, left: 12, zIndex: 10 }
          : { alignSelf: 'flex-start' }),
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: `rgb(${t[s.pill]})`,
      }}
    >
      <Text
        style={{
          color: `rgb(${t[s.text]})`,
          fontSize: 11,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {s.label}
      </Text>
    </View>
  )
}
