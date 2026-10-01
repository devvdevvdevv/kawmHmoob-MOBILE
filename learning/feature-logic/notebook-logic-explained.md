# Learning: how the Notebook works (state, persistence, CRUD)

The Notebook stores two things per user: **saved words** and **free-form notes**.
The whole feature is one React Context (`src/context/NotebookContext.jsx`) plus a
screen that reads it (`app/notebook/[tab].jsx`). This doc explains the fundamentals
so you could rebuild it yourself.

---

## 1. The data model (the shape everything hangs off)

```js
const initialState = {
  savedWords: {},   // an OBJECT keyed by wordId  → { note, savedAt }
  notes: [],        // an ARRAY of note objects
}
```

Two different shapes on purpose:
- **`savedWords` is an object/map** because you look words up *by id* ("is `dog`
  saved?") and each word can be saved only once. Keying by id makes
  save/unsave/lookup O(1) and naturally dedupes.
- **`notes` is an array** because notes are an ordered list you scroll, each with
  its own generated id. Order matters (newest first); identity doesn't collapse.

Rule of thumb you can reuse: **keyed-by-id → object; ordered list → array.**

---

## 2. Context = shared state without prop-drilling

`NotebookProvider` wraps the app and holds the state; any component calls
`useNotebook()` to read it or mutate it. Without context you'd have to thread
`savedWords` + every setter through every screen by hand.

```jsx
const NotebookContext = createContext(null)

export function NotebookProvider({ children }) {
  const [state, setState] = useState(initialState)
  // ...actions...
  const value = useMemo(() => ({ ...state, saveWord, /* ... */ }), [state, /* ... */])
  return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>
}

export function useNotebook() {
  const ctx = useContext(NotebookContext)
  if (!ctx) throw new Error('useNotebook must be used inside NotebookProvider')
  return ctx
}
```

The `if (!ctx) throw` guard is a kindness to future-you: if you forget to wrap the
tree in the provider, you get a clear message instead of a cryptic "cannot read
property of null".

---

## 3. Persistence — load once, save on every change

State lives in memory; to survive an app restart it's mirrored to storage
(`loadJSON`/`saveJSON` in `src/lib/storage.js`), namespaced **per user**:

```js
const KEY_PREFIX = 'kawmhmoob.notebook.'
const userId = user?.id || 'guest'   // guests get their own bucket
```

Two effects do the work:

```jsx
// LOAD when the user changes (login/logout/guest)
useEffect(() => {
  let active = true
  setHydrated(false)
  loadJSON(KEY_PREFIX + userId, initialState).then((next) => {
    if (!active) return                       // ignore a stale load if user switched again
    setState({ ...initialState, ...next })    // merge, so missing keys get defaults
    setHydrated(true)
  })
  return () => { active = false }             // cleanup guards against a race
}, [userId])

// SAVE whenever state changes — but only AFTER the first load finished
useEffect(() => {
  if (!hydrated) return                       // ← the important guard
  saveJSON(KEY_PREFIX + userId, state)
}, [userId, state, hydrated])
```

**Why the `hydrated` guard matters (the subtle bug it prevents):** without it, on
first mount the save-effect would fire immediately with the empty `initialState`
and *overwrite* the user's real saved data before the async load came back. `hydrated`
says "don't save until we've loaded." This load→guard→save pattern is worth
memorizing — it applies to any persisted context.

---

## 4. The actions — immutable updates, always new objects

Every action produces a **new** object/array rather than mutating the old one.
React only re-renders when the reference changes, so mutating in place
(`state.notes.push(...)`) would silently fail to update the UI.

**Saved words (object keyed by id):**
```js
saveWord(wordId, note='') → { ...s, savedWords: { ...s.savedWords, [wordId]: { note, savedAt: nowISO } } }
unsaveWord(wordId)        → copy savedWords, `delete next[wordId]`, return { ...s, savedWords: next }
updateWordNote(wordId, note) → bail if not saved, else spread-replace that one entry
```
Note the `[wordId]:` — **computed property name**: the key comes from a variable.
That's how you set/replace one entry in a keyed object immutably.

**An action that can REFUSE.** `saveWord` is capped — a notebook holds at most
`NOTEBOOK_WORD_LIMIT` (15) words — so it can't always do what it's asked. It
returns a boolean saying whether it happened:

```js
const saveWord = useCallback((wordId, note = '') => {
  if (state.savedWords[wordId]) return true                       // already there — fine
  if (Object.keys(state.savedWords).length >= NOTEBOOK_WORD_LIMIT) return false
  setState((s) => ({ ...s, savedWords: { ...s.savedWords, [wordId]: { note, savedAt: nowISO } } }))
  return true
}, [state.savedWords])
```

Three things to notice:

1. **Already-saved returns `true`, not `false`.** Re-saving a word you already have
   isn't a failure — nothing changed, but the caller's intent ("this word is in my
   notebook") is satisfied. Only a genuine refusal returns `false`. Getting this
   backwards would pop a "notebook is full" warning on words already in it.
2. **The check reads `state`, not the `s` inside the updater.** Deciding and
   reporting have to happen *before* `setState`, because the updater's return value
   goes to React, not to you. That's why the dep array is `[state.savedWords]` and
   not `[]` like the other actions.
3. **The limit is a `const` exported from the context**, not a number typed into a
   screen. One source; every surface that shows "12 / 15" reads it.

The caller decides what a refusal means. `WordDetail` turns it into a message:

```jsx
setLimitHit(!saveWord(word.id))   // false → the tap did nothing → explain why
```

**Notes (array):**
```js
createNote(data) → prepend: { ...s, notes: [note, ...s.notes] }   // newest first
updateNote(id, patch) → s.notes.map(n => n.id === id ? { ...n, ...patch, updatedAt } : n)
deleteNote(id) → s.notes.filter(n => n.id !== id)
```
`map` to edit one, `filter` to remove one — both return a new array. `createNote`
stamps `createdAt`/`updatedAt`; `updateNote` bumps `updatedAt`.

**ids:** `newId()` = `note-<base36 time>-<random>` — timestamp keeps them sortable-ish,
the random suffix avoids collisions if two are made in the same millisecond.

---

## 5. Why `useCallback` + `useMemo` wrap everything

- Each action is wrapped in `useCallback(fn, [])` so it keeps the **same function
  reference** across renders. Since these get passed down through context, a fresh
  function every render would re-render every consumer needlessly. (`saveWord` is
  the exception — it reads state to decide, so its deps are `[state.savedWords]`.)
- The context `value` is a `useMemo` of `{ ...state, ...actions }`, recomputed only
  when `state` (or an action) changes — so consumers re-render on real changes, not
  on every parent render.

You don't strictly *need* these for correctness, but they're the standard way to
keep a context cheap.

---

## 6. How the screen consumes it (`app/notebook/[tab].jsx`)

- **One live tab** (`saved`) via the route-based `Tabs` (here it navigates —
  contrast with the Reference page's controlled/state Tabs). The `notes` tab entry
  and its render line are **commented out**, not deleted — the `Notes` and
  `NoteItem` components below them still compile and are ready to switch back on.
- **SavedWords** builds a `wordById` lookup from `categories`, then a `deck` of the
  saved ids that still resolve to a real word:

  ```js
  const deck = Object.keys(savedWords).map((id) => wordById[id]).filter(Boolean)
  ```

  That `.filter(Boolean)` is load-bearing. A saved id can outlive its word (renamed
  or dropped from `vocabulary.js`), and a `undefined` in the deck would crash the
  flashcard and desync the card counter. **Stored ids are references to data you
  don't control — always re-resolve and drop what's gone.**
- **Two modes, one piece of local state**: `mode` (`'list'` / `'flashcard'`) and
  `cardIdx`. Both are transient — nothing about which card you're on is worth
  persisting — so both are local `useState`, never context.
- **Per-word notes are commented out**: the `note`/`editing` state, the `save`
  handler, the `onUpdate` prop, and the `TextInput` block. `updateWordNote` still
  exists on the context, commented out of the destructure.
- **Notes** (when re-enabled): "New Note" → `createNote`; each `NoteItem` toggles a
  local `editing` flag and edits title/body in `TextInput`s, `updateNote` on save,
  `deleteNote` on delete behind a `ConfirmModal` (a real modal, not `Alert.alert`,
  which doesn't render on web).

The pattern to notice: **transient UI state (what you're typing, which card you're
on, which mode you're in) is LOCAL `useState`; the durable data is in the context.**
Local state is throwaway; context state is what gets persisted.

---

## 7. Derived state belongs in the provider

The screen needs "12 / 15 words saved". It could count keys itself — but then every
surface that wants the count re-implements it, and they can drift. Instead the
provider computes it once and puts it on the value:

```js
const savedWordCount = Object.keys(state.savedWords).length

const value = useMemo(() => ({
  ...state,
  savedWordCount,
  wordLimit: NOTEBOOK_WORD_LIMIT,
  isWordLimitReached: savedWordCount >= NOTEBOOK_WORD_LIMIT,
  saveWord, /* ... */
}), [state, savedWordCount, /* ... */])
```

**Derived ≠ stored.** `savedWordCount` is never in `initialState` and never
persisted — it's recomputed from `savedWords` on every render that matters. Storing
it would create a second source of truth that can disagree with the first (save a
word, forget to bump the count, and now the cap lies).

Note the count and the deck can legitimately differ: `savedWordCount` counts every
stored id (that's what the cap limits), while `deck.length` counts the ones that
still resolve to a word.

---

## 8. Reusing a component across features (the study deck)

Study mode renders `src/components/vocabulary/Flashcard.jsx` — **unchanged**. The
flashcard never knew where its word came from; it takes `word` and reads its own
status from `ProgressContext`. So pointing it at the notebook instead of a category
took no edits to the card at all.

What *did* have to move: the three deck-nav icons were local to `VocabList.jsx`.
Two decks needed them, so they became
`src/components/common/DeckNavIcons.jsx` and both import from there. **The moment a
second caller appears, a private helper becomes a shared module** — copying it
instead is how two subtly different arrow icons end up in one app.

---

## Rebuild-it checklist

1. Pick shapes: keyed object for saved-by-id, array for the ordered list.
2. Context + provider + `useNotebook` guard.
3. `useState` for the data, two effects for load/save, `hydrated` guard.
4. CRUD actions, all immutable (spread / map / filter / computed keys).
5. `useCallback` the actions, `useMemo` the value.
6. Screen: context for durable data, local `useState` for edit-in-progress.
7. Cap it: one exported constant, the action returns whether it happened, the
   caller decides what a refusal looks like on screen.
8. Derive counts in the provider (`savedWordCount`), never store them.

---

# Exercises

Do these against the real app — `npx expo start`, open **Notebook → Saved Words**.
Predict the outcome *before* you run each one; the prediction is the exercise.

**1. Break the cap on purpose.**
In `NotebookContext.jsx`, change `NOTEBOOK_WORD_LIMIT` to `2`. Save three words.
Where does the third one stop — the button, the context, or the storage write? The
"12 / 15" counter follows your new number; two lines of user-facing copy do NOT.
Find both, and say what it would take to make copy read a constant — and whether
that's worth doing for a sentence.

```
grep -rn "15 words\|up to 15" app/ src/
```

**2. Get the already-saved case backwards.**
Change the first line of `saveWord` from `return true` to `return false`. Fill your
notebook, then open a word **already in it** and tap Save twice. Describe exactly
what the user sees and why it's wrong. This is the bug the ordering prevents.

**3. Move the check inside the updater.**
Try to make `saveWord` decide inside `setState((s) => …)` and still return a boolean
to the caller. Write down why you can't do it cleanly. (Two reasons: one about
*when* the updater runs, one about what its return value is for.)

**4. Delete the `.filter(Boolean)`.**
In `SavedWords`, drop the filter from the `deck` line. Then, in
`src/data/vocabulary.js`, rename the `id` of a word you have saved. Reopen the
notebook. What breaks in list mode? What breaks in study mode? Which one is worse,
and why does the counter make it worse still?

**5. Persist the wrong thing.**
Move `cardIdx` out of local `useState` and into the context state (so it gets
saved to storage). Everything still works — so argue the case *against* it in a
paragraph. Then do the same thought experiment for `savedWordCount`: what's the
specific way a stored count goes wrong that a derived one can't?

**6. Delete the `hydrated` guard.**
Comment out `if (!hydrated) return` in the save-effect. Save a few words, force-quit
the app, reopen it. Explain the sequence of events that ate your data — in terms of
which effect fires first and what `state` held at that moment.

**7. Reuse the flashcard a third time.**
Sketch (don't build) how you'd show a Flashcard deck of *only the words you've
marked Learning*, from the Review screen. Which existing pieces do you reuse
unchanged, and what is the one new line — the deck-building line — for that case?

**8. Audit the reuse boundary — starting with a real miss.**
The deck-nav icons moved out of `VocabList` the moment a second caller appeared.
The status pill did **not**: there is a `StatusPill` in `VocabList.jsx` and a
near-copy in `app/notebook/[tab].jsx`. Find both, list exactly what differs (it
isn't nothing), and decide whether extracting is worth it. Then write the rule you
used to tell "duplicate it" from "extract it" — and check it against a third
opinion, the status badge inside `Flashcard.jsx`, which shares the same three states
and is deliberately built a different way again.

```
grep -rn "known:\|learning:\|new:" src/components app --include=*.jsx
```

**9. Design the quiz that doesn’t exist yet.**
The notebook is capped at 15 so it can have its own quiz later. Read
`src/components/quiz/QuizEngine.jsx` and write down what a notebook quiz needs that
a category quiz gets for free — specifically, where a 15-word deck struggles to
produce four plausible multiple-choice options, and two ways around it.

**10. Bring the Notes tab back.**
Everything needed is commented out in place. Restore it — the tab entry, the render
line, the `TodayCard` suggestion, and the two pieces of copy. Then list, from memory
first and by grepping second, every file you had to touch.

```
grep -rn "notebook/notes\|label: 'Notes'\|updateWordNote" app/ src/
```
