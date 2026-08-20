# Concept: `=> (` vs `=> {`, and passing a handler vs calling it

Two arrow-function traps that look like "the component is broken" but are just
syntax. Both were hit while building the guest-card dropdown
([[collapsible-dropdown-lesson]]).

---

## 1. `=> {` needs an explicit `return` — `.map` renders nothing without it

```jsx
{REASONS.map((reason, i) => {        // ✗ nothing appears
  <View key={i}><Text>{reason}</Text></View>
})}
```

The `{` after `=>` makes that a function **body**, not a value. The JSX sits there
as a lone statement, the function returns `undefined`, and `.map` hands React an
array of `undefined` — which renders as nothing. **No error, no warning, just a
blank spot.** That silence is what makes it hard to spot.

Two fixes:

```jsx
{REASONS.map((reason, i) => (        // ✓ paren = implicit return
  <View key={i}><Text>{reason}</Text></View>
))}

{REASONS.map((reason, i) => {        // ✓ brace + explicit return
  return <View key={i}><Text>{reason}</Text></View>
})}
```

**Rule:** `=> (` hands the value back automatically. `=> {` means "I'm writing
statements" and you must `return` yourself. Default to `(` for JSX; reach for `{`
only when you need a line or two of logic first.

Same trap outside JSX — `arr.map(x => { x * 2 })` gives you `[undefined, ...]`.

---

## 2. `onPress={fn()}` calls it during render — you want `onPress={() => fn()}`

```jsx
onPress={setOpen((o) => !o)}         // ✗ runs while rendering
onPress={() => setOpen((o) => !o)}   // ✓ runs on tap
```

The first one **executes immediately** as the component renders. Its return value
(undefined) becomes the handler. Worse, calling `setState` during render triggers
another render, which calls it again → **"Too many re-renders."**

The `() =>` wrapper is what hands React a function to call *later*.

Exception: if you already have a zero-argument function, pass it by name —
`onPress={close}`, not `onPress={close()}`. The wrapper is only needed when you're
supplying arguments.

**Gut check:** are there parens right after the function name inside the prop? If
yes, it's being called now, not on press.

---

## Why they show up together

In `onPress={() => setOpen((o) => !o)}` there are two arrow functions doing
different jobs, which is what makes the line confusing at first:

- the **outer** `() =>` defers — makes it happen on tap instead of during render
- the **inner** `(o) => !o` is the state updater — flips whatever the value is now

Neither replaces the other.
