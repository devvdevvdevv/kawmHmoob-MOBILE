import { View, Text } from 'react-native'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import { TOKEN_SPLIT, isSeparator } from '../../lib/defineToken.js'

// ONE LINE OF HMONG, EVERY WORD PRESSABLE — 2026-09-25.
//
// The story reader's token loop (app/reading/story/[storyId]/index.jsx) as a
// component, so the path's Reading step can offer the same "press a word, see
// it" without copying 90 lines. Pair it with defineToken() and <WordSheet>.
//
//   gesture="tap"        the path reading — nothing else on a line listens for a tap
//   gesture="longPress"  stories — there a tap already toggles the line's English
//
// ⚠️ THE SPLIT IS TOKEN_SPLIT, SHARED WITH defineToken. The index passed to
// onDefine is this component's index into `text.split(TOKEN_SPLIT)`, and
// defineToken re-splits the same line to find the neighbouring words. Two
// different splits would point tier 0 at the wrong word.
//
// Guide: notes/2026-09-25-GUIDE-path-reading-tap-to-define.md

/**
 * The highlight behind the word being looked up: clay-600 at 22%, built from
 * the token table so it exists in every theme. Moved from the story reader's
 * `lookupTint`. A tint that silently fails to resolve is indistinguishable from
 * a broken gesture, so it falls back to a literal.
 */
export function useLookupTint() {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const channels = t['--c-clay-600']
  return channels ? `rgba(${channels.split(' ').join(', ')}, 0.22)` : 'rgba(193, 122, 86, 0.22)'
}

export default function TappableLine({
  text,
  lineKey,
  activeTokenId,
  onDefine,
  gesture = 'tap',
  textClassName = '',
  textStyle,
  // The line's sense pins (2026-09-26), handed back to onDefine — see defineToken.
  means = null,
}) {
  const tint = useLookupTint()

  return (
    <Text className={textClassName} style={textStyle}>
      {String(text).split(TOKEN_SPLIT).map((token, i) => {
        // Separators render as plain text — a pressable space or dash is a
        // mis-tap waiting to happen.
        if (!token || isSeparator(token)) return token

        // Unique per OCCURRENCE, not per word, so only the pressed copy lights.
        const tokenId = `${lineKey}-${i}`
        const press = () => onDefine(token, tokenId, text, i, means)
        const handlers = gesture === 'longPress' ? { onLongPress: press } : { onPress: press }

        // ⚠️ THE HIGHLIGHTED WORD IS AN INLINE <View>, AND ONLY WHILE HIGHLIGHTED.
        // A nested <Text> can take a background colour but no radius or padding
        // (spans have no box on either platform), so a rounded chip needs a real
        // View. A View inside a Text does NOT inherit its style, so the type is
        // restated on the inner Text — keep it the same as the outer Text's.
        // Same technique, and same reasons, as the story reader (2026-09-12).
        if (activeTokenId === tokenId) {
          return (
            <View
              key={i}
              style={{ backgroundColor: tint, borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1 }}
            >
              <Text {...handlers} suppressHighlighting className={textClassName} style={textStyle}>
                {token}
              </Text>
            </View>
          )
        }

        return (
          <Text key={i} {...handlers} suppressHighlighting>
            {token}
          </Text>
        )
      })}
    </Text>
  )
}
