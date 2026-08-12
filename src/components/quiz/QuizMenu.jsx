import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { quizzes } from '../../data/quizzes.js'
import { categoryGroups } from '../../data/vocabulary.js'
import { useProgress } from '../../hooks/useProgress.js'
import { quizUnlock } from '../../lib/access.js'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import Icon from '../ui/Icon.jsx'

// Quiz dependencies

import { useAuth } from '../../context/AuthContext.jsx'

import { useDailyQuota } from '../../hooks/useDailyQuota.js'
import { quotaLimit } from '../../lib/quotaLimits.js'
import QuotaBadge from '../common/QuotaBadge.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'



// Quiz menu — ported from the web page. ~35 quizzes, most one-per-vocab-category,
// so a flat list is a wall. Non-vocab quizzes group by their own category
// (Alphabet, Tones, …); vocab quizzes are sub-grouped by the SAME themes the
// Vocabulary page uses (`categoryGroups`), so both pages tell one story. Each
// card is a scoreboard entry (best score) and gates behind studying when the
// quiz is a vocab quiz you haven't studied enough for.
export default function QuizMenu() {

  // User

  const {user} = useAuth()
  const { isPro } = useSubscription()

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


  const quota = useDailyQuota('quiz', quotaLimit('quiz', user.isGuest), {enabled: !isPro, scope: user?.id || 'guest'})

  const vocabCount = vocabThemes.reduce((n, g) => n + g.items.length, 0)
  const takenCount = Object.keys(bestByQuiz).length

  return (
    <View>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Words', to: '/words' }, { label: 'Quizzes' }]} />

      <View className="mb-8">
        <View className="flex-row items-start justify-between gap-3 mb-2">
          <Text className="font-serif text-4xl text-stone-900 flex-1">Test what you've learned.</Text>
          <QuotaBadge {...quota} label="left today" />
        </View>
        <Text className="text-stone-700">
          {takenCount > 0
            ? `You've taken ${takenCount} of ${quizzes.length} quizzes.`
            : `${quizzes.length} quizzes across the whole course.`}
        </Text>
        {/* Overall progress bar across all quizzes */}
        <View className="flex-row items-center gap-3 mt-4">
          <View className="h-2 flex-1 bg-cream-200 rounded-full overflow-hidden">
            <View className="h-full bg-clay-600 rounded-full" style={{ width: `${quizzes.length ? (takenCount / quizzes.length) * 100 : 0}%` }} />
          </View>
          <Text className="text-xs font-medium text-stone-600">{takenCount}/{quizzes.length}</Text>
        </View>
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
  const passed = taken && best >= 80
  // A locked card still links — but to the word bank, not the quiz. A lock with
  // no path forward is a wall; this one points at the way through.
  const to = locked ? `/vocabulary/${unlock.category.id}` : `/quiz/${quiz.id}`

  return (
    <Link href={to} asChild>
      <Pressable className={`rounded-md bg-cream-50 border border-cream-200 p-4 flex-row items-center gap-4 active:bg-cream-100 ${locked ? 'opacity-80' : ''}`}>
        {/* Icon chip — quiz (zap) or locked (lock) */}
        <View className={`h-11 w-11 rounded-full items-center justify-center ${locked ? 'bg-cream-200' : 'bg-clay-600/12'}`}>
          <Icon name={locked ? 'lock' : 'zap'} size={20} tone={locked ? 'muted' : 'accent'} />
        </View>

        {/* Title + one-line meta */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-semibold text-stone-900 flex-1" numberOfLines={1}>{quiz.title}</Text>
            {quiz.tier === 'pro' && (
              <View className="rounded-full bg-clay-600 px-2 py-0.5">
                <Text className="text-[10px] uppercase tracking-wider font-semibold text-cream-50">Pro</Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-stone-600 mt-0.5" numberOfLines={1}>
            {locked ? `Study ${unlock.remaining} more to unlock` : quiz.description}
          </Text>
          <Text className="text-xs text-stone-500 mt-1">
            {locked ? 'Locked' : `${quiz.questionCount} questions`}
          </Text>
        </View>

        {/* Right: best score, or a chevron if not taken */}
        {taken ? (
          <View className={`rounded-full px-2.5 py-1 ${passed ? 'bg-success-50' : 'bg-cream-200'}`}>
            <Text className={`text-xs font-bold ${passed ? 'text-success-900' : 'text-stone-700'}`}>{best}%</Text>
          </View>
        ) : (
          <Icon name="arrowRight" size={18} tone="muted" />
        )}
      </Pressable>
    </Link>
  )
}
