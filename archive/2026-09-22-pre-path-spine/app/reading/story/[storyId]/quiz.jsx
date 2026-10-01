import { useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
// TabScreen still wraps the "story not found" branch — an error state belongs
// on the app's normal chrome. Every real state below is the reading module's
// own cream sheet.
import TabScreen from '../../../../src/components/TabScreen.jsx'
import { HEADER_CONTENT_HEIGHT } from '../../../../src/components/GlobalHeader.jsx'
import { TAB_BAR_HEIGHT } from '../../../../src/components/GlobalTabBar.jsx'
import Button from '../../../../src/components/ui/Button.jsx'
import Icon from '../../../../src/components/ui/Icon.jsx'
import { GENRES, stories, storyStepId } from '../../../../src/data/stories.js'
import { useProgress } from '../../../../src/hooks/useProgress.js'
import { useCelebration } from '../../../../src/context/CelebrationContext.jsx'
import { useTheme } from '../../../../src/context/ThemeContext.jsx'
import { genreCoverColor } from '../../../../src/lib/genreCover.js'
// Fed the quota's scope only — back in with it.
// import { useAuth } from '../../../../src/context/AuthContext.jsx'
import { useSubscription } from '../../../../src/context/SubscriptionContext.jsx'
// Back in with the quota block below — see the ⚠️ note at `const quota`.
// import { useDailyQuota } from '../../../../src/hooks/useDailyQuota.js'
// import { quotaLimit } from '../../../../src/lib/quotaLimits.js'
import QuotaWall from '../../../../src/components/common/QuotaWall.jsx'

// A stable stand-in for the removed daily quota. Module scope so its identity
// never changes: an inline object would be a fresh value every render and would
// invalidate every dependency array it appears in.
const NO_QUOTA = { ready: false, exhausted: false, consume: () => {} }

// COMPREHENSION QUIZ — did the story land?
//
// Questions live inside the story object, not in a parallel file. They are
// hand-written ABOUT this text and cannot be generated, so keeping them next to
// the paragraphs they test is the only way they stay in sync.
//
// ── The shape of the screen (2026-09-08) ────────────────────────────────────
//
// ⚠️ IT IS THE SAME SHEET AS THE READER. This screen used TabScreen, so
// finishing a story on cream paper threw you back onto the seafoam page ground
// for the questions ABOUT that paper. The quiz is the last beat of the story,
// not a different place, so it is the same surface, carries the same genre
// colour, and uses the same frame maths.
//
// ⚠️ THE ACTION BAR IS ALWAYS THERE, and that is the fix that matters most.
// Before, the feedback block and the Next button both appeared out of nothing
// once you answered, growing the page downward — on a short screen the button
// you needed was below the fold, so answering a question appeared to do nothing
// until you scrolled. Now the bar is pinned, present from the first render, and
// only its LABEL and enabled state change. Nothing moves under the finger.
//
// ⚠️ ONLY THE PRESENTATION CHANGED. The state machine, the shuffle, the
// scoring and markStepComplete are exactly as they were.

/**
 * Fisher–Yates shuffle.
 *
 * ⚠️ [...arr] COPIES FIRST. Shuffling in place would reorder story.questions
 * itself — your actual data — so re-opening the quiz would find the options
 * already scrambled and the original order gone for the rest of the session.
 *
 * ⚠️ Not arr.sort(() => Math.random() - 0.5). That is the popular wrong answer:
 * it is not a uniform shuffle (some orders are far likelier) AND it mutates.
 */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]   // swap, using array destructuring
  }
  return a
}

export default function StoryQuiz() {

  const { storyId } = useLocalSearchParams()
  const router = useRouter()
  const { markStepComplete } = useProgress()

  // ⚠️ RENDERED AT THE ROOT, not here. The overlay has to sit ABOVE the
  // floating header and tab bar; mounted inside a screen it lands under them
  // and is clipped by the screen's column. This context is the wire between
  // "the quiz wants to celebrate" and "the root renders it" — the same shape as
  // QuizSettingsContext, and for the same reason.
  const { celebrate } = useCelebration()

  // ── The daily allowance ──────────────────────────────────────────────────
  // ⚠️ THIS QUIZ HAD NO LIMIT AT ALL until 2026-09-12. It is not built on
  // QuizEngine — it is the reading module's own state machine — so it quietly
  // sat outside the quota every other quiz in the app obeys. Unlimited retakes
  // of a comprehension quiz is also the one place where guessing beats reading:
  // five questions with four options each falls to brute force in a few runs.
  //
  // ⚠️ REMOVED 2026-09-15, WITH ONE REGRET. Reading is open to everyone now, and
  // a comprehension quiz that says "come back tomorrow" at the end of a free
  // story is the same broken promise the shelf gate was.
  //
  // But the note above gives TWO reasons for this cap and only one of them was
  // about money. The other still stands: five questions, four options each,
  // unlimited retakes — brute force beats reading. That is now unguarded.
  // If it needs a limit again, it wants one that is NOT tied to `isPro`, since
  // the problem applies to a paying reader exactly as much.
  //
  // TO RESTORE: uncomment below, and put back the two imports at the top.
  //
  //   const quota = useDailyQuota('quiz', quotaLimit('quiz', user?.isGuest), {
  //     enabled: !isPro,
  //     scope: user?.id || 'guest',
  //   })
  // `user` only ever scoped the quota — it comes back with it.
  // const { user } = useAuth()
  const { isPro } = useSubscription()
  const quota = NO_QUOTA

  const story = stories.find((s) => s.id === storyId)

  // The shelf colour, so the quiz looks like it belongs to the story you just
  // read rather than to the app in general. A plain lookup, not a hook.
  const genre = GENRES.find((g) => g.id === story?.genre)
  const { theme: quizTheme } = useTheme()
  // The COLOUR, not the class — see the note above the imports.
  const coverBg = { backgroundColor: genreCoverColor(genre?.cover, quizTheme) }

  // ── State ────────────────────────────────────────────────────────────────
  //
  // ONE `status` string, not two booleans. isStarted + isFinished has four
  // combinations and only three are legal — and the illegal one is exactly what
  // you hit after a retake. Illegal states should be unrepresentable.
  const [status, setStatus] = useState('idle')   // 'idle' | 'active' | 'done'

  // The questions FOR THIS RUN, shuffled once when it starts.
  const [questions, setQuestions] = useState([])

  const [index, setIndex] = useState(0)          // which question
  const [picked, setPicked] = useState(null)     // null = not yet answered
  const [score, setScore] = useState(0)

  // ⚠️ Hooks above the guard — see the reader for why order must never vary.
  const insets = useSafeAreaInsets()

  if (!story) {
    return (
      <TabScreen>
        <Text className="font-serif text-2xl text-stone-900 mb-2">Story not found</Text>
        <Button onPress={() => router.push('/reading')}>Back to Readings</Button>
      </TabScreen>
    )
  }

  /**
   * Build the run.
   *
   * ⚠️ SHUFFLED HERE, ONCE — never during render. Shuffling in render reorders
   * the options on EVERY re-render, so they jump under the finger reaching for
   * them. A run is immutable once it starts.
   */
  /**
   * ⚠️ THE ATTEMPT IS SPENT HERE, AT THE START, AND THAT IS THE POINT.
   *
   * Spending it on COMPLETION would make a failed run free: quit at question
   * four, start again, and the quota never moves. Spending it on start means a
   * wrong answer costs you the same as a right one — which is what makes the
   * questions worth reading the story for.
   *
   * Retakes are not blocked, they are PRICED: "Again" comes back through here
   * and spends the next attempt. When there are none left the wall renders
   * instead, so the third run in a day is the one that cannot happen.
   *
   * ⚠️ Fire-and-forget on purpose. consume() re-reads storage and writes; making
   * start() await it would leave the button dead for a frame, and the exhausted
   * case is already caught by the guard that renders the wall.
   */
  const start = () => {
    if (!isPro) quota.consume()
    setQuestions(story.questions.map((q) => ({ ...q, options: shuffle(q.options) })))
    setIndex(0)
    setPicked(null)
    setScore(0)
    setStatus('active')
  }

  const pick = (option) => {
    // Already answered — ignore. Without this, double-tapping scores twice.
    if (picked !== null) return
    setPicked(option)
    // Score incremented ONCE, here. Recounting at the end would need every
    // answer stored, and then two numbers could disagree. One source.
    if (option === q.answer) setScore((n) => n + 1)
  }

  const next = () => {
    if (index + 1 >= questions.length) {
      // ⚠️ FINISHING is what marks a story read — not opening it. Someone who
      // opened a story and bounced has not read it, and a library that claims
      // otherwise is lying to the one person it is keeping score for.
      //
      // Marked regardless of score: this records that you read it, not that you
      // passed. The score already lives on the results screen.
      markStepComplete(storyStepId(story.id))
      setStatus('done')

      // ⚠️ PERFECT SCORES ONLY. Confetti for 3/5 makes it wallpaper — it has to
      // cost something to mean anything, and the results screen already says
      // plainly that the story counted regardless of score.
      //
      // ⚠️ `score` IS CURRENT HERE, despite pick() having set it. Answering the
      // last question re-rendered the screen, so this closure was rebuilt with
      // the updated value before Next could be tapped. It would be stale only
      // if scoring and finishing happened in the same handler.
      //
      // The overlay's button is the way back to the library; its close button
      // dismisses without navigating, so a perfect scorer can still sit on
      // their 5/5.
      if (score === questions.length) {
        celebrate(story.title, () => router.push('/reading'))
      }
    } else {
      setIndex((i) => i + 1)
      setPicked(null)   // reset so the next question is unanswered
    }
  }

  // The frame every state renders into — see the reader for the reasoning.
  // Written once here so the three states cannot drift apart.
  //
  // ⚠️ THE + 14 IS A DELIBERATE GAP, not a rounding error. The reader is flush
  // against the global header on purpose: it is immersive, and a story should
  // start at the very top of the page. The quiz is not immersive — it is a
  // sequence of things to do — and starting it hard against the header made the
  // genre block read as part of the app chrome rather than as the head of the
  // quiz. 14px of page ground above it separates the two.
  //
  // It lives in `frame`, so idle, active and done all get it and none of them
  // can be adjusted alone.
  const frame = {
    flex: 1,
    paddingTop: HEADER_CONTENT_HEIGHT + insets.top + 14,
    paddingBottom: TAB_BAR_HEIGHT + insets.bottom,
  }

  // ── idle ─────────────────────────────────────────────────────────────────
  //
  // A title page for the quiz, matching the one the reader opens with. Landing
  // on a bare "Start" button gave no sense of what was about to be asked or how
  // long it would take.
  if (status === 'idle') {
    return (
      <View style={frame}>
        <View className="flex-1 bg-cream-50 rounded-t-2xl overflow-hidden">

          <View className="px-6 pt-7 pb-6" style={coverBg}>
            <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-cream-50 mb-2.5">
              {genre?.title || 'Story'}
            </Text>

            <Text className="font-serif text-3xl text-cream-50 leading-tight">
              {story.title}
            </Text>

            <Text className="text-[15px] font-medium text-cream-50 mt-1.5">
              Comprehension
            </Text>
          </View>

          <View className="flex-1 px-6 pt-8">

            <Text className="font-serif text-2xl text-stone-900 mb-2">
              {story.questions.length} questions
            </Text>

            <Text className="text-base font-medium text-stone-700 leading-relaxed">
              About what you just read. You will see the answer and where it came
              from after each one, so a wrong guess still teaches you something.
            </Text>

            {/* Nothing is at stake, and saying so matters: a learner who thinks
                a score is permanent reads the quiz as a test and stops guessing,
                which is where most of the learning happens. */}
            <View className="flex-row items-start gap-2.5 mt-6">
              <Icon name="check" size={16} tone="accent" />
              <Text className="text-sm font-medium text-stone-600 flex-1 leading-relaxed">
                Finishing marks the story read, whatever you score — but an
                attempt counts whether you pass or not, so read first.
              </Text>
            </View>
          </View>

          <ActionBar>
            <Button size="lg" className="flex-1" onPress={start}>Start</Button>
          </ActionBar>

        </View>
      </View>
    )
  }

  // ⚠️ ONLY WHEN IDLE. The attempt is spent at start, so an active run would
  // otherwise hit this wall the instant it began — throwing the learner out of
  // the quiz they just paid for.
  if (status === 'idle' && !isPro && quota.ready && quota.exhausted) {
    return (
      <View style={frame}>
        <View className="flex-1 bg-cream-50 rounded-t-2xl overflow-hidden px-6">
          <QuotaWall />
        </View>
      </View>
    )
  }

  // ── done ─────────────────────────────────────────────────────────────────
  if (status === 'done') {
    const all = score === questions.length

    // A band, not a bare number. "3/5" is data; this says what to do next —
    // and a comprehension quiz someone struggled with should point back at the
    // story, not just at a score.
    const verdict = all
      ? 'You followed the whole story.'
      : score >= questions.length / 2
        ? 'Close — worth another read.'
        : 'Try reading it again with the English revealed.'

    return (
      <View style={frame}>
        <View className="flex-1 bg-cream-50 rounded-t-2xl overflow-hidden">

          {/* The score fills the genre block, the way the story's title did.
              It was a small fraction on a white card, which read like a receipt
              rather than the end of something. */}
          <View className="px-6 pt-10 pb-9 items-center" style={coverBg}>

            <Text className="text-[11px] font-semibold uppercase tracking-[1.2px] text-cream-50 mb-3">
              {story.title}
            </Text>

            <View className="flex-row items-baseline">
              <Text className="font-serif text-[64px] leading-none text-cream-50">{score}</Text>
              <Text className="font-serif text-[28px] leading-none text-cream-50/80"> / {questions.length}</Text>
            </View>

            <Text className="text-[15px] font-medium text-cream-50 text-center mt-4">
              {verdict}
            </Text>
          </View>

          <View className="flex-1 px-6 pt-7">

            {/* Marking the story read is the quiz's real side effect, and it
                happened silently. Someone who scores 1/5 should still see that
                the shelf now counts this story. */}
            <View className="flex-row items-start gap-2.5">
              <Icon name="check" size={16} tone="accent" />
              <Text className="text-sm font-medium text-stone-600 flex-1 leading-relaxed">
                Marked as read on your library shelf.
              </Text>
            </View>

            {/* ⚠️ HERE, NOT IN THE ACTION BAR. That bar holds two size-lg
                buttons; a third splits a 360px screen into ~100px each and the
                labels wrap — the arithmetic that broke the reader's toolbar.
                It also belongs with the sentence above it: that line says the
                shelf now counts this story, and this is how you go and look.

                Full width and ghost, so it reads as the quiet exit rather than
                competing with "Again". */}
            <Button
              variant="ghost"
              icon="arrowLeft"
              className="w-full mt-5"
              onPress={() => router.push('/reading')}
            >
              All readings
            </Button>
          </View>

          <ActionBar>
            <Button
              variant="ghost"
              size="lg"
              className="flex-1"
              onPress={() => router.push(`/reading/story/${story.id}`)}
            >
              The story
            </Button>
            {/* Gone when there is nothing left to spend — a button that opens a
                wall is worse than a button that is not there. */}
            {(isPro || !quota.ready || !quota.exhausted) && (
              <Button size="lg" className="flex-1" onPress={start}>Again</Button>
            )}
          </ActionBar>

        </View>
      </View>
    )
  }

  // ── active ───────────────────────────────────────────────────────────────
  // Declared after the two early returns, so by here `questions` is guaranteed
  // non-empty and `index` is guaranteed in range.
  const q = questions[index]
  const answered = picked !== null

  // Fills as you ANSWER, not as you advance — otherwise the bar sits at 0 while
  // you work through the first question and jumps a whole step on Next.
  const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100

  return (
    <View style={frame}>
      <View className="flex-1 bg-cream-50 rounded-t-2xl overflow-hidden">

        {/* ── Fixed head: where you are, and the way out ─────────────────── */}
        <View className="flex-row items-center gap-3 px-4 pt-3 pb-3">

          <Pressable
            onPress={() => router.push(`/reading/story/${story.id}`)}
            hitSlop={8}
            className="rounded-md bg-cream-100 px-3 py-2.5 active:bg-cream-200"
          >
            <Icon name="arrowLeft" size={16} tone="muted" />
          </Pressable>

          <Text className="text-sm font-semibold text-stone-800 flex-1">
            Question {index + 1} of {questions.length}
          </Text>

          {/* The running score, which was invisible until the end. Seeing it
              climb is most of why a quiz feels like progress. */}
          <Text className="text-sm font-bold text-stone-500">{score}</Text>
        </View>

        {/* The same 3px rail the reader uses for reading progress. No animation
            here: it steps once per question, so there is nothing to smooth. */}
        <View className="h-[3px] bg-cream-200">
          <View className="h-full" style={{ ...coverBg, width: `${progress}%` }} />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >

          {/* The prompt is the biggest thing on the screen, set in the serif
              like every other piece of writing in this module. It was 20px
              inside a card, which made it look like one more option. */}
          <Text className="font-serif text-[26px] text-stone-900 leading-[34px] mb-7">
            {q.prompt}
          </Text>

          <View className="gap-2.5">
            {q.options.map((option) => {
              // Three visual states: unanswered, the right answer, a wrong pick.
              const isAnswer = option === q.answer
              const isPicked = option === picked

              // ⚠️ cream-100, not cream-50. The page is cream-50 now, so the old
              // white-card-on-blue treatment left the options invisible against
              // their own background.
              let skin = 'bg-cream-100 active:bg-cream-200'
              let ink = 'text-stone-900'
              if (answered && isAnswer) skin = 'bg-lime-200'          // always show the truth
              else if (answered && isPicked) skin = 'bg-red-200'      // and what they chose
              else if (answered) { skin = 'bg-cream-100'; ink = 'text-stone-400' }  // dim the rest

              return (
                <Pressable
                  key={option}
                  onPress={() => pick(option)}
                  disabled={answered}
                  className={`rounded-md flex-row items-center gap-3 px-4 py-4 ${skin}`}
                >
                  <Text className={`text-base font-medium flex-1 ${ink}`}>{option}</Text>

                  {/* A mark, not just a colour. Colour alone fails for the ~8%
                      of men with red-green colour blindness — for whom lime-200
                      and red-200 are close to the same swatch. */}
                  {answered && isAnswer && <Icon name="check" size={18} tone="accent" />}
                  {answered && isPicked && !isAnswer && (
                    <Text className="text-lg font-bold text-stone-600">×</Text>
                  )}
                </Pressable>
              )
            })}
          </View>

          {/* Feedback only after answering. `because` is the part that teaches —
              the score says you were wrong, this says where to look. */}
          {answered && (
            <View className="mt-6 border-l-2 border-clay-600/40 pl-4">
              <Text className="text-base font-bold text-stone-900 mb-1">
                {picked === q.answer ? 'Correct' : 'Not quite'}
              </Text>
              {!!q.because && (
                <Text className="text-sm font-medium text-stone-700 leading-relaxed">
                  {q.because}
                </Text>
              )}
            </View>
          )}

        </ScrollView>

        {/* ── Fixed foot ──────────────────────────────────────────────────
            Present from the first render, disabled until an answer is picked.
            It used to appear only after answering, at the bottom of a growing
            page — so on a short screen the button you needed was below the
            fold and answering looked like it had done nothing. */}
        <ActionBar>
          <Button size="lg" className="flex-1" disabled={!answered} onPress={next}>
            {index + 1 >= questions.length ? 'Finish' : 'Next question'}
          </Button>
        </ActionBar>

      </View>
    </View>
  )
}

/**
 * The pinned strip at the foot of every state.
 *
 * Extracted so the three states cannot end up with different padding — the
 * button must sit in exactly the same place when the screen changes under it,
 * or the eye has to re-find it each time.
 */
function ActionBar({ children }) {
  return (
    <View className="flex-row items-center gap-2.5 bg-cream-100 px-4 py-3">
      {children}
    </View>
  )
}
