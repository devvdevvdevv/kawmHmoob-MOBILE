# AuthContext, explained

A refresher on how `src/context/AuthContext.jsx` works: who the user is, where
that comes from in Supabase, and what each function does. Written 2026-10-08.
Line numbers are as of that date.

---

## The one job

> **Answer "who is using the app right now?" for every screen.**

Any screen calls `useAuth()` and gets the same answer: a `user` object, a
`loading` flag, and the functions `login`, `register`, `logout`,
`updateProfile`, `deleteAccount`.

---

## Two places in Supabase

| | **Supabase Auth** (`supabase.auth…`) | **`profiles` table** (`supabase.from('profiles')…`) |
|---|---|---|
| What | Supabase's built-in login system | your own table, your own columns |
| Holds | email, password, the account `id` | username, display name, dialect, onboarding date |
| Picture | the **ID card** at the door | the **file in your cabinet** about that person |

The **`id`** links them: the Auth account's id = the `profiles` row's `id`.
The whole file is: **check the ID card → pull the file with that id.**

---

## The flow in one picture

```
App opens
   │
   ▼
getSession()  ── is someone already signed in? (saved in AsyncStorage)
   │
   ├── no session ──────────────► user = guestUser,  loading = false
   │
   └── session ──► session.user.id
                        │
                        ▼
                  hydrateProfile(id)
                    profiles WHERE id = …
                        │
                        ├── row found ──► rowToUser(row) ──► setUser(…)
                        └── not found ──► setUser(guestUser)
                        │
                        ▼
                  loading = false

…and onAuthStateChange keeps listening: every later login / logout / expiry
runs the same "session → hydrateProfile, or → guest" decision again.
```

---

## The pieces

| Lines | Piece | Job |
|---|---|---|
| 10–18 | `guestUser` | the "nobody signed in" user: `{ id: 'guest', isGuest: true, … }` |
| 20–31 | `rowToUser(row)` | database row → app user (snake_case → camelCase) |
| 34–35 | state | `user` (starts as **guest**, never `null`) and `loading` (starts `true`) |
| 37–50 | `hydrateProfile(uid)` | id → fetch `profiles` row → `setUser` |
| 52–72 | startup effect | ask once (`getSession`), then keep listening (`onAuthStateChange`) |
| 74–78 | `login` | password check → `hydrateProfile` |
| 80–117 | `register` | sign up → either hydrate, or "check your email" |
| 119–126 | `logout` | sign out, **never fails**, always lands on guest |
| 128–171 | `updateProfile` | guest: local only; account: write to `profiles` |
| 185–193 | `deleteAccount` | server function deletes the account; cascade removes its rows |
| 195–206 | Provider + `useAuth` | the three-part context pattern |

---

## Each piece, briefly

### `guestUser`: never `null`

`useState(guestUser)` and every "signed out" path call `setUser(guestUser)`. So
**`user` is always an object.** Screens check `user.isGuest`, not `if (user)`.
(That's why `user?.id || 'guest'` in other contexts is only a safety net.)

### `rowToUser`: translate at the border

```js
displayName: row.display_name,
dialectPreference: row.dialect_preference,
isGuest: false,
```

The database says `display_name`, JavaScript says `displayName`. Converting
**once, here**, means no screen ever sees snake_case. `updateProfile` converts
the other way before writing.

### `hydrateProfile(uid)`: fill in the user

```js
supabase.from('profiles').select('*').eq('id', uid).single()
```

"The one row in `profiles` whose id matches." `.single()` gives an object, not an
array. If there's an error or no row, the user is set to guest. Every way of
becoming signed in ends here.

### Startup effect: ask once, then listen

- **`getSession()`**: "is someone *already* signed in?" (e.g. signed in
  yesterday; Supabase saved the session in AsyncStorage, set up in
  `src/lib/supabase.js`). Sets `loading = false` when done.
- **`onAuthStateChange(…)`**: a **subscription**. Supabase calls this every time
  sign-in status changes. Think of a doorbell.
- **Cleanup:** `active = false` (the race guard, JS/TS course Lesson 05 §6) and
  `sub?.subscription?.unsubscribe?.()` (stop listening; the `?.`s cover the
  no-config stub client).
- **Why `loading`:** without it, screens would flash "Guest" for a moment
  before the real user loads.

### `login`

```js
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
if (error) throw error            // the login SCREEN catches this and shows the message
return hydrateProfile(data.user.id)
```

### `register`: two endings

1. `signUp` creates the Auth account. The profile fields ride along as
   `options.data` (stored as `user_metadata`). A **database trigger**
   (`handle_new_user`) automatically creates the `profiles` row from them.
2. Then:
   - **session returned** (email confirmation off) → `upsert` the row (insert
     *or* update; a plain insert would hit "duplicate key" because the trigger
     already made it) → `hydrateProfile`.
   - **no session** (email confirmation on) → `return { pendingConfirmation: true, email }`,
     and the screen says "check your email".

### `logout`

```js
try { await supabase.auth.signOut() } catch {}
setUser(guestUser)
```

Swallows every error on purpose: offline or already signed out, you still end up
a guest. (It fixed an "Uncaught (in promise) Not authenticated" crash; see
`notes/2026-08-04-auth-not-authenticated-guest-safety`.)

### `updateProfile(patch)`: two branches

- **No session (guest):** apply the allowed fields to local `user` only. There's
  no row to write, and the database's row security (RLS) would refuse anyway.
- **Session:** build `dbPatch` (camelCase → snake_case), `.update(dbPatch).eq('id', uid)`,
  then `rowToUser` + `setUser` from what the server returns.

`if (patch.x !== undefined)` copies **only the fields sent**, so changing the
dialect never blanks the username.

### `deleteAccount`

The app can't delete an Auth account itself (that needs admin rights), so it
calls the `delete_user` database function with `supabase.rpc`. `on delete cascade`
removes the `profiles` and `progress` rows with it. Then sign out → guest.

### Provider + `useAuth`

```js
<AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, deleteAccount }}>
```

`useAuth()` reads it, and throws if there's no provider above (JS/TS course
Lesson 09 §3).

---

## What `getSession()` actually returns

`const { data: sessData } = await supabase.auth.getSession()` means "take the
field `data` and call it `sessData`". Same object, renamed. The full shape
(`@supabase/auth-js` 2.112):

```js
{
  data: {
    session: {                          // null when signed out
      access_token, refresh_token,      // 🔒 SECRETS: never log or display them
      token_type: 'bearer', expires_in, expires_at,
      user: {
        id,                             // ← the one the app uses
        email, phone, role, aud,
        created_at, last_sign_in_at, email_confirmed_at,
        app_metadata:  { provider, providers },                       // set by Supabase
        user_metadata: { username, display_name, dialect_preference }, // set at sign-up
        identities, is_anonymous, …
      },
    },
  },
  error,                                // null, or what went wrong
}
```

Three possible outcomes: **signed in** (session, no error), **signed out**
(`null`, no error: normal), **broken** (`null` + error). That's why the code
walks it with `sessData?.session?.user?.id` and then checks `if (!uid)`.

The username exists in **two** places: a copy in `user_metadata`, and the real
one in `profiles`. The app reads `profiles`, because that's the one updates
change.

---

## 🔍 One thing to improve (a real exercise)

Line 196 builds the `value` object fresh on **every render**. `NotebookContext`
wraps its value in `useMemo`. Without it, every `useAuth()` screen re-renders
whenever `AuthProvider` re-renders, even when nothing about the user changed.
Not a crash, but exactly what JS/TS course Lesson 09 §5 teaches.
All the functions are already `useCallback`s, so the fix is one `useMemo` with
the right dependency list. **You write it** when you reach Lesson 09.

---

## Quick check

1. Where is the **username** read from: Auth or `profiles`?
2. What does `hydrateProfile` take, and what does it end with?
3. Why does `loading` exist?
4. Why `upsert` instead of `insert` in `register`?
5. A guest changes their dialect in Settings. Which branch runs? Does it reach the database?
6. Why does `logout` have an empty `catch {}`?

<details>
<summary>Answers</summary>

1. `profiles` (via `hydrateProfile`). The `user_metadata` copy is only the sign-up snapshot.
2. A user id. It ends with `setUser(…)`: the real user, or guest if no row.
3. So screens don't flash "Guest" before the saved session has been checked.
4. The `handle_new_user` trigger already created the row; a plain insert would hit "duplicate key".
5. The no-session branch: local `user` only. It doesn't reach the database.
6. Signing out must always succeed. Any error (offline, no session) is ignored and you become a guest.
</details>

---

Related: `learning/supabase/supabase-setup-guide.md` (the tables, RLS, the trigger),
`js-ts-course/09-context-and-providers.md` (the context pattern),
`notes/2026-08-04-auth-not-authenticated-guest-safety`.
