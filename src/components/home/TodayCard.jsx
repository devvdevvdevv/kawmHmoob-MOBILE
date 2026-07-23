import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useProgress } from '../../hooks/useProgress.js'
import { selectDueWords } from '../../context/ProgressContext.jsx'
import { categories } from '../../data/vocabulary.js'
import { quizzes } from '../../data/quizzes.js'

export default function TodayCard() {
  const { vocabSchedule, quizScores, streakData } = useProgress()

  const allWords = categories.flatMap((c) => c.words)
  const dueCount = selectDueWords(allWords, vocabSchedule).length

  const today = new Date().toISOString().slice(0, 10)
  const doneTodayQuizIds = new Set(
    quizScores.filter((s) => s.date.slice(0, 10) === today).map((s) => s.quizId)
  )
  const suggestedQuiz = quizzes.find((q) => !doneTodayQuizIds.has(q.id))

  const suggestions = []
  if (dueCount > 0) {
    suggestions.push({
      label: `Review ${dueCount} word${dueCount === 1 ? '' : 's'} due`,
      cta: 'Review',
      to: '/review',
    })
  }
  if (suggestedQuiz) {
    suggestions.push({
      label: `Try the ${suggestedQuiz.title} quiz`,
      cta: 'Quiz',
      to: `/quiz/${suggestedQuiz.id}`,
    })
  }
  suggestions.push({
    label: 'Jot down something you learned today',
    cta: 'Notebook',
    to: '/notebook/notes',
  })

  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 shadow-warm p-6">
      <View className="flex-row justify-between items-end mb-4">
        <Text className="font-serif text-2xl text-stone-900">Today</Text>
        <Text className="text-sm text-stone-600">
          {streakData.currentStreak > 0
            ? `${streakData.currentStreak}-day streak`
            : 'Start your streak'}
        </Text>
      </View>
      <View>
        {suggestions.map((s, i) => (
          <View
            key={s.to}
            className={`flex-row items-center justify-between gap-4 py-3 ${
              i > 0 ? 'border-t border-cream-200' : ''
            }`}
          >
            <Text className="text-stone-700 flex-1">{s.label}</Text>
            <Link href={s.to} asChild>
              <Pressable>
                <Text className="text-sm text-clay-700 font-semibold">{s.cta} →</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </View>
  )
}
