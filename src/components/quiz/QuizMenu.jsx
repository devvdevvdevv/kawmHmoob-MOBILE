import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { quizzes } from '../../data/quizzes.js'

export default function QuizMenu() {
  return (
    <View>
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Quizzes</Text>
        <Text className="text-stone-700">Test what you've learned.</Text>
      </View>

      <View className="gap-4">
        {quizzes.map((q) => (
          <Link key={q.id} href={`/quiz/${q.id}`} asChild>
            <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-5">
              <Text className="text-xs font-semibold uppercase tracking-wider text-clay-600 mb-2">
                {q.category}
              </Text>
              <Text className="font-serif text-xl text-stone-900 mb-1">{q.title}</Text>
              <Text className="text-sm text-stone-600 mb-3">{q.description}</Text>
              <Text className="text-xs text-stone-500">
                {q.questionCount} questions · {q.questionTypes.join(', ')}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  )
}
