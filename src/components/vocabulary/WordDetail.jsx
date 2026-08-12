import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { getCategory, getWord } from '../../data/vocabulary.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import { useProgress } from '../../hooks/useProgress.js'
import { useNotebook } from '../../context/NotebookContext.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import Button from '../ui/Button.jsx'

export default function WordDetail() {
  const { categoryId, wordId } = useLocalSearchParams()
  const router = useRouter()
  const cat = getCategory(categoryId)
  const word = getWord(categoryId, wordId)
  const { vocabProgress, setVocabStatus } = useProgress()
  const { savedWords, saveWord, unsaveWord } = useNotebook()
  const { isPro } = useSubscription()

  if (!cat || !word) {
    return (
      <View>
        <Text className="text-stone-900">Word not found.</Text>
        <Link href="/vocabulary" asChild>
          <Pressable><Text className="text-clay-700 underline">Back</Text></Pressable>
        </Link>
      </View>
    )
  }

  const status = vocabProgress[word.id] || 'new'
  const isSaved = Boolean(savedWords[word.id])

  return (
    <View>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Vocabulary', to: '/vocabulary' },
          { label: cat.title, to: `/vocabulary/${cat.id}` },
          { label: word.hmongRPA },
        ]}
      />

      <View className="rounded-md bg-cream-50 border border-cream-200 p-6">
        <View className="flex-row items-start justify-between gap-4 mb-6">
          <View className="flex-row items-start gap-4 flex-1">
            <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
            <View className="flex-1">
              <Text className="font-serif text-5xl text-clay-700">{word.hmongRPA}</Text>
              <Text className="text-xl text-stone-900 mt-2">{word.english}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              if (!isPro) { router.push('/paywall'); return } // saving words is Pro
              isSaved ? unsaveWord(word.id) : saveWord(word.id)
            }}
            className={`px-3 py-1.5 rounded border ${
              isSaved ? 'bg-clay-600/15 border-clay-600/40' : 'bg-cream-100 border-cream-300'
            }`}
          >
            <Text className={`text-xs font-semibold ${isSaved ? 'text-clay-700' : 'text-stone-700'}`}>
              {isSaved ? '✓ Saved' : isPro ? '+ Save' : '◆ Save'}
            </Text>
          </Pressable>
        </View>

        <View className="border-t border-cream-200 pt-5 gap-4">
          <Field label="Category">{cat.title}</Field>
          <Field label="Tags">{word.tags?.join(', ') || '—'}</Field>
          <Field label="Status">{status}</Field>
          {/* Raw audio path is internal/debug info — dev builds only, hidden in release. */}
          {__DEV__ && <Field label="Audio file">{word.audioFile || '—'}</Field>}
        </View>

        {word.exampleSentence && (
          <View className="mt-6 border-t border-cream-200 pt-5">
            <Text className="font-serif text-lg text-stone-900 mb-2">Example</Text>
            <Text className="italic text-clay-700">{word.exampleSentence.hmong}</Text>
            <Text className="text-stone-700 mt-1">{word.exampleSentence.english}</Text>
          </View>
        )}

        <View className="flex-row flex-wrap gap-2 mt-8">
          <Pressable
            onPress={() => setVocabStatus(word.id, 'learning')}
            className="px-4 py-2 rounded bg-cream-200"
          >
            <Text className="text-sm font-semibold text-clay-700">Mark Learning</Text>
          </Pressable>
          <Pressable
            onPress={() => setVocabStatus(word.id, 'known')}
            className="px-4 py-2 rounded bg-emerald-100"
          >
            <Text className="text-sm font-semibold text-emerald-800">Mark Known</Text>
          </Pressable>
          <Button onPress={() => router.push(`/vocabulary/${cat.id}`)} variant="ghost" className="ml-auto">
            Back to {cat.title}
          </Button>
        </View>
      </View>
    </View>
  )
}

function Field({ label, children }) {
  return (
    <View>
      <Text className="text-xs uppercase tracking-wider text-clay-600">{label}</Text>
      <Text className="text-stone-800 mt-0.5">{children}</Text>
    </View>
  )
}
