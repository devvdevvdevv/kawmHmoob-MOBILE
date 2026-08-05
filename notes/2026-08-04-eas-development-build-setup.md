# EAS development build for `react-native-purchases` (2026-08-04)

Context: adding RevenueCat (`react-native-purchases`) means adding a **native
module**, which does not run in Expo Go. From here on the app needs a
**development build**. This note records what a dev build actually is, what was
set up, what's still manual, and the traps found in this repo specifically.

Companion doc: `learning/revenuecat-integration-guide.md` (§0 is the "no Expo Go"
warning; this note is the concrete execution of it).

---

## 1. Why Expo Go stops working (the actual reason)

Expo Go is a **pre-built app** shipped by Expo, containing a fixed set of native
modules compiled in. Your JS is downloaded into it at runtime. That's why it's
instant — nothing is compiled on your machine.

The consequence: **you can only use native modules Expo Go was built with.**
`react-native-purchases` contains Java/Kotlin + Obj-C/Swift that must be compiled
INTO the app binary. No amount of JS can add it to an app that already shipped.
`import Purchases from 'react-native-purchases'` in Expo Go throws at runtime
(the native module is undefined) — it is not a bug to debug, it's a hard limit.

A **development build** is your own Expo Go: the same dev experience (hot reload,
`expo start`), but it's *your* binary with *your* native modules compiled in, plus
a dev launcher that connects to the Metro server. Build it once; after that, JS
changes still hot-reload normally. You only rebuild when native dependencies
change.

```
Expo Go            = Expo's binary + your JS       → fixed native modules
Development build  = YOUR binary  + your JS        → your native modules
Production build   = YOUR binary  + bundled JS     → no Metro connection
```

---

## 2. What was set up (2026-08-04)

### `expo-dev-client` — installed

```bash
npx expo install expo-dev-client
```

This is the **dev launcher** — the in-app screen that lets the binary connect to a
Metro server, switch dev servers, and open the dev menu. A build without it is
just a plain app that loads its own embedded bundle; it cannot attach to
`expo start`. `developmentClient: true` in `eas.json` (below) expects this package
to be present.

### `eas.json` — created

`--profile development` reads its config from `eas.json`. The file did not exist,
so the flag had no profile to resolve — that alone fails the build.

```json
{
  "cli": { "version": ">= 16.0.0", "appVersionSource": "remote" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview":    { "distribution": "internal", "android": { "buildType": "apk" } },
    "production": { "autoIncrement": true }
  },
  "submit": { "production": {} }
}
```

The three flags that matter in `development`:

| Flag | Why |
|---|---|
| `developmentClient: true` | Makes it a **dev** build — includes the dev launcher so it can connect to Metro. Without it you get a standalone app with a frozen bundle. |
| `distribution: "internal"` | Produces an **install link / QR** for sideloading to your own devices, instead of an artifact destined for the store. |
| `android.buildType: "apk"` | **The Android-specific trap.** EAS defaults Android to **AAB**, which is a *Play Store upload format that cannot be installed on a device*. You'd get a successful build and then be unable to install it. APK is directly sideloadable. |

---

## 3. Still manual (interactive — needs an account)

```bash
npm install -g eas-cli     # was NOT installed — `npx eas --version` errored
eas login                  # Expo account
eas init                   # links project, writes extra.eas.projectId into app.json
eas build --profile development --platform android
```

`eas init` is what adds `extra.eas.projectId` to `app.json`. Builds fail without
it — the CLI has no idea which EAS project the build belongs to.

Then, once installed on the device:
```bash
npx expo start --dev-client     # NOT plain `expo start` (that targets Expo Go)
```

---

## 4. Repo-specific traps found

### `.env` is gitignored → your keys won't exist in the build

**EAS builds from your committed git state.** `.gitignore` excludes `.env`, so
`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (and the coming
`EXPO_PUBLIC_RC_ANDROID_KEY`) are simply absent on the build server.

This is worse than it sounds because `EXPO_PUBLIC_*` vars are **inlined into the
JS bundle at build time**, not read at runtime. So they don't "fail to load" —
they compile to `undefined` and bake in. Supabase and RevenueCat then silently
no-op, and the app *looks* fine until nothing authenticates.

Fix: `eas env:create` for each, or an `env: {}` block inside the `development`
profile in `eas.json`.

### Untracked files don't get uploaded

Same root cause. Both of these were untracked and must be committed:
- **`.npmrc`** (`legacy-peer-deps=true`) — without it the server-side
  `npm install` can fail on peer-dependency conflicts.
- **`android/`** — only if you choose to keep it (see §5).

### `app.json` had a `//` comment

Line 20, `// Output was originally 'Static'`. Expo's own parser tolerates it, but
it isn't valid JSON and any strict tooling will choke. Remove it.

---

## 5. The `android/` decision (open)

`npx expo prebuild` was run, so `android/` exists but is untracked. Two workflows,
pick one:

- **CNG / delete `android/`** *(recommended)* — EAS runs prebuild itself from
  `app.json`. No native folders to maintain; `react-native-purchases` is
  autolinked on the build server. The `plugins` array in `app.json` stays the
  single source of truth.
- **Commit `android/`** — you get manual control of native code, but you now own
  that folder permanently, and every `app.json` change requires a re-prebuild to
  take effect (they no longer sync automatically).

Not decided yet — left to the author.

---

## 6. The local alternative (no EAS at all)

Because `android/` already exists:

```bash
npx expo run:android
```

builds the dev client **on your machine** — no Expo account, no build queue, no
EAS env-var setup. Requires Android Studio + JDK 17 locally. This is the faster
iteration loop while wiring up RevenueCat.

Use EAS instead when you want a **shareable** build, an iOS build without a Mac,
or don't want to maintain the local native toolchain.

---

## Summary

| Item | State |
|---|---|
| `expo-dev-client` | ✅ installed |
| `eas.json` with `development` profile | ✅ created |
| `eas-cli` installed | ❌ manual (`npm i -g eas-cli`) |
| `eas login` / `eas init` (project id) | ❌ manual |
| Env vars on EAS | ❌ todo — `.env` is gitignored |
| `.npmrc` committed | ❌ todo |
| `app.json` comment removed | ❌ todo |
| `android/` keep-or-delete | ❓ undecided |

Biggest lesson: **a dev build is a binary, and the binary is built from your
committed git state** — so anything gitignored or untracked (`.env`, `.npmrc`)
quietly doesn't exist at build time. That's a different failure mode from local
dev, where those files are right there on disk.