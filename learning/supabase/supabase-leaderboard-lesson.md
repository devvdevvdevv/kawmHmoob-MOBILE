# Lesson: build the Supabase leaderboard — step by step, with the concepts

Goal: replace the placeholder leaderboard (`buildBoard` fake data) with real rankings
from Supabase — understanding every step, not vibecoding.

**The insight that makes this easy:** you already sync each user's XP to Supabase.
`ProgressContext.saveProgress()` does `supabase.from('progress').upsert({ user_id,
data, updated_at })`, and `data` contains `xp`. `profiles` holds `username`. So the
leaderboard is almost entirely a **read** problem — no new writes. You expose a safe,
ranked view of data that's already there, and point the screen at it.

Prereqs: Supabase configured (`.env.local` keys, `isSupabaseConfigured()` is true),
and ≥2 accounts that have earned some XP. Schema is in
`learning/supabase-setup-guide.md`.

---

## 0. Four concepts you need first (5-minute read)

**1. Table vs View.** A **table** stores rows (your `profiles`, `progress`). A **view**
is a *saved SELECT query* that looks and reads like a table but stores nothing — it's
a live "window" onto other tables. You'll make a view so the app can read a clean,
safe slice without touching the real tables directly.

**2. Row Level Security (RLS).** Your Supabase anon key is *public* (it ships in the
app). RLS is what stops someone with that key from reading everyone's data. Your
`profiles`/`progress` tables have RLS policies saying "a row is visible only to the
user it belongs to" (`auth.uid() = id`). That's great for privacy — and it's exactly
why you *can't* just read other users for a leaderboard. You need a deliberate,
narrow exception.

**3. The two API roles: `anon` vs `authenticated`.** Every API call runs as a role.
Logged-out = `anon`. Logged-in = `authenticated`. You'll grant leaderboard access to
`authenticated` only — so signed-in users can see the board, and logged-out guests
can't (they fall back to placeholder data in the UI).

**4. JOIN.** Combining two tables into one result by matching a shared key. Identity
(`username`) lives in `profiles`; the score (`xp`) lives in `progress`. A join
stitches them per user. (Full ELI5 in the appendix.)

**How they fit together for the leaderboard:** RLS hides other users → so you make a
**view** that (a) *joins* profiles+progress, (b) exposes *only* safe columns (no
email), and (c) is *granted* to `authenticated`. The view is the safe doorway through
the RLS wall.

---

## 1. The whole plan in one picture

```
progress table  ─┐
 (xp, already      │   create a VIEW that joins them,
  synced)          ├──▶  exposes only username + xp   ──▶  app reads the view
profiles table  ─┘        (grant to authenticated)          (screen, ranked list)
```

You build it in two halves: **SQL half** (make the view — §2) and **app half** (read
+ render it — §3–4).

---

## 2. Build the VIEW (Supabase Dashboard → SQL Editor)

Do each micro-step and RUN it before moving on, so you SEE what each piece does.

### 2a. Look at your real data first

```sql
select id, username, display_name from public.profiles;
select user_id, data from public.progress;
```
Goal: confirm names live in `profiles`, and open one `progress.data` value — you
should see JSON with an `xp` key. If your key isn't literally `xp`, note the real name
and swap it below.

### 2b. Write JUST the join (no view yet)

```sql
select p.id, p.username, p.display_name, pr.data
from public.profiles p
left join public.progress pr on pr.user_id = p.id;
```
Run it. You should get one row per user, with their `data` blob attached. `left join`
= keep every profile even if they have no progress row yet (new accounts). If someone
has no progress, their `data` is null — that's fine, we handle it next.

### 2c. Pull `xp` out of the JSON

```sql
select
  p.id,
  p.username,
  p.display_name,
  coalesce((pr.data->>'xp')::int, 0) as xp
from public.profiles p
left join public.progress pr on pr.user_id = p.id
order by xp desc;
```
Now you have a real ranked list. `(pr.data->>'xp')::int` = grab xp as text, cast to a
number; `coalesce(..., 0)` = if missing, use 0. (Full breakdown in the appendix.)
**This SELECT is your whole leaderboard** — the next step just saves it with a name.

### 2d. Save it as a view

Take the exact SELECT that worked in 2c and wrap it:

```sql
create or replace view public.leaderboard as
select
  p.id,
  p.username,
  p.display_name,
  coalesce((pr.data->>'xp')::int, 0) as xp
from public.profiles p
left join public.progress pr on pr.user_id = p.id;
```
(Drop the `order by` from the view — you'll order in the app query, which is more
flexible.) `create or replace` = safe to re-run if you tweak it.

### 2e. Verify it, then grant access

```sql
select * from public.leaderboard order by xp desc;   -- looks right?
grant select on public.leaderboard to authenticated;  -- who may read it
```
The `grant` is the access-control step (concept #3): signed-in users can now read the
view via the API. Without the grant, the app query returns a permission error.

### 2f. Prove it's safe

```sql
select * from public.leaderboard limit 1;
```
You should see **id, username, display_name, xp — and NO email.** That "no email" is
the entire security argument: the view can't leak what it doesn't select. If you ever
see an email here, you selected the wrong column — fix 2d.

> If Supabase's "Security Advisor" warns about the view (`security_invoker`): for a
> read-only, email-free public board, the default owner-rights view is intentional and
> fine for v1. Stricter setup (invoker + a SELECT policy) is a later option, not a
> blocker.

**SQL half done.** You now have a ranked, safe `leaderboard` view.

---

## 3. Read it in the app (the query)

Concept: the Supabase client turns method chains into SQL. This...

```js
const { data, error } = await supabase
  .from('leaderboard')                    // FROM public.leaderboard
  .select('id, username, display_name, xp')  // the columns
  .order('xp', { ascending: false })      // ORDER BY xp DESC
  .limit(50)                               // LIMIT 50
```

...is literally `select id, username, display_name, xp from leaderboard order by xp
desc limit 50`. `data` is an array of rows; `error` is null on success. Import
`supabase` and `isSupabaseConfigured` from `../src/lib/supabase.js`.

**The guard:** guests / no-env use the stub client, which errors on every call. So
before fetching, check `isSupabaseConfigured()` — if false, skip the network and keep
the placeholder board. (Same pattern the whole app uses.)

---

## 4. Wire the screen — `app/leaderboard.jsx` (granular)

You are swapping the DATA SOURCE, not redesigning the UI. Keep the existing rows/cards;
feed them real data. Do it in these small steps.

### 4a. Add the three state variables

Concept: a network read has three outcomes — still loading, failed, or got data. Model
all three (the same "hydration" shape as the paywall offerings):

```js
const [rows, setRows] = useState([])      // the ranked list (starts empty)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

### 4b. Fetch once on mount

Concept: `useEffect(fn, [])` runs once after the screen mounts. The `active` flag stops
a late response from setting state after you've navigated away.

```js
const { user } = useAuth()

useEffect(() => {
  let active = true

  // Guests / no backend → keep the placeholder, don't hit the network.
  if (!isSupabaseConfigured() || user?.isGuest) {
    setRows(/* your placeholder rows, e.g. from buildBoard */)
    setLoading(false)
    return
  }

  supabase
    .from('leaderboard')
    .select('id, username, display_name, xp')
    .order('xp', { ascending: false })
    .limit(50)
    .then(({ data, error }) => {
      if (!active) return
      if (error) { setError('Could not load the leaderboard.'); return }
      setRows((data || []).map((r, i) => ({
        id: r.id,
        rank: i + 1,                         // already ordered by the query
        name: r.username || r.display_name || 'Learner',
        points: r.xp,
        isYou: r.id === user?.id,            // mark the current user
      })))
    })
    .finally(() => { if (active) setLoading(false) })

  return () => { active = false }
}, [user])
```

Concept notes:
- **`rank = i + 1`** — the array is already sorted by the query, so position = rank.
- **`isYou`** — compare each row's id to `user.id` so you can highlight yourself.
- **mapping** — you translate DB column names (`xp`) into the shape your existing UI
  expects (`points`). Keep the UI dumb; adapt the data to it.

### 4c. Render the three states

Concept: pick ONE of three things to show, based on the state (the 3-way render you've
done before):

```
if (loading) → a spinner ("Loading the board…")
else if (error) → a short message + optional Retry (re-run 4b)
else → your existing ranked rows list, driven by `rows`
```
Keep the "Last week's winner" card static/placeholder — there's no weekly bucket yet.

### 4d. Guests

They can't be `authenticated`, so 4b already routes them to the placeholder. Add a
small "Create an account to compete" nudge (reuse the guest CTA pattern from the quota
walls → `/register`).

### 4e. Remove the lie

Once real data flows, delete the "everyone but you is placeholder" disclaimer at the
bottom of the screen. If only you have XP, the board correctly shows just you — that's
honest, not a bug.

---

## 5. Test end to end

1. `npx expo start -c` (schema/env changes need the cache clear).
2. Sign in as account A (with XP) → Leaderboard → you appear with your xp, marked "you".
3. Sign in as account B elsewhere → both appear, ranked by xp.
4. Finish a lesson (earns XP → syncs to `progress`) → reload the board → your number
   moved. (Not live — it reflects the last sync.)
5. Sign out → you see the placeholder + the "create account" nudge.

---

## 6. Gotchas / decisions

- **Snapshot, not live.** Reflects the last synced `progress`. Realtime is a later
  nice-to-have (Supabase Realtime subscriptions).
- **`week` tab has no data.** No weekly-points bucket exists yet. Hide the "This week"
  tab for now, or leave it showing the season — don't fake numbers.
- **Never `select('*')` from `profiles` for the board** — that reintroduces the email
  leak. Always read through the `leaderboard` view.
- **A user needs a `username`** to look good on the board; the map falls back to
  `display_name` then "Learner".
- **Scale** — the view is fine for small numbers. If it ever gets big, add an index on
  the extracted xp or materialize it. Not a v1 concern.

When done, write a `notes/` entry: the view name, the "safety by omission" choice, and
what's still placeholder (weekly tab, last-week winner).

---

## Appendix — reading the SQL (ELI5)

### `coalesce((pr.data->>'xp')::int, 0) as xp`
Inside-out, like peeling an onion:
- `pr.data` → the progress JSON blob, e.g. `{ "xp": 350, "streak": 4 }`.
- `pr.data->>'xp'` → reach in, grab the `xp` value **as text** → `"350"`.
- `(...)::int` → make it a real **number** → `350` (so it sorts numerically; as text
  `"9"` sorts after `"100"`).
- `coalesce(X, 0)` → use `X`, but if it's **null/missing**, use `0`.
- `as xp` → name the column `xp` so the app reads `row.xp`.

One sentence: *pull `xp` from the JSON, make it a number, use 0 if missing, call it xp.*

### `from public.profiles p left join public.progress pr on pr.user_id = p.id`
- `from profiles p` → start with profiles, nickname `p`.
- `left join progress pr` → glue on progress, nickname `pr`.
- `on pr.user_id = p.id` → match them where the IDs line up.

Each table gives different things: `profiles` = WHO (id, username), `progress` = HOW
(xp inside `data`). That's WHY you join. **`LEFT`** keeps every profile even with no
progress row (new users stay, at 0 xp). Roster analogy: profiles = class roster,
progress = gradebook; left join = list every student and staple their score, and a new
kid with no test yet is still listed with no score.

### Safety recap (two SEPARATE things)
- **The view** controls WHICH COLUMNS exist → email never selected → can't leak
  (safety by omission).
- **The grant** controls WHO can read it → `authenticated` only (access control).
RLS on the base tables is what makes the view *necessary*; the view is the safe doorway
through it.
