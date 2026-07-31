# Web-parity features: confetti, guest banner, footer (2026-07-25)

A pass to close remaining feature gaps between the RN app and the web repo
(`KawmHmoob/Hmong-Language-App`), after the shell / design-system / data work.

## How the gap was found

Diffed the component trees (`src/components` web vs RN). Components in the web
but missing from RN:

```
AccountGate, Confetti, ConfirmModal, DialectSelect, LetterGrid, LevelMeter,
PrimaryNav, ToneCurve, ToneRows, WarningRibbon, icons/index
```

Triaged:
- **Ported this pass:** `Confetti` (see below). `GuestBanner` + `Footer` already
  existed in RN but were never rendered (only the commented-out `Layout.jsx`
  referenced them) — now wired in.
- **Not applicable / intentionally skipped:**
  - `LetterGrid` / `ToneRows` — inlined directly in the lesson player and the
    alphabet screen already.
  - `PrimaryNav` — replaced by `GlobalTabBar`; `icons/index` — RN uses emoji.
  - `LevelMeter` / `ToneCurve` — mic pitch-scoring visuals; no native pipeline
    (same reason PronounceStep is simplified).
  - `AccountGate` — guest gating is OFF even in the web (`GUEST_GATING_ENABLED =
    false` in `access.js`), so it's a no-op; skip until gating is turned on.
  - `ConfirmModal` — RN uses the native `Alert.alert` (already in Notebook).
  - `DialectSelect` — Settings already uses the RN `Picker` for dialect.
  - `WarningRibbon` — RN has `BetaRibbon`, used on Speak/ToneEval.

## 1. Confetti (`src/components/common/Confetti.jsx`)

The web fires a one-shot confetti burst on a **perfect quiz score**
(`QuizResults`, `accuracy === 100 && !reviewing`). The web version is pure CSS
keyframes; RN has no CSS animation, so this is a **React Native `Animated`**
port:

- N pieces (default 40), each an `Animated.View` with its own `Animated.Value`
  driven `0→1` over a randomized duration/delay (`useNativeDriver: true`).
- Interpolations: `translateY` from `-20` to `windowHeight + 20` (fall),
  `translateX` sideways drift, `rotate` spin, `opacity` fade near the end.
- Palette colors (clay/seafoam/blush/cream), matching the web piece colors.
- `pointerEvents="none"` absolute overlay so it never blocks the buttons; the
  whole thing self-removes (`setDone(true)`) once the longest piece finishes.

Wired in `QuizResults`: `const perfect = accuracy === 100 && questions.length >
0 && !reviewing`, then `{perfect && <Confetti />}` plus a "Perfect score! 🎉"
emerald banner — same trigger and copy as the web.

(RN note: the web also honors `prefers-reduced-motion` by rendering nothing.
That's not wired here; add an `AccessibilityInfo.isReduceMotionEnabled()` guard
if reduced-motion support is wanted.)

## 2. GuestBanner (rendered on Home)

`src/components/account/GuestBanner.jsx` existed but nothing rendered it. The web
shows it app-wide (in `Layout`, for guests). On mobile a persistent app-wide
strip eats scarce vertical space and would complicate the absolute-header
clearance math, so the RN mirror renders it **at the top of Home** (still the
first thing a guest sees). Restyled from a full-width `border-b` strip to a
rounded card so it sits nicely inside the padded content. Shows only when
`user.isGuest`; links to Log in / Create account.

## 3. Footer (rendered on Home)

`src/components/Footer.jsx` existed but was unrendered. Added `<Footer />` at the
bottom of the Home screen (the web renders it after every page's content; on
mobile, once at the bottom of Home is the sensible mirror). Brand + Explore /
Resources link columns + year.

## Watch out (the `Link` + `style`-array crash)

While building the header this session, a `style={[a, cond && b]}` array passed
through `<Link asChild>` crashed react-native-web
(*"Failed to set an indexed property [0] on CSSStyleDeclaration"*). GuestBanner
and Footer use the SAFE pattern — `<Link asChild><Pressable className="…">` — so
they render fine (Home shows no red screen). Keep to that pattern; see
`notes/2026-07-25-global-tab-architecture.md` §7.

## Verify

```bash
npx expo start --port 8218
# bundle 200, no Confetti/Guest/Footer resolution errors
# Home renders the guest banner (as a guest) + footer; no red error screen.
# Confetti: score 100% on any quiz → burst + "Perfect score! 🎉".
```

Last verified 2026-07-25: web bundle 200; `/`, `/quiz`, `/quiz/vocab-animals`
all 200; Home screenshot shows the guest banner. Confetti verified by code +
clean bundle (a real 100% run is the device check). Device/Expo Go pass still
recommended.
