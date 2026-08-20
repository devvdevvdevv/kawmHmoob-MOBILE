# Lesson: a collapsible dropdown ("Why create an account?"), step by step

Goal: on the **guest** account view, add a tappable header that expands/collapses a
list of reasons to create an account. You'll build it and see that an "accordion" is
much simpler than it looks.

Where it goes: the `if (user.isGuest)` branch of
`src/components/account/ProfilePage.jsx` (the guest card).

---

## 0. The concept: an accordion is a boolean + a conditional render

Three ingredients, that's it:
1. **State** — one boolean: is it open or closed? `const [open, setOpen] = useState(false)`
2. **A header Pressable** — tapping it flips the boolean: `setOpen(o => !o)`
3. **Body shown only when open** — `{open && <the list />}`

Plus a nicety: a **chevron** that points right when closed and down when open, so the
control *looks* like it expands. That's a rotation driven by the same boolean.

No library, no magic. React re-renders when `open` changes; the `{open && ...}` shows
or hides the body. Done.

---

## 1. The data (keep content out of the JSX)

Put the reasons in a plain array so the list is data, not hand-written rows:
```js
const REASONS = [
  'Sync your streak, XP, and saved words across devices',
  'Never lose your progress if you reinstall',
  'Compete on the leaderboard',
  'Unlock Kawm Hmoob Pro when you’re ready',
]
```
Define it at module level (outside the component) — it never changes, so it doesn't
need to be recreated each render.

---

## 2. The state

Inside the component (or better, inside a small `Collapsible` component — see §6):
```js
const [open, setOpen] = useState(false)   // closed by default
```

---

## 3. The header (the button)

A `Pressable` row: a label on the left, a chevron on the right. Tapping toggles `open`.
Use your shared `Icon` (it has `arrowRight`) for the chevron.

```jsx
<Pressable
  onPress={() => setOpen((o) => !o)}
  className="flex-row items-center justify-between py-3"
  accessibilityRole="button"
  accessibilityState={{ expanded: open }}
>
  <Text className="text-sm font-semibold text-clay-700">Why create an account?</Text>
  <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
    <Icon name="arrowRight" size={18} tone="accent" />
  </View>
</Pressable>
```

Two things to notice:
- **`onPress={() => setOpen(o => !o)}`** — the functional update `o => !o` flips the
  current value. (Use the callback form so it's always based on the latest state.)
- **The chevron rotation** — a `transform: [{ rotate }]` on a wrapping `View`, chosen
  by `open`. Closed → `0deg` (points right ▶). Open → `90deg` (points down ▼). This is
  a **static style object** computed from state — fine. (Do NOT use a `style` FUNCTION
  here; see [[nativewind-function-style-invisible]].)

---

## 4. The body (render only when open)

Right after the header:
```jsx
{open && (
  <View className="gap-2 pb-3 pl-1">
    {REASONS.map((reason, i) => (
      <View key={i} className="flex-row items-start gap-2">
        <Text className="text-clay-600">•</Text>
        <Text className="flex-1 text-sm text-stone-700">{reason}</Text>
      </View>
    ))}
  </View>
)}
```
`{open && (...)}` reads as "if open, render this; otherwise render nothing." That one
line IS the collapse. `.map` turns each reason string into a bullet row.

---

## 5. Drop it into the guest card

In the `user.isGuest` branch of `ProfilePage`, place the header + body **between** the
"You're learning as a guest…" text and the Log In / Create Account buttons. So the
guest sees: intro → *(tap) Why create an account? ▶* → the two buttons. Optionally add
a thin divider (`border-t border-cream-200`) above/below to set it apart.

### Spacing: put the margin on a WRAPPER, not on the panel

Wrap the header + body in one `<View className="mb-5">` and give the panel no bottom
margin of its own:

```jsx
<View className="mb-5">          {/* owns the spacing */}
  <Pressable ...>...</Pressable>
  {open && <View className="gap-2 pb-3 pl-1">...</View>}
</View>
```

`mb-5` ON the panel only exists while the panel does — so closed, the buttons sit
tight under the header; open, they gain a gap. Everything below jumps ~20px on every
tap, on top of the panel's own height change. On the wrapper the gap is constant and
only the panel height changes.

**General rule: spacing BETWEEN two siblings belongs to something that's always
rendered.** A margin on a conditionally-rendered element disappears along with it.

Matches the card's rhythm: `mb-5` after the intro text, `mb-5` after the dropdown,
buttons last.

---

## 6. Make it reusable (recommended)

Rather than hard-coding this one accordion, wrap the pattern in a small component so
you can reuse it (FAQ, settings sections, etc.). It takes a `title` and its rows as
`children`:

```jsx
function Collapsible({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <View>
      <Pressable onPress={() => setOpen(o => !o)} className="flex-row items-center justify-between py-3"
        accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <Text className="text-sm font-semibold text-clay-700">{title}</Text>
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <Icon name="arrowRight" size={18} tone="accent" />
        </View>
      </Pressable>
      {open && <View className="pb-3">{children}</View>}
    </View>
  )
}
```
Then use it: `<Collapsible title="Why create an account?">{REASONS.map(...)}</Collapsible>`.
This is the **children pattern** — the component owns the open/close behavior; the
caller supplies what's inside. That's how most accordion/menu components work.

---

## 7. Optional: a smooth open/close animation

The version above snaps open instantly (totally fine for v1). For a smooth height
animation, add ONE line right before you toggle:
```js
import { LayoutAnimation, Platform, UIManager } from 'react-native'
// once, at module load, for old-arch Android:
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
// in onPress, BEFORE setOpen:
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
setOpen(o => !o)
```
`configureNext` tells RN "animate the next layout change." Cheap and effective. (If
you're on the New Architecture and it misbehaves, skip it or use `react-native-
reanimated` instead — not worth blocking v1 over.)

---

## Checklist
- [X] `REASONS` array at module level.
- [X] `open` state, default false.
- [X] Header Pressable toggles with `setOpen(o => !o)`; chevron rotates via a static
      transform.
- [X] Body is `{open && (...)}` mapping `REASONS` to bullet rows.
- [x] Bottom spacing sits on a WRAPPER around header + body, not on the panel.
- [x] Placed in the `user.isGuest` branch of ProfilePage.
- [~] `<Collapsible>` component EXISTS and compiles (src/components/common/Collapsible.jsx),
      but ProfilePage still runs its own inline copy — not actually swapped over yet.
- [x] Styles are className / static objects — never a `style` FUNCTION.

## Gotchas
- **`.map` must RETURN the row.** `REASONS.map((r, i) => { <View/> })` renders
  nothing at all — `{` starts a function body, so the JSX is a dead statement and
  every item comes back `undefined`. Use `=> (` (implicit return) or add `return`.
  No error is thrown; the list is just silently blank. See
  [[arrow-function-bodies-and-handlers]].
- **`onPress={() => setOpen(...)}`, never `onPress={setOpen(...)}`.** Without the
  `() =>` wrapper it fires during render and loops → "Too many re-renders."
- **Functional setState** (`o => !o`) — flips reliably even if taps come fast.
- **Static styles only** — the chevron transform is a static object from state, good.
  A `style={({pressed}) => ...}` here would render invisible on device (the bug you
  already fought).
- **Accessibility** — `accessibilityRole="button"` + `accessibilityState={{ expanded }}`
  so screen readers announce it as a collapsible. It's the non-visual twin of the
  chevron: a rotated arrow tells a blind user nothing. Other state keys (`disabled`,
  `checked`, `selected`, `busy`) work the same way — see
  [[accessibility-role-and-state]].
- **"Static style" means an OBJECT, not a function** — `style={{ transform: ... }}` is
  static even though it changes with `open`, because the value is finished by the time
  React sees it. `style={({ pressed }) => ({...})}` is the function form NativeWind
  drops on native → invisible element. See [[nativewind-function-style-invisible]].
