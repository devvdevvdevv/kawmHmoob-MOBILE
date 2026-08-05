import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'

const links = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/reference', label: 'Reference' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/notebook', label: 'Notebook' },
  { to: '/quiz', label: 'Quiz' },
]

const resources = [
  { to: '/search', label: 'Search' },
  { to: '/settings', label: 'Settings' },
  { to: '/account', label: 'Account' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <View className="mt-12 bg-[#C7DEE0] border-t border-[#9CBFC2]/40">
      <View className="px-6 py-8 gap-8">
        <View>
          <Text className="font-serif text-2xl text-stone-900">Kawm Hmoob</Text>
          <Text className="text-xs text-stone-800/80 italic mt-1">
            Learn the Hmong language
          </Text>
          <Text className="mt-4 text-sm text-stone-700/80 max-w-xs">
            A gentle place to learn Hmong — alphabet, vocabulary, lessons, and quizzes at your pace.
          </Text>
        </View>

        <View>
          <Text className="font-serif text-stone-900 mb-3">Explore</Text>
          <View className="gap-1.5">
            {links.map(({ to, label }) => (
              <Link key={to} href={to} asChild>
                <Pressable>
                  <Text className="text-sm text-stone-800">{label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        <View>
          <Text className="font-serif text-stone-900 mb-3">Account</Text>
          <View className="gap-1.5">
            {resources.map(({ to, label }) => (
              <Link key={to} href={to} asChild>
                <Pressable>
                  <Text className="text-sm text-stone-800">{label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </View>

      <View className="border-t border-[#9CBFC2]/40 px-6 py-4 gap-1">
        <Text className="text-xs text-stone-700/80">© {year} Kawm Hmoob · made with care</Text>
        <Text className="text-xs text-stone-700/80">Ua tsaug rau koj txoj kev kawm.</Text>
      </View>
    </View>
  )
}
