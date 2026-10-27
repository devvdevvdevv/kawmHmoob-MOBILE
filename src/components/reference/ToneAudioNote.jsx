import { View, Text } from 'react-native'
import { TONE_AUDIO_NOTICE } from '../../data/reference.js'

// THE FLAG ON EVERY TONE RECORDING — 2026-10-18.
//
// ⚠️ IT SAYS TWO THINGS AND BOTH MATTER: the clips are a first version, and the tones in
// them are exaggerated ON PURPOSE. The wording lives in TONE_AUDIO_NOTICE
// (src/data/reference.js) so the four screens that play these clips cannot drift apart —
// the tones tab, /tone/<marker>, /vowel/<letter>, and the vowel × tone grid.
//
// ⚠️ A QUIET NOTE, NOT A BANNER. `BetaRibbon` exists for "this feature is unfinished" and
// is an orange block; this is a standing fact about audio that a learner will meet on
// every one of those screens, so it has to be readable and ignorable at the same time. An
// orange block four times over trains people to skip it — and this is the one notice that
// stops someone thinking a native speaker is wrong later.
//
// `v1` carries the "first version" half visually, so the sentence does not have to open
// with it.
export default function ToneAudioNote({ className = '' }) {
  return (
    <View className={`rounded-md bg-cream-100 px-3.5 py-3 flex-row items-start gap-2.5 ${className}`}>
      <View className="rounded-full bg-clay-600 px-2 py-0.5 mt-0.5">
        <Text className="text-[10px] font-bold uppercase tracking-wide text-cream-50">v1</Text>
      </View>
      <Text className="flex-1 text-xs font-medium text-stone-700 leading-relaxed">
        {TONE_AUDIO_NOTICE}
      </Text>
    </View>
  )
}
