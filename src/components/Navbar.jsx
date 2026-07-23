import { View, Text, Pressable, ScrollView } from 'react-native'
import { Link, usePathname } from 'expo-router'
import { useAuth } from '../context/AuthContext.jsx'
import XPBadge from './progress/XPBadge.jsx'
import StreakBadge from './progress/StreakBadge.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/alphabet', label: 'Alphabet' },
  { to: '/course', label: 'Course' },
  { to: '/vocabulary', label: 'Vocabulary' },
  { to: '/notebook', label: 'Notebook' },
  { to: '/quiz', label: 'Quiz' },
]

function isActive(pathname, to) {
  if (to === '/') return pathname === '/'
  return pathname === to || pathname.startsWith(to + '/')
}

export default function Navbar() {
  const { user } = useAuth()
  const pathname = usePathname() || '/'

  return (
    <View className="bg-[#C7DEE0] border-b border-[#9CBFC2]/40">
      {/* Row 1: brand + identity bar */}
      <View className="px-4 pt-4 pb-3 flex-row items-center justify-between gap-3 flex-wrap">
        <Link href="/" asChild>
          <Pressable>
            <Text className="font-serif text-2xl text-stone-900">Kawm Hmoob</Text>
            <Text className="text-xs text-stone-800/80 italic">Learn the Hmong language</Text>
          </Pressable>
        </Link>

        <View className="flex-row items-center gap-2">
          <XPBadge />
          <StreakBadge />
          <IconLink href="/search" label="🔍" />
          <IconLink href="/settings" label="⚙" />
          <IconLink href="/account" label={user.isGuest ? 'Guest' : `@${user.username}`} />
        </View>
      </View>

      {/* Row 2: navigation */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 pb-2">
        <View className="flex-row gap-1">
          {links.map(({ to, label }) => {
            const active = isActive(pathname, to)
            return (
              <Link key={to} href={to} asChild>
                <Pressable
                  className={`px-3 py-1.5 rounded-sm ${active ? 'bg-stone-800' : ''}`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      active ? 'text-[#C7DEE0]' : 'text-stone-800'
                    }`}
                  >
                    {label}
                  </Text>
                </Pressable>
              </Link>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

function IconLink({ href, label }) {
  const pathname = usePathname() || '/'
  const active = isActive(pathname, href)
  return (
    <Link href={href} asChild>
      <Pressable className={`px-2.5 py-1.5 rounded-sm ${active ? 'bg-stone-800' : ''}`}>
        <Text className={`text-sm ${active ? 'text-[#C7DEE0]' : 'text-stone-800'}`}>
          {label}
        </Text>
      </Pressable>
    </Link>
  )
}
