import { useState } from 'react'
import { View, Text } from 'react-native'
import { Link, Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import { SPEAK_ENABLED } from '../../../src/lib/launch.js'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import PronounceStep from '../../../src/components/speak/PronounceStep.jsx'
import { getWordFamily } from '../../../src/data/wordFamilies.js'
import { useProgress } from '../../../src/hooks/useProgress.js'

// Word-family practice — steps through the family one letter at a time and
// hands each to PronounceStep, the same loop as phrase practice. Progress uses
// the WORD id as the key.
export default function SpeakFamily() {
  if (!SPEAK_ENABLED) return <Redirect href="/speak" />   // v1: Speak coming soon
  const { familyId } = useLocalSearchParams()
  const router = useRouter()
  const family = getWordFamily(familyId)
  const { completedSteps, markStepComplete } = useProgress()
  const [index, setIndex] = useState(0)

  if (!family) {
    return (
      <TabScreen>
        <Text className="text-stone-900 mb-4">Word family not found.</Text>
        <Button onPress={() => router.push('/speak')}>Back to Speak</Button>
      </TabScreen>
    )
  }

  const words = family.words
  const word = words[index]
  const done = completedSteps.includes(word.id)
  const practiced = words.filter((w) => completedSteps.includes(w.id)).length

  const phrase = {
    id: word.id,
    hmong: word.hmong,
    english: word.english,
    audio: word.audio,
    tip: word.vowel
      ? `${word.consonant} + ${word.vowel} + ${word.tone || '(no tone)'}`
      : family.pattern,
  }

  const handleDone = () => {
    if (!done) markStepComplete(word.id)
    if (index < words.length - 1) setIndex(index + 1)
    else router.push('/speak')
  }

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Speak', to: '/speak' },
          { label: family.title },
        ]}
      />

      <View className="mb-6">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-2 w-2 rounded-full bg-clay-600" />
          <Text className="text-xs uppercase tracking-[2px] text-stone-600">Word family</Text>
        </View>
        <Text className="font-serif text-4xl text-stone-900 mb-2">{family.title}</Text>
        <Text className="text-stone-700 leading-relaxed">{family.description}</Text>
      </View>

      <View className="flex-row flex-wrap justify-between items-center gap-2 mb-2">
        <Text className="text-sm text-stone-700">{index + 1} of {words.length}</Text>
        <Text className="text-sm text-stone-600">✓ {practiced} practiced</Text>
      </View>
      <View className="h-1.5 rounded-full bg-cream-200 overflow-hidden mb-6">
        <View className="h-full bg-clay-600" style={{ width: `${((index + 1) / words.length) * 100}%` }} />
      </View>

      <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-6">
        <PronounceStep key={word.id} phrase={phrase} done={done} onDone={handleDone} />
      </View>

      <View className="mt-6 flex-row justify-between items-center gap-3">
        {index > 0 ? (
          <Button variant="secondary" className="flex-1" onPress={() => setIndex(index - 1)}>
            {`← ${words[index - 1].hmong}`}
          </Button>
        ) : (
          <Button variant="secondary" className="flex-1" onPress={() => router.push('/speak')}>
            ← Speak
          </Button>
        )}
        {index < words.length - 1 ? (
          <Button variant="secondary" className="flex-1" onPress={() => setIndex(index + 1)}>
            {`${words[index + 1].hmong} →`}
          </Button>
        ) : (
          <Button variant="secondary" className="flex-1" onPress={() => router.push('/speak')}>
            Finish →
          </Button>
        )}
      </View>
    </TabScreen>
  )
}
