import { View, Text } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import Tabs from '../../src/components/Tabs.jsx'
import { consonants, vowels, tones } from '../../src/data/alphabet.js'
import AudioButton from '../../src/components/common/AudioButton.jsx'
import { useProgress } from '../../src/hooks/useProgress.js'
import Button from '../../src/components/ui/Button.jsx'

const tabs = [
  { id: 'consonants', label: 'Consonants' },
  { id: 'vowels', label: 'Vowels' },
  { id: 'tones', label: 'Tones' },
]

const lessonIdMap = {
  consonants: 'alphabet-consonants',
  vowels: 'alphabet-vowels',
  tones: 'alphabet-tones',
}

export default function Alphabet() {
  const { tab } = useLocalSearchParams()
  const { completedLessons, markLessonComplete } = useProgress()
  const lessonId = lessonIdMap[tab]
  const completed = lessonId && completedLessons.includes(lessonId)

  return (
    <View>
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Alphabet</Text>
        <Text className="text-stone-700">
          Hmong uses the Romanized Popular Alphabet (RPA).
        </Text>
      </View>

      <Tabs basePath="/alphabet" tabs={tabs} />

      {tab === 'consonants' && <Grid items={consonants} />}
      {tab === 'vowels' && <Grid items={vowels} />}
      {tab === 'tones' && <ToneList items={tones} />}

      {lessonId && (
        <View className="mt-8 flex-row flex-wrap gap-3">
          <Button
            onPress={() => markLessonComplete(lessonId)}
            disabled={completed}
            variant={completed ? 'secondary' : 'secondary'}
            className={completed ? 'bg-emerald-700' : ''}
          >
            {completed ? '✓ Completed' : 'Mark Complete (+10 XP)'}
          </Button>
          <Link href={`/quiz/${lessonId}`} asChild>
            <Button>Take Quiz</Button>
          </Link>
        </View>
      )}
    </View>
  )
}

function Grid({ items }) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {items.map((it) => (
        <View
          key={it.letter}
          className="rounded-md bg-cream-50 border border-cream-200 p-3 items-center w-[100px]"
        >
          <View className="self-end mb-1">
            <AudioButton audioSrc={null} wordId={it.letter} />
          </View>
          <Text className="font-serif text-2xl text-clay-700">{it.letter}</Text>
          <Text className="text-xs text-stone-500 mt-1 text-center">{it.sound}</Text>
        </View>
      ))}
    </View>
  )
}

function ToneList({ items }) {
  return (
    <View className="gap-2">
      {items.map((t) => (
        <View key={t.name} className="rounded-md bg-cream-50 border border-cream-200 flex-row items-center gap-4 p-4">
          <Text className="w-10 font-serif text-2xl text-clay-700 text-center">
            {t.marker || '–'}
          </Text>
          <View className="flex-1">
            <Text className="font-semibold text-stone-800">{t.name}</Text>
            <Text className="text-sm text-stone-600">{t.description}</Text>
          </View>
          <AudioButton audioSrc={null} wordId={t.name} />
          <Text className="text-sm text-stone-700 italic">{t.example}</Text>
        </View>
      ))}
    </View>
  )
}
