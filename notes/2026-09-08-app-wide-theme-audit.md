# App-wide theme audit (2026-09-08)

After four rounds of fixing the reading module by eye, the same question was
asked of the whole app. It was answered by **measuring first**, not by opening
screens and adjusting them — 208 files is more than anyone can hold in their
head, and "looks fine" is exactly the judgement that produced the drift.

The audit is now a permanent check: **`node scripts/check-theme.mjs`**.

## Result

| category | before | after |
|---|---|---|
| themed class inside `<Modal>` (renders transparent) | 0 | 0 ✅ |
| hand-rolled eyebrow | **21** | 0 ✅ |
| radius drift (`rounded-xl` on cards) | **7** | 0 ✅ |
| off-palette colour (`gray-`, `amber-`, `bg-white`…) | 0 | 0 ✅ |
| card hairline (removed app-wide 2026-08-29) | **1** | 0 ✅ |
| hardcoded hex in live code | **9** | 0 ✅ |

Two categories came back clean on the first run, and that is worth recording:
**no off-palette Tailwind colours anywhere, and no themed classes inside a
`<Modal>` outside the reader.** The palette discipline in this app is genuinely
good; the drift was all in *shape* and in *values that classes cannot express*.

## The finding that mattered: the eyebrow existed six times

The small label above a title — "Speak", "Unit", "Pro content" — was written six
different ways across fifteen screens:

```
text-sm  uppercase tracking-[3px]   text-clay-600  font-semibold
text-xs  uppercase tracking-[3px]   text-clay-600
text-xs  uppercase tracking-[2.5px] text-clay-600
text-sm  uppercase tracking-[2px]   text-clay-700  font-semibold
text-xs  uppercase tracking-[2px]   text-stone-600 font-semibold
text-xs  uppercase tracking-[2px]   text-stone-600
```

**None of them is wrong on its own screen.** Together they are why moving through
the app felt like moving between apps: the same object, redrawn from memory each
time it was needed.

> This is the failure mode a **component** prevents and a style guide does not.
> A guide is a thing you have to remember to consult; a component is the only
> thing there is to reach for.

`src/components/ui/Eyebrow.jsx` now owns it. Settled spec: `text-xs
font-semibold uppercase tracking-[2px]` — the most common of the six and the
most readable. 3px is too wide for anything longer than one word (the eye starts
reading letters instead of words); dropping `font-semibold` makes it too light
to register as a label at all.

`tone` is a statement about **meaning**, not colour:

| tone | means |
|---|---|
| `muted` (default) | you are in this section |
| `accent` | this is about Pro, a limit, or something being sold |
| `onDark` | the same label on a genre block or coloured hero |

There is deliberately **no `tracking` prop**. With one, it is six specs again
with extra steps. A screen that needs different letterspacing needs a different
component, and that is a conversation worth having rather than a prop.

### The dot turned out to mean something

Three screens kept a hand-rolled wrapper because their dot was a different
colour — and that was not drift, it was information. `GlobalTabBar` gives every
tab an indicator token, and the eyebrow dot is supposed to match it, so the mark
at the top of the screen and the highlighted tab at the bottom are visibly the
same fact:

| tab | indicator | eyebrow dot |
|---|---|---|
| Home | `stone-700` | — |
| Learn | `seafoam-500` | **was `clay-500`** → fixed |
| Speak | `clay-600` | `clay-600` ✅ |
| Words | `blush-500` | `blush-500` ✅ |
| Reference | `cream-600` | — |

So `dot` takes a class (`dot="bg-blush-500"`), defaulting to `clay-600`. Note it
is **not** tinted by `tone`: tone says what the label is about, the dot says
where you are. Two different questions, two different inputs.

## `src/lib/themeColor.js` — for the props a className cannot reach

Nine hardcoded hexes in live screens. Every one of them looked right in the
light theme and **none of them changed when the theme did**: a permanent amber
spinner on a dark screen, a red-600 delete icon beside a token-resolved red
button, `#9c918a` placeholder text.

They survived because these are props that take a colour *value*, not a class:

- `<ActivityIndicator color={…} />`
- `<TextInput placeholderTextColor={…} />`
- `<Icon color={…} />`
- anything inside an RN `<Modal>`

```js
export function tokenColor(theme, name)   // pure, for code that has `theme`
export function useThemeColor()            // returns a resolver
```

⚠️ **The hook returns a resolver, not a colour.** A `useThemeColor(name)` that
returned one colour would mean N hook calls for N colours, and the count would
change with the branch a component took — which is exactly how hook-order bugs
start.

Fixed: `ConfirmModal`, `DeleteAccountModal` (3 sites), `ProfilePage`,
`leaderboard`, `paywall`, `LetterGrid`, `VocabCategoryGrid`, `onboarding`.

## What was deliberately left alone

Judgement, not oversight — and the check is configured to match:

- **`app/dev.jsx`, `wav-spike.jsx`, `spike.jsx`** — screens for poking at the
  audio pipeline, not for looking at. 17 hexes, all fine.
- **`src/components/Navbar.jsx`, `Footer.jsx`** — ported from the web build and
  **rendered nowhere** (`<Footer />` survives only inside a JSX comment). Left in
  place per comment-out-never-delete; deleting them is a call to make
  deliberately, not as a side effect of a styling pass.
- **`Confetti.jsx`, `KawmHmoobLogo.jsx`** — drawn artwork may have literal
  colours.
- **`border-2 border-dashed border-cream-200`** in the Speak lesson components.
  A dashed border says "nothing here yet", which is a different statement from a
  card edge. The 2026-08-29 decision was about card edges.
- **The reader's one-off sizes** (`text-[26px]` prompt, 64px score, the cover
  `SCALE` tiers). Decisions with reasons written next to them, not drift.
- **`Button.jsx`'s function `style`.** It is opacity-only, with the background
  coming from `className` — the documented safe form of the pattern that
  otherwise renders Pressables invisible on native.

## Two JavaScript traps, both silent

Worth writing down because both cost time and neither raised an error.

**1. `.` does not match `\r`.** In JavaScript, `\r` is a *line terminator*, so
`.` excludes it exactly as it excludes `\n`:

```js
/^import .*\n/gm      // ZERO matches in a CRLF file
/^import .*\r?\n/gm   // correct
```

Most of this repo is CRLF. The regex looked obviously correct and silently
matched nothing — the same shape as every other bug in these notes.

**2. Inserting after "the last import" lands inside a multi-line import.**

```js
import {
import Eyebrow from '…'   // ← inserted here
  GENRES,
} from '…'
```

`/^import .*\n/` treats `import {` as a complete statement. The fix is
`/^import [\s\S]*?from '[^']*'\r?\n/`, which requires the `from` clause. This
has happened in this repo **before** — banner comments were once inserted inside
`import { … }` blocks in two files, and *that* time it was legal JavaScript, so
every check passed. This time the parser caught it, which is only luck about
which construct was inserted.

## How the rewrite was done safely

Matches were located in a **comment-masked copy** — comments replaced
character-for-character with spaces, so offsets stay identical — and applied to
the raw file at those offsets. A `Was: <Text className=…>` example inside a
comment can therefore never be rewritten.

This is not hypothetical: a blanket `rounded-xl → rounded-md` replace in this
repo once rewrote its own `Was: rounded-xl` note, leaving a comment that
contradicted itself. Every swap in this pass names the element it targets.

## Files

- `src/components/ui/Eyebrow.jsx` — new; the one eyebrow
- `src/lib/themeColor.js` — new; token → colour for value props
- `scripts/check-theme.mjs` — new; the audit, permanent
- 19 screens converted to `<Eyebrow>`; 5 files de-hexed; 5 files radius-corrected
