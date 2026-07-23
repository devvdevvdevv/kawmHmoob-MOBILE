import { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { getLesson, getUnit, allStepIds } from '../../../src/data/lessons.js'
import { useProgress } from '../../../src/hooks/useProgress.js'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import PaywallGate from '../../../src/components/common/PaywallGate.jsx'
import Button from '../../../src/components/ui/Button.jsx'

export default function Lesson() {
  const { unitId, lessonId } = useLocalSearchParams()
  const router = useRouter()
  const unit = getUnit(unitId)
  const lesson = getLesson(unitId, lessonId)
  const { completedSteps, quizScores, markStepComplete } = useProgress()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!lesson) return
    lesson.steps.forEach((step) => {
      if (step.kind !== 'mini-quiz') return
      if (completedSteps.includes(step.id)) return
      const taken = quizScores.some((s) => s.quizId === step.quizId)
      if (taken) {
        const ids = allStepIds(lesson)
        const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
        markStepComplete(step.id, {
          lessonId: lesson.id,
          lessonComplete: remaining.length === 0,
        })
      }
    })
  }, [lesson, completedSteps, quizScores, markStepComplete])

  if (!unit || !lesson) {
    return (
      <View>
        <Text className="text-stone-900">Lesson not found.</Text>
        <Button onPress={() => router.push('/learn')} className="mt-4">Back to Learn</Button>
      </View>
    )
  }

  const step = lesson.steps[index]
  const isLast = index === lesson.steps.length - 1
  const requiredTier = lesson.tier || unit.tier || 'free'

  const handleAdvance = () => {
    if (!completedSteps.includes(step.id)) {
      const ids = allStepIds(lesson)
      const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
      markStepComplete(step.id, {
        lessonId: lesson.id,
        lessonComplete: remaining.length === 0,
      })
    }
    if (isLast) router.push('/learn')
    else setIndex((i) => i + 1)
  }

  return (
    <PaywallGate tier={requiredTier} contentLabel={`${lesson.title} is Pro`}>
      <View>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Learn', to: '/learn' },
            { label: unit.title, to: '/learn' },
            { label: lesson.title },
          ]}
        />
        <StepHeader lesson={lesson} index={index} />

        <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
          {step.kind === 'intro' && <IntroStep step={step} />}
          {step.kind === 'examples' && <ExamplesStep step={step} />}
          {step.kind === 'practice' && <PracticeStep step={step} onAdvance={handleAdvance} />}
          {step.kind === 'mini-quiz' && (
            <MiniQuizStep step={step} taken={quizScores.some((s) => s.quizId === step.quizId)} />
          )}
        </View>

        {step.kind !== 'practice' && step.kind !== 'mini-quiz' && (
          <View className="mt-6 flex-row justify-between items-center">
            <Pressable onPress={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
              <Text className={`text-sm underline ${index === 0 ? 'text-stone-400' : 'text-stone-700'}`}>
                Back
              </Text>
            </Pressable>
            <Button onPress={handleAdvance}>{isLast ? 'Finish' : 'Continue'}</Button>
          </View>
        )}
      </View>
    </PaywallGate>
  )
}

function StepHeader({ lesson, index }) {
  const total = lesson.steps.length
  const pct = Math.round(((index + 1) / total) * 100)
  return (
    <View className="mb-6">
      <Text className="font-serif text-3xl text-stone-900 mb-1">{lesson.title}</Text>
      <Text className="text-sm text-stone-600 mb-3">Step {index + 1} of {total}</Text>
      <View className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
        <View className="h-full bg-clay-600" style={{ width: `${pct}%` }} />
      </View>
    </View>
  )
}

function IntroStep({ step }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-4">{step.title}</Text>
      <View className="gap-4">
        {step.body.map((p, i) => (
          <Text key={i} className="text-stone-800">{p}</Text>
        ))}
      </View>
    </View>
  )
}

function ExamplesStep({ step }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-2">{step.title}</Text>
      {step.intro && <Text className="text-sm text-stone-600 mb-4 italic">{step.intro}</Text>}
      {step.items.map((it, i) => (
        <View
          key={it.hmong}
          className={`py-3 ${i > 0 ? 'border-t border-cream-200' : ''}`}
        >
          <View className="flex-row justify-between items-baseline gap-3">
            <Text className="font-semibold text-clay-700 text-lg">{it.hmong}</Text>
            <Text className="text-sm text-stone-700">{it.english}</Text>
          </View>
          {it.note && <Text className="text-xs text-stone-500 mt-1 italic">{it.note}</Text>}
        </View>
      ))}
    </View>
  )
}

function PracticeStep({ step, onAdvance }) {
  const [picked, setPicked] = useState(null)
  const correct = picked === step.answer

  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-4">{step.title}</Text>
      <Text className="text-stone-800 mb-5">{step.prompt}</Text>
      <View className="gap-2">
        {step.options.map((opt) => {
          const isAnswer = opt === step.answer
          let cls = 'border-cream-300 bg-cream-50'
          if (picked && isAnswer) cls = 'border-emerald-500 bg-emerald-50'
          if (picked && opt === picked && !isAnswer) cls = 'border-red-500 bg-red-50'
          if (picked && opt !== picked && !isAnswer) cls = 'border-cream-200 bg-cream-50 opacity-60'
          return (
            <Pressable
              key={opt}
              onPress={() => !picked && setPicked(opt)}
              disabled={Boolean(picked)}
              className={`rounded border p-3 ${cls}`}
            >
              <Text className="text-sm text-stone-800">{opt}</Text>
            </Pressable>
          )
        })}
      </View>

      {picked && (
        <View
          className={`mt-5 rounded-md p-4 flex-row flex-wrap justify-between items-center gap-3 shadow-warm ${
            correct ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          <Text className={`font-semibold ${correct ? 'text-emerald-900' : 'text-red-900'}`}>
            {correct ? 'Correct ✓' : `Not quite — answer: ${step.answer}`}
          </Text>
          <Button onPress={onAdvance} variant="secondary">Continue</Button>
        </View>
      )}
    </View>
  )
}

function MiniQuizStep({ step, taken }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-2">{step.title}</Text>
      <Text className="text-stone-700 mb-5">
        {taken
          ? "You've taken this quiz — you can retake it for more practice. The lesson is marked complete."
          : 'Time to put it to the test. Take the mini-quiz to finish this lesson.'}
      </Text>
      <View className="flex-row flex-wrap gap-3">
        <Link href={`/quiz/${step.quizId}`} asChild>
          <Button>{taken ? 'Retake quiz' : 'Take quiz'}</Button>
        </Link>
        <Link href="/learn" asChild>
          <Button variant="secondary">Back to Learn</Button>
        </Link>
      </View>
    </View>
  )
}
