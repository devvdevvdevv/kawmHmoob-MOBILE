import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import Button from '../src/components/ui/Button.jsx'

export default function NotFound() {
  return (
    <View className="items-center py-20">
      <Text className="text-sm uppercase tracking-[3px] text-clay-600 mb-3">Lost</Text>
      <Text className="font-serif text-7xl text-stone-900 mb-3">404</Text>
      <Text className="text-stone-700 mb-8">That page does not exist.</Text>
      <Link href="/" asChild>
        <Button>Go Home</Button>
      </Link>
    </View>
  )
}
