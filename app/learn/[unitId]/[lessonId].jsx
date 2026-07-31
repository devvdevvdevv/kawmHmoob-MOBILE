import { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { getLesson, getUnit, allStepIds } from '../../../src/data/lessons.js'
import { getCategory } from '../../../src/data/vocabulary.js'
import { getWordFamily } from '../../../src/data/wordFamilies.js'
import { useProgress } from '../../../src/hooks/useProgress.js'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import PaywallGate from '../../../src/components/common/PaywallGate.jsx'
import AudioButton from '../../../src/components/common/AudioButton.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import TabScreen from '../../../src/components/TabScreen.jsx'

// Lesson player. Ported from the web Lesson.jsx — handles every step kind the
// curriculum uses: intro, examples, practice, letters, tones, reading,
// speak-drill, quiz (the study→quiz flow), and mini-quiz.
export default function Lesson() {
  const { unitId, lessonId } = useLocalSearchParams()
  const router = useRouter()
  const unit = getUnit(unitId)
  const lesson = getLesson(unitId, lessonId)
  const { completedSteps, quizScores, markStepComplete } = useProgress()
  const [index, setIndex] = useState(0)

  // Auto-mark a quiz step complete once a score for its quiz exists — even if
  // the user took the quiz on its own page and never clicked "Finish".
  //   - 'mini-quiz' points at an explicit step.quizId
  //   - 'quiz' (the study→quiz flow) derives it from the lesson's vocab category
  useEffect(() => {
    if (!lesson) return
    lesson.steps.forEach((step) => {
      let quizId = null
      if (step.kind === 'mini-quiz') quizId = step.quizId
      else if (step.kind === 'quiz' && lesson.vocab) quizId = `vocab-${lesson.vocab}`
      if (!quizId || completedSteps.includes(step.id)) return
      const taken = quizScores.some((s) => s.quizId === quizId)
      if (taken) {
        const ids = allStepIds(lesson)
        const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
        markStepComplete(step.id, { lessonId: lesson.id, lessonComplete: remaining.length === 0 })
      }
    })
  }, [lesson, completedSteps, quizScores, markStepComplete])

  if (!unit || !lesson) {
    return (
      <TabScreen>
        <Text className="text-stone-900 mb-4">Lesson not found.</Text>
        <Button onPress={() => router.push('/learn')}>Back to Learn</Button>
      </TabScreen>
    )
  }

  const step = lesson.steps[index]
  const isLast = index === lesson.steps.length - 1
  const requiredTier = lesson.tier || unit.tier || 'free'

  const handleAdvance = () => {
    if (!completedSteps.includes(step.id)) {
      const ids = allStepIds(lesson)
      const remaining = ids.filter((id) => id !== step.id && !completedSteps.includes(id))
      markStepComplete(step.id, { lessonId: lesson.id, lessonComplete: remaining.length === 0 })
    }
    if (isLast) router.push('/learn')
    else setIndex((i) => i + 1)
  }

  // These kinds own their own advance/actions, so the shared Back/Continue bar
  // is hidden for them.
  const selfDriven = step.kind === 'practice' || step.kind === 'mini-quiz' || step.kind === 'quiz'

  return (
    <PaywallGate tier={requiredTier} contentLabel={`${lesson.title} is Pro`}>
      <TabScreen>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Learn', to: '/learn' },
            { label: unit.title, to: `/learn/${unit.id}` },
            { label: lesson.title },
          ]}
        />
        <StepHeader lesson={lesson} index={index} />

        <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
          {step.kind === 'intro' && <IntroStep step={step} />}
          {step.kind === 'examples' && <ExamplesStep step={step} lesson={lesson} />}
          {step.kind === 'letters' && <LettersStep step={step} />}
          {step.kind === 'tones' && <TonesStep step={step} />}
          {step.kind === 'reading' && <ReadingStep step={step} />}
          {step.kind === 'speak-drill' && <SpeakDrillStep step={step} />}
          {step.kind === 'practice' && <PracticeStep step={step} onAdvance={handleAdvance} />}
          {step.kind === 'quiz' && <QuizStep lesson={lesson} unitId={unitId} />}
          {step.kind === 'mini-quiz' && (
            <MiniQuizStep step={step} taken={quizScores.some((s) => s.quizId === step.quizId)} />
          )}
        </View>

        {!selfDriven && (
          <View className="mt-6 flex-row justify-between items-center">
            <Button variant="secondary" onPress={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
              ← Back
            </Button>
            <Button onPress={handleAdvance}>{isLast ? 'Finish' : 'Continue'}</Button>
          </View>
        )}
      </TabScreen>
    </PaywallGate>
  )
}

function StepHeader({ lesson, index }) {
  const total = lesson.steps.length
  const pct = Math.round(((index + 1) / total) * 100)
  return (
    <View className="mb-6">
      <Text className="font-serif text-3xl text-stone-900 mb-1">{lesson.title}</Text>
      <Text className="text-sm text-stone-600 mb-3">Step {index + 1} of {total}</Text>
      <View className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
        <View className="h-full bg-clay-600" style={{ width: `${pct}%` }} />
      </View>
    </View>
  )
}

// Intro body: an array of paragraphs, with two opt-in prefixes that give the
// long explainers real structure (mirrors the web IntroStep):
//   '## Heading' → a subheading
//   '> line'     → an indented example line (a Hmong form + its gloss)
// Both are backwards compatible — no plain paragraph starts with either, so
// every other intro renders as a normal leading-relaxed paragraph.
function IntroStep({ step }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-4">{step.title}</Text>
      <View className="gap-4">
        {step.body.map((p, i) => {
          if (typeof p !== 'string') return null // tolerate holes in the array

          // '## ' → subheading
          if (p.startsWith('## ')) {
            return (
              <Text key={i} className={`font-serif text-xl text-stone-900 ${i === 0 ? '' : 'mt-2'}`}>
                {p.slice(3)}
              </Text>
            )
          }

          // '> ' → indented example line, set off with a clay left rule
          if (p.startsWith('> ')) {
            return (
              <View key={i} className="border-l-2 border-clay-600/40 pl-4">
                <Text className="text-clay-700 font-medium leading-relaxed">{p.slice(2)}</Text>
              </View>
            )
          }

          // plain paragraph
          return (
            <Text key={i} className="text-stone-800 leading-relaxed">{p}</Text>
          )
        })}
      </View>
    </View>
  )
}

// Vocabulary lessons carry `english`; consonant lessons carry `hmongExample`.
// Each row plays its own audio. When the lesson maps to a word set, ends on a
// StudyHandoff that unlocks the quiz step.
function ExamplesStep({ step, lesson }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-2">{step.title}</Text>
      {step.intro && <Text className="text-sm text-stone-600 mb-4 italic">{step.intro}</Text>}
      {step.items.map((it, i) => (
        <View key={`${step.id}-${i}`} className={`py-3 ${i > 0 ? 'border-t border-cream-200' : ''}`}>
          <View className="flex-row justify-between items-center gap-3">
            <Text className="font-semibold text-clay-700 text-lg flex-1">{it.hmong}</Text>
            <Text className="text-sm text-stone-700">{it.english || it.hmongExample}</Text>
            <AudioButton audioSrc={it.audio} wordId={`${step.id}-${i}`} />
          </View>
          {(it.note || it.englishSound) && (
            <Text className="text-xs text-stone-500 mt-1 italic">{it.note || it.englishSound}</Text>
          )}
        </View>
      ))}
      {lesson?.vocab && <StudyHandoff lesson={lesson} />}
    </View>
  )
}

// Letters (consonants/vowels) inside a lesson — the same grid the Reference
// alphabet uses.
function LettersStep({ step }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-2">{step.title}</Text>
      {step.intro && <Text className="text-sm text-stone-600 mb-4 italic">{step.intro}</Text>}
      <LetterGrid items={step.items} />
    </View>
  )
}

function TonesStep({ step }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-2">{step.title}</Text>
      {step.intro && <Text className="text-sm text-stone-600 mb-4 italic">{step.intro}</Text>}
      <ToneRows items={step.items} />
    </View>
  )
}

// A reading passage. The translation starts HIDDEN — if English is visible the
// eye reads it first and the Hmong becomes decoration. The glossary stays
// visible (a crutch for words, not for meaning).
function ReadingStep({ step }) {
  const [showEnglish, setShowEnglish] = useState(false)
  return (
    <View>
      <View className="flex-row flex-wrap items-baseline justify-between gap-2 mb-2">
        <Text className="font-serif text-2xl text-stone-900">{step.title}</Text>
        {step.level && (
          <View className="rounded-full bg-cream-200 px-2.5 py-1">
            <Text className="text-[10px] uppercase tracking-[1px] font-semibold text-stone-700">{step.level}</Text>
          </View>
        )}
      </View>
      {step.intro && <Text className="text-sm text-stone-600 mb-5 italic">{step.intro}</Text>}

      <Text className="font-serif text-2xl text-clay-700 leading-relaxed mb-5">{step.hmong}</Text>

      {showEnglish ? (
        <View className="rounded-lg bg-cream-100 border border-cream-200 p-4 mb-6">
          <Text className="text-xs uppercase tracking-[1px] text-stone-600 mb-1.5">Translation</Text>
          <Text className="text-stone-800 leading-relaxed">{step.english}</Text>
        </View>
      ) : (
        <View className="mb-6">
          <Button variant="ghost" onPress={() => setShowEnglish(true)}>Reveal translation</Button>
        </View>
      )}

      {step.glossary?.length > 0 && (
        <View>
          <Text className="text-xs uppercase tracking-[1px] text-stone-600 mb-2">Words in this passage</Text>
          {step.glossary.map((g) => (
            <View key={g.hmong} className="flex-row justify-between gap-3 py-1.5 border-b border-cream-200">
              <Text className="text-sm font-medium text-clay-700">{g.hmong}</Text>
              <Text className="text-sm text-stone-600 text-right">{g.english}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

// Hands the lesson off to a Speak drill — say the sounds you just learned.
function SpeakDrillStep({ step }) {
  const family = getWordFamily(step.familyId)
  if (!family) {
    return (
      <Text className="text-stone-700">
        This drill isn't set up yet. Head back to{' '}
        <Link href="/learn" className="text-clay-700 underline">Learn</Link>.
      </Text>
    )
  }
  return (
    <View className="items-center py-4">
      <View className="h-12 w-12 rounded-full bg-cream-100 items-center justify-center mb-4">
        <Text className="text-xl">🎤</Text>
      </View>
      <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">{step.title}</Text>
      <Text className="text-stone-700 mb-6 text-center leading-relaxed">
        {step.blurb || `Now say them out loud. ${family.words.length} sounds to practice.`}
      </Text>
      <Link href={`/speak/family/${family.id}`} asChild>
        <Button>Practice speaking →</Button>
      </Link>
    </View>
  )
}

// The lesson's final step: the quiz for its words — LOCKED until the learner
// has studied (the flag set by StudyHandoff on the examples step).
function QuizStep({ lesson, unitId }) {
  const { completedSteps, quizScores } = useProgress()
  const category = getCategory(lesson.vocab)
  const goStudy = useStudyHandoff(lesson)

  if (!category) {
    return (
      <Text className="text-stone-700">
        This lesson doesn't have a word set yet. Head back to{' '}
        <Link href="/learn" className="text-clay-700 underline">Learn</Link>.
      </Text>
    )
  }

  const studied = completedSteps.includes(studiedFlag(lesson))
  const quizId = `vocab-${category.id}`
  const best = quizScores.filter((s) => s.quizId === quizId).reduce((m, s) => Math.max(m, s.accuracy), -1)
  const taken = best >= 0

  if (!studied) {
    return (
      <View className="items-center py-4">
        <View className="h-12 w-12 rounded-full bg-cream-100 items-center justify-center mb-4">
          <Text className="text-xl">🔒</Text>
        </View>
        <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">Study the words first</Text>
        <Text className="text-stone-700 mb-6 text-center leading-relaxed">
          The quiz unlocks once you've studied the {category.words.length} words in {category.title}.
        </Text>
        <Button onPress={goStudy}>Study the words →</Button>
      </View>
    )
  }

  return (
    <View className="items-center py-4">
      <View className="h-12 w-12 rounded-full bg-cream-100 items-center justify-center mb-4">
        <Text className="text-xl">✓</Text>
      </View>
      <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">
        {taken ? 'Quiz unlocked' : 'Ready when you are'}
      </Text>
      <Text className="text-stone-700 mb-6 text-center leading-relaxed">
        {Math.min(10, category.words.length)} questions drawn from the {category.title} words you studied.
        {taken ? ` Your best so far: ${best}%.` : ''}
      </Text>
      <View className="flex-row flex-wrap gap-3 justify-center">
        <Link href={`/quiz/${quizId}`} asChild>
          <Button>{taken ? 'Retake quiz' : 'Take the quiz'} →</Button>
        </Link>
        {taken && (
          <Link href={`/learn/${unitId}`} asChild>
            <Button variant="ghost">Finish lesson</Button>
          </Link>
        )}
      </View>
    </View>
  )
}

function PracticeStep({ step, onAdvance }) {
  const [picked, setPicked] = useState(null)
  const correct = picked === step.answer

  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-4">{step.title}</Text>
      <Text className="text-stone-800 mb-5">{step.prompt}</Text>
      <View className="gap-2">
        {step.options.map((opt) => {
          const isAnswer = opt === step.answer
          let cls = 'border-cream-300 bg-cream-50'
          if (picked && isAnswer) cls = 'border-emerald-500 bg-emerald-50'
          if (picked && opt === picked && !isAnswer) cls = 'border-red-500 bg-red-50'
          if (picked && opt !== picked && !isAnswer) cls = 'border-cream-200 bg-cream-50 opacity-60'
          return (
            <Pressable
              key={opt}
              onPress={() => !picked && setPicked(opt)}
              disabled={Boolean(picked)}
              className={`rounded border p-3 ${cls}`}
            >
              <Text className="text-sm text-stone-800">{opt}</Text>
            </Pressable>
          )
        })}
      </View>

      {picked && (
        <View
          className={`mt-5 rounded-md p-4 flex-row flex-wrap justify-between items-center gap-3 shadow-warm ${
            correct ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          <Text className={`font-semibold ${correct ? 'text-emerald-900' : 'text-red-900'}`}>
            {correct ? 'Correct ✓' : `Not quite — answer: ${step.answer}`}
          </Text>
          <Button onPress={onAdvance} variant="secondary">Continue</Button>
        </View>
      )}
    </View>
  )
}

function MiniQuizStep({ step, taken }) {
  return (
    <View>
      <Text className="font-serif text-2xl text-stone-900 mb-2">{step.title}</Text>
      <Text className="text-stone-700 mb-5">
        {taken
          ? "You've taken this quiz — you can retake it for more practice. The lesson is marked complete."
          : 'Time to put it to the test. Take the mini-quiz to finish this lesson.'}
      </Text>
      <View className="flex-row flex-wrap gap-3">
        <Link href={`/quiz/${step.quizId}`} asChild>
          <Button>{taken ? 'Retake quiz' : 'Take quiz'}</Button>
        </Link>
        <Link href="/learn" asChild>
          <Button variant="secondary">Back to Learn</Button>
        </Link>
      </View>
    </View>
  )
}

// ── Study→quiz handoff helpers (mirror the web) ──────────────────────────────

// A completedSteps entry set when the learner heads off to study — separate
// from any real step id; it only gates the quiz step.
function studiedFlag(lesson) {
  return `${lesson.id}-studied`
}

// Shared "go study" action — marks the flag, then opens the category's word bank.
function useStudyHandoff(lesson) {
  const router = useRouter()
  const { markStepComplete } = useProgress()
  return () => {
    markStepComplete(studiedFlag(lesson)) // no lessonId → doesn't touch completion
    router.push(`/vocabulary/${lesson.vocab}`)
  }
}

function StudyHandoff({ lesson }) {
  const { completedSteps } = useProgress()
  const category = getCategory(lesson.vocab)
  const studied = completedSteps.includes(studiedFlag(lesson))
  const goStudy = useStudyHandoff(lesson)
  if (!category) return null

  return (
    <View className="mt-6 pt-5 border-t border-cream-200">
      <Button onPress={goStudy}>Study the {category.words.length} words →</Button>
      <Text className="text-xs text-stone-600 mt-2">
        {studied
          ? '✓ Studied — the quiz is unlocked on the next step.'
          : 'Study these in your word bank to unlock the quiz.'}
      </Text>
    </View>
  )
}

// ── Letters / tones grids (RN versions of the Reference components) ───────────

function LetterGrid({ items }) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {items.map((it, i) => (
        <View key={`${it.letter}-${i}`} className="rounded-md bg-cream-100 border border-cream-200 p-3 items-center w-[92px]">
          <View className="self-end">
            <AudioButton audioSrc={it.audio} wordId={it.letter} />
          </View>
          <Text className="font-serif text-2xl text-clay-700">{it.letter}</Text>
          {(it.sound || it.englishSound) && (
            <Text className="text-xs text-stone-500 mt-1 text-center">{it.sound || it.englishSound}</Text>
          )}
        </View>
      ))}
    </View>
  )
}

function ToneRows({ items }) {
  return (
    <View className="gap-2">
      {items.map((t, i) => (
        <View key={`${t.name || t.marker}-${i}`} className="rounded-md bg-cream-100 border border-cream-200 flex-row items-center gap-3 p-4">
          <Text className="w-10 font-serif text-2xl text-clay-700 text-center">{t.marker || '–'}</Text>
          <View className="flex-1">
            <Text className="font-semibold text-stone-800">{t.name}</Text>
            {t.description && <Text className="text-sm text-stone-600">{t.description}</Text>}
          </View>
          <AudioButton audioSrc={t.audio} wordId={t.name || t.marker} />
        </View>
      ))}
    </View>
  )
}
