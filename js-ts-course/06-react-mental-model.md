# 06 — How React thinks

You've written dozens of components. This lesson is about the **model**
underneath them. Once it clicks, "why didn't my screen update?" and "why
did this render twice?" stop being mysteries.

---

## 1. Start from your code

`src/components/path/PathList.jsx`:

```jsx
export default function PathList({ progress, hasPro, units }) {
  const all = livePath()
  const shown = units || all
  return (
    <View className="gap-3">
      {shown.map((unit) => (
        <UnitRow
          key={unit.id}
          n={all.findIndex((u) => u.id === unit.id) + 1}
          unit={unit}
          progress={progress}
          hasPro={hasPro}
        />
      ))}
    </View>
  )
}
```

Everything from Lessons 01–05 is in here: a function (02), destructured
parameters (02), `||` (01), `.map` and `.findIndex` (03), and a default export
(04). **A React component is just a JavaScript function**, nothing more magical.

---

## 2. The big idea: UI = f(data)

> **A component is a function that takes data and returns a *description* of
> what the screen should look like.**

It doesn't *draw* anything. It returns a description ("a View containing three
UnitRows"), and React compares that description with the previous one and
updates only what changed on the real screen.

So you never write "add a row to the list" or "change this label's text". You
write "**given this data, the screen looks like this**", and when the data
changes, React calls your function again and works out the difference.

```
data (props + state + context)
          │
          ▼
   YourComponent(props)      ← React calls your function: a "render"
          │
          ▼
  description of the UI      ← JSX
          │
          ▼
   React diffs it against last time, updates the native views
```

---

## 3. JSX is just JavaScript in disguise

```jsx
<UnitRow key={unit.id} unit={unit} hasPro={hasPro} />
```

is turned (by Babel, see `babel.config.js`) into roughly:

```js
React.createElement(UnitRow, { key: unit.id, unit: unit, hasPro: hasPro })
```

That explains the JSX rules:

- **`{ }` is a hole for any JS *expression***: a variable, `a + b`,
  `x ? y : z`, a `.map(…)`. It can't hold a *statement* (no `if`, no `for`), because
  you can't put an `if` inside a function call's arguments.
- **Attributes are just an object's keys**, which is why they're called *props*
  (properties).
- **A component's name must start with a capital letter.** `<unitRow>` would be
  treated as a built-in element and fail.
- **One root element per return.** It's one function call, so it returns one value.
  Wrap siblings in a `<View>` or a fragment `<>…</>`.

---

## 4. Props: data flowing down

Props are the **arguments** a parent passes to a child. `PathList` passes
`unit`, `progress`, `hasPro` to each `UnitRow`, and `UnitRow` receives them
destructured: `function UnitRow({ n, prev, unit, progress, hasPro })`.

Two rules:

1. **Props flow down only.** A child can't reach up and change its parent's
   data. If a child needs to cause a change, the parent passes a **function**
   down (`onPress={…}`), and the child calls it.
2. **Props are read-only.** Never do `props.unit.title = 'x'`. That's mutating
   (Lesson 03 §5), and React won't notice.

### `children`: whatever goes between the tags

```jsx
<TabScreen>
  <VocabCategoryGrid />
</TabScreen>
```

`TabScreen` receives `<VocabCategoryGrid />` as a prop called `children`, and
places it where it wants. `Button` uses it for its label. That's how
"wrapper" components work.

---

## 5. When does a component render again?

A component's function is called again when:

1. **Its own state changes** (`setSomething(…)`, Lesson 07).
2. **Its parent re-renders** (and so passes props again).
3. **A context it reads changes** (Lesson 09).

That's it. **Changing a normal variable never triggers a render.** That's why
this doesn't work:

```jsx
function Counter() {
  let count = 0
  return <Button onPress={() => { count += 1 }}>{count}</Button>   // stays 0 forever
}
```

`count` changes, but nobody tells React, so the function isn't called again.
Even if it were, `let count = 0` would reset it. State (next lesson) solves both
problems.

> 🧠 **Rendering must be pure** (Lesson 02 §5). React may call your component
> function many times, including twice in a row in development. So the body
> of a component (outside of handlers and effects) must only *calculate*:
> no saving, no fetching, no `router.push`. Those go in event handlers or effects.

---

## 6. Conditional rendering

Three shapes, all just JavaScript expressions inside `{ }`:

```jsx
{locked ? <LockIcon /> : <PlayIcon />}          // either/or
{isPro && <ProBadge />}                         // show or nothing
{icon ? <Icon name={icon} /> : null}            // Button.jsx's style: explicit null
```

Or return early from the whole component, as `_layout.jsx` does while fonts load:

```jsx
if (!fontsLoaded && !fontError) return null
```

> 🪤 **The `&&` zero trap (React Native edition).** `{count && <Text>…</Text>}`
> When `count` is `0`, `&&` returns `0`, and React tries to render the
> number 0 as raw text outside a `<Text>`. On native that crashes with
> **"Text strings must be rendered within a `<Text>` component."** Make the left
> side a real boolean: `{count > 0 && …}`. Button.jsx writes `{icon ? … : null}`
> partly to avoid this whole class of bug.

---

## 7. Lists and `key`

```jsx
{shown.map((unit) => <UnitRow key={unit.id} unit={unit} />)}
```

`.map` turns an array of data into an array of elements. React needs a `key`
on each one: a **stable, unique id** so that when the list changes it knows
which row is which.

- ✅ `key={unit.id}`: the id belongs to the data and never changes.
- ⚠️ `key={index}`: OK only for a list that never reorders, inserts or deletes.
  Otherwise React mixes rows up: the wrong row keeps its "expanded" state, the
  wrong text input keeps its typing.
- ❌ `key={Math.random()}`: a new key every render, so React throws away and
  rebuilds every row each time.

---

## 8. React Native specifics

| Web | React Native | Note |
|---|---|---|
| `<div>` | `<View>` | flexbox, but default `flexDirection` is **column** |
| text anywhere | `<Text>` | **all** text must be inside `<Text>` |
| `<button>` | `<Pressable>` / your `Button` | `onPress`, not `onClick` |
| page scroll | `<ScrollView>` / `<FlatList>` | nothing scrolls by default |
| CSS | `style={{…}}` or NativeWind `className` | |

Your app's NativeWind lessons apply here: a Pressable with a **function** `style`
plus a `className` can render invisible on native (see the comment in
`PathList.jsx` and `Button.jsx`), and `className` is dropped on components
NativeWind doesn't map (`learning/concepts/nativewind-classname-on-third-party.md`).

---

## Practice: your playground screen

You'll build a scratch screen to experiment in. **You type all of it.**

**Setup.** Create `app/playground.jsx`. Because of expo-router (Lesson 00 §3),
it's instantly the route `/playground`. Give it a default-exported component that
returns a `<View>` with a `<Text>Playground</Text>`. Open it on the device by
navigating there. (Temporary trick: add a `<Link href="/playground">` to a
screen you can reach, and remove it afterwards.) Put `if (!__DEV__) return null`
as the first line of the component so it can never show in a release build.

Then, in that file:

1. **A component with props.** Write `function WordCard({ hmong, english })`
   that shows the Hmong word large and the English under it. Render three of them
   by hand: `aub/dog`, `miv/cat`, `dej/water`.
2. **From data.** Make an array `const words = [{ id, hmong, english }, …]` at
   module level and render the cards with `.map`. Give each a proper `key`.
   Then delete the `key`, and read the warning in the Metro terminal. Put it back.
3. **Conditional.** Add a `saved` boolean to some words. Show a "★ Saved" line
   only on those. Do it once with `&&` and once with a ternary.
4. **The zero trap, on purpose.** Add `const savedCount = 0` and render
   `{savedCount && <Text>{savedCount} saved</Text>}`. Watch it break on native.
   Fix it two different ways.
5. **children.** Write `function Card({ children })` that wraps its children in
   a `bg-cream-50 rounded-md p-4` View. Use it inside `WordCard`.
6. **Why no update?** Add the broken `let count = 0` counter from §5. Tap it.
   Write one sentence, in a comment, explaining why the number never changes.
   (You'll fix it in Lesson 07.)

---

## You can now…

- [ ] explain "UI = f(data)" and what "a render" actually is
- [ ] explain why JSX `{ }` can hold `a ? b : c` but not `if`
- [ ] list the three things that cause a re-render
- [ ] explain why changing a `let` doesn't update the screen
- [ ] pick a correct `key` and explain why an index can be wrong
- [ ] avoid the `&&` zero crash on native
