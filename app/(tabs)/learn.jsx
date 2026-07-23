import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { units, lessonProgress } from '../../src/data/lessons.js'
import { useProgress } from '../../src/hooks/useProgress.js'
import { useSubscription, canAccess } from '../../src/context/SubscriptionContext.jsx'



export default function Learn() {
  const { completedSteps } = useProgress()
  const { tier: userTier } = useSubscription()

  return (
    <View>
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Learn</Text>
        <Text className="text-stone-700">
          Structured units. Each lesson walks you through an intro, examples, a quick check, and a mini-quiz.
        </Text>
      </View>

      <View className="gap-8">
        {units.map((unit) => (
          <View key={unit.id}>
            <View className="mb-3">
              <Text className="font-serif text-2xl text-stone-900">{unit.title}</Text>
              <Text className="text-sm text-stone-600">{unit.description}</Text>
            </View>

            <View className="gap-3">
              {unit.lessons.map((lesson) => {
                const p = lessonProgress(lesson, completedSteps)
                const requiredTier = lesson.tier || unit.tier || 'free'
                const locked = !canAccess(requiredTier, userTier)
                return (
                  <Link key={lesson.id} href={`/learn/${unit.id}/${lesson.id}`} asChild>
                    <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-5">
                      <View className="flex-row justify-between items-start mb-2 gap-3">
                        <Text className="font-serif text-xl text-stone-900 flex-1">
                          {lesson.title}
                        </Text>
                        {locked ? (
                          <View className="rounded-full bg-clay-600 px-2 py-0.5">
                            <Text className="text-xs font-semibold text-cream-50">◆ Pro</Text>
                          </View>
                        ) : p.complete ? (
                          <View className="rounded-full bg-emerald-700 px-2 py-0.5">
                            <Text className="text-xs font-semibold text-cream-50">✓ Done</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text className="text-sm text-stone-600 mb-4">{lesson.summary}</Text>
                      <View className="h-2 w-full bg-cream-200 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-clay-600"
                          style={{ width: `${Math.round(p.ratio * 100)}%` }}
                        />
                      </View>
                      <Text className="text-xs text-stone-500 mt-2">
                        {p.done} / {p.total} steps
                      </Text>
                    </Pressable>
                  </Link>
                )
              })}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
