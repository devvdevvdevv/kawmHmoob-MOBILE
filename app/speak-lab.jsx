// ─────────────────────────────────────────────────────────────────────────────
// 🧪 SPEAK LAB — sandbox for the Natulang-style lesson flow.
//
// Route: /speak-lab   (file-based routing — this file IS the route.)
// Reached from /dev. AdminGate guards it, because a deep link walks past a
// hidden menu item (same reasoning as /spike).
//
// TOUCHES NOTHING IN THE REAL SPEAK MODULE. It reads src/data/speakLab.js and
// reuses read-only pieces (usePronunciation, AudioButton). app/(tabs)/speak.jsx,
// src/data/speak.js, and the group/family screens are untouched.
//
// THE ARCHITECTURE: a lesson is a SCRIPT of TYPED steps; this screen is a switch
// on step.type. One index walks the script. Adding an interaction = one new type
// + one new branch.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import TabScreen from '../src/components/TabScreen.jsx'
import AdminGate from '../src/components/common/AdminGate.jsx'
import AudioButton from '../src/components/common/AudioButton.jsx'
import Button from '../src/components/ui/Button.jsx'
import ToneCurve from '../src/components/speak/ToneCurve.jsx'
import { usePronunciation } from '../src/hooks/usePronunciation.js'
import { scoreTake, REASON_TEXT } from '../src/lib/pronounceScore.js'
import { LAB_LESSON } from '../src/data/speakLab.js'

export default function SpeakLab() {
  return (
    <AdminGate>
      <TabScreen>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text className="font-serif text-3xl text-stone-900 mb-1">Speak Lab 🧪</Text>
          <Text className="text-stone-600 mb-6">{LAB_LESSON.title}</Text>
          <LessonRunner lesson={LAB_LESSON} />
        </ScrollView>
      </TabScreen>
    </AdminGate>
  )
}

// The stepper. Deliberately dumb: it owns ONE piece of state (which step we're
// on) and delegates everything about WHAT a step looks like to <Step>.
function LessonRunner({ lesson }) {
  const [i, setI] = useState(0)
  const steps = lesson.steps
  const step = steps[i]
  const last = i >= steps.length - 1

  const next = () => setI((n) => Math.min(steps.length - 1, n + 1))
  const back = () => setI((n) => Math.max(0, n - 1))

  return (
    <View>
      {/* progress */}
      <Text className="text-sm text-stone-500 mb-1">
        Step {i + 1} of {steps.length} · {step.type}
      </Text>
      <View className="h-2 rounded-full bg-cream-200 mb-6 overflow-hidden">
        <View className="h-full bg-clay-600" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
      </View>

      <Step step={step} />

      <View className="flex-row gap-3 mt-8">
        {i > 0 && (
          <Button variant="secondary" onPress={back}>Back</Button>
        )}
        {!last && <Button onPress={next}>Next</Button>}
        {last && <Text className="text-stone-600 self-center">End of script 🎉</Text>}
      </View>
    </View>
  )
}

// ── The switch. THIS is where you build. ────────────────────────────────────
// One branch per step.type. 'hear' is done as the worked example; the rest are
// yours. Unknown types fall through to a visible placeholder rather than
// rendering nothing — so a typo in the data is loud, not silent.
function Step({ step }) {
  switch (step.type) {
    case 'hear':
      return <HearStep step={step} />

    case 'say':
      // key={} forces a FRESH component (and fresh recorder state) per step.
      // Without it, walking from one 'say' to the next reuses the mounted
      // instance and you carry the previous take's score onto the new phrase.
      return <SayStep key={step.hmong} step={step} />

    // TODO 1 — 'word': show hmong + english + AudioButton. No recording yet.
    // TODO 3 — 'build': render step.parts as chips the user taps in order.
    // TODO 4 — 'dialogue': map step.turns, alternating alignment by speaker.

    default:
      return (
        <View className="rounded-md border-2 border-dashed border-cream-200 p-6">
          <Text className="text-stone-500 text-center">
            No UI yet for step type "{step.type}"
          </Text>
        </View>
      )
  }
}

// ── Worked example: the simplest step type ──────────────────────────────────
// Note it takes ONLY `step` and renders. No state, no navigation — the runner
// owns those. Every step type you add should stay this dumb.
function HearStep({ step }) {
  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-6 items-center">
      <Text className="text-xs uppercase tracking-wider text-stone-500 mb-3">Listen</Text>
      <Text className="font-serif text-2xl text-clay-700 text-center mb-2">{step.hmong}</Text>
      <Text className="text-stone-600 text-center mb-4">{step.english}</Text>
      <AudioButton audioSrc={step.audio} wordId={step.id || step.hmong} size="lg" />
      {!step.audio && <Text className="text-xs text-stone-400 mt-2">no recording yet</Text>}
    </View>
  )
}

// ── The full pipeline, end to end ───────────────────────────────────────────
// Record → read bytes → decode WAV → track pitch → align to the reference →
// score. scoreTake() hides all four steps; this component only deals with the
// three things a learner can be in: not recorded yet, working, got a result.
//
// Note what it does NOT do: block progress. There is no reference contour for
// most phrases yet (src/data/contours.json is empty until the offline extract
// runs), and Android cannot produce PCM at all — so a score is a BONUS, never a
// gate. Every failure path still leaves the learner able to hear themselves.
function SayStep({ step }) {
  const { status, uri, start, stop, playTake, playing } = usePronunciation()
  const [result, setResult] = useState(null)
  const [scoring, setScoring] = useState(false)

  // Scoring is a SEPARATE tap, not automatic on stop, for a real reason:
  // `stop()` updates the hook's `uri` state, but this render's closure still
  // holds the OLD value — state changes aren't visible until the next render.
  // Auto-scoring here would score the PREVIOUS take, or nothing at all on the
  // first one. Making it an explicit tap sidesteps the stale closure entirely
  // and lets the learner listen before asking to be judged.
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
    <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
      <Text className="text-xs uppercase tracking-wider text-stone-500 mb-3 text-center">
        Your turn
      </Text>
      <Text className="font-serif text-2xl text-clay-700 text-center mb-1">{step.hmong}</Text>
      <Text className="text-stone-600 text-center mb-4">{step.english}</Text>

      <View className="flex-row items-center justify-center gap-3 mb-5">
        <AudioButton audioSrc={step.audio} wordId={step.hmong} size="lg" />
        <Text className="text-sm text-stone-500">
          {step.audio ? 'Native clip' : 'No native clip yet'}
        </Text>
      </View>

      <Button
        onPress={status === 'recording' ? stop : start}
        disabled={status === 'denied'}
        variant={status === 'recording' ? 'danger' : 'primary'}
      >
        {status === 'recording' ? 'Stop' : uri ? 'Record again' : 'Record'}
      </Button>

      {uri && status !== 'recording' && (
        <View className="flex-row gap-3 mt-3">
          <Button variant="secondary" onPress={playTake} disabled={playing}>
            {playing ? 'Playing…' : 'Play my take'}
          </Button>
          <Button variant="secondary" onPress={runScore} disabled={scoring}>
            {scoring ? 'Scoring…' : 'Score it'}
          </Button>
        </View>
      )}

      {scoring && <ActivityIndicator className="mt-4" />}

      {result && !scoring && (
        <View className="mt-5">
          {result.score != null ? (
            <Text className="font-serif text-5xl text-clay-700 text-center mb-2">
              {result.score}
            </Text>
          ) : (
            <Text className="text-sm text-stone-700 text-center mb-3">
              {REASON_TEXT[result.reason] || result.error || 'Could not score that take.'}
            </Text>
          )}

          {/* The curve is the real feedback — a number says "68", the curve
              says WHERE you went flat. Shown whenever there is any user data,
              score or not. */}
          <ToneCurve refCurve={result.ref} user={result.user} />

          {__DEV__ && result.error && (
            <Text className="text-xs text-stone-500 mt-3">{result.error}</Text>
          )}
        </View>
      )}
    </View>
  )
}
