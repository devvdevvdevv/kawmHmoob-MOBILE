import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useAuth } from '../../context/AuthContext.jsx'

export default function GuestBanner() {
  const { user } = useAuth()
  if (!user.isGuest) return null
  return (
    <View className="bg-cream-100/80 border-b border-cream-300/60 px-6 py-2 flex-row flex-wrap gap-3 justify-between items-center">
      <Text className="text-sm text-stone-700">
        You're using a guest account — progress saves on this device only.
      </Text>
      <View className="flex-row gap-3">
        <Link href="/login" asChild>
          <Pressable><Text className="text-sm text-clay-700 underline">Log in</Text></Pressable>
        </Link>
        <Link href="/register" asChild>
          <Pressable><Text className="text-sm text-clay-700 underline">Create account</Text></Pressable>
        </Link>
      </View>
    </View>
  )
}
