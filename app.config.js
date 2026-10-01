// App variants — lets the DEV build sit alongside the PRODUCTION build on one phone.
//
// THE PROBLEM THIS SOLVES:
// Android identifies an app by its package name. app.json declares
// `com.kawmhmoob.app` for every build, so installing a dev client over the Play
// Store version fails with INSTALL_FAILED_UPDATE_INCOMPATIBLE (different signing
// keys) — or replaces it. You cannot have both.
//
// Giving the dev build its OWN package makes Android treat it as a separate app:
// two icons, two data stores, neither aware of the other.
//
// HOW IT WORKS:
// Expo prefers app.config.js over app.json when both exist. This file READS
// app.json and returns it unchanged unless APP_VARIANT === 'development'. So
// production output is byte-identical to before — the variant is opt-in via an
// env var that only the development EAS profile sets.
//
//   eas build --profile development --platform android   → com.kawmhmoob.app.dev
//   eas build --profile production  --platform android   → com.kawmhmoob.app
//
// Local runs: `APP_VARIANT=development npx expo start`
//
// ⚠️ A different package means a SEPARATE app identity:
//   - Separate AsyncStorage → you will be signed out, progress starts fresh.
//     (Supabase data is server-side and keyed by user, so logging in restores it.)
//   - RevenueCat treats it as a different app. The dev profile already uses a
//     test key, so this is what you want.
//   - Any OAuth redirect or deep link bound to the package needs the .dev
//     variant registered too. Email/password auth is unaffected.

const base = require('./app.json')

const IS_DEV = process.env.APP_VARIANT === 'development'

module.exports = () => {
  const expo = { ...base.expo }

  if (IS_DEV) {
    expo.name = 'KawmHmong (dev)'      // distinguishable on the home screen
    expo.slug = base.expo.slug          // slug must NOT change — it identifies
                                        // the EAS project, not the installed app
    expo.android = { ...expo.android, package: 'com.kawmhmoob.app.dev' }
    expo.ios = { ...expo.ios, bundleIdentifier: 'com.kawmhmoob.app.dev' }
  }

  return expo
}
