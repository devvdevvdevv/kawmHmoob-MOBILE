import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { isQuizPassed } from '../../lib/quizProgress.js'
import Icon from '../ui/Icon.jsx'

// The quiz affordance on a vocabulary row — one 64pt target, three states:
//
//   taken    → your best score, FILLED (lime ≥80, cream otherwise)
//   open     → a clay "zap" button: the quiz is ready and untried
//   locked   → a flat cream lock, deliberately not pressable (the row's meta line
//              is what says how many more words open it — a button that only
//              leads to a wall is worse than no button)
//
// Filled rather than tinted: on a phone, against a cream card on a seafoam page,
// a pale pill reads as decoration. This has to read as a control.
export default function QuizChip({ quizId, best, locked, label }) {
  if (locked) {
    return (
      <View
        className="h-16 w-16 rounded-md bg-cream-200 border border-cream-300 items-center justify-center"
        accessibilityLabel="Quiz locked — study more words first"
      >
        <Icon name="lock" size={24} tone="ink" />
      </View>
    )
  }

  const taken = best != null
  const passed = isQuizPassed(best)

  return (
    <Link href={`/quiz/${quizId}`} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={taken ? `Retake ${label} quiz, best score ${best}%` : `Take the ${label} quiz`}
        className={`h-16 min-w-[64px] px-3 rounded-md items-center justify-center active:opacity-80 ${
          passed ? 'bg-lime-200' : taken ? 'bg-cream-300 border border-cream-400' : 'bg-clay-600'
        }`}
      >
        {taken ? (
          <Text className={`text-base font-bold ${passed ? 'text-lime-900' : 'text-stone-800'}`}>{best}%</Text>
        ) : (
          <Icon name="zap" size={24} tone="onDark" />
        )}
      </Pressable>
    </Link>
  )
}
