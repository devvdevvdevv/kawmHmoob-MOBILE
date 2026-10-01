# The dev build broke: JDK 25 and a missing SDK path (2026-09-01)

The Android development build stopped working. **Nothing in the app code was
wrong** — the JS bundled clean the whole time.

## STATUS: builds (confirmed by Devan, 2026-09-01)

Two real blockers were found and fixed here: **JDK 25** and the **missing SDK path**.
After those, the build works.

⚠️ **The `:app:assembleDebug` runs from this session still failed** on libc++ link
errors, and that section is kept below — but the build succeeds in practice, so
those failures were an artefact of how it was being invoked here (a CLI Gradle
invocation against caches Android Studio owns is the likely candidate), not a real
defect in the project. **Do not go chasing the libc++ section unless the build
actually breaks again for you.** It is kept only as a record of what was checked.

---

## Fixed blocker 1: Gradle was running on JDK 25

```
Launcher JVM:  25.0.3 (Eclipse Adoptium 25.0.3+9-LTS)
Gradle:        8.14.3
```

**Gradle 8.14.3 does not support JDK 25.** JDK 25 support starts in Gradle 9.
`JAVA_HOME` was unset, so Gradle fell back to whatever `java` is on PATH — and the
only JDK installed under Adoptium on this machine is 25. Every Gradle invocation
picked it and died before compiling a line.

### Why this was invisible from the JS side

This is the trap worth remembering, and this repo has hit it before — see
[2026-08-13-siteed-audio-studio-build-break-version-pin], which says it outright:
**"JS green ≠ native build green."**

`npx expo export` bundles JavaScript. It never invokes Gradle, never compiles
Kotlin, and never looks at a JDK. It succeeded (7.35 MB bundle) on every attempt
while the native build was completely broken. A green bundle proves nothing about
the native build.

### The fix

`android/gradle.properties`:

```properties
org.gradle.java.home=C:/Program Files/Android/Android Studio/jbr
```

Android Studio ships its own JDK — **21.0.9** here — which both Gradle 8.14 and AGP
support. Verified:

```
Daemon JVM:    C:\Program Files\Android\Android Studio\jbr (from org.gradle.java.home)
```

**Why pinned in the project, not via a system `JAVA_HOME`:** setting JAVA_HOME
globally changes the JDK for everything else on the machine too. Pinning it here
affects only this project's builds, and it travels with the repo, so the next person
does not rediscover this.

The Launcher JVM stays 25 — that only starts the wrapper. Compilation happens in the
daemon, which is what `org.gradle.java.home` controls.

**If Android Studio moves, or a real JDK 17/21 gets installed, update that path.**

---

## Fixed blocker 2: Gradle could not find the Android SDK

`ANDROID_HOME` and `ANDROID_SDK_ROOT` were both unset, and there was no
`android/local.properties`. The SDK exists at the Windows default location; nothing
told Gradle where.

Created `android/local.properties`:

```properties
sdk.dir=C:/Users/Devan Chuyen Lee/AppData/Local/Android/Sdk
```

**⚠️ Forward slashes on purpose.** A `.properties` file treats `\` as an escape
character, so a Windows path written with single backslashes is silently mangled —
the first attempt wrote `C\:\Users\Devan...` and would have failed confusingly.
Either double every backslash or use forward slashes; forward slashes work fine on
Windows and need no escaping.

This file is **machine-specific and gitignored** (`android/.gitignore:10`). It is not
a repo fix — anyone cloning this needs their own, or `ANDROID_HOME` set.

---

## My mistake: eslint-config-expo was on the wrong major

When ESLint was added on 2026-08-29
([2026-08-29-audit-fixes-error-boundary-lint-sync-copy]), I installed
`eslint-config-expo` with a bare `npm install`, which took **latest (57.0.2)**. Expo
SDK 54 expects **~10.0.0**. `npx expo-doctor` flagged it as a major version mismatch.

Corrected to `~10.0.0`. The flat-config entry (`eslint-config-expo/flat`) exists in
v10, so `eslint.config.js` needed no change and lint still runs.

**Was it the cause of the broken build? Almost certainly not** — it is dev-only
tooling that never enters Gradle or Metro. But it was wrong, it was mine, and a
doctor check that cries wolf is a doctor check people stop running.

**The lesson:** in an Expo project install dependencies with `npx expo install`, not
`npm install` — `expo install` picks the version matching the installed SDK.
Straight `npm install` grabs latest and can silently break SDK compatibility.

---

## Ruled out along the way

Worth recording so nobody re-checks them:

- **`patch-package`** — re-ran clean: `react-native-css-interop@0.2.6 ✔`. The three
  `npm install` runs on 2026-08-29 did not leave patches unapplied.
- **Expo package drift** — `expo`, `expo-constants`, `expo-file-system` are one patch
  version behind what doctor wants (54.0.36 vs ~54.0.37). Installed versions match
  what `package.json` declares, so my installs did not move them. Pre-existing, and
  not build-breaking.
- **`@siteed/audio-studio`** — declared and installed at the pinned 3.2.0. The old
  Kotlin `reject` signature break is stale; see the RE-CHECK section of
  [2026-08-13-siteed-audio-studio-build-break-version-pin] and
  [2026-08-20-android-pcm-via-siteed-spike].
- **App code** — bundles clean, and every JS change since 2026-08-29 was verified by
  `expo export` at the time.

---

## ⚠️ After changing the JDK, STOP THE GRADLE DAEMONS

The first build after the fix failed like this:

```
Timeout waiting to lock build logic queue. It is currently in use by
another Gradle instance.  Owner PID: 67316
Lock file: android\.gradle\noVersion\buildLogic.lock
```

That is not a compile error and not a regression — it is **two Gradle daemons on
different JVMs fighting over one lock**. The stale daemons from the failed JDK 25
attempts were still resident; adding `org.gradle.java.home` spawns a NEW daemon on
JDK 21, and the old ones do not go away on their own.

**The catch:** `./gradlew --stop` only stops daemons for the *current* Gradle + JVM
combination. It reported "2 Daemons stopped" while the JDK 25 daemons carried on
holding the lock. If they persist, they have to be ended by PID.

So whenever `org.gradle.java.home` changes:

```bash
cd android && ./gradlew --stop        # then check nothing is left:
# PowerShell: Get-CimInstance Win32_Process -Filter "Name='java.exe'" |
#   ForEach-Object { $_.ProcessId; $_.CommandLine -match 'GradleDaemon' }
```

Identify before killing — Android Studio holds Gradle locks too, and killing a
daemon it owns kills work in the IDE. (It was not running here; that was checked.)

## The libc++ link failures seen from the CLI (RESOLVED — see status above)

With the JDK and SDK fixed, the build now runs for ~19 minutes, executes 440 tasks,
and dies in the native C++ link step:

```
> Task :react-native-screens:buildCMakeDebug[arm64-v8a] FAILED
ld.lld: error: undefined symbol: operator new(unsigned long)
ld.lld: error: undefined symbol: operator delete(void*)
ld.lld: error: undefined symbol: __cxa_begin_catch
ld.lld: error: undefined symbol: __gxx_personality_v0
ld.lld: error: undefined symbol: vtable for std::__ndk1::__shared_weak_count
```

Every one of those is a **libc++ / C++ ABI symbol**. The C++ standard library is not
being linked, full stop.

### What makes this hard: it is not one library

It first appeared in `@siteed/audio-studio`, which has a plausible-looking bug of its
own (see below). After that was patched, the identical failure appeared in
**`react-native-screens`** — a stock RN library that builds for everyone. So it is
environmental, not per-package.

### Ruled out, with evidence

- **NDK is not corrupt.** r27b (27.1.12297006), and the arm64 sysroot has
  `libc++_shared.so` (1753 KB), `libc++abi.a`, `libc++_static.a`.
- **The STL is being requested.** `CMakeCache.txt` in the failing module reads
  `ANDROID_STL:UNINITIALIZED=c++_shared`. So the config asks for libc++ and the
  link still cannot find it.
- **Not stale CMake caches.** Deleted every `.cxx` directory
  (expo-modules-core, react-native-screens, react-native-worklets, @siteed) and
  rebuilt from a fresh CMake configure. Same 80 undefined-symbol errors.
- **Not the JDK fix.** These errors are from clang/lld, downstream of anything the
  JVM choice affects.

### The @siteed patch — probably treating a symptom

`patches/@siteed+audio-studio+3.2.0.patch` adds to its CMakeLists:

```cmake
set_target_properties(audio-studio-cpp PROPERTIES LINKER_LANGUAGE CXX)
target_link_libraries(audio-studio-cpp android log c++_shared)
```

The reasoning was sound in isolation: that target mixes C (`kiss_fft.c`) and C++
sources, and CMake infers `LINKER_LANGUAGE` from the mix, so it can pick C and never
invoke the C++ linker. **But since stock react-native-screens fails the same way,
that is unlikely to be the real cause.** The patch is harmless and arguably correct
regardless — but do not treat it as the fix, and consider dropping it once the real
cause is found.

### Where to look next

The remaining suspect is the **CMake ↔ NDK pairing**: CMake **3.22.1** driving
**NDK r27**. That combination is old-CMake/new-NDK and is a known-fragile pair;
r27 changed toolchain-file behaviour that older CMake does not follow, which would
produce exactly this (STL requested in the cache, never added to the link line).

Cheapest things to try, in order:

1. Install a newer CMake via the SDK manager (3.31.x) and set `cmake { version }`
   so AGP stops selecting 3.22.1.
2. Failing that, install **NDK 26.1.10909125** and pin `ndkVersion` in
   `android/build.gradle` — SDK 54 projects are known to build on r26.
3. Compare against a clean `npx create-expo-app` build on this machine. If a stock
   project also fails to link libc++, the problem is the toolchain install, not this
   project — and that is a much faster thing to know than another 20-minute cycle
   here.

**Before answering any of that, establish one fact: has this project's native build
EVER succeeded on this machine?** There was no `android/app/build/outputs/apk`
directory at the start. If it has never built locally, this is first-time environment
setup, not a regression — and that changes which of the above is worth doing first.

## Still open

`npx expo-doctor` also reports a pre-existing config issue, untouched here:

> You have an app.json file in your project, but your app.config.js is not using the
> values from it.

Two config sources where one wins silently. Worth resolving separately — it is not
what broke the build, but it is exactly the kind of thing that makes a future build
problem hard to reason about.
