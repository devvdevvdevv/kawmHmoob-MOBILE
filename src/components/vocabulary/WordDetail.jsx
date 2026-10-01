import { useEffect, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { categories, getCategory, getWord, groupReturn, familyOf } from '../../data/vocabulary.js'
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
import { headwordOf } from '../../lib/wordLookup.js'
import { storyReturn } from '../../data/stories.js'
import { lessonReturn } from '../../data/lessons.js'

/** A card by id, from any set — for the "Other meanings" links. */
function findCard(id) {
  for (const c of categories) {
    const w = c.words.find((x) => x.id === id)
    if (w) return { id: w.id, category: c.id }
  }
  return null
}


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
export default function WordDetail() {
  const { categoryId, wordId, fromGroup, fromStory, fromLesson, fromUnit, fromBuilder } = useLocalSearchParams()
  const router = useRouter()
  const cat = getCategory(categoryId)
  // The theme the learner came through, kept in the trail (2026-09-26).
  const group = cat ? groupReturn(fromGroup, cat.id) : null
  // Came via a lesson's set (2026-09-27): links back to the set keep ?fromLesson, so
  // the set still offers "Back to the lesson". Validated like the set does.
  const lessonBack = cat ? lessonReturn(fromLesson, cat.id, fromUnit) : null
  const setQuery = (() => {
    const keep = [group && `fromGroup=${group.id}`, lessonBack && lessonBack.query].filter(Boolean).join('&')
    return keep ? `?${keep}` : ''
  })()
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
  // The headword's OTHER CARDS — 2026-09-26. `yog` is "if" on the conjunctions
  // card and "to be" on its own; each page now links the other, so the word
  // reads as one dictionary entry with numbered definitions. Definitions this
  // card already shows (above, or under "Also means") are skipped.
  const shown = new Set([...inDomain, ...elsewhere].map((s) => s.toLowerCase()))
  const otherCards = (headwordOf(word.hmongRPA)?.definitions || [])
    .filter((d) => !d.ids.includes(word.id) && !shown.has(d.en.toLowerCase()))
    .map((d) => ({ ...d, card: findCard(d.ids[0]) }))
    .filter((d) => d.card)
  const isLearning = status === 'learning'
  const isKnown = status === 'known'
  const isSaved = Boolean(savedWords[word.id])
  // ── BACK TO THE STORY — 2026-09-26 ─────────────────────────────────────
  // Opened from a story (the word sheet's "Open in dictionary", or a glossary
  // row) → `?fromStory=`. If the word really is in that story (storyReturn's
  // guard), the trail reads Reading › <Story> and the button goes back to it.
  // Otherwise null → the normal set trail and "Back to <set>".
  // Guide: learning/concepts/navigation-return-context.md (third example).
  const story = storyReturn(fromStory, word.hmongRPA)
  const keepStory = story ? `?fromStory=${story.id}` : ''

  return (
    <View>
      <Breadcrumbs
        items={story ? [
          // From a story: the trail is the READING, not the set (2026-09-26).
          { label: 'Home', to: '/' },
          { label: 'Reading', to: '/reading' },
          { label: story.title, to: `/reading/story/${story.id}` },
          { label: word.hmongRPA },
        ] : [
          { label: 'Home', to: '/' },
          { label: 'Vocabulary', to: '/vocabulary' },
          // Theme kept from the set, when the learner came through one (2026-09-26).
          ...(group ? [{ label: group.title, to: `/vocabulary/group/${group.id}` }] : []),
          { label: cat.title, to: `/vocabulary/${cat.id}${setQuery}` },  // was: …${group ? `?fromGroup=${group.id}` : ''}
          { label: word.hmongRPA },
        ]}
      />

      {/* ⚠️ BACK TO THE SENTENCES — 2026-09-27. Opened from the sentence builder's
          "Words in this sentence" (?fromBuilder=1). router.back(), not a push: the
          builder is underneath MID-SESSION, and a push would start a new session. */}
      {fromBuilder && router.canGoBack() && (
        <Button variant="secondary" size="sm" className="self-start mb-4" onPress={() => router.back()}>
          ← Back to the sentences
        </Button>
      )}

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
              {otherCards.length > 0 && (
                <View className="mt-4">
                  <Text className="text-sm font-medium text-stone-500">Other meanings of {word.hmongRPA}</Text>
                  {/* ⚠️ RESTYLED 2026-09-26 (author: "make the other meaning link
                      buttons look better, match the UI"). Was underlined clay text:
                        <Text className="text-base text-clay-700 underline">{d.n}. {d.en}</Text>
                      Now a soft cream-200 row like the Mark Learning button: the
                      definition number in the same clay circle style, the meaning,
                      the set it lives in, and a chevron. No border — hairlines on
                      cream were removed app-wide (note at the top of this file).
                      Static classNames only (function styles vanish on native). */}
                  <View className="mt-2 gap-2">
                    {otherCards.map((d) => (
                      // keepStory: hopping to another meaning keeps the way back to the story.
                      <Link key={d.n} href={`/vocabulary/${d.card.category}/${d.card.id}${keepStory}`} asChild>
                        <Pressable
                          accessibilityRole="link"
                          accessibilityLabel={`Meaning ${d.n}: ${d.en}`}
                          className="flex-row items-center gap-3 rounded-md bg-cream-200 px-3 py-2.5 active:bg-cream-300"
                        >
                          <View className="h-7 w-7 rounded-full bg-clay-600/15 items-center justify-center">
                            <Text className="text-sm font-bold text-clay-700">{d.n}</Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-base font-semibold text-stone-900" numberOfLines={2}>{d.en}</Text>
                            {!!getCategory(d.card.category)?.title && (
                              <Text className="text-xs font-medium text-stone-500 mt-0.5">
                                {getCategory(d.card.category).title}
                              </Text>
                            )}
                          </View>
                          <Text className="text-xl text-clay-700">›</Text>
                        </Pressable>
                      </Link>
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

        {/* ── IN REAL WORDS — 2026-09-26 ────────────────────────────────────
            Optional `examples` on an entry: short word-level examples that belong
            in the DICTIONARY, not on the flashcard. First user: the tau pattern
            cards ("tau + verb" → tau noj, ate · tau mus, went…) — the author
            asked for the examples to live here instead of on the card. */}
        {Array.isArray(word.examples) && word.examples.length > 0 && (
          <View className="mt-6 border-t border-cream-200 pt-5">
            <Text className="font-serif text-lg text-stone-900 mb-3">In real words</Text>
            <View className="gap-2">
              {word.examples.map((ex) => (
                <View key={ex.hmong} className="flex-row items-baseline gap-3 rounded-md bg-cream-100 px-3 py-2.5">
                  <Text className="font-serif text-base text-clay-700" style={{ width: '42%' }}>{ex.hmong}</Text>
                  <Text className="text-base text-stone-700 flex-1">{ex.english}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {word.exampleSentence && (
          <View className="mt-6 border-t border-cream-200 pt-5">
            <Text className="font-serif text-lg text-stone-900 mb-2">Example</Text>
            <Text className="italic text-clay-700">{word.exampleSentence.hmong}</Text>
            <Text className="text-stone-700 mt-1">{word.exampleSentence.english}</Text>
          </View>
        )}

        {/* ── THE WORD'S FAMILY — 2026-09-26 (author: "all tau entries …
            interchangeable, users can move back and forth between them"). Only
            entries in a family (familyOf, vocabulary.js) show this. */}
        <FamilyNav wordId={word.id} keepStory={keepStory} />

        {/* The chosen status is FILLED and bold; the other stays soft. (The ✓ was removed 2026-09-28, author: was '✓ Learning' / '✓ Known'.)
            Same treatment as the flashcard's buttons, so marking a word looks the
            same wherever you do it. Static className strings, not a style function
            — NativeWind drops function styles on native (notes/2026-08-06). */}
        <View className="flex-row flex-wrap gap-2 mt-8">
          <Pressable
            onPress={() => setVocabStatus(word.id, 'learning')}
            className={`px-4 py-2 rounded ${isLearning ? 'bg-clay-600 shadow-warm' : 'bg-cream-200'}`}
          >
            <Text className={`text-sm ${isLearning ? 'font-bold text-cream-50' : 'font-semibold text-clay-700'}`}>
              {isLearning ? 'Learning' : 'Mark Learning'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVocabStatus(word.id, 'known')}
            className={`px-4 py-2 rounded ${isKnown ? 'bg-emerald-700 shadow-warm' : 'bg-emerald-100'}`}
          >
            <Text className={`text-sm ${isKnown ? 'font-bold text-cream-50' : 'font-semibold text-emerald-800'}`}>
              {isKnown ? 'Known' : 'Mark Known'}
            </Text>
          </Pressable>
          {/* ⚠️ dismissTo, NOT push, for the story (2026-09-26). The reader is still
              open underneath — the sheet pushed this page on top of it. dismissTo
              pops back down to it, so the learner lands where they were reading,
              with their revealed lines intact. push would stack a SECOND reader.
              If the reader is not in the stack (a hand-typed link), dismissTo
              opens it instead. */}
          {story ? (
            <Button onPress={() => router.dismissTo(`/reading/story/${story.id}`)} variant="ghost" className="ml-auto">
              Back to the story
            </Button>
          ) : (
            <Button onPress={() => router.push(`/vocabulary/${cat.id}${setQuery}`)} variant="ghost" className="ml-auto">
              Back to {cat.title}
            </Button>
          )}
        </View>
      </View>
    </View>
  )
}

/**
 * Move between the members of a word family (e.g. every tau entry).
 *
 *   ‹ Previous / Next ›   step through the family in teaching order
 *   chips                 jump to any member; the current one is filled
 *
 * ⚠️ router.replace, not push, for these hops: walking through 30 tau entries
 * must not stack 30 pages for the back button to unwind — back should still
 * return to wherever the learner came FROM (a set, a story, search).
 * `keepStory` carries ?fromStory= along, so "Back to the story" survives the
 * walk (storyReturn re-validates it on each word).
 * Static classNames only (a function style renders invisible on native).
 */
function FamilyNav({ wordId, keepStory }) {
  const router = useRouter()
  const family = familyOf(wordId)
  if (!family) return null
  const i = family.order.findIndex((c) => c.id === family.current)
  const prev = i > 0 ? family.order[i - 1] : null
  const next = i >= 0 && i < family.order.length - 1 ? family.order[i + 1] : null
  const go = (c) => router.replace(`/vocabulary/${c.category}/${c.id}${keepStory}`)

  return (
    <View className="mt-6 border-t border-cream-200 pt-5">
      <Text className="font-serif text-lg text-stone-900 mb-1">Every {family.title.toLowerCase()} entry</Text>
      <Text className="text-sm text-stone-600 mb-3">
        {i >= 0 ? `${i + 1} of ${family.order.length}` : `${family.order.length} entries`} — move back and forth between them.
      </Text>

      <View className="flex-row gap-2 mb-4">
        <Pressable
          onPress={() => prev && go(prev)}
          disabled={!prev}
          accessibilityRole="button"
          accessibilityLabel={prev ? `Previous: ${prev.hmongRPA}` : 'No previous entry'}
          className={`flex-1 rounded-md px-3 py-2.5 ${prev ? 'bg-cream-200 active:bg-cream-300' : 'bg-cream-100 opacity-50'}`}
        >
          <Text className="text-xs font-medium text-stone-500">‹ Previous</Text>
          <Text className="font-serif text-base text-stone-900" numberOfLines={1}>{prev ? prev.hmongRPA : '—'}</Text>
        </Pressable>
        <Pressable
          onPress={() => next && go(next)}
          disabled={!next}
          accessibilityRole="button"
          accessibilityLabel={next ? `Next: ${next.hmongRPA}` : 'No next entry'}
          className={`flex-1 items-end rounded-md px-3 py-2.5 ${next ? 'bg-cream-200 active:bg-cream-300' : 'bg-cream-100 opacity-50'}`}
        >
          <Text className="text-xs font-medium text-stone-500">Next ›</Text>
          <Text className="font-serif text-base text-stone-900 text-right" numberOfLines={1}>{next ? next.hmongRPA : '—'}</Text>
        </Pressable>
      </View>

      {family.groups.map((g) => (
        <View key={g.title} className="mb-3">
          <Text className="text-xs uppercase tracking-wider text-clay-600 mb-2">{g.title}</Text>
          <View className="flex-row flex-wrap gap-2">
            {g.cards.map((c) => {
              const here = c.id === family.current
              return (
                <Pressable
                  key={c.id}
                  onPress={() => !here && go(c)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: here }}
                  accessibilityLabel={c.hmongRPA}
                  className={`rounded-full px-3 py-1.5 ${here ? 'bg-clay-600' : 'bg-cream-200 active:bg-cream-300'}`}
                >
                  <Text className={`font-serif text-sm ${here ? 'text-cream-50' : 'text-stone-800'}`}>{c.hmongRPA}</Text>
                </Pressable>
              )
            })}
          </View>
        </View>
      ))}
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
