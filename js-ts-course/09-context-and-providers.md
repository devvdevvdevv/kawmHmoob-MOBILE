# 09 — Context and providers

Props flow down one level at a time (Lesson 06 §4). But the signed-in user, the
theme, the notebook and Pro status are needed **everywhere**. Passing them
through every component in between ("prop drilling") would be miserable.
**Context** lets any component, at any depth, read a value straight from a
provider above it.

---

## 1. Start from your code

`app/_layout.jsx` (the staircase):

```jsx
<ThemeProvider>
  <AuthProvider>
    <SubscriptionProvider>
      <ProgressProvider>
        <DrawerProvider>
          <NotebookProvider>
            …
              <ThemedShell />
```

`src/context/NotebookContext.jsx` (the parts that make it a context):

```jsx
const NotebookContext = createContext(null)                 // 1. create the channel

export function NotebookProvider({ children }) {
  // …state, effects, saveWord, etc.
  const value = useMemo(() => ({ ...state, saveWord, … }), [ … ])
  return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>   // 2. broadcast
}

export function useNotebook() {                             // 3. tune in
  const ctx = useContext(NotebookContext)
  if (!ctx) throw new Error('useNotebook must be used inside NotebookProvider')
  return ctx
}
```

And far away, `src/components/reading/WordSheet.jsx`:

```jsx
const { savedWords, saveWord, unsaveWord } = useNotebook()
```

---

## 2. The radio station

- `createContext(null)` creates a **radio frequency**. `null` is what you hear
  if no station is broadcasting.
- `<NotebookContext.Provider value={…}>` is the **station**. Everything rendered
  inside it (its `children`, and their children, all the way down) can tune in.
- `useContext(NotebookContext)` **tunes in**: it returns the `value` of the
  nearest Provider *above* this component.

`WordSheet` is many levels below `NotebookProvider`, and nothing in between
had to pass anything along.

---

## 3. The three-part file pattern

Every context in `src/context/` follows the same recipe. Learn it once:

| Part | Exported? | Job |
|---|---|---|
| `const XContext = createContext(null)` | **no** | the private channel |
| `export function XProvider({ children })` | yes | owns the state + logic, broadcasts `value` |
| `export function useX()` | yes | the *only* way in: reads the context and **throws if there's no provider** |

Why keep `XContext` private and export `useX()` instead? Two reasons:
1. **A clear error.** Forgetting the provider gives "useNotebook must be used
   inside NotebookProvider" instead of a confusing `cannot read property
   'savedWords' of null` somewhere else.
2. **One door.** Every reader goes through `useX`, so you can change how the
   context works internally without touching 40 screens.

---

## 4. Order matters: the staircase is a dependency chart

A provider can only use contexts **above** it. `NotebookProvider` calls
`useAuth()` (each user has their own notebook), so it **must** sit inside
`AuthProvider`. Read the staircase as "everything below may depend on everything
above":

```
ThemeProvider          ← depends on nothing app-level
  AuthProvider         ← who you are
    SubscriptionProvider   ← needs the user (Pro is per account)
      ProgressProvider     ← needs the user (progress is per account)
        NotebookProvider   ← needs the user
          …NavGuardProvider ← its confirm dialog needs theme tokens (see the comment on line 82)
```

If you add a provider, put it **below everything it reads from** and **above
everything that reads it**.

---

## 5. The performance rule: memoize the value

**Every component that reads a context re-renders when the context's `value`
changes**, and "changes" means "is a different reference" (`===`, Lesson 03 §5).

Without `useMemo`:

```jsx
return <NotebookContext.Provider value={{ ...state, saveWord }}>
```

that `{…}` is a **brand-new object on every render** of `NotebookProvider`, so
every notebook reader re-renders every time, even when nothing in the notebook
changed. With `useMemo(() => ({…}), [state, saveWord, …])`, the object stays
the same until one of those deps really changes.

And the functions inside are wrapped in `useCallback` for the same reason: if
`saveWord` were a new function every render, the `useMemo` deps would change
every render and the memo would be useless. (Lesson 07 §5.)

---

## 6. Context isn't for everything

Context is perfect for **app-wide, rarely-changing** values: user, theme,
subscription, notebook.

It's the wrong tool for:
- **State only one screen uses**: keep it in that screen's `useState`.
- **State two siblings share**: "lift it up" to their common parent and pass props.
- **Values that change many times per second** (a recording's level meter, an
  animation): every consumer would re-render that often. Use local state or refs.

### "Host" components: a pattern your app invented

`_layout.jsx` mounts `<QuizSettingsHost />`, `<NavGuardHost />` and `<PathLockHost />`
at the root. Each is a context whose **Provider** holds "is the modal open, and
with what", and whose **Host** renders the modal at the top of the screen. Any
screen calls something like `usePathLock()` to open it. The comments explain
why: a modal mounted inside a screen can't cover the header and tab bar (they're
siblings drawn later), but one mounted at the root can.

---

## Practice

1. **Map the providers.** For each provider in `_layout.jsx`, open its file and
   write one line: *what it holds*, and *which other contexts it reads*. Check
   that the staircase order respects every dependency.
2. **Break it on purpose.** In your playground, call `useNotebook()`. Works,
   because the playground is inside the providers. Now temporarily move
   `<NotebookProvider>` *below* `<ThemedShell />` (so the screens are outside
   it), reload, and read the error. That message exists because of the throw in
   `useNotebook`. Put it back.
3. **Build a tiny context.** In your playground file, write a
   `PlaygroundContext` with the three-part pattern. The provider holds a
   `fontScale` number (1, 1.25 or 1.5) and a `cycleFontScale()` function. Wrap
   two different child components in the provider. One shows a button to cycle the
   scale, and the other shows a Hmong word whose `fontSize` is `24 * fontScale`.
   They share no props, only the context.
   - Use `useCallback` for `cycleFontScale` and `useMemo` for the value.
   - Make `usePlayground()` throw outside the provider, and test that it does.
4. **Explain it.** In a comment at the top of your context, explain in your own
   words why the `useMemo` is there. If you can explain it, you own it.

---

## You can now…

- [ ] explain context with the radio-station picture
- [ ] write the three-part context pattern from memory
- [ ] read `_layout.jsx`'s staircase as a dependency chart
- [ ] explain why the provider's `value` is wrapped in `useMemo`
- [ ] decide between local state, lifting state up, and context
