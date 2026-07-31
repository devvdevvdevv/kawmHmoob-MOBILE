import { useMemo, useState } from 'react'
import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import { categories } from '../src/data/vocabulary.js'
import { useProgress } from '../src/hooks/useProgress.js'
import { selectDueWords } from '../src/context/ProgressContext.jsx'
import Flashcard from '../src/components/vocabulary/Flashcard.jsx'
import Button from '../src/components/ui/Button.jsx'
import TabScreen from '../src/components/TabScreen.jsx'

export default function Review() {
  const { vocabSchedule } = useProgress()

  const dueWords = useMemo(() => {
    const allWords = categories.flatMap((c) => c.words)
    return selectDueWords(allWords, vocabSchedule)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [idx, setIdx] = useState(0)

  if (dueWords.length === 0) {
    return (
      <TabScreen>
        <View className="rounded-md bg-cream-50 border border-cream-200 p-10 items-center">
          <Text className="font-serif text-3xl text-stone-900 mb-2">All caught up.</Text>
          <Text className="text-stone-700 mb-6 text-center">
            No words due for review right now. Browse vocabulary to add new ones, or come back later.
          </Text>
          <Link href="/vocabulary" asChild>
            <Button>Browse Vocabulary</Button>
          </Link>
        </View>
      </TabScreen>
    )
  }

  if (idx >= dueWords.length) {
    return (
      <TabScreen>
        <View className="rounded-md bg-cream-50 border border-cream-200 p-10 items-center">
          <Text className="font-serif text-3xl text-stone-900 mb-2">Done.</Text>
          <Text className="text-stone-700 mb-6 text-center">
            You reviewed {dueWords.length} word{dueWords.length === 1 ? '' : 's'}.
          </Text>
          <Link href="/" asChild>
            <Button>Home</Button>
          </Link>
        </View>
      </TabScreen>
    )
  }

  const word = dueWords[idx]
  const advance = () => setIdx((i) => i + 1)

  return (
    <TabScreen>
      <View className="mb-5 flex-row justify-between items-end">
        <View>
          <Text className="font-serif text-4xl text-stone-900 mb-1">Review</Text>
          <Text className="text-stone-700">{idx + 1} of {dueWords.length} due</Text>
        </View>
        <View className="h-2 w-32 bg-cream-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-clay-600"
            style={{ width: `${((idx + 1) / dueWords.length) * 100}%` }}
          />
        </View>
      </View>
      <Flashcard word={word} key={word.id} onAdvance={advance} />
      <View className="mt-4 items-center">
        <Button onPress={advance} variant="ghost" size="sm">Skip →</Button>
      </View>
    </TabScreen>
  )
}
