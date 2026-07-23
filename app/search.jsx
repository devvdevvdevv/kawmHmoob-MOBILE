import { useMemo, useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { consonants, vowels, tones } from '../src/data/alphabet.js'
import { categories } from '../src/data/vocabulary.js'
import { grammar, everyday, readings } from '../src/data/course.js'

function normalize(s) {
  return (s || '').toLowerCase().trim()
}

function buildIndex() {
  const items = []
  for (const c of consonants) {
    items.push({ kind: 'alphabet', label: c.letter, hint: c.sound,
      to: '/alphabet/consonants', haystack: `${c.letter} ${c.sound}` })
  }
  for (const v of vowels) {
    items.push({ kind: 'alphabet', label: v.letter, hint: v.sound,
      to: '/alphabet/vowels', haystack: `${v.letter} ${v.sound}` })
  }
  for (const t of tones) {
    items.push({ kind: 'alphabet', label: t.marker || '(no marker)', hint: t.name,
      to: '/alphabet/tones', haystack: `${t.marker} ${t.name} ${t.description}` })
  }
  for (const cat of categories) {
    for (const w of cat.words) {
      items.push({ kind: 'vocab', label: w.hmongRPA, hint: w.english,
        to: `/vocabulary/${cat.id}/${w.id}`,
        haystack: `${w.hmongRPA} ${w.english} ${(w.tags || []).join(' ')}` })
    }
  }
  for (const g of grammar) {
    for (const it of g.items) {
      items.push({ kind: 'grammar', label: it.hmong, hint: it.english,
        to: '/course/grammar', haystack: `${it.hmong} ${it.english}` })
    }
  }
  for (const e of everyday) {
    for (const it of e.items) {
      items.push({ kind: 'everyday', label: it.hmong, hint: it.english,
        to: '/course/everyday', haystack: `${it.hmong} ${it.english}` })
    }
  }
  for (const r of readings) {
    items.push({ kind: 'reading', label: r.title, hint: r.english.slice(0, 80),
      to: '/course/reading', haystack: `${r.title} ${r.hmong} ${r.english}` })
  }
  return items.map((i) => ({ ...i, haystack: normalize(i.haystack) }))
}

const INDEX = buildIndex()

const KIND_LABEL = {
  alphabet: 'Alphabet',
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  everyday: 'Everyday',
  reading: 'Reading',
}

export default function Search() {
  const [q, setQ] = useState('')

  const grouped = useMemo(() => {
    const norm = normalize(q)
    if (!norm) return null
    const hits = INDEX.filter((i) => i.haystack.includes(norm)).slice(0, 80)
    return hits.reduce((acc, h) => {
      acc[h.kind] = acc[h.kind] || []
      acc[h.kind].push(h)
      return acc
    }, {})
  }, [q])

  return (
    <View>
      <Text className="font-serif text-4xl text-stone-900 mb-5">Search</Text>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search words, phrases, letters…"
        autoFocus
        className="w-full rounded border border-cream-300 bg-cream-50 px-4 py-3 text-base text-stone-900 mb-5"
      />
      {!grouped && (
        <Text className="text-stone-600 italic">
          Type to search across the alphabet, vocabulary, course, and readings.
        </Text>
      )}
      {grouped && Object.keys(grouped).length === 0 && (
        <Text className="text-stone-600 italic">No results.</Text>
      )}
      {grouped &&
        Object.entries(grouped).map(([kind, items]) => (
          <View key={kind} className="mb-5">
            <Text className="text-xs uppercase tracking-wider text-clay-600 mb-2">
              {KIND_LABEL[kind] || kind} · {items.length}
            </Text>
            <View className="gap-1.5">
              {items.map((r, i) => (
                <Link key={`${r.to}-${i}`} href={r.to} asChild>
                  <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-3 flex-row justify-between items-center">
                    <Text className="font-semibold text-clay-700">{r.label}</Text>
                    <Text className="text-sm text-stone-600">{r.hint}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        ))}
    </View>
  )
}
