# GUIDE — tap a word in the path's Reading step to see it and save it (2026-09-25)

**Status: BUILT 2026-09-25** (same day, at the author's request). This file
stays as the implementation guide; see "As built" at the end for what
differed from the plan and how it was verified.

**The ask:** "introduce an additional learning for the reading path … reuse the
tap to see words logic in the reading, like how it does in the regular reading.
User taps an unknown word and can see it / save it."

The path's Reading step (`app/path/[unitId]/reading.jsx`, step 5 of a unit)
shows the unit's example sentences as plain text. The story reader
(`app/reading/story/[storyId]/index.jsx`) already does the hard part: press a
word, get a definition sheet. The job is to **share that logic**, not copy it,
and add a **Save** button.

---

## 1. What already exists, and where

| Piece | Where | What it does |
|---|---|---|
| `lookupWord(raw, story)` | `src/lib/wordLookup.js:140` | Answers a word in tiers: story glossary → dictionary → glossary phrase → dictionary compound. **Works with `story = null`**: it skips the glossary tier. |
| `normalizeWord(raw)` | same file | Strips edge punctuation, keeps tone letters. |
| `define(token, tokenId, lineHmong, tokenIndex)` | story reader `:400` | "Tier 0" first: is the pressed word part of a multi-word dictionary phrase *in that position* (`hnub tim`)? Then `lookupWord`. Then splits a phrase answer into **word-by-word parts**. Ends in `setDefined({ token, tokenId, entry, parts })`. |
| Token rendering | story reader `:865` | `line.hmong.split(/(\s+|[—–])/)`: separators render as plain text, each word as a pressable `<Text>`. The looked-up word becomes an inline `<View>` chip with `lookupTint`. |
| `lookupTint` | story reader `:306` | clay-600 at 22%, built from `THEME_TOKENS`, so it exists in every theme. |
| `WordModal` | story reader `:1330` | The bottom sheet: headword, English, source label, word-by-word table, example sentence, **Open in dictionary**, Close. |
| `useSheetPalette()` | story reader `:1186` | Resolved colours for the sheet. **Required**, because themed NativeWind classes do not resolve inside a `<Modal>` (see the memory note on the visual system). |
| Save a word | `NotebookContext.saveWord(id)` / `unsaveWord(id)`, and `WordDetail.jsx:~115` | Saving is **Pro** (`◆ Save` → `/paywall`), and `saveWord` returns `false` when the notebook is full. |

**Two facts that shape the design:**
1. **In stories the gesture is long-press**, because a plain tap already
   toggles that line's English. The path reading has **no per-line tap**: its
   English is one global "Show English" button. So a plain **tap** is free
   there, which is what the author asked for.
2. **Only a dictionary answer can be saved.** `lookupWord` only puts an `id` on
   tier-2/4 hits, and the notebook stores word ids. With `story = null`, every
   hit in the path reading is a dictionary hit, so almost every word is
   saveable.

---

## 2. The plan in one line

Move three things out of the 1,475-line story reader into shared files, give
the sheet a Save button, then use them in both readers.

```
src/lib/defineToken.js                 ← pure: token + line → { entry, parts }
src/components/reading/WordSheet.jsx   ← WordModal + useSheetPalette, + Save
src/components/reading/TappableLine.jsx← renders one line as pressable words
```

The story reader keeps its behaviour exactly. Only its code moves.

---

## 3. Step by step

### Step 1 — extract the lookup into `src/lib/defineToken.js`

Take the body of `define()` (story reader `:400–475`) and make it a **pure
function**: no React, no state.

```js
import { lookupWord, normalizeWord } from './wordLookup.js'

export const TOKEN_SPLIT = /(\s+|[—–])/          // the ONE split, used by the renderer too
export const isSeparator = (t) => /^(\s+|[—–])$/.test(t)

/** @returns {{ entry: object|null, parts: Array|null }} */
export function defineToken({ token, lineHmong = '', tokenIndex = -1, story = null }) {
  let entry = null
  // Tier 0 — the phrase the tapped word is standing in (copy the loop as-is,
  // INCLUDING the equality guard: normalizeWord(hit.hmong) === phrase).
  // …
  if (!entry) entry = lookupWord(token, story)
  // Word-by-word parts (copy as-is, including "drop a part that resolves back
  // to the phrase").
  // …
  return { entry, parts }
}
```

Keep every ⚠️ comment from the original. They record real bugs (the
`tus` / `tus xov` bug, the equality guard).

In the story reader, `define` shrinks to:

```js
const define = (token, tokenId, lineHmong, tokenIndex) =>
  setDefined({ token, tokenId, ...defineToken({ token, lineHmong, tokenIndex, story }) })
```

✅ **Check before moving on:** open a story, long-press `hnub` in a line with
"hnub tim", and the sheet should still say *hnub tim — the date* with a
word-by-word table. Nothing visible should change.

### Step 2 — move the sheet into `src/components/reading/WordSheet.jsx`

Move `WordModal` and `useSheetPalette` there **unchanged**, and export both.
Import it in the story reader. Again, nothing visible changes.

Keep these rules from the original:
- The sheet is **always rendered**, and shown with `visible`. Mounting it
  conditionally skips the enter animation.
- It uses **resolved colours** (`useSheetPalette`), never themed classes,
  because of the Modal boundary.
- **`onClose()` runs before `router.push()`.** Otherwise the sheet floats over
  the page it just opened.

### Step 3 — add Save to the sheet

Inside `WordSheet`, below "Open in dictionary", and only when `entry?.id`:

```jsx
const { isPro } = useSubscription()
const { savedWords, saveWord, unsaveWord } = useNotebook()   // same names WordDetail.jsx uses
const isSaved = Boolean(entry?.id && savedWords?.[entry.id])
const [full, setFull] = useState(false)

{!!entry?.id && (
  <Button
    variant={isSaved ? 'secondary' : 'primary'}
    className="mt-3"
    onPress={() => {
      if (!isPro) { onClose(); router.push('/paywall'); return }   // same rule as WordDetail
      if (isSaved) { unsaveWord(entry.id); setFull(false); return }
      setFull(!saveWord(entry.id))                                 // false = notebook full
    }}
  >
    {isSaved ? '✓ Saved' : isPro ? '+ Save word' : '◆ Save word'}
  </Button>
)}
{full && <Text style={{ color: p.muted }} className="text-xs mt-2">Your notebook is full.</Text>}
```

- **Use a static `style`/`className` on any Pressable**, never the function
  form, which renders invisible on native (see the memory note).
- Reset `full` when the sheet opens a new word (a `useEffect` on `entry?.id`).
- The story reader gets Save too, for free. Its sheet comment already mentions
  "the Save control", so this was always intended.

### Step 4 — `src/components/reading/TappableLine.jsx`

This is the story reader's token loop (`:865–955`) as a component:

```jsx
export default function TappableLine({ text, lineKey, activeTokenId, onDefine, gesture = 'tap', textClassName, textStyle }) {
  const tint = useLookupTint()                 // move the lookupTint IIFE into a hook here
  return (
    <Text className={textClassName} style={textStyle}>
      {text.split(TOKEN_SPLIT).map((token, i) => {
        if (!token || isSeparator(token)) return token
        const tokenId = `${lineKey}-${i}`
        const press = () => onDefine(token, tokenId, text, i)
        const handlers = gesture === 'tap' ? { onPress: press } : { onLongPress: press }
        // highlighted → inline <View> chip (copy the branch, its comments and the
        // RESTATED font style); otherwise a plain <Text>.
      })}
    </Text>
  )
}
```

- **`gesture`:** `'tap'` for the path reading, and `'longPress'` for stories,
  where `onPress` stays `toggleLine`. Pass `onPress` through as an extra prop
  for the story's case.
- **Use the same `TOKEN_SPLIT` everywhere.** The token indices that
  `defineToken` receives only line up if the renderer and the lookup split the
  line identically.

The story reader can switch to `TappableLine` last, as a separate, optional
step. Its token loop has story-only extras (the per-line tap, text-size steps),
so move it only if the props stay simple.

### Step 5 — wire it into `app/path/[unitId]/reading.jsx`

```jsx
const [defined, setDefined] = useState(null)
const onDefine = (token, tokenId, line, i) =>
  setDefined({ token, tokenId, ...defineToken({ token, lineHmong: line, tokenIndex: i, story: null }) })

// replace:  <Text className="text-lg text-stone-900 leading-relaxed">{l.hmong}</Text>
<TappableLine
  text={l.hmong}
  lineKey={l.id + k}
  activeTokenId={defined?.tokenId}
  onDefine={onDefine}
  gesture="tap"
  textClassName="text-lg text-stone-900 leading-relaxed"
/>

// once, at the end of the screen:
<WordSheet defined={defined} onClose={() => setDefined(null)} />
```

Then update the instructions line to *"Read each line in Hmong first. Tap any
word to see what it means and save it."*, keeping the old text in a `Was:`
comment.

**Why `story: null`:** the path reading has no author glossary, so the
dictionary answers. That is also what makes each word saveable (it has an id).
The source label will read the word's category, which is correct: it is a
dictionary word.

---

## 4. Decisions for the author before building

1. **Is Save Pro?** Everywhere else, saving to the notebook is Pro
   (`WordDetail`). Seeing a word's meaning should be free, which follows the
   fundamentals rule. The guide keeps Save as Pro for consistency. If Save
   should be free inside free path units (1–12), pass
   `canSave={isPro || unit.free}` to the sheet instead.
2. **Tap or long-press in stories?** The guide keeps stories on long-press,
   because tap is taken by the line's English. Only the path reading uses tap.
3. **"Words to watch" list?** An optional extra: under the reading, list the
   unit's words that appear in it, each tappable. It needs no new data
   (`unitWords(unit)`). Not in scope unless wanted.

---

## 5. Test checklist (on a device — sheets have bitten this app before)

- [ ] **Path reading:** tapping a word opens the sheet, and the word gets the
      clay chip. Tapping a space or a dash does nothing.
- [ ] **A phrase in a unit sentence** shows the phrase and its word-by-word
      table.
- [ ] **A word with no entry** shows "No entry for this word yet". It never
      opens nothing.
- [ ] **Save, as Pro:** Saved ✓ appears, the word shows in the notebook, and
      tapping again unsaves it. A full notebook shows the message.
- [ ] **Save, as free:** it goes to the paywall, and the sheet closes first.
- [ ] **Open in dictionary** lands on the word, with no sheet floating over it.
- [ ] **Stories are unchanged:** long-press still defines, tap still toggles the
      English, and the highlight chip doesn't change the line height.
- [ ] **All three themes:** the sheet colours are right (the Modal boundary).
- [ ] **Android:** the back button closes the sheet (`onRequestClose`), and Close
      isn't under the nav bar (the `insets.bottom` padding).

**Checks to run after:** `check-undefined-refs`, `check-notes` and
`check-reading`, plus lint on the three new files and both screens.

---

## 6. Files touched, when built

| File | Change |
|---|---|
| `src/lib/defineToken.js` | **new**: the pure lookup, from the story reader's `define()` |
| `src/components/reading/WordSheet.jsx` | **new**: `WordModal` + `useSheetPalette` moved, plus Save |
| `src/components/reading/TappableLine.jsx` | **new**: token rendering + highlight chip + `useLookupTint` |
| `app/reading/story/[storyId]/index.jsx` | imports the three; its local copies are commented out with a restore hint (house rule) |
| `app/path/[unitId]/reading.jsx` | tappable lines + sheet + updated instruction text |

---

## As built — 2026-09-25

The build followed the steps above, with these decisions and changes:

- **Decisions taken (the guide's defaults):** Save stays **Pro**, as in
  WordDetail. Stories keep **long-press**. No "Words to watch" list.
- **Step 1 (`src/lib/defineToken.js`):** the story reader's `define()` now calls
  `defineToken`. The old body is replaced by a `MOVED` pointer comment. The
  reader's `lookupWord` / `normalizeWord` import is commented out, since it is
  unused there now.
- **Step 2 (`src/components/reading/WordSheet.jsx`):** `WordModal` and
  `useSheetPalette` were moved **verbatim by script**, not retyped. The reader
  imports them back (`import WordModal, { useSheetPalette } …`), because its
  GlossaryModal still uses the palette. `MOVED` comments mark both old spots.
- **Step 3 (Save):** added to the sheet, so **stories get Save too**. The labels
  read "Save word" (Pro), "◆ Save word (Pro)" (free, which goes to the paywall
  after closing the sheet) and "Saved to notebook" (tap again to unsave). A
  "notebook is full" line appears only after a refused tap, and resets when a
  new word opens.
- **Step 4 (`src/components/reading/TappableLine.jsx`):** built with
  `useLookupTint()` and `gesture: 'tap' | 'longPress'`.
  **Changed from the plan:** the story reader was **not** switched to
  TappableLine. Its token loop has story-only extras (a per-line tap for
  English, text-size steps, the heading style), so it keeps its own loop and
  shares the split through the same regex. That was the optional step.
- **Step 5 (`app/path/[unitId]/reading.jsx`):** tappable lines, the sheet, and
  new instruction text ("Tap any word to see what it means and save it…"). The
  old line is in a `Was:` comment.

**Verified by bundling the real modules with esbuild and simulating taps:**
- Classifiers reading ("Kuv muaj ib tus aub."): every word resolves with an id,
  so every word is saveable.
- Questions reading: *tab* → **tab tom** and *dab* → **dab tsi** come back as
  phrases with word-by-word parts.
- **The story is unchanged:** *hnub* in Zong Vang still answers **hnub tim — the
  date**, with its parts.
- **Across every live path reading:** 1,096 words, of which **1,081 resolve**
  and **1,064 are saveable**.

**Lint** is clean on the four new or changed files, apart from the story reader's
pre-existing unused `useNotebook` import. All check scripts pass.

⚠️ **Not tried on a device.** Run the section 5 checklist, especially the chip's
line height on Android and the sheet colours in all three themes.

⚠️ **One trap hit during the build, worth knowing:** the story reader file has
**CRLF line endings**. A splice script that compared lines to `'  }'` never
matched (`'  }\r'`) and looped forever. Split on `/\r?\n/` and write the file
back with its own EOL.

---

## Update 2026-09-26: the sheet no longer covers the screen, and is easy to leave

**The author:** in the path reading the dictionary sheet "covers the full screen"
and needs "an easy way to leave it".

**Cause:** `WordSheet` had **no height limit**. A long entry (several senses, the
word-by-word table and an example) grew to the top of the screen, and pushed
Close below the bottom edge.

**Fix (`src/components/reading/WordSheet.jsx`), which applies to stories and the path:**
- **Capped at 60%** of the screen (`max-h-[60%]`), so the reading stays visible
  above the sheet.
- **The entry scrolls inside the sheet**, while **Save and Close stay pinned**
  underneath and are always reachable.
- **A ✕ in the top-right corner**, next to the handle. Together with a tap on the
  dimmed reading and the Close button, that makes **three ways out** (plus the
  Android back button).
- **It copies the story reader's `GlossaryModal` pattern exactly**, with its two
  hard-won rules:
  - **the scrim is a sibling, not the parent**, so a scroll isn't claimed by
    the close-tap;
  - **the ScrollView has `flexShrink: 1`**, without which it sizes to its content
    and breaks the cap.
- The ✕ uses a static `style`, following the house rule for Pressables.

**To check on a device:**
- Tap a phrase with a long entry (e.g. *dab tsi* in Questions, or *tus* in any
  reading). The sheet should stop at about 60%, scroll, and keep Close visible.
- The ✕, a tap on the reading, and Android back should each close it.

---

## Update 2026-09-26 (2): the sheet's buttons were invisible, and are now drawn by hand

**The author** asked for the sheet to link to the dictionary instead of saving,
then noticed the link was already there ("I didn't see") and asked for the
buttons to be **swapped** and **recoloured to match the UI and be visible**.

**Why nobody could see it:** the sheet used the app's `<Button>`, which styles
itself with **themed NativeWind classes**. Inside a `<Modal>` those resolve to
**transparent**. The Modal is a separate native root without the theme's CSS
variables; this is the exact problem `useSheetPalette` documents. So the
`ghost` "Open in dictionary" had no visible background, border or text.

**The fix (`src/components/reading/WordSheet.jsx`):**
- **A new in-file `SheetButton`,** drawn only with **palette colours resolved by
  hand**. The palette gained `accent` (clay-600), `accentInk` (clay-700),
  `onAccent` (cream-50) and `soft` (cream-200), all verified present in the
  light, dark and neon themes. It uses a **static `style`**, never the function
  form (house rule).
- **The order, swapped, and pinned below the scroll so all three are always
  on screen:**
  1. **Save word:** filled clay, cream text. Once saved it becomes an outline
     reading "✓ Saved to notebook".
  2. **Open in dictionary:** clay outline, clay text. It moved out of the
     scrolling area; it was inside it.
  3. **Close:** soft cream fill, ink text.
- **Behaviour is unchanged:** Save is still Pro (a free user goes to the
  paywall after the sheet closes), a full notebook still shows the message, and
  Open in dictionary still closes the sheet before navigating.
- The `Button` import is commented out with the reason.

⚠️ **Any `<Button>` inside a `<Modal>` in this app has the same problem.** The
story reader's **GlossaryModal** Close button is one to check on a device.

---

## Update 2026-09-26 (3): the reading's font matches the app

**The author:** "for the reading in the paths, make the text font match the rest
of the app."

The Hmong lines in `app/path/[unitId]/reading.jsx` rendered in the plain body
face (`text-lg text-stone-900`). Everywhere else, Hmong is set in **`font-serif`**
(Nunito Bold, per tailwind.config.js): the story reader's lines and the
flashcards. The `TappableLine` now gets
`font-serif text-lg text-stone-900 leading-relaxed`, and the old class is kept in
a comment.
- **The tapped-word highlight chip uses the same font,** because `TappableLine`
  passes the class to the chip's inner Text as well.
- **The English lines are unchanged:** `text-sm font-medium text-stone-600`, the
  app's standard secondary text.
