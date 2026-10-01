import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { getCategoryGroup } from '../../data/vocabulary.js'
import { quizUnlock } from '../../lib/access.js'
import { bestScoresByQuiz } from '../../lib/quizProgress.js'
import { useProgress } from '../../hooks/useProgress.js'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import ProgressBar from '../progress/ProgressBar.jsx'
import VocabRow, { RowIcon, VOCAB_CARD } from './VocabRow.jsx'
import QuizChip from './QuizChip.jsx'

// ONE THEME's categories — People & Family, Nature & Food, and so on. Reached by
// tapping a card on /vocabulary, which lists the themes rather than all 46
// categories at once.
//
// Everything a learner decides from is on one row: how many words, how many
// they've marked, and whether the quiz is open, locked, or already scored.
export default function VocabGroup() {
  const { groupId } = useLocalSearchParams()
  const group = getCategoryGroup(groupId)
  const { vocabProgress, quizScores } = useProgress()
  const bestByQuiz = useMemo(() => bestScoresByQuiz(quizScores), [quizScores])

  if (!group) {
    return (
      <View>
        <Text className="text-stone-900">Theme not found.</Text>
        <Link href="/vocabulary" asChild>
          <Pressable>
            <Text className="text-clay-700 underline mt-2">Back to Vocabulary</Text>
          </Pressable>
        </Link>
      </View>
    )
  }

  const items = group.items
  const words = items.reduce((n, c) => n + c.words.length, 0)
  const studied = items.reduce((n, c) => n + c.words.filter((w) => vocabProgress[w.id]).length, 0)

  return (
    <View>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Vocabulary', to: '/vocabulary' },
          { label: group.title },
        ]}
      />

      <View className="mb-5">
        <Text className="font-serif text-3xl text-stone-900">{group.title}</Text>
        {!!group.blurb && (
          <Text className="text-sm font-medium text-stone-700 mt-1 leading-snug">{group.blurb}</Text>
        )}
      </View>

      {words > 0 && (
        <View className={`${VOCAB_CARD} p-4 mb-6`}>
          <ProgressBar label="Words studied" value={studied} max={words} />
        </View>
      )}

      <View className="gap-3">
        {items.map((c) => (
          <CategoryRow
            key={c.id}
            category={c}
            best={bestByQuiz[`vocab-${c.id}`]}
            unlock={quizUnlock(`vocab-${c.id}`, vocabProgress)}
            studied={c.words.filter((w) => vocabProgress[w.id]).length}
          />
        ))}
      </View>
    </View>
  )
}

function CategoryRow({ category, best, unlock, studied }) {
  const total = category.words.length
  const locked = Boolean(unlock?.gated && !unlock.unlocked)
  // Every category auto-generates a quiz, including ones still being written — but
  // a 0-question quiz dead-ends at "No data available", so an empty deck gets no chip.
  const hasQuiz = total > 0

  const meta =
    total === 0
      ? 'Words coming soon'
      : locked
        ? `${total} words · study ${unlock.remaining} more to unlock`
        : `${total} words · ${studied} studied`

  return (
    <VocabRow
      href={`/vocabulary/${category.id}`}
      leading={<RowIcon emoji={category.emoji} />}
      title={category.title}
      meta={meta}
      progress={studied > 0 ? { value: studied, max: total } : null}
      trailing={
        hasQuiz ? (
          <QuizChip
            quizId={`vocab-${category.id}`}
            best={best}
            locked={locked}
            label={category.title}
          />
        ) : null
      }
    />
  )
}
