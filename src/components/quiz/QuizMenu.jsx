import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { quizzes } from '../../data/quizzes.js'
import { categoryGroups } from '../../data/vocabulary.js'
import { useProgress } from '../../hooks/useProgress.js'
import { quizUnlock } from '../../lib/access.js'
import Breadcrumbs from '../common/Breadcrumbs.jsx'

// Quiz menu — ported from the web page. ~35 quizzes, most one-per-vocab-category,
// so a flat list is a wall. Non-vocab quizzes group by their own category
// (Alphabet, Tones, …); vocab quizzes are sub-grouped by the SAME themes the
// Vocabulary page uses (`categoryGroups`), so both pages tell one story. Each
// card is a scoreboard entry (best score) and gates behind studying when the
// quiz is a vocab quiz you haven't studied enough for.
export default function QuizMenu() {
  const { quizScores, vocabProgress } = useProgress()

  const bestByQuiz = useMemo(() => {
    const best = {}
    for (const s of quizScores) {
      if (best[s.quizId] == null || s.accuracy > best[s.quizId]) best[s.quizId] = s.accuracy
    }
    return best
  }, [quizScores])

  const otherGroups = useMemo(() => {
    const byCategory = new Map()
    for (const q of quizzes) {
      if (q.id.startsWith('vocab-')) continue
      if (!byCategory.has(q.category)) byCategory.set(q.category, [])
      byCategory.get(q.category).push(q)
    }
    return [...byCategory.entries()]
  }, [])

  const vocabThemes = useMemo(
    () =>
      categoryGroups
        .map((g) => ({
          id: g.id,
          title: g.title,
          items: g.items.map((c) => quizzes.find((q) => q.id === `vocab-${c.id}`)).filter(Boolean),
        }))
        .filter((g) => g.items.length > 0),
    []
  )

  const vocabCount = vocabThemes.reduce((n, g) => n + g.items.length, 0)
  const takenCount = Object.keys(bestByQuiz).length

  return (
    <View>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Words', to: '/words' }, { label: 'Quizzes' }]} />

      <View className="mb-8">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Test what you've learned.</Text>
        <Text className="text-stone-700">
          {takenCount > 0
            ? `You've taken ${takenCount} of ${quizzes.length} quizzes.`
            : `${quizzes.length} quizzes across the whole course.`}
        </Text>
      </View>

      <View className="gap-10">
        {otherGroups.map(([category, list]) => (
          <QuizGroup key={category} title={category} list={list} bestByQuiz={bestByQuiz} vocabProgress={vocabProgress} />
        ))}
      </View>

      {vocabThemes.length > 0 && (
        <View className="mt-14">
          <View className="mb-6 flex-row flex-wrap items-end justify-between gap-2 border-b border-cream-200 pb-3">
            <Text className="font-serif text-2xl text-stone-900">Vocabulary</Text>
            <Text className="text-xs text-stone-600">{vocabCount} quizzes by theme</Text>
          </View>
          <View className="gap-10">
            {vocabThemes.map((g) => (
              <QuizGroup key={g.id} title={g.title} list={g.items} bestByQuiz={bestByQuiz} vocabProgress={vocabProgress} small />
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

function QuizGroup({ title, list, bestByQuiz, vocabProgress, small = false }) {
  return (
    <View>
      <View className="mb-4 flex-row flex-wrap items-end justify-between gap-2">
        <Text className={`font-serif text-stone-900 ${small ? 'text-lg' : 'text-2xl'}`}>{title}</Text>
        <Text className="text-xs text-stone-600">{list.length} quiz{list.length === 1 ? '' : 'zes'}</Text>
      </View>
      <View className="gap-3">
        {list.map((q) => (
          <QuizCard key={q.id} quiz={q} best={bestByQuiz[q.id]} unlock={quizUnlock(q.id, vocabProgress)} />
        ))}
      </View>
    </View>
  )
}

function QuizCard({ quiz, best, unlock }) {
  const taken = best != null
  const locked = unlock?.gated && !unlock.unlocked
  // A locked card still links — but to the word bank, not the quiz. A lock with
  // no path forward is a wall; this one points at the way through.
  const to = locked ? `/vocabulary/${unlock.category.id}` : `/quiz/${quiz.id}`

  return (
    <Link href={to} asChild>
      <Pressable className={`rounded-md bg-cream-50 border border-cream-200 p-5 ${locked ? 'opacity-75' : ''}`}>
        <View className="flex-row items-start justify-between gap-3 mb-1">
          <Text className="font-serif text-lg text-stone-900 flex-1">{quiz.title}</Text>
          <View className="flex-row items-center gap-1">
            {locked && (
              <View className="rounded-full bg-cream-200 px-2 py-0.5">
                <Text className="text-[10px] uppercase tracking-wider font-semibold text-stone-600">🔒 Study first</Text>
              </View>
            )}
            {quiz.tier === 'pro' && (
              <View className="rounded-full bg-clay-600 px-2 py-0.5">
                <Text className="text-[10px] uppercase tracking-wider font-semibold text-cream-50">Pro</Text>
              </View>
            )}
            {taken && (
              <View className={`rounded-full px-2 py-0.5 ${best >= 80 ? 'bg-success-50' : 'bg-cream-200'}`}>
                <Text className={`text-[10px] font-semibold ${best >= 80 ? 'text-success-900' : 'text-stone-700'}`}>
                  {best >= 80 ? '✓ ' : ''}{best}%
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text className="text-sm text-stone-600 mb-3" numberOfLines={2}>{quiz.description}</Text>
        {locked ? (
          <View className="self-start rounded-lg bg-clay-600/10 px-3 py-2">
            <Text className="text-sm font-semibold text-clay-700">📖 Study {unlock.remaining} more to unlock</Text>
          </View>
        ) : (
          <Text className="text-xs text-stone-500">{quiz.questionCount} questions</Text>
        )}
      </Pressable>
    </Link>
  )
}
