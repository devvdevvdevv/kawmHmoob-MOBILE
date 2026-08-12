// Launch flags — flip these ON as features become ready for later updates.
//
// v1 Play Store release: Speak's pronunciation scoring isn't built yet, and there's
// no real Google Play Billing set up. So for v1 the app ships FREE with Speak behind
// a "coming soon" screen. Each flag is a single switch to reverse when ready.

// false → the whole Speak section shows a "coming soon" screen (hub + drills).
//         Flip to true once recording + tone scoring work.
export const SPEAK_ENABLED = false

// false → monetization is OFF: everyone is treated as Pro (everything unlocked, all
//         daily quotas disabled, NO "Go Pro" walls), and the paywall/upgrade UI is
//         hidden. Flip to true only AFTER real Play products + the production goog_
//         RevenueCat key are set up (see the RevenueCat guide §8).
export const MONETIZATION_ENABLED = false
