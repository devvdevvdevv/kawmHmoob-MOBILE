# Lesson: a confirm → success modal flow (log out), step by step

Goal: make "Log Out" open **"Are you sure?"**, and on confirm show **"You've logged
out"**, then leave. You'll build it yourself and understand the one non-obvious trap.

You already have both modal components — you're not building modals, you're
**sequencing** them:
- `src/components/common/ConfirmModal.jsx` — a yes/no dialog.
  Props: `visible, title, message?, confirmLabel?, cancelLabel?, destructive?, onConfirm, onCancel`.
- `src/components/common/InfoModal.jsx` — a single-notice dialog.
  Props: `visible, emoji?, title, body, primaryLabel?, onPrimary, secondaryLabel?, onSecondary?`.

Where you'll wire it: `src/components/account/ProfilePage.jsx` (the Log Out button).

---

## 0. The concept: two modals = a tiny state machine

You have three moments: nothing open → confirm open → success open. That's ONE piece
of state with three values, not two separate booleans. An enum is clearer than two
booleans because the states are **mutually exclusive** — you can never be in "confirm"
AND "success" at once, and a single variable makes that impossible by construction.

```js
const [step, setStep] = useState(null)   // null | 'confirm' | 'success'
```

- Button tapped → `setStep('confirm')`
- Cancel → `setStep(null)`
- Confirm → `setStep('success')`
- Success dismissed → do the logout + leave

A modal is "open" when `step` equals its value: `visible={step === 'confirm'}`.

---

## 1. ⚠️ The trap you must design around (read before coding)

**Logging out UNMOUNTS this screen.** `ProfilePage` starts with
`if (user.isGuest) return <GuestView/>`. The moment you call `logout()`, `user`
becomes a guest → the component re-renders into the guest branch → **everything in the
logged-in branch disappears, including your success modal.** So if you log out *first*
and then try to show "You've logged out," the modal never appears — it was unmounted
in the same instant.

**The fix is ordering:** show the success modal *while still logged in*, and perform
the actual `logout()` + navigation **when the user dismisses the success modal** (the
very last step, on the way out). The success message appears a beat before the real
logout — which reads perfectly fine and is standard UX.

This is the whole lesson, really: **sequence side-effects so a modal isn't killed by
the thing it's announcing.**

---

## 2. Build it — the steps

### 2a. Add the state
At the top of `ProfilePage`, next to the other hooks:
```js
const [step, setStep] = useState(null)
```
(You already have `logout` from `useAuth()` and `router` from `useRouter()`.)

### 2b. Point the Log Out button at the confirm step
Change the button's `onPress` from doing the logout directly to just opening the
confirm:
```jsx
<Button onPress={() => setStep('confirm')} variant="danger">Log Out</Button>
```
Notice: the button no longer calls `logout()` — it only sets state. The logout moves
to the very end (2e).

### 2c. The confirm modal
Render it near the bottom of the logged-in JSX (before the closing tag). It's open
only when `step === 'confirm'`:
```jsx
<ConfirmModal
  visible={step === 'confirm'}
  title="Log out?"
  message="You can log back in anytime. Your progress is saved to your account."
  confirmLabel="Log out"
  cancelLabel="Cancel"
  destructive          // makes the confirm button red — a "leaving" action
  onCancel={() => setStep(null)}
  onConfirm={() => setStep('success')}
/>
```
Read the two handlers: Cancel closes everything (`null`); Confirm **advances** to the
success step. Confirm does NOT log out yet — that's the trap from §1.

### 2d. The success modal
Right after it:
```jsx
<InfoModal
  visible={step === 'success'}
  emoji="👋"
  title="Logged out"
  body="You've been signed out. Nyob zoo — see you next time!"
  primaryLabel="Done"
  onPrimary={handleLogout}
/>
```

### 2e. The one handler that does the real work
Define it above the return:
```js
const handleLogout = () => {
  setStep(null)     // close the modal first
  logout()          // now unmount is fine — we're leaving anyway
  router.replace('/')   // replace, not push, so Back doesn't return to the account
}
```
`router.replace` (not `push`) so a logged-out user can't hit Back into the account
screen — the account page shouldn't be in history after signing out.

---

## 3. Trace the flow (make sure you follow it)

1. Tap **Log Out** → `step='confirm'` → confirm modal shows.
2. **Cancel** → `step=null` → nothing shows. (Try this first — the escape hatch.)
3. **Log out** (confirm) → `step='success'` → success modal shows. *Still logged in.*
4. **Done** → `handleLogout`: close modal → `logout()` → `router.replace('/')`.
   The account screen unmounts, but the modal is already closed and we're navigating
   away, so there's nothing to "kill."

---

## 4. Checklist

- [ ] `step` state added (`null | 'confirm' | 'success'`).
- [ ] Log Out button only does `setStep('confirm')` — no direct logout.
- [ ] ConfirmModal wired: Cancel → `null`, Confirm → `'success'`.
- [ ] InfoModal wired: `onPrimary` → the handler.
- [ ] `handleLogout` does close → `logout()` → `router.replace('/')`, in that order.
- [ ] Test the Cancel path AND the full path on the device.

## 5. Gotchas recap
- **Order of side-effects** — logout LAST, or the success modal unmounts before it
  shows (§1). This is the thing to remember.
- **`replace` vs `push`** — replace so Back doesn't re-open a stale account screen.
- **Buttons must be static-styled** — you're reusing ConfirmModal/InfoModal, which are
  already correct; just don't reintroduce `style={({pressed})=>...}` (see
  [[nativewind-function-style-invisible]]).

## 6. Level-up ideas (later)
- Reuse this exact `step` pattern for other destructive confirms (delete account).
- Extract a tiny `useConfirmFlow()` hook if you find yourself repeating it.
