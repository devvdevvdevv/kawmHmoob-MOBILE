# Tabs: route-based → also state-based (controlled mode) (2026-07-31)

Why the reference page (`app/(tabs)/reference.jsx`) needs `src/components/Tabs.jsx`
to support a second mode, and the exact logic — written down because the
`typeof onChange` check caused real confusion.

## The problem

`Tabs` was **route-based only**: it read `usePathname()` and each tab was a
`<Link>` to `/basePath/<id>`. That's perfect for alphabet/course (each tab IS a
route). But the reference page is ONE screen that switches sections with local
state — no navigation, no per-tab URL. Route-based Tabs never highlights there.

## The fix: make Tabs work BOTH ways ("controlled" mode)

Add two optional props — the same contract as a controlled `<input value onChange>`:
- `active`   — value flowing IN ("which tab is selected right now")
- `onChange` — event flowing OUT ("the user tapped this id")

```jsx
export default function Tabs({ basePath, tabs, active, onChange }) {
  const pathname = usePathname() || ''
  const controlled = typeof onChange === 'function'   // ← the mode switch

  return (
    <View className="...">
      {tabs.map((t) => {
        const href = `${basePath}/${t.id}`
        const isActive = controlled
          ? active === t.id                                      // STATE mode
          : pathname === href || pathname.startsWith(href + '/') // ROUTE mode

        return controlled ? (
          // STATE MODE — no Link; tapping calls onChange
          <Pressable key={t.id} onPress={() => onChange(t.id)} className={`... ${isActive ? '...' : ''}`}>
            <Text className={`... ${isActive ? 'text-clay-700' : 'text-stone-600'}`}>{t.label}</Text>
          </Pressable>
        ) : (
          // ROUTE MODE — original behavior; Link navigates
          <Link key={t.id} href={href} asChild>
            <Pressable className={`... ${isActive ? '...' : ''}`}>
              <Text className={`... ${isActive ? 'text-clay-700' : 'text-stone-600'}`}>{t.label}</Text>
            </Pressable>
          </Link>
        )
      })}
    </View>
  )
}
```

## The confusing bits, explained

### 1. `const controlled = typeof onChange === 'function'`

This asks ONE yes/no question: **"did the parent hand me an `onChange` to call?"**
- `typeof` returns the *type* as a **string**, never the variable name.
  `typeof setTab` is `"function"`, NOT `"setTab"`. Names are erased at runtime.
- `=== 'function'` compares that string → a boolean.

### 2. Where `undefined` comes from — a DIFFERENT caller

`Tabs` has multiple callers; not all pass `onChange`:

| Caller | passes onChange? | onChange value | typeof | controlled | mode |
|---|---|---|---|---|---|
| reference.jsx | yes (`setTab`) | the function | `"function"` | true | state |
| alphabet / course `[tab].jsx` | no | `undefined` | `"undefined"` | false | route |

A prop a caller omits arrives as `undefined` inside the function. So the "undefined
branch" isn't hypothetical — it fires every time alphabet/course render Tabs
(they write `<Tabs basePath tabs />`, no onChange).

### 3. What you actually pass as onChange

`const [tab, setTab] = useState('consonants')` returns **[value, setter]**:
- `setTab` (the setter) → a FUNCTION → this is what you pass: `onChange={setTab}`.
- `tab` (the value) → the string `'consonants'` → `typeof tab === "string"`.
- `useState` itself is also a function (the hook) you call to get the pair.

## Why the state version re-renders (the full loop)

Tap a state-mode tab → `onPress` → `onChange(t.id)` → which is `setTab(id)` →
parent state changes → **React re-renders `Reference`** → the same `tab` value is
read in TWO places: `<Tabs active={tab}>` re-highlights, and
`{tab === 'vowels' && <Section/>}` swaps the content. No URL, no navigation — one
`useState` drives both. This is "lifting state up": parent owns the state, Tabs is
a dumb controlled display.

## Gotchas

- **`onPress={() => onChange(t.id)}`** must be an arrow. `onPress={onChange(t.id)}`
  calls it during render (infinite loop), not on tap.
- **`key`** goes on the OUTERMOST element of each branch (Pressable in state mode,
  Link in route mode).
- **Name clash:** don't keep `const active = pathname === ...` inside the map — it
  shadows the `active` prop. Rename the inner one to `isActive`.
- **No Link in state mode.** A `<Link>` with no valid `href` is exactly why taps
  went nowhere before — controlled mode must not wrap in Link at all.
- **Backward compatible:** alphabet/course pass no onChange → fall through to the
  untouched route branch.
