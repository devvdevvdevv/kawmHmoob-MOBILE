# Contact: a real form, and an honest "sent" (2026-09-22)

The brief: *"we need a message to show if the user's send message was successful
or not, like a success screen."*

## ⚠️ First: there was nothing whose success could be reported

`/contact` was an email address and a `mailto:` button. Its own comment said:

> No form: a form implies a backend that receives it, which doesn't exist. A
> mailto link sends the message somewhere real (the user's own mail client)
> instead of a void.

That is a fair design — but **a mailto can never be confirmed.**
`Linking.openURL` resolves when the *mail app opens*; whether anything left the
phone afterwards happens in another app and never comes back. A success screen
on top of that would have been a lie.

So the success screen needed something that can actually succeed or fail. That
is one table and one insert.

## What the learner sees

| state | what is on screen |
|---|---|
| **form** | topic chips, the message box, an optional email, one Send button |
| **sending** | the button reads "Sending…" and is disabled — one tap, one message |
| **sent** | a full screen: ✓ emblem, "Your message is in.", what happens next, and what address a reply would go to |
| **failed** | the form **exactly as it was**, with a card on top naming the failure, "Try again", and "Send it as an email instead" |

## ⚠️ The decisions that matter

**Success is a screen; failure is not.** A full-page error would either throw the
typed message away or hide it behind a button. Keeping the form untouched means
the words are still there, one tap from a retry. Success gets the whole screen
because there is nothing left to do there.

**A failed send never costs anyone their paragraphs.** The failure card's second
button is a `mailto:` with the draft already in the body (`mailtoFor()`). The old
email path did not go away — it became the fallback.

**Every failure is named, and says whose problem it is.** `sendMessage()` returns
a `reason` and a `retry` flag rather than a boolean:

| reason | what the sender is told | retry offered? |
|---|---|---|
| `invalid` | the specific thing missing ("A few more words — 4 to go.") | it is theirs to fix |
| `not-configured` | this build has no server connection | no |
| `no-table` | the messages table is missing (the migration was never run) | no |
| `refused` | RLS said no — "a bug on my side, not yours" | no |
| `network` | "did not get through — you may be offline" | yes |
| `cooldown` | "you can send again in 12s" | yes |

"Something went wrong" is the copy that makes people give up. A button that
cannot work is worse than no button, which is why `retry` gates it.

**The Send button is not disabled by an invalid draft.** A disabled button does
not say what is wrong. Pressing this one does. It is disabled only while a send
is in flight — the one case where a second tap sends twice.

**A guest files as `user_id: null`.** The RLS policy requires it. Sending a
guest's `user.id` would send the string `'guest'`, which fails as a uuid type
error rather than a policy error — much harder to read in a log.

## ⚠️ The new table is the app's only publicly writable one

`public.messages` (`supabase/03-messages.sql`) lets **anon** insert. That is
deliberate: most people using the app have never made an account, and a contact
form that requires signing up is one nobody uses. It also means the anon key
shipped in the APK can be used to spam it.

What limits the damage today: `CHECK` constraints on body length (10–4000) and
topic, and a 30-second in-app cooldown. **Neither stops a script.** The SQL says
what hardening looks like (an Edge Function with a per-IP limit and a CAPTCHA)
and when to do it: *before* anything automatic reads the table, so a flood costs
nothing but rows.

Reading is admin-only, through `public.is_admin()` — the same real gate
02-admin.sql established, not `ADMIN_EMAILS`, which only hides menu items.

## ⚠️ Two things you must do, or this silently does not work

1. **Run the migration.** `supabase/03-messages.sql` in the Supabase SQL editor.
   Until then every send fails with `no-table` — which the screen reports
   honestly, but nobody can contact you from inside the app.
2. **Read the inbox yourself.** `select * from public.admin_messages order by
   created_at desc;`. There is **no email notification and no admin screen**:
   the app can now say "sent", and the rows sit in the table until someone
   looks. `select count(*) from public.messages where not handled;` is the
   one-line check.

## Files

- `supabase/03-messages.sql` — **new**. Table, constraints, RLS (anon insert,
  admin read/update), and the `admin_messages` view.
- `src/lib/sendMessage.js` — **new**. `TOPICS`, `validateDraft()`,
  `sendMessage()` → `{ ok }` or `{ ok:false, reason, message, retry }`, and
  `mailtoFor()`. No React, no UI.
- `app/contact.jsx` — rewritten: the four states above. The email address is
  still on the screen and still works.

Lint: clean on all three.

## ⚠️ Not verified

**Nobody has sent a message from a device.** The migration has not been run
against the live project either, so the only path exercised so far is the
`not-configured` / `no-table` one by reading. Walk it end to end: send with no
server (expect the named failure and the email fallback), run the migration,
send again, then check the row.

## Still open

- No admin screen for the inbox. `/admin-users` exists and this could sit beside
  it, behind `AdminGate` + `is_admin()`.
- No notification. A Supabase webhook or a scheduled query is the cheap version.
- `handled` is written by nothing yet — it is there so an inbox screen can mark
  a message read without a migration.
- The cooldown is per screen visit, not persisted; leaving and returning resets
  it. Persisting it belongs with the other daily-quota storage if it matters.

How-to for building this pattern again:
`learning/ui-patterns/send-status-and-result-screens.md`.
