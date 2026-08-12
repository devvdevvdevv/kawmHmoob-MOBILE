# Dev tools route + admin gate (2026-08-10)

A `/dev` hub for QA harnesses and throwaway spikes, gated to three admin emails,
reachable from Settings. Built because reaching `/spike` on a phone meant typing
URLs or digging through `/_sitemap`.

Companion to [2026-08-10-pronunciation-recording-wired](2026-08-10-pronunciation-recording-wired.md),
which is what needed testing on-device in the first place.

---

## The three pieces

### [src/lib/admin.js](../src/lib/admin.js) — who counts as admin

A flat list of emails plus `isAdmin(user)`. Compares **lowercased and trimmed**,
because emails are stored however the user typed them and a capital letter
shouldn't lock you out of your own dev tools.

Guests are never admin (`user.isGuest` short-circuits before the email check).

### [src/components/common/AdminGate.jsx](../src/components/common/AdminGate.jsx) — the enforcement

Wraps a screen; non-admins get a dead end with a Back to Home button. Same shape
as `PaywallGate`.

### [app/dev.jsx](../app/dev.jsx) — the hub

Platform / SDK / dev-vs-prod at the top, then a link list: spike, tone-eval,
speak, and `/_sitemap`. Bare inline styles, deliberately outside the design
system — it should never read as a real page.

### Entry point: [app/settings.jsx](../app/settings.jsx)

An `isAdmin(user)`-conditional card at the bottom of Settings. Invisible to
everyone else.

---

## The lesson that keeps repeating: gate the DESTINATION

Hiding the link in Settings is only a **suggestion**. A deep link
(`kawmhmoob://dev`) walks straight past a hidden menu item — so `/dev` and
`/spike` each wrap themselves in `AdminGate`.

This is the third time this exact shape has come up:

| Surface | The suggestion | The enforcement |
|---|---|---|
| Quizzes | QuizMenu hides locked quizzes | `quizUnlock()` guard inside QuizEngine |
| Pro content | Hub badges | `PaywallGate` around the screen |
| Dev tools | Settings card | `AdminGate` around the route |

**A menu is never a wall.** See
[2026-08-04-quiz-study-gate](2026-08-04-quiz-study-gate.md).

---

## ⚠️ This is UI hiding, NOT security

Two reasons, both worth remembering before this pattern gets reused for anything
that matters:

1. **The email list ships inside the JS bundle.** Anyone who unpacks the APK can
   read it — which also means those three addresses are in every build.
2. **`user.email` comes from the local profile row**, i.e. from the client.

That's acceptable for dev tools, because they only expose *screens* — no data, no
privileged writes. The moment an admin screen performs a privileged **action**,
the check must move server-side (a Supabase RLS policy, or an `is_admin` column on
`profiles` that policies read). A client-side check can always be bypassed.

---

## Gotcha found: `<Link asChild>` needs a PRESSABLE child

First pass used a plain `View` inside `<Link asChild>`:

```jsx
<Link href={t.href} asChild>
  <View>…</View>        {/* renders perfectly. does nothing on tap. */}
</Link>
```

`asChild` hands the press behaviour **to the child** instead of rendering its own
wrapper — so the child has to be able to receive it. A `View` accepts no press
props, so the handler silently evaporates. No error, no warning, just a dead card.

Fix: `Pressable`. (Note the rest of the codebase gets away with
`<Link asChild><Button/></Link>` because `Button` is a `Pressable` under the hood
and forwards its ref.)

---

## Spike upgrade: results render ON SCREEN

[app/spike.jsx](../app/spike.jsx) previously only `console.log`'d, which assumes
you're watching the Metro terminal — wrong assumption when the whole point is
holding a phone and talking into it. Now it renders a verdict card:

```
✅ REAL WAV
riff (bytes 0-3)     ✓ "RIFF"
wave (bytes 8-11)    ✓ "WAVE"
sample rate          ✓ 44100
bits/sample          ✓ 16
file size            ✓ 172 KB
```

Two checks added beyond the original header test:

- **bits/sample** (header offset 34) — confirms 16-bit.
- **file-size sanity.** A file can carry a perfect WAV header and still be far too
  small to be raw audio, which would mean something compressed it anyway. 2s of
  44.1 kHz 16-bit mono ≈ **176 KB**; anything under half that is flagged even when
  the header passes. *The header can be right and the file still be wrong.*

Still logs to console as well.

---

## How to run it

**Settings → 🛠️ Open dev tools → 🎙️ WAV spike → Run spike**

Two things that will otherwise waste five minutes:

- **Log in with an admin email.** As a guest you hit the lock screen — that's the
  gate working, but it doesn't look like it at 11pm.
- **Dev build required**, not web. In a browser expo-audio falls back to
  MediaRecorder and hands you webm/opus, ignoring `WAV_OPTIONS` entirely — you'd
  learn a fact about Chrome instead of about the phone.

---

## Cleanup when done

- `app/spike.jsx` — delete once the format question is settled on both platforms.
- `app/dev.jsx` — keep or delete; it's cheap and useful for the next spike.
- `AdminGate` / `admin.js` — **keep.** Reusable, and the natural home for any
  future admin surface (content editor, QA toggles). Just remember the RLS
  caveat above before it guards anything that writes.
