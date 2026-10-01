// Daily free-tier limits, per feature, as a LADDER:
//   guest  → smallest (a taste)      → incentive: create an account
//   free   → larger daily allowance  → incentive: go Pro
//   pro    → unlimited (quota disabled)
//
// One place to tune every number. Pro is handled by `enabled: !isPro` on the hook,
// so it isn't listed here.

// ⚠️ MOSTLY 5 A DAY — raised from 2 on 2026-09-22. The ladder is still
// deliberately FLAT: guest and free get the same number.
//
// Two features sit off that number, each with its reason on its own line below:
// the sentence builder at 7 and vocabulary at 3.
//
// It used to climb: guest 1 → free 3 → Pro unlimited, so the guest number was
// selling the account and the free number was selling Pro. One number does both
// jobs now, and the trade is worth naming: signing up no longer buys a bigger
// allowance, so the only thing left selling registration is progress that
// survives a reinstall. If sign-ups fall, this table is the first place to look.
//
// ⚠️ THE VOCABULARY EXCEPTION BELOW IS NOW INVERTED — it was the generous one at
// 3 when everything else was 2, and this change left it the STRICTEST number in
// the table. Its reasoning (browsing is not an exercise, so it needs the larger
// allowance) argues for raising it too; it was left at 3 because the ask was
// "2 → 5" and 3 was never a 2. Raise it to 5 or more to restore the intent.
export const QUOTA_LIMITS = {
  speak:            { guest: 5, free: 5 },
  quiz:             { guest: 5, free: 5 },
  reading:          { guest: 5, free: 5 },
  // ⚠️ SEVEN, NOT FIVE — raised 2026-09-23, one day after everything went 2 → 5.
  // A sentence-builder round is the shortest exercise in the app (one scramble,
  // a few taps), so five of them is a couple of minutes, where five quizzes or
  // five stories is a sitting. The cap should meter TIME, not rounds.
  'sentence-builder': { guest: 7, free: 7 },
  // ⚠️ ITS OWN BUDGET, NOT SHARED WITH THE SENTENCE BUILDER — the open question
  // in notes/2026-09-16-writing-unit-and-challenge-todo.md ("do new challenge
  // types share one budget or get their own?"), answered on 2026-09-20 with the
  // first one built. Separate, because the two drills teach different things
  // and a shared budget would mean doing one costs you the other — a learner
  // who spells five words would find the sentence builder locked, which reads
  // as a bug rather than as a limit. Tightening is easy later; taking away an
  // allowance someone already had is not.
  typing:           { guest: 5, free: 5 },
  'search-hear':    { guest: 5, free: 5 },
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
