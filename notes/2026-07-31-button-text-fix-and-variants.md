# Button text-child fix + Back/Quit variants (2026-07-31)

## Root-cause fix: Button dropped styling on interpolated labels

`src/components/ui/Button.jsx` only wrapped children in its styled `<Text>` when
`typeof children === 'string'`. But `<Button>← {prev.hmong}</Button>` passes an
**array** `['← ', prev.hmong]`, not a string — so the check failed, the styled Text
was skipped, and the label rendered **unstyled: default black, default size**. On
the dark `secondary` speak buttons that meant black-on-dark = the "everything in
black" the user saw on Speak's back/forward buttons.

Fix — treat text-like children (string, number, or an array of those) as text and
wrap them; only real elements (icons/custom nodes) render as-is:

```js
const isTextLike =
  typeof children === 'string' ||
  typeof children === 'number' ||
  (Array.isArray(children) && children.every((c) => typeof c === 'string' || typeof c === 'number'))
```

This helps every other `<Button>text {var} →</Button>` call (e.g. the lesson
QuizStep's "Take the quiz →").

### BUT the Button fix alone didn't fix Speak — needed single-string labels too

The Speak buttons were STILL black after the Button change: NativeWind can fail to
inject the text style onto a `<Text>` whose children are an ARRAY, even when the
className is present. Definitive fix — make each Speak label a single
template-literal string so it's never an array:

```jsx
<Button variant="secondary">{`← ${prev.hmong}`}</Button>   // not:  ← {prev.hmong}
<Button variant="secondary">{`${next.hmong} →`}</Button>
```

Applied to all four prev/next buttons in `app/speak/[phraseId].jsx` and
`app/speak/family/[familyId].jsx`. A single string hits the `typeof === 'string'`
path that the known-good buttons (QuizEngine "Next", "Finish →") already use.

Why it looked like "everything in black": in LIGHT theme `secondary` is
`bg-stone-900` (28 25 23, near-black) — with the text style dropped, the label fell
back to default black → black-on-near-black.

**If a Button label still renders black after editing, clear the Metro cache
(`expo start -c`)** — the bundler can serve a stale Button.

### FINAL fix — inline color from the theme token (className was the problem)

The template-literal change still wasn't enough: **NativeWind's `text-*` classes are
unreliable in this project** (same issue documented for the flashcard ribbon and
the drawer — they silently no-op on some elements), so `text-cream-50` on the button
label never applied and it fell back to default black.

`Button` now sets the label color **inline** from the active theme token instead of
a className:

```js
const VARIANTS = {
  primary:   { base:'rounded bg-clay-600 shadow-warm', textToken:'--c-cream-50' },
  secondary: { base:'rounded bg-stone-900',            textToken:'--c-cream-50' },
  ghost:     { base:'rounded border border-cream-300', textToken:'--c-stone-800' },
}
const textColor = `rgb(${(THEME_TOKENS[theme]||THEME_TOKENS.light)[v.textToken]})`
// <Text style={{ color: textColor, fontWeight:'600', fontSize:14 }}>
```

This fixes EVERY button label app-wide in one place (Speak `← hny` / `nkh →`, lesson
Back, Quit Quiz, all CTAs) and stays theme-correct because the cream/stone tokens
invert between light and dark/neon. Lesson learned: **in this app, style text color
INLINE from tokens, never via `text-*` classes.**

## Lesson "Back": ghost → secondary

`app/learn/[unitId]/[lessonId].jsx` — the ghost Back button was transparent with
`text-stone-800`, which read as "grayed out / transparent." Switched to
`variant="secondary"` (solid `bg-stone-900` + `text-cream-50`) so it's a clearly
visible button next to the clay `Continue`. Keeps `disabled` (opacity) at step 0.

## Quiz "Quit quiz" → "QUIT QUIZ" button

`src/components/quiz/QuizEngine.jsx` — was a small underlined `Pressable`/`Text`.
Now `<Button variant="secondary" onPress={handleQuit}>QUIT QUIZ</Button>` —
consistent with the new Back button and capitalized per request.

## Why `secondary` reads well in all themes

`secondary` = `bg-stone-900` + `text-cream-50`. The stone/cream tokens invert
between light and dark/neon, so it's always dark-bg+light-text (light) or
light-bg+dark-text (dark/neon) — good contrast either way.

## Two more things that mattered on the Speak buttons

1. **`<Link asChild>` → `onPress`.** The Speak prev/next buttons were
   `<Link asChild><Button/></Link>`. On react-native-web that renders an `<a>` whose
   default text color can override the button label. Replaced with
   `onPress={() => router.push(...)}` on the Button directly (both
   `app/speak/[phraseId].jsx` and `app/speak/family/[familyId].jsx`), removing the
   anchor entirely.
2. **Color format:** `rgb(...)` now uses the comma form
   (`"R G B".split(' ').join(', ')`) so it's valid on native AND web.

## ⚠️ THE ACTUAL BLOCKER: stale Metro bundle (confirmed)

Three correct code fixes appeared to "do nothing" — because `Button` is a shared
module imported by dozens of screens, and **Metro's hot-reload often fails to
refresh widely-imported shared modules**. The running bundle was stale.

**Resolution (confirmed by the user):** stop the dev server and restart with a
cleared cache:

```bash
npx expo start -c
```

then hard-reload (web: empty-cache refresh; device: shake → Reload). After that the
button labels rendered correctly.

**Rule going forward:** if an edit to a shared/base component (Button, Tabs, theme
helpers, etc.) doesn't show up after a normal reload, don't keep re-editing — do a
`expo start -c` clean restart FIRST to rule out a stale bundle.

## Verify

- Speak → open a phrase or a word family: the ← / → buttons show light text on the
  dark button, not black.
- Lesson: Back is a solid button matching Continue; dimmed on step 1.
- Quiz: "QUIT QUIZ" is a solid button at the bottom.
