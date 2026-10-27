# How the theme change logic works — and how to add a fourth theme

**You write the code.** This explains the machine that is already there, then
gives you the checklist for adding a theme to it. Written against the code as it
is on 2026-10-25, not against the note that described it being built
(`notes/2026-07-25-theming-header-flashcard.md`, §1).

---

## 1. The whole idea, in one picture

On the web, theming is a cascade: you set CSS variables on `<html>`, and every
`bg-cream-50` below it resolves through them. **React Native has no DOM and no
cascade.** So the app rebuilds that one mechanism by hand:

```
  Drawer "Theme: light" row            ← the only switch in the app
        │  onPress={cycle}
        ▼
  ThemeContext            theme = 'light' | 'dark' | 'neon'
        │                 (persisted to AsyncStorage under kawmhmoob.theme)
        ▼
  app/_layout.jsx  <View style={[…, THEME_VARS[theme]]}>
        │                 ← NativeWind cascades the vars down the React tree
        ├──────────────► every className colour below restyles   (most of the app)
        └──────────────► THEME_TOKENS[theme]['--c-…'] read directly (~35 files)
```

That is the entire system. Four files:

| file | job |
|---|---|
| `src/context/ThemeContext.jsx` | holds the choice, persists it, exposes `useTheme()` |
| `src/lib/themes.js` | the token tables — `THEME_TOKENS`, `THEME_VARS`, `THEME_BG` |
| `src/lib/themeColor.js` | resolves a token to a real colour string, for props that take a value |
| `tailwind.config.js` | maps `cream-50` → `rgb(var(--c-cream-50) / <alpha-value>)` |

Plus `scripts/check-theme.mjs`, which guards the rules rather than the colours.

---

## 2. Why there is no `dark:` anywhere in this app

This is the part worth understanding, because it is what makes a fourth theme
cheap.

`tailwind.config.js` never names a colour. It names a **variable**:

```js
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`
colors: { cream: { 50: v('cream-50'), … } }
```

So `bg-cream-50` does not mean "that warm off-white". It means "whatever
`--c-cream-50` is right now". `_layout.jsx` sets what it is right now:

```js
<View style={[{ flex: 1, overflow: 'hidden' }, THEME_VARS[theme]]}>
```

`THEME_VARS[theme]` is `vars(THEME_TOKENS[theme])` — a style object NativeWind
understands as "define these variables for this subtree". Change `theme`, that
style object changes, and **every class in the app repaints with no component
knowing a theme exists.** That is why components have no `dark:` variants and
why a new theme needs no screen edits.

> **The mental model: components ask for a ROLE (`cream-50` = page card), never
> a colour. The theme decides what that role looks like.** In light, `cream-50`
> is nearly white; in dark it is `33 29 26`, almost black. Same class, same
> role, opposite colour.

### Why tokens are `"251 246 236"` and not `"#fbf6ec"`

Channels, space-separated, no `rgb()` wrapper. Two reasons:

1. **Opacity modifiers.** `rgb(var(--c-cream-50) / <alpha-value>)` lets Tailwind
   slot the alpha in, so `bg-cream-50/80` works. A hex cannot be split that way.
2. The direct readers rebuild it themselves: `` `rgb(${t['--c-clay-600']})` ``.

---

## 3. The second path: when a className cannot reach

About 35 files skip classes and read the table directly:

```js
const t = THEME_TOKENS[theme] || THEME_TOKENS.light
// … `rgb(${t['--c-stone-900']})`
```

`src/lib/themeColor.js` is the tidy version of this (`tokenColor(theme, name)`
and the `useThemeColor()` hook). Its header lists why it has to exist, and there
are only two real reasons:

- **Props that take a colour VALUE, not a class** — `<ActivityIndicator color>`,
  `<TextInput placeholderTextColor>`, `<Icon color>`, SVG `stroke`/`fill`.
- **Anything inside an RN `<Modal>`.** ⚠️ **A `<Modal>` is a separate native
  root.** The vars live on the app's root View, so themed classes inside a Modal
  resolve to *nothing* — and nothing is not an error, it is **transparent**. The
  reader's glossary sheet shipped invisible for a day with every class on it
  apparently correct. `check-theme.mjs` fails the build on this one now.

Note the `|| THEME_TOKENS.light` on every one of those reads. That fallback is
why an unknown theme name degrades to light instead of crashing — and also why a
**missing token** does not degrade at all. See trap 1 below.

---

## 4. The state, and the two things it must do

`ThemeContext.jsx` is 50 lines. Read it; it holds no surprises. The shape worth
copying elsewhere:

```js
export const THEMES = ['light', 'dark', 'neon']   // ORDER = cycle order

const [theme, setThemeState] = useState('light')  // light until storage answers

useEffect(() => { /* loadJSON(KEY, 'light') → setThemeState if THEMES.includes */ }, [])

const setTheme = (next) => { if (!THEMES.includes(next)) return; … }
const cycle   = () => /* THEMES[(indexOf(cur) + 1) % THEMES.length] */
```

Three details that are decisions, not accidents:

- **`THEMES` is the allow-list.** Both `setTheme` and the storage restore check
  membership, so a stale saved value (`'midnight'` after you rename it) is
  ignored rather than applied.
- **It starts on `'light'` and corrects itself** when AsyncStorage answers. A
  theme flash on cold start is the price; the alternative is blocking first
  paint on a disk read.
- **`cycle` is modular over `THEMES`**, so it picks up a fourth theme for free.
  The only switch in the app is the drawer row in `DrawerHost.jsx`:
  `<Text>Theme: {theme}</Text>` with `onPress={cycle}`.

---

## 5. Adding a fourth theme — the checklist

Say it is called `'midnight'`. Current state: **3 themes × 54 tokens each, parity
exact.** Work through these in order.

### Must do

- [ ] **`THEME_TOKENS.midnight` in `src/lib/themes.js` — all 54 tokens.**
      Copy the `dark` block and edit values. Do **not** add or drop a key.
      (Verify: `node -e` parse the table and diff the key lists; the snippet is
      in §6.)
- [ ] **`THEME_VARS`** — add `midnight: vars(THEME_TOKENS.midnight)`. It is a
      hand-written object, not derived.
- [ ] **`THEME_BG`** — add the `--c-seafoam-300` line. This is the page ground
      react-navigation paints behind screens; miss it and `|| THEME_BG.light`
      gives you a seafoam flash behind a dark theme.
- [ ] **`THEMES` in `ThemeContext.jsx`** — append `'midnight'`. Position decides
      where it lands in the cycle. Appending keeps the existing order stable.
- [ ] **The StatusBar polarity in `app/_layout.jsx`:**
      ```js
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      ```
      ⚠️ **This is a two-theme test pretending to be a general one.** It reads
      "light theme → dark glyphs, everything else → light glyphs". A dark fourth
      theme is fine by accident. **A LIGHT fourth theme gets white-on-white
      status icons.** If yours is light, this line has to become a property of
      the theme, not a comparison — the cleanest fix is a `THEME_BAR` map beside
      `THEME_BG`.

### Check, don't assume

- [ ] **The drawer row** renders `Theme: midnight` with no edit. Just look at it
      — the panel is `min(width * 0.82, 340)` wide and a long name can wrap.
- [ ] **`src/lib/genreCover.js`** and the ~35 direct readers need nothing: they
      index by `theme` with a light fallback. They only break on a missing
      token.
- [ ] **Run `node scripts/check-theme.mjs`.** It will pass, and §6 trap 1
      explains why that is not evidence of anything.
- [ ] **Open a Modal in the new theme** (the reader's glossary sheet, any
      confirm dialog). This is where a missing token shows up as black or
      invisible rather than as an error.

### Do NOT

- ⚠️ **Do not invent a token name for one theme.** `--c-midnight-glow` in
  `THEME_TOKENS.midnight` only is dead weight: `tailwind.config.js` has no class
  pointing at it, and the other three themes have no value for it. A new
  *colour* is a three-file change — `themes.js` (**all four** themes),
  `tailwind.config.js` (a `v()` entry), and the off-palette regex in
  `check-theme.mjs` — and it stops being a theme change.
- ⚠️ **Do not regenerate `themes.js` from the web palette to get your theme in.**
  The file header says it: a regeneration drops the hand-added orange (200/900)
  and lime (200/900) pairs.

---

## 6. The traps, with the reasoning

### Trap 1 — a missing token fails silently, and nothing checks for it

This is the one that will cost you an evening.

`check-theme.mjs` guards *rules*: no off-palette classes, no hardcoded hex, no
themed class inside a `<Modal>`, no hand-rolled eyebrow, no card hairline.
**It does not compare the themes to each other.** There is no assertion that
every theme defines the same 54 tokens.

So if `THEME_TOKENS.midnight` is missing `--c-clay-600`:

- the **class** path gives you an undefined variable — NativeWind renders it as
  nothing, i.e. transparent;
- the **direct** path gives you `` `rgb(${undefined})` `` → the string
  `"rgb(undefined)"`, which RN treats as an invalid colour and paints black;
- `|| THEME_TOKENS.light` does **not** save you, because the theme object exists
  — only the key is absent.

Nothing throws. Nothing logs. You get one black icon on one screen.

> **Exercise (worth doing before you add the theme, not after): add the parity
> assertion to `check-theme.mjs`.** Read `THEME_TOKENS`, take `light`'s keys as
> the reference, and fail for any theme missing one or carrying an extra. It is
> about eight lines, it belongs in `MUST_BE_ZERO`, and it turns the trap above
> into a build error. Hint: the script currently only reads `app/` and `src/`
> `.jsx?` files as text — you need the table as DATA, and `themes.js` imports
> `vars` from `nativewind`, which plain Node cannot resolve. Look at how
> `check-reading.mjs` gets at `stories.js`, and at the string-slice + `JSON.parse`
> approach the table's own literal shape allows.

### Trap 2 — `THEME_VARS` and `THEME_BG` are hand-written, three times over

```js
export const THEME_VARS = {
  light: vars(THEME_TOKENS.light),
  dark: vars(THEME_TOKENS.dark),
  neon: vars(THEME_TOKENS.neon),
}
```

Adding a theme means remembering both maps. Forgetting `THEME_VARS` is loud (the
whole app stays on light, since `THEME_VARS[theme]` is `undefined`). Forgetting
`THEME_BG` is quiet — a wrong-coloured ground behind the screens, visible only
during navigation.

> **Exercise: derive both from `Object.keys(THEME_TOKENS)`.** Then a fifth theme
> is one edit instead of three. Keep the explicit shape if you prefer reading it
> — but then the parity check from trap 1 should cover these two maps as well.

### Trap 3 — the theme is not the only "theme" in this repo

Three unrelated things use the word, and greping for it will mislead you:

| name | what it is |
|---|---|
| `THEME_TOKENS` / `useTheme()` | this system — the app's visual skin |
| `CATEGORY_THEMES` (`src/data/vocabulary.js`) | the Words tab's subject groupings |
| `vocabAccent.js` | per-group accent colours keyed by *category* theme id |

`vocabAccent.js` maps group ids (`'reading-support': 'sand'`) to accent names. It
has nothing to do with light/dark/neon, and a new visual theme does not touch it.

---

## 7. Checkpoints

1. **Before writing any tokens:** add the parity check (trap 1). You want it
   failing on your half-filled theme, which is the whole point.
2. **After `THEME_TOKENS` + `THEME_VARS` + `THEME_BG` + `THEMES`:** tap the
   drawer row four times and get back to where you started.
3. **The Modal pass:** open the reader's glossary sheet and one confirm dialog
   in the new theme. Black text on black, or an invisible sheet, means a missing
   token, not a styling mistake.
4. **The StatusBar pass:** if the theme is light, confirm you changed the
   polarity line. Look at the clock, not the app.
5. `node scripts/check-theme.mjs` and `npx eslint src/lib/themes.js`.

---

## 8. Exercises

1. **Feel the cascade.** Temporarily set `THEME_VARS[theme]` to
   `THEME_VARS.light` in `_layout.jsx` and flip themes. *Which parts still
   change, and why?* (Answer: the ~35 direct readers, because they never went
   through the vars at all. That split is the map of path 1 vs path 2.)
2. **Break one token.** Delete `--c-clay-600` from `THEME_TOKENS.dark` and open
   the drawer in dark. *What did the logo do, what did the class-styled text do,
   and which of the two told you there was a problem?*
3. **No DOM, no cascade.** `_layout.jsx` sets the vars on a root `View`.
   *Why does a `<Modal>` escape it, and why is a shared `useSheetPalette` the fix
   rather than "put the vars on the Modal too"?*
4. **Judgement, no code.** `THEMES` is both the cycle order and the allow-list.
   *What breaks the day you want a theme that exists but is not in the cycle —
   say, a Pro-only theme? Which of the two jobs does `THEMES` lose first?*

---

Related: `notes/2026-07-25-theming-header-flashcard.md` (§1, the token engine as
built), `notes/2026-09-08-app-wide-theme-audit.md` (measuring drift across the
app), `learning/concepts/nativewind-classname-on-third-party.md`,
`learning/feature-logic/auth-context-explained.md` (the same provider shape).
