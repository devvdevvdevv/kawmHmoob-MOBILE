import { View, Text } from 'react-native'
import { useProgress } from '../../hooks/useProgress.js'

export default function XPBadge() {
  const { xp } = useProgress()
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-cream-200 px-2.5 py-1">
      <Text className="text-xs font-semibold text-clay-700">★ {xp}</Text>
    </View>
  )
}
