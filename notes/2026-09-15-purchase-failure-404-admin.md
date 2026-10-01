# The purchase that fails, the page that isn't there, and the admin view that lied

## A failed payment wiped the plan list

`app/paywall.jsx` had **one** `error` state doing two unrelated jobs:

```js
.catch(() => setError('Could not load plans.'))   // offerings never arrived
catch { setError('Purchase failed. Please try again.') }  // a CARD was declined
```

and one render branch: `error ? <ErrorCard onRetry={load}/> : <list/>`.

So a declined card **replaced the entire plan list**, told the user to *"check
your connection"*, and offered a Retry button that re-fetched offerings which
had never failed. The one thing they could not do from that screen was try the
purchase again.

Now `loadError` (blocks the list, Retry re-fetches) and `txError` (list stays,
shown above it, dismissible).

### ⚠️ "Please try again" is wrong advice for most payment failures

The old message said it to all of them. RevenueCat's code says otherwise:

| code | what it means | retry? |
|---|---|---|
| `PAYMENT_PENDING` | the charge is **in progress** — Ask to Buy, a slow bank | ❌ **retrying is how you get double-charged** |
| `PRODUCT_ALREADY_PURCHASED` | they own it; the app does not know | ❌ restore, not retry |
| `PURCHASE_NOT_ALLOWED` | parental controls, managed device | ❌ will fail identically forever |
| `NETWORK` / `STORE_PROBLEM` | nothing charged | ✅ |
| `PURCHASE_INVALID` | declined | ✅ after fixing the card |

⚠️ **The fallback says "nothing was charged" ONLY because the pending case is
handled above it.** Without that branch, that sentence is a lie told to the one
person it matters most to.

⚠️ **Restore is offered on every failure, not just ALREADY_PURCHASED.** A
purchase can succeed at the store and fail on the way back — money gone, app
unaware. Restore is the only recovery, and nobody in that state goes looking for
it under the plan list.

⚠️ **There is deliberately no "Try again" button.** The plans are right there. A
second button that re-opens the same sheet is how a pending payment becomes two
charges.

User cancellation never reaches any of this: `SubscriptionContext.purchase()`
swallows `e.userCancelled` without throwing. Backing out of a sheet is not an
error and must never render as one.

## 404

One already existed. It said "That page does not exist" and offered Home.

It now shows **the path it could not find**, which is the difference between a
bug you can act on and "it said 404" — and offers Search, because most arrivals
are chasing a story or word id that moved. Wrapped in `TabScreen`: being lost
should not also feel like being thrown out of the app.

## The admin dashboard could not answer its own question

Two problems, one of them mine from the day before.

**1. The views threw.** Written `with (security_invoker = true)`, which runs a
view as the CALLER — and `authenticated` cannot read `auth.users`. The opposite
rule to `story_manifest`, which MUST respect RLS. Now definer rights, dropped
and recreated (⚠️ `create or replace view` does not clear a reloption already
set).

**2. Nothing in Supabase knew who was paying.** Pro lives in RevenueCat and in
app memory; the `profiles` row was never told. So the dashboard could not count
subscribers — the main thing it exists for.

`profiles.is_pro` now exists and `SubscriptionContext` writes it.

⚠️ **`realPro`, not `isPro`.** `isPro` is true for everyone when monetization is
short-circuited and it absorbs the dev override — either would have written
"everyone is a subscriber" into the dashboard.

⚠️ **It is a REPORT, not a source of truth.** A patched build can write `true`.
The cost is a wrong number on a dashboard, never a free subscription — gating
stays with RevenueCat. The real fix is a RevenueCat webhook into an Edge
Function; logged in TODO.

**3. Empty and unauthorised look identical.** RLS returns an empty set, never a
permission error. `admin_whoami()` tells them apart, and the screen prints the
seed SQL when the answer is "you are not in public.admins". Without it the
screen is blank and the cause is unguessable.

Scope cut on request: email, name, PRO/free, joined, last seen, XP. The six
progress counters are gone.

## ⚠️ Three silent failures in one session

**A NUL byte in `paywall.jsx`.** A shell-quoted `node -e` replacement turned a
`' '` sentinel into `'\u0000'`. Invisible in every editor; the only symptom was
`grep` reporting *"Binary file app/paywall.jsx matches"*. Removed, the sentinel
replaced with an explicit `undefined` check, and every touched file scanned for
NULs afterwards.

**`Icon` returns `null` for an unknown name.** `alertCircle` is not in the set —
there is no warning icon at all — so it would have rendered an invisible element
and an off-centre row with nothing saying why. Dropped the icon rather than
guessing at a substitute.

**`font-mono` is not configured.** Only `sans`, `serif`, `display` exist in
`tailwind.config.js`, so it falls through to Tailwind's default stack —
ui-monospace, SFMono-Regular, Menlo — none of which is on a phone. The app's
only monospace is a `Platform.select` in the dev screens.

All three would have passed review by reading. That is the shape of every
expensive bug in this project: **well-formed, plausible, and silent.**

---

## "Could not find the table 'public.admin_user_progress' in the schema cache"

Reported after the SQL was re-run. **Not a database problem.** Probed the live
project with the anon key:

```
admin_users, admin_totals   401  exist — anon revoked, as designed
admin_user_progress         404  dropped, as intended
profiles.is_pro             200  column added
```

The schema is exactly right. The app was running a **stale JS bundle** — the
previous version of `app/admin-users.jsx` queried `admin_user_progress`, and
nothing in the repo references that name any more except the two `drop view`
lines. Reload; `npx expo start -c` if a plain reload does not take.

⚠️ **401 and 404 mean different things here and both look like failure.**
401 on `admin_users` is the `revoke ... from anon` working. 404 is PostgREST
saying the relation is gone. A probe that renders them the same way would have
sent us re-running SQL that was already correct.

⚠️ **Renaming a database object is a breaking change for every installed
build.** The view was replaced in the same session it was created, so the only
casualty was a dev reload. Once stories are delivered remotely and there are
real installs, a rename means old clients querying a name that no longer
exists — which is what `min_app_version` is for on the stories table, and why
that column is not optional.

### Asking Metro what it is actually serving

The error persisted after a reload, and the guesses available were: stale source
(no), stale database (no), stale Metro cache (maybe), stale bundle on the device
(maybe). Two maybes is where debugging usually goes wrong.

Metro answers directly. It serves any module over HTTP:

```
http://localhost:8081/app/admin-users.bundle?platform=android&dev=true&minify=false&modulesOnly=true&runModule=false
```

Fetch it and grep the text:

```
absent    admin_user_progress      ← gone from what Metro serves
PRESENT   admin_whoami
PRESENT   from('admin_users')
absent    "Users & progress"
```

That eliminated three of the four possibilities in one request: source,
database and Metro cache were all correct, so the stale copy could only be the
bundle already loaded inside the dev client.

⚠️ **A dev client loads JS from Metro at runtime — a native rebuild is not
needed** for a change like this, only for native modules. Reload, or force-stop
and reopen.

⚠️ **Ship a visible tell with a rename.** The old screen's header read
"📊 Users & progress" and the new one reads "📊 Users". That one string answers
"which bundle am I looking at?" instantly, with no tooling. Worth doing
deliberately whenever a screen changes what it queries — otherwise "it still
does not work" and "I am looking at an old build" are indistinguishable from
either side of the conversation.

---

## The About page now says who built it

`app/about.jsx` gained a "Who built this" section, placed immediately above
"Questions or corrections" — a correction card reads differently when you know
it reaches a person rather than a support queue.

> Kawm Hmoob is built and maintained by one person: **Devv**, 21, a college
> dropout, addicted to learning Hmong and set on preserving it.
>
> Every lesson, recording, translation and line of code here is one person's
> work. That is why some of it is still unfinished — and why none of it is
> padded out to look bigger than it is.

⚠️ **The rest of the page says "we"** — "Why *we* are careful", "*we* want to
hear it" — and this section says one person. That is a real inconsistency, left
in rather than silently fixed: changing the voice of a whole page is an
editorial decision for the author, not a side effect of adding a bio. Logged in
`notes/TODO.md` with the two places to change.

The page's own header comment already says it is the learner-facing twin of
`notes/2026-09-12-why-this-app-exists.md` and that the two must move together.
Worth remembering if the voice does change.

## The admin seed message, and why it prints a uid

The first version of the not-an-admin state printed a template:

```sql
select id, 'me' from auth.users where email = 'you@example.com'
```

⚠️ **That is one more thing to get right while reading a screen that says
something is wrong**, and it fails *silently* — a case difference, a Gmail dot,
or an OAuth provider that stored a different address all insert zero rows and
report success.

It now prints the current session's **uid** and a statement that needs no
editing, with `on conflict do nothing` so a second run is not a new error. The
`<Text>` is `selectable` so it can be copied off a phone.

**It worked**: the screen reported "70 profiles exist" while refusing to show
them, which is exactly the state the diagnostic was built to make legible — and
the fix was one insert rather than an afternoon.
