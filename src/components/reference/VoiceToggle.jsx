import { View, Text, Pressable } from 'react-native'
import { VOICES } from '../../lib/voicePrefs.js'
import Icon from '../ui/Icon.jsx'

// Male / Female — which recorded speaker LetterGrid's audio buttons play.
// Added 2026-10-24 alongside the first second-speaker recordings (Emily,
// female, double consonants).
//
// ⚠️ PLAIN className, NOT style — this is a plain Pressable/View, not an
// Animated one, so NativeWind's className works fine here (the
// function-style-style trap only hits react-native-reanimated components).
//
// ⚠️ SHOWN EVEN THOUGH ONLY DOUBLE CONSONANTS HAVE A FEMALE VOICE TODAY.
// Flipping it changes nothing for single consonants, triples, quads or vowels —
// pickVoice() falls back to the one existing voice wherever a second hasn't
// been recorded — so the toggle is honest about being app-wide and just has
// nothing to do yet outside Double. Scoping the control to one group would
// have been more precise today and wrong the next time a second voice lands
// somewhere else.
//
// ⚠️ RESTYLED 2026-10-25 — the author: "make the ui better". It was two loose
// pills (`rounded-full px-3 py-1`, active bg-clay-600 / idle bg-cream-100) that
// read as two unrelated tags. Now ONE segmented control: a cream track holding
// both options, the selected one lifted onto a clay chip. Same props, same
// accessibility, nothing else on any screen moved.
// TO RESTORE the pills: swap the track View for `flex-row gap-1.5`, and each
// Pressable's className for the pill classes above.
//
// ⚠️ BIGGER, AND PINNED TO THE RIGHT — 2026-10-25, the author: "make the male/female
// voice bigger, move it the far right". `self-stretch` + `justify-end` puts it at the
// right edge even inside a centred parent (PronounceStep). Was: left-aligned
// `flex-row items-center gap-3 mb-4`, icon 14, label/options text-xs, options px-4 py-1.5.
export default function VoiceToggle({ voice, onChange }) {
  return (
    <View className="self-stretch flex-row items-center justify-end gap-3 mb-4">
      <View className="flex-row items-center gap-1.5">
        <Icon name="music" size={18} tone="muted" />
        <Text className="text-sm font-semibold text-stone-600">Voice</Text>
      </View>
      <View
        className="flex-row rounded-full bg-cream-100 p-1"
        accessibilityRole="radiogroup"
        accessibilityLabel="Recording voice"
      >
        {VOICES.map((v) => {
          const active = v.value === voice
          return (
            <Pressable
              key={v.value}
              onPress={() => onChange(v.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active, checked: active }}
              accessibilityLabel={`${v.label} voice`}
              hitSlop={6}
              className={`rounded-full px-5 py-2.5 ${active ? 'bg-clay-600' : 'active:bg-cream-200'}`}
            >
              <Text className={`text-base font-semibold ${active ? 'text-cream-50' : 'text-stone-600'}`}>
                {v.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
