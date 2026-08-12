# Learning: configuring Supabase for the RN app

**Good news: the CODE is already done.** `src/lib/supabase.js` builds the client,
`AuthContext` does auth + profiles, and `ProgressContext` syncs the progress blob.
None of that needs writing. This lesson is about **standing up the backend** those
files talk to — a Supabase project, the schema, and two env vars — and  
understanding *why* each piece is shaped the way it is.

---

## 0. How the code is wired (so the config makes sense)

`src/lib/supabase.js`:
```js
const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
export function isSupabaseConfigured() { return Boolean(url && anonKey) }

export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey, {
      auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
    })
  : stubClient   // ← every call errors gracefully when unconfigured
```

Two things to internalize:
- **The `stubClient`** — with no env vars, the app still runs; every Supabase call
  returns `{ data: null, error: {...} }`. That's why the app works today in "guest"
  mode with no backend. Configuring = flipping `isSupabaseConfigured()` to true.
- **`storage: AsyncStorage`** — RN has no `localStorage`, so the session token is
  persisted in AsyncStorage. `persistSession` + `autoRefreshToken` keep the user
  logged in across restarts. `detectSessionInUrl: false` because there's no URL bar.

---

## 1. Create the project + get the two values

1. supabase.com → New project. Pick a region near your users; save the DB password.
2. Project Settings → **API**:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon public** key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

The anon key is **safe to ship** in the bundle — it's public by design. The thing
that actually protects data is Row Level Security (step 3), NOT hiding the key.

---

## 2. Env vars (the `EXPO_PUBLIC_` prefix matters)

Create `.env` (or `.env.local`) at the project root:
```
EXPO_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```
- The **`EXPO_PUBLIC_`** prefix is required — Expo only injects env vars with that
  prefix into the client bundle (`process.env.EXPO_PUBLIC_*`). Without it, the value
  is `undefined` at runtime and you stay on the stub client.
- Add `.env*` to `.gitignore` (the URL/anon key are low-risk, but keep the habit).
- **Restart with cache clear after editing env:** `npx expo start -c`. Env is
  baked at bundle time — a hot reload won't pick up a new `.env`.

Sanity check in the app: `import { isSupabaseConfigured } from './lib/supabase'` →
`console.log(isSupabaseConfigured())` should be `true`.

---

## 3. Run the schema (the whole backend in one file)

The web app ships the exact schema at
`<web-app>/instructions/supabase-schema.sql`. Open the Supabase **SQL Editor**,
paste the whole file, run once. It's idempotent (safe to re-run). What it creates,
and why each part exists:

### `profiles` (1:1 with `auth.users`)
Columns the code reads/writes: `id` (= auth user id), `username`, `display_name`,
`email`, `dialect_preference`, `joined_at`, plus optional onboarding fields
(`age_range`, `gender`, `ethnicity`, `hmong_relationship`, `region`, `onboarded_at`).
- `id uuid references auth.users(id) on delete cascade` — deleting the auth user
  cleans up the profile; **without the cascade you get orphan rows** that squat on a
  username and make the *next* signup fail with the opaque "Database error saving
  new user". (The SQL file's section 1b exists entirely to fix a table that was made
  without the cascade — read that comment, it's a real war story.)
- `dialect_preference ... check (in ('white','green','dananshan'))` — **this list
  must match `src/components/common/DialectSelect.jsx`.** If the UI offers a value
  the CHECK rejects, the signup trigger's insert fails inside the transaction and
  Supabase reports that same generic error.
- `unique index on lower(username)` — usernames are unique, case-insensitively;
  `AuthContext`'s "username taken" message assumes it.

### `progress` (one JSON blob per user)
`{ user_id, data jsonb, updated_at }`. Deliberately **one jsonb column**, not
normalized tables — the app loads-all/saves-all (debounced) and the shape changes
often, so normalizing would mean a migration per field for zero query benefit.
`ProgressContext` does an `upsert()` here.

### Row Level Security (the real security boundary)
`enable row level security` on both tables + policies scoping every row to
`auth.uid() = id` / `= user_id`. **This is what makes the public anon key safe** —
without RLS, anyone with the (public) key can `select *` your users' emails.
- Note `progress` needs BOTH `insert` and `update` policies because `upsert()` can
  be either.
- There's **no DELETE policy** on purpose — absent policy = denied = least privilege.

### Signup trigger `handle_new_user()`
Creates the profile row **in the same transaction** as the auth signup. Without it,
registration is two writes (signUp, then insert) and a failed second write orphans
the account. `security definer` + `set search_path = ''` let it write safely.

Run the **VERIFY** queries at the bottom of the file after — confirm `rowsecurity =
true`, 6 policies, and the trigger exist.

---

## 4. Auth settings in the dashboard

Authentication → **Providers / Email**:
- For dev, consider **disabling "Confirm email"** so `signUp()` returns a session
  immediately. With it ON, `register()` returns `{ pendingConfirmation: true }`
  (AuthContext already handles that branch) and the user must click a link first.
- Authentication → **URL Configuration**: add your app's redirect scheme
  (`kawmhmoob://`) if you later add magic-link / OAuth. Email+password needs nothing
  here.

---

## 5. Test the round-trip

1. `npx expo start -c`, open the app.
2. Register a new account → check Supabase **Table editor → profiles**: a row should
   appear with your username (created by the trigger).
3. Kill and reopen the app → you should still be logged in (session persisted in
   AsyncStorage).
4. Table editor → **Authentication → Users**: your user is there.
5. Make some progress, then check `progress.data` populated for your `user_id`.

### Common failures (and what they mean)
- **"Database error saving new user"** → the trigger's insert failed. 90% of the
  time it's the `dialect_preference` CHECK rejecting a UI value, or a leftover orphan
  on the username unique index. Check **Logs → Postgres**.
- **Stays in guest mode / every call errors** → env vars not loaded (wrong prefix,
  or didn't `-c` restart). Verify `isSupabaseConfigured()`.
- **Row reads return empty though the row exists** → RLS with no matching policy, or
  you're querying as anon (not signed in).

---

## 6. What you might add next (not required)

- **Leaderboard reading other users** — do NOT widen the profiles SELECT policy to
  `using (true)` (that exposes every email). Make a VIEW exposing only
  `(username, points)` and a policy on that.
- **Onboarding writes** — `updateProfile()` already maps the onboarding fields; just
  make sure the columns exist (they do, from the schema).

---

## TL;DR checklist
1. Create Supabase project → copy URL + anon key.
2. `.env` with `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
3. Paste + run `instructions/supabase-schema.sql`.
4. (Dev) turn off email confirmation.
5. `npx expo start -c`, register, verify the profile row appears.
