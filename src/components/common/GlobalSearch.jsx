import { useMemo, useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { consonants, vowels, tones } from '../../data/alphabet.js'
import { categories } from '../../data/vocabulary.js'
import { stories, GENRES } from '../../data/stories.js'
// ⚠️ Unused since the Learn readings index was retired 2026-09-13 (see below).
// Uncomment with that block.
// import { readings } from '../../data/course.js'
import { useTheme } from '../../context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
// The ONE search — rendered both by the /search route (drawer target) and the
// Reference "Search" tab, so they mirror exactly. It builds one flat index over
// EVERY word/letter/tone/grammar/phrase/reading once, then substring-filters it.
// A standing notice flags that the dictionary is still incomplete.

function normalize(s) { return (s || '').toLowerCase().trim() }

function buildIndex() {
  const items = []
  // Alphabet stays its OWN search group (kind: 'alphabet'), but links into the real
  // Reference page's matching tab — not the placeholder /alphabet route.
  for (const c of consonants) {
    items.push({ kind: 'alphabet', label: c.letter, hint: c.sound, to: '/reference?tab=consonants', haystack: `${c.letter} ${c.sound}` })
  }
  for (const v of vowels) {
    items.push({ kind: 'alphabet', label: v.letter, hint: v.sound, to: '/reference?tab=vowels', haystack: `${v.letter} ${v.sound}` })
  }
  for (const tn of tones) {
    items.push({ kind: 'alphabet', label: tn.marker || '(no marker)', hint: tn.name, to: '/reference?tab=tones', haystack: `${tn.marker} ${tn.name} ${tn.description}` })
  }
  // ⚠️ ONE ROW PER WORD, NOT PER CARD — 2026-09-26. `yawg` has a card in each
  // of three family decks, so searching it returned "yawg — paternal
  // grandfather" three times, which the author read as repetitive entries.
  // Cards sharing a headword now fold into one row: the hint lists the
  // distinct definitions (numbered when there are several) and the row opens
  // the first card, whose page lists the others under "Other meanings".
  // Was: one items.push per card, hint: w.english.
  const byHeadword = new Map()
  for (const cat of categories) {
    for (const w of cat.words) {
      const key = normalize(w.hmongRPA)
      if (!byHeadword.has(key)) {
        byHeadword.set(key, { label: w.hmongRPA, to: `/vocabulary/${cat.id}/${w.id}`, glosses: [], hay: [] })
      }
      const row = byHeadword.get(key)
      if (!row.glosses.some((g) => normalize(g) === normalize(w.english))) row.glosses.push(w.english)
      row.hay.push(w.english, ...(w.tags || []))
    }
  }
  for (const row of byHeadword.values()) {
    const hint = row.glosses.length > 1
      ? row.glosses.map((g, i) => `${i + 1}. ${g}`).join('  ')
      : row.glosses[0]
    items.push({ kind: 'vocab', label: row.label, hint, to: row.to, haystack: `${row.label} ${row.hay.join(' ')}` })
  }
  // Grammar & everyday phrases are now their own VOCAB categories (indexed above),
  // so they're not re-indexed here — avoids duplicate hits.
  // ⚠️ THE LEARN READINGS INDEX IS RETIRED — 2026-09-13, with the unit itself
  // (src/data/lessons.js). It was already __DEV__-only, so no release build ever
  // showed these; the reason to remove it anyway is that every hit pointed at
  // /learn/readings, and that unit no longer exists. A dev-only search result
  // leading to a dead route is how someone later concludes search is broken.
  //
  // The reading MODULE is indexed further down (2026-09-13) — that was the job
  // this block was NOT a substitute for, and it is now done.
  //
  // TO RESTORE: uncomment, and restore the unit in src/data/lessons.js.
  // if (__DEV__) {
  //   for (const r of readings) {
  //     items.push({ kind: 'reading', label: r.title, hint: r.english.slice(0, 80), to: '/learn/readings', haystack: `${r.title} ${r.hmong} ${r.english}` })
  //   }
  // }
  // ── THE READING LIBRARY — indexed 2026-09-13 ──────────────────────────────
  // Two kinds of item per story, deliberately:
  //
  //   1. the STORY, with its ENTIRE text folded into the haystack — so searching
  //      any word a story contains returns the story it lives in. That is the
  //      thing search could not do before: the dictionary knew `xauv`, and
  //      nothing in the app could tell you it appears in "Ntxawm Lub Xauv".
  //   2. each GLOSSARY entry as its own hit. The author wrote those FOR that
  //      text, so they carry the sense this story uses — `rau` is "to, for"
  //      here, not the dictionary's "to put on footwear". A glossary hit is the
  //      most specific answer search can give, which is why it is a separate
  //      row rather than being buried in the story's haystack alone.
  //
  // ⚠️ The full text goes in the HAYSTACK, never in `hint`. A hint is one line
  // on a row; a story is several hundred words.
  //
  // ⚠️ `stories` holds only what is live. The retired drills and the seeded
  // placeholders are commented out inside src/data/stories.js, so they cannot
  // leak into search — there is no `placeholder`/ready filter to keep in sync
  // here, and there should not be one.
  //
  // ⚠️ This does NOT bypass gating. Every hit links at the reader, and the
  // reader runs its own genre + daily-quota check
  // (app/reading/story/[storyId]/index.jsx). Search finds; the reader decides.
  const genreTitle = Object.fromEntries(GENRES.map((g) => [g.id, g.title]))
  for (const story of stories) {
    const lines = (story.paragraphs || []).flat()
    const glossary = story.glossary || []
    items.push({
      kind: 'story',
      label: story.title,
      hint: story.english || genreTitle[story.genre] || 'Story',
      to: `/reading/story/${story.id}`,
      haystack: [
        story.title,
        story.english,
        story.blurb,
        story.level,
        genreTitle[story.genre],
        ...lines.map((l) => `${l.hmong} ${l.english}`),
        ...glossary.map((g) => `${g.hmong} ${g.english}`),
      ].filter(Boolean).join(' '),
    })
    for (const g of glossary) {
      items.push({
        kind: 'glossary',
        label: g.hmong,
        hint: g.english,
        to: `/reading/story/${story.id}`,
        // ⚠️ The STORY TITLE IS DELIBERATELY NOT IN HERE. It was, for one draft,
        // on the theory that "xauv ntxawm" would narrow to one story. It does
        // not: the filter is a substring test on the joined haystack, so a
        // two-word query only matches if those words are adjacent. What it DID
        // do was put the title into all twelve of that story's glossary rows,
        // so searching `xauv` returned 13 hits — the story plus its entire
        // glossary — instead of the story and the one entry that means lock.
        haystack: `${g.hmong} ${g.english}`,
      })
    }
  }
  // `label_n` / `hint_n` are what the ranking compares against — see
  // rankOf() below. Precomputed for the same reason the haystack is.
  return items.map((i) => ({
    ...i,
    haystack: normalize(i.haystack),
    label_n: normalize(i.label),
    hint_n: normalize(i.hint),
  }))
}

const INDEX = buildIndex()

// HOW CLOSE IS THIS HIT TO WHAT WAS TYPED? Lower is better.
//
// ⚠️ THE SEARCH HAD NO RANKING AT ALL. It was `haystack.includes(q)` and then
// whatever order the index happened to be built in — alphabet, then vocabulary,
// then stories. So typing `rau` returned every entry that merely CONTAINS
// those three letters, and the word `rau` itself sat wherever it happened to
// fall. On a common syllable that is most of the dictionary.
//
// ⚠️ THIS IS THE SAME RULE AS THE LOOKUP LADDER, applied to a different surface:
// **an exact match beats a partial one, always.** learning/concepts/
// lookup-ranking-and-fallbacks.md argues it for tapping a word; nothing was
// arguing it for typing one.
//
// Both languages are ranked, and neither outranks the other: someone searching
// "thread" deserves the same treatment as someone searching "xov".
function rankOf(item, q) {
  if (item.label_n === q) return 0          // the Hmong headword, exactly
  if (item.hint_n === q) return 1           // the English, exactly
  // A whole English sense, where the hint lists several: "to, for · six".
  if (item.hint_n.split(/\s*[·;,]\s*/).includes(q)) return 2
  if (item.label_n.startsWith(q)) return 3
  if (item.hint_n.startsWith(q)) return 4
  // A whole token anywhere in either field — "xov" matches inside "lub xov"
  // but not inside "xovxwm". Padded string test, not a regex: building a
  // pattern from typed input means escaping typed input, and that escaping is
  // what broke the first version of this line.
  const padded = ` ${item.label_n} ${item.hint_n} `
  if (padded.includes(` ${q} `)) return 5
  return 6                                  // somewhere in the haystack
}

const KIND_LABEL = {
  alphabet: 'Alphabet',
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  everyday: 'Everyday',
  reading: 'Reading',
  story: 'Stories',
  glossary: 'Story glossary',
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
    // ⚠️ RANK BEFORE SLICING. Cutting to 80 first would throw away an exact
    // match that happened to be built late — which is precisely the bug on a
    // common syllable, where there are far more than 80 partial hits.
    const hits = INDEX
      .filter((i) => i.haystack.includes(norm))
      .map((i) => ({ ...i, _rank: rankOf(i, norm) }))
      .sort((a, b) => a._rank - b._rank || a.label.length - b.label.length)
      .slice(0, 80)
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
          Type to search across the alphabet, vocabulary, grammar, and the stories.
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
                  <Pressable className="rounded-md bg-cream-50 p-3 flex-row justify-between items-center active:bg-cream-100">
                    <Text className="font-semibold text-clay-700" style={{ flexShrink: 0, marginRight: 12 }}>{r.label}</Text>
                    <Text className="text-sm font-medium text-stone-600" style={{ flexShrink: 1, textAlign: 'right' }} numberOfLines={2}>{r.hint}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </View>
        ))}
    </View>
  )
}
