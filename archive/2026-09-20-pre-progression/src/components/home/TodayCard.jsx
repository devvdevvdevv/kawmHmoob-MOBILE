import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useProgress } from '../../hooks/useProgress.js'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import { selectSession } from '../../context/ProgressContext.jsx'
import { categories } from '../../data/vocabulary.js'
import { quizzes } from '../../data/quizzes.js'
import { speakLessons, lessonProgress } from '../../data/speakLessons.js'
import { GENRES, stories, storyStepId } from '../../data/stories.js'
import { SPEAK_ENABLED } from '../../lib/launch.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// ⚠️ THIS CARD KNEW ABOUT TWO MODULES AND THE APP HAS FIVE — fixed 2026-09-09.
//
// It suggested a vocabulary review and an undone quiz. It had no idea the Speak
// course or the reading library existed — the two places the most content has
// been written. The one card whose whole job is answering "what should I do
// right now?" was blind to most of the answers.

export default function TodayCard() {
  const { vocabSchedule, quizScores, streakData, completedSteps } = useProgress()
  const { isPro } = useSubscription()

  const allWords = categories.flatMap((c) => c.words)
  // ⚠️ selectSession, NOT selectDueWords — FIXED 2026-09-12. This card was
  // reporting 572 words due on a fresh account.
  //
  // Two bugs in one call. `selectDueWords` counts a word as due when it has NO
  // schedule at all (`!sched || sched.dueDate <= today`) — so every word nobody
  // has ever studied was "due for review", which is the opposite of true. And it
  // is UNCAPPED, while the session the button actually starts is capped at
  // SESSION_LIMIT (25). The number promised a session the app would never run.
  //
  // `selectSession` is what /words/session builds from, so this now counts the
  // same queue the learner is about to see.
  const dueCount = selectSession(allWords, vocabSchedule).queue.length

  const today = new Date().toISOString().slice(0, 10)
  const doneTodayQuizIds = new Set(
    quizScores.filter((s) => s.date.slice(0, 10) === today).map((s) => s.quizId)
  )
  const suggestedQuiz = quizzes.find((q) => !doneTodayQuizIds.has(q.id))

  // ── The next unfinished Speak lesson ──────────────────────────────────
  //
  // ⚠️ GATED THREE WAYS, and every one of them is a dead end otherwise:
  //   • SPEAK_ENABLED — the whole module is behind a launch flag, and Home
  //     already hides the phrase-of-the-day when it is off. Suggesting a lesson
  //     from a section that renders "coming soon" is worse than suggesting
  //     nothing.
  //   • free || isPro — a locked lesson bounces to the paywall. A card that
  //     tells you what to do next should not be a sales pitch in disguise.
  //   • started but unfinished FIRST, then not-started — "continue" beats
  //     "begin", because the half-done thing is the one already costing you
  //     something to abandon.
  //   • ready — a lesson with no recordings cannot be practised at all, and the
  //     card that tells you what to do next must never point at one. This is the
  //     same `ready` the Conversations tab filters on.
  const speakCandidates = SPEAK_ENABLED
    ? speakLessons.filter((l) => l.ready && (l.free || isPro))
    : []
  const speakProgressOf = (l) => lessonProgress(l, completedSteps)
  const inProgressLesson = speakCandidates.find((l) => {
    const p = speakProgressOf(l)
    return p.total > 0 && p.done > 0 && p.done < p.total
  })
  const freshLesson = speakCandidates.find((l) => speakProgressOf(l).done === 0)
  const nextLesson = inProgressLesson || freshLesson

  // ── The next unread story ─────────────────────────────────────────────
  //
  // Membership is derived the same way the library derives it: a story is
  // readable if its GENRE is free, or you are Pro. Reading the genre rather
  // than the story is what keeps this in step with the shelves — gating lives
  // on the genre, and duplicating that rule here is how the two drift.
  const openGenres = new Set(GENRES.filter((g) => g.free || isPro).map((g) => g.id))
  const nextStory = stories.find(
    (s) => openGenres.has(s.genre) && !completedSteps.includes(storyStepId(s.id))
  )

  const suggestions = []
  if (dueCount > 0) {
    suggestions.push({
      label: `Review ${dueCount} word${dueCount === 1 ? '' : 's'} due`,
      cta: 'Review',
      to: '/review',
    })
  }
  // ⚠️ ORDER IS THE DESIGN. Due reviews first because they decay — a word
  // reviewed late is the only item here that gets WORSE for waiting. Then the
  // half-finished lesson, then something new to read, then a quiz, and the
  // notebook last as the always-available fallback.
  if (nextLesson) {
    suggestions.push({
      label: inProgressLesson
        ? `Finish "${nextLesson.title}"`
        : `Start "${nextLesson.title}"`,
      cta: 'Speak',
      to: `/speak/lesson/${nextLesson.id}`,
    })
  }
  if (nextStory) {
    suggestions.push({
      label: `Read "${nextStory.title}" · ${nextStory.minutes} min`,
      cta: 'Read',
      to: `/reading/story/${nextStory.id}`,
    })
  }
  if (suggestedQuiz) {
    suggestions.push({
      label: `Try the ${suggestedQuiz.title} quiz`,
      cta: 'Quiz',
      to: `/quiz/${suggestedQuiz.id}`,
    })
  }
  // The Notes tab is commented out in the Notebook, so this points at Saved Words
  // instead of landing on an empty tab. Restore the two lines below with it.
  suggestions.push({
    // label: 'Jot down something you learned today',
    // to: '/notebook/notes',
    label: 'Look back over your saved words',
    cta: 'Notebook',
    to: '/notebook/saved',
  })

  return (
    <View className="rounded-md bg-cream-50 shadow-warm p-6">
      <View className="flex-row justify-between items-end mb-4">
        <Text className="font-serif text-2xl text-stone-900">Today</Text>
        <Text className="text-sm font-medium text-stone-600">
          {streakData.currentStreak > 0
            ? `${streakData.currentStreak}-day streak`
            : 'Start your streak'}
        </Text>
      </View>
      {/* ⚠️ CAPPED AT FOUR. With five sources feeding this, an uncapped list is
          a menu — and a menu is exactly what "Today" exists to save you from.
          Four fits without scrolling and still leaves the notebook fallback
          reachable when the others are empty. */}
      <View>
        {suggestions.slice(0, 4).map((s, i) => (
          <View
            key={s.to}
            className={`flex-row items-center justify-between gap-4 py-3 ${
              i > 0 ? 'border-t border-cream-200' : ''
            }`}
          >
            <Text className="text-stone-700 flex-1">{s.label}</Text>
            <Link href={s.to} asChild>
              <Pressable>
                <Text className="text-sm text-clay-700 font-semibold">{s.cta} →</Text>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </View>
  )
}
