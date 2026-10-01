import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Icon from '../ui/Icon.jsx'
import { livePath } from '../../data/path.js'
import { isUnitComplete } from '../../lib/pathProgress.js'

// "See the whole path" — 2026-09-28 (author: "see the whole path button make it have better ui",
// then "be the same on words page too"). One component so Home and Words can't drift apart.
// Was a bare line of clay text on both screens.
export default function SeeWholePathButton({ progress, className = 'mt-3' }) {
  const units = livePath()
  const done = units.filter((u) => isUnitComplete(u, progress)).length
  return (
    <Link href="/path" asChild>
      <Pressable className={`${className} rounded-md bg-cream-50 shadow-warm flex-row items-center gap-4 px-5 py-4 active:bg-cream-100`}>
        <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
          <Icon name="layers" size={22} tone="accent" />
        </View>
        <View className="flex-1">
          <Text className="font-serif text-lg text-stone-900">See the whole path</Text>
          <Text className="text-sm font-medium text-stone-600 mt-0.5">
            {done} of {units.length} units complete
          </Text>
        </View>
        <View className="h-9 w-9 rounded-full bg-clay-600 items-center justify-center">
          <Icon name="arrowRight" size={18} tone="onDark" />
        </View>
      </Pressable>
    </Link>
  )
}
