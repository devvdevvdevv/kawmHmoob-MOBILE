# Learning: Converting the web Reference page to React Native

A teach-yourself guide. You'll build the Reference page (tabs: **consonants ·
vowels · tones · grammar**) by porting the web app's `Reference.jsx` +
`LetterGrid.jsx` + `ToneRows.jsx`, fed by `src/data/reference.js`. Every section
shows the **web original**, the **RN equivalent**, and — most importantly — **why**
the change is needed. Type it yourself; don't paste.

---

## 0. The shape of what you're building

```
app/(tabs)/reference.jsx        ← the screen (state + tabs + section switch)
src/components/reference/
  LetterGrid.jsx                ← consonant/vowel tiles (with audio)
  ToneRows.jsx                  ← tone rows
  (GroupedConsonants, GroupedVowels, GrammarTables can live in reference.jsx
   or here — your call)
src/components/Tabs.jsx         ← add a "controlled" mode (small change)
```

Data comes from `src/data/reference.js`:
`consonantGroups, vowelGroups, tones, grammar`.

---

## 1. The RN conversion cheat sheet

You'll apply these mechanically every time. React Native has **no DOM** — no
`div`, `span`, `p`, `h3`, `ul`, `li`, and no CSS `grid`.

| Web (HTML/JSX) | React Native |
|---|---|
| `<div>` | `<View>` |
| `<span> <p> <h3> <li>` (any text) | `<Text>` (text MUST be inside `<Text>`) |
| `<ul><li>` | `<View>` with child `<View>`s |
| `<button onClick>` | `<Pressable onPress>` |
| `<Link to=…>` (react-router) | `<Link href=…>` (expo-router) |
| `className="…"` | `className="…"` works via NativeWind — mostly |
| `grid grid-cols-3` | `flex-row flex-wrap` + fixed-width children |
| `divide-y divide-cream-200` | add `border-t border-cream-200` to items after the first |
| `hidden sm:block` (responsive show/hide) | decide once: keep it or drop it |
| `space-y-8` / `space-y-2` | `gap-8` / `gap-2` on the parent (RN flex gap works) |
| `hover:*` | drop it, or use Pressable `active:*` |

**Golden rule:** any bare text ("Hello", `{it.sound}`) must be wrapped in `<Text>`.
This is the #1 RN error — "Text strings must be rendered within a `<Text>`".

---

## 2. LetterGrid — the consonant/vowel tiles

**Web original** (`components/reference/LetterGrid.jsx`):

```jsx
export default function LetterGrid({ items }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {items.map((it) => (
        <div key={it.letter} className="surface p-3 text-center">
          <div className="flex justify-end mb-1">
            <AudioButton audioSrc={it.audio} wordId={it.letter} />
          </div>
          <div className="font-display text-2xl text-clay-700">{it.letter}</div>
          {it.sound && <div className="text-xs text-stone-500 mt-1">{it.sound}</div>}
        </div>
      ))}
    </div>
  )
}
```

**What has to change:**
- `div → View`, the two text `div`s → `Text`.
- `grid grid-cols-3 … md:grid-cols-6` → RN has no grid. Use `flex-row flex-wrap`
  and give each tile a fixed width so they wrap into columns. (Your old alphabet
  Grid already did this with `w-[100px]`.)
- `surface` is a web utility class — in RN use the explicit tile styling the app
  uses elsewhere: `rounded-md bg-cream-50 border border-cream-200`.
- `font-display` → in this RN app the serif font class is `font-serif`.
- **Keep `audioSrc={it.audio}`** — this is the whole point. `reference.js` supplies
  real paths and the clips are bundled, so audio will play (see §8).

**RN target (your version):**

```jsx
import { View, Text } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'

export default function LetterGrid({ items }) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {items.map((it) => (
        <View key={it.letter} className="w-[100px] rounded-md bg-cream-50 border border-cream-200 p-3 items-center">
          <View className="self-end mb-1">
            <AudioButton audioSrc={it.audio} wordId={it.letter} />
          </View>
          <Text className="font-serif text-2xl text-clay-700">{it.letter}</Text>
          {it.sound ? <Text className="text-xs text-stone-500 mt-1 text-center">{it.sound}</Text> : null}
        </View>
      ))}
    </View>
  )
}
```

Note `text-center` on a `View` doesn't center text in RN — use `items-center`
(cross-axis) on the tile, and `text-center` only on the `<Text>` itself. Also
`{cond && <JSX/>}` is fine, but `{cond ? <JSX/> : null}` avoids the trap where a
falsy `0`/`''` renders as stray text.

---

## 3. ToneRows — the tone list

**Web original** (`components/reference/ToneRows.jsx`), trimmed:

```jsx
<div className="space-y-2">
  {items.map((t) => (
    <div key={t.name} className="surface flex items-center gap-4 p-4">
      <div className="w-10 font-display text-2xl text-clay-700 text-center">{t.marker || '–'}</div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-stone-800">{t.name}</div>
        <div className="text-sm text-stone-600">{t.description}</div>
      </div>
      <div className="text-sm text-stone-700 italic hidden sm:block">{t.example2}</div>
      <AudioButton audioSrc={t.audio} wordId={t.name} />
    </div>
  ))}
</div>
```

**Changes:**
- `space-y-2` → `gap-2` on the parent `View`.
- `flex items-center` → `flex-row items-center` (RN flex defaults to **column**;
  you must say `flex-row` for horizontal — this is the single most common RN
  surprise coming from web).
- Each text `div` → `Text`. The marker `<div>` becomes a `View` wrapping a `Text`
  (because it has width `w-10` + centering) — or just a `Text` with `w-10 text-center`.
- `hidden sm:block` on `example2`: RN has no breakpoints here. Decide — on a phone
  it's tight, so either drop `example2` or keep it always-on. Keep it simple.

**RN target:**

```jsx
<View className="gap-2">
  {items.map((t) => (
    <View key={t.name} className="rounded-md bg-cream-50 border border-cream-200 flex-row items-center gap-4 p-4">
      <Text className="w-10 font-serif text-2xl text-clay-700 text-center">{t.marker || '–'}</Text>
      <View className="flex-1">
        <Text className="font-semibold text-stone-800">{t.name}</Text>
        <Text className="text-sm text-stone-600">{t.description}</Text>
      </View>
      <AudioButton audioSrc={t.audio} wordId={t.name} />
    </View>
  ))}
</View>
```

(You can add `<Text className="text-sm text-stone-700 italic">{t.example2}</Text>`
before the AudioButton if you want the Cim name shown.)

---

## 4. The grouped sections

`reference.js` exposes `consonantGroups` and `vowelGroups` — each is
`{ id, title, blurb, items }`. The web wraps each group in a `<section>` with a
heading + count, then a `LetterGrid`.

**Web:**

```jsx
function GroupedConsonants({ groups }) {
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g.id}>
          <div className="mb-3">
            <h3 className="font-display text-xl text-stone-900">
              {g.title} <span className="text-stone-400 text-base">({g.items.length})</span>
            </h3>
            <p className="text-sm text-stone-600">{g.blurb}</p>
          </div>
          <Grid items={g.items} />
        </section>
      ))}
    </div>
  )
}
```

**RN** — `section → View`, `h3 → Text`, `span → Text` (nested `<Text>` inside a
`<Text>` is legal in RN and is how you get mixed styling on one line):

```jsx
function GroupedLetters({ groups }) {
  return (
    <View className="gap-8">
      {groups.map((g) => (
        <View key={g.id}>
          <View className="mb-3">
            <Text className="font-serif text-xl text-stone-900">
              {g.title} <Text className="text-stone-400">({g.items.length})</Text>
            </Text>
            <Text className="text-sm text-stone-600">{g.blurb}</Text>
          </View>
          <LetterGrid items={g.items} />
        </View>
      ))}
    </View>
  )
}
```

Consonants and vowels have the **same shape**, so one `GroupedLetters` component
serves both — pass `consonantGroups` or `vowelGroups`. (The web has two nearly
identical functions; you can collapse them.)

---

## 5. GrammarTables + the "Learn this →" link

**Web:**

```jsx
<div className="grid gap-5 sm:grid-cols-2">
  {sections.map((s) => (
    <div key={s.title} className="surface p-6 flex flex-col">
      <h3 className="font-display text-xl text-stone-900 mb-1">{s.title}</h3>
      <p className="text-sm text-stone-500 mb-3 italic">{s.note}</p>
      <ul className="divide-y divide-cream-200 flex-1">
        {s.items.map((it) => (
          <li key={it.hmong} className="flex justify-between gap-3 py-2 text-sm">
            <span className="font-medium text-clay-700">{it.hmong}</span>
            <span className="text-stone-600 text-right">{it.english}</span>
          </li>
        ))}
      </ul>
      {s.lesson && (
        <Link to={`/learn/${s.lesson.unitId}/${s.lesson.lessonId}`} className="…">
          Learn this <ArrowRightIcon size={14} />
        </Link>
      )}
    </div>
  ))}
</div>
```

**Changes:**
- `grid sm:grid-cols-2` → on a phone just **stack** them: `gap-5` column of cards.
  (Two columns is a desktop nicety; skip it.)
- `ul/li` → `View`s. `divide-y` has no RN equivalent — recreate it by adding
  `border-t border-cream-200` to every row **after the first** using the map index:
  `className={\`flex-row justify-between py-2 ${i > 0 ? 'border-t border-cream-200' : ''}\`}`.
  (Your old `GrammarSection` already did exactly this — look at it.)
- `flex justify-between` → `flex-row justify-between`.
- The link: expo-router `<Link href=…>`. Render it **only when `s.lesson` exists**.

**RN link** (mind the known gotcha: `<Link asChild>` wrapping a component with a
**style array** crashes react-native-web — a plain `Pressable`/`Text` child is
safe):

```jsx
{s.lesson && (
  <Link href={`/learn/${s.lesson.unitId}/${s.lesson.lessonId}`} asChild>
    <Pressable className="flex-row items-center gap-1.5 mt-4">
      <Text className="text-sm font-medium text-clay-700">Learn this</Text>
      <ArrowRightIcon color={arrowColor} size={14} />
    </Pressable>
  </Link>
)}
```

For `ArrowRightIcon`, reuse the same `react-native-svg` icon pattern you already
built in `VocabList` / `words/session` (path `M4 12h15` + `M13 6l6 6-6 6`, colored
from a theme token). **Verify** each `s.lesson` id actually resolves to a Learn
route before relying on the link — where a lesson doesn't exist, `reference.js`
omits `lesson`, so the guard already hides it.

---

## 6. Upgrade `Tabs` to a controlled mode (the key enabler)

Today `src/components/Tabs.jsx` is **raoute-based**: it reads `usePathname()` and
each tab is a `<Link>`. On a single-screen Reference with local state, that never
lights up. Add an optional **controlled** mode: if the caller passes `active` +
`onChange`, switch by state instead of navigation.

Current core:

```jsx
const active = pathname === href || pathname.startsWith(href + '/')
return (
  <Link href={href} asChild>
    <Pressable className={`… ${active ? 'bg-cream-50 shadow-warm' : ''}`}>
      <Text …>{t.label}</Text>
    </Pressable>
  </Link>
)
```

Teach yourself this change: accept `active` and `onChange` props. When `onChange`
is provided, compare `active === t.id` and render a `Pressable` with
`onPress={() => onChange(t.id)}` (NO `<Link>`). When it isn't, keep the existing
route-based branch untouched so alphabet/course still work. One `if (onChange)`
fork around the returned element — that's it.

Signature becomes: `Tabs({ basePath, tabs, active, onChange })`.

---

## 7. Assemble the screen

```jsx
import { useState } from 'react'
import { View, Text } from 'react-native'
import TabScreen from '../../src/components/TabScreen.jsx'
import Tabs from '../../src/components/Tabs.jsx'
import { consonantGroups, vowelGroups, tones, grammar } from '../../src/data/reference.js'
import LetterGrid from '../../src/components/reference/LetterGrid.jsx'
import ToneRows from '../../src/components/reference/ToneRows.jsx'

const TABS = [
  { id: 'consonants', label: 'Consonants' },
  { id: 'vowels', label: 'Vowels' },
  { id: 'tones', label: 'Tones' },
  { id: 'grammar', label: 'Grammar' },
]

export default function Reference() {
  const [tab, setTab] = useState('consonants')
  return (
    <TabScreen>
      {/* header */}
      <Tabs tabs={TABS} active={tab} onChange={setTab} />
      {tab === 'consonants' && <GroupedLetters groups={consonantGroups} />}
      {tab === 'vowels' && <GroupedLetters groups={vowelGroups} />}
      {tab === 'tones' && <ToneRows items={tones} heading={null} />}
      {tab === 'grammar' && <GrammarTables sections={grammar} />}
    </TabScreen>
  )
}
```

`TabScreen` already gives you the themed background + scroll + safe padding, so you
don't manage scrolling yourself. **Delete the old hub body** (the two `<Link>`
cards) — this replaces it.

---

## 8. Why the audio "just works" now

`AudioButton` takes `audioSrc` (a path like
`/assets/audio/consonants/single-consonants/single-consonant-c.mp3`) and runs it
through `resolveAudioSrc`, which checks the bundled `AUDIO_MAP` first and falls
back to remote. Those consonant/vowel/tone clips **are** in the bundle (79 entries
in `audioMap.js`). So the ONLY thing you must do is pass `audioSrc={it.audio}` from
`reference.js` — which the web already does and you carried over in §2/§3. The old
alphabet.js Grid passed `null`; that's the silence you were fixing.

If a specific tile is silent, check that its `audio` path in `reference.js`
character-for-character matches a key in `audioMap.js` (a typo'd folder = a miss).

---

## 9. RN traps to watch (recap)

1. **Text not wrapped** → "Text strings must be rendered within a `<Text>`". Wrap
   every string.
2. **Missing `flex-row`** → things stack vertically. RN flex is column by default.
3. **`text-center` on a View** does nothing; center with `items-center`, or put
   `text-center` on the `<Text>`.
4. **`grid`, `divide-y`, `space-y`, `hover:`, `sm:`** — none are RN-native. Use the
   swaps in §1.
5. **`<Link asChild>` + a component taking a style ARRAY** crashes RNW — wrap a
   plain `Pressable`/`Text`.
6. **className on `Animated.View`** is unreliable (you hit this on the flashcard) —
   not relevant here since Reference has no animated wrappers, but keep it in mind.

---

## 10. Cleanup + verification

**Cleanup once it works:**
- Retire `app/alphabet/[tab].jsx`, `app/course/[tab].jsx` and their data files if
  nothing else uses them. **Grep first**: `href="/alphabet"`, `href="/course"`,
  and any `to: '/alphabet'` in breadcrumbs/drawer/Home — repoint or remove.
- If you extracted `LetterGrid`/`ToneRows` into `src/components/reference/`, delete
  the inline copies in the old files.

**Verify:**
- Bottom tab **Reference** opens on the Consonants tab (Single/Double/Triple/Quad
  sections, each with a count).
- Tapping Vowels / Tones / Grammar swaps content **without navigating** (URL /
  bottom-tab highlight unchanged).
- Tapping a letter's speaker plays audio.
- Grammar cards show "Learn this →" only where a lesson exists, and it navigates to
  the right `/learn/<unit>/<lesson>`.
- Works in light / dark / neon (all classes are themed tokens).

---

### Reference files to look at while you build
- Web: `HL-repo/src/pages/Reference.jsx`, `components/reference/LetterGrid.jsx`,
  `ToneRows.jsx`.
- RN patterns to copy: your `app/alphabet/[tab].jsx` (`Grid`/`ToneList`/border-t
  divider), `VocabList.jsx` (svg arrow icons, theme-token colors), `Tabs.jsx`.
- Data: `src/data/reference.js`.
