import { View, Text, Pressable, Platform, ScrollView } from 'react-native'
import { Link } from 'expo-router'
import Constants from 'expo-constants'
import AdminGate from '../src/components/common/AdminGate.jsx'

// 🛠️ DEV TOOLS — a plain list of links to throwaway/QA screens.
//
// Admin-gated (src/lib/admin.js). Reachable from Settings or directly at /dev.
// Deliberately unstyled and outside the design system: it should never look like
// a real page.
//
// Expo Router's own /_sitemap lists every route, but it's noisy — this is the
// short list of things actually worth tapping during a spike session.

const TOOLS = [
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
  return (
    <AdminGate>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700' }}>Dev tools</Text>
        <Text style={{ color: '#666' }}>
          {Platform.OS} · SDK {Constants.expoConfig?.sdkVersion ?? '?'} ·{' '}
          {__DEV__ ? 'dev' : 'prod'}
        </Text>

        {TOOLS.map((t) => (
          // asChild hands the press behaviour to the child, so the child must be
          // PRESSABLE — a plain View would render fine and do nothing on tap.
          <Link key={t.href} href={t.href} asChild>
            <Pressable
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16, gap: 4 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{t.title}</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>{t.blurb}</Text>
            </Pressable>
          </Link>
        ))}

        <Text style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
          Delete /dev and /spike once the pronunciation format question is settled.
        </Text>
      </ScrollView>
    </AdminGate>
  )
}
