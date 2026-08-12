import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Icon from '../ui/Icon.jsx'

// Mobile-friendly breadcrumbs: a prominent, tappable "back" PILL that names where
// it goes (the nearest ancestor crumb with a `to`), plus a subtle chevron trail
// underneath for context. Linking to the tree parent — not history.back() — keeps
// "up" predictable regardless of how you arrived.
export default function Breadcrumbs({ items }) {
  const parent = items.slice(0, -1).reverse().find((it) => it.to)

  return (
    <View className="mb-5 gap-2">
      {parent && (
        <Link href={parent.to} asChild>
          <Pressable className="self-start flex-row items-center gap-1.5 rounded-full bg-cream-100 border border-cream-200 pl-2.5 pr-4 py-2 active:bg-cream-200">
            <Icon name="arrowLeft" size={16} tone="accent" />
            <Text className="text-sm font-semibold text-clay-700">{parent.label}</Text>
          </Pressable>
        </Link>
      )}

      {items.length > 1 && (
        <View className="flex-row flex-wrap items-center gap-x-1.5 gap-y-1 pl-1">
          {items.map((item, i) => {
            const last = i === items.length - 1
            return (
              <View key={i} className="flex-row items-center gap-x-1.5">
                {item.to && !last ? (
                  <Link href={item.to} asChild>
                    <Pressable hitSlop={4}>
                      <Text className="text-xs text-stone-500">{item.label}</Text>
                    </Pressable>
                  </Link>
                ) : (
                  <Text className={`text-xs ${last ? 'font-semibold text-stone-700' : 'text-stone-500'}`}>
                    {item.label}
                  </Text>
                )}
                {!last && <Text className="text-xs text-stone-400">›</Text>}
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}
