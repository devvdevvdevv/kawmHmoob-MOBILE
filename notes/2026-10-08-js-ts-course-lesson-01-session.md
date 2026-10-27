# JS/TS course, Lesson 01 session: `?.`, `const`, AuthContext, and the checklist (2026-10-08)

A working session on Lesson 01 (values and variables) of `js-ts-course/`. It
covered optional chaining, `const` vs `let`, an AuthContext refresher, and the
lesson's "You can now…" checklist, with each answer checked by running it in
Node. This note records what was learned, where each misunderstanding was,
and which files changed. It follows on from
[2026-10-04-js-ts-course-and-routing-drills].

## The `== null` correction (checklist item 5)

The checklist answer started as *"for broad mutability, all types of falsy or
truthy"*, then *"it gets all the falsy values in the falsy family"*. Both were off.

- **"Mutability" is the wrong word.** Mutability = whether something can be
  *changed* (the `const` topic). `==` is about *comparing*.
- **`== null` catches only 2 of the 6 falsy values.** Run in Node:

```js
null      == null   // true  ✅ caught
undefined == null   // true  ✅ caught
0         == null   // false ❌ NOT caught
''        == null   // false ❌ NOT caught
false     == null   // false ❌ NOT caught
NaN       == null   // false ❌ NOT caught
```

The picture that fixed it: inside the falsy family there is a smaller **"missing"
pair**, the only two values that mean "there is no value here at all":

```
falsy family (6):   0   ''   false   NaN   [ null   undefined ]
                                           └── == null catches ONLY these ──┘
```

`0`, `''` and `false` are falsy but still **real values** (a score of 0, an empty
name, a "no"), and `== null` deliberately leaves them alone.

| You want to catch… | Write |
|---|---|
| all 6 falsy values | `if (!x)` |
| only "missing" (`null` / `undefined`) | `if (x == null)` |
| only `null` | `if (x === null)` |

> **`x == null` catches only `null` and `undefined`, the "missing" pair. It is
> the one place `==` is OK. Everything else uses `===`.**

**Why the app uses it:** `src/lib/storage.js` does `if (raw == null) return fallback`,
because "nothing stored" can come back as either `null` or `undefined`, while a
stored `0` or `''` must still count.

## The rest of the Lesson 01 checklist

| Item | Result |
|---|---|
| Six falsy values | ✅ `0, false, null, undefined, NaN, ''` |
| `best ?? null` vs `best \|\| null` | ✅ rule right; the missing half: a score of **0** is falsy, so `\|\|` replaces it with `null` and a learner who scored 0 looks like they never took the quiz. `??` keeps the 0. |
| `user?.id \|\| 'guest'` for `null`, `{}`, `{ id: 'x' }` | First answered `undefined, undefined, 'x'`, which is only the `user?.id` part. Corrected to **`'guest'`, `'guest'`, `'x'`** ✅. **An expression always ends as exactly one value**: keep going until no operators are left. |
| Why `const state = {}` can still change | ✅ "objects/arrays can change inside a const". The other half: you can't point the name at a **new** object (`state = {}` ❌). |
| The one place `==` is OK | ❌ → corrected, see above. |

## `?.` (optional chaining)

- It checks **the thing on its left**, not the property. A missing property never
  crashes (`{}.name` is just `undefined`); `null.name` does, and that's the case `?.` is for.
- When it stops, it **always** reports `undefined`, never `null` and never `false`.
  (The drill answer `null` for `word.example?.english` was the miss.)
- `??` **replaces** the value, it doesn't add to it: the answer
  "null no example" → just `'no example'`.
- Drill score: 3½/5. Recorded in Lesson 01 §5 "`?.` in more depth".
- Real example: `sessData?.session?.user?.id` in `AuthContext.jsx`. Being
  signed out is normal, so `?.` is the right tool there.

## `const`, `let`, and assignment

- **A calculation never changes a variable.** `info2 + 2` gives 2 and throws it
  away; only `=` (or `+=`, `++`) stores it. This was the mix-up: *"info2 + 2 = 2,
  so info2 = 2?"*. Only after `info2 = info2 + 2`.
- `const` forbids the `=` and nothing else.
- **The explanation that landed** (the user: *"this is what you should've
  explained it as"*): a number has no *inside* (`0` is just `0`); objects and
  arrays do. `progress.count = …` ✅ vs `progress = {…}` ❌. **`const` locks the
  label to the box, not the contents.**

**Why it matters for future lessons:** lead with the concrete ✅/❌ contrast, then
state the rule. Abstract-first ("the name points at the same box") didn't land.

## AuthContext refresher

- Supabase **Auth** = the ID card (email, password, `id`); the **`profiles` table**
  = the file in the cabinet (username, dialect…). The `id` links them.
- Chain: `getSession()` → `session.user.id` → `hydrateProfile(id)` → `rowToUser` → `setUser`.
- `user` is **never `null`** in this app: it starts as, and falls back to, `guestUser`
  (`id: 'guest'`), so `user?.id || 'guest'` elsewhere is only a safety net.
- The full shape of `getSession()`'s result was walked through, field by field;
  `access_token`/`refresh_token` are secrets, never to be logged.
- Spotted, **not changed**: AuthContext's Provider `value` isn't wrapped in
  `useMemo` (NotebookContext's is). Saved as an exercise for Lesson 09 §5.

## Files changed

- `js-ts-course/01-values-and-variables.md`: §3 rewritten to lead with "a number
  has no inside"; §3 links the new extras file; §5 gained "`?.` in more depth"
  with the drill and first-attempt record.
- `js-ts-course/extras/const-let-and-assignment.md`: **new**. Calculation vs
  assignment, `+=`/`++`, inside-the-box, `const x = fn()` stores once, loops,
  and a 6-question drill.
- `js-ts-course/README.md`: new "Extras" section linking it.
- `learning/feature-logic/auth-context-explained.md`: **new**. The AuthContext
  refresher, with a quick check. Listed in `learning/README.md`.

## Still open

- Rewrite checklist item 5 in Lesson 01 in your own words, then tick it.
- The `[comp].jsx` route-tracing exercise from [2026-10-04-js-ts-course-and-routing-drills].
- The AuthContext quick check (6 questions) is unanswered.
- `practice/p01-values.mjs`: in progress (started 2026-10-08). Run
  `node js-ts-course/practice/p01-values.mjs` until it says 6/6.

Related: [2026-10-04-js-ts-course-and-routing-drills], [2026-08-04-auth-not-authenticated-guest-safety]
