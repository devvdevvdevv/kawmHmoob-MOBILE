import { View, Text } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'
import Button from '../ui/Button.jsx'

// RN pronunciation step — SIMPLIFIED from the web PronounceStep.
//
// The web version records your voice and scores your pitch against a native
// take (Web Audio: MediaRecorder + a pitch-detection pass). That pipeline has
// no drop-in RN equivalent — it needs a native audio-record module (expo-av /
// expo-audio) plus an on-device pitch tracker, which is a feature in its own
// right. Until that's built, this screen is honest: listen to the native
// recording, read the tone tip, and mark the phrase practiced. See the Speak
// hub's BetaRibbon.
export default function PronounceStep({ phrase, done, onDone }) {
  const hasAudio = Boolean(phrase.audio)

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

      <View className="rounded-md bg-cream-100 border border-cream-200 p-3 mb-6">
        <Text className="text-xs text-stone-500 text-center">
          🎙️ Recording &amp; tone scoring are coming to the app — for now, listen and repeat out loud.
        </Text>
      </View>

      <Button onPress={onDone} className="w-full">
        {done ? '✓ Practiced — Continue' : 'Mark practiced'}
      </Button>
    </View>
  )
}
