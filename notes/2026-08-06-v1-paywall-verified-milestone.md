# Milestone: paywall verified on device, v1.0.0 shaping up (2026-08-06)

RevenueCat is working end-to-end on the dev build. The full chain is proven:
RC dashboard (default offering, `KawmHmoob Pro` entitlement, 3 products) →
`Purchases.getOfferings()` → the custom paywall screen renders all three plans
(Monthly / Yearly / Lifetime) with live localized prices.

- Tested on the Android **dev build** (`npx expo start --dev-client`, LAN). Expo Go
  can't run it — `react-native-purchases` is native.
- Ignore the console warning `failed to fetch ui_config before getOffering;
  proceeding without it` — that's RevenueCat's HOSTED Paywalls UI config, which we
  don't use (we render our own PlanRow UI). Offerings still load. Non-fatal.
- Modal buttons bug fixed the same session (horizontal ScrollView → one-slide
  layout) — see [2026-08-06-header-page-info-button].

Status per the author: UI is "amateur but I like it," **v1.0.0 looking very good**.

## Where v1.0.0 stands

Working: paywall + entitlement flip, Speak module UI (tones condensed & free),
notebook Pro lock, subscription manage + dev override + account binding, header
page-info modals, Speak daily quota (guest/free ladder) enforced.

Still open before a real store launch (unchanged from the running TODO):
- Quota enforcement on quiz + search-hear (reading/sentence-builder are placeholders;
  wire when built) — see [2026-08-06-daily-quota-and-signifier] and the
  `learning/quota-enforcement-guide.md`.
- Real Terms/Privacy URLs in `paywall.jsx` (placeholders today).
- Store setup + production AAB for REAL purchases (Test Store validated code only).
- Speak content: record the conversational phrase sets → build toward ~50 lessons
  (the actual product value).
- Optional: real swipe on the info modal via gesture-handler —
  `learning/modal-swipe-gesture-guide.md`.
