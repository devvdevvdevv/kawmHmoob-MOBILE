import { View, Text, Pressable, Platform, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import Constants from 'expo-constants'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AdminGate from '../src/components/common/AdminGate.jsx'

// 🛠️ DEV TOOLS — a plain list of links to throwaway/QA screens.
//
// Admin-gated (src/lib/admin.js). Reachable from Settings or directly at /dev.
// Deliberately unstyled and outside the design system: it should never look like
// a real page.
//
// Expo Router's own /_sitemap lists every route, but it's noisy — this is the
// short list of things actually worth tapping during a spike session.

// ⚠️ OPAQUE BY DESIGN — 2026-08-30. This page used to paint NO background, so it
// inherited THEME_BG from the shell (app/_layout.jsx) and the cards had no fill
// at all — genuinely transparent. Worse, the old greys (#666 text, #ddd borders,
// default-black titles) were picked against a cream backdrop, so flipping to the
// dark or neon theme made most of the page unreadable.
//
// The fix is to stop inheriting: this screen paints its own dark console surface
// with HARDCODED colors and never consults the theme. That keeps it legible in
// light, dark, and neon alike, and it still looks nothing like a real page —
// which is the whole point of the file.
//
// Do NOT swap these for cream/stone tokens; that would re-introduce the bug and
// make a debug screen look shipped.
const C = {
  bg: '#0F1115',        // page — near-black console ground
  card: '#1B1F27',      // tool row fill (opaque, not a tint)
  border: '#39414F',    // visible edge without shouting
  title: '#F5F7FA',     // ~15:1 on card
  body: '#B9C2D0',      // ~10:1 on card — body text, not a muted hint
  meta: '#8D97A8',      // ~6:1 on bg — still passes for small text
  accent: '#7EE787',    // dev-build green
}

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' })

const TOOLS = [
  {
    href: '/admin-users',
    title: '📊 Users & progress',
    blurb: 'Total signed-in users, active counts, XP and streaks, one row per account. Needs supabase/02-admin.sql run and your uid seeded into public.admins — the views enforce that server-side, so this gate alone is not what protects the data.',
  },
  {
    href: '/wav-spike',
    title: '🎙️ WAV spike 2 (siteed)',
    blurb: 'Does @siteed/audio-studio give real PCM on Android? Records, decodes, and runs pitch extraction on-device. Green = tone scoring works here.',
  },
  {
    href: '/speak-lab',
    title: '🧪 Speak lab',
    blurb: 'Sandbox for the Natulang-style lesson flow: a script of typed steps. Reads src/data/speakLab.js. Touches nothing in the real Speak module.',
  },
  {
    href: '/spike',
    title: '🎙️ WAV spike',
    blurb: 'Record 2s, read the file header, prove whether this platform gives real uncompressed PCM. Results show on screen.',
  },
  {
    href: '/tone-eval',
    title: '🎚️ Tone eval',
    blurb: 'Pitch/tone scoring harness. Web-only for now — placeholder on native.',
  },
  {
    href: '/speak',
    title: '🗣️ Speak',
    blurb: 'Where PronounceStep lives — the real record + playback UI.',
  },
  {
    href: '/_sitemap',
    title: '🗺️ Full route list',
    blurb: "Expo Router's auto-generated index of every route in the app.",
  },
]

export default function DevTools() {
  // ⚠️ THE REAL INSET, NOT A MAGIC NUMBER — added 2026-09-30. This screen sits
  // OUTSIDE the design system on purpose (no TabScreen, no SafeAreaView), which
  // also means nothing was handling the status bar: the title and the build
  // stamp rendered underneath it and were unreadable.
  //
  // A hardcoded paddingTop would be wrong on every device it was not measured
  // on — too little on a notched phone, a gap on a flat one. The inset is the
  // device telling us the answer. `+ 24` keeps the page's existing padding
  // rhythm below it.
  const insets = useSafeAreaInsets()

  return (
    <AdminGate>
      {/* The background goes on the ScrollView ITSELF, not just the content
          container — a contentContainerStyle color only covers as much as the
          content is tall, so a short list would leave the theme showing through
          underneath. flexGrow keeps the dark ground filling the viewport. */}
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          paddingTop: insets.top + 24,
          // The home-indicator gutter too, so the last tool row is tappable
          // rather than sitting under it.
          paddingBottom: insets.bottom + 24,
          gap: 16,
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '700', color: C.title, letterSpacing: 0.2 }}>
          Dev tools
        </Text>

        {/* Build stamp as a bordered chip: at a glance you can tell which binary
            you're poking at. Green reads dev, amber reads prod. */}
        <View
          style={{
            alignSelf: 'flex-start',
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: C.border,
            backgroundColor: C.card,
            borderRadius: 6,
            paddingVertical: 6,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontFamily: MONO, fontSize: 12, color: C.body }}>
            {Platform.OS} · SDK {Constants.expoConfig?.sdkVersion ?? '?'} ·{' '}
          </Text>
          <Text
            style={{
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: '700',
              color: __DEV__ ? C.accent : '#FFB86B',
            }}
          >
            {__DEV__ ? 'dev' : 'prod'}
          </Text>
        </View>

        {TOOLS.map((t) => (
          // asChild hands the press behaviour to the child, so the child must be
          // PRESSABLE — a plain View would render fine and do nothing on tap.
          //
          // Style stays a STATIC OBJECT, never a ({ pressed }) => ({...}) function:
          // a function style on a Pressable renders invisible on native here (see
          // notes/2026-08-06-nativewind-drops-function-style-invisible-buttons.md).
          // Press feedback comes from android_ripple instead.
          <Link key={t.href} href={t.href} asChild>
            <Pressable
              android_ripple={{ color: '#2C333F' }}
              style={{
                borderWidth: 1,
                borderColor: C.border,
                backgroundColor: C.card,
                borderRadius: 10,
                padding: 16,
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.title }}>
                {t.title}
              </Text>
              <Text style={{ color: C.body, fontSize: 13, lineHeight: 19 }}>
                {t.blurb}
              </Text>
              <Text style={{ fontFamily: MONO, fontSize: 11, color: C.meta, marginTop: 2 }}>
                {t.href}
              </Text>
            </Pressable>
          </Link>
        ))}

        <Text style={{ color: C.meta, fontSize: 12, marginTop: 8, lineHeight: 17 }}>
          Delete /dev and /spike once the pronunciation format question is settled.
        </Text>
      </ScrollView>
    </AdminGate>
  )
}
