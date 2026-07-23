import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useProgress } from '../../hooks/useProgress.js'
import AudioButton from '../common/AudioButton.jsx'

export default function Flashcard({ word, onAdvance }) {
  const [flipped, setFlipped] = useState(false)
  const { vocabProgress, setVocabStatus } = useProgress()
  const status = vocabProgress[word.id] || 'new'

  const mark = (next) => {
    setVocabStatus(word.id, next)
    if (onAdvance) setTimeout(onAdvance, 250)
  }

  return (
    <View>
      <Pressable
        onPress={() => setFlipped(!flipped)}
        className="rounded-md bg-cream-50 border border-cream-200 p-10 min-h-[280px] items-center justify-center"
      >
        {!flipped ? (
          <>
            <View className="flex-row items-center gap-3 mb-3">
              <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
              <Text className="font-serif text-5xl text-clay-700">{word.hmongRPA}</Text>
            </View>
            <Text className="text-sm text-stone-500 italic">Tap to flip</Text>
          </>
        ) : (
          <>
            <Text className="font-serif text-3xl text-stone-900 mb-2 text-center">
              {word.english}
            </Text>
            {word.exampleSentence && (
              <View className="items-center mt-4 max-w-md">
                <Text className="italic text-clay-700 mb-1 text-center">
                  {word.exampleSentence.hmong}
                </Text>
                <Text className="text-sm text-stone-600 text-center">
                  {word.exampleSentence.english}
                </Text>
              </View>
            )}
          </>
        )}
      </Pressable>
      <View className="flex-row gap-2 mt-4 justify-center">
        <Pressable
          onPress={() => mark('learning')}
          className={`px-4 py-2 rounded shadow-warm ${
            status === 'learning' ? 'bg-clay-600' : 'bg-cream-200'
          }`}
        >
          <Text className={`text-sm font-semibold ${
            status === 'learning' ? 'text-cream-50' : 'text-clay-700'
          }`}>
            Mark Learning
          </Text>
        </Pressable>
        <Pressable
          onPress={() => mark('known')}
          className={`px-4 py-2 rounded shadow-warm ${
            status === 'known' ? 'bg-emerald-700' : 'bg-emerald-100'
          }`}
        >
          <Text className={`text-sm font-semibold ${
            status === 'known' ? 'text-cream-50' : 'text-emerald-800'
          }`}>
            Mark Known
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
