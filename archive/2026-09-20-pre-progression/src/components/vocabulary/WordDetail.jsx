import { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { getCategory, getWord } from '../../data/vocabulary.js'
import AudioButton from '../common/AudioButton.jsx'
import Breadcrumbs from '../common/Breadcrumbs.jsx'
import { useProgress } from '../../hooks/useProgress.js'
import { useNotebook } from '../../context/NotebookContext.jsx'
import { useSubscription } from '../../context/SubscriptionContext.jsx'
import StatusBadge, { statusLabel } from './StatusBadge.jsx'
import Button from '../ui/Button.jsx'
// The definition leads with the sense this word's own category is about, and
// any sense from ANOTHER domain is shown below, labelled. Showing them in one
// run is what made a family card claim `txiv` means fruit — on a detail page
// the other meanings are worth having, but not worth confusing with the one
// the learner came here for. See src/lib/senses.js.
import { sensesFor, allSenses, domainOf } from '../../lib/senses.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
export default function WordDetail() {
  const { categoryId, wordId } = useLocalSearchParams()
  const router = useRouter()
  const cat = getCategory(categoryId)
  const word = getWord(categoryId, wordId)
  const { vocabProgress, setVocabStatus } = useProgress()
  const { savedWords, saveWord, unsaveWord, savedWordCount, wordLimit } = useNotebook()
  // Set only when a Save tap was refused because the notebook is at its cap.
  const [limitHit, setLimitHit] = useState(false)
  // Opening a different word starts clean — the warning belongs to the tap, not the screen.
  useEffect(() => { setLimitHit(false) }, [wordId])
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
  // Senses this page's own category is about, and the ones that belong to a
  // different domain. `elsewhere` is empty for almost every word — only the
  // handful that cross domains (txiv, plaub, puas…) have anything here.
  const inDomain = sensesFor(word, domainOf(word.category))
  const elsewhere = allSenses(word).filter((s) => !inDomain.includes(s))
  const isLearning = status === 'learning'
  const isKnown = status === 'known'
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

      <View className="rounded-md bg-cream-50 p-6">
        <View className="flex-row items-start justify-between gap-4 mb-6">
          <View className="flex-row items-start gap-4 flex-1">
            <AudioButton audioSrc={word.audioFile} wordId={word.id} size="lg" />
            <View className="flex-1">
              <Text className="font-serif text-5xl text-clay-700">{word.hmongRPA}</Text>
              {/* The DEFINITION. Bumped text-xl → text-2xl (2026-08-29): it is what
                  the page is for, and at text-xl it sat below the Hmong in the
                  visual order but read like a caption. */}
              {/* Numbered when there is more than one, plain when there is not:
                  a lone "1." reads as though a second line failed to load. */}
              {inDomain.length === 1 ? (
                <Text className="text-2xl text-stone-900 mt-2">{inDomain[0]}</Text>
              ) : (
                <View className="mt-2 gap-1.5">
                  {inDomain.map((s, i) => (
                    <View key={s} className="flex-row">
                      <Text className="text-2xl text-stone-500 w-7">{i + 1}.</Text>
                      <Text className="text-2xl text-stone-900 flex-1">{s}</Text>
                    </View>
                  ))}
                </View>
              )}
              {elsewhere.length > 0 && (
                <View className="mt-4">
                  <Text className="text-sm font-medium text-stone-500">Also means</Text>
                  <View className="mt-1 gap-1">
                    {elsewhere.map((s) => (
                      <Text key={s} className="text-base text-stone-600">• {s}</Text>
                    ))}
                  </View>
                </View>
              )}
              {/* The same flag the flashcard flies, in the same colors — so a word
                  you've already marked says so the moment the page opens, without
                  having to read down to the Status field or the buttons. */}
              <View className="mt-3">
                <StatusBadge status={status} />
              </View>
            </View>
          </View>
          <View className="items-end">
            <Pressable
              onPress={() => {
                if (!isPro) { router.push('/paywall'); return } // saving words is Pro
                if (isSaved) { unsaveWord(word.id); setLimitHit(false); return }
                // saveWord returns false when the notebook already holds its max.
                setLimitHit(!saveWord(word.id))
              }}
              className={`px-3 py-1.5 rounded border ${
                isSaved ? 'bg-clay-600/15 border-clay-600/40' : 'bg-cream-100 border-cream-300'
              }`}
            >
              <Text className={`font-serif text-xs ${isSaved ? 'text-clay-700' : 'text-stone-700'}`}>
                {isSaved ? '✓ Saved' : isPro ? '+ Save' : '◆ Save'}
              </Text>
            </Pressable>
            {/* Only after a tap that did nothing — the button itself stays live so
                the count isn't nagging on every word. */}
            {limitHit && (
              <Text className="font-sans text-xs text-clay-700 mt-1.5 text-right max-w-[160px]">
                Notebook is full ({savedWordCount}/{wordLimit}). Remove a word to add this one.
              </Text>
            )}
          </View>
        </View>

        <View className="border-t border-cream-200 pt-5 gap-4">
          <Field label="Category">{cat.title}</Field>
          <Field label="Tags">{word.tags?.join(', ') || '—'}</Field>
          {/* Friendly label ("Known"), not the raw stored value ("known") — same
              wording as the flag above it. */}
          <Field label="Status">{statusLabel(status)}</Field>
          {/* Raw audio path is internal/debug info — hidden from users entirely. */}
          {/* {__DEV__ && <Field label="Audio file">{word.audioFile || '—'}</Field>} */}
        </View>

        {word.exampleSentence && (
          <View className="mt-6 border-t border-cream-200 pt-5">
            <Text className="font-serif text-lg text-stone-900 mb-2">Example</Text>
            <Text className="italic text-clay-700">{word.exampleSentence.hmong}</Text>
            <Text className="text-stone-700 mt-1">{word.exampleSentence.english}</Text>
          </View>
        )}

        {/* The chosen status is FILLED and bold with a ✓; the other stays soft.
            Same treatment as the flashcard's buttons, so marking a word looks the
            same wherever you do it. Static className strings, not a style function
            — NativeWind drops function styles on native (notes/2026-08-06). */}
        <View className="flex-row flex-wrap gap-2 mt-8">
          <Pressable
            onPress={() => setVocabStatus(word.id, 'learning')}
            className={`px-4 py-2 rounded ${isLearning ? 'bg-clay-600 shadow-warm' : 'bg-cream-200'}`}
          >
            <Text className={`text-sm ${isLearning ? 'font-bold text-cream-50' : 'font-semibold text-clay-700'}`}>
              {isLearning ? '✓ Learning' : 'Mark Learning'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVocabStatus(word.id, 'known')}
            className={`px-4 py-2 rounded ${isKnown ? 'bg-emerald-700 shadow-warm' : 'bg-emerald-100'}`}
          >
            <Text className={`text-sm ${isKnown ? 'font-bold text-cream-50' : 'font-semibold text-emerald-800'}`}>
              {isKnown ? '✓ Known' : 'Mark Known'}
            </Text>
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
      {/* Field VALUES nudged up a step too — these are definitions and glosses,
          not metadata, and the default size read as fine print next to the label. */}
      <Text className="text-base text-stone-800 mt-0.5">{children}</Text>
    </View>
  )
}
