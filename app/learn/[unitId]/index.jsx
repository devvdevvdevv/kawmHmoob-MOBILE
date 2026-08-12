import { View, Text } from 'react-native'
import { useLocalSearchParams, useRouter, Redirect } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import LessonCard from '../../../src/components/learn/LessonCard.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import { getUnit, lessonProgress } from '../../../src/data/lessons.js'
import { useProgress } from '../../../src/hooks/useProgress.js'

// One unit's full lesson list — /learn/:unitId. Mirrors the web Unit page:
// a header with progress + a "Start/Continue" button, then the lessons (split
// into headed groups if the unit defines them, otherwise a flat list).
export default function Unit() {
  const { unitId } = useLocalSearchParams()
  const router = useRouter()
  // Readings unit is WIP → hidden in release builds (dev-only).
  if (unitId === 'readings' && !__DEV__) return <Redirect href="/learn" />
  const unit = getUnit(unitId)
  const { completedSteps } = useProgress()

  if (!unit) {
    return (
      <TabScreen>
        <Text className="text-stone-900 mb-4">Unit not found.</Text>
        <Button onPress={() => router.push('/learn')}>Back to Learn</Button>
      </TabScreen>
    )
  }

  const total = unit.lessons.length
  const done = unit.lessons.filter((l) => lessonProgress(l, completedSteps).complete).length
  const pct = total ? Math.round((done / total) * 100) : 0
  const next = unit.lessons.find((l) => !lessonProgress(l, completedSteps).complete)

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Learn', to: '/learn' },
          { label: unit.title },
        ]}
      />

      <View className="mb-8">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-2 w-2 rounded-full bg-clay-500" />
          <Text className="text-xs uppercase tracking-[2px] text-stone-600">Unit</Text>
        </View>
        <Text className="font-serif text-4xl text-stone-900 mb-2">{unit.title}</Text>
        <Text className="text-stone-700">{unit.description}</Text>

        <View className="mt-5 flex-row flex-wrap items-center gap-4">
          <View className="flex-row items-center gap-3">
            <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
              <View className="h-full bg-clay-600" style={{ width: `${pct}%` }} />
            </View>
            <Text className="text-sm text-stone-700">
              {done} of {total} lessons
            </Text>
          </View>
          {next && (
            <Button onPress={() => router.push(`/learn/${unit.id}/${next.id}`)}>
              {done === 0 ? 'Start unit' : 'Continue'} →
            </Button>
          )}
        </View>
      </View>

      {unit.groups ? (
        <View className="gap-10">
          {unit.groups.map((g) => (
            <View key={g.id}>
              <View className="mb-4">
                <Text className="font-serif text-2xl text-stone-900">
                  {g.title}{' '}
                  <Text className="text-stone-400 text-base">({g.lessons.length})</Text>
                </Text>
                {g.blurb && <Text className="text-sm text-stone-600">{g.blurb}</Text>}
              </View>
              <View className="gap-4">
                {g.lessons.map((lesson) => (
                  <LessonCard key={lesson.id} unit={unit} lesson={lesson} />
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="gap-4">
          {unit.lessons.map((lesson) => (
            <LessonCard key={lesson.id} unit={unit} lesson={lesson} />
          ))}
        </View>
      )}
    </TabScreen>
  )
}
