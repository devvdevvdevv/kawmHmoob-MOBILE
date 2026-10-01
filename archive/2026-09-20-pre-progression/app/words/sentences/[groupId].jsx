import { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, Pressable, Animated } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import TabScreen, { SCREEN_PADDING_X, useBottomClearance } from '../../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import ProgressBar from '../../../src/components/progress/ProgressBar.jsx'
import QuotaBadge from '../../../src/components/common/QuotaBadge.jsx'
import QuotaWall from '../../../src/components/common/QuotaWall.jsx'
import Confetti from '../../../src/components/common/Confetti.jsx'
import { useAuth } from '../../../src/context/AuthContext.jsx'
import { useSubscription } from '../../../src/context/SubscriptionContext.jsx'
import { useTheme } from '../../../src/context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../../src/lib/themes.js'
import { useDailyQuota } from '../../../src/hooks/useDailyQuota.js'
import { quotaLimit } from '../../../src/lib/quotaLimits.js'
import {
  buildSentenceSession,
  isSentenceCorrect,
  wordAccuracy,
  pointsForExercise,
  PERFECT_BONUS,
  exercisesInGroup,
  sentenceGroupTitle,
  MIXED,
  SESSION_LENGTH,
} from '../../../src/lib/sentenceBuilder.js'
import { tagOf, POS_STYLES, POS_ORDER } from '../../../src/lib/partsOfSpeech.js'
import { grammarHint } from '../../../src/lib/grammarHints.js'

// SENTENCE BUILDER — read the English, tap the Hmong words back into order.
//
// Everything is centre-aligned: the sentence under construction is the only
// thing on screen that matters, and a centred tray reads as one line of language
// rather than a left-justified list of controls.
//
// Chips carry a part-of-speech label where the vocabulary knows one (see
// lib/partsOfSpeech) — the colour and the word "Classifier" are doing the same
// teaching job the drill is. When a wrong answer is wrong in one of two specific
// ways, a flashing (i) explains the rule and opens the lesson behind it (see
// lib/grammarHints).
// ⚠️ LESS ROUNDING + BORDER REMOVED — 2026-08-29, matching the app-wide pass.
// Was: 'rounded-xl bg-cream-50 border border-cream-300'
//
// (That "Was:" line briefly read 'rounded-md …' because a blanket
// rounded-xl→rounded-md replace over this file also rewrote the comment that
// documented the old value. A global replace eats the one line whose whole job
// is to preserve the old text.)
//
// ⚠️ cream-100, NOT cream-50. The drill now sits on a full-bleed cream-50 SHEET
// (below), and a cream-50 panel on a cream-50 sheet is invisible. These panels
// have to be one step darker than the surface they rest on.
const CARD = 'rounded-md bg-cream-100'

// The sheet the whole drill sits on. Cancels TabScreen's gutter with a negative
// margin so it runs edge to edge, puts the padding back inside, and grows to
// fill the remaining height — so the drill reads as ONE surface instead of four
// panels floating on the page background.
//
// border-y only: the left and right edges are off-screen, so a full border
// would render as a top and bottom rule anyway.
const SHEET = 'bg-cream-50 border-y border-cream-300 px-5 pt-5 pb-8'

export default function SentenceBuilder() {
  // 'mixed' is the dojo — everything shuffled together. Any other id drills one
  // theme. The route is the ONLY difference between the two: every screen below
  // is identical either way, which is why there is one file rather than two.
  const { groupId } = useLocalSearchParams()
  const group = groupId || MIXED
  const groupTitle = sentenceGroupTitle(group)

  // Breadcrumbs gain the group, and "Sentence builder" becomes a link back to
  // the hub now that a hub exists above this screen.
  const crumbs = [...CRUMBS, { label: groupTitle }]

  // Lets the sheet run past TabScreen's bottom padding to the physical edge.
  const bottomClearance = useBottomClearance()

  // The full-bleed sheet, defined ONCE and shared by every phase — intro,
  // active and results. Defining it per-phase is how the intro ended up
  // stopping short of the bottom while the drill reached it.
  //
  //   marginHorizontal  cancels TabScreen's side gutter → edge to edge
  //   marginBottom      cancels its bottom padding      → down to the screen edge
  //   paddingBottom     puts that padding back INSIDE   → clear of the tab bar
  //   flexGrow          fills whatever height is left
  const sheetStyle = {
    marginHorizontal: -SCREEN_PADDING_X,
    marginBottom: -bottomClearance,
    paddingBottom: bottomClearance + 24,
    flexGrow: 1,
  }

  // ── Keeping the buttons still ─────────────────────────────────────────────
  // ⚠️ The word bank SHRINKS as chips are used, and unmounts entirely on the
  // last one. Check and Clear sit below it, so they crept upward with every tap
  // and then jumped when the bank vanished — the button moved out from under
  // the finger about to press it.
  //
  // Fixed by MEASURING the bank at its tallest and locking that as a minHeight.
  // Measured rather than computed because chips wrap: the row count depends on
  // word lengths and screen width, and any formula would be wrong on some
  // sentence. The first layout is the fullest one, so the max arrives free.
  //
  // `h > cur` makes this converge — once minHeight equals the measured height
  // nothing exceeds it, so the state stops updating and there is no loop.
  const [bankHeight, setBankHeight] = useState(0)

  const { user } = useAuth()
  const { isPro } = useSubscription()
  const quota = useDailyQuota('sentence-builder', quotaLimit('sentence-builder', user.isGuest), {
    enabled: !isPro,
    scope: user?.id || 'guest',
  })

  const [phase, setPhase] = useState('idle')
  const [session, setSession] = useState([])
  const [index, setIndex] = useState(0)
  const [placed, setPlaced] = useState([])
  const [result, setResult] = useState(null) // 'correct' | 'incorrect' | null
  const [hint, setHint] = useState(null)
  const [score, setScore] = useState(0)

  // ── Points + word accuracy ─────────────────────────────────────────────────
  // `score` (above) is "N of M sentences" — pass/fail. These two are additive
  // stats on top of it: `points` rewards harder sentences more (see
  // pointsForExercise), and `wordStats` accumulates PARTIAL credit — how many
  // individual chips landed in their right slot — across the whole session, so
  // a mostly-right wrong answer isn't indistinguishable from a totally
  // scrambled one. `wordResult` is just the latest Check's version of that, for
  // the inline "N of M words" hint on a wrong answer.
  const [points, setPoints] = useState(0)
  const [wordStats, setWordStats] = useState({ correct: 0, total: 0 })
  const [wordResult, setWordResult] = useState(null)

  const available = useMemo(() => exercisesInGroup(group).length, [group])
  const exercise = session[index]

  const start = async () => {
    const ok = await quota.consume()
    if (!ok) return
    setSession(buildSentenceSession(SESSION_LENGTH, group))
    setIndex(0)
    setPlaced([])
    setResult(null)
    setHint(null)
    setScore(0)
    setPoints(0)
    setWordStats({ correct: 0, total: 0 })
    setWordResult(null)
    setPhase('active')
  }

  const place = (chip) => {
    if (result) return
    setPlaced((p) => [...p, chip])
  }

  const unplace = (chip) => {
    if (result) return
    setPlaced((p) => p.filter((c) => c.id !== chip.id))
  }

  const check = () => {
    const correct = isSentenceCorrect(placed, exercise)
    const words = wordAccuracy(placed, exercise)
    setResult(correct ? 'correct' : 'incorrect')
    // Only look for a reason when they got it wrong — and only report one.
    setHint(correct ? null : grammarHint(placed, exercise))
    setWordResult(words)
    setWordStats((w) => ({ correct: w.correct + words.correct, total: w.total + words.total }))
    if (correct) {
      setScore((s) => s + 1)
      setPoints((p) => p + pointsForExercise(exercise))
    }
  }

  const next = () => {
    setBankHeight(0) // different sentence, different bank height
    setPlaced([])
    setResult(null)
    setHint(null)
    setWordResult(null)
    if (index + 1 >= session.length) {
      // `score` already reflects the sentence just checked (check() ran and
      // flushed before this button could be pressed) — so this is the same
      // "was every sentence right" test the results screen uses for `perfect`.
      if (score === session.length) setPoints((p) => p + PERFECT_BONUS)
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
            <Text className="font-serif text-3xl text-stone-900 text-center">{groupTitle}</Text>
            <QuotaBadge {...quota} label="left today" />
          </View>
          <Text className="text-sm font-medium text-stone-700 text-center leading-snug">
            You'll see an English meaning and the Hmong words, shuffled. Tap them back
            into order. {available} sentences, drawn from the examples on the words you study.
          </Text>
        </View>

        <View className={`${CARD} p-5 mb-6 items-center`}>
          <Text className="text-xs uppercase tracking-wider text-clay-600 mb-3">
            Words are colour-coded
          </Text>
          <Legend />
          <Text className="text-xs font-medium text-stone-600 mt-3 text-center">
            Get one wrong and the rule behind it is explained.
          </Text>
        </View>

        <View className="items-center">
          <Button size="lg" onPress={start} disabled={!quota.ready}>
            Start {SESSION_LENGTH} sentences
          </Button>
        </View>
        </View>
      </TabScreen>
    )
  }

  // ── results ───────────────────────────────────────────────────────────────
  if (phase === 'done') {
    // The confetti condition IS "did they get every sentence right" — with the
    // default SESSION_LENGTH that's "5 correct", but it's compared against
    // session.length (not the constant) so a shorter session — fewer than
    // SESSION_LENGTH exercises existed for this group — still gets a truthful
    // "perfect", never a confetti drop that undercounts what was actually asked.
    const perfect = score === session.length
    // Words placed correctly across the WHOLE session, including chips inside
    // sentences that were ultimately wrong — a 90% word-accuracy session reads
    // very differently from a 90% SENTENCE-accuracy one, and this is the number
    // that says so.
    const wordPct = wordStats.total ? Math.round((100 * wordStats.correct) / wordStats.total) : 0
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
                ? 'A perfect run — every sentence, every word.'
                : "Here's the breakdown — every session adds up."}
            </Text>

            {/* Three numbers, not three sentences. `score` (pass/fail) and
                `wordPct` (partial credit, see wordAccuracy in sentenceBuilder.js)
                are genuinely different measurements — a scrambled-but-close
                session can read as e.g. "1 of 5" here and "80%" there, and both
                are true at once. Points folds difficulty + the perfect bonus
                into the one number worth feeling good about. */}
            <View className="flex-row gap-2.5 w-full mb-5">
              <ResultStat icon="check" tone="ocean" value={`${score}/${session.length}`} label="Sentences" />
              <ResultStat icon="star" tone="blush" value={`${wordPct}%`} label="Word accuracy" />
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
  const remaining = exercise.chips.filter((c) => !placed.some((p) => p.id === c.id))
  const complete = placed.length === exercise.tokens.length

  return (
    <TabScreen>
      <Breadcrumbs items={crumbs} />

      <View style={sheetStyle} className={SHEET}>
      {/* ⚠️ ONE ROW OF CHROME, NOT THREE. The counters, the quota badge and the
          progress bar each had their own row, so four bands of status sat
          between the breadcrumbs and the sentence you are actually here to
          build. Everything below is unchanged in CONTENT — the badge still
          shows mid-drill (added 2026-09-12 deliberately: seeing "1 left today"
          while playing is what makes the cap legible instead of a surprise at
          the start of the next session) — it just shares a line now.

          flex-wrap rather than a fixed row: on a narrow phone the badge drops
          to its own line instead of squeezing the counters. */}
      <View className="mb-4">
        <View className="flex-row flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-2">
          <Text className="text-sm font-semibold text-stone-800">
            Sentence {index + 1} of {session.length}
          </Text>
          <Text className="text-sm font-bold text-clay-700">· {score} correct</Text>
          {/* lime-900, not lime-700 — this app's lime scale only defines 200 and
              900 (tailwind.config.js); lime-700 isn't a generated class and was
              rendering with no color at all. */}
          <Text className="text-sm font-bold text-lime-900">· {points} pts</Text>
          <QuotaBadge {...quota} label="left today" />
        </View>
        <ProgressBar value={index} max={session.length} size="sm" />
      </View>

      {/* THE PROMPT — the English, and nothing else.
          ⚠️ TWO LINES REMOVED FROM THIS CARD, and the second one matters.

          · "BUILD THIS" — an eyebrow labelling a sentence that sits above an
            empty slot. The screen already says it.
          · "from Animals · teaches 'miv'" — moved to the feedback panel, where
            it is context worth reading. Here it was A HINT: naming the word the
            exercise teaches tells you one of the Hmong chips before you start,
            which is the answer leaking into the question. */}
      <View className={`${CARD} p-4 mb-3 items-center`}>
        <Text className="font-serif text-2xl text-stone-900 leading-snug text-center">
          {exercise.english}
        </Text>
      </View>

      {/* The tray. Dashed while empty so it reads as a slot to fill. */}
      <View
        // ⚠️ min-h DROPPED 112 → 88 to follow the chips down. It exists so the
        // tray does not jump in height when the first chip lands, so it has to
        // track roughly one row of chips — and a row just lost 12px of padding.
        // Left at 112 it would have opened a band of dead space above the bank.
        className={`rounded-md p-4 mb-4 min-h-[88px] justify-center ${
          placed.length === 0
            ? 'border-2 border-dashed border-cream-400 bg-cream-50/60'
            : CARD
        }`}
      >
        {placed.length === 0 ? (
          // ⚠️ FIRST SENTENCE ONLY. This is an instruction, and an instruction
          // you have already followed four times is furniture. After that the
          // dashed outline alone says "put things here" — which is the whole
          // reason the tray is dashed.
          <Text className="text-sm font-medium text-stone-600 text-center">
            {index === 0 ? 'Tap the words below to build the sentence.' : ' '}
          </Text>
        ) : (
          <View className="flex-row flex-wrap gap-x-2.5 gap-y-2 justify-center">
            {placed.map((chip) => (
              <Chip key={chip.id} chip={chip} placed onPress={() => unplace(chip)} disabled={Boolean(result)} />
            ))}
          </View>
        )}
      </View>

      {/* The bank. ALWAYS mounted, even when empty — see bankHeight above.
          Unmounting it is what made the buttons jump. */}
      <View
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height
          setBankHeight((cur) => (h > cur ? h : cur))
        }}
        // ⚠️ The reserved height and the margin BOTH drop once a result is in.
        // They exist to stop Check and Clear drifting while chips are being
        // used; after Check is pressed there is nothing left to hold still, and
        // Check is only enabled when every token is placed — so the bank is
        // always empty here. Keeping the space just pushes the verdict a bank's
        // height down the screen, away from where the eye already is.
        style={bankHeight && !result ? { minHeight: bankHeight } : undefined}
        className={`flex-row flex-wrap gap-x-2.5 gap-y-2 justify-center ${result ? '' : 'mb-6'}`}
      >
        {remaining.map((chip) => (
          <Chip key={chip.id} chip={chip} onPress={() => place(chip)} disabled={Boolean(result)} />
        ))}
      </View>

      {!result && (
        <View className="gap-2">
          <Button size="xl" onPress={check} disabled={!complete}>
            Check
          </Button>
          {placed.length > 0 && (
            // ⚠️ STILL FILLED, STILL BELOW — both were deliberate and neither
            // changed. A ghost Clear disappeared into the page, and putting it
            // BESIDE Check made the two read as equals when one is the point of
            // the screen and the other is an undo.
            //
            // What changed is only its SIZE: full-width danger-red for an undo
            // shouted louder than Check did, which is the opposite of the
            // hierarchy the two rules above were protecting. Small and centred
            // keeps it findable without competing.
            <View className="items-center">
              <Button size="sm" variant="danger" onPress={() => setPlaced([])}>
                Clear
              </Button>
            </View>
          )}
        </View>
      )}

      {result && (
        <View
          className={`rounded-md p-5 items-center ${
            result === 'correct' ? 'bg-lime-200' : 'bg-cream-200 border border-cream-400'
          }`}
        >
          <Text
            className={`text-base font-bold mb-2 text-center ${
              result === 'correct' ? 'text-lime-900' : 'text-stone-900'
            }`}
          >
            {result === 'correct' ? 'Correct ✓' : 'Not quite'}
          </Text>
          {/* Partial credit — how close the wrong build actually was. Skipped
              on a correct answer: "5 of 5 words" would just restate "Correct". */}
          {result === 'incorrect' && wordResult && (
            <Text className="text-xs font-medium text-stone-600 mb-2 text-center">
              {wordResult.correct} of {wordResult.total} words in the right spot
            </Text>
          )}
          {/* The answer, with the punctuation the chips leave out. */}
          <Text
            className={`font-serif text-2xl mb-1 text-center ${
              result === 'correct' ? 'text-lime-900' : 'text-stone-900'
            }`}
          >
            {exercise.hmong}
          </Text>
          <Text
            className={`text-sm text-center ${
              result === 'correct' ? 'text-lime-900/80' : 'text-stone-700'
            }`}
          >
            {exercise.english}
          </Text>

          {/* Moved here from the prompt card — see the comment there. AFTER the
              answer this is context ("so that was the Animals set, and the word
              it was teaching is miv"); BEFORE it, it was a free hint. */}
          <Text
            className={`text-xs font-medium mt-2 text-center ${
              result === 'correct' ? 'text-lime-900/70' : 'text-stone-600'
            }`}
          >
            from {exercise.categoryTitle} · teaches “{exercise.word}”
          </Text>

          {hint && <GrammarHintCard hint={hint} />}

          <View className="mt-5">
            <Button size="xl" onPress={next}>
              {index + 1 >= session.length ? 'Finish' : 'Next sentence'}
            </Button>
          </View>
        </View>
      )}
      </View>
    </TabScreen>
  )
}

// A word. Bigger and bolder than body text — these are the controls AND the
// content. The tint and the label come from the part of speech, when the
// vocabulary knows one; an untagged word gets neutral cream and no label, which
// is the honest way to say "we're not sure".
function Chip({ chip, placed = false, onPress, disabled }) {
  const tag = tagOf(chip.text)
  const style = tag ? POS_STYLES[tag] : null
  const skin = style
    ? placed
      ? style.placed
      : style.chip
    : placed
      ? 'bg-cream-300 border-cream-500'
      : 'bg-cream-100 border-cream-300'

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      // maxWidth as a static style OBJECT (never a style function — NativeWind
      // drops those on native). Without it a chip whose LABEL is wider than the
      // row — "Classifier" is wider than most Hmong words — can push past the
      // edge instead of wrapping to the next line.
      style={{ maxWidth: '100%' }}
      // ⚠️ py-2.5, NOT py-4 — reduced 2026-09-16. The chips read as too tall:
      // 16px above and below a 24px word is more air than word, and with nine
      // chips wrapping to three rows it pushed Check down the screen.
      //
      // ⚠️ THE HORIZONTAL SIZE IS UNCHANGED ON PURPOSE. px-4 and min-w-[76px]
      // are what keep a chip a comfortable tap target and stop a two-letter
      // word ("ib") becoming a sliver — and min-w is also what the part-of-
      // speech LABEL needs, since "Classifier" is wider than every Hmong token
      // in the set. Only the vertical padding was excessive.
      className={`rounded-md border px-4 py-2.5 min-w-[76px] items-center justify-center active:opacity-70 ${skin}`}
      accessibilityRole="button"
      accessibilityLabel={`${placed ? 'Remove' : 'Add'} ${chip.text}${tag ? `, ${style.name}` : ''}`}
    >
      <Text className="text-2xl font-bold text-stone-900 text-center">{chip.text}</Text>
      {style && (
        // NO `tracking-wider` here. letterSpacing puts the trailing gap INSIDE
        // the text box, so on Android the last letter of "CLASSIFIER" gets
        // clipped and the label sits visibly off-centre. Uppercase + semibold
        // does the same job without the cut.
        <Text className={`text-xs uppercase font-semibold mt-0.5 text-center ${style.label}`}>
          {style.name}
        </Text>
      )}
    </Pressable>
  )
}

function Legend() {
  return (
    <View className="flex-row flex-wrap gap-2 justify-center">
      {POS_ORDER.map((tag) => {
        const s = POS_STYLES[tag]
        return (
          <View key={tag} className={`rounded-md border px-3 py-1.5 items-center ${s.chip}`}>
            {/* Same no-letterSpacing rule as the chips — these are the key to
                them, so they have to look identical. */}
            <Text className={`text-xs uppercase font-semibold text-center ${s.label}`}>
              {s.name}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

// The results-screen icon badge. Two states, not a spectrum — either every
// sentence landed or it didn't, so this is a trophy-vs-award switch rather
// than a meter. Colour comes from the SAME lime the "Correct ✓" panel uses
// above, so "perfect" reads as one consistent colour across the whole screen,
// not a new one invented just for this badge.
function ResultEmblem({ perfect }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const bg = perfect ? 'bg-lime-200' : 'bg-clay-600/12'
  const iconColor = perfect ? `rgb(${t['--c-lime-900']})` : `rgb(${t['--c-clay-600']})`

  return (
    <View className={`h-16 w-16 rounded-full items-center justify-center ${bg}`}>
      <Icon name={perfect ? 'trophy' : 'award'} size={30} color={iconColor} />
    </View>
  )
}

// One result number, in its own tinted tile. Three of these sit side by side —
// see the comment where they're used for why the numbers can't be collapsed
// into one line without losing information.
//
// Tint is an OPACITY modifier on an existing full-strength token (bg-ocean-700/12,
// not e.g. bg-ocean-100), the same trick the Words hub's icon circles use
// (bg-clay-600/12). This app's lime/ocean/blush scales don't all define every
// 100/300 step (tailwind.config.js) — opacity on a step that DOES exist sidesteps
// that entirely instead of adding more shade steps to the config.
const RESULT_TONES = {
  ocean: { bg: 'bg-ocean-700/12', text: 'text-ocean-700', token: '--c-ocean-700' },
  blush: { bg: 'bg-blush-500/12', text: 'text-blush-500', token: '--c-blush-500' },
  clay:  { bg: 'bg-clay-600/12',  text: 'text-clay-700',  token: '--c-clay-600' },
}

function ResultStat({ icon, tone, value, label }) {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const c = RESULT_TONES[tone]

  return (
    <View className={`flex-1 rounded-md ${c.bg} py-3 items-center`}>
      <Icon name={icon} size={18} color={`rgb(${t[c.token]})`} />
      <Text className={`font-serif text-xl mt-1 ${c.text}`}>{value}</Text>
      <Text className="text-[10px] uppercase tracking-wide font-semibold text-stone-600 mt-0.5 text-center">
        {label}
      </Text>
    </View>
  )
}

// The flashing (i). It pulses because it appears mid-drill, under an answer the
// learner is already reading — a static badge in a busy panel gets skipped.
// Inline styles, not className: this is an Animated.View, and NativeWind's
// interop is unreliable on animated nodes (same reason StatusBadge does it).
function FlashingInfo({ theme }) {
  const pulse = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  return (
    <Animated.View
      style={{
        opacity: pulse,
        height: 44,
        width: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `rgb(${t['--c-clay-600']})`,
      }}
    >
      <Text style={{ color: `rgb(${t['--c-cream-50']})`, fontSize: 22, fontWeight: '700' }}>i</Text>
    </Animated.View>
  )
}

// Why the answer was wrong, in one rule, with the lesson behind it one tap away.
function GrammarHintCard({ hint }) {
  const { theme } = useTheme()

  return (
    <View className={`${CARD} p-5 mt-5 items-center w-full`}>
      <Link href={hint.lessonHref} asChild>
        <Pressable
          className="items-center active:opacity-80"
          accessibilityRole="link"
          accessibilityLabel={`${hint.title}. Open the ${hint.lessonLabel}.`}
        >
          <FlashingInfo theme={theme} />
        </Pressable>
      </Link>

      <Text className="font-serif text-xl text-stone-900 mt-3 text-center">{hint.title}</Text>
      <Text className="text-sm font-medium text-stone-700 mt-2 text-center leading-snug">
        {hint.body}
      </Text>

      <Link href={hint.lessonHref} asChild>
        <Button size="sm" className="mt-4">
          {hint.lessonLabel} →
        </Button>
      </Link>
    </View>
  )
}

// The BASE crumbs. The screen appends the group name, and "Sentence builder"
// now links to the hub at /words/sentences rather than being a dead label.
const CRUMBS = [
  { label: 'Home', to: '/' },
  { label: 'Words', to: '/words' },
  { label: 'Sentence builder', to: '/words/sentences' },
]
