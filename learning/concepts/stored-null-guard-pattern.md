# Concept: read-with-fallback + `&&` guard + create-on-first-write

A tiny, VERY common pattern. Learned while reading `useDailyQuota.js`, but it shows up
everywhere you read something that might not exist yet (storage, cache, a DB row).

## The line
```js
const stored = await loadJSON(key, null)
const count  = stored && stored.date === today ? stored.count : 0
```

## Key vs value (don't mix these up)
- **`key`** = the ADDRESS — e.g. `kawmhmoob.quota.<userId>.<feature>`. It encodes WHO
  and WHAT (user + feature).
- **`stored`** = the CONTENTS at that address — just `{ date, count }`.
Locker analogy: the key is the locker number; `stored` is the note inside. You never
put the user/feature in the note — it's already implied by which locker you opened.

## Three ideas in one line

1. **Read with a fallback.** `loadJSON(key, null)` → if nothing was ever saved, you get
   `null` instead of a crash. The record only starts existing after the first WRITE.

2. **`&&` short-circuit = a null guard.** `stored && stored.date === today`:
   - If `stored` is `null`, JS sees `null &&` and STOPS — it never evaluates
     `stored.date`. (That matters: `null.date` would throw
     "Cannot read property 'date' of null".)
   - So the whole condition is falsy → the ternary picks the `: 0` branch.
   - The guard does double duty: "does a record exist?" AND "don't crash on null."

3. **Create-on-first-write.** There's no setup/insert step. The record is BORN the
   first time you save:
   ```js
   await saveJSON(key, { date: today, count: next })
   ```
   Before that, reads just return the fallback (`null` → treated as 0).

## The lifecycle (quota example, limit 3)
```
first ever tap:  stored = null           → count 0 → save { today, 1 }
same day again:  stored = { today, 1 }   → count 1 → save { today, 2 }
next day:        stored = { oldDate, 2 } → date ≠ today → count 0 → save { newDay, 1 }
```
The "daily reset" is free: an old date fails `=== today`, so you read it as 0 without
ever deleting anything.

## The reusable shape (memorize this)
```js
const rec = await load(key, null)             // read, fallback to null
const value = rec && rec.someCheck ? rec.field : DEFAULT  // guard + pick
// ...maybe mutate...
await save(key, { ...newRecord })             // create/overwrite
```
Whenever you read data that "might not be there yet," reach for: **fallback on read →
`&&` guard before touching fields → write to create.** No separate "does it exist?"
branch needed.

Related: `src/hooks/useDailyQuota.js`, [[nativewind-function-style-invisible]] (another
"read the code carefully" gotcha).
