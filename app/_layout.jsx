// app/_layout.jsx
import { useEffect } from 'react'
import { View } from 'react-native'
import { Stack, usePathname, useRouter, useRootNavigationState } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
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
