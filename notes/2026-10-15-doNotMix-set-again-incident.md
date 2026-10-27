# Incident: `doNotMix` set a second time, during an outage (2026-10-15)

**What happened:** the author reported audio dying — first A/B compare and "play
mine", then *"I can't hear anything from anything"*. While diagnosing, Claude set
`PLAYBACK_INTERRUPTION_MODE` to `'doNotMix'`. That is the value that had already
been tried on 2026-10-14 and **killed audio completely, from the first press.**
It was reverted to `'mixWithOthers'` in the same session, about ten minutes later,
once `notes/2026-10-14-audio-fixed-interruption-mode.md` was finally read.

⚠️ **The silence was already happening before the flip** — it is not the cause of
the outage the author reported. But it was the known-bad configuration, set
during an outage, which is the worst possible time to introduce a second
variable.

## Why it happened, which is the part worth keeping

There were **three records of this decision and they disagreed**, and the
freshest, most authoritative one was the one not read:

| where | what it said | status |
|---|---|---|
| `app/_layout.jsx` comment | argued FOR `'doNotMix'` — "exclusive focus is right for a language app" | ⚠️ written DURING the failed attempt; its conclusion was overturned the same day but the comment stayed |
| `src/lib/audioOwner.js` comment | set `'mixWithOthers'`, said `doNotMix` may be denied | correct, but hedged — "MAY be causing exactly that" |
| `notes/2026-10-14-audio-fixed-interruption-mode.md` | the device log, the reverted attempt, and **"confirmed working on a device"** | the actual answer — **not read until after the mistake** |

The failure was procedural, not technical:

1. **A superseded comment was left in place.** `_layout.jsx` kept arguing for a
   value that had been tested and rejected. A comment that outlives its finding
   is worse than no comment: it is evidence pointing the wrong way. Now
   corrected in place, naming the note that overrules it.
2. **The hedged comment read as an open question.** `audioOwner.js` said
   `'doNotMix'` *"MAY be causing exactly that"` — so the two comments looked like
   an unresolved argument, which is what Claude reported it as. It was not
   unresolved; it was settled on a device and written up in a note titled *"The
   audio actually plays — what fixed it"*.
3. **The notes index was not consulted before changing audio.** It is generated
   (`node scripts/build-notes-index.mjs`) and lists that note under 2026-10-14,
   one line above the ones that were read.

## Fixes applied

- `src/lib/audioOwner.js` — the constant is `'mixWithOthers'` again, now with a
  **"DO NOT SET THIS TO `doNotMix`"** block naming both attempts, both dates, and
  the log signature (`state=ready → state=idle`, clock frozen at 0.00).
- `app/_layout.jsx` — the paragraph arguing for `'doNotMix'` is replaced by the
  correction and a pointer to the 10-14 note. It says explicitly that the comment
  outlived the finding, so nobody restores it.

## The rule this earns

**Before changing anything in the audio stack, read the newest note whose title
claims it works.** `notes/README.md` is generated and sorted newest-first for
exactly this. A code comment is a record of what someone believed when they typed
it; the dated note is the record of what the device said afterwards.

Corollary, and it applies beyond audio: **when a finding overturns a comment,
edit the comment in the same pass.** Both outages trace to a paragraph that was
true for one afternoon.

## ⚠️ Still open: the outage itself is NOT explained

The author's silence report stands, and the interruption mode is not the cause:

- A/B compare and "play mine" went silent first. Both play a `file://` recording
  and both run immediately after a recording, when the session has been in
  capture mode (`doNotMix`, `allowsRecording: true`) and then restored.
- Then nothing played at all, including after a restart.

### ⚠️ THE LEAD SUSPECT, FOUND BY READING: two failure paths never mark the player broken

The author, after a reboot: *"i just rebooted the app and it worked"* — and a restart
fixing it rules the interruption mode OUT (a bad mode fails identically on every launch)
and a **runtime state wedge IN**.

`release()` keeps the single long-lived player for reuse **unless `playerBroken` is set**,
in which case it tears it down so the next press builds a fresh one. The 10-14 note states
the intent as *"Reuse normally, hard reset after a failure."* Three failure paths exist and
only one does it:

| path in `useAudio.js` | sets `playerBroken`? | consequence |
|---|---|---|
| duration watchdog (`watchdog-after-duration`) | ✅ yes | fresh player next press |
| **ceiling watchdog** (`release('watchdog')`, clip never started) | ❌ **no** | the player that just failed is PAUSED AND REUSED |
| **`catch` → `release('play-failed')`** | ❌ **no** | same |

So a clip that dies on the 15-second ceiling path, or one that throws, leaves the app
reusing the exact player that just failed — **every press afterwards fails, and only a
restart clears it.** That is the reported symptom, mechanism and all.

**The fix is two lines** (`playerBroken = true` before each of those two `release()`
calls). Cost: one extra player construction after a failure, which `stats.created` will
show. ⚠️ NOT APPLIED — audio is not being touched again without the author's go-ahead,
for the reason this whole note exists.

What to look at next, in order (all three are in §2, §3 and §5 of the 10-14 note):

1. **The single reused player.** `useAudio` now keeps ONE player for the app's
   lifetime and calls `replace()` + `seekTo(0)`. If it stops rendering, every
   press afterwards fails; the `playerBroken` reset is supposed to catch that.
   `stats.created` should be 1 and `reused` should carry the count.
2. **The recorders' restore path**, since the first thing to break was take
   playback. Their record-mode call deliberately uses `doNotMix`, so a restore
   that does not land leaves the session in the denied-focus state — the same
   silence, from the other direction.
3. **The session re-assert**, which runs from either watchdog and before the next
   press. If it re-asserts while a clip is mid-flight, that is a new interaction
   that did not exist on 10-14.

The log in §5 separates these in one press: `reason=watchdog` with
`state=ready → idle` is the session; `created` climbing is the player; no `▶` at
all is the press never reaching the player.
