import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
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
import { useProgress } from '../../src/hooks/useProgress.js'
import { getUnit, unitWords } from '../../src/data/path.js'
import {
  buildTypingSession,
  allTypingExercises,
  typingExercisesFor,
  bodyTray,
  toneTray,
  bodyOf,
  emptyAnswer,
  setPart,
  nextFocus,
  isAnswerComplete,
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
// file is the surface: two picks per syllable (its LETTERS, then its TONE),
// and a verdict that names the tone when the tone is what went wrong.
//
// ⚠️ REWORKED 2026-09-22 — it was three trays per syllable (consonant, then
// vowel, then tone), one on screen at a time, with Undo and Check buttons: six
// taps plus Check for a two-syllable word, the tray swapping under the finger
// after every one, and fixing the first consonant meant undoing everything
// after it. Now:
//   · consonant + vowel are ONE chip (bodyTray — decoys still confusable)
//   · both trays are on screen together, so the tray never swaps mid-syllable
//     and the halves can be picked in either order
//   · tap any syllable to go back and change it — no Undo
//   · the answer checks itself the moment the last slot is filled — no Check
// The old screen is in archive/2026-09-22-pre-tone-rework/ (TO RESTORE: copy
// it and its typingDrill.js back).
//
// Laid out like the sentence builder next door (full-bleed cream sheet, one
// row of chrome, results card at the end) because they are two tiles apart on
// the Words hub and should read as one pair of drills.

// ⚠️ cream-100, NOT cream-50 — the same rule the sentence builder records: the
// drill sits on a full-bleed cream-50 sheet, and a cream-50 panel on a cream-50
// sheet is invisible. Panels are one step darker than the surface under them.
const CARD = 'rounded-md bg-cream-100'
const SHEET = 'bg-cream-50 border-y border-cream-300 px-5 pt-5 pb-8'

// The tone tray's rule, said outright rather than left to be inferred from
// being marked wrong — it is the whole reason this screen exists.
const TONE_HINT = 'The last letter IS the tone. Mid has no letter at all.'

// Chip widths as static style objects (never a style function — NativeWind
// drops those on native). Percentages so the rows are always 3 letter chips
// and 4 tone chips across, whatever the phone, instead of wrapping unevenly.
const BODY_CHIP = { width: '31%' }
const TONE_CHIP = { width: '23%', minHeight: 58 }

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

  // `?unit=<unitId>` — the beginner path's TONE step (src/data/path.js). The
  // drill grades the tone off the spelling, so it teaches tone with no audio at
  // all; that is why it stands in for the path's tone step until clips exist.
  // Scoped to the unit's words, and finishing a session completes the step.
  const { unit: unitParam } = useLocalSearchParams()
  const pathUnit = unitParam ? getUnit(String(unitParam)) : null
  const unitIds = useMemo(() => (pathUnit ? unitWords(pathUnit).map((w) => w.id) : null), [pathUnit])
  const { markStepComplete } = useProgress()
  const crumbs = pathUnit
    ? [
        { label: 'Home', to: '/' },
        { label: 'Paths', to: '/path' },
        { label: pathUnit.title, to: `/path/${pathUnit.id}` },
        { label: 'Tones' },
      ]
    : CRUMBS

  // ⚠️ ONLY A FREE UNIT skips the daily allowance — the same rule as the
  // sentence builder: the free course must not stall inside its own lesson, and a
  // Pro unit opened by URL must not become unlimited free practice.
  const quota = useDailyQuota('typing', quotaLimit('typing', user.isGuest), {
    enabled: !isPro && !pathUnit?.free,
    scope: user?.id || 'guest',
  })

  const [phase, setPhase] = useState('idle')
  const [session, setSession] = useState([])
  const [index, setIndex] = useState(0)
  // One { body, tone } per syllable — see emptyAnswer() for why it is not flat.
  const [answer, setAnswer] = useState([])
  // Which syllable the trays are filling. The learner can move it by tapping.
  const [focus, setFocus] = useState(0)
  const [verdict, setVerdict] = useState(null)
  const [score, setScore] = useState(0)
  const [points, setPoints] = useState(0)
  // Partial credit across the session: syllables fully right (letters AND tone)
  // out of syllables asked. A two-syllable word with one perfect syllable is
  // not the same as one with neither, and "2 of 5 words" cannot say that.
  const [syllableStats, setSyllableStats] = useState({ correct: 0, total: 0 })

  const available = useMemo(() => (unitIds ? typingExercisesFor(unitIds) : allTypingExercises()).length, [unitIds])
  const exercise = session[index]

  // ── Where the answer is up to ─────────────────────────────────────────────
  // ⚠️ COMPUTED HERE, ABOVE THE PHASE RETURNS, because the tray is memoised and
  // a hook cannot sit after an early return. `exercise` is undefined in the
  // intro and results phases, so every line below is guarded rather than moved
  // down into the active branch where it is actually read.
  // The letters tray is built around the CORRECT letters for the focused
  // syllable — that is what "constrained set" means here: the answer is in the
  // tray, the decoys are the ones worth confusing it with.
  //
  // ⚠️ MEMOISED, AND NOT FOR SPEED. bodyTray() SHUFFLES, so calling it straight
  // from the render body re-orders the chips on every re-render — the chip
  // under a finger about to tap it moves because an unrelated counter changed.
  // A new tray comes only with a new word or a different syllable.
  const letters = useMemo(
    () => (exercise && focus >= 0 ? bodyTray(exercise.syllables[focus]) : []),
    [exercise, focus]
  )
  const tones = useMemo(() => toneTray(), [])

  const start = async () => {
    const ok = await quota.consume()
    if (!ok) return
    const s = buildTypingSession(SESSION_LENGTH, unitIds)
    setSession(s)
    setIndex(0)
    setAnswer(s[0] ? emptyAnswer(s[0]) : [])
    setFocus(0)
    setVerdict(null)
    setScore(0)
    setPoints(0)
    setSyllableStats({ correct: 0, total: 0 })
    setPhase('active')
  }

  // `kind` is 'body' or 'tone'. Picking the last empty slot checks the answer
  // straight away — there is no Check button to find. Picking into an already
  // filled slot just replaces it, which is how a mistake is fixed.
  const pick = (kind, value) => {
    if (verdict || focus < 0) return
    const next = setPart(answer, focus, kind, value)
    setAnswer(next)
    if (isAnswerComplete(next)) {
      setFocus(-1)
      check(next)
    } else {
      setFocus(nextFocus(next, focus))
    }
  }

  const check = (built) => {
    const d = diagnose(built, exercise)
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
    setAnswer(session[index + 1] ? emptyAnswer(session[index + 1]) : [])
    setFocus(0)
    setVerdict(null)
    if (index + 1 >= session.length) {
      // `score` already counts the word just checked — check() ran and flushed
      // before this button could be pressed — so this is the same test the
      // results screen uses for `perfect`.
      if (score === session.length) setPoints((p) => p + PERFECT_BONUS)
      // Finishing a session IS the unit's tone step — practice, not a test.
      if (pathUnit) markStepComplete(`path:${pathUnit.id}:tone`)
      setPhase('done')
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (quota.exhausted && phase !== 'active') {
    return (
      <TabScreen>
        <Breadcrumbs items={crumbs} />
        <QuotaWall />
      </TabScreen>
    )
  }

  // ── intro ─────────────────────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <TabScreen fill>
        <Breadcrumbs items={crumbs} />

        <View style={sheetStyle} className={SHEET}>
          <View className="items-center mb-6">
            <View className="flex-row items-center gap-3 mb-2">
              <Text className="font-serif text-3xl text-stone-900 text-center">Spell it out</Text>
              <QuotaBadge {...quota} label="left today" />
            </View>
            <Text className="text-sm font-medium text-stone-700 text-center leading-snug">
              You’ll see an English word and build the Hmong for it — the letters, then
              the tone. {available} words, drawn from the vocabulary you study.
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
              <Link href={pathUnit ? `/path/${pathUnit.id}` : '/words'} asChild>
                <Button size="lg" variant="secondary">{pathUnit ? 'Back to the unit' : 'Back to Words'}</Button>
              </Link>
            </View>
          </View>
        </View>
      </TabScreen>
    )
  }

  // ── active ────────────────────────────────────────────────────────────────
  // The trays are computed above the phase returns — see the hook note there.
  const current = focus >= 0 ? answer[focus] : null

  return (
    <TabScreen>
      <Breadcrumbs items={crumbs} />

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
        <View className="flex-row flex-wrap gap-3 justify-center mb-2">
          {exercise.syllables.map((_, s) => (
            <SyllableSlots
              key={s}
              parts={answer[s]}
              active={!verdict && s === focus}
              onPress={verdict ? undefined : () => setFocus(s)}
              verdict={verdict ? verdict.syllables[s] : null}
            />
          ))}
        </View>
        {/* Only worth saying when there is more than one syllable to move between. */}
        {!verdict && exercise.syllables.length > 1 && (
          <Text className="text-xs font-medium text-stone-500 text-center mb-4">
            Tap a syllable to change it.
          </Text>
        )}
        {!verdict && exercise.syllables.length === 1 && <View className="mb-2" />}

        {/* BOTH TRAYS AT ONCE — letters above, tones below. Neither swaps out
            while a syllable is being built, the halves can be picked in either
            order, and the chip already chosen is marked so changing it is one
            tap on a different chip. */}
        {!verdict && current && (
          <>
            <TrayLabel title="Letters" hint="Which consonant and vowel?" />
            <View className="flex-row flex-wrap gap-2 justify-center mb-5">
              {letters.map((part) => (
                <LetterChip
                  key={bodyOf(part)}
                  part={part}
                  chosen={current.body !== undefined && bodyOf(current.body) === bodyOf(part)}
                  onPress={() => pick('body', part)}
                />
              ))}
            </View>

            <TrayLabel title="Tone" hint={TONE_HINT} />
            <View className="flex-row flex-wrap gap-2 justify-center">
              {tones.map((marker) => (
                <ToneChip
                  key={marker || 'mid'}
                  marker={marker}
                  chosen={current.tone === marker}
                  onPress={() => pick('tone', marker)}
                />
              ))}
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
// One box per syllable, two slots inside it: the letters, then the tone. The
// whole box is the tap target for moving the trays back to that syllable.
//
// An empty slot is a dot rather than a blank: a blank box reads as broken.
//
// ⚠️ A FILLED TONE SLOT CAN BE A DASH, and it means something different — the
// Mid tone is a real answer spelled with no letter. The tone NAME under the
// box is what tells "not chosen yet" (no name) from "chose Mid" ("Mid").
function SyllableSlots({ parts, active, onPress, verdict }) {
  const p = parts || { body: undefined, tone: undefined }
  const skin = verdict
    ? verdict.lettersOk && verdict.toneOk
      ? 'bg-lime-200 border-lime-200'
      : 'bg-cream-200 border-cream-400'
    : active
      ? 'bg-cream-100 border-clay-600'
      : 'bg-cream-100 border-cream-300'

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`rounded-md border-2 p-2 ${skin}`}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Syllable: ${p.body ? bodyOf(p.body) : 'letters not chosen'}, ${
        p.tone === undefined ? 'tone not chosen' : `${toneName(p.tone)} tone`
      }`}
    >
      <View className="flex-row gap-1.5">
        <Slot value={p.body === undefined ? undefined : bodyOf(p.body)} bad={verdict ? !verdict.lettersOk : false} wide />
        <Slot value={p.tone} bad={verdict ? !verdict.toneOk : false} />
      </View>
      {/* The tone's NAME under the syllable, the moment it is chosen — it puts
          "Rising" in front of the learner while they are still spelling, not
          only when they get it wrong. */}
      <Text className="text-[10px] font-semibold text-stone-600 text-center mt-1">
        {p.tone !== undefined ? toneName(p.tone) : ' '}
      </Text>
    </Pressable>
  )
}

function Slot({ value, bad, wide }) {
  const filled = value !== undefined
  const skin = bad
    ? 'bg-cream-50 border-clay-500'
    : filled
      ? 'bg-cream-50 border-cream-400'
      : 'border-dashed border-cream-400'

  return (
    // minWidth as a static style OBJECT, never a style function — NativeWind
    // drops those on native (see the memory note and Button.jsx's header).
    <View style={{ minWidth: wide ? 64 : 40 }} className={`rounded border ${skin} px-2 py-1.5 items-center justify-center`}>
      <Text className={`font-serif text-xl ${filled ? 'text-stone-900' : 'text-stone-400'}`}>
        {filled ? value || '—' : '·'}
      </Text>
    </View>
  )
}

// ── The trays ───────────────────────────────────────────────────────────────

function TrayLabel({ title, hint }) {
  return (
    <View className="items-center mb-2">
      <Text className="text-xs uppercase font-semibold text-clay-600">{title}</Text>
      <Text className="text-xs font-medium text-stone-600 text-center mt-0.5">{hint}</Text>
    </View>
  )
}

// The chosen chip is marked (clay border) so the learner can see what they
// picked for the focused syllable, and changing it is just a tap elsewhere.
const chipSkin = (chosen) =>
  chosen ? 'border-2 border-clay-600 bg-cream-50' : 'border border-cream-300 bg-cream-100'

function LetterChip({ part, chosen, onPress }) {
  const text = bodyOf(part)
  return (
    <Pressable
      onPress={onPress}
      style={BODY_CHIP}
      className={`rounded-md py-2.5 items-center justify-center active:opacity-70 ${chipSkin(chosen)}`}
      accessibilityRole="button"
      accessibilityState={{ selected: chosen }}
      accessibilityLabel={`Letters ${text}`}
    >
      <Text className="text-2xl font-bold text-stone-900 text-center">{text}</Text>
    </Pressable>
  )
}

// Tone chips carry the tone's NAME as well as its letter — the name is the
// thing being learned, and "Mid" has no letter to show at all.
function ToneChip({ marker, chosen, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={TONE_CHIP}
      className={`rounded-md px-1 py-1.5 items-center justify-center active:opacity-70 ${chipSkin(chosen)}`}
      accessibilityRole="button"
      accessibilityState={{ selected: chosen }}
      accessibilityLabel={`${marker ? `Tone ${marker}` : 'Mid tone, no letter'}, ${toneName(marker)}`}
    >
      <Text className="text-xl font-bold text-stone-900 text-center">{marker || '—'}</Text>
      {/* No `tracking-wider` — letterSpacing clips the last letter on Android. */}
      <Text className="text-[10px] font-semibold text-stone-600 text-center leading-tight">
        {toneName(marker)}
      </Text>
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
