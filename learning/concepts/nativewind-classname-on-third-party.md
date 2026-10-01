# Concept: NativeWind silently drops `className` on third-party components

Two bugs in this codebase, months apart, same root cause. Both silent. Both cost
real time.

---

## The bug that just happened

Cards in the lesson scroll were flush against each other with no gap, and the
dialogue bubbles stacked centred instead of alternating left/right.

The code looked correct:

```jsx
<Animated.View className="mb-5">                          // ← gap
<Animated.View className={`mb-4 ${t.speaker === 'A' ? 'items-start' : 'items-end'}`}>
```

**Neither class did anything.** `Animated.View` comes from
`react-native-reanimated`, not from `react-native` — and NativeWind's JSX
transform only wraps components it knows about. On a third-party animated
component the `className` prop is passed straight through to a component that has
no idea what to do with a string of Tailwind class names, so it is dropped.

No error. No warning. The element renders, just unstyled.

### The fix

Real style objects:

```jsx
<Animated.View style={{ marginBottom: 20 }}>
<Animated.View style={{
  marginBottom: 16,
  alignItems: t.speaker === 'A' ? 'flex-start' : 'flex-end',
  opacity: idx === turnIndex ? 1 : 0.45,
}}>
```

Note the second one had a `style` prop ALREADY (for opacity) — which is what made
it confusing. Half the styling worked; the half in `className` vanished.

---

## The same root cause, wearing a different hat

[[nativewind-function-style-invisible]] — buttons rendered invisible on the dev
build because NativeWind dropped the FUNCTION form of `style`:

```jsx
style={({ pressed }) => ({ backgroundColor: '#..', minHeight: 44 })}   // dropped
```

Different symptom (invisible vs unstyled), same mechanism: **NativeWind sits in
the middle of every element's props, and anything it cannot read, it does not
forward.**

| | what breaks | symptom |
|---|---|---|
| `style` as a FUNCTION | on any component | element renders at zero size — invisible |
| `className` on a third-party component | reanimated, svg, some libs | class dropped — unstyled |

---

## How to recognise it

**The tell is always the same: it looks right in the code and wrong on screen,
with no error.**

Ask two questions:

1. **Is this component from `react-native`?** `View`, `Text`, `Pressable`,
   `ScrollView` → `className` works. `Animated.View`, `Svg`, `Path`, anything
   from a UI library → assume it does not.
2. **Is my `style` a function?** If yes, it is being dropped on native
   regardless of the component.

## The rule

> **On a third-party component, style it with a real object. Reserve `className`
> for components that came out of `react-native`.**

Mixing is fine on the same element — `className` for a plain `View`, `style` for
the `Animated.View` wrapping it. In fact that is the cleanest pattern: put the
animation wrapper on the outside with a `style`, and keep the Tailwind on the
plain `View` inside it.

```jsx
<Animated.View entering={FadeInDown} style={{ marginBottom: 20 }}>
  <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
    …
  </View>
</Animated.View>
```

---

## Where this could bite next in this repo

- `ToneCurve.jsx` — uses `Svg`, `Path`, `Line`, `Text as SvgText` from
  `react-native-svg`. All of those already use `style`/props, not `className`.
  Worth keeping that way.
- `KawmHmoobLogo.jsx` — same library, same rule.
- Any future `Animated.View` for lesson transitions.

---

# Exercises

**1. Reproduce it deliberately.**
Change the card wrapper back to `className="mb-5"` and run it. Confirm the gap
disappears. Then add `style={{ marginBottom: 20 }}` alongside the className and
confirm the style wins. What does that tell you about which one is being ignored?

**2. Find the half-working case.**
The dialogue turn had BOTH `className` (margin + alignment) and `style` (opacity)
before the fix. Explain why that combination is more confusing to debug than one
where nothing works at all.

**3. Prove the boundary.**
Put `className="p-8 bg-red-500"` on a plain `<View>` and on an `<Animated.View>`
side by side. Which one turns red? Now do the same with `style={{ padding: 32,
backgroundColor: 'red' }}`.

**4. Connect the two bugs.**
Read [[nativewind-function-style-invisible]]. In one paragraph, explain what the
function-style bug and the className-on-Animated bug have in common, in terms of
what NativeWind is doing to your props.

**5. Audit.**
Grep the repo for `Animated.View`, `<Svg`, `<Path`. For each, check whether it is
styled with `className` or `style`. Any `className` you find is either already
broken or about to be.

```
grep -rn "Animated.View\|<Svg\|<Path" src/ app/ --include=*.jsx
```

**6. Write the guard.**
There is no lint rule for this. Sketch what one would check — what pattern in the
AST would flag "className on a component that is not from react-native"? Would it
produce false positives?
