import { useMemo, useState } from 'react'
import { View, Text, Pressable, TextInput } from 'react-native'
import { Link } from 'expo-router'
import { categories, categoryGroups } from '../../data/vocabulary.js'
import { quizzes } from '../../data/quizzes.js'
import { useProgress } from '../../hooks/useProgress.js'
import { bestScoresByQuiz } from '../../lib/quizProgress.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../hooks/useDailyQuota.js'
import { quotaLimit } from '../../lib/quotaLimits.js'
import QuotaBadge from '../common/QuotaBadge.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import ProgressBar from '../progress/ProgressBar.jsx'
import VocabRow, { RowIcon, ProBadge, VOCAB_CARD } from './VocabRow.jsx'
import QuizChip from './QuizChip.jsx'
import Icon from '../ui/Icon.jsx'
import { useThemeColor } from '../../lib/themeColor.js'

// VOCABULARY INDEX — themes you enter, not 46 categories in one column.
//
// This page used to list every category (and, before the quiz merge, so did
// /quiz). On a phone that was a dozen screens of scrolling with no landmarks.
// Now it's one screen of THEME cards, and tapping one opens
// /vocabulary/group/<id> with that theme's categories (see VocabGroup.jsx).
//
// The quiz-hub features from the retired /quiz menu still live here: the daily
// quota badge and the overall "taken X of Y" bar up top, and the deck-less
// drills at the bottom. Per-category scores and the study lock moved one level
// down, onto the group page.
export default function VocabCategoryGrid() {
  // ⚠️ A HOOK, so it sits above every early return in this component — the
  // colours it resolves change with the theme, and hook order may not.
  const themeColor = useThemeColor()

  const { user } = useAuth()
  const { isPro } = useSubscription()
  const { quizScores, vocabProgress } = useProgress()

  const bestByQuiz = useMemo(() => bestScoresByQuiz(quizScores), [quizScores])

  // Non-vocab quizzes (Alphabet, Tones, Grammar, Speak) — no word deck behind
  // them, so they can't live in a theme. Without this section, retiring the quiz
  // menu would strand them.
  const drills = useMemo(() => quizzes.filter((q) => !q.id.startsWith('vocab-')), [])

  const quota = useDailyQuota('quiz', quotaLimit('quiz', user.isGuest), {
    enabled: !isPro,
    scope: user?.id || 'guest',
  })

  const totalWords = categories.reduce((n, c) => n + c.words.length, 0)

  // ── Category search ───────────────────────────────────────────────────────
  // 46 categories sitting behind 9 theme cards is two taps and a guess when you
  // already know what you want. Search skips the hierarchy entirely.
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  // Which theme each category belongs to — so a result can say where it lives,
  // and so searching "body" finds the categories inside The Body.
  const groupOf = useMemo(() => {
    const map = {}
    for (const g of categoryGroups) for (const c of g.items) map[c.id] = g.title
    return map
  }, [])

  const results = useMemo(() => {
    if (!q) return []
    return categories.filter((c) =>
      [c.title, c.description, groupOf[c.id]]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    )
  }, [q, groupOf])

  // Count only quizzes you can actually sit: a category with no words yet
  // generates a 0-question quiz, and counting it would make the denominator a
  // target you can never reach. Counting FROM this list also means a score left
  // over from a retired quiz can't credit you for one that still exists.
  const takeable = useMemo(() => quizzes.filter((q) => q.questionCount > 0), [])
  const takenCount = takeable.filter((q) => bestByQuiz[q.id] != null).length

  return (
    <View>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Vocabulary' }]} />

      <View className="mb-5">
        <View className="flex-row items-start justify-between gap-3">
          <Text className="font-serif text-3xl text-stone-900 flex-1">Vocabulary</Text>
          <QuotaBadge {...quota} label="quizzes left" />
        </View>
        <Text className="text-sm font-medium text-stone-700 mt-1">
          {totalWords} words in {categories.length} categories. Pick a theme to start.
        </Text>
      </View>

      <View className="flex-row items-center gap-2 rounded-md bg-cream-100 px-4 mb-6">
        <Icon name="grid" size={18} tone="muted" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search categories…"
          placeholderTextColor={themeColor('--c-stone-500')}
          accessibilityLabel="Search vocabulary categories"
          returnKeyType="search"
          autoCorrect={false}
          className="flex-1 text-base text-stone-900"
          style={{ paddingVertical: 12 }}
        />
        {q.length > 0 && (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
          >
            <Text className="text-lg text-stone-500">×</Text>
          </Pressable>
        )}
      </View>

      {/* ⚠️ Searching REPLACES the page rather than filtering in place. The
          progress bar, the theme cards and the drills all describe the WHOLE
          library; leaving them above a result list would claim "9 themes" while
          showing three categories. */}
      {q ? (
        <SearchResults results={results} groupOf={groupOf} query={query} />
      ) : (
        <>
          <View className={`${VOCAB_CARD} p-4 mb-6`}>
            <ProgressBar
              label="Quizzes taken"
              hint={`${takenCount} of ${takeable.length}`}
              value={takenCount}
              max={takeable.length}
            />
          </View>

          <View className="gap-3">
            {categoryGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                bestByQuiz={bestByQuiz}
                vocabProgress={vocabProgress}
              />
            ))}
          </View>
        </>
      )}

      {!q && drills.length > 0 && (
        <View className="mt-10">
          <Text className="font-serif text-2xl text-stone-900 mb-1">Drills</Text>
          <Text className="text-sm font-medium text-stone-700 mb-4">
            Quizzes with no word deck: alphabet, tones, grammar.
          </Text>
          <View className="gap-3">
            {drills.map((q) => (
              <VocabRow
                key={q.id}
                href={`/quiz/${q.id}`}
                leading={<RowIcon icon="zap" />}
                title={q.title}
                meta={`${q.questionCount} questions · ${q.category}`}
                badge={q.tier === 'pro' ? <ProBadge /> : null}
                trailing={<QuizChip quizId={q.id} best={bestByQuiz[q.id]} label={q.title} />}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

/** Flat category results — the whole point is skipping the theme hierarchy. */
function SearchResults({ results, groupOf, query }) {
  if (results.length === 0) {
    return (
      <View className="rounded-md bg-cream-100 p-8 items-center">
        <Text className="font-serif text-xl text-stone-900 mb-1">No categories match</Text>
        <Text className="text-sm font-medium text-stone-700 text-center">
          Nothing for &ldquo;{query.trim()}&rdquo;. Try something broader —
          food, body, time.
        </Text>
      </View>
    )
  }

  return (
    <View>
      <Text className="text-sm font-medium text-stone-700 mb-3">
        {results.length} categor{results.length === 1 ? 'y' : 'ies'}
      </Text>
      <View className="gap-3">
        {results.map((c) => (
          <VocabRow
            key={c.id}
            href={`/vocabulary/${c.id}`}
            leading={<RowIcon emoji={c.emoji} />}
            title={c.title}
            // The theme is named because the result was pulled OUT of it —
            // without that a learner cannot tell where the category normally
            // lives, or how to find it again without searching.
            meta={`${c.words.length} words · ${groupOf[c.id] || 'Vocabulary'}`}
          />
        ))}
      </View>
    </View>
  )
}

// A theme card: what's inside, how far in you are, and one tap to enter.
function GroupCard({ group, bestByQuiz, vocabProgress }) {
  const items = group.items
  const words = items.reduce((n, c) => n + c.words.length, 0)
  const studied = items.reduce((n, c) => n + c.words.filter((w) => vocabProgress[w.id]).length, 0)
  const quizzed = items.filter((c) => bestByQuiz[`vocab-${c.id}`] != null).length

  // EMOJI STRIP REMOVED — the group cards read cleaner on their own; the emoji
  // stays where it identifies one thing (the category rows inside a group).
  // Restore by dropping this line back above the title:
  //   const emojis = items.map((c) => c.emoji).filter(Boolean).slice(0, 3).join(' ')
  //   {!!emojis && <Text className="text-xl mb-1.5">{emojis}</Text>}

  return (
    <Link href={`/vocabulary/group/${group.id}`} asChild>
      <Pressable className={`${VOCAB_CARD} p-4 active:bg-cream-100`}>
        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <Text className="font-serif text-xl text-stone-900">{group.title}</Text>
            {!!group.blurb && (
              <Text className="text-sm font-medium text-stone-700 mt-1 leading-snug">{group.blurb}</Text>
            )}
            <Text className="text-xs text-stone-600 mt-2">
              {items.length} categor{items.length === 1 ? 'y' : 'ies'} · {words} words
              {quizzed > 0 ? ` · ${quizzed} quizzed` : ''}
            </Text>
          </View>
          <Icon name="arrowRight" size={20} tone="accent" />
        </View>

        {words > 0 && (
          <ProgressBar
            value={studied}
            max={words}
            hint={`${studied}/${words} studied`}
            size="sm"
            className="mt-3"
          />
        )}
      </Pressable>
    </Link>
  )
}
