import { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import { getCategoryGroup } from '../../data/vocabulary.js'
import { quizUnlock } from '../../lib/access.js'
import { bestScoresByQuiz } from '../../lib/quizProgress.js'
import { useProgress } from '../../hooks/useProgress.js'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import Eyebrow from '../ui/Eyebrow.jsx'
import ProgressBar from '../progress/ProgressBar.jsx'
import VocabRow, { RowIcon, ProBadge, VOCAB_CARD } from './VocabRow.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import { canOpenCategory } from '../../lib/vocabAccess.js'
import QuizChip from './QuizChip.jsx'
import { accentFor } from '../../lib/vocabAccent.js'

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

  // ⚠️ ONE hue for the whole page, inherited by every row. A per-category colour
  // was the obvious move and it looked like a bag of skittles: 13 rows in 6 hues
  // reads as noise, not as information. Sharing the theme's colour makes the set
  // hold together, and matches the card the learner tapped to get here.
  const accent = accentFor(group.id, { theme: true })

  return (
    <View>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Vocabulary', to: '/vocabulary' },
          { label: group.title },
        ]}
      />

      {/* The theme's own mark, at the size the page deserves — the same medallion
          that identified this theme on the card you tapped, so arriving here
          confirms you are where you meant to be. */}
      <View className="flex-row items-center gap-4 mb-5">
        <View
          className={`h-14 w-14 rounded-full ${accent.medallion} border ${accent.ring} items-center justify-center`}
        >
          <Text className="text-2xl">{group.emoji}</Text>
        </View>
        <View className="flex-1">
          <Text className="font-serif text-3xl text-stone-900">{group.title}</Text>
          {!!group.blurb && (
            <Text className="text-sm font-medium text-stone-700 mt-0.5 leading-snug">
              {group.blurb}
            </Text>
          )}
        </View>
      </View>

      {words > 0 && (
        <View className={`${VOCAB_CARD} p-4 mb-6`}>
          <ProgressBar label="Words studied" value={studied} max={words} fill={accent.fill} />
        </View>
      )}

      {/* ── PRIMARY / SECONDARY — 2026-09-25 ──────────────────────────────
          Sets carry a `tier` (applySplits in vocabulary.js): the everyday
          primaries first, then the specialised secondaries and the later parts
          of a split set ("Animals 2", "Animals 3"). A theme with only one kind
          shows no headings at all — a lone "Primary" label says nothing.
          Was: a single items.map() in data order. */}
      {TIERS.map((tier) => {
        const inTier = items.filter((c) => (c.tier || 'primary') === tier.id)
        if (!inTier.length) return null
        const labelled = items.some((c) => (c.tier || 'primary') !== tier.id)
        return (
          <View key={tier.id} className={tier.id === 'secondary' ? 'mt-7' : ''}>
            {labelled && (
              <View className="mb-3">
                <Eyebrow tone={tier.id === 'primary' ? 'accent' : 'muted'}>{tier.label}</Eyebrow>
                <Text className="text-sm font-medium text-stone-600 mt-1">{tier.blurb}</Text>
              </View>
            )}
      <View className="gap-3">
        {inTier.map((c) => (
          <CategoryRow
            key={c.id}
            category={c}
            accent={accent}
            best={bestByQuiz[`vocab-${c.id}`]}
            unlock={quizUnlock(`vocab-${c.id}`, vocabProgress)}
            studied={c.words.filter((w) => vocabProgress[w.id]).length}
            groupId={group.id}
          />
        ))}
      </View>
          </View>
        )
      })}
    </View>
  )
}

// The two tiers, in display order. See `tier` in applySplits (vocabulary.js).
const TIERS = [
  { id: 'primary', label: 'Primary', blurb: 'The everyday words — start here.' },
  { id: 'secondary', label: 'Secondary', blurb: 'More specialised words, and the later parts of big sets.' },
]

function CategoryRow({ category, accent, best, unlock, studied, groupId }) {
  const { isPro } = useSubscription()
  // ⚠️ PRO SETS — 2026-09-25 (lib/vocabAccess.js). The row still links: the
  // set's own screen shows the upgrade card, the same as a Pro path unit.
  const proLocked = !canOpenCategory(category.id, isPro)
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
      // ?fromGroup= — so the set's "back" returns to THIS theme (2026-09-26).
      // See groupReturn() in data/vocabulary.js. Was: `/vocabulary/${category.id}`
      href={`/vocabulary/${category.id}?fromGroup=${groupId}`}
      leading={<RowIcon emoji={category.emoji} accent={accent} />}
      title={category.title}
      meta={meta}
      badge={proLocked ? <ProBadge /> : null}
      progress={studied > 0 ? { value: studied, max: total } : null}
      progressFill={accent.fill}
      trailing={
        // Was: hasQuiz ? (…) — a locked set's quiz chip is hidden; its Pro
        // badge already says what is behind the row.
        hasQuiz && !proLocked ? (
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
