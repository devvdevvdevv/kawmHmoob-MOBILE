import { View, Text } from 'react-native'
import Svg, { Circle, Text as SvgText } from 'react-native-svg'
import Button from '../ui/Button.jsx'
import Confetti from '../common/Confetti.jsx'

export default function QuizResults({
  config,
  questions,
  answers,
  score,
  elapsed,
  onRetry,
  onReview,
  onBack,
  reviewing,
}) {
  const accuracy = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0
  const missed = answers.filter((a) => !a.isCorrect)
  // Perfect score — a real achievement worth celebrating (not while reviewing).
  const perfect = accuracy === 100 && questions.length > 0 && !reviewing

  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
      {perfect && <Confetti />}
      <Text className="font-serif text-3xl text-stone-900 mb-1">{config.title}</Text>
      <Text className="text-sm text-stone-600 mb-6">Time: {elapsed}s</Text>

      {perfect && (
        <View className="rounded-md bg-emerald-100 p-4 mb-6 items-center">
          <Text className="font-serif text-2xl text-emerald-900">Perfect score! 🎉</Text>
        </View>
      )}

      <View className="flex-row items-center gap-6 mb-6">
        <CircularProgress percent={accuracy} />
        <View>
          <Text className="font-serif text-4xl text-stone-900">
            {score} <Text className="text-stone-400">/ {questions.length}</Text>
          </Text>
          <Text className="text-sm text-stone-600 mt-1">{accuracy}% accuracy</Text>
        </View>
      </View>

      {reviewing && missed.length > 0 && (
        <View className="mb-6">
          <Text className="font-serif text-xl text-stone-900 mb-3">Missed Questions</Text>
          <View className="gap-2">
            {missed.map((m, i) => {
              const q = questions[m.questionIndex]
              return (
                <View key={i} className="rounded border border-red-200 bg-red-50/60 p-4">
                  <Text className="font-semibold text-stone-900 mb-1">{q.prompt}</Text>
                  <Text className="text-stone-700">
                    Your answer: <Text className="text-red-700">{String(m.selected)}</Text>
                  </Text>
                  <Text className="text-stone-700">
                    Correct: <Text className="text-emerald-700">{String(q.answer)}</Text>
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      )}

      <View className="flex-row flex-wrap gap-3">
        <Button onPress={onRetry}>Retry</Button>
        {!reviewing && missed.length > 0 && (
          <Button onPress={onReview} variant="secondary">Review Mistakes</Button>
        )}
        <Button onPress={onBack} variant="ghost">Back to Quizzes</Button>
      </View>
    </View>
  )
}

function CircularProgress({ percent }) {
  const r = 36
  const c = 2 * Math.PI * r
  const offset = c - (percent / 100) * c
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96">
      <Circle cx={48} cy={48} r={r} stroke="#ECDCC0" strokeWidth={10} fill="none" />
      <Circle
        cx={48}
        cy={48}
        r={r}
        stroke="#9C4F33"
        strokeWidth={10}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 48 48)"
      />
      <SvgText x={48} y={53} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#1C1917">
        {percent}%
      </SvgText>
    </Svg>
  )
}
