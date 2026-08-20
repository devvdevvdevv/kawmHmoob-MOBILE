# Concept: `accessibilityRole` + `accessibilityState`

The non-visual version of your visual cues. A sighted user learns the dropdown
expands because the chevron rotates; a screen-reader user gets nothing from a
rotated arrow. These two props say it in words instead.

## The split

- **`accessibilityRole`** — *what it is.* Without it a `Pressable` is read as plain
  text and the user never learns it's tappable.
- **`accessibilityState`** — *what condition it's in right now.*

```jsx
<Pressable
  onPress={() => setOpen((o) => !o)}
  accessibilityRole="button"
  accessibilityState={{ expanded: open }}
>
```

Announced as "Why create an account?, button, collapsed" → tap → "expanded."

## The logic is just mirroring

`expanded` is a standard key RN understands; you hand it the boolean you already
have. Because `open` is the single source of truth, the announcement can't drift
out of sync with the chevron or the `{open && ...}` body. Three things, one boolean.

## The state keys

| Key | Means | Where it fits here |
|---|---|---|
| `expanded` | collapsible is open | the guest-card dropdown |
| `disabled` | can't be used right now | Save button while `submitting` |
| `checked` | toggle/checkbox is on | a settings switch, dialect preference |
| `selected` | this is the active choice | current tab in `GlobalTabBar` |
| `busy` | working, wait | Log In button during the auth request |

Pass several at once — it's one object:

```jsx
// login button mid-request
accessibilityState={{ busy: submitting, disabled: submitting }}

// active tab
accessibilityRole="tab"
accessibilityState={{ selected: pathname === '/words' }}

// quota-locked action
accessibilityState={{ disabled: quota.exhausted }}
```

## ⚠️ These props DESCRIBE, they don't ENFORCE

`accessibilityState={{ disabled: true }}` announces "dimmed/unavailable" — it does
not block the tap. You still need the real guard in `onPress`. Same for every key.

## Why it's easy to skip

Leaving them off never crashes and never looks wrong, so it survives every round of
testing — it's only worse for people you aren't watching. Cheapest fix in the app:
two props, both from state you already have.

Related: [[collapsible-dropdown-lesson]].
