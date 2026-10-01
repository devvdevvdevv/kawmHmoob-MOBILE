import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getQuizConfig, getQuizDataset, orientDataset } from '../../data/quizzes.js'
import { useQuizPrefs, applyStatusFilter, resolveCount } from '../../lib/quizPrefs.js'
// import QuizSettingsSheet from './QuizSettingsSheet.jsx'  ← restore with the ⚙ below
import { quizUnlock } from '../../lib/access.js'
import { isAdmin } from '../../lib/admin.js'
import { useQuizState } from '../../hooks/useQuizState.js'
import { useProgress } from '../../hooks/useProgress.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import PaywallGate from '../common/PaywallGate.jsx'
import ConfirmModal from '../common/ConfirmModal.jsx'
import QuizResults from './QuizResults.jsx'
import Button from '../ui/Button.jsx'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// Quote

import { useDailyQuota } from '../../hooks/useDailyQuota.js'
import { quotaLimit } from '../../lib/quotaLimits.js'
import QuotaBadge from '../../components/common/QuotaBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import QuotaWall from '../../components/common/QuotaWall.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'



// Quota Tracker



function shuffle(arr) {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestions(config, dataset, prefs = {}) {
  if (!dataset || dataset.length === 0) return []
  // QUESTION-TYPE OVERRIDE — commented out 2026-08-29 with its control in
  // QuizSettingsSheet. Restore the two together.
  //
  // ⚠️ It matters that this went with the control rather than the control alone:
  // the preference is PERSISTED, so anyone who had already picked "Matching only"
  // would have been stuck with an untested mode and no visible way back. Ignoring
  // the stored value returns every quiz to its own declared types.
  //
  // const types =
  //   prefs.questionType && prefs.questionType !== 'quiz-default'
  //     ? [prefs.questionType]
  //     : config.questionTypes || ['multiple-choice']
  const types = config.questionTypes || ['multiple-choice']
  const count = resolveCount(prefs.questionCount, dataset.length)
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
    // Distractors are DISTINCT wrong answers. Deduping matters when many items
    // share an answer (e.g. tone-drill: dozens of words map to the same 8 tones) —
    // without it the options could show the same tone twice ("Low / Low / High"),
    // which looks broken. options are answer STRINGS, guaranteed unique + include
    // the correct one exactly once.
    //
    // `alsoCorrect` covers the case the plain `!== item.answer` check missed: two
    // items can share a PROMPT, which makes both their answers right. English
    // "because" maps to both "vim" and "vim hais tias", so asking it in reverse
    // could offer two correct options and mark one wrong. Rare (8 glosses in 476)
    // but silently unfair when it happens, and only a real risk once a quiz can
    // be reversed.
    const alsoCorrect = new Set(
      dataset.filter((d) => d.prompt === item.prompt).map((d) => d.answer)
    )
    const distinctWrong = [...new Set(dataset.map((d) => d.answer))].filter(
      (a) => !alsoCorrect.has(a)
    )
    const distractors = shuffle(distinctWrong).slice(0, 3)
    const options = shuffle([item.answer, ...distractors])
    // ⚠️ AUDIO — 2026-09-25. Every dataset adapter already passes `audio` (the
    // word's clip, or a letter's/tone's), and this used to drop it, so the
    // prompt's speaker button was always disabled. Carried through now.
    //
    // The clip is always the HMONG side. When the quiz is flipped to
    // English → Hmong, the Hmong is the ANSWER, so playing it first would read
    // the answer aloud: `audioRevealsAnswer` holds the button until the learner
    // has picked. Same test orientDataset uses to decide whether it flipped.
    const flipped = prefs.direction === 'english-hmong' && Boolean(config.reversible)
    return {
      type: 'multiple-choice',
      prompt: item.prompt,
      answer: item.answer,
      options,
      audio: item.audio || null,
      audioKey: item.id || item.prompt,
      audioRevealsAnswer: flipped,
    }
    // Was: return { type: 'multiple-choice', prompt: item.prompt, answer: item.answer, options }
  })
}

export default function QuizEngine() {
  const { topicId } = useLocalSearchParams()
  const router = useRouter()
  const config = getQuizConfig(topicId)
  // Settings from the ⚙ sheet. `prefsReady` is load-bearing: the read is async,
  // and the auto-start effect below would otherwise build questions from the
  // DEFAULTS before the stored preferences arrived — the settings would appear
  // to do nothing on the first quiz after launch.
  const { prefs, ready: prefsReady } = useQuizPrefs()  // setPref: restore with the ⚙
  // const [showSettings, setShowSettings] = useState(false)  ← restore with the ⚙
  const { state, start, answer, next, review, reset } = useQuizState()
  const { recordQuizScore, vocabProgress } = useProgress()

  // Vocab quiz ids are `vocab-<categoryId>`, and their dataset items carry the
  // word's own id — so a word's Learning/Known status is reachable. Other quizzes
  // have no per-item status, so they pass null and the filter is a no-op.
  const statusOf = useMemo(() => {
    if (!String(topicId ?? '').startsWith('vocab-')) return null
    return (item) => vocabProgress[item.id] || 'new'
  }, [topicId, vocabProgress])

  // ORDER MATTERS: filter on the ORIGINAL orientation, because the status lookup
  // keys off the item, not off which side is showing; then flip. Doing it the
  // other way round works today only because orientDataset preserves `id`.
  const { dataset, filterFellBack } = useMemo(() => {
    const raw = getQuizDataset(topicId)
    const { dataset: filtered, fellBack } = applyStatusFilter(raw, prefs.statusFilter, statusOf)
    return {
      dataset: orientDataset(filtered, prefs.direction, config),
      filterFellBack: fellBack,
    }
  }, [topicId, prefs.statusFilter, prefs.direction, config, statusOf])

  // ⚠️ CURRENTLY UNUSED — its only consumer was the in-quiz ⚙, commented out
  // below. Kept because it is the logic, not the widget: these are the reasons a
  // setting silently does nothing on THIS quiz, and they come back the moment any
  // sheet is shown from here again. (The category-page sheet passes its own
  // notes; it cannot compute these, because it does not know the quiz.)
  //
  // Told to the learner next to the control that didn't do what they expected,
  // rather than as a toast they'd miss.
  const settingNotes = []
  if (prefs.direction === 'english-hmong' && !config?.reversible) {
    settingNotes.push('This quiz can only be asked one way, so Direction is ignored here.')
  }
  if (filterFellBack) {
    settingNotes.push(
      'No words match that filter yet, so this quiz is using all of them. Mark some words Learning or Known first.'
    )
  }
  if (prefs.statusFilter !== 'all' && !statusOf) {
    settingNotes.push('Only vocabulary quizzes can filter by word status.')
  }
  const unlock = quizUnlock(topicId, vocabProgress)
// Daily Quota Tracking

  const {user} = useAuth()

  const {isPro} = useSubscription()

  // ⚠️ ADMINS PASS A PATH QUIZ'S PAYWALL — 2026-09-25, for debugging ("admin has
  // access to the paths at all times"). Path quizzes ONLY (id `path-<unit>`): every
  // other Pro quiz still gates admins like anyone else. Was: tier={config.tier}.
  const gateTier = isAdmin(user) && String(topicId ?? '').startsWith('path-') ? 'free' : config?.tier








  const [feedback, setFeedback] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [savedThisRun, setSavedThisRun] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)

  const questions = useMemo(
    () => (config ? buildQuestions(config, dataset, prefs) : []),
    [config, dataset, prefs]
  )

  const locked = unlock.gated && !unlock.unlocked

  // EVERY EXIT LEADS TO VOCABULARY. The quiz menu at /quiz is retired (the
  // Vocabulary page absorbed it — see app/quiz/index.jsx), so there is no
  // "back to Quizzes" to go back to. A vocab quiz returns to its own category
  // deck — the words it just tested, which is where you go to fix a bad score —
  // and everything else returns to the Vocabulary index.
  const quizId = String(topicId ?? '')
  const isVocabQuiz = quizId.startsWith('vocab-')
  // A beginner-path unit quiz (src/data/path.js) returns to its UNIT, not to
  // Vocabulary — the unit screen is where its other four steps are.
  const pathUnitId = quizId.startsWith('path-') ? quizId.slice('path-'.length) : null
  const backTo = pathUnitId
    ? `/path/${pathUnitId}`
    : isVocabQuiz ? `/vocabulary/${quizId.slice('vocab-'.length)}` : '/vocabulary'
  const backLabel = pathUnitId ? 'Back to the unit' : isVocabQuiz ? 'Back to the words' : 'Back to Vocabulary'
  const crumbs = pathUnitId
    ? [
        { label: 'Home', to: '/' },
        { label: 'Paths', to: '/path' },
        { label: config?.title || 'Unit', to: backTo },
        { label: 'Quiz' },
      ]
    : [
        { label: 'Home', to: '/' },
        { label: 'Vocabulary', to: '/vocabulary' },
        ...(isVocabQuiz && unlock.category ? [{ label: unlock.category.title, to: backTo }] : []),
        { label: config?.title || 'Quiz' },
      ]

  // ⚠️ A PATH QUIZ DOES NOT SPEND THE DAILY ALLOWANCE. The allowance meters the
  // open library; the path is gated by its own rules (free units, then Pro), and
  // a free unit that burned the day's two quizzes would stall the free course
  // partway through its own lesson. PaywallGate still applies, via config.tier.
  const quota = useDailyQuota('quiz', quotaLimit('quiz', user.isGuest), { enabled: !isPro && !pathUnitId, scope: user?.id || 'guest' })

  useEffect(() => {
    if (config && !locked && prefsReady && questions.length > 0 && state.status === 'idle' && !quota.exhausted && quota.ready){
      
      start(questions)
      quota.consume()
    }
  }, [config, locked, prefsReady, questions, start, state.status, quota.ready, quota.exhausted])

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
        <Button onPress={() => router.push(backTo)} className="mt-4">{backLabel}</Button>
      </View>
    )
  }

  if (dataset.length === 0) {
    return (
      <View>
        <Text className="text-stone-900">No data available for this quiz yet.</Text>
        <Button onPress={() => router.push(backTo)} className="mt-4">{backLabel}</Button>
      </View>
    )
  }

  // Study-before-quiz gate. The Vocabulary page already swaps a locked quiz's
  // row for a "study N more" line, but THIS guard is what actually enforces it —
  // a direct link to /quiz/vocab-<cat> would otherwise walk straight past it.
  if (locked) {
    const pct = unlock.needed > 0 ? Math.min(100, (unlock.studied / unlock.needed) * 100) : 0
    return (
      <View className="items-center">
        <Breadcrumbs
          items={crumbs}
        />
        <View className="w-full max-w-md items-center rounded-md bg-cream-50 p-8">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-cream-100 mb-4">
            <Text className="text-2xl">🔒</Text>
          </View>
          <Text className="font-serif text-3xl text-stone-900 text-center mb-3">
            Study the words first
          </Text>
          <Text className="text-stone-700 text-center leading-relaxed mb-4">
            Testing words you haven't seen is guessing, not practice. Learn the{' '}
            {unlock.category.title} words, then come back to test yourself.
          </Text>

          {/* Progress toward unlock — a bar makes "how close am I" instant. */}
          <View className="w-full max-w-xs mb-6">
            <View className="h-2 rounded-full bg-cream-200 overflow-hidden">
              <View className="h-full rounded-full bg-clay-600" style={{ width: `${pct}%` }} />
            </View>
            <Text className="text-sm font-medium text-stone-600 text-center mt-2">
              {unlock.studied} of {unlock.needed} studied · {unlock.remaining} to go
            </Text>
          </View>

          <Button onPress={() => router.push(`/vocabulary/${unlock.category.id}`)}>
            📖 Study the {unlock.category.title} words
          </Button>
          <Pressable onPress={() => router.push('/vocabulary')} className="mt-4">
            <Text className="text-sm font-medium text-stone-600 underline">Back to Vocabulary</Text>
          </Pressable>
        </View>
      </View>
    )
  }

  if (quota.exhausted){
    return(
      <QuotaWall />
    );

  }

  const confirmQuit = () => {
    setShowQuitConfirm(false)
    reset()
    router.push(backTo)
  }

  if (state.status === 'finished' || state.status === 'reviewing') {
    return (
      <PaywallGate tier={gateTier} contentLabel={`${config.title} is a Pro quiz`}>
        <Breadcrumbs
          items={crumbs}
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
          onBack={() => router.push(backTo)}
          backLabel={backLabel}
        />
      </PaywallGate>
    )
  }

  const q = state.questions[state.currentIndex]
  if (!q) return null

  return (
    <PaywallGate tier={gateTier} contentLabel={`${config.title} is a Pro quiz`}>
      <View>
        <Breadcrumbs
          items={crumbs}
        />

        <View className="flex-row flex-wrap justify-between items-center mb-5 gap-2">
          <Text className="text-sm font-medium text-stone-700">
            Question {state.currentIndex + 1} / {state.questions.length}
          </Text>
          <View className="flex-row items-center gap-2">
            <Pill bg="bg-cream-200" textColor="text-clay-700">⏱ {elapsed}s</Pill>
            <Pill bg="bg-orange-200" textColor="text-orange-900">🔥 {state.streak}</Pill>
            <Pill bg="bg-cream-100" textColor="text-stone-800">★ {state.score}</Pill>
            {/* ⚙ REMOVED FROM THE RUNNING QUIZ — commented out 2026-08-29.
                It was wedged among the ⏱/🔥/★ chips, which wrap on a phone, so it
                was effectively invisible; and by the time a quiz is running its
                questions are already built, so nothing it changes applies to the
                run you are looking at. The gear that matters lives on the
                vocabulary category page, above the quiz button.

                To restore, this AND the sheet below need to come back — plus
                `showSettings` state and the QuizSettingsSheet import at the top.
            <Pressable
              onPress={() => setShowSettings(true)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Quiz settings"
              className="h-8 w-8 items-center justify-center rounded-full bg-cream-200"
            >
              <Text className="text-base">⚙️</Text>
            </Pressable> */}
          </View>
        </View>

        {/* Commented out with the gear above.
        <QuizSettingsSheet
          visible={showSettings}
          onClose={() => setShowSettings(false)}
          prefs={prefs}
          setPref={setPref}
          notes={[
            ...settingNotes,
            'Changes take effect on your next quiz — this run keeps the questions it started with.',
          ]}
        /> */}

        <View className="rounded-md bg-cream-50 p-6">
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
          <Button variant="secondary" onPress={() => setShowQuitConfirm(true)}>QUIT QUIZ</Button>
        </View>

        <ConfirmModal
          visible={showQuitConfirm}
          title="Quit this quiz?"
          message="Progress for this attempt will be lost."
          confirmLabel="Quit"
          cancelLabel="Keep going"
          destructive
          onConfirm={confirmQuit}
          onCancel={() => setShowQuitConfirm(false)}
        />
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
        {/* Was: audioSrc={null} — always disabled. Now the question's own clip;
            a word with no recording still shows the greyed button, as before.
            Held until answered when the clip would give the answer away. */}
        <AudioButton
          audioSrc={question.audio}
          wordId={question.audioKey || question.prompt}
          disabled={question.audioRevealsAnswer && !feedback}
          size="lg"
        />
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
      <Text className="text-sm font-medium text-stone-600 mb-4 italic">
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
