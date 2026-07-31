# Learning: how Search works (build-an-index, then filter)

`app/search.jsx` searches across the whole app — alphabet, vocabulary, grammar,
everyday phrases, readings — from one text box. The whole thing is ~40 lines of
real logic. The pattern is worth learning because it reuses everywhere: **flatten
your data into one searchable list ONCE, then filter that list on each keystroke.**

---

## 1. The core idea

Your data is scattered across many files in many shapes (consonants have
`{letter, sound}`, words have `{hmongRPA, english}`, readings have
`{title, hmong, english}`…). Searching each shape differently would be a mess.

So you **normalize everything into one flat array of identical little records**:

```js
{ kind, label, hint, to, haystack }
```

- `kind`   — which bucket ('alphabet' | 'vocab' | 'grammar' | …), for grouping + labels
- `label`  — the big text in the result row (the Hmong form / letter / title)
- `hint`   — the secondary text (the gloss / description)
- `to`     — the route to open when tapped
- `haystack` — a single lowercased string containing everything worth matching

Once every item looks the same, the search itself is trivial.

---

## 2. `buildIndex()` — flatten all sources into records

```js
function buildIndex() {
  const items = []
  for (const c of consonants) {
    items.push({ kind: 'alphabet', label: c.letter, hint: c.sound,
      to: '/alphabet/consonants', haystack: `${c.letter} ${c.sound}` })
  }
  // …vowels, tones, vocab (nested: cat → words), grammar, everyday, readings…
  return items.map((i) => ({ ...i, haystack: normalize(i.haystack) }))
}
```

Two things to notice:
- **Nested data gets double-looped and flattened** — e.g. `for (cat) for (w of cat.words)`
  pushes one record per word, discarding the category nesting (but keeping the
  route via `to: /vocabulary/${cat.id}/${w.id}`).
- **The `haystack` is precomputed** — you build the searchable string once (label +
  hint + any tags), then `normalize` it (lowercase + trim). Precomputing means the
  per-keystroke filter does zero string-building.

```js
function normalize(s) { return (s || '').toLowerCase().trim() }
```
`(s || '')` guards against `undefined` so `.toLowerCase()` never crashes.

---

## 3. Build the index ONCE, at module load

```js
const INDEX = buildIndex()   // top-level const — runs once when the file is imported
```

This is the key performance move. The data is static, so there's no reason to
rebuild the index on every render or keystroke. Building it once at module scope
means every search just filters an already-built array.

(If the data could change at runtime you'd wrap it in `useMemo` inside the
component instead — but here it's constant, so a module-level `const` is simplest.)

---

## 4. Filter on the query with `useMemo`

```js
const [q, setQ] = useState('')

const grouped = useMemo(() => {
  const norm = normalize(q)
  if (!norm) return null                                   // empty query → show the hint, not "no results"
  const hits = INDEX.filter((i) => i.haystack.includes(norm)).slice(0, 80)
  return hits.reduce((acc, h) => {                          // group by kind
    acc[h.kind] = acc[h.kind] || []
    acc[h.kind].push(h)
    return acc
  }, {})
}, [q])
```

Step by step:
- **`useMemo(..., [q])`** recomputes only when the query changes — not on unrelated
  re-renders.
- **`if (!norm) return null`** distinguishes "haven't typed yet" (`null` → prompt)
  from "typed but nothing matched" (`{}` → "No results"). Three states from one
  value: `null`, empty object, populated object.
- **`.includes(norm)`** is a plain substring match — simple and good enough. (No
  fuzzy matching; that's a deliberate simplicity choice.)
- **`.slice(0, 80)`** caps results so a one-letter query doesn't render thousands
  of rows.
- **`.reduce(...)`** turns the flat hit list into `{ alphabet: [...], vocab: [...] }`
  so the UI can render labeled sections. The `acc[kind] = acc[kind] || []` idiom
  lazily creates each bucket the first time a kind appears.

---

## 5. Render the grouped results

```jsx
{grouped && Object.entries(grouped).map(([kind, items]) => (
  <View key={kind}>
    <Text>{KIND_LABEL[kind]} · {items.length}</Text>
    {items.map((r, i) => (
      <Link key={`${r.to}-${i}`} href={r.to} asChild>
        <Pressable>…{r.label}…{r.hint}…</Pressable>
      </Link>
    ))}
  </View>
))}
```

- `Object.entries(grouped)` → `[kind, items]` pairs to map over.
- `KIND_LABEL` maps the internal `kind` slug to a display name ('vocab' → 'Vocabulary').
- Each row is a `<Link href={r.to} asChild>` around a `Pressable` — same `asChild`
  pattern as elsewhere, so tapping navigates to that item's page.
- Key is `` `${r.to}-${i}` `` because the same route can appear twice; the index
  makes it unique.

---

## 6. Why this pattern is good

- **One shape to search, one shape to render** — no per-type special-casing in the
  hot path.
- **Index built once**, filter is O(n) substring — trivial for this data size.
- **Decoupled from sources**: to make something new searchable, you only add a loop
  in `buildIndex` that pushes the same 5-field record. Nothing else changes.

---

## ⚠️ One caveat to fix (stale routes)

`buildIndex` currently points alphabet/grammar/everyday/reading results at the OLD
routes — `to: '/alphabet/consonants'`, `'/course/grammar'`, etc. Now that those
pages were folded into the tabbed **Reference** page, those links are stale. When
you retire `/alphabet` and `/course`, update the `to:` values here (e.g.
`/reference/consonants`, `/reference/grammar`) or the search results will dead-end.
It also still imports from `src/data/alphabet.js` / `course.js` rather than
`reference.js` — worth unifying so search and Reference share one source.
