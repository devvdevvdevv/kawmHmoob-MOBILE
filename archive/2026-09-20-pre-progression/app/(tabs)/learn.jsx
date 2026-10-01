import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import LessonCard from '../../src/components/learn/LessonCard.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
import { units, lessonProgress } from '../../src/data/lessons.js'
import { useProgress } from '../../src/hooks/useProgress.js'

// ⚠️ THIS HUB HAD NO MASTHEAD AND NO PROGRESS — fixed 2026-09-09.
//
// Speak opens with a dot-eyebrow, a serif title, a sentence and a progress bar.
// Words opens the same way. Reading opens the same way. Learn opened with a
// bare text-3xl "Learn" and one line — a different composition, on the screen
// that holds the actual course.
//
// The progress bar is the bigger half of the fix. Speak says "12 of 88 phrases
// practiced"; Reading says "3 of 10 read"; Learn, the structured curriculum
// someone is meant to work THROUGH, said nothing at all about where they were
// in it.

export default function Learn() {

  const { completedSteps } = useProgress()

  // ⚠️ HOISTED, because the count and the list must come from the SAME array.
  // The filter used to live inline in the map. Counting from `units` while
  // rendering from the filtered set would have the masthead advertising a
  // lesson total that includes a unit the release build never shows.
  const visibleUnits = units.filter((u) => __DEV__ || u.id !== 'readings')

  const lessons = visibleUnits.flatMap((u) => u.lessons)
  const done = lessons.filter((l) => lessonProgress(l, completedSteps).complete).length

  return (
    <TabScreen>
      <View className="mb-8">

        {/* The dot is seafoam-500 — Learn's own tab-indicator token, so the
            mark up here and the highlighted tab down there are the same fact. */}
        <Eyebrow dot="bg-seafoam-500" className="mb-2">Learn</Eyebrow>

        <Text className="font-serif text-4xl text-stone-900 mb-3">One step at a time.</Text>

        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          Structured units: intro, examples, a quick check, a mini-quiz.
        </Text>

        <View className="mt-5 flex-row items-center gap-3">
          <View className="h-2 w-40 bg-cream-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-clay-600"
              style={{ width: `${lessons.length ? (done / lessons.length) * 100 : 0}%` }}
            />
          </View>
          <Text className="text-sm font-medium text-stone-700">
            {done} of {lessons.length} lessons done
          </Text>
        </View>
      </View>

      <View className="gap-8">
        {/* Readings unit is hidden in release builds (still WIP) — dev-only.
            The filter itself now lives in visibleUnits above. */}
        {visibleUnits.map((unit) => (
          <View key={unit.id}>
            <Link href={`/learn/${unit.id}`} asChild>
              <Pressable className="mb-3">
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="font-serif text-2xl text-stone-900 flex-1">{unit.title}</Text>
                  {/* Filled pill — a clear tap target next to the unit title */}
                  <View className="rounded-full bg-clay-600 px-3 py-1.5">
                    <Text className="text-xs font-semibold text-cream-50">View all →</Text>
                  </View>
                </View>
                <Text className="text-sm font-medium text-stone-600">{unit.description}</Text>
              </Pressable>
            </Link>

            <View className="gap-3">
              {unit.lessons.map((lesson) => (
                <LessonCard key={lesson.id} unit={unit} lesson={lesson} />
              ))}
            </View>
          </View>
        ))}
      </View>
    </TabScreen>
  )
}
