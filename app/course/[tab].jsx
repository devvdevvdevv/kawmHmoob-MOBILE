import { View, Text } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import Tabs from '../../src/components/Tabs.jsx'
import { grammar, everyday, readings } from '../../src/data/course.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import Button from '../../src/components/ui/Button.jsx'

const tabs = [
  { id: 'grammar', label: 'Grammar' },
  { id: 'everyday', label: 'Everyday' },
  { id: 'reading', label: 'Reading' },
]

const lessonIdMap = {
  grammar: 'course-grammar',
  everyday: 'course-everyday',
  reading: 'course-reading',
}

const quizMap = {
  grammar: 'grammar-pronouns',
  everyday: 'everyday-greetings',
  reading: null,
}

export default function Course() {
  const { tab } = useLocalSearchParams()
  const { completedLessons, markLessonComplete } = useProgress()
  const lessonId = lessonIdMap[tab]
  const quizId = quizMap[tab]
  const completed = lessonId && completedLessons.includes(lessonId)

  return (
    <View>
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Course</Text>
        <Text className="text-stone-700">Grammar, everyday speech, and reading practice.</Text>
      </View>

      <Tabs basePath="/course" tabs={tabs} />

      {tab === 'grammar' && <GrammarSection sections={grammar} />}
      {tab === 'everyday' && <PhraseList groups={everyday} />}
      {tab === 'reading' && <ReadingList items={readings} />}

      {lessonId && (
        <View className="mt-8 flex-row flex-wrap gap-3">
          <Button
            onPress={() => markLessonComplete(lessonId)}
            disabled={completed}
            variant="secondary"
            className={completed ? 'bg-emerald-700' : ''}
          >
            {completed ? '✓ Completed' : 'Mark Complete (+10 XP)'}
          </Button>
          {quizId && (
            <Link href={`/quiz/${quizId}`} asChild>
              <Button>Take Quiz</Button>
            </Link>
          )}
        </View>
      )}
    </View>
  )
}

function GrammarSection({ sections }) {
  return (
    <View className="gap-4">
      {sections.map((s) => (
        <View key={s.title} className="rounded-md bg-cream-50 border border-cream-200 p-5">
          <Text className="font-serif text-xl text-stone-900 mb-1">{s.title}</Text>
          <Text className="text-sm text-stone-500 mb-3 italic">{s.note}</Text>
          {s.items.map((it, i) => (
            <View
              key={it.hmong}
              className={`flex-row justify-between py-2 ${i > 0 ? 'border-t border-cream-200' : ''}`}
            >
              <Text className="text-sm font-semibold text-clay-700">{it.hmong}</Text>
              <Text className="text-sm text-stone-600">{it.english}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

function PhraseList({ groups }) {
  return (
    <View className="gap-4">
      {groups.map((g) => (
        <View key={g.title} className="rounded-md bg-cream-50 border border-cream-200 p-5">
          <Text className="font-serif text-xl text-stone-900 mb-3">{g.title}</Text>
          <View className="gap-2">
            {g.items.map((p) => (
              <View key={p.hmong} className="flex-row justify-between">
                <Text className="text-sm font-semibold text-clay-700">{p.hmong}</Text>
                <Text className="text-sm text-stone-600">{p.english}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

function ReadingList({ items }) {
  return (
    <View className="gap-4">
      {items.map((r) => (
        <View key={r.title} className="rounded-md bg-cream-50 border border-cream-200 p-5">
          <Text className="font-serif text-xl text-stone-900 mb-1">{r.title}</Text>
          <Text className="text-xs uppercase tracking-wider text-clay-600 mb-3">{r.level}</Text>
          <Text className="text-stone-800 italic mb-2">{r.hmong}</Text>
          <Text className="text-sm text-stone-600">{r.english}</Text>
        </View>
      ))}
    </View>
  )
}
