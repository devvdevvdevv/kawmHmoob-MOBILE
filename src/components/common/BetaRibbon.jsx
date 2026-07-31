import { View, Text } from 'react-native'

// A soft "this is experimental" banner. Mirrors the web BetaRibbon — an honest
// notice that a feature is unfinished, so nobody reads a low score / empty
// state as a failure on their end.
export default function BetaRibbon({ title = 'Beta', children }) {
  return (
    <View className="rounded-md bg-orange-200 border border-orange-900/20 p-4 mb-8">
      <Text className="font-semibold text-orange-900 mb-1">{title}</Text>
      <Text className="text-sm text-orange-900/90 leading-relaxed">{children}</Text>
    </View>
  )
}
