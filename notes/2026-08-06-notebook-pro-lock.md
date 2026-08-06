# Notebook = Pro-only hard lock (2026-08-06)

Saving words and keeping notes is a full Pro feature (not a daily quota). Gated at
both surfaces that write to `NotebookContext`.

## Gated surfaces

- **Whole Notebook screen** — `app/notebook/[tab].jsx` body wrapped in
  `<PaywallGate tier="pro" contentLabel="Your notebook is part of Kawm Hmoob Pro">`.
  Non-Pro sees the upgrade card → `/paywall`. Header/title stay visible.
- **"+ Save" on a word** — `src/components/vocabulary/WordDetail.jsx`. Reads
  `isPro`; non-Pro shows **◆ Save** and tapping routes to `/paywall` instead of
  calling `saveWord`.

## Why UI-level, not context-level

Enforced in the components (the standard `PaywallGate`/`isPro` pattern), NOT inside
`NotebookContext`, because Notebook and Subscription are sibling providers — reading
`useSubscription` inside `NotebookProvider` would couple provider order. Both checks
use `isPro`, so the ProfilePage dev override (Force Free/Pro) flips them live.

Related: gating strategy in [2026-08-06-paywall-screen-and-entry-points] and the
free-tier daily quotas in [2026-08-06-daily-quota-and-signifier].
