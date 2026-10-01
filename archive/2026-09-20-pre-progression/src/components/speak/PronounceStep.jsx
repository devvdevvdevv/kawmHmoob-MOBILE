import { useState } from 'react'
import { View, Text } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'
import Button from '../ui/Button.jsx'
import ToneCurve from './ToneCurve.jsx'
import { useRecorder, RECORDING_IS_ANALYSABLE } from '../../hooks/useRecorder.js'
import { useAbCompare } from '../../hooks/useAbCompare.js'
import { scoreTake, scoreBand, REASON_TEXT } from '../../lib/pronounceScore.js'
import { syllableTones } from '../../lib/hmongTone.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// RN pronunciation step — the SPEAKING module (the Conversations lessons are a
// different flow, in LessonSteps.jsx / LessonScroll.jsx).
//
// The three-box pipeline from learning/pronunciation/voice-record-step-lesson.md
// is now complete here:
//
//   Box 1  record a real WAV        ← useRecorder (expo-audio on iOS, @siteed PCM
//                                     on Android — see the hook for why two)
//   Box 2  parse WAV → raw samples  ← wavDecode, inside scoreTake
//   Box 3  pitch track + score      ← yin + toneScore, inside scoreTake
//
// ⚠️ WHY useRecorder AND NOT usePronunciation (this reverses a deliberate choice).
// This step used to use usePronunciation on purpose: it only played your take
// back, never scored it, so Android's AAC was fine and routing through
// useRecorder would have pulled @siteed into the Speak tab "for no functional
// gain". That last clause is what changed — this step now scores, scoring needs
// PCM, and PCM on Android is exactly what @siteed provides. The gain is the
// feature. @siteed already ships in the Conversations flow through this same
// hook, so this adds no new native dependency.
export default function PronounceStep({ phrase, done, onDone }) {
  const hasAudio = Boolean(phrase.audio)
  const { status, uri, start, stop, playTake, playing } = useRecorder()

  // ⚠️ A/B COMPARE — ADDED 2026-09-12, and it was already built. The Conversations
  // lessons (LessonSteps.jsx) have had native → you → native since 2026-08-24;
  // this screen, which is where a learner drills a SINGLE phrase, had only
  // "Play mine". Hearing your take alone tells you almost nothing: pitch memory
  // for a tone lasts a few seconds, so by the time you replay yourself the
  // target is gone. The sandwich is the whole point.
  //
  // ⚠️ RENAMED TO stopAb — useRecorder already exports `stop` (stop recording).
  // Two different stops in one scope is how the wrong one gets called.
  const { compare, stop: stopAb, running: abRunning, nowPlaying } = useAbCompare()

  const [result, setResult] = useState(null)
  const [scoring, setScoring] = useState(false)

  // Derived from the RPA spelling, so it is right for every phrase without
  // anyone authoring a sentence about it. See src/lib/hmongTone.js.
  const syllables = syllableTones(phrase.hmong)

  const runScore = async () => {
    if (!uri) return
    setScoring(true)
    try {
      setResult(await scoreTake(uri, phrase.audio))
    } catch (e) {
      setResult({ score: null, ref: [], user: [], reason: 'error', error: e.message })
    } finally {
      setScoring(false)
    }
  }

  // A new take invalidates the old score — leaving it on screen would attribute
  // the previous attempt's curve to this one.
  const startTake = () => {
    setResult(null)
    start()
  }

  return (
    <View>
      <View className="items-center mb-6">
        <Text className="font-serif text-4xl text-clay-700 mb-2 text-center">{phrase.hmong}</Text>
        <Text className="text-stone-600 mb-4 text-center">{phrase.english}</Text>
        <View className="flex-row items-center gap-3">
          <AudioButton audioSrc={phrase.audio} wordId={phrase.id} size="lg" />
          <Text className="font-sans text-sm text-stone-500">
            {hasAudio ? 'Listen' : 'No recording yet'}
          </Text>
        </View>
      </View>

      {/* ── Tones in this phrase ──────────────────────────────────────────────
          Replaced the hand-written "Tone tip" prose panel. This is read off the
          spelling instead: one row per syllable, naming the tone it carries and
          the letter that marks it. Restore the old panel with:

          {phrase.tip && (
            <View className="rounded-md bg-cream-100 p-4 mb-6">
              <Text className="text-xs uppercase tracking-wider text-stone-500 mb-1">Tone tip</Text>
              <Text className="text-sm font-medium text-stone-700 leading-relaxed">{phrase.tip}</Text>
            </View>
          )} */}
      {syllables.length > 0 && (
        <View className="rounded-md bg-cream-100 p-4 mb-6">
          <Text className="font-sans text-xs uppercase tracking-wider text-stone-500 mb-2">
            Tones in this phrase
          </Text>
          {syllables.map((s, i) => (
            <View
              key={`${s.text}-${i}`}
              className={`flex-row items-baseline justify-between py-1.5 ${
                i > 0 ? 'border-t border-cream-200' : ''
              }`}
            >
              <Text className="font-serif text-lg text-clay-700">{s.text}</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="font-sans text-sm text-stone-700">{s.name}</Text>
                {/* The marker letter is the rule made visible: it is the last
                    letter of the syllable you just read. */}
                <Text className="font-sans text-xs text-stone-500 w-6 text-right">
                  {s.marker ? `-${s.marker}` : '—'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Your turn — record, score against the native clip, or compare by ear. */}
      <View className="rounded-md bg-cream-100 p-4 mb-6">
        <Text className="font-sans text-xs uppercase tracking-wider text-stone-500 mb-3 text-center">
          Your turn
        </Text>

        {/* One button, three jobs — the label and action both follow `status`.
            'denied' disables it rather than letting a tap fail silently. */}
        <Button
          onPress={status === 'recording' ? stop : startTake}
          disabled={status === 'denied'}
          variant={status === 'recording' ? 'danger' : 'primary'}
          className="w-full"
        >
          {status === 'recording'
            ? '⏹ Stop recording'
            : status === 'denied'
              ? '🚫 Mic blocked'
              : uri
                ? '🎙️ Record again'
                : '🎙️ Record'}
        </Button>

        {status === 'denied' && (
          <Text className="font-sans text-sm text-red-600 text-center mt-2">
            Enable mic access in Settings to record yourself.
          </Text>
        )}

        {/* Only offered once a take exists, and never mid-recording. `start()`
            clears `uri`, so this cannot play a stale take from a previous try. */}
        {uri && status !== 'recording' && (
          <View className="flex-row gap-2 mt-2">
            <Button
              variant="ghost"
              icon="music"
              onPress={playTake}
              disabled={playing || abRunning}
              className="flex-1"
            >
              {playing ? 'Playing…' : 'Play mine'}
            </Button>
            {/* Web records webm/opus, which the decoder cannot read — so the
                button is hidden there rather than offered and always failing. */}
            {RECORDING_IS_ANALYSABLE && (
              <Button onPress={runScore} disabled={scoring} className="flex-1">
                {scoring ? 'Scoring…' : 'Score my tone'}
              </Button>
            )}
          </View>
        )}

        {/* ⚠️ ITS OWN ROW, NOT A THIRD BUTTON ABOVE. Three flex-1 buttons on a
            360px screen get ~104px each after the card padding and gaps, and
            "Score my tone" alone needs about that at 14px — the labels would
            wrap or clip. Same arithmetic that broke the reader's toolbar
            (notes/2026-09-08-reading-module-visual-system.md).

            ⚠️ NEEDS BOTH A NATIVE CLIP AND A TAKE. Without `hasAudio` this
            offers a comparison against nothing: useAbCompare returns early on a
            missing src, so the button would look live and do nothing. */}
        {uri && status !== 'recording' && hasAudio && (
          <Button
            variant="secondary"
            onPress={abRunning ? stopAb : () => compare(phrase.audio, uri)}
            className="w-full mt-2"
          >
            {abRunning
              ? `Stop ${nowPlaying === 'you' ? '(you)' : '(native)'}`
              : 'A/B compare · native → you → native'}
          </Button>
        )}

        <Text className="font-sans text-xs text-stone-500 text-center mt-3">
          {status === 'recording'
            ? 'Listening… say the phrase, then tap Stop.'
            : hasAudio
              ? 'Record yourself, then compare by ear or score your pitch against the native clip.'
              : 'Record yourself and play it back. Scoring needs a native clip.'}
        </Text>
      </View>

      {/* ── Result ────────────────────────────────────────────────────────────
          The curve is the honest part: two lines cannot be "wrong", they show
          WHERE the tone went flat. The band leads because a bare number cannot
          tell a learner whether it was good — see scoreBand(). */}
      {result && (
        <View className="rounded-md bg-cream-50 p-4 mb-6 items-center">
          {result.score != null ? (
            <View className="items-center mb-2">
              <Text className="font-serif text-2xl text-stone-900 text-center">
                {scoreBand(result.score)?.label}
              </Text>
              <Text className="font-sans text-xs text-stone-600 text-center mt-1">
                {scoreBand(result.score)?.hint}
              </Text>
              <Text className="font-sans text-[10px] text-stone-500 opacity-70 mt-1">
                {result.score}/100
              </Text>
            </View>
          ) : (
            <Text className="font-sans text-xs text-stone-600 text-center mb-2">
              {REASON_TEXT[result.reason] || result.error || 'Could not score that take.'}
            </Text>
          )}
          <ToneCurve refCurve={result.ref} user={result.user} />
        </View>
      )}

      {/* Gated on a FINISHED take: you can't mark a phrase practiced without
          having said it. `status !== 'recording'` is the "finished" half —
          mid-recording there is a uri from the previous try, not this one.

          `done ||` is the escape hatch: a phrase already practiced keeps its
          button on a later visit, so returning to it isn't a dead end that
          demands a fresh recording just to move on. */}
      {done || (uri && status !== 'recording') ? (
        <Button onPress={onDone} className="w-full">
          {done ? '✓ Practiced — Continue' : 'Mark practiced'}
        </Button>
      ) : (
        // Without this the screen just ends, and the missing button reads as a
        // bug rather than as something you haven't done yet.
        <Text className="font-sans text-xs text-stone-500 text-center">
          Record yourself to finish this phrase.
        </Text>
      )}
    </View>
  )
}
