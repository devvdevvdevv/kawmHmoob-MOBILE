import { View, Text } from 'react-native'

export default function ProgressBar({ value, max = 100, label, className = '' }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <View className={className}>
      {label && (
        <View className="flex-row justify-between mb-1">
          <Text className="text-xs font-medium text-stone-700">{label}</Text>
          <Text className="text-xs text-stone-500">{value} / {max}</Text>
        </View>
      )}
      <View className="h-2 w-full bg-cream-200 rounded-full overflow-hidden">
        <View className="h-full bg-clay-600" style={{ width: `${pct}%` }} />
      </View>
    </View>
  )
}
