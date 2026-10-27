# 04 — Modules: import and export

Every file in your app is a **module**: a sealed box. Nothing inside it is
visible to other files unless it's **exported**, and nothing outside can be
used unless it's **imported**. The first 20 lines of almost every file are
imports. This lesson makes them fully readable.

---

## 1. Start from your code

The top of `app/(tabs)/index.jsx`:

```js
import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import { useAuth } from '../../src/context/AuthContext.jsx'
import { levelFromPoints } from '../../src/lib/leveling.js'
```

The top of `app/_layout.jsx`:

```js
import * as SplashScreen from 'expo-splash-screen'
import '../global.css'
```

Four different import shapes. Here's each one.

---

## 2. Named exports vs the default export

A file can have **many named exports** and **at most one default export**.

**Named**: `src/data/path.js`:

```js
export const UNIT_WORD_CAP = 20
export const path = [ … ]
export function getUnit(unitId) { … }
```

Import them **by their exact name, in curly braces**:

```js
import { getUnit, livePath, unitWords } from '../../../src/data/path.js'
```

**Default**: `src/components/ui/Button.jsx` ends with:

```js
export default Button
```

Import it **without braces, under any name you choose**:

```js
import Button from '../ui/Button.jsx'
import Btn from '../ui/Button.jsx'      // also works; same thing, different local name
```

| | Named | Default |
|---|---|---|
| How many per file | any number | 0 or 1 |
| Import syntax | `import { name }` | `import AnyName` |
| Name must match? | yes (or rename: `{ name as other }`) | no |
| Your convention | lib functions, data, hooks, context helpers | components and screens |

> ⚠️ **expo-router needs a default export.** Every file in `app/` must
> `export default` its screen component. That's how the router finds it.
> Forget it and you get a "missing default export" warning and a blank route.

Getting the braces wrong is the #1 import error:

```js
import { Button } from '../ui/Button.jsx'   // ❌ undefined — Button is a DEFAULT export
import useAuth from '…/AuthContext.jsx'      // ❌ useAuth is a NAMED export
```

The symptom is usually **"Element type is invalid… got: undefined"** or
**"x is not a function"**. When you see either, check the braces first.

---

## 3. The other two shapes

### `import * as Name`: everything, in one object

```js
import * as SplashScreen from 'expo-splash-screen'
SplashScreen.preventAutoHideAsync()
SplashScreen.hideAsync()
```

All the named exports collected under one name. Handy when a library has many
small functions that read well with a prefix.

### `import 'something'`: just run it

```js
import '../global.css'                       // _layout.jsx: load the Tailwind styles
import 'react-native-url-polyfill/auto'      // lib/supabase.js: patch in a missing `URL`
```

No names come out. The import exists only for its **side effect**: running
that file changes something globally.

---

## 4. Paths: packages vs your own files

```js
import { View } from 'react-native'                       // no ./ or ../ → a PACKAGE from node_modules
import TabScreen from '../../src/components/TabScreen.jsx' // starts with . → a FILE, relative to THIS file
```

`../` means "go up one folder". Count them from the file you're in:

```
app/(tabs)/index.jsx
      ../          → app/
      ../../       → kawmHmoob-MOBILE/   (the project root)
      ../../src/components/TabScreen.jsx  ✅
```

From `app/path/[unitId]/index.jsx` it takes **three** `../` to reach the root,
which is why that file imports `'../../../src/data/path.js'`.

> 📝 This project always writes the extension (`.jsx`, `.js`). That's a
> choice, not a requirement: Metro finds `'../ui/Button'` too. It becomes
> important in Lesson 13, when files get renamed to `.ts`.

---

## 5. Module code runs once

Code at the **top level** of a module (outside any function) runs **once**, the
first time anything imports that file. After that, every importer gets the same
already-built values.

`app/(tabs)/index.jsx`:

```js
const vocabStats = (() => {
  const byId = new Map()
  for (const c of categories) if (!byId.has(c.id)) byId.set(c.id, c)
  …
})()
```

That `(() => { … })()` is a function that's defined and **called immediately**.
Because it sits at module level, the counting happens once at startup, not
every time Home re-renders. Same with `SplashScreen.preventAutoHideAsync()` at
the top of `_layout.jsx`: it runs once, as early as possible.

**Consequence:** a module-level `const` object is effectively a **singleton**:
one shared copy for the whole app. That's fine for constant data
(`POINT_SOURCES`), but **never keep changing state in a module-level variable**:
React won't know it changed, and it survives across users. State goes in
`useState` or context (Lessons 07 and 09).

---

## 6. Private by default

Anything not exported is private to the file. `src/data/vocabulary.js` does this
on purpose:

```js
const RAW_CATEGORIES = [ … ]          // NOT exported — the raw, unsplit data
// … later …
export const categories = …          // the processed version everyone uses
```

The comment there explains why: the raw list is an internal detail, and the
rest of the app should only see the split version. **Exporting is a promise;
only export what other files should rely on.**

---

## 7. Two things that aren't `import`

### `require(...)`: the older module system

`eslint.config.js` uses `const expoConfig = require('eslint-config-expo/flat')`
and `module.exports = […]`. That's **CommonJS**, Node's original system.
Config files often still use it. In app code you'll see `require` for one job:
**images and audio**:

```js
require('../../assets/covers/tsov-tod.jpg')
```

`src/data/storyCovers.js` explains the key rule: **the path must be a literal
string**. Metro finds assets by reading your source *before* the app runs, so
`require('…/' + story.id + '.jpg')` can never work. That's why your app keeps
explicit maps of `id → require('literal/path')`.

### `.mjs` files

`scripts/*.mjs` and the practice files are Node programs. The `.mjs` extension
tells Node "this file uses `import`/`export`," with no configuration needed.

---

## Gotchas

1. **Braces mismatch** → `undefined`. Named ↔ `{ }`, default ↔ no braces.
2. **Wrong number of `../`** → "Unable to resolve module". Count from the importing file.
3. **No default export in `app/`** → the route doesn't work.
4. **Dynamic `require` paths** never bundle. Literal strings only.
5. **Circular imports**: A imports B, and B imports A. One of them sees the other
   as half-built (`undefined` values) at startup. If an import is mysteriously
   `undefined` even though the export is right, look for a circle.
6. **State in a module-level `let`** won't re-render anything. Use React state.

---

## Practice (reading tasks)

1. Open `src/context/NotebookContext.jsx`. List every named export. Is there a default export?
2. Open `src/components/ui/Button.jsx`. Is `VARIANTS` exported? Should it be?
3. From `src/components/path/PathList.jsx`, write the import path to `src/lib/pathProgress.js`.
4. Find a file in `app/` with three `../` in its imports. Explain why it needs three.
5. Run this in a terminal from `kawmHmoob-MOBILE` and read the output:
   ```bash
   grep -rn "^export default" src/lib
   ```
   It prints nothing. Why are there no default exports in `lib/`?
6. **Write one.** Create `js-ts-course/practice/p04-modules/` with two files:
   - `words.mjs`: export a named `const words = [...]` (3 Hmong words) and a
     **default** function that returns how many words there are.
   - `main.mjs`: import both (one with braces, one without) and `console.log` them.
   Run `node js-ts-course/practice/p04-modules/main.mjs`. Then break it on
   purpose: swap the braces and read the error message. Learning what the
   error looks like now saves you an hour later.

<details>
<summary>Answers 1–5</summary>

1. `NOTEBOOK_WORD_LIMIT`, `NotebookProvider`, `useNotebook`. No default. Context files export several things, so named exports fit.
2. No. It's an internal detail of how Button looks. Other files should pass `variant="ghost"`, not reach into the table.
3. `'../../lib/pathProgress.js'` (components/path → components → src, then into lib).
4. Anything in `app/path/[unitId]/`: `[unitId]` → `path` → `app` → root.
5. `lib/` files export several small functions each. A default export suits a file that *is* one thing (a component, a screen).
</details>

---

## You can now…

- [ ] tell named from default exports and import each correctly
- [ ] diagnose "got: undefined" as a braces mistake
- [ ] count `../` correctly from any file
- [ ] explain why top-level module code runs only once, and why that makes state there a bad idea
- [ ] explain why `require` paths for images must be literal strings
