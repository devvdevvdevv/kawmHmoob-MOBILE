import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen, { SCREEN_PADDING_X, useBottomClearance } from '../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import Button from '../../src/components/ui/Button.jsx'
import ProgressBar from '../../src/components/progress/ProgressBar.jsx'
import QuotaBadge from '../../src/components/common/QuotaBadge.jsx'
import QuotaWall from '../../src/components/common/QuotaWall.jsx'
import Confetti from '../../src/components/common/Confetti.jsx'
import { ResultStat, ResultEmblem } from '../../src/components/common/ResultStats.jsx'
import { useAuth } from '../../src/context/AuthContext.jsx'
import { useSubscription } from '../../src/context/SubscriptionContext.jsx'
import { useDailyQuota } from '../../src/hooks/useDailyQuota.js'
import { quotaLimit } from '../../src/lib/quotaLimits.js'
import {
  buildTypingSession,
  allTypingExercises,
  trayForStep,
  currentStep,
  picksToSyllables,
  isComplete,
  diagnose,
  isPass,
  toneName,
  pointsForExercise,
  PERFECT_BONUS,
  SESSION_LENGTH,
  TONE_ROW,
} from '../../src/lib/typingDrill.js'

// TYPING DRILL — read the English, spell the Hmong one part at a time.
//
// The mechanic and the argument for it live in src/lib/typingDrill.js. This
// file is the surface: three steps per syllable (consonant → vowel → TONE),
// one tray at a time, and a verdict that names the tone when the tone is what
// went wrong.
//
// ⚠️ ONE TRAY ON SCREEN, NOT THREE. Showing the consonant, vowel and tone
// options together is twenty chips on a phone, and it also flattens the thing
// being taught: a Hmong syllable is built in that order, and stepping through
// it is the lesson. The cost is that the drill cannot be answered out of
// order, which is fine — Undo walks back through the picks one at a time.
//
// Laid out like the sentence builder next door (full-bleed cream sheet, one
// row of chrome, results card at the end) because they are two tiles apart on
// the Words hub and should read as one pair of drills.

// ⚠️ cream-100, NOT cream-50 — the same rule the sentence builder records: the
// drill sits on a full-bleed cream-50 sheet, and a cream-50 panel on a cream-50
// sheet is invisible. Panels are one step darker than the surface under them.
const CARD = 'rounded-md bg-cream-100'
const SHEET = 'bg-cream-50 border-y border-cream-300 px-5 pt-5 pb-8'

// What each step asks for, in the learner's words. `hint` is the rule behind
// the step — the tone one is the whole reason this screen exists, so it says
// the rule outright rather than leaving it to be inferred from being marked
// wrong.
const STEP_COPY = {
  onset: { title: 'Consonant', hint: 'Which consonant starts it?' },
  nucleus: { title: 'Vowel', hint: 'Which vowel follows?' },
  tone: { title: 'Tone', hint: 'The last letter IS the tone. Mid has no letter at all.' },
}

export default function TypingDrill() {
  const bottomClearance = useBottomClearance()

  // Shared by every phase — defined once, for the reason the sentence builder
  // records: per-phase copies are how the intro ended up stopping short of the
  // bottom while the drill reached it.
  const sheetStyle = {
    marginHorizontal: -SCREEN_PADDING_X,
    marginBottom: -bottomClearance,
    paddingBottom: bottomClearance + 24,
    flexGrow: 1,
  }

  const { user } = useAuth()
  const { isPro } = useSubscription()
  const quota = useDailyQuota('typing', quotaLimit('typing', user.isGuest), {
    enabled: !isPro,
    scope: user?.id || 'guest',
  })

  const [phase, setPhase] = useState('idle')
  const [session, setSession] = useState([])
  const [index, setIndex] = useState(0)
  // The flat pick list — see picksToSyllables() for why it is flat.
  const [picks, setPicks] = useState([])
  const [verdict, setVerdict] = useState(null)
  const [score, setScore] = useState(0)
  const [points, setPoints] = useState(0)
  // Partial credit across the session: syllables fully right (letters AND tone)
  // out of syllables asked. A two-syllable word with one perfect syllable is
  // not the same as one with neither, and "2 of 5 words" cannot say that.
  const [syllableStats, setSyllableStats] = useState({ correct: 0, total: 0 })

  const available = useMemo(() => allTypingExercises().length, [])
  const exercise = session[index]

  // ── Where the answer is up to ─────────────────────────────────────────────
  // ⚠️ COMPUTED HERE, ABOVE THE PHASE RETURNS, because the tray is memoised and
  // a hook cannot sit after an early return. `exercise` is undefined in the
  // intro and results phases, so every line below is guarded rather than moved
  // down into the active branch where it is actually read.
  const step = currentStep(picks)
  const syllableIndex = Math.floor(picks.length / 3)
  const complete = exercise ? isComplete(picks, exercise) : false

  // The tray is built around the CORRECT part for the slot being filled — that
  // is what "constrained set" means here, and it is the point: the answer is in
  // the tray, the decoys are the ones worth confusing it with. Once every slot
  // is filled there is no next slot, so the tray comes down and Check takes the
  // space instead of a seventh row of chips.
  //
  // ⚠️ MEMOISED, AND NOT FOR SPEED. trayForStep() SHUFFLES, so calling it
  // straight from the render body re-orders the chips on every re-render — the
  // chip under a finger about to tap it moves because an unrelated counter
  // changed. The deps are exactly what should produce a new tray: a new word, a
  // new syllable, a new step.
  const tray = useMemo(
    () => (!exercise || complete ? [] : trayForStep(exercise.syllables[syllableIndex], step)),
    [exercise, syllableIndex, step, complete]
  )

  const start = async () => {
    const ok = await quota.consume()
    if (!ok) return
    setSession(buildTypingSession(SESSION_LENGTH))
    setIndex(0)
    setPicks([])
    setVerdict(null)
    setScore(0)
    setPoints(0)
    setSyllableStats({ correct: 0, total: 0 })
    setPhase('active')
  }

  const pick = (value) => {
    if (verdict) return
    setPicks((p) => [...p, value])
  }

  const undo = () => {
    if (verdict) return
    setPicks((p) => p.slice(0, -1))
  }

  const check = () => {
    const d = diagnose(picks, exercise)
    setVerdict(d)
    setSyllableStats((s) => ({
      correct: s.correct + d.correctSyllables,
      total: s.total + d.totalSyllables,
    }))
    if (isPass(d.status)) {
      setScore((s) => s + 1)
      setPoints((p) => p + pointsForExercise(exercise))
    }
  }

  const next = () => {
    setPicks([])
    setVerdict(null)
    if (index + 1 >= session.length) {
      // `score` already counts the word just checked — check() ran and flushed
      // before this button could be pressed — so this is the same test the
      // results screen uses for `perfect`.
      if (score === session.length) setPoints((p) => p + PERFECT_BONUS)
      setPhase('done')
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (quota.exhausted && phase !== 'active') {
    return (
      <TabScreen>
        <Breadcrumbs items={CRUMBS} />
        <QuotaWall />
      </TabScreen>
    )
  }

  // ── intro ─────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <TabScreen fill>
        <Breadcrumbs items={CRUMBS} />

        <View style={sheetStyle} className={SHEET}>
          <View className="items-center mb-6">
            <View className="flex-row items-center gap-3 mb-2">
              <Text className="font-serif text-3xl text-stone-900 text-center">Spell it out</Text>
              <QuotaBadge {...quota} label="left today" />
            </View>
            <Text className="text-sm font-medium text-stone-700 text-center leading-snug">
              You’ll see an English word and build the Hmong for it — consonant, vowel,
              then tone. {available} words, drawn from the vocabulary you study.
            </Text>
          </View>

          {/* The pitch, and it is a real one: this is the only drill in the app
              where getting the tone wrong is TOLD TO YOU as a tone mistake. */}
          <View className={`${CARD} p-5 mb-6`}>
            <Text className="text-xs uppercase tracking-wider text-clay-600 mb-3 text-center">
              Why the tone gets its own step
            </Text>
            <Text className="text-sm font-medium text-stone-700 text-center leading-snug mb-4">
              In Hmong the tone is the last letter. Type <Text className="font-bold">zos</Text> when
              you meant <Text className="font-bold">zoo</Text> and you haven’t made a typo — you’ve
              said a different word.
            </Text>
            <View className="flex-row flex-wrap gap-2 justify-center">
              {TONE_ROW.map((t) => (
                <View key={t.marker || 'mid'} className="rounded-md bg-cream-200 px-3 py-1.5 items-center">
                  <Text className="font-serif text-lg text-stone-900">{t.marker || '—'}</Text>
                  <Text className="text-[10px] font-semibold text-stone-600 text-center">{t.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="items-center">
            <Button size="lg" onPress={start} disabled={!quota.ready}>
              Start {SESSION_LENGTH} words
            </Button>
          </View>
        </View>
      </TabScreen>
    )
  }

  // ── results ───────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const perfect = score === session.length
    const syllablePct = syllableStats.total
      ? Math.round((100 * syllableStats.correct) / syllableStats.total)
      : 0
    return (
      <TabScreen scroll={false}>
        <View style={sheetStyle} className={`flex-1 justify-center items-center ${SHEET}`}>
          {perfect && <Confetti />}
          <View className={`${CARD} w-full max-w-md p-7 items-center`}>
            <ResultEmblem perfect={perfect} />

            <Text className="font-serif text-3xl text-stone-900 mt-4 mb-1 text-center">
              {perfect ? 'All correct! 🎉' : 'Session complete'}
            </Text>
            <Text className="text-sm font-medium text-stone-600 mb-5 text-center">
              {perfect
                ? 'Every letter and every tone.'
                : "Here's the breakdown — every session adds up."}
            </Text>

            <View className="flex-row gap-2.5 w-full mb-5">
              <ResultStat icon="check" tone="ocean" value={`${score}/${session.length}`} label="Words" />
              <ResultStat icon="star" tone="blush" value={`${syllablePct}%`} label="Syllables" />
              <ResultStat icon="trophy" tone="clay" value={points} label="Points" />
            </View>

            {perfect && (
              <View className="rounded-full bg-lime-200 px-3 py-1.5 mb-6">
                <Text className="text-xs font-bold uppercase tracking-wide text-lime-900">
                  +{PERFECT_BONUS} perfect bonus included
                </Text>
              </View>
            )}

            <View className={`w-full gap-3 ${perfect ? '' : 'mt-1'}`}>
              {!quota.exhausted && (
                <Button size="lg" onPress={start}>
                  Another {SESSION_LENGTH}
                </Button>
              )}
              <Link href="/words" asChild>
                <Button size="lg" variant="secondary">Back to Words</Button>
              </Link>
            </View>
          </View>
        </View>
      </TabScreen>
    )
  }

  // ── active ────────────────────────────────────────────────────────────────
  // step, syllableIndex, complete and tray are all computed above the phase
  // returns — see the hook note there.
  const built = picksToSyllables(picks)

  return (
    <TabScreen>
      <Breadcrumbs items={CRUMBS} />

      <View style={sheetStyle} className={SHEET}>
        {/* One row of chrome, same as the sentence builder — the counters, the
            quota badge and the bar share a line rather than stacking into four
            bands above the word you are here to spell. */}
        <View className="mb-4">
          <View className="flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-2">
            <Text className="text-sm font-semibold text-stone-800">
              Word {index + 1} of {session.length}
            </Text>
            <Text className="text-sm font-bold text-clay-700">· {score} correct</Text>
            {/* lime-900, not lime-700 — this app's lime scale only defines 200
                and 900 (tailwind.config.js). */}
            <Text className="text-sm font-bold text-lime-900">· {points} pts</Text>
            <QuotaBadge {...quota} label="left today" />
          </View>
          <ProgressBar value={index} max={session.length} size="sm" />
        </View>

        {/* THE PROMPT — the English, and nothing else. No category, no "teaches
            X": naming the word's topic narrows a spelling answer the same way
            the sentence builder found its own hint card was leaking. The full
            gloss and the category wait for the reveal. */}
        <View className={`${CARD} p-4 mb-3 items-center`}>
          <Text className="font-serif text-2xl text-stone-900 leading-snug text-center">
            {exercise.prompt}
          </Text>
        </View>

        {/* THE ANSWER, as slots. The syllable count is visible from the start —
            it is scaffolding, not a giveaway: how many syllables a word has is
            audible to anyone who has heard it, and the drill is about which
            letters and which tone, not about guessing the length. */}
        <View className="flex-row flex-wrap gap-3 justify-center mb-4">
          {exercise.syllables.map((_, s) => (
            <SyllableSlots
              key={s}
              parts={built[s]}
              active={!verdict && s === syllableIndex}
              activeStep={step}
              verdict={verdict ? verdict.syllables[s] : null}
            />
          ))}
        </View>

        {!verdict && (
          <>
            {!complete && (
              <>
                <View className="items-center mb-3">
                  <Text className="text-xs uppercase tracking-wider font-semibold text-clay-600">
                    {STEP_COPY[step].title}
                  </Text>
                  <Text className="text-sm font-medium text-stone-700 text-center mt-0.5">
                    {STEP_COPY[step].hint}
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2.5 justify-center mb-6">
                  {tray.map((value) => (
                    <TrayChip
                      key={value || 'none'}
                      value={value}
                      step={step}
                      onPress={() => pick(value)}
                    />
                  ))}
                </View>
              </>
            )}

            <View className="gap-2">
              <Button size="xl" onPress={check} disabled={!complete}>
                Check
              </Button>
              {picks.length > 0 && (
                // Small, centred, below — the same hierarchy rule the sentence
                // builder's Clear follows: this is an undo, not the point of
                // the screen, and a full-width red bar shouted louder than
                // Check did.
                <View className="items-center">
                  <Button size="sm" variant="danger" icon="arrowLeft" onPress={undo}>
                    Undo
                  </Button>
                </View>
              )}
            </View>
          </>
        )}

        {verdict && <Verdict verdict={verdict} exercise={exercise} index={index} session={session} onNext={next} />}
      </View>
    </TabScreen>
  )
}

// ── The answer slots ────────────────────────────────────────────────────────
//
// One box per syllable, three slots inside it, in spelling order. An empty slot
// is a dash rather than a blank: a blank box reads as broken, and a dash reads
// as "something goes here".
//
// ⚠️ A FILLED SLOT CAN ALSO BE A DASH, and it means something different — the
// empty onset ("os" has no consonant) and the Mid tone (no letter) are both
// real answers spelled with nothing. The label underneath is what tells them
// apart: an unfilled slot has no label, a chosen "none" says so.
function SyllableSlots({ parts, active, activeStep, verdict }) {
  const p = parts || { onset: undefined, nucleus: undefined, tone: undefined }
  const skin = !verdict
    ? 'bg-cream-100 border-cream-300'
    : verdict.lettersOk && verdict.toneOk
      ? 'bg-lime-200 border-lime-200'
      : 'bg-cream-200 border-cream-400'

  return (
    <View className={`rounded-md border p-2 ${skin}`}>
      <View className="flex-row gap-1.5">
        <Slot value={p.onset} label="none" active={active && activeStep === 'onset'} bad={verdict ? !verdict.onsetOk : false} />
        <Slot value={p.nucleus} active={active && activeStep === 'nucleus'} bad={verdict ? !verdict.nucleusOk : false} />
        <Slot value={p.tone} label="mid" active={active && activeStep === 'tone'} bad={verdict ? !verdict.toneOk : false} />
      </View>
      {/* The tone's NAME under the syllable, the moment it is chosen. This is
          the quiet half of the feature: it puts "Rising" in front of the
          learner while they are still spelling, not only when they get it
          wrong. */}
      {p.tone !== undefined && (
        <Text className="text-[10px] font-semibold text-stone-600 text-center mt-1">
          {toneName(p.tone)}
        </Text>
      )}
    </View>
  )
}

function Slot({ value, label, active, bad }) {
  const filled = value !== undefined
  const skin = bad
    ? 'bg-cream-50 border-clay-500'
    : active
      ? 'bg-cream-50 border-clay-600'
      : filled
        ? 'bg-cream-50 border-cream-400'
        : 'border-dashed border-cream-400'

  return (
    // minWidth as a static style OBJECT, never a style function — NativeWind
    // drops those on native (see the memory note and Button.jsx's header).
    <View style={{ minWidth: 46 }} className={`rounded border ${skin} px-2 py-1.5 items-center justify-center`}>
      <Text className={`font-serif text-xl ${filled ? 'text-stone-900' : 'text-stone-400'}`}>
        {filled ? value || '—' : '·'}
      </Text>
      {filled && value === '' && (
        <Text className="text-[9px] font-semibold uppercase text-stone-500">{label}</Text>
      )}
    </View>
  )
}

// ── The tray ────────────────────────────────────────────────────────────────
//
// Tone chips carry the tone's NAME as well as its letter; consonant and vowel
// chips carry only the letters, because "nts" has no short name to give and the
// alphabet module is where those are learned.
function TrayChip({ value, step, onPress }) {
  const isTone = step === 'tone'
  const isNone = value === ''

  return (
    <Pressable
      onPress={onPress}
      // Static style object (see Slot). min-w keeps a one-letter chip from
      // becoming a sliver next to "ntsh", and it is what the tone NAME needs —
      // "Mid-Falling with Air" is wider than every letter in the set.
      style={{ minWidth: isTone ? 96 : 72, maxWidth: '100%' }}
      className="rounded-md border border-cream-300 bg-cream-100 px-4 py-2.5 items-center justify-center active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={
        isTone
          ? `${isNone ? 'Mid tone, no letter' : `Tone ${value}`}, ${toneName(value)}`
          : isNone
            ? 'No consonant'
            : value
      }
    >
      <Text className="text-2xl font-bold text-stone-900 text-center">{isNone ? '—' : value}</Text>
      {isTone && (
        // No `tracking-wider` — letterSpacing puts the trailing gap INSIDE the
        // text box, which clips the last letter on Android and shifts the label
        // off-centre. Same rule as the sentence builder's chips.
        <Text className="text-[10px] font-semibold text-stone-600 mt-0.5 text-center">
          {toneName(value)}
        </Text>
      )}
      {!isTone && isNone && (
        <Text className="text-[10px] font-semibold uppercase text-stone-500 mt-0.5">none</Text>
      )}
    </Pressable>
  )
}

// ── The verdict ─────────────────────────────────────────────────────────────
//
// ⚠️ FOUR OUTCOMES, NOT TWO, and the middle two are the feature. See diagnose()
// in lib/typingDrill.js: a wrong tone over right letters is a different thing
// from a misspelling, and a different real word that also answers the prompt is
// not a mistake at all.
const VERDICT_COPY = {
  correct: { title: 'Correct ✓', good: true },
  alternative: { title: 'Also right ✓', good: true },
  tone: { title: 'Right letters — wrong tone', good: false },
  spelling: { title: 'Not quite', good: false },
}

function Verdict({ verdict, exercise, index, session, onNext }) {
  const copy = VERDICT_COPY[verdict.status]
  const good = copy.good
  const wrongTones = verdict.syllables.filter((s) => s.lettersOk && !s.toneOk)

  return (
    <View className={`rounded-md p-5 items-center ${good ? 'bg-lime-200' : 'bg-cream-200 border border-cream-400'}`}>
      <Text className={`text-base font-bold mb-2 text-center ${good ? 'text-lime-900' : 'text-stone-900'}`}>
        {copy.title}
      </Text>

      {/* Partial credit, skipped when it would only restate the verdict. */}
      {!good && verdict.totalSyllables > 1 && (
        <Text className="text-xs font-medium text-stone-600 mb-2 text-center">
          {verdict.correctSyllables} of {verdict.totalSyllables} syllables right
        </Text>
      )}

      <Text className={`font-serif text-3xl mb-1 text-center ${good ? 'text-lime-900' : 'text-stone-900'}`}>
        {exercise.hmong}
      </Text>
      <Text className={`text-sm text-center ${good ? 'text-lime-900/80' : 'text-stone-700'}`}>
        {exercise.english}
      </Text>

      {/* An accepted alternative still says which word was being asked for —
          otherwise the learner never finds out that both exist. */}
      {verdict.status === 'alternative' && (
        <Text className="text-xs font-medium text-lime-900/70 mt-2 text-center">
          You wrote “{verdict.spelling}”, which also means that. The one being asked for
          was “{exercise.hmong}”.
        </Text>
      )}

      {/* THE TONE VERDICT — the reason the drill exists. Named tones, per
          syllable, both sides: what was written and what the word takes. */}
      {wrongTones.length > 0 && (
        <View className={`${CARD} p-4 mt-4 w-full items-center`}>
          {wrongTones.map((s) => (
            <View key={s.want} className="items-center mb-1">
              <Text className="text-sm font-medium text-stone-700 text-center leading-snug">
                <Text className="font-bold">{s.want}</Text> takes the{' '}
                <Text className="font-bold">{s.wantedTone.name}</Text> tone
                {s.wantedTone.marker ? ` (-${s.wantedTone.marker})` : ' (no letter)'} — you wrote{' '}
                <Text className="font-bold">{s.got}</Text>, the{' '}
                <Text className="font-bold">{s.wroteTone.name}</Text> tone
                {s.wroteTone.marker ? ` (-${s.wroteTone.marker})` : ' (no letter)'}.
              </Text>
            </View>
          ))}
          <Link href="/quiz/tone-drill" asChild>
            <Button size="sm" icon="music" className="mt-3">
              Hear the difference
            </Button>
          </Link>
        </View>
      )}

      {/* ⚠️ THE BEST THING THIS DRILL CAN SAY. 133 one-syllable skeletons in
          the vocabulary carry more than one tone, so a wrong tone very often
          spells ANOTHER WORD THE APP HAS ALREADY TAUGHT. Saying so turns a
          wrong answer into the lesson. */}
      {verdict.alsoAWord && (
        <View className="rounded-md bg-cream-50 border border-cream-400 px-4 py-3 mt-3 w-full">
          <Text className="text-sm font-medium text-stone-700 text-center leading-snug">
            “{verdict.alsoAWord.spelling}” is a word of its own — {verdict.alsoAWord.english}.
          </Text>
        </View>
      )}

      {/* Misspellings get the plain comparison; there is no rule to name, only
          the two spellings side by side. */}
      {verdict.status === 'spelling' && !verdict.alsoAWord && (
        <Text className="text-xs font-medium text-stone-600 mt-3 text-center">
          You wrote “{verdict.spelling}”.
        </Text>
      )}

      <Text className={`text-xs font-medium mt-3 text-center ${good ? 'text-lime-900/70' : 'text-stone-600'}`}>
        from {exercise.categoryTitle}
      </Text>

      <View className="mt-5">
        <Button size="xl" onPress={onNext}>
          {index + 1 >= session.length ? 'Finish' : 'Next word'}
        </Button>
      </View>
    </View>
  )
}

const CRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Words', to: '/words' },
  { label: 'Spell it out' },
]
