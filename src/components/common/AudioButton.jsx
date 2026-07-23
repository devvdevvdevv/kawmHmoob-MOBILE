import { Pressable, Text } from 'react-native'
import { useAudio } from '../../hooks/useAudio.js'

export default function AudioButton({ audioSrc, wordId, size = 'sm' }) {
  const { play } = useAudio()
  const enabled = Boolean(audioSrc)
  const dim = size === 'lg' ? 'h-10 w-10' : 'h-7 w-7'
  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation?.()
        if (enabled) play(audioSrc, wordId)
      }}
      disabled={!enabled}
      className={`items-center justify-center rounded-full ${dim} ${
        enabled ? 'bg-clay-500 shadow-warm' : 'bg-cream-200'
      }`}
    >
      <Text className={enabled ? 'text-cream-50' : 'text-stone-400'}>♪</Text>
    </Pressable>
  )
}
