// Daily free-tier limits, per feature, as a LADDER:
//   guest  → smallest (a taste)      → incentive: create an account
//   free   → larger daily allowance  → incentive: go Pro
//   pro    → unlimited (quota disabled)
//
// One place to tune every number. Pro is handled by `enabled: !isPro` on the hook,
// so it isn't listed here.

export const QUOTA_LIMITS = {
  speak:            { guest: 1, free: 3 },
  quiz:             { guest: 1, free: 3 },
  reading:          { guest: 1, free: 2 },
  'sentence-builder': { guest: 1, free: 3 },
  'search-hear':    { guest: 1, free: 3 },
}

// Pick the limit for the current user. Guests get the smaller number.
export function quotaLimit(feature, isGuest) {
  const f = QUOTA_LIMITS[feature]
  if (!f) return 0
  return isGuest ? f.guest : f.free
}
