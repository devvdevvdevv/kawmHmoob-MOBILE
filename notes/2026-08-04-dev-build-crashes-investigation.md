# 2026-08-04 — First dev-build run: page crashes + drawer bug (investigation)

Context: the SDK 51→54 migration (see 2026-08-03 note) was validated only by
`expo export` + `expo-doctor` — **never run on a device**. This is the first real
device run, so the "still to do: device smoke test" items are surfacing as real
bugs.

## Symptoms reported
1. **Some screens crash on open.** The 5 bottom-tab destinations work:
   Home `/`, Learn `/learn`, Speak `/speak`, Words `/words`, Reference
   `/reference`. Navigating to non-tab screens (e.g. `/quiz`, `/account`)
   crashes.
2. **Drawer won't stay open** — tapping the hamburger opens it, then it
   instantly closes; its links are unreachable.

## What I ruled OUT (via static analysis)
- **Route grouping is NOT the split.** `/words` = `app/words/index.jsx` is a
  ROOT route (not in `app/(tabs)/`) and it *works*. So "(tabs) vs root" is not
  the cause — the working set is exactly the 5 tab-bar destinations, which just
  happen to be the only screens reachable while the drawer is broken.
- **OnboardingGate** — inert here (returns early for guests). Not the cause of
  these two symptoms. (I did still harden it — see below.)
- **`@react-navigation/native`** — the only file importing it (`BottomNav.jsx`)
  is not rendered anywhere, so its hooks never run.
- **Audio (expo-audio migration)** — `useAudio` only calls `createAudioPlayer`
  inside `play()` (on press), guarded; Speak working confirms audio is fine.
- **Reanimated** — not imported anywhere in `src`/`app`.
- **react-native-svg** — used by GlobalHeader/GlobalTabBar, which render fine.

## Fix already applied
`app/_layout.jsx` `OnboardingGate`: guarded the `router.replace` behind
`useRootNavigationState()` so it never navigates before the root navigator is
mounted (the canonical expo-router fix for "navigate before mounting Root
Layout"). Correct regardless, but NOT the cause of the two symptoms above.

## Leading hypotheses (need the runtime error to confirm)
- The crashes are **runtime/native errors per screen** — the migrated native
  graph (New Arch, RN 0.81, screens 4, reanimated 4/worklets) throwing on
  specific screens. The code is statically consistent, so the message is
  required to localize it. Candidate: a native module used by crashing screens
  but not the tab screens (e.g. `Picker` on `/account` → `@react-native-picker`
  not linked?) — but that can't be the *single* cause since `/quiz` doesn't use
  Picker. May be multiple independent crashes all surfacing at once.
- **Drawer**: opens then instantly closes = `open` state flips back to false.
  Suspects: a double-fire of `toggle()`, a re-mount of `DrawerProvider`
  resetting state, or an overlay (WelcomeTour) intercepting. Needs a device
  observation (does the panel visibly slide in then out, or never appear?).

## ✅ ROOT CAUSE FOUND (from the device stack trace)

The error text — "Couldn't find a navigation context. Have you wrapped your app
with 'NavigationContainer'?" — is a **red herring**. The real stack:

```
SafeAreaView has been deprecated ...
printUpgradeWarning (react-native-css-interop/.../render-component.js)
  → stringify(originalProps) → NavigationStateContext.getKey  → THROWS
Tabs (src/components/Tabs.jsx) → Reference (app/(tabs)/reference.jsx)
```

**Cause: `nativewind@4.1.23` bundles `react-native-css-interop@0.1.22`, which is
NOT New-Architecture safe (RN 0.81 / React 19 / Fabric).** css-interop's DEV-only
`printUpgradeWarning` (fires when a component's className toggles between having
and not-having an `active:`/`:active` pseudo-class between renders — i.e. our
active/inactive tab + link styles) calls `JSON.stringify(originalProps)`. When
the component is a `<Link asChild>` child (Tabs, Breadcrumbs, QuizMenu, ProfilePage),
originalProps carries a navigation object whose `getKey` getter throws → crash.

This is why:
- Only screens using `<Link asChild><Pressable className="… active:…">` crash
  (quiz via Breadcrumbs/QuizMenu, reference via Tabs, account via ProfilePage).
- The plain tab screens survive.
- The drawer flashes then vanishes: opening it renders className-styled Pressables,
  the warning path throws, and the error boundary unmounts the shell overlay.

The 2026-08-03 migration note assumed "nativewind 4.1.23 — already compatible."
That was the miss: NativeWind isn't a native module, so `expo-doctor` and
`expo export` both passed and never exercised this DEV render path.

## THE FIX: upgrade NativeWind
`nativewind 4.1.23 → 4.2.6` (pulls `react-native-css-interop 0.1.22 → 0.2.6`, the
New-Arch rewrite that fixed this). No metro/babel/tailwind config changes needed
(`withNativeWind(config, {input:'./global.css'})` + the babel preset are unchanged
between 4.1 and 4.2).

Steps (MUST stop Metro + pause OneDrive first — see migration note's EPERM/lock
gotcha):
1. Stop the dev server, pause OneDrive sync.
2. `npm install nativewind@4.2.6` (`.npmrc legacy-peer-deps=true` already set).
3. `npx expo start --dev-client -c` (clear Metro cache).
4. Re-test `/quiz`, `/reference`, `/account`, and the drawer.

Not a code fix — no app source changes required. If the drawer still misbehaves
after the upgrade, THEN it's a separate issue (revisit the open/close state).

## UPDATE — the upgrade fixed the DRAWER but NOT the screens

After `nativewind@4.2.6` / `css-interop@0.2.6`: the drawer works, but `/quiz`,
`/reference`, `/account` still threw the SAME "navigation context" error. Reading
the 0.2.6 source showed the crash path is UNCHANGED — `printUpgradeWarning` still
calls `stringify(originalProps)`, and `stringify` still walks props with
`Object.entries(value)` (`render-component.js`), which **invokes getters**. No
guard for a getter that throws.

Why drawer vs screens differ (the proof):
- **Drawer** buttons use `onPress={go()}` — a plain function (skipped by
  stringify). No navigation object in props → warning prints, no crash.
- **Screens** use `<Link asChild><Pressable className="… active:…">` — expo-router
  injects a navigation object whose `getKey` getter throws when read outside a
  navigator → `Object.entries` invokes it → crash.

`<Link asChild>` is used 61× across 33 files (incl. working tab screens), so
`asChild` alone isn't the trigger — it's `asChild` + a className that toggles a
pseudo-class (`active:`) between renders (which is what fires the upgrade
warning). Refactoring app code is therefore both huge AND wrong — the defect is
in css-interop.

## ✅ ACTUAL FIX (applied) — two iterations

**Attempt 1 (insufficient):** guarded `stringify()` with `Object.keys` + try/catch.
This stopped the THROW, but the warning then serialized + `console.log`ed a
multi-MB object (the props reach into React element internals / the navigation
state), which **froze the JS thread** — the crash became a freeze (reference →
vowels/tones/grammar/search hung the app). Note: reference uses `<Tabs>` in
CONTROLLED mode (`active`/`onChange`), so the trigger is purely the className
pseudo-class toggle on tab change — NOT `<Link asChild>` specifically. The
navigation getter is reached by stringify walking the child element's fiber.

**Attempt 2 (the real fix):** patched `printUpgradeWarning()` in the same file to
log ONLY the static warning text — removed the `stringify(originalProps)` dump
entirely. It's a dev-only warning about a View→Pressable upgrade (className
toggling a pseudo-class like `active:` between renders); the text is signal
enough. This kills BOTH the crash and the freeze, no app-code change, keeps every
`<Link asChild>`. (The guarded `stringify` from attempt 1 is now dead code but
left in as defense-in-depth.)

Residual: css-interop still remounts the component on the View→Pressable upgrade
(minor; a tab may remount when toggled). Not a freeze. If it causes visible
flicker later, fix by keeping a pseudo-class present in BOTH active/inactive
className branches so the upgrade happens on initial render.

### Make it durable — ✅ DONE (2026-08-05, via patch-package)
The edit was inside node_modules (lost on `npm install`). Now persisted:
1. `npm i -D patch-package` ✓
2. `"postinstall": "patch-package"` added to package.json scripts ✓ (auto-reapplies
   the patch after every install)
3. `npx patch-package react-native-css-interop --exclude '\.cache'` ✓ →
   `patches/react-native-css-interop+0.2.6.patch` (+24/-4, ONLY render-component.js).

⚠️ The `--exclude '\.cache'` matters: css-interop generates transient `.cache/*`
build artifacts, and a plain `patch-package` run swept ~1835 lines of those into
the patch. Regenerated with the exclude so the patch touches ONLY
`dist/runtime/native/render-component.js`. If you ever re-create this patch, keep
that exclude.

Verified: `npx patch-package` (what postinstall runs) applies it cleanly (✔).
Commit `patches/` to git so teammates/CI get the fix. Still worth reporting
upstream to nativewind/react-native-css-interop.

### To load the fix now
Metro caches transformed node_modules, so restart with a clean cache:
`npx expo start --dev-client -c`, then re-test `/quiz`, `/reference`, `/account`.
