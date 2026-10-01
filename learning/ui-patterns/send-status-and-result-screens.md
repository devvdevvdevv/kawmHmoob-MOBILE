# How to: tell someone whether their thing sent

The pattern behind `/contact`: a form that submits to a server and says, plainly,
whether it worked. It is the same shape for a comment, a review, a support
ticket, a review-word report — anything that leaves the phone.

Built example: `app/contact.jsx` + `src/lib/sendMessage.js` +
`supabase/03-messages.sql`. The build record is
`notes/2026-09-22-contact-form-send-status.md`.

Related: `logout-confirm-success-modal-lesson.md` in this folder does the same
state-machine thinking for two modals in sequence.

---

## 1. First, make sure something can actually succeed

Before any of the UI: **can the thing you are reporting on be observed?**

`/contact` used to be a `mailto:` link. It could never have a success screen,
because `Linking.openURL` resolves when *the mail app opens*. What the person
does in that app — send it, delete it, close it — never comes back to you. A
"Sent!" screen there is a guess dressed as a fact.

The test to apply to anything before you promise an outcome: **does my code
receive an answer?**

| action | answer comes back? | so what can you say? |
|---|---|---|
| `mailto:` / share sheet / open a URL | no | "Opening your mail app…" |
| database insert, `fetch` to your API | yes | "Sent" / a named failure |
| fire-and-forget analytics ping | no (nobody waits) | say nothing |
| queued for retry when offline | later | "Saved — will send when you're back" |

If the answer is "no", either say something weaker, or change the mechanism.
That is what this change did: it added a table so there would be something to
report.

---

## 2. Four states, not a boolean

Almost every submit UI gets written as `loading` + `error`, and then the "what
happened" copy gets bolted on. Start from the four states instead:

```
form  ──Send──▶  sending  ──ok───▶  sent      (a screen: nothing left to do)
  ▲                  │
  └────── failed ◀────┘                        (the form, plus a card on top)
```

In `app/contact.jsx` that is one piece of state, not three booleans:

```js
const [phase, setPhase] = useState('form')   // form | sending | sent
const [failure, setFailure] = useState(null) // the named failure, or null
```

Why one `phase` string: `isLoading && isSuccess` is a state that cannot exist,
and every `useState(false)` you add doubles the number of impossible
combinations you have to reason about.

**Failure is not a fourth screen.** It is `phase: 'form'` plus a `failure`
object, which is what keeps the typed message on screen.

---

## 3. Which outcome gets a whole screen?

The rule this codebase now follows:

- **Success takes the screen** when there is nothing left to do on it. Clear the
  draft, show what happened, and offer the two ways onward ("Back to Home",
  "Send another").
- **Failure stays in place** whenever the person still holds something you would
  otherwise destroy — their text, their selections, their photo. A full-page
  error either throws that away or hides it.

Applied in reverse: a failure *can* take the screen when there is nothing to
preserve (a retry of a read-only fetch, say). The question is never "is this
important enough for a screen", it is **"what would a screen change cost them?"**

---

## 4. Name the failure. Then say whose problem it is

This is the part that makes the difference, and it lives in the logic file, not
the component. `sendMessage()` never returns a bare `false`:

```js
return { ok: false, reason: 'no-table', message: '…the messages table is missing.', retry: false }
```

Three fields, three jobs:

| field | who reads it | why |
|---|---|---|
| `reason` | you | a stable tag for logs and for `__DEV__` detail |
| `message` | the person | one sentence in their words, never a status code |
| `retry` | the button | whether trying the same thing again could possibly work |

**`retry` is the one people skip.** A missing table, an RLS refusal and a build
with no server configured will never fix themselves; offering "Try again" there
just makes someone tap it four times before giving up. A dropped request is the
opposite — retrying is exactly right.

And say whose fault it is when it is yours: *"The server refused the message.
That is a bug on my side, not yours."* People blame themselves by default, and
then stop reporting things.

Distinguish failures that look identical but are not. In `sendMessage()`:
Postgres `42P01` (table missing) and `42501` (policy refused) both arrive as
"the server said no", and they mean completely different things to you.

---

## 5. Never destroy what you cannot resend

The failure card's second button is a `mailto:` **carrying the draft**:

```js
export function mailtoFor(draft) {
  const subject = `Kawm Hmoob — ${topic ? topic.label : 'message'}`
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft.body)}`
}
```

So the failure path ends with the person holding their own words, in their own
mail app. The rule generalises: **a failed submit should always leave one route
that does not depend on the thing that just broke.** Copy to clipboard, save a
local draft, export a file — pick one.

---

## 6. Guard the double tap, not the empty form

Two habits worth unlearning:

- **`disabled={sending}` — yes.** Two taps must not send two messages. This is
  the only reason to disable a submit button here.
- **`disabled={!valid}` — no.** A dead button does not say what is missing.
  `/contact` lets you press Send with an empty box and *then* tells you ("Type
  your message first."), and it only starts showing that after the first press,
  so nobody is scolded mid-sentence:

```js
if (invalid) { setShowInvalid(true); return }
```

Validation itself lives next to the send (`validateDraft`), so the same rules
serve the button, the hint and the pre-flight check.

---

## 7. Validate twice, deliberately

`validateDraft()` in JS **and** `CHECK` constraints in SQL are two copies of one
rule, which this codebase normally forbids. Here it is right, because they have
different jobs:

- The database one **cannot be bypassed** — the anon key ships inside the APK, so
  anything can call the insert.
- The client one **can explain itself** — "4 more characters" instead of
  `violates check constraint "messages_body_len"`, with no round trip.

Write the comment that says so, in both files, or someone will "DRY it up" and
delete the enforcing one.

---

## 8. The server side, in one breath

`supabase/03-messages.sql`, and the two questions worth asking about any table
that a form writes to:

1. **Who may write?** Here: `anon` too, because most users have no account. That
   makes it the app's only publicly writable table — so the constraints and a
   cooldown are the only brakes, and the SQL says what real hardening is (Edge
   Function, per-IP limit, CAPTCHA) and when to add it.
2. **Who may read?** Admins only, via `public.is_admin()` — a real gate, not the
   `ADMIN_EMAILS` list, which only hides menu items.

Then the unglamorous half: **a form that nobody reads is worse than no form.**
There is no notification yet, so the note ends with the one query to run.

---

## Checklist

1. Can your code observe the outcome? If not, weaken the promise or change the mechanism.
2. One `phase` string, not three booleans.
3. Success takes the screen; failure stays where the unsaved work is.
4. Return `{ reason, message, retry }`, never a bare boolean.
5. Say whose problem it is; retry only where retrying can work.
6. Keep a route out that does not need the broken thing.
7. Disable the button while sending, not while invalid.
8. Validate in the client for the explanation, in the database for the enforcement.
9. Decide who may write and who may read before you ship the form.
10. Say, in the note, how the messages actually reach you.

---

# Exercises

Do these on the real screen (`npx expo start` → Home → Explore… or open
`/contact` directly). Predict each outcome first.

**1. See every failure without breaking anything.** ✍️
Temporarily make `sendMessage()` return each of the six failure shapes in turn
(`invalid`, `not-configured`, `no-table`, `refused`, `network`, plus the
cooldown). Screenshot each. Which copy would you actually change after seeing
it on a phone? Rewrite two of the sentences in your own voice.

**2. Prove the draft survives.** Type three paragraphs, force a `network`
failure, then use the email fallback. Did every character arrive in your mail
app? Now try it with a very long message and a `·` and a `"` in it — what does
`encodeURIComponent` do, and is there a length at which the mailto breaks?

**3. Run the migration and watch the reason change.**
Send once before running `supabase/03-messages.sql` (expect `no-table`), run it,
send again. Then check the row: `select * from public.admin_messages;`. If you
see nothing but the insert worked, which of the two problems is it — and which
query in 02-admin.sql tells you?

**4. Break the guest rule on purpose.**
In `sendMessage()`, always send `user_id: user.id`. Send as a guest. What error
comes back, and which `reason` does it land in? Explain why the null is not just
tidiness.

**5. The double tap.**
Remove `disabled={sending}` from the Send button and tap it three times fast on
a slow connection. How many rows appear? Then argue whether the 30s cooldown
would have saved you — and what it protects that the disabled button doesn't.

**6. Add the missing half.** ✍️
There is no way to read the inbox in the app. Build `/admin-messages` behind
`AdminGate`, reading `public.admin_messages`, with a "Mark handled" button
(the `handled` column and its update policy already exist). Sketch first: what
does it show when `is_admin()` is false, and how is that different from an empty
inbox? 02-admin.sql already answers that — find the line.

**7. Apply the pattern somewhere else.** ✍️
The word-review flow (`notes/WORD-REVIEW.md`, and the "a word sounds wrong"
topic) would be better as a one-tap report from the flashcard itself. Design it
with this checklist: what is the success state when the person is mid-deck and
must not be interrupted? (Hint: not a screen.) Where does "never destroy what
you cannot resend" apply when there is nothing typed?
