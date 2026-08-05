import { useMemo, useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { consonants, vowels, tones } from '../../data/alphabet.js'
import { categories } from '../../data/vocabulary.js'
import { readings } from '../../data/course.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'

// The ONE search — rendered both by the /search route (drawer target) and the
// Reference "Search" tab, so they mirror exactly. It builds one flat index over
// EVERY word/letter/tone/grammar/phrase/reading once, then substring-filters it.
// A standing notice flags that the dictionary is still incomplete.

function normalize(s) { return (s || '').toLowerCase().trim() }

function buildIndex() {
  const items = []
  for (const c of consonants) {
    items.push({ kind: 'alphabet', label: c.letter, hint: c.sound, to: '/alphabet/consonants', haystack: `${c.letter} ${c.sound}` })
  }
  for (const v of vowels) {
    items.push({ kind: 'alphabet', label: v.letter, hint: v.sound, to: '/alphabet/vowels', haystack: `${v.letter} ${v.sound}` })
  }
  for (const tn of tones) {
    items.push({ kind: 'alphabet', label: tn.marker || '(no marker)', hint: tn.name, to: '/alphabet/tones', haystack: `${tn.marker} ${tn.name} ${tn.description}` })
  }
  for (const cat of categories) {
    for (const w of cat.words) {
      items.push({ kind: 'vocab', label: w.hmongRPA, hint: w.english, to: `/vocabulary/${cat.id}/${w.id}`, haystack: `${w.hmongRPA} ${w.english} ${(w.tags || []).join(' ')}` })
    }
  }
  // Grammar & everyday phrases are now their own VOCAB categories (indexed above),
  // so they're not re-indexed here — avoids duplicate hits. Readings stay.
  for (const r of readings) {
    items.push({ kind: 'reading', label: r.title, hint: r.english.slice(0, 80), to: '/learn/readings', haystack: `${r.title} ${r.hmong} ${r.english}` })
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

export default function GlobalSearch() {
  const { theme } = useTheme()
  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const inputText = `rgb(${t['--c-stone-900']})`
  const inputBg = `rgb(${t['--c-cream-50']})`
  const inputBorder = `rgb(${t['--c-cream-300']})`
  const noticeBg = `rgb(${t['--c-cream-100'] || t['--c-cream-50']})`
  const muted = `rgb(${t['--c-stone-500']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`

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
      {/* Standing "still incomplete" notice */}
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start', borderWidth: 2, borderColor: inputBorder, backgroundColor: noticeBg, borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 16 }}>📖</Text>
        <Text style={{ color: bodyColor, flex: 1, fontSize: 13, lineHeight: 19 }}>
          Dictionary in progress — this searches every word in the app so far. Not every Hmong word is here yet.
        </Text>
      </View>

      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search any word — Hmong or English…"
        placeholderTextColor={muted}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ borderWidth: 2, borderColor: inputBorder, backgroundColor: inputBg, color: inputText, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 20 }}
      />

      {!grouped && (
        <Text style={{ color: muted }} className="italic">
          Type to search across the alphabet, vocabulary, grammar, and readings.
        </Text>
      )}
      {grouped && Object.keys(grouped).length === 0 && (
        <Text style={{ color: muted }} className="italic">No results.</Text>
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
                  <Pressable className="rounded-md bg-cream-50 border border-cream-200 p-3 flex-row justify-between items-center active:bg-cream-100">
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
