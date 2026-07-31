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
  function every render would re-render every consumer needlessly.
- The context `value` is a `useMemo` of `{ ...state, ...actions }`, recomputed only
  when `state` (or an action) changes — so consumers re-render on real changes, not
  on every parent render.

You don't strictly *need* these for correctness, but they're the standard way to
keep a context cheap.

---

## 6. How the screen consumes it (`app/notebook/[tab].jsx`)

- Two tabs (`saved` / `notes`) via the route-based `Tabs` (here it navigates —
  contrast with the Reference page's controlled/state Tabs).
- **SavedWords**: builds a `wordById` lookup from `categories`, maps
  `Object.keys(savedWords)` to cards, each with inline edit (`TextInput`) that calls
  `updateWordNote`, plus open/remove. Local `useState` holds the in-progress edit
  text; committing calls the context action.
- **Notes**: "New Note" → `createNote`; each `NoteItem` toggles a local `editing`
  flag and edits title/body in `TextInput`s, `updateNote` on save,
  `deleteNote` (behind an `Alert.alert` confirm) on delete.

The pattern to notice: **transient UI state (what you're typing, whether you're
editing) is LOCAL `useState`; the durable data is in the context.** Local state is
throwaway; context state is what gets persisted.

---

## Rebuild-it checklist

1. Pick shapes: keyed object for saved-by-id, array for the ordered list.
2. Context + provider + `useNotebook` guard.
3. `useState` for the data, two effects for load/save, `hydrated` guard.
4. CRUD actions, all immutable (spread / map / filter / computed keys).
5. `useCallback` the actions, `useMemo` the value.
6. Screen: context for durable data, local `useState` for edit-in-progress.
