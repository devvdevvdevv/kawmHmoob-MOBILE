import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import Collapsible from './Collapsible.jsx'
import { lookupWord } from '../../lib/wordLookup.js'

// "WORDS IN THIS SENTENCE" — 2026-09-27 (author: after a sentence is checked, "a
// list of the words in chronological order for the user to see the definition of
// words they didn't know, and link to their dictionary, a drop down menu").
//
// Shown under the Correct / Not quite result in the sentence builder. Closed by
// default (it is a reference, not a second task), and one tap opens it.
//
//   • ORDER: the exercise's `tokens` — the answer's own chips, in sentence order.
//     A chip can be a multi-word entry ("tag kis", "sawv ntxov"); it is looked up
//     as one, which is how the dictionary lists it.
//   • MEANING: lookupWord() — the same dictionary lookup the reader's word sheet
//     uses (spaced/joined spellings included). A word the dictionary doesn't know
//     says so rather than disappearing, so the row count always matches the chips.
//   • LINK: only a real dictionary card (an `id` + `category`) links, with
//     `?fromBuilder=1` so the word page offers "Back to the sentences" (router.back:
//     the builder is still underneath, mid-session, and must not be restarted).
//
// Static classNames / style objects only — a function style renders invisible on
// native in this app.
export default function SentenceWords({ tokens = [], tone = 'neutral' }) {
  const router = useRouter()
  if (!tokens.length) return null
  const rows = tokens.map((t) => ({ token: t, entry: lookupWord(t) }))
  const soft = tone === 'correct' ? 'text-lime-900/80' : 'text-stone-600'

  return (
    <View className="w-full mt-4 rounded-md bg-cream-50 px-4">
      <Collapsible title={`Words in this sentence (${rows.length})`}>
        <View className="gap-1.5">
          {rows.map(({ token, entry }, i) => {
            const canOpen = Boolean(entry?.id && entry?.category)
            const row = (
              <View className="flex-row items-center gap-3 rounded-md bg-cream-100 px-3 py-2">
                <Text className="text-xs font-semibold text-stone-500" style={{ width: 18 }}>{i + 1}</Text>
                <Text className="font-serif text-base text-stone-900" style={{ width: '32%' }}>{token}</Text>
                <Text className={`flex-1 text-sm ${entry ? 'text-stone-700' : `italic ${soft}`}`} numberOfLines={2}>
                  {entry ? entry.english : 'not in the dictionary yet'}
                </Text>
                {canOpen && <Text className="text-lg text-clay-700">›</Text>}
              </View>
            )
            if (!canOpen) return <View key={`${token}-${i}`}>{row}</View>
            return (
              <Pressable
                key={`${token}-${i}`}
                accessibilityRole="link"
                accessibilityLabel={`${token}: ${entry.english}. Open in the dictionary`}
                onPress={() => router.push(`/vocabulary/${entry.category}/${entry.id}?fromBuilder=1`)}
              >
                {row}
              </Pressable>
            )
          })}
        </View>
      </Collapsible>
    </View>
  )
}
