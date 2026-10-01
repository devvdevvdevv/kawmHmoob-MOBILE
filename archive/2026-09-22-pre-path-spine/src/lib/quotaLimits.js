// Daily free-tier limits, per feature, as a LADDER:
//   guest  → smallest (a taste)      → incentive: create an account
//   free   → larger daily allowance  → incentive: go Pro
//   pro    → unlimited (quota disabled)
//
// One place to tune every number. Pro is handled by `enabled: !isPro` on the hook,
// so it isn't listed here.

// ⚠️ EVERYTHING IS 2 A DAY — 2026-09-12, and the ladder is deliberately FLAT.
//
// It used to climb: guest 1 → free 3 → Pro unlimited, so the guest number was
// selling the account and the free number was selling Pro. One number does both
// jobs now, and the trade is worth naming: signing up no longer buys a bigger
// allowance, so the only thing left selling registration is progress that
// survives a reinstall. If sign-ups fall, this table is the first place to look.
export const QUOTA_LIMITS = {
  speak:            { guest: 2, free: 2 },
  quiz:             { guest: 2, free: 2 },
  reading:          { guest: 2, free: 2 },
  'sentence-builder': { guest: 2, free: 2 },
  // ⚠️ ITS OWN BUDGET, NOT SHARED WITH THE SENTENCE BUILDER — the open question
  // in notes/2026-09-16-writing-unit-and-challenge-todo.md ("do new challenge
  // types share one budget or get their own?"), answered on 2026-09-20 with the
  // first one built. Separate, because the two drills teach different things
  // and a shared budget would mean doing one costs you the other — a learner
  // who spells five words would find the sentence builder locked, which reads
  // as a bug rather than as a limit. Tightening is easy later; taking away an
  // allowance someone already had is not.
  typing:           { guest: 2, free: 2 },
  'search-hear':    { guest: 2, free: 2 },
  // ⚠️ THREE, NOT TWO — the one deliberate exception. Vocabulary is BROWSING,
  // not an exercise: it is where someone looks something up mid-lesson, and two
  // lookups a day would make the rest of the app harder to use rather than
  // making Pro more attractive. Counted per CATEGORY opened, not per word — see
  // app/vocabulary/[categoryId]/index.jsx for why that distinction matters.
  vocabulary:       { guest: 3, free: 3 },
}

// ─────────────────────────────────────────────────────────────────────────────
// TRIAL CAPS — once ever, not per day. Used with useTrialCap, not useDailyQuota.
//
// ⚠️ THESE DO NOT RESET. Set 2026-09-12, when the free tier moved from "a few a
// day" to "a taste, then pay" for everything except Speak. The reason is the
// size of the catalogue: with six recorded lessons and ten stories, a daily
// allowance is functionally unlimited — a patient free user finishes the whole
// app in a fortnight and never meets a reason to subscribe.
//
// ⚠️ GUESTS AND ACCOUNTS GET THE SAME NUMBER HERE, deliberately. The daily
// ladder uses a smaller guest number to sell signing up; these sell PRO, and
// splitting them would mean someone who registers gets a second free story —
// which reads as a bug the moment anyone notices.
//
// What is deliberately NOT here: Speak (still a daily allowance — it is the
// flagship and the thing people come back for), the alphabet/consonants, the
// tones, the Learn module, and anything marked `free: true` in the data.
// ⚠️ NOT IN USE — set and then retired the same day (2026-09-12). Kept, with
// src/hooks/useTrialCap.js, because the argument for it has not gone away: a
// once-ever cap converts better than a daily one while the catalogue is small.
// It was reverted because a daily allowance is the gentler thing to launch with
// and can be tightened later without taking something back from anyone.
//
// TO RESTORE: swap useDailyQuota → useTrialCap and quotaLimit → trialLimit at
// the call sites, and pass kind="trial" to QuotaWall so the copy stops saying
// "daily".
// export const TRIAL_LIMITS = {
//   quiz: 3,
//   reading: 1,
//   'sentence-builder': 2,
// }
//
// export function trialLimit(feature) {
//   return TRIAL_LIMITS[feature] ?? 0
// }

// Pick the limit for the current user. Guests get the smaller number.
export function quotaLimit(feature, isGuest) {
  const f = QUOTA_LIMITS[feature]
  if (!f) return 0
  return isGuest ? f.guest : f.free
}
