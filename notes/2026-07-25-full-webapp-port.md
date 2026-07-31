# Porting the rest of the web app into React Native (2026-07-25)

Follows the nav/shell rework in `notes/2026-07-23-tab-navigation-fix.md`. That
turn fixed the shell (global persistent nav + page background). This one filled
in the **missing pages** and made spacing consistent app-wide.

> For a meticulous, line-by-line walkthrough of the global tab bar + shell (how
> the persistent nav, active-tab highlighting, and per-screen spacing actually
> work), see **`notes/2026-07-25-global-tab-architecture.md`**.

## Pages added (were missing or stubbed)

| Route | File | Notes |
|---|---|---|
| `/learn/:unitId` | `app/learn/[unitId]/index.jsx` | Unit overview + progress + Start/Continue. New shared `src/components/learn/LessonCard.jsx` (also now used by the Learn tab). |
| `/words`, `/words/session`, `/words/sentences` | `app/words/…` | Words hub, spaced-rep session, SentenceBuilder. |
| `/onboarding` | `app/onboarding.jsx` | First-run flow. |
| `/speak` (real) | `app/(tabs)/speak.jsx` | Replaced the placeholder stub with the full phrase/word-family hub. |
| `/speak/:phraseId` | `app/speak/[phraseId].jsx` | Phrase practice. |
| `/speak/family/:familyId` | `app/speak/family/[familyId].jsx` | Word-family practice. |
| `/leaderboard` | `app/leaderboard.jsx` | Season/week board (synthetic rivals). |
| `/pass` | `app/pass.jsx` | Season pass: level track + reward tiers (horizontal ScrollView). |
| `/contact` | `app/contact.jsx` | Email via `Linking.openURL('mailto:')`. |
| `/tone-eval` | `app/tone-eval.jsx` | Honest placeholder (see below). |

New shared components: `learn/LessonCard.jsx`, `speak/PronounceStep.jsx`,
`common/BetaRibbon.jsx`. New data/lib copied verbatim from web (all pure, no
imports): `data/reference.js`, `data/leaderboard.js`, `data/battlepass.js`,
`lib/leveling.js` (plus `data/speak.js`, `data/wordFamilies.js`, `lib/access.js`,
`lib/daily.js` which were already present).

## Where RN forced a divergence from the web

Three web features lean on browser-only APIs or an engine RN doesn't have yet.
Rather than fake them, each is honest about what it does:

1. **Speak pronunciation (`PronounceStep`)** — the web version records your voice
   and scores pitch vs a native take (MediaRecorder + pitch detection). No
   drop-in RN equivalent; needs a native audio-record module + on-device pitch
   tracker. The RN `PronounceStep` is simplified: **play the native recording +
   "Mark practiced."** A note + the Speak hub's BetaRibbon say scoring is unbuilt.

2. **ToneEval (`/tone-eval`)** — was a web-only QA harness (AudioContext decode →
   YIN pitch → tone score). Ported as a placeholder that explains it runs on the
   web build only. It's a dev tool, not a user feature.

3. **Leaderboard / BattlePass points** — the web reads `seasonPoints`,
   `weekEarned`, `clipsContributed`, `awardPoints` from a season/leveling engine
   that RN's `ProgressContext` doesn't have (RN tracks a simpler `xp`). Rebuilding
   that engine would touch the working progress core, so both screens **use `xp`
   as the season score** and default the week/clips fields to 0. The rival data
   is synthetic anyway, so the boards render sensibly. If the full points engine
   is ever ported into `ProgressContext`, swap `xp` back for `seasonPoints`.

## Consistent spacing: every screen now uses `TabScreen`

The detail screens (`account`, `settings`, `search`, `review`, `notebook`,
`alphabet`, `course`, `quiz`, `vocabulary/*`, `login`, `register`) previously
rendered a **bare `<View>`** — no scroll, no safe-area, and (after the global nav
landed) no clearance for the floating bar. They're all wrapped in `<TabScreen>`
now, at the route-file level for the thin re-exports (account, quiz, vocabulary,
login, register) and by swapping the outer `<View>` for the inline screens. So
one wrapper supplies: SafeArea top + vertical scroll + `px-5/py-6` rhythm +
bottom padding that clears the nav (`TAB_BAR_HEIGHT` + safe-area inset). This is
the same shell the web `<main>` provided.

`src/components/ui/Button.jsx` is now `forwardRef` so `<Link asChild><Button/></Link>`
(expo-router) stops warning "Function components cannot be given refs."

## react-native-web preview caveat (unchanged from 07-23)

Web screenshots (`npx expo start` → Chrome headless) still show horizontal
cropping on narrow widths — a react-native-web ScrollView/flex artifact, not a
device bug. Yoga lays these out correctly on a real phone. Verified visually on
web that background/spacing/nav are right; **a device/Expo Go pass is still the
real confirmation**, especially for the Speak audio and the horizontal pass track.

## How to verify

```bash
npx expo start --port 8210
# web/ios/android bundles → 200:
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://localhost:8210/node_modules/expo-router/entry.bundle?platform=web&dev=true"
# every route → 200 (see the route list checked this turn):
for r in / /learn /learn/foundations /speak /speak/speak-nyob-zoo /words \
  /words/session /words/sentences /vocabulary /vocabulary/animals /reference \
  /onboarding /leaderboard /pass /contact /tone-eval /account /quiz /notebook/saved \
  /settings /search /review /alphabet/consonants /course/grammar /login; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8210$r"); echo "$r $code"; done
```

Last verified 2026-07-25: web bundle 200 with **no app/src resolution errors**;
all routes above 200; iOS + Android bundles 200 (checked before the TabScreen
wrapping, which only added an import + wrapper each). Device pass still pending.

## Watch out

- Metro dev-server restarts pile up node processes on Windows and eventually
  thrash the machine ("fork: Resource temporarily unavailable"). Kill stale
  `expo/metro` node procs before starting a fresh one; run ONE server.
- Don't run `npm audit fix --force` (see `notes/2026-07-22-boot-fix.md`).
