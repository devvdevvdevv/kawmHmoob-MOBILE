import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getQuizConfig, getQuizDataset } from '../../data/quizzes.js'
import { useQuizState } from '../../hooks/useQuizState.js'
import { useProgress } from '../../hooks/useProgress.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import PaywallGate from '../common/PaywallGate.jsx'
import QuizResults from './QuizResults.jsx'
import Button from '../ui/Button.jsx'

function shuffle(arr) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestions(config, dataset) {
  if (!dataset || dataset.length === 0) return []
  const types = config.questionTypes || ['multiple-choice']
  const count = Math.min(config.questionCount, dataset.length)
  const pool = shuffle(dataset).slice(0, count)
  return pool.map((item, i) => {
    const type = types[i % types.length]
    if (type === 'matching') {
      const pairs = shuffle(dataset).slice(0, Math.min(4, dataset.length))
      if (!pairs.find((p) => p.prompt === item.prompt)) pairs[0] = item
      return {
        type: 'matching',
        prompt: 'Match each Hmong term to its meaning.',
        pairs,
        answer: pairs.map((p) => `${p.prompt}=${p.answer}`).join('|'),
      }
    }
    const distractors = shuffle(dataset.filter((d) => d.answer !== item.answer)).slice(0, 3)
    const options = shuffle([item, ...distractors]).map((d) => d.answer)
    return { type: 'multiple-choice', prompt: item.prompt, answer: item.answer, options }
  })
}

export default function QuizEngine() {
  const { topicId } = useLocalSearchParams()
  const router = useRouter()
  const config = getQuizConfig(topicId)
  const dataset = getQuizDataset(topicId)
  const { state, start, answer, next, review, reset } = useQuizState()
  const { recordQuizScore } = useProgress()
  const [feedback, setFeedback] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [savedThisRun, setSavedThisRun] = useState(false)

  const questions = useMemo(() => (config ? buildQuestions(config, dataset) : []), [config, dataset])

  useEffect(() => {
    if (config && questions.length > 0 && state.status === 'idle') start(questions)
  }, [config, questions, start, state.status])

  useEffect(() => {
    if (state.status !== 'active') return
    const id = setInterval(
      () => setElapsed(Math.floor((Date.now() - state.startedAt) / 1000)),
      1000
    )
    return () => clearInterval(id)
  }, [state.status, state.startedAt])

  useEffect(() => {
    if (state.status === 'finished' && !savedThisRun) {
      const accuracy =
        state.questions.length > 0
          ? Math.round((state.score / state.questions.length) * 100)
          : 0
      recordQuizScore({
        quizId: topicId,
        score: state.score,
        maxScore: state.questions.length,
        accuracy,
      })
      setSavedThisRun(true)
    }
  }, [state.status, state.score, state.questions.length, topicId, recordQuizScore, savedThisRun])

  if (!config) {
    return (
      <View>
        <Text className="text-stone-900">Quiz not found.</Text>
        <Button onPress={() => router.push('/quiz')} className="mt-4">Back to Quizzes</Button>
      </View>
    )
  }

  if (dataset.length === 0) {
    return (
      <View>
        <Text className="text-stone-900">No data available for this quiz yet.</Text>
        <Button onPress={() => router.push('/quiz')} className="mt-4">Back to Quizzes</Button>
      </View>
    )
  }

  const handleQuit = () => {
    Alert.alert(
      'Quit this quiz?',
      'Progress for this attempt will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => { reset(); router.push('/quiz') } },
      ]
    )
  }

  if (state.status === 'finished' || state.status === 'reviewing') {
    return (
      <PaywallGate tier={config.tier} contentLabel={`${config.title} is a Pro quiz`}>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Quizzes', to: '/quiz' },
            { label: config.title },
          ]}
        />
        <QuizResults
          config={config}
          questions={state.questions}
          answers={state.answers}
          score={state.score}
          elapsed={elapsed}
          onRetry={() => { reset(); setSavedThisRun(false); setElapsed(0); setFeedback(null) }}
          reviewing={state.status === 'reviewing'}
          onReview={review}
          onBack={() => router.push('/quiz')}
        />
      </PaywallGate>
    )
  }

  const q = state.questions[state.currentIndex]
  if (!q) return null

  return (
    <PaywallGate tier={config.tier} contentLabel={`${config.title} is a Pro quiz`}>
      <View>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Quizzes', to: '/quiz' },
            { label: config.title },
          ]}
        />

        <View className="flex-row flex-wrap justify-between items-center mb-5 gap-2">
          <Text className="text-sm text-stone-700">
            Question {state.currentIndex + 1} / {state.questions.length}
          </Text>
          <View className="flex-row gap-2">
            <Pill bg="bg-cream-200" textColor="text-clay-700">⏱ {elapsed}s</Pill>
            <Pill bg="bg-orange-200" textColor="text-orange-900">🔥 {state.streak}</Pill>
            <Pill bg="bg-cream-100" textColor="text-stone-800">★ {state.score}</Pill>
          </View>
        </View>

        <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
          {q.type === 'multiple-choice' && (
            <MultipleChoice
              question={q}
              feedback={feedback}
              onPick={(opt) => {
                if (feedback) return
                const isCorrect = opt === q.answer
                answer(opt, isCorrect)
                setFeedback(isCorrect ? 'correct' : 'incorrect')
              }}
            />
          )}
          {q.type === 'matching' && (
            <Matching
              question={q}
              feedback={feedback}
              onComplete={(isCorrect) => {
                if (feedback) return
                answer('matching', isCorrect)
                setFeedback(isCorrect ? 'correct' : 'incorrect')
              }}
            />
          )}
        </View>

        {feedback && (
          <View
            className={`mt-4 rounded-md p-4 flex-row flex-wrap justify-between items-center gap-3 shadow-warm ${
              feedback === 'correct' ? 'bg-emerald-100' : 'bg-red-100'
            }`}
          >
            <Text className={`font-semibold ${feedback === 'correct' ? 'text-emerald-900' : 'text-red-900'}`}>
              {feedback === 'correct' ? 'Correct ✓' : `Not quite — answer: ${q.answer}`}
            </Text>
            <Button onPress={() => { setFeedback(null); next() }} variant="secondary">
              {state.currentIndex + 1 >= state.questions.length ? 'Finish' : 'Next'}
            </Button>
          </View>
        )}

        <View className="mt-6">
          <Button variant="secondary" onPress={handleQuit}>QUIT QUIZ</Button>
        </View>
      </View>
    </PaywallGate>
  )
}

function Pill({ children, bg, textColor }) {
  return (
    <View className={`rounded-full px-3 py-1 ${bg}`}>
      <Text className={`text-xs font-semibold ${textColor}`}>{children}</Text>
    </View>
  )
}

function MultipleChoice({ question, feedback, onPick }) {
  return (
    <View>
      <View className="flex-row items-center gap-3 mb-5">
        <AudioButton audioSrc={null} wordId={question.prompt} />
        <Text className="font-serif text-3xl text-stone-900 flex-1">{question.prompt}</Text>
      </View>
      <View className="gap-2">
        {question.options.map((opt) => {
          const isAnswer = opt === question.answer
          const showResult = Boolean(feedback)
          let cls = 'border-cream-300 bg-cream-50'
          if (showResult && isAnswer) cls = 'border-emerald-500 bg-emerald-50'
          if (showResult && !isAnswer) cls = 'border-cream-200 bg-cream-50 opacity-60'
          return (
            <Pressable
              key={opt}
              onPress={() => onPick(opt)}
              disabled={showResult}
              className={`rounded border p-3 ${cls}`}
            >
              <Text className="text-sm text-stone-800">{opt}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function Matching({ question, feedback, onComplete }) {
  const [leftSel, setLeftSel] = useState(null)
  const [pairs, setPairs] = useState({})
  const lefts = question.pairs.map((p) => p.prompt)
  const rights = useMemo(() => shuffle(question.pairs.map((p) => p.answer)), [question])

  const handleRight = (right) => {
    if (!leftSel || feedback) return
    const nextPairs = { ...pairs, [leftSel]: right }
    setPairs(nextPairs)
    setLeftSel(null)
    if (Object.keys(nextPairs).length === lefts.length) {
      const allCorrect = question.pairs.every((p) => nextPairs[p.prompt] === p.answer)
      onComplete(allCorrect)
    }
  }

  return (
    <View>
      <Text className="font-serif text-xl text-stone-900 mb-1">{question.prompt}</Text>
      <Text className="text-sm text-stone-600 mb-4 italic">
        Tap a Hmong word, then tap its English meaning.
      </Text>
      <View className="flex-row gap-3">
        <View className="flex-1 gap-2">
          {lefts.map((l) => {
            const matched = pairs[l]
            const isSel = leftSel === l
            const correctAns = question.pairs.find((p) => p.prompt === l)?.answer
            const isCorrect = feedback && matched === correctAns
            const isWrong = feedback && matched && !isCorrect
            let cls = 'border-cream-300 bg-cream-50'
            if (isCorrect) cls = 'border-emerald-500 bg-emerald-50'
            else if (isWrong) cls = 'border-red-500 bg-red-50'
            else if (isSel) cls = 'border-clay-500 bg-cream-100'
            else if (matched) cls = 'border-cream-300 bg-cream-100 opacity-70'
            return (
              <Pressable
                key={l}
                onPress={() => !matched && !feedback && setLeftSel(l)}
                disabled={Boolean(matched) || Boolean(feedback)}
                className={`rounded border p-3 ${cls}`}
              >
                <Text className="font-semibold text-clay-700">{l}</Text>
                {matched && <Text className="text-xs text-stone-500">→ {matched}</Text>}
              </Pressable>
            )
          })}
        </View>
        <View className="flex-1 gap-2">
          {rights.map((r) => {
            const used = Object.values(pairs).includes(r)
            return (
              <Pressable
                key={r}
                onPress={() => handleRight(r)}
                disabled={used || Boolean(feedback)}
                className={`rounded border p-3 ${
                  used ? 'border-cream-300 bg-cream-100 opacity-50' : 'border-cream-300 bg-cream-50'
                }`}
              >
                <Text className="text-sm text-stone-800">{r}</Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    </View>
  )
}
