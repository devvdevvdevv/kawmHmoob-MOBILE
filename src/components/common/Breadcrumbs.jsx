import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'

export default function Breadcrumbs({ items }) {
  return (
    <View className="mb-4 flex-row flex-wrap items-center gap-1">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <View key={i} className="flex-row items-center gap-1">
            {item.to && !last ? (
              <Link href={item.to} asChild>
                <Pressable>
                  <Text className="text-sm text-stone-700 underline">{item.label}</Text>
                </Pressable>
              </Link>
            ) : (
              <Text className={`text-sm ${last ? 'font-semibold text-stone-900' : 'text-stone-700'}`}>
                {item.label}
              </Text>
            )}
            {!last && <Text className="text-sm text-stone-500">/</Text>}
          </View>
        )
      })}
    </View>
  )
}
