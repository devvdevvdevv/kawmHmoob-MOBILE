import { View, Text } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'
import Button from '../ui/Button.jsx'
import { usePronunciation } from '../../hooks/usePronunciation.js'

// RN pronunciation step.
//
// The web version records your voice AND scores your pitch against a native take
// (Web Audio: MediaRecorder + a pitch-detection pass). Porting that is a
// three-box job — see learning/pronunciation/voice-record-step-lesson.md:
//
//   Box 1  record a real WAV        ← WIRED below (format not yet proven on
//                                     Android — see app/spike.jsx §8)
//   Box 2  parse WAV → raw samples  ← next
//   Box 3  pitch track + score      ← after that
//
// Recording + playback work regardless of container, so this ships either way;
// only Boxes 2-3 actually care whether the file is truly uncompressed PCM.
//
// So this screen now does the honest half of the loop: listen to the native
// clip, record yourself, and compare the two BY EAR. That's shippable value on
// its own ("hear yourself vs a native speaker") and it proves the recording
// pipeline before any scoring UI gets built on top of it.
export default function PronounceStep({ phrase, done, onDone }) {
  const hasAudio = Boolean(phrase.audio)

  // All the recorder machinery (permissions, audio session, file uri, playback)
  // lives in the hook — this component only decides what to render for each status.
  const { status, uri, start, stop, playTake, playing } = usePronunciation()

  return (
    <View>
      <View className="items-center mb-6">
        <Text className="font-serif text-4xl text-clay-700 mb-2 text-center">{phrase.hmong}</Text>
        <Text className="text-stone-600 mb-4 text-center">{phrase.english}</Text>
        <View className="flex-row items-center gap-3">
          <AudioButton audioSrc={phrase.audio} wordId={phrase.id} size="lg" />
          <Text className="text-sm text-stone-500">{hasAudio ? 'Listen' : 'No recording yet'}</Text>
        </View>
      </View>

      {phrase.tip && (
        <View className="rounded-md bg-cream-100 border border-cream-200 p-4 mb-6">
          <Text className="text-xs uppercase tracking-wider text-stone-500 mb-1">Tone tip</Text>
          <Text className="text-sm text-stone-700 leading-relaxed">{phrase.tip}</Text>
        </View>
      )}

      {/* Your turn — record, then play it back against the native clip above. */}
      <View className="rounded-md bg-cream-100 border border-cream-200 p-4 mb-6">
        <Text className="text-xs uppercase tracking-wider text-stone-500 mb-3 text-center">
          Your turn
        </Text>

        {/* One button, three jobs — the label and action both follow `status`.
            'denied' disables it rather than letting a tap fail silently. */}
        <Button
          onPress={status === 'recording' ? stop : start}
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
          <Text className="text-sm text-red-600 text-center mt-2">
            Enable mic access in Settings to record yourself.
          </Text>
        )}

        {/* Only offered once a take exists, and never mid-recording. `start()`
            clears `uri`, so this can't play a stale take from a previous try. */}
        {uri && status !== 'recording' && (
          <Button
            variant="ghost"
            onPress={playTake}
            disabled={playing}
            className="w-full mt-2"
          >
            {playing ? '▶ Playing…' : '▶ Play my take'}
          </Button>
        )}

        <Text className="text-xs text-stone-500 text-center mt-3">
          {status === 'recording'
            ? 'Listening… say the phrase, then tap Stop.'
            : 'Tone scoring is coming — for now, compare your take to the native clip by ear.'}
        </Text>
      </View>

      <Button onPress={onDone} className="w-full">
        {done ? '✓ Practiced — Continue' : 'Mark practiced'}
      </Button>
    </View>
  )
}
