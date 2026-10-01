# A nav guard for the tab bar, and the reading tile unlocked (2026-09-15)

Two changes. The first is new; the second **reverses** what
[2026-09-12-sentence-builder-scoring-and-words-hub] decided, because the data it
was reasoning about has since changed.

---

## 1. Tab presses no longer yank you out of a story

**Reported as:** "I keep pressing the home icons accidentally, and it switches so
I have to reopen a story."

### Why the reader could not fix this itself

`GlobalTabBar` is rendered **once**, by `app/_layout.jsx`, and floats over every
screen. It is not a child of the reader. It calls `router.navigate()` straight
from `onPress`, so by the time the reader could know anything happened,
expo-router has already swapped the route and the story is gone.

The reader already guarded the Android hardware back button — and the comment on
that listener names this exact hole:

> ⚠️ ANDROID HARDWARE BACK AND THE BACK GESTURE ONLY. This does not intercept
> the breadcrumb links or the tab bar — those are ordinary `<Link>`s and would
> each need their own guard.

New `src/context/NavGuardContext.jsx` is that guard, done once centrally rather
than per link.

### The shape

```
reader     useNavGuard()                                ← arms on mount, disarms on unmount
tab bar    requestNavigation(() => router.navigate(to)) ← asks before going
```

An unguarded screen navigates exactly as before: no dialog, no extra render.

| file | change |
|---|---|
| `src/context/NavGuardContext.jsx` | new — provider, `useNavGuard`, `useRequestNavigation`, `NavGuardHost` |
| `src/components/GlobalTabBar.jsx` | `onPress` routes through `requestNavigation` |
| `src/components/common/LeaveReadingModal.jsx` | optional copy props, all defaulting to the existing story wording |
| `app/_layout.jsx` | provider above `ThemedShell`, host beside `QuizSettingsHost` |
| `app/reading/story/[storyId]/index.jsx` | arms the guard |

### ⚠️ ONLY the tab bar is guarded, deliberately

The reader's own back control and "Take the quiz" call the router directly and
are untouched. Those are deliberate presses; the tab bar is the one caught with
the side of a thumb. A guard on **every** route change would make leaving the
reader a two-tap chore in exactly the cases you meant to leave.

### ⚠️ It prompts even when the Words tab is already lit

`/reading` is matched to the Words tab (see `SECTIONS` in `GlobalTabBar`), so
Words looks active while you read — but pressing it still navigates to the hub
and loses the story. Skipping the prompt for the "active" tab would skip it for
the exact accident being prevented.

### ⚠️ It reuses LeaveReadingModal, NOT ConfirmModal — and that was a correction

The first pass used `ConfirmModal`. Then `LeaveReadingModal`'s own header:

> ⚠️ NOT AN RN `<Modal>` … a Modal's buttons render under the system nav bar on
> this build, and themed NativeWind classes resolve to TRANSPARENT inside one.

`ConfirmModal` **is** an RN `<Modal>`. That pass would have shipped an "are you
sure?" whose buttons cannot be pressed — strictly worse than no guard. Reusing
`LeaveReadingModal` also means the tab-bar prompt and the hardware-back prompt
are the same dialog with the same words, which is what they should be: one
question, one answer, one look.

> **Read the component you are about to reuse, not just its props.** The
> constraint that ruled out the obvious choice was written at the top of the
> file that solved it, three lines long, and nowhere else.

### Two bugs the implementation avoids on purpose

**Token-matched disarm.** React does not promise that an outgoing screen's
effect cleanup runs before an incoming screen's effect. An unconditional
`guardRef.current = null` in cleanup can therefore wipe the guard the **incoming**
screen just armed, leaving it silently unprotected — a guard that is simply
absent, with nothing to see. Each arming carries a fresh object token and
cleanup only clears its own.

**The pending callback is read out before `setPending(null)`, not run inside the
updater.** A side effect inside a state updater is double-invoked in
development, which would fire the navigation twice.

Also: the guard is armed with `enabled: readingAStory`, false for both early
returns ("Story not found", quota wall). The **hook call** stays unconditional —
the rule those early returns already live under — while the **guard** is
conditional. "Your place is saved" over an error message is both a lie and a
nuisance.

### ⚠️ Not verified on a device

The dialog painting above the tab bar is what root-mounting is for, but that is
the kind of thing only a real screen settles. Also still unguarded: the story
**quiz** screen, and the breadcrumb links the original comment mentions.

---

## 2. The reading tile is open to everyone again

`app/words/index.jsx` — the `isAdmin(user)` gate added on 09-12 is gone; the
`useAuth`/`isAdmin` imports are commented out in place with a pointer.

**The 09-12 reasoning was "this is a doorway into mostly-unfinished content."
That is no longer true.** Checked against the live data rather than assumed —
block comments stripped first, since the unfinished stories are *inside* one and
naive grepping counts them:

```
LIVE story ids:        3   (ntxawm-lub-xauv, tus-miv-tus-nas, zong-vang)
LIVE placeholder:true: 0
GENRES:                4   life, horror, folk, history — ALL free: true
```

So the library now exports three finished stories, none flagged placeholder, in
four genres that are all open to a signed-out guest. A doorway into finished,
free content needs no gate.

The old reasoning is kept in the comment at the tile, because it records what to
**re-check** if placeholder stories are ever exported again.

> **A gate justified by a data condition has to be re-checked when the data
> moves.** Nothing links the two: the gate was code in one file, the condition
> was content in another, and the only thing that would ever have connected them
> is someone remembering. The comment at the tile is that thread.

### ⚠️ Still true: this was only ever the doorway

Per `AdminGate.jsx`'s own rule — *guard the destination, not the doorway* — the
`/reading` routes never had a gate, and Home, `GlobalSearch` and onboarding's
`WelcomeTour` all still link into them. That mattered while the tile was hidden
(the lock was partial); now that the module is open to everyone it is moot. It
becomes live again the moment anything in reading needs restricting.

Related: [2026-09-12-sentence-builder-scoring-and-words-hub],
[2026-09-12-reader-on-device-crash-and-bookmark],
[2026-09-13-reading-library-cut-to-two],
[2026-08-10-dev-tools-route-and-admin-gate].
