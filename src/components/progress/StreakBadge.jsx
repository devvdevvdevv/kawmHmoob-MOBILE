import { View, Text } from 'react-native'
import { useProgress } from '../../hooks/useProgress.js'

export default function StreakBadge() {
  const { streakData } = useProgress()
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-orange-200 px-2.5 py-1">
      <Text className="text-xs font-semibold text-orange-900">🔥 {streakData.currentStreak}</Text>
    </View>
  )
}
