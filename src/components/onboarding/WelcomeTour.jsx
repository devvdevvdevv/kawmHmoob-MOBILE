import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePathname, useRouter } from 'expo-router'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { THEME_TOKENS } from '../../lib/themes.js'
import { useOnce } from '../../lib/useOnce.js'

// First-run tour. A multi-step modal that teaches the ONE fundamental (a Hmong
// word = consonant + vowel + tone) and says what each tab/section is for, so a
// first-time user isn't dropped into a 20-page app with no map. Shows once per
// install (useOnce), then never again. Mounted globally in _layout.
//
// Design intent: this REPLACES persistent on-screen chrome with progressive
// disclosure — teach up front, then get out of the way.

// Don't hijack the auth/onboarding flows with the tour.
const HIDE_ON = ['/login', '/register', '/onboarding']

// Steps are data so they're easy to reorder/trim. The account step is appended
// only for guests (see below).
const BASE_STEPS = [
  {
    emoji: '👋',
    title: 'Nyob zoo!',
    body: 'Welcome to KawmHmoob — learn to read, speak, and understand Hmong. Here’s a 30-second tour so you know where everything is.',
  },
  {
    emoji: '🧩',
    title: 'How a Hmong word works',
    body: 'Every Hmong word is three pieces: a consonant + a vowel + a tone (the pitch). "Nplooj" = Npl + oo + j. The whole app is built around teaching those three pieces, then putting them together.',
  },
  {
    emoji: '📖',
    title: 'Learn',
    body: 'Structured lessons, start to finish — the alphabet first (consonants, vowels, tones), then grammar, numbers, and readings. Each lesson walks you through an intro, examples you can hear, and a quick quiz.',
  },
  {
    emoji: '🎤',
    title: 'Speak',
    body: 'Hear a native recording, then practice saying it out loud. This is where you train your ear and mouth on the tones — the part English speakers find hardest.',
  },
  {
    emoji: '🃏',
    title: 'Words',
    body: 'Your daily flashcard practice. Words are spaced out so they come back right before you’d forget them, and quizzes test what you’ve studied. A few minutes a day is the whole idea.',
  },
  {
    emoji: '🔡',
    title: 'Reference',
    body: 'Look anything up — every consonant, vowel, tone, and grammar table on tabs, each with audio. For when you know the concept and just need the word.',
  },
  {
    emoji: '☰',
    title: 'Home & the menu',
    body: 'Home is your dashboard — streak, XP, and what to do today. Tap the ☰ menu (top-left) for your account, settings, theme (light / dark / starry), and the leaderboard.',
  },
]

const ACCOUNT_STEP = {
  emoji: '✨',
  title: 'Save your progress',
  body: 'You’re exploring as a guest — your progress only lives on this device. Creating an account is free and keeps your streak, saved words, and XP synced everywhere. You can always do this later from the menu.',
  account: true, // renders the Create-account action
}

export default function WelcomeTour() {
  const { seen, ready, markSeen } = useOnce('welcome-tour')
  const insets = useSafeAreaInsets()
  const { user } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname() || ''
  const [step, setStep] = useState(0)

  const steps = user?.isGuest ? [...BASE_STEPS, ACCOUNT_STEP] : BASE_STEPS

  // Don't render until storage is read (avoid a flash), if already seen, or on the
  // auth/onboarding routes.
  const hideRoute = HIDE_ON.some((r) => pathname.startsWith(r))
  if (!ready || seen || hideRoute) return null

  const t = THEME_TOKENS[theme] || THEME_TOKENS.light
  const cardBg = `rgb(${t['--c-cream-50']})`
  const border = `rgb(${t['--c-cream-200']})`
  const titleColor = `rgb(${t['--c-stone-900']})`
  const bodyColor = `rgb(${t['--c-stone-700']})`
  const dotOn = `rgb(${t['--c-clay-600']})`
  const dotOff = `rgb(${t['--c-cream-200']})`
  const mutedColor = `rgb(${t['--c-stone-500']})`
  // Button colors — used by the raw inline Pressables below (NOT the shared Button
  // component, so a cached Button.jsx can't make them render white).
  const primaryBg = `rgb(${t['--c-clay-600']})`   // the brown
  const primaryText = `rgb(${t['--c-cream-50']})`
  const ghostText = `rgb(${t['--c-stone-800']})`

  const s = steps[step]
  const isFirst = step === 0
  const isLast = step === steps.length - 1

  const finish = () => markSeen() // seen=true → this component returns null
  const next = () => (isLast ? finish() : setStep((i) => i + 1))
  const back = () => setStep((i) => Math.max(0, i - 1))
  const createAccount = () => { markSeen(); router.push('/register') }

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24, paddingHorizontal: 24, zIndex: 9999, elevation: 9999 }]}>
        <View style={{ width: '100%', maxWidth: 440, backgroundColor: cardBg, borderColor: border, borderWidth: 1, borderRadius: 20, padding: 28 }}>
          {/* Skip — always available, top-right */}
          {!s.account && (
            <Pressable onPress={finish} hitSlop={10} style={{ position: 'absolute', top: 16, right: 18, zIndex: 1 }}>
              <Text style={{ color: mutedColor, fontSize: 24, fontWeight: '600' }}>Skip</Text>
            </Pressable>
          )}

          <Text style={{ fontSize: 48, marginBottom: 12 }}>{s.emoji}</Text>
          <Text className="font-serif" style={{ color: titleColor, fontSize: 28, fontWeight: '700', marginBottom: 12 }}>
            {s.title}
          </Text>
          <Text style={{ color: bodyColor, fontSize: 16, lineHeight: 25, minHeight: 100 }}>{s.body}</Text>

          {/* Progress dots */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 20, marginBottom: 20 }}>
            {steps.map((_, i) => (
              <View key={i} style={{ height: 7, width: i === step ? 20 : 7, borderRadius: 4, backgroundColor: i === step ? dotOn : dotOff }} />
            ))}
          </View>

          {/* Actions — RAW inline Pressables (no shared Button, no NativeWind) so
              the brown primary can't be defeated by a cached Button.jsx. */}
          {s.account ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={finish}
                style={{ flex: 1, minHeight: 52, borderRadius: 10, borderWidth: 1, borderColor: border, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: ghostText, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Maybe later</Text>
              </Pressable>
              <Pressable
                onPress={createAccount}
                style={{ flex: 1, minHeight: 52, borderRadius: 10, backgroundColor: primaryBg, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: primaryText, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>Create free account</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {!isFirst && (
                <Pressable
                  onPress={back}
                  style={{ minHeight: 52, borderRadius: 10, borderWidth: 1, borderColor: border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
                >
                  <Text style={{ color: ghostText, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Back</Text>
                </Pressable>
              )}
              {/* The big obvious brown CTA */}
              <Pressable
                onPress={next}
                style={{ flex: 1, minHeight: 52, borderRadius: 10, backgroundColor: primaryBg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
              >
                <Text style={{ color: primaryText, fontSize: 17, fontWeight: '700', textAlign: 'center' }}>
                  {isLast ? 'Start learning →' : 'Next →'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
  )
}
