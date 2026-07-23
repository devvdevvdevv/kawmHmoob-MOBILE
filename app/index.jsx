import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TodayCard from '../src/components/home/TodayCard.jsx'

const cards = [
  { to: '/learn', title: 'Learn', desc: 'Structured units with intro, examples, practice, and quiz.' },
  { to: '/alphabet', title: 'Alphabet', desc: 'Consonants, vowels, and tones.' },
  { to: '/course', title: 'Course', desc: 'Grammar, everyday phrases, and reading.' },
  { to: '/vocabulary', title: 'Vocabulary', desc: 'Build your word bank by category.' },
  { to: '/notebook', title: 'Notebook', desc: 'Save words and jot down notes.' },
  { to: '/quiz', title: 'Quizzes', desc: 'Practice and test what you learn.' },
  { to: '/account', title: 'Account', desc: 'Profile, stats, and progress.' },
]

export default function Home() {
  return (
    <View>
      <View className="items-center mb-12 mt-2">
        <Text className="text-sm uppercase tracking-[3px] text-white font-semibold mb-3">Welcome</Text>
        <Text className="font-serif text-5xl text-white mb-4">Nyob zoo.</Text>
        <Text className="text-lg text-stone-700 text-center max-w-xl">
          A quiet place to learn Hmong — one phrase, one word, one tone at a time.
        </Text>
      </View>

      <TodayCard />

      <View className="gap-4 mt-12">
        {cards.map((c) => (
          <Link key={c.to} href={c.to} asChild>
            <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-5">
              <Text className="font-serif text-xl text-stone-900 mb-2">{c.title}</Text>
              <Text className="text-sm text-stone-600">{c.desc}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  )
}
