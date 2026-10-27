import { View, Text, Pressable } from 'react-native'
import { Link, Redirect, useLocalSearchParams } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import { getUnit, unitWords, orderedPath } from '../../../src/data/path.js'
import { getCategory } from '../../../src/data/vocabulary.js'
import { useProgress } from '../../../src/hooks/useProgress.js'

// ⚠️ A DEV SPIKE, NOT A FEATURE — 2026-10-16, written to answer "give example how a unit
// is sourced, so i can see".
//
// Reachable by URL only: /path/u-colors/demo · /path/u-family/demo · any unit id.
// NOTHING LINKS TO IT. It is the smallest page that does the whole sourcing chain, with
// each hop numbered, so the real screen (index.jsx, 364 lines) can be read afterwards
// without hunting for the five lines that matter.
//
// TO DELETE: remove this file. Nothing imports it and no route points at it.
//
// It is "reactive" in the two ways that matter here:
//   · the URL is the only input — tap a unit at the bottom and every hop below re-runs
//     with a different string, and the page is a different unit;
//   · `useProgress()` is a context hook, so the studied count is live: mark a word
//     anywhere in the app and this number changes without this screen knowing why.
export default function UnitSourcingDemo() {
  // ── HOP 1 ── the URL's blank, as a string. That is all that crossed over.
  const { unitId } = useLocalSearchParams()

  // ── HOP 2 ── look the string up in path.js → the unit object (the RECIPE).
  const unit = getUnit(String(unitId))

  // ⚠️ EVERY HOOK GOES ABOVE THE EARLY RETURN BELOW. React matches hooks up by the ORDER
  // they are called, so a hook after a conditional return is called on some renders and
  // not others — and the next render reads the wrong state. eslint's
  // react-hooks/rules-of-hooks caught exactly this when the line sat below the guard.
  const { vocabProgress } = useProgress()

  // ⚠️ Anyone can type /path/u-banana/demo, so this can be null. Guard before using it.
  if (!unit) return <Redirect href="/path" />

  // ── HOP 3 ── the recipe points at buckets. Still no words here.
  const categoryIds = unit.categories || []

  // ── HOP 4 ── the buckets live in vocabulary.js (the CONTENT).
  const categories = categoryIds.map((id) => getCategory(id)).filter(Boolean)

  // ── HOP 5 ── unitWords() is the join: buckets → words, capped / hand-picked.
  const words = unitWords(unit)

  // Live state, from a context rather than from the URL (the hook itself is above).
  const studied = words.filter((w) => vocabProgress[w.id]).length

  return (
    <TabScreen>
      <Text className="font-serif text-3xl text-stone-900 mb-1">How a unit is sourced</Text>
      <Text className="text-sm font-medium text-stone-600 mb-6">
        A dev page. Each box is one hop, in order.
      </Text>

      <Hop n="1" label="The URL gave us a string" file="useLocalSearchParams()">
        unitId = “{String(unitId)}”
      </Hop>

      <Hop n="2" label="getUnit() found the unit object" file="src/data/path.js">
        {unit.title}{unit.hmongTitle ? ` · ${unit.hmongTitle}` : ''}{'\n'}
        order {unit.order} · {unit.free ? 'FREE' : 'Pro'} · lesson: {unit.introLesson || 'none'}
      </Hop>

      <Hop n="3" label="The unit points at categories" file="unit.categories">
        {categoryIds.length ? categoryIds.join(' · ') : '(none)'}
        {'\n'}⚠️ pointers — there are no words in path.js
      </Hop>

      <Hop n="4" label="The categories live elsewhere" file="src/data/vocabulary.js">
        {categories.map((c) => `${c.title} — ${c.words.length} words in the set`).join('\n') || '(none found)'}
      </Hop>

      <Hop
        n="5"
        label={`unitWords() joined them → ${words.length} words`}
        file={unit.words ? 'hand-picked `words` list' : `limit: ${unit.limit ?? 'none'}`}
      >
        {words.slice(0, 8).map((w) => `${w.hmongRPA} — ${w.english.split(/[·;]/)[0].trim()}`).join('\n')}
        {words.length > 8 ? `\n… and ${words.length - 8} more` : ''}
      </Hop>

      <Hop n="6" label="Live state, not from the URL" file="useProgress()">
        {studied} of {words.length} studied{'\n'}
        ⚠️ mark a word anywhere in the app and this number changes by itself
      </Hop>

      {/* The reactive part: a different string in the URL re-runs all six hops. */}
      <Text className="font-serif text-xl text-stone-900 mt-6 mb-2">Change the string</Text>
      <Text className="text-sm font-medium text-stone-600 mb-3">
        Same file, same six hops, different unit.
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {orderedPath().slice(0, 12).map((u) => (
          <Link key={u.id} href={`/path/${u.id}/demo`} asChild>
            {/* Pressable, never a View — a View cannot receive the Link's onPress. */}
            <Pressable
              className={`rounded-md px-3 py-2 ${u.id === unit.id ? 'bg-clay-600' : 'bg-cream-50 active:bg-cream-100'}`}
            >
              <Text className={`text-sm font-semibold ${u.id === unit.id ? 'text-cream-50' : 'text-stone-800'}`}>
                {u.order}. {u.title}
              </Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </TabScreen>
  )
}

function Hop({ n, label, file, children }) {
  return (
    <View className="rounded-md bg-cream-50 p-4 mb-3">
      <View className="flex-row items-center gap-2 mb-1.5">
        <View className="h-6 w-6 rounded-full bg-clay-600 items-center justify-center">
          <Text className="text-xs font-bold text-cream-50">{n}</Text>
        </View>
        <Text className="text-sm font-semibold text-stone-900 flex-1">{label}</Text>
      </View>
      <Text className="text-[11px] font-medium text-clay-700 mb-1.5">{file}</Text>
      <Text className="text-sm text-stone-700 leading-relaxed">{children}</Text>
    </View>
  )
}
