import { View, Text } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'

// The letter tile grid — consonants and vowels. items: [{ letter, sound?, audio? }]
export default function LetterGrid({ items }) {
  const { theme } = useTheme()
  // Letters are the clay accent on the light theme, but on the dark / neon
  // (starry) themes clay reads as near-black on the dark card — so switch to
  // white for contrast. Inline color overrides the className.
  const letterStyle = theme === 'light' ? undefined : { color: '#ffffff' }

  return (
    <View className="flex-row flex-wrap gap-3">
      {items.map((it) => (
        <View key={it.letter} className="w-[100px] rounded-md bg-cream-50 border border-cream-200 p-3 items-center">
          <View className="self-end mb-1">
            <AudioButton audioSrc={it.audio} wordId={it.letter} />
          </View>
          <Text className="font-serif text-2xl text-clay-700" style={letterStyle}>
            {it.letter}
          </Text>
          {it.sound ? (
            <Text className="text-xs text-stone-500 mt-1 text-center">{it.sound}</Text>
          ) : null}
        </View>
      ))}
    </View>
  )
}
