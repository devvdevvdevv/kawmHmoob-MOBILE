// app/_layout.jsx
import { useEffect } from 'react'
import { View } from 'react-native'
import { Stack, usePathname, useRouter, useRootNavigationState } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { setAudioModeAsync } from 'expo-audio'
import { PLAYBACK_INTERRUPTION_MODE } from '../src/lib/audioOwner.js'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito'
import {
  NunitoSans_400Regular,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { AuthProvider, useAuth } from '../src/context/AuthContext.jsx'
// Drawer
import { DrawerProvider } from '../src/components/Drawer/DrawerContext.jsx'
import { SubscriptionProvider } from '../src/context/SubscriptionContext.jsx'
import { ProgressProvider } from '../src/context/ProgressContext.jsx'
import { NotebookProvider } from '../src/context/NotebookContext.jsx'
import { ThemeProvider, useTheme } from '../src/context/ThemeContext.jsx'
import { CelebrationProvider } from '../src/context/CelebrationContext.jsx'
import { THEME_VARS, THEME_BG } from '../src/lib/themes.js'
import GlobalTabBar from '../src/components/GlobalTabBar.jsx'
import GlobalHeader from '../src/components/GlobalHeader.jsx'
import DrawerHost from '../src/components/Drawer/DrawerHost.jsx'
import WelcomeTour from '../src/components/onboarding/WelcomeTour.jsx'
import CelebrationOverlay from '../src/components/common/CelebrationOverlay.jsx'
import ErrorBoundary from '../src/components/common/ErrorBoundary.jsx'
import { QuizSettingsProvider } from '../src/context/QuizSettingsContext.jsx'
import { NavGuardProvider, NavGuardHost } from '../src/context/NavGuardContext.jsx'
import { PathLockProvider, PathLockHost } from '../src/context/PathLockContext.jsx'
import QuizSettingsHost from '../src/components/quiz/QuizSettingsHost.jsx'
import * as SplashScreen from 'expo-splash-screen'
import '../global.css'

// Hold the native splash (icon on seafoam, configured in app.json) on screen from
// the instant of launch until our fonts are ready, then fade it out — so the app
// never flashes a blank or unstyled frame during startup.
SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions?.({ duration: 250, fade: true })

export default function RootLayout() {
  // Match the web app's typefaces: Nunito (headings, mapped to font-serif/
  // font-display) + Nunito Sans (body, font-sans). Render nothing until ready so
  // text doesn't flash in the system font first; never hang on a load error.
  const [fontsLoaded, fontError] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  })

  // Once fonts are in (or errored — never hang), drop the splash to reveal the app.
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync()
  }, [fontsLoaded, fontError])

  // ⚠️ THE AUDIO SESSION, SET ONCE AT STARTUP — 2026-10-07.
  //
  // THE BUG THIS FIXES: "sometimes the audio just doesn't work." Until now
  // NOTHING in the app configured the session — the only calls to
  // setAudioModeAsync lived inside the two RECORDERS. So on iOS the session
  // stayed at the OS default, which OBEYS THE HARDWARE MUTE SWITCH: a learner
  // with the ringer flicked to silent heard nothing from a flashcard, a quiz or
  // the Reference tab, while every other app (music, video) still worked and the
  // app itself showed no error — the clip "played" with the button animating and
  // no sound.
  //
  // ⚠️ AND IT FIXED ITSELF AFTER A SPEAK LESSON, which is what made it look
  // random rather than broken: the recorders set `playsInSilentMode: true` and
  // leave it set, so recording once repaired playback for the rest of the
  // session. Same device, same clip, different outcome depending on whether you
  // had visited Speak — the shape of every "sometimes" report.
  //
  // `playsInSilentMode` is the whole point: this is a LANGUAGE app, where the
  // audio IS the content. A muted ringer is not a request for a silent lesson.
  // The other two are stated rather than left to the default so the session
  // starts in the same shape the recorders restore it to (see the finally blocks
  // in usePcmRecorder.js / usePronunciation.js) — one definition of "ready to
  // play", not two.
  useEffect(() => {
    setAudioModeAsync({
      // ⚠️ THE FIELD THAT WAS MISSING, AND THE REASON ANDROID WAS SILENT —
      // 2026-10-14. expo-audio's AudioMode requires `interruptionMode`, and its
      // own docs say 'mixWithOthers' means "On Android, NO AUDIO FOCUS IS
      // REQUESTED". Leaving it out let the session sit in that state: the player
      // reported playing=true with a real duration, the position never moved,
      // didJustFinish never fired, and nothing came out of the speaker. That is
      // precisely what the device log showed.
      //
      // ⚠️ THE PARAGRAPH THAT USED TO BE HERE WAS WRONG, AND IT COST TWO
      // OUTAGES — corrected 2026-10-15. It argued for 'doNotMix' ("exclusive
      // focus is right for a language app, where the clip IS the content"). The
      // reasoning is appealing and the device says no: 'doNotMix' REQUESTS
      // exclusive focus, Android DENIES it, and a denied request leaves nothing
      // to play into — audio died completely, from the first press, both times
      // it was set. The log is in notes/2026-10-14-audio-fixed-interruption-mode.md
      // §1 (`state=ready → state=idle`, clock frozen at 0.00).
      //
      // It was tried on 2026-10-14 and reverted; then on 2026-10-15 Claude set
      // it again, on the strength of THIS COMMENT, while the author was
      // reporting silence — because the comment outlived the finding that
      // overturned it. Hence this replacement rather than a deletion.
      //
      // The working value is 'mixWithOthers', confirmed on a device across the
      // tones and the consonants. See PLAYBACK_INTERRUPTION_MODE in
      // src/lib/audioOwner.js, which is the one place it is decided.
      //
      // ⚠️ playsInSilentMode AND allowsRecording ARE iOS-ONLY (the types say
      // @platform ios), so before this line the whole call was a no-op on
      // Android apart from earpiece routing.
      interruptionMode: PLAYBACK_INTERRUPTION_MODE,
      playsInSilentMode: true,
      allowsRecording: false,
      shouldRouteThroughEarpiece: false,
    }).then(() => {
      // The startup line notes/2026-09-30-internal-testing-bugs-*.md asks for:
      // when audio misbehaves, the first question is whether the session was
      // ever configured, and the only honest answer is a log from the device.
      console.log('[audio] session ready — playsInSilentMode=true, allowsRecording=false')
    }).catch((e) => {
      // Never fatal: a session that cannot be configured still plays for anyone
      // whose ringer is on, and crashing the whole app over it would be worse
      // than quiet audio.
      if (__DEV__) console.warn('[audio] could not set the startup audio mode', e)
    })
  }, [])

  if (!fontsLoaded && !fontError) {
    // The native splash still covers the screen here, so render nothing under it.
    return null
  }
  // OUTER boundary — last resort. Catches a throw in any provider (a bad persisted
  // blob, a failed hydrate) that the inner one can't see, since the inner one
  // lives inside the very providers that would have to be alive to render it.
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <ProgressProvider>
                <DrawerProvider>
                  <NotebookProvider>
                    <CelebrationProvider>
                      <QuizSettingsProvider>
                        {/* Must sit ABOVE ThemedShell: GlobalTabBar (inside it)
                            asks this before navigating. Inside ThemeProvider
                            too — its confirm dialog resolves theme tokens. */}
                        <NavGuardProvider>
                          {/* The path's lock / Pro modal (2026-09-28) — see PathLockContext. */}
                          <PathLockProvider>
                            <ThemedShell />
                          </PathLockProvider>
                        </NavGuardProvider>
                      </QuizSettingsProvider>
                    </CelebrationProvider>
                  </NotebookProvider>
                </DrawerProvider>
              </ProgressProvider>
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  )
}

// The app SHELL, mirroring the web <Layout>: one themed background + a header
// (top) and tab bar (bottom) that float over every screen.
//
//   <View vars>          -> applies the active theme's CSS variables; every
//                           className color below restyles when the theme flips
//     <Stack>            -> the screens (contentStyle = themed page bg)
//     <GlobalHeader />   -> status/utilities, top
//     <GlobalTabBar />   -> primary section nav, bottom
//
// Applying THEME_VARS on this root View is the RN equivalent of the web setting
// CSS variables on <html>: NativeWind cascades the vars down the React tree, so
// nothing needs `dark:` variants. contentStyle needs a concrete color (react-
// navigation paints its own grey theme otherwise), so it uses THEME_BG.
function ThemedShell() {
  const { theme } = useTheme()
  const bg = THEME_BG[theme] || THEME_BG.light

  return (
    <View style={[{ flex: 1, overflow: 'hidden' }, THEME_VARS[theme]]}>
      <StatusBar style={theme === 'light' ? 'dark' : 'light'} />
      {/* INNER boundary — a crash in ONE screen resets to a "Try again" inside the
          live shell, with providers (and so the user's session and progress) still
          mounted. Without it, a single bad route would take the whole app down. */}
      <ErrorBoundary>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: bg },
            animation: 'fade',
          }}
        />
      </ErrorBoundary>
      <GlobalHeader />
      <GlobalTabBar />
      <DrawerHost/>
      {/* First-run tour — shows once, over everything, then never again */}
      <WelcomeTour />
      {/* Quiz/study settings — root-mounted so its absolute-fill overlay covers
          the header and tab bar too. A screen-level mount cannot: those are
          zIndex-30 siblings of the Stack. See QuizSettingsContext. */}
      <QuizSettingsHost />
      {/* "Leave this story?" when a tab press would take you off a guarded
          screen. Root-mounted for the same reason as QuizSettingsHost above —
          it has to cover the tab bar that triggered it. */}
      <NavGuardHost />
      {/* Locked / Pro path unit — root-mounted to cover the header and tab bar (2026-09-28). */}
      <PathLockHost />
      {/* Celebration (confetti + "complete!") — LAST so it's above the bars */}
      <CelebrationOverlay />
      {/* Forces new (un-onboarded) accounts through onboarding */}
      <OnboardingGate />
    </View>
  )
}

// A signed-in user whose profile has no `onboardedAt` is bounced to /onboarding and
// kept there: navigating anywhere else just redirects back, so the only way out is
// Save or Skip (both stamp onboardedAt). Guests are exempt.
function OnboardingGate() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname() || ''
  // Root navigator readiness. Calling router.replace() before the navigator has
  // mounted throws "Couldn't find a navigation context / Attempted to navigate
  // before mounting the Root Layout" — which on device red-boxes the whole shell
  // (so the drawer looks dead too). navState.key is set only once it's ready.
  const navState = useRootNavigationState()

  useEffect(() => {
    if (!navState?.key) return
    if (loading || !user || user.isGuest || user.onboardedAt) return
    const exempt = ['/onboarding', '/login', '/register']
    if (exempt.some((r) => pathname.startsWith(r))) return
    router.replace('/onboarding')
  }, [navState?.key, user, loading, pathname, router])

  return null
}
