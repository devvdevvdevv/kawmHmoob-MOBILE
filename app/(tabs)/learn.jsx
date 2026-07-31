import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import LessonCard from '../../src/components/learn/LessonCard.jsx'
import { units } from '../../src/data/lessons.js'

export default function Learn() {
  return (
    <TabScreen>
      <View className="mb-6">
        <Text className="font-serif text-3xl text-stone-900 mb-2">Learn</Text>
        <Text className="text-base text-stone-700">
          Structured units. Each lesson walks you through an intro, examples, a quick check, and a mini-quiz.
        </Text>
      </View>

      <View className="gap-8">
        {units.map((unit) => (
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
                <Text className="text-sm text-stone-600">{unit.description}</Text>
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
