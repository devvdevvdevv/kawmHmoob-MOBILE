# The app wouldn't open: `icon` used but never declared

**2026-08-29** · `src/components/ui/Button.jsx`, `scripts/check-undefined-refs.mjs`

A one-line omission took down every screen in the app. The interesting part is
not the bug — it is that **my verification said PASS**, and why it was never
capable of saying anything else.

---

## The break

Adding an `icon` prop to the shared `Button` meant two edits:

1. destructure `icon` from props
2. render it

**Only #2 landed.** The result:

```jsx
const Button = forwardRef(function Button({
  children,
  onPress,          // ← no `icon` here
  ...rest
}, ref) {
  ...
      {icon ? (     // ← but used here
        <Icon name={icon} … />
      ) : null}
```

`icon` resolves to nothing in that scope. It is not a variable, not a prop, not
an import — a bare undefined identifier, evaluated on **every render of every
Button in the app**. `Button` is used on essentially every screen, so nothing
opened.

Second-order damage: because `icon` was never destructured, it fell into
`...rest` and got spread onto the `Pressable` as an unknown DOM/native prop.

---

## ⚠️ Why my verification passed it

After every edit this session I ran:

```
node -e "require('@babel/core').transformFileSync(f, …)"   → PARSE OK
```

**That check cannot detect this bug, and never could.** Babel answers one
question: *is this valid JavaScript?* `{icon ? … : null}` is perfectly valid
syntax. Whether `icon` resolves to anything is a **scope** question, and
`transformFileSync` does not ask it. It compiles undefined references happily
and hands you a green light.

> **PARSE OK means the file is grammatical. It says nothing about whether the
> program means anything.**

I had been treating a syntax check as a correctness check for the whole session.
It caught real mistakes — unbalanced JSX, broken string splices — so it felt
like verification. It was spell-check being read as proofreading.

⚠️ **CORRECTED 2026-08-29:** I originally wrote "there is no eslint in this
project." That is wrong. `package.json` declares `eslint ^9.39.5` and
`eslint-config-expo ^57.0.2` — they are simply not INSTALLED into
`node_modules`, which is why `node_modules/.bin` was empty when I checked.

Nothing was running, so the gap was real. But "no eslint exists" and "eslint is
declared and uninstalled" point at different fixes, and only the second one is
true. See [[2026-08-29-tone-scoring-unblocked]].

## ⚠️ And why the edit script LIED about applying

The script that made the change reported `Button: +icon prop`. It had not.

```js
if (!s.includes('icon,')) {           // guard: not yet added?
  s = s.replace('  children,\n  onPress,', '…icon…')   // edit A
  s = s.replace('      {isTextLike ? (', '…render…')   // edit B
  ok.push('Button: +icon prop')       // ← reports on ENTERING the branch
}
```

The message proves only that the guard was false. `String.replace` with a
non-matching needle **returns the string unchanged and throws nothing** — so
edit A silently did nothing while edit B succeeded, and the script announced
success for both.

Two compounding faults:

1. **A guard checked at the top does not verify an edit at the bottom.**
2. **Success was reported from control flow, not from a result.**

The fix pattern, used in later scripts and worth making the default:

```js
if (!s.includes(needle)) { console.error('MISS: ' + needle); process.exit(1) }
s = s.replace(needle, replacement)
```

Assert the needle exists BEFORE replacing, and fail loudly. A silent no-op edit
is the worst outcome available — it looks exactly like success.

---

## The fix

```js
const Button = forwardRef(function Button({
  children,
  icon,          // a name from the shared Icon set - never an emoji or text glyph
  onPress,
  …
```

One line. The whole outage.

---

## The real deliverable: `scripts/check-undefined-refs.mjs`

A parse check was the only automated gate on this codebase, and it is
structurally blind to this bug class. So the gate changed.

The script walks every `ReferencedIdentifier` with Babel's **scope analysis**
and reports any name that has no binding and is not a known runtime global:

```
✗ src/components/ui/Button.jsx:77
    'icon' is used but never declared, imported, or destructured
```

**Verified against the actual bug**, not assumed: the fixed line was removed,
the checker flagged both usages and exited non-zero; restored, it passed.
A guard that has never been shown to fail is not a guard.

Full sweep: **181 files, 0 undefined references.**

The first run surfaced five hits — `atob`, `Float64Array` — which were false
positives, real React Native globals missing from the whitelist, now added.
Worth noting that tuning that list is the maintenance cost of this script; a
name that belongs there and isn't will read as a bug.

### Run it

```
node scripts/check-undefined-refs.mjs                      # everything
node scripts/check-undefined-refs.mjs src/components/ui/Button.jsx
```

Exits non-zero, so it belongs in CI next to `check-lesson-audio.mjs`.

---

## The pattern across today

Three bugs, one shape:

| | what was wrong | what hid it |
|---|---|---|
| Recorder wiring | lessons called the wrong hook | failed *gracefully* — a designed empty state |
| Lesson audio | steps referenced no clips | `null` renders as a disabled button, indistinguishable from "no clip yet" |
| `icon` | identifier never declared | PARSE OK — a check that could not see it |

Every one was **silent**. None threw. Each was found by asking a question the
existing tooling was not asking, and each is now guarded by a script that exits
non-zero:

```
scripts/check-lesson-audio.mjs      audio paths resolve
scripts/check-undefined-refs.mjs    identifiers resolve
scripts/pronunciation-selftest.mjs  the DSP is correct
```

> **The generalisable lesson: know what your green light is actually measuring.**
> "PARSE OK" was answering a question I was not asking, and I read its answer as
> though it were.

---

## Exercises

### 1. Feel the difference between the two checks
Delete the `icon,` line again. Run the parse check, then the ref check.

```
node -e "require('@babel/core').transformFileSync('src/components/ui/Button.jsx',{presets:[['babel-preset-expo',{jsxImportSource:'nativewind'}]]})"
node scripts/check-undefined-refs.mjs src/components/ui/Button.jsx
```

*One says nothing is wrong. Write down, in one sentence, the question each is
actually answering.*

### 2. Find what the ref check still cannot see
Give a Button `icon="banana"`. `Icon` returns `null` for an unknown name, so
nothing renders and nothing errors.

*The identifier resolves fine — the VALUE is wrong. Sketch what a check for
that would look like. (Compare `check-lesson-audio.mjs`, which is exactly that
check for audio paths.)*

### 3. Write a lying edit script on purpose
Do a `.replace()` with a needle that isn't in the file. Print "done".

*This is the failure above, in three lines. Now add the `if (!s.includes(...))
process.exit(1)` guard and watch it become impossible.*

### 4. Judgement (no code)
This project DECLARES eslint but has not installed it, and
`check-undefined-refs.mjs` reimplements roughly 1% of one rule (`no-undef`).

*Is adding eslint the right move now, or does it bring a config surface and a
plugin chain not worth the cost yet? What would change your answer?*
