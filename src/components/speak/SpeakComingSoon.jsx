import { View, Text } from 'react-native'
import TabScreen from '../TabScreen.jsx'
import Icon from '../ui/Icon.jsx'

// Shown for the whole Speak section while SPEAK_ENABLED is false (v1 launch). The
// pronunciation scoring isn't built yet, so this is the honest placeholder every
// Speak entry lands on. Flip SPEAK_ENABLED in src/lib/launch.js to re-enable Speak.
export default function SpeakComingSoon() {
  return (
    <TabScreen>
      <View className="mb-8">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="h-2 w-2 rounded-full bg-clay-600" />
          <Text className="text-xs uppercase tracking-[2px] text-stone-600">Speak</Text>
        </View>
        <Text className="font-serif text-4xl text-stone-900">Say it like it's yours.</Text>
      </View>

      <View className="rounded-lg bg-cream-50 shadow-warm p-8 items-center">
        <View className="h-16 w-16 rounded-full bg-clay-600/12 items-center justify-center mb-4">
          <Icon name="mic" size={28} tone="accent" />
        </View>
        <Text className="font-serif text-2xl text-stone-900 mb-2 text-center">Coming soon</Text>
        <Text className="text-stone-700 text-center leading-relaxed">
          Pronunciation practice — record your voice and compare your tones against a
          native speaker — is on the way in an upcoming update. Everything else in the
          app is ready to use now.
        </Text>
      </View>
    </TabScreen>
  )
}
