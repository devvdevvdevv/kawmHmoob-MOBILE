import { useEffect, useState } from "react"
import { View, Text, ActivityIndicator, Pressable, Linking } from "react-native"
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from "react-native-reanimated"
import AudioButton from "../common/AudioButton.jsx"
import Button from "../ui/Button.jsx"
import ToneCurve from "./ToneCurve.jsx"
import { useAudio } from "../../hooks/useAudio.js"
import { useRecorder } from "../../hooks/useRecorder.js"
import { useAbCompare } from "../../hooks/useAbCompare.js"
import { scoreTake, REASON_TEXT, scoreBand } from "../../lib/pronounceScore.js"


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// THE STEP COMPONENTS — one per step.type, shared by BOTH presentations:
//   • LessonScroll.jsx  — the shipping chat-style scroll
//   • LessonRunner.jsx  — the ARCHIVED one-step-at-a-time pager
//
// Splitting these out means the two presentations can never disagree about what
// a 'say' step looks like. A presentation decides LAYOUT and PACING; a step
// decides its own content and interaction.
//
// Every step takes ONLY `step` (plus optional callbacks). None of them know
// which presentation is rendering them, or where they sit in a lesson.

// ── The switch ──────────────────────────────────────────────────────────────
// Unknown types fall through to a VISIBLE placeholder rather than rendering
// nothing — a typo in the data should be loud, not silent.
export function Step({ step, onReady }) {
  switch (step.type) {
    case 'intro':
      return <IntroStep step={step} />
    case 'hear':
      return <HearStep step={step} />
    // 'word' — COMMENTED OUT 2026-08-24. It showed the same word immediately
    // before the 'say' step showed it again: two nearly identical cards back to
    // back. SayStep already presents hmong + english + the native clip, so the
    // introduction is not lost. Kept (not deleted) in case a word type earns its
    // place again — e.g. for a word that needs a usage note before practising.
    // case 'word':
    //   return <WordStep step={step} />
    case 'listen':
      // key={} so the reveal resets per step
      return <ListenStep key={step.id} step={step} />
    case 'recall':
      // key={} so the recorder + reveal reset per step
      return <RecallStep key={step.id} step={step} onReady={onReady} />
    case 'say':
      // key={} forces a FRESH component (and recorder) per step. Without it,
      // walking from one 'say' to the next reuses the mounted instance and
      // carries the previous take's score onto the new phrase.
      return <SayStep key={step.id} step={step} onReady={onReady} />
    case 'dialogue':
      return <DialogueStep key={step.id} step={step} onReady={onReady} />
    default:
      return (
        <View className="rounded-md border-2 border-dashed border-cream-200 p-4">
          <Text className="text-stone-500 text-center">
            No UI yet for step type "{step.type}"
          </Text>
        </View>
      )
  }
}

// ── 'hear' ──────────────────────────────────────────────────────────────────
// Takes ONLY `step` and renders. No state, no navigation — the runner owns both.
function HearStep({ step }) {
  return (
    <View className="rounded-md bg-cream-50 p-4 items-center">
      <Text className="text-xs uppercase tracking-wider text-stone-500 mb-2">Listen</Text>
      <Text className="font-serif text-2xl text-clay-700 text-center mb-2">{step.hmong}</Text>
      <Text className="text-lg font-medium text-stone-700 text-center mb-4">{step.english}</Text>
      <AudioButton audioSrc={step.audio} wordId={step.id} size="hero" />
      {!step.audio && <Text className="text-xs text-stone-400 mt-2">no recording yet</Text>}
    </View>
  )
}

// ── 'word' — DISABLED, see the switch above ──────────────────────────────────
// eslint-disable-next-line no-unused-vars
function WordStep({ step }) {
  return (
    <View className="rounded-md bg-cream-50 p-4 items-center">
      <Text className="text-xs uppercase tracking-wider text-stone-500 mb-2">New word</Text>
      <Text className="font-serif text-2xl text-clay-700 text-center mb-2">{step.hmong}</Text>
      <Text className="text-lg font-medium text-stone-700 text-center mb-4">{step.english}</Text>
      <AudioButton audioSrc={step.audio} wordId={step.id} size="hero" />
      {step.note && (
        <View className="rounded-md bg-cream-100 p-3 mt-4 w-full">
          <Text className="text-sm font-medium text-stone-700 leading-relaxed">{step.note}</Text>
        </View>
      )}
    </View>
  )
}

// ── 'say' — imitate it, Hmong on screen ────────────────────────────────────
//
// Record → play back → A/B compare → self-assess. NO SCORE.
//
// WHY NO SCORE HERE (changed 2026-08-24): `say` is PRACTICE, not a test. The
// Hmong is right there on screen — the learner is copying a sound they can see
// and hear, so a number adds nothing except something to feel bad about on a
// step whose whole job is low-stakes repetition.
//
// Scoring lives on `recall`, where it means something: the learner produced the
// phrase from memory, so the number is measuring a real attempt rather than a
// read-aloud.
//
// A/B compare stays, because it IS the right feedback for imitation — hearing
// yourself against the native clip is the point of the step.
function SayStep({ step, onReady }) {
  const { status, uri, start, stop, playTake, playing, reset } = useRecorder()
  const { compare, stop: stopAb, running: abRunning, nowPlaying } = useAbCompare()
  const { playing: soundingId } = useAudio()
  const [selfAssess, setSelfAssess] = useState(null)

  // Same guard as RecallStep: starting a recording while a clip is sounding
  // captures that clip through the mic. Transient — it clears the moment the
  // audio stops, and is never a penalty for having listened.
  const audioSounding = playing || soundingId === step.id

  // Tell the runner a take exists, so Continue can unlock. Gating is on HAVING
  // ATTEMPTED, never on the score — a score can be impossible (no reference
  // contour, level tones), but recording always works.
  useEffect(() => {
    if (uri) onReady?.(true)
  }, [uri, onReady])

  return (
    <View className="rounded-md bg-cream-50 p-4">
      <Text className="text-xs uppercase tracking-wider text-stone-500 mb-2 text-center">
        Your turn
      </Text>
      <Text className="font-serif text-2xl text-clay-700 text-center mb-2">{step.hmong}</Text>
      <Text className="text-lg font-medium text-stone-700 text-center mb-4">{step.english}</Text>

      <View className="flex-row items-center justify-center gap-3 mb-4">
        <AudioButton audioSrc={step.audio} wordId={step.id} size="xl" />
        <Text className="text-sm text-stone-500">
          {step.audio ? 'Native clip' : 'No native clip yet'}
        </Text>
      </View>

      <Button
        size="lg"
        icon={status === 'recording' ? 'square' : 'mic'}
        onPress={status === 'recording' ? stop : start}
        disabled={status === 'denied' || abRunning || audioSounding}
        variant={status === 'recording' ? 'danger' : 'primary'}
      >
        {status === 'recording' ? 'Stop' : uri ? 'Record again' : 'Record'}
      </Button>

      {status === 'denied' && <MicDeniedNotice />}

      {uri && status !== 'recording' && (
        <View className="flex-row gap-2 mt-3">
          <Button className="flex-1" variant="secondary" onPress={playTake} disabled={playing || abRunning}>
            {playing ? 'Playing…' : 'Play mine'}
          </Button>
          {/* A/B compare needs BOTH a native clip and a take. */}
          {step.audio && (
            <Button
              className="flex-1"
              variant="secondary"
              onPress={abRunning ? stopAb : () => compare(step.audio, uri)}
            >
              {abRunning
                ? `Stop ${nowPlaying === 'you' ? '(you)' : '(native)'}`
                : 'A/B compare'}
            </Button>
          )}
        </View>
      )}

      {/* Self-assessment — the human judgement, and on this step the ONLY
          judgement. Advancing is allowed regardless: confidence data, not a lock.
          ⚠️ Deliberately NOT aggregated into a lesson score — shown numbers get
          optimised, and this one the learner assigns themselves. */}
      {uri && status !== 'recording' && (
        <View className="mt-4 pt-3 border-t border-cream-200">
          <Text className="text-xs uppercase tracking-wider text-stone-500 mb-2 text-center">
            How did that sound?
          </Text>
          <View className="flex-row gap-2 justify-center">
            {[
              ['got-it', 'Got it'],
              ['unsure', 'Not sure'],
              ['again', 'Try again'],
            ].map(([value, label]) => (
              <Pressable
                key={value}
                onPress={() => {
                  setSelfAssess(value)
                  // "Try again" should GIVE you another go, not just record a
                  // preference. Clearing the take drops the card back to its
                  // Record state — the same place a fresh step starts.
                  // (Placeholder: eventually this could also re-queue the phrase
                  // later in the lesson. For now it just lets you redo it here.)
                  if (value === 'again') reset()
                }}
                className={`px-3 py-2 rounded-md border ${
                  selfAssess === value
                    ? 'bg-clay-600 border-clay-600'
                    : 'bg-cream-100 border-cream-200'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    selfAssess === value ? 'text-cream-50' : 'text-stone-700'
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}


// ── 'dialogue' — one turn at a time ─────────────────────────────────────────
// The app plays speaker A; the learner records turns marked `record: true`.
// This step DOES own internal state (which turn) — it stays LOCAL to the step,
// while the runner still owns the overall step index.
function DialogueStep({ step, onReady }) {
  const [turnIndex, setTurnIndex] = useState(0)
  const { status, uri, start, stop, playTake, playing } = useRecorder()

  const turns = step.turns || []
  const turn = turns[turnIndex]
  const lastTurn = turnIndex >= turns.length - 1

  // A dialogue is "attempted" once the learner has recorded at least one of
  // their turns AND walked to the end of the exchange. Reaching the last turn
  // alone is not enough — the recording turns are the point.
  const needsRecording = turns.some((t) => t.record)
  useEffect(() => {
    if (lastTurn && (!needsRecording || uri)) onReady?.(true)
  }, [lastTurn, needsRecording, uri, onReady])

  if (!turn) {
    return (
      <View className="rounded-md border-2 border-dashed border-cream-200 p-4">
        <Text className="text-stone-500 text-center">Dialogue has no turns.</Text>
      </View>
    )
  }

  return (
    <View className="rounded-md bg-cream-50 p-4">
      <Text className="text-xs uppercase tracking-wider text-stone-500 mb-3 text-center">
        Conversation · turn {turnIndex + 1} of {turns.length}
      </Text>

      {/* Every turn so far, alternating alignment by speaker so it reads as an
          exchange. Past turns dim; the current one is full strength. */}
      {turns.slice(0, turnIndex + 1).map((t, idx) => (
        <Animated.View
          key={idx}
          // Each turn drifts in from its OWN side — A from the left, B from the
          // right — so the exchange reads as two people rather than a list.
          // 260ms is long enough to register as motion, short enough that a
          // learner tapping quickly never waits on it.
          entering={(t.speaker === 'A' ? FadeInLeft : FadeInRight).duration(260)}
          // ⚠️ style, NOT className — NativeWind does not process className on
          // Animated.View, so both the margin AND the left/right alignment were
          // being dropped. That is why the turns stacked flush and centred.
          style={{
            marginBottom: 16,
            alignItems: t.speaker === 'A' ? 'flex-start' : 'flex-end',
            opacity: idx === turnIndex ? 1 : 0.45,
          }}
        >
          <View
            className={`rounded-md p-4 max-w-[85%] ${
              t.speaker === 'A' ? 'bg-cream-100' : 'bg-clay-600'
            }`}
          >
            <Text
              className={`font-serif text-lg ${
                t.speaker === 'A' ? 'text-stone-900' : 'text-cream-50'
              }`}
            >
              {t.hmong}
            </Text>
            <Text
              className={`text-sm font-medium mt-1 ${
                t.speaker === 'A' ? 'text-stone-600' : 'text-cream-200'
              }`}
            >
              {t.english}
            </Text>
          </View>
          {idx === turnIndex && !t.record && (
            <View className="mt-2">
              <AudioButton audioSrc={t.audio} wordId={`${step.id}-${idx}`} size="lg" />
            </View>
          )}
        </Animated.View>
      ))}

      {turn.record ? (
        <View className="mt-4">
          <Button
            size="lg"
            icon={status === 'recording' ? 'square' : 'mic'}
            onPress={status === 'recording' ? stop : start}
            disabled={status === 'denied'}
            variant={status === 'recording' ? 'danger' : 'primary'}
          >
            {status === 'recording' ? 'Stop' : uri ? 'Record again' : 'Your line'}
          </Button>

          {status === 'denied' && <MicDeniedNotice />}
          {uri && status !== 'recording' && (
            <View className="mt-3">
              <Button variant="secondary" onPress={playTake} disabled={playing}>
                {playing ? 'Playing…' : 'Play my take'}
              </Button>
            </View>
          )}
        </View>
      ) : null}

      {!lastTurn && (
        <View className="mt-4">
          <Button variant="secondary" onPress={() => setTurnIndex((n) => n + 1)}>
            Next line
          </Button>
        </View>
      )}
      {lastTurn && (
        <Text className="text-xs text-stone-500 text-center mt-4">
          End of conversation — hit Finish below.
        </Text>
      )}
    </View>
  )
}

// ── 'intro' — set the scene before any Hmong appears ────────────────────────
// Two jobs: orient the learner (what is this, how long will it take) and, on
// the very first lesson, welcome them to the app at all.
//
// Deliberately has NO audio and NO interaction. A learner who just opened a
// language app should not be asked to do anything in the first three seconds.
function IntroStep({ step }) {
  return (
    <View className="rounded-md bg-cream-50 p-4">
      {step.emoji && (
        <Text className="text-4xl text-center mb-3">{step.emoji}</Text>
      )}
      <Text className="font-serif text-xl text-stone-900 text-center mb-3">
        {step.title}
      </Text>
      {(step.body || []).map((line, i) => (
        <Text
          key={i}
          className="text-stone-700 text-center leading-relaxed mb-3"
        >
          {line}
        </Text>
      ))}
      {step.duration && (
        <View className="mt-4 pt-3 border-t border-cream-200">
          <Text className="text-xs text-stone-500 text-center">
            ⏱ About {step.duration}
          </Text>
        </View>
      )}
    </View>
  )
}

// ── 'recall' — produce it from memory ───────────────────────────────────────
//
// The learner sees ONLY the English and has to produce the Hmong themselves.
// The answer stays hidden until they ask for it.
//
// WHY THIS EXISTS SEPARATELY FROM 'say':
//   'say'    shows the Hmong → IMITATION. Can you copy this sound?
//   'recall' hides it        → PRODUCTION. Can you retrieve it unaided?
//
// Recognition is much easier than recall, and only recall is what speaking
// actually demands. A lesson that never hides the answer teaches you to read
// Hmong aloud, not to speak it.
//
// Recording is ALWAYS available. Hearing the answer first makes the attempt
// imitation rather than retrieval, which is a weaker exercise — but that is the
// learner's call to make, not something to punish. The reveal panel says so and
// then gets out of the way.
function RecallStep({ step, onReady }) {
  const { status, uri, start, stop, playTake, playing } = useRecorder()
  const { compare, stop: stopAb, running: abRunning, nowPlaying } = useAbCompare()
  const { playing: soundingId } = useAudio()
  const [revealed, setRevealed] = useState(false)
  const [result, setResult] = useState(null)
  const [scoring, setScoring] = useState(false)

  // Tell the runner a take exists, so Continue can unlock. Gating is on HAVING
  // ATTEMPTED, never on the score.
  useEffect(() => {
    if (uri) onReady?.(true)
  }, [uri, onReady])

  // ⚠️ TRANSIENT ONLY — this exists so the mic does not record the SPEAKER.
  // Starting a recording while a clip is sounding captures that clip, and the
  // take is then scored against audio it already contains.
  //
  // It used to be `heardAnswer && !uri`, meant as "hearing the answer ends the
  // recall". That was a DEADLOCK: `heardAnswer` never reset, and `uri` could
  // never become set because recording was disabled — so playing the answer
  // before recording killed that step's Record button PERMANENTLY, with no way
  // back short of leaving the lesson.
  //
  // `playing` is the learner's own take; `soundingId` is whatever clip the
  // shared audio player has going, which is this step's when its id matches.
  const audioSounding = playing || soundingId === step.id

  const runScore = async () => {
    if (!uri) return
    setScoring(true)
    try {
      setResult(await scoreTake(uri, step.audio))
    } catch (e) {
      setResult({ score: null, ref: [], user: [], reason: 'error', error: e.message })
    } finally {
      setScoring(false)
    }
  }

  return (
    <View className="rounded-md bg-clay-600 border border-clay-600 p-4">
      {/* Visually inverted from the practice cards — this is a TEST, and it
          should feel different the moment it appears. */}
      <Text className="text-xs uppercase tracking-wider text-cream-200 mb-2 text-center">
        From memory
      </Text>

      <Text className="text-cream-200 text-center text-sm mb-1">How do you say</Text>
      <Text className="font-serif text-2xl text-cream-50 text-center mb-1">
        &ldquo;{step.english}&rdquo;
      </Text>
      <Text className="text-cream-200 text-center text-sm mb-3">in Hmong?</Text>

      <Button
        size="lg"
        icon={status === 'recording' ? 'square' : 'mic'}
        onPress={status === 'recording' ? stop : start}
        disabled={status === 'denied' || abRunning || audioSounding}
        variant={status === 'recording' ? 'danger' : 'secondary'}
      >
        {status === 'recording' ? 'Stop' : uri ? 'Record again' : 'Say it'}
      </Button>

      {status === 'denied' && <MicDeniedNotice />}

      {audioSounding && status !== 'recording' && (
        <Text className="text-[10px] text-cream-200 text-center mt-2 opacity-80">
          paused while audio plays — so the mic doesn't catch it
        </Text>
      )}

      {uri && status !== 'recording' && (
        <View className="flex-row gap-2 mt-3">
          <Button className="flex-1" variant="secondary" onPress={playTake} disabled={playing || abRunning}>
            {playing ? 'Playing…' : 'Play mine'}
          </Button>
          <Button className="flex-1" variant="secondary" onPress={runScore} disabled={scoring || abRunning}>
            {scoring ? '…' : 'Score'}
          </Button>
          {step.audio && revealed && (
            <Button
              className="flex-1"
              variant="secondary"
              onPress={abRunning ? stopAb : () => compare(step.audio, uri)}
            >
              {abRunning ? 'Stop' : 'A/B'}
            </Button>
          )}
        </View>
      )}

      {/* ── The answer ────────────────────────────────────────────────────────
          Hidden until asked for — the retrieval effort is the point, and a timer
          would hand it over exactly when the learner was about to remember.

          The reveal is a proper panel rather than an underlined link: it is the
          most important control on the card, and a learner reaching for it is
          usually mid-struggle and should not have to aim at 10px of text. */}
      <View className="mt-3 pt-3 border-t border-cream-200/25">
        {!revealed ? (
          <Pressable
            onPress={() => setRevealed(true)}
            className="rounded-md bg-cream-50/10 /30 py-3 items-center"
          >
            {/* font-serif, not font-semibold: font-semibold on an unmapped Nunito
                Sans weight renders regular on Android. font-serif IS Nunito Bold. */}
            <Text className="font-serif text-lg text-cream-50">Reveal the answer</Text>
            {/* Subtext removed — the label carries the card now. Restore with:
            <Text className="text-[10px] text-cream-200 mt-0.5">
              {uri ? 'check how you did' : 'you can still record afterwards'}
            </Text> */}
          </Pressable>
        ) : (
          <View className="items-center">
            <Text className="text-[10px] uppercase tracking-wider text-cream-200 mb-1">
              Answer
            </Text>
            <Text className="font-serif text-2xl text-cream-50 text-center mb-3">
              {step.hmong}
            </Text>
            <AudioButton audioSrc={step.audio} wordId={step.id} size="lg" />
            {!step.audio && (
              <Text className="text-[10px] text-cream-200 mt-2 opacity-70">
                no recording yet
              </Text>
            )}
          </View>
        )}
      </View>

      {scoring && <ActivityIndicator className="mt-3" color="#fff" />}

      {result && !scoring && (
        <View className="mt-2">
          {result.score != null ? (
            // Band first, number second and small. The band is the honest claim;
            // the raw number is kept only because the scorer is still being
            // tuned and it is useful while calibrating. See scoreBand().
            <View className="items-center mb-2">
              <Text className="font-serif text-2xl text-cream-50 text-center">
                {scoreBand(result.score)?.label}
              </Text>
              <Text className="text-xs text-cream-200 text-center mt-1">
                {scoreBand(result.score)?.hint}
              </Text>
              <Text className="text-[10px] text-cream-200 opacity-60 mt-1">
                {result.score}/100
              </Text>
            </View>
          ) : (
            <Text className="text-xs text-cream-200 text-center mb-2">
              {REASON_TEXT[result.reason] || result.error || 'Could not score that take.'}
            </Text>
          )}
          <ToneCurve refCurve={result.ref} user={result.user} nowPlaying={nowPlaying} />
        </View>
      )}
    </View>
  )
}

/**
 * Shown when microphone permission has been refused.
 *
 * ⚠️ WITHOUT THIS THE MODULE IS A DEAD END. A denied permission only greyed the
 * Record button out — no reason given, no way forward. On iOS especially, once
 * refused, the ONLY route back is the system Settings app: the OS will not ask
 * again, so an in-app retry button cannot work. That learner had silently and
 * permanently lost the feature.
 */
function MicDeniedNotice() {
  return (
    <View className="rounded-md bg-cream-100 p-3 mt-3">
      <Text className="text-xs text-stone-700 leading-relaxed mb-2">
        Microphone access is off, so recording is unavailable. You can still play
        the native clip and practise out loud.
      </Text>
      <Pressable
        onPress={() => Linking.openSettings()}
        accessibilityRole="button"
        className="self-start rounded-md bg-cream-200 px-3 py-1.5 active:bg-cream-300"
      >
        <Text className="text-xs font-semibold text-stone-800">Open Settings</Text>
      </Pressable>
    </View>
  )
}

// ── 'listen' — the OPPOSITE direction: can you understand it? ───────────────
//
// Plays the Hmong and asks what it MEANS. The English is hidden until revealed.
//
// WHY THIS EXISTS ALONGSIDE 'recall':
//   'recall' shows English → learner produces Hmong  = PRODUCTION
//   'listen' plays Hmong   → learner recalls English = COMPREHENSION
//
// They are different skills and only training one leaves a real hole. A learner
// who has only ever done `recall` can SAY "ua tsaug" but may not recognise it
// when a Hmong speaker says it to THEM — which is the actual failure mode in a
// conversation, where you hear before you speak.
//
// No recording here, deliberately. The answer is in English; scoring an English
// take against a Hmong reference would be meaningless, and asking someone to say
// "thank you" out loud teaches nothing. This step is a self-check: listen,
// commit to an answer in your head, reveal, be honest.
//
// That makes it the one step type with NO gate — there is no attempt to detect.
function ListenStep({ step }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <View className="rounded-md bg-cream-50 border-2 border-clay-600/30 p-4">
      <Text className="text-xs uppercase tracking-wider text-stone-500 mb-2 text-center">
        What does this mean?
      </Text>

      <View className="items-center mb-3">
        <AudioButton audioSrc={step.audio} wordId={step.id} size="hero" />
        {!step.audio && (
          <Text className="text-[10px] text-stone-400 mt-2">no recording yet</Text>
        )}
      </View>

      {/* The Hmong is shown as well as played. Hiding it would test LISTENING in
          isolation, which is a harder and different skill — and unfair when the
          audio may not exist yet. Reading it while hearing it is the goal here. */}
      <Text className="font-serif text-2xl text-clay-700 text-center mb-3">
        {step.hmong}
      </Text>

      <View className="pt-3 border-t border-cream-200">
        {!revealed ? (
          <Pressable
            onPress={() => setRevealed(true)}
            className="rounded-md bg-cream-100 py-3 items-center"
          >
            {/* Matches the "Reveal the answer" panel above: font-serif (real bold
                on Android), text-lg, no subtext. */}
            <Text className="font-serif text-lg text-stone-700">
              Reveal the meaning
            </Text>
            {/* Subtext removed alongside the other reveal panel. Restore with:
            <Text className="text-[10px] text-stone-500 mt-0.5">
              answer in your head first
            </Text> */}
          </Pressable>
        ) : (
          <View className="items-center">
            <Text className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">
              Means
            </Text>
            <Text className="text-xl font-medium text-stone-900 text-center">{step.english}</Text>
          </View>
        )}
      </View>
    </View>
  )
}
