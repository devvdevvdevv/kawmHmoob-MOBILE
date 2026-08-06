# Fresh-clone dependency setup (2026-08-06)

Notes on what a fresh `git clone` of this repo needs to become runnable, and why
the dependency setup is shaped the way it is. Verified on Node v22.19.0 / npm 11.6.0.

## TL;DR — from clone to running

```powershell
npm install                       # installs + runs patch-package postinstall
cp .env.example .env.local        # fill in the two EXPO_PUBLIC_SUPABASE_* keys
npm run web                       # or: npm start (dev client / Expo Go)
```

`npm install` completed clean: 873 packages, patch applied, no blocking errors.
`npx expo install --check` → **"Dependencies are up to date"** (everything matches
Expo SDK 54's expected versions — no drift).

## The four pieces of dependency logic (why it's set up this way)

1. **`.npmrc` → `legacy-peer-deps=true`.** React 19 + RN 0.81 produce ERESOLVE
   peer-dependency conflicts on a plain install (the classic SDK 51→54 fallout —
   see [2026-08-03-sdk-51-to-54-migration.md]). This flag is what lets `npm install`
   succeed at all. Do NOT delete it.

2. **`postinstall: patch-package`.** Every install re-applies
   `patches/react-native-css-interop+0.2.6.patch` (a NativeWind runtime fix). If it
   ever prints anything other than `react-native-css-interop@0.2.6 ✔`, the patch
   drifted against an upgraded version — regenerate it, don't ignore it.

3. **`metro.config.js` stubs `@opentelemetry/api`.** supabase-js optionally
   `import()`s it for tracing and swallows the failure at runtime, but Metro
   resolves imports statically, so the missing optional dep would break the bundle.
   The resolver returns `{ type: 'empty' }` for it. Not a dependency to install — a
   deliberate stub.

4. **Pure JS/JSX project.** 138 `.js`/`.jsx` files, 0 `.ts`/`.tsx`, no `tsconfig`.
   The `@types/react` devDep and `nativewind-env.d.ts` are only for editor
   IntelliSense — there is no TypeScript build step to worry about.

## `npm audit`: 17 vulns (15 moderate, 2 high) — expected, do NOT "fix"

All 17 trace to one root: `xcode` → `uuid@7`, pulled in transitively by Expo's own
build tooling (`@expo/config-plugins`, `@expo/prebuild-config`, `expo-dev-client`,
`expo-constants`…). Key facts:

- These are **build-time CLI tools**, not code shipped in the app bundle.
- **Never run `npm audit fix --force`** — it downgrades/replaces core Expo packages
  and breaks the SDK 54 setup. Let Expo clear these in a future SDK bump.

## Still required before the app is fully functional

- **`.env.local`** with `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
  App still boots without them, but Supabase auth/data calls fail at runtime.
- For **native-module work** (RevenueCat, audio) you need a dev build, not Expo Go —
  see [2026-08-04-eas-development-build-setup.md] and the RevenueCat guide.
