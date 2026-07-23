import { View } from 'react-native'

export default function SkeletonCard({ className = '' }) {
  return (
    <View className={`rounded-md bg-cream-200/60 border border-cream-200 p-4 ${className}`}>
      <View className="h-5 w-1/3 bg-cream-300/70 rounded mb-3" />
      <View className="h-3 w-2/3 bg-cream-300/50 rounded" />
    </View>
  )
}
