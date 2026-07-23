import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { categories } from '../../data/vocabulary.js'
import Breadcrumbs from '../common/Breadcrumbs.jsx'

export default function VocabCategoryGrid() {
  return (
    <View>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Vocabulary' }]} />
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Vocabulary</Text>
        <Text className="text-stone-700">A growing word bank, organized by theme.</Text>
      </View>

      <View className="gap-4">
        {categories.map((c) => (
          <Link key={c.id} href={`/vocabulary/${c.id}`} asChild>
            <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-5">
              <Text className="text-4xl mb-3">{c.emoji}</Text>
              <Text className="font-serif text-xl text-stone-900 mb-1">{c.title}</Text>
              <Text className="text-sm text-stone-600">{c.description}</Text>
              <Text className="text-xs uppercase tracking-wider text-clay-600 mt-4">
                {c.words.length} {c.words.length === 1 ? 'word' : 'words'}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  )
}
