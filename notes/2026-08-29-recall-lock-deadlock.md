# The recall lock was a deadlock

**2026-08-29** · `src/components/speak/LessonSteps.jsx` → `RecallStep`

> "Even if a user hears the answer, do not lock the say it permanently, I only
> wanted it so that it doesn't accidentally record the play back."

A two-term boolean where **both terms were latched**, guarding the only action
that could have cleared either one.

---

## The bug

```js
const [heardAnswer, setHeardAnswer] = useState(false)
const recordLocked = heardAnswer && !uri
```

Read as English: *"locked if they heard the answer and have not recorded."*
Sounds conditional. It is not.

| term | can it change back? |
|---|---|
| `heardAnswer` | **No.** Set `true` by the answer's `onPlay`. Nothing ever sets it `false`. |
| `!uri` | **No.** `uri` is set only by finishing a recording — and recording is what `recordLocked` disables. |

So the exit condition was reachable **only from inside the locked state**, through
the one door the lock was holding shut. Playing the answer before recording
killed that step's Record button permanently. The only escape was leaving the
lesson.

> ⚠️ **A latched boolean guarding the sole action that could clear it is not a
> lock — it is a deadlock.** The test: from inside the locked state, is there any
> sequence of available inputs that exits it? Here there was none, and the code
> read as though there were.

---

## Why it was written that way

The rule in the header comment was **pedagogical**:

> *"HEARING THE ANSWER ENDS THE RECALL. Once the learner plays the native clip,
> recording is locked — anything said after that is imitation, not retrieval."*

That is a defensible teaching position. It is also not what was wanted. The
actual requirement was **mechanical**: don't let the microphone record the
loudspeaker.

The two framings produce very different code:

| framing | what it tracks | lifetime |
|---|---|---|
| pedagogy — "hearing ends the recall" | *did an event ever happen* | permanent, latched |
| mechanics — "don't record the speaker" | *is sound playing right now* | transient, self-clearing |

A rule about **history** latches. A rule about **current state** cannot. Getting
the framing wrong produced a deadlock from a requirement that could never have
caused one.

---

## The fix

```js
const { playing: soundingId } = useAudio()

// `playing`    = the learner's own take, from useRecorder
// `soundingId` = whatever the shared player has going; this step's when ids match
const audioSounding = playing || soundingId === step.id
```

Recording is disabled only while sound is actually leaving the speaker, and
re-enables the instant it stops. Nothing latches, so nothing can wedge.

`heardAnswer` and the `onPlay` that fed it are gone — nothing else used them.

### The copy was lying too

On-screen text promised the old behaviour, so it had to move with the logic:

| | before | after |
|---|---|---|
| reveal subtitle | "recording locks after this" | "you can still record afterwards" |
| while blocked | "you heard the answer — recording is off for this one" | "paused while audio plays — so the mic doesn't catch it" |

**Copy is part of the behaviour.** Fixing the condition and leaving the sentence
would have left the app telling users something false about itself.

---

## ⚠️ A mistake I made fixing it

The edit script used `s.split(needle).join(replacement)` — replace **all**
occurrences. The anchor was:

```js
const { compare, stop: stopAb, running: abRunning, nowPlaying } = useAbCompare()
```

which appears in **both** `SayStep` and `RecallStep`. So `SayStep` silently
gained a `soundingId` it never asked for and never used.

Caught by reading the verification output instead of skimming it — the grep
showed the declaration at line 113 *and* 389 when only one was intended.

> **`split().join()` is replace-all.** When an anchor is a common line — a hook
> call, an import, a closing tag — assert the expected occurrence count before
> writing, or target by index. "It compiled" would not have caught this; only
> counting did.

---

## Still open, deliberately

**`SayStep` has the same mic-capture exposure.** It also pairs a Record button
with a native-clip `AudioButton`, so recording there while the clip plays
captures it too.

Left alone on purpose: it has never had a lock, and adding one is a behaviour
change that was not requested. The exposure is real but pre-existing; this note
is the record that it was seen and deferred, not missed.

---

## Verification

- `scripts/check-undefined-refs.mjs` — 181 files, 0 undefined references
- Exactly one `soundingId` declaration remains, in `RecallStep`
- Babel parse OK

**Not verified on a device.** The deadlock's whole signature was that it looked
fine until you hit the exact order — reveal, play, then try to record. Walk that
sequence.

---

## Exercises

### 1. Reproduce the deadlock
Restore `const recordLocked = heardAnswer && !uri` and its `disabled` term. On a
recall card: reveal, play the answer, then try to record.

*Nothing is greyed out unexpectedly, nothing errors. Now find your way out
without leaving the lesson. That is what "permanently" meant.*

### 2. Write the general test
For each boolean gate in `LessonSteps.jsx`, answer: *from inside the blocked
state, what input clears it — and is that input still available?*

*`abRunning` clears on its own timer. `status === 'denied'` clears only in the
OS settings app — is that a deadlock, or legitimately terminal? What is the
difference?*

### 3. Reproduce my split() mistake
Take a line that appears in two components. Run
`s.split(line).join(line + '\nconsole.log(1)')`.

*Count the occurrences before and after. Then write the guard that would have
stopped it.*

### 4. Judgement (no code)
`SayStep` can record its own playback today.

*Is that worth fixing? A take with the native clip bleeding into it scores
against audio it already contains — which inflates the score. Does that change
your answer, given no lesson shows a score yet?*
