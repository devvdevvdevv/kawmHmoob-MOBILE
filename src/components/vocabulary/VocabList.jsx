import { useEffect, useState } from 'react'
import { View, Text, Pressable, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { getCategory, groupReturn } from '../../data/vocabulary.js'
import { lessonReturn } from '../../data/lessons.js'
import { useProgress } from '../../hooks/useProgress.js'
import { useQuizPrefs } from '../../lib/quizPrefs.js'
import { useQuizSettings } from '../../context/QuizSettingsContext.jsx'
import { quizUnlock } from '../../lib/access.js'
import { bestScoresByQuiz, isQuizPassed } from '../../lib/quizProgress.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import { HEADER_CONTENT_HEIGHT } from '../GlobalHeader.jsx'
import { TAB_BAR_HEIGHT } from '../GlobalTabBar.jsx'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '../common/DeckNavIcons.jsx'
import Flashcard from './Flashcard.jsx'
import StatusBadge from './StatusBadge.jsx'
import { VOCAB_CARD } from './VocabRow.jsx'
import Button from '../ui/Button.jsx'
// You are browsing INSIDE a category here, so the category's own senses are the
// right ones to show. See src/lib/senses.js.
import { glossFor, domainOf } from '../../lib/senses.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
export default function VocabList() {
  const { categoryId, fromGroup, fromLesson, fromUnit } = useLocalSearchParams()
  const router = useRouter()
  const cat = getCategory(categoryId)
  // Opened from a theme page → back goes to that theme (2026-09-26). Null when
  // opened any other way, or when fromGroup doesn't hold this set.
  const group = cat ? groupReturn(fromGroup, cat.id) : null
  // ── BACK TO THE LESSON — 2026-09-27 ───────────────────────────────────────
  // Opened from a lesson's "Study the N words" (?fromLesson=) and it really is
  // that lesson's set → the trail reads Learn › <unit> › <lesson>, and a button
  // goes back to it. See lessonReturn() in data/lessons.js.
  const lessonBack = cat ? lessonReturn(fromLesson, cat.id, fromUnit) : null
  // What the set's word links carry forward, so their "Back to <set>" keeps it.
  // Was: group ? `?fromGroup=${group.id}` : ''
  const keep = [group && `fromGroup=${group.id}`, lessonBack && lessonBack.query].filter(Boolean).join('&')
  const groupQuery = keep ? `?${keep}` : ''
  const [mode, setMode] = useState('list')
  const [cardIdx, setCardIdx] = useState(0)
  const { vocabProgress, quizScores } = useProgress()
  const { theme } = useTheme()
  const { prefs } = useQuizPrefs()
  // The sheet is rendered at the ROOT (QuizSettingsHost), not here — only there
  // does its absolute-fill overlay cover the header and tab bar.
  const { openQuizSettings } = useQuizSettings()

  const tk = THEME_TOKENS[theme] || THEME_TOKENS.light
  const inkColor = `rgb(${tk['--c-stone-800']})`
  const creamColor = `rgb(${tk['--c-cream-50']})`

  // Usable height for study mode — the screen minus both floating bars, their
  // safe-area insets, and roughly what the category header above consumes.
  // Recomputed from useWindowDimensions so it follows rotation and split screen.
  const { height: windowHeight } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  const CATEGORY_HEADER = 150 // title + description + the quiz/toggle cluster
  const studyViewportHeight = Math.max(
    320, // never collapse below a card's own height on a very short screen
    windowHeight -
      (HEADER_CONTENT_HEIGHT + insets.top) -
      (TAB_BAR_HEIGHT + Math.max(insets.bottom, 8)) -
      CATEGORY_HEADER
  )

  // The STUDY deck, ordered per the ⚙ "Flashcard order" preference.
  //
  // ⚠️ HELD IN STATE, SHUFFLED IN AN EFFECT — deliberately not useMemo. A memo is
  // a performance hint, not a guarantee: React may discard and recompute it, and
  // with Math.random() inside that means the deck RESHUFFLES mid-session. The
  // card at `cardIdx` would silently become a different word and the Next arrow
  // would look like it jumped. Shuffling once, into state, is the only version
  // that is actually stable.
  //
  // Resetting cardIdx here is intentional: a new order should start at card 1,
  // otherwise you resume at position 7 of a deck you have never seen.
  const [deck, setDeck] = useState(() => cat?.words || [])
  useEffect(() => {
    const words = cat?.words || []
    if (prefs.cardOrder !== 'random') {
      setDeck(words)
    } else {
      const copy = words.slice()
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      setDeck(copy)
    }
    setCardIdx(0)
  }, [cat, prefs.cardOrder])

  if (!cat) {
    return (
      <View>
        <Text className="text-stone-900">Category not found.</Text>
        <Link href="/vocabulary" asChild>
          <Pressable><Text className="text-clay-700 underline">Back to vocabulary</Text></Pressable>
        </Link>
      </View>
    )
  }

  const empty = cat.words.length === 0
  // Study mode reads `deck` (possibly shuffled); the LIST below deliberately
  // keeps rendering `cat.words` in authored order. A shuffled reference list is
  // just hard to scan — shuffling is about defeating recall order while
  // studying, not about the index you browse.
  const word = deck[cardIdx]

  // The quiz menu is retired, so this deck IS the quiz's home page (see
  // VocabCategoryGrid). Same three facts the grid card shows, for this one
  // category: your best score, whether the quiz is unlocked yet, and how many
  // more words open it. Plain expressions, not hooks — we are past an early return.
  const quizId = `vocab-${cat.id}`
  const unlock = quizUnlock(quizId, vocabProgress)
  const locked = Boolean(unlock.gated && !unlock.unlocked)
  const best = bestScoresByQuiz(quizScores)[quizId] ?? null
  const passed = isQuizPassed(best)

  return (
    <View>
      <Breadcrumbs
        items={lessonBack ? [
          // From a lesson: the trail is the LESSON's, not Vocabulary's (2026-09-27).
          { label: 'Home', to: '/' },
          { label: 'Learn', to: '/learn' },
          { label: lessonBack.unit.title, to: `/learn/${lessonBack.unit.id}` },
          { label: lessonBack.lesson.title, to: lessonBack.href },
          { label: cat.title },
        ] : [
          { label: 'Home', to: '/' },
          { label: 'Vocabulary', to: '/vocabulary' },
          // The theme the learner came from, when there is one (see groupReturn).
          ...(group ? [{ label: group.title, to: `/vocabulary/group/${group.id}` }] : []),
          { label: cat.title },
        ]}
      />

      {/* ⚠️ dismissTo, not push: the lesson is still open underneath (the Study
          button pushed this set on top of it), so going back lands on the step the
          learner was on. push would stack a second copy of the lesson from step 1. */}
      {lessonBack && (
        <Button variant="secondary" size="sm" className="self-start mb-4" onPress={() => router.dismissTo(lessonBack.href)}>
          ← Back to the lesson
        </Button>
      )}

      <View className="flex-row flex-wrap justify-between items-end mb-6 gap-3">
        <View className="flex-1 min-w-[200px]">
          <Text className="font-serif text-4xl text-stone-900">
            {cat.emoji} {cat.title}
          </Text>
          <Text className="text-stone-700 mt-1">{cat.description}</Text>
        </View>
        {!empty && (
          // Quiz is reachable from the header at all times (mirrors the web);
          // the List / Study Mode toggle sits beneath it.
          <View className="w-full items-end gap-2 sm:w-auto">
            {/* ⚙ ABOVE the quiz button, on its own line. It configures the thing
                the button launches, so it reads top-down: set it up, then start.
                Tucked in beside the List/Study toggle it was competing with two
                other controls and got lost. */}
            <Pressable
              onPress={() =>
                openQuizSettings([
                  "Flashcard order applies to Study Mode on this page — it takes effect right away.",
                  "The quiz settings apply the next time you open a quiz.",
                ])
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Quiz and study settings"
              className="h-10 w-10 items-center justify-center rounded-full bg-cream-100 active:bg-cream-200"
            >
              <Text className="text-lg">⚙️</Text>
            </Pressable>
            {locked ? (
              // Don't hand out a button that leads to a wall — say what opens it.
              <View className="rounded-md bg-cream-100 px-3 py-2">
                <Text className="text-xs text-stone-600">
                  🔒 Study {unlock.remaining} more to unlock the quiz
                </Text>
              </View>
            ) : (
              <View className="flex-row self-end items-center gap-2">
                {best != null && (
                  <View className={`rounded-full px-2.5 py-1 ${passed ? 'bg-lime-200' : 'bg-cream-300'}`}>
                    <Text className={`text-xs font-bold ${passed ? 'text-lime-900' : 'text-stone-800'}`}>
                      Best {best}%
                    </Text>
                  </View>
                )}
                <Link href={`/quiz/${quizId}`} asChild>
                  <Button size="sm">{best != null ? 'Take it again →' : 'Take the quiz →'}</Button>
                </Link>
              </View>
            )}
            <View className="flex-row gap-1 rounded bg-cream-100 p-1">
              <Pressable
                onPress={() => setMode('list')}
                className={`px-3 py-1.5 rounded-sm ${mode === 'list' ? 'bg-cream-50 shadow-warm' : ''}`}
              >
                <Text className={`text-sm ${mode === 'list' ? 'text-clay-700 font-semibold' : 'text-stone-600'}`}>List</Text>
              </Pressable>
              <Pressable
                onPress={() => { setMode('flashcard'); setCardIdx(0) }}
                className={`px-3 py-1.5 rounded-sm ${mode === 'flashcard' ? 'bg-cream-50 shadow-warm' : ''}`}
              >
                <Text className={`text-sm ${mode === 'flashcard' ? 'text-clay-700 font-semibold' : 'text-stone-600'}`}>
                  Study Mode
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {empty && <EmptyState />}

      {/* Same card recipe and rhythm as the rows on the group page you just came
          from (VOCAB_CARD) — this list used to be smaller and flatter than that
          one, which made the two pages look unrelated. */}
      {!empty && mode === 'list' && (
        <View className="gap-3">
          {cat.words.map((w) => {
            const status = vocabProgress[w.id] || 'new'
            return (
              <View
                key={w.id}
                className={`${VOCAB_CARD} flex-row items-center justify-between gap-3 p-4`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <AudioButton audioSrc={w.audioFile} wordId={w.id} />
                  <Pressable
                    // Carries the theme down to the word, so its trail keeps it too.
                    onPress={() => router.push(`/vocabulary/${cat.id}/${w.id}${groupQuery}`)}
                    className="flex-1 active:opacity-70"
                  >
                    <Text className="font-serif text-lg text-clay-700">{w.hmongRPA}</Text>
                    <Text className="text-sm font-medium text-stone-600">{glossFor(w, domainOf(w.category))}</Text>
                  </Pressable>
                </View>
                {/* The shared flag — same pill the flashcard and word page fly. */}
                <StatusBadge status={status} />
              </View>
            )
          })}
        </View>
      )}

      {!empty && mode === 'flashcard' && word && (
        // Study mode centres the card in what's left of the screen instead of
        // stacking it under the header. `minHeight` + `justify-center` rather than
        // `flex-1`: this sits inside TabScreen's ScrollView, and a flex child of a
        // scroll container has no height to fill — flex-1 would collapse it.
        //
        // The height is measured, not guessed: window height minus the two
        // floating bars, their safe-area insets, and the space the category header
        // above already used. HEADER_CONTENT_HEIGHT / TAB_BAR_HEIGHT are exported
        // by those components precisely so this arithmetic cannot drift.
        <View style={{ minHeight: studyViewportHeight, justifyContent: 'center' }}>
          <Flashcard word={word} />

          {/* Prev / next as large round targets flanking the counter — ported
              from the web study mode. Prev is a neutral cream circle; next is the
              primary clay circle. At the end of the deck, next is swapped for a
              refresh (restart) + a link into the category quiz. */}
          <View className="flex-row justify-between items-center mt-4 gap-3">
            <Pressable
              onPress={() => setCardIdx((i) => Math.max(0, i - 1))}
              disabled={cardIdx === 0}
              className={`h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300 ${cardIdx === 0 ? 'opacity-40' : ''}`}
            >
              <ArrowLeftIcon color={inkColor} />
            </Pressable>

            <Text className="text-sm font-medium text-stone-700">
              {cardIdx + 1} / {deck.length}
            </Text>

            {cardIdx === deck.length - 1 ? (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setCardIdx(0)}
                  className="h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300"
                >
                  <RefreshIcon color={inkColor} />
                </Pressable>
                {/* End of the deck — offer the quiz only if it is actually open.
                    Reaching the last card isn't the same as marking the words. */}
                {!locked && (
                  <Link href={`/quiz/${quizId}`} asChild>
                    <Button size="sm">Take the quiz</Button>
                  </Link>
                )}
              </View>
            ) : (
              <Pressable
                onPress={() => setCardIdx((i) => Math.min(deck.length - 1, i + 1))}
                className="h-12 w-12 rounded-full bg-clay-600 items-center justify-center active:bg-clay-700"
              >
                <ArrowRightIcon color={creamColor} />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

// REPLACED by the shared StatusBadge — this was the third look for one fact
// (lowercase, its own colors), so the same word read differently on the list, the
// flashcard, and the word page. Kept in case that pale style is wanted back.
/*
function StatusPill({ status }) {
  const styles = {
    known: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    learning: { bg: 'bg-cream-200', text: 'text-clay-700' },
    new: { bg: 'bg-cream-100', text: 'text-stone-600' },
  }
  const s = styles[status] || styles.new
  return (
    <View className={`px-2.5 py-1 rounded-full ${s.bg}`}>
      <Text className={`text-xs font-semibold ${s.text}`}>{status}</Text>
    </View>
  )
}
*/

function EmptyState() {
  return (
    <View className="rounded-md border-2 border-dashed border-cream-400 bg-cream-50/60 p-12 items-center">
      <Text className="text-5xl mb-3">📚</Text>
      <Text className="font-serif text-xl text-stone-900">Words coming soon</Text>
      <Text className="text-sm font-medium text-stone-600 mt-1 text-center">
        This category is being built. Check back later.
      </Text>
    </View>
  )
}
