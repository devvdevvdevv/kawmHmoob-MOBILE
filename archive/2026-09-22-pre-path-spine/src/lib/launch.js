// Launch flags — flip these ON as features become ready for later updates.
//
// v1 Play Store release: the app ships FREE with no real Google Play Billing.
// Each flag is a single switch to reverse when ready.
//
// (The original note here said Speak scoring "isn't built yet" — that was true
// until 2026-08-18/20. It is built and verified on device now.)

// true (2026-08-24) → Speak is LIVE. Recording works on iOS and Android, the
//         pitch pipeline is built and self-tested, and the Conversations
//         lessons are wired.
//         ⚠️ Lesson CONTENT is placeholder Hmong with no audio yet — see
//         src/data/speakLessons.js. Flip back to false if that ships to users.
export const SPEAK_ENABLED = true

// true (2026-09-12) → monetization is LIVE. Flipped for the first Play release.
//
// WHAT THIS SWITCH ACTUALLY DOES, in one place, because it is easy to think it
// only shows a paywall:
//   • `isPro` stops being hardcoded true and starts coming from RevenueCat
//     (SubscriptionContext step 4). EVERY lock in the app derives from it.
//   • the daily quota ladder activates — guest 1 / free 3 / Pro unlimited, per
//     feature, from src/lib/quotaLimits.js.
//   • the paywall and upgrade UI appear (ProfilePage, QuotaWall, locked cards).
//
// WHAT IS FREE, and it is derived rather than listed: any speak CATEGORY with
// `free: true` (today: cat-greetings, 3 lessons), the tones group, and any
// reading GENRE with `free: true` (today: 'life'). Everything else needs Pro.
//
// ⚠️ THE ENTITLEMENT STRING HAS TO MATCH EXACTLY. SubscriptionContext checks
// `info.entitlements.active["KawmHmoob Pro"]`. If the RevenueCat dashboard
// spells it differently — a space, a case, a typo — a user pays, the purchase
// succeeds, and they stay locked out. That failure is silent and it is the worst
// one on this list, because the money moves and the access does not.
//
// ⚠️ AN EMPTY OFFERING IS A DEAD END. With no active offering in RevenueCat the
// paywall renders "No plans available right now." — a locked app with nowhere to
// pay. Verify the offering is live BEFORE shipping this build, not after.
//
// ⚠️ iOS IS NOT READY. EXPO_PUBLIC_RC_API_KEY_IOS is still unset; only the
// Android `goog_` key is configured (eas.json, production profile). This flag is
// safe for Play and NOT safe for an App Store build.
//
// TO REVERSE: set this to false. Everyone becomes Pro again and every wall
// disappears — no data migration, no refunds needed on the app side.
export const MONETIZATION_ENABLED = true
