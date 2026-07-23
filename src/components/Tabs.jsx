import { View, Text, Pressable } from 'react-native'
import { Link, usePathname } from 'expo-router'

// `basePath` is the route prefix (e.g. '/alphabet'); tabs append `/<id>`.
export default function Tabs({ basePath, tabs }) {
  const pathname = usePathname() || ''
  return (
    <View className="flex-row flex-wrap gap-1 mb-6 p-1 rounded-md bg-cream-100 border border-cream-200 self-start">
      {tabs.map((t) => {
        const href = `${basePath}/${t.id}`
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={t.id} href={href} asChild>
            <Pressable className={`px-4 py-2 rounded ${active ? 'bg-cream-50 shadow-warm' : ''}`}>
              <Text className={`text-sm font-medium ${active ? 'text-clay-700' : 'text-stone-600'}`}>
                {t.label}
              </Text>
            </Pressable>
          </Link>
        )
      })}
    </View>
  )
}
