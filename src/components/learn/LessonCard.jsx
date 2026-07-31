import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { lessonProgress } from '../../data/lessons.js'
import { useProgress } from '../../hooks/useProgress.js'
import { useSubscription, canAccess } from '../../context/SubscriptionContext.jsx'

// One lesson tile — used by the Learn hub tab and the Unit page. It reads its
// own progress/tier state, so callers just pass the lesson + its unit. Mirrors
// the web LessonCard; the guest "Free account" badge isn't ported (the RN app
// has no access.js yet), so this shows just the Pro lock and Done states.
export default function LessonCard({ unit, lesson }) {
  const { completedSteps } = useProgress()
  const { tier: userTier } = useSubscription()

  const p = lessonProgress(lesson, completedSteps)
  const requiredTier = lesson.tier || unit.tier || 'free'
  const locked = !canAccess(requiredTier, userTier)
  const pct = Math.round(p.ratio * 100)

  return (
    <Link href={`/learn/${unit.id}/${lesson.id}`} asChild>
      <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-5 active:bg-cream-100">
        <View className="flex-row justify-between items-start mb-2 gap-3">
          <Text className="font-serif text-xl text-stone-900 flex-1">{lesson.title}</Text>
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
        <Text className="text-sm text-stone-700 mb-4">{lesson.summary}</Text>
        <View className="h-2 w-full bg-cream-200 rounded-full overflow-hidden">
          <View className="h-full bg-clay-600" style={{ width: `${pct}%` }} />
        </View>
        <Text className="text-xs text-stone-600 mt-2">
          {p.done} / {p.total} steps
        </Text>
      </Pressable>
    </Link>
  )
}
