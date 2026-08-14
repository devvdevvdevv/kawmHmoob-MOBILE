import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'

// In-app Privacy Policy + Data Safety summary. This is the human-readable version
// shown inside the app; Google Play also needs the SAME policy hosted at a public
// URL (link that URL in the Play listing). The "Data safety at a glance" card below
// mirrors the answers you enter in Play Console → Data safety.
//
// ⚠️ Fill in [CONTACT EMAIL] and, if you host this text at a URL, keep the two in
// sync. Update "Last updated" whenever the policy changes.

const CONTACT_EMAIL = 'techkage@proton.me'
const LAST_UPDATED = 'August 12, 2026'

export default function Privacy() {
  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]} />

      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Privacy Policy</Text>
        <Text className="text-sm text-stone-500">Last updated: {LAST_UPDATED}</Text>
        <Text className="text-base text-stone-700 leading-relaxed mt-3">
          Kawm Hmoob is a Hmong language-learning app. This policy explains what we
          collect, why, and the control you have over it. We keep it short and plain.
        </Text>
      </View>

      {/* Data safety at a glance — mirrors the Play Console Data Safety form */}
      <View className="rounded-md bg-cream-50 border border-cream-200 p-5 mb-8">
        <Text className="text-xs uppercase tracking-[2px] font-semibold text-clay-700 mb-3">Data safety at a glance</Text>
        <SafetyRow label="Data collected" value="Account info (email, username, display name, dialect) and your learning progress (XP, streak, lessons, quiz scores, saved words & notes)." />
        <SafetyRow label="Why" value="To run the app and sync your progress to your account across devices." />
        <SafetyRow label="Sold or shared for ads?" value="No. We don't sell your data and use no advertising trackers." />
        <SafetyRow label="Encrypted in transit?" value="Yes — all data travels over HTTPS/TLS." />
        <SafetyRow label="Can you delete it?" value="Yes — delete your account and all data any time (Account → Delete my account)." />
        <SafetyRow label="Analytics / ad SDKs?" value="None." last />
      </View>

      <Section title="1. What we collect">
        <Bullet><B>Account details</B> — when you create an account: email, username, display name, and dialect preference.</Bullet>
        <Bullet><B>Learning progress</B> — XP, streak, completed lessons, quiz scores, vocabulary progress, and any words or notes you save.</Bullet>
        <Bullet><B>Nothing else</B> — we do not collect your location, contacts, photos, or device identifiers for tracking, and we use no advertising or analytics trackers.</Bullet>
      </Section>

      <Section title="2. Guests">
        <Para>
          You can use Kawm Hmoob without an account. As a guest, your progress is stored
          <B> only on your device</B> and is never uploaded to our servers. Create an
          account if you want your progress saved and synced.
        </Para>
      </Section>

      <Section title="3. How we use your data">
        <Para>
          Only to provide the app: to sign you in, keep your account, and save and sync
          your learning progress. We do not use it for advertising or profiling.
        </Para>
      </Section>

      <Section title="4. Where it's stored & who processes it">
        <Para>
          Account and progress data for signed-in users is stored with our backend
          provider, <B>Supabase</B> (a hosting/database service acting on our behalf).
          It is protected by row-level security so each account can only access its own
          data. We do not share your data with advertisers or data brokers.
        </Para>
      </Section>

      <Section title="5. The microphone">
        <Para>
          A future pronunciation-practice feature will use your microphone to score how
          you say a word. When that ships, the analysis happens to give you feedback on
          your speech. Until then, the app does not record audio. (The mic permission
          may be requested in advance of that feature.)
        </Para>
      </Section>

      <Section title="6. Security">
        <Para>
          Data is encrypted in transit (HTTPS/TLS). Access is restricted to your own
          account. No method is 100% secure, but we take reasonable measures to protect
          your information.
        </Para>
      </Section>

      <Section title="7. Your choices & deletion">
        <Bullet>Edit your username and dialect any time in the Account screen.</Bullet>
        <Bullet><B>Delete everything</B> — Account → “Delete my account” permanently removes your account and all associated data. This can't be undone.</Bullet>
        <Bullet>Export a copy of your progress from the Account screen.</Bullet>
      </Section>

      <Section title="8. Children">
        <Para>
          Kawm Hmoob is intended for a general audience and is not directed at children
          under 13. We do not knowingly collect personal information from children under
          13. If you believe a child has provided us data, contact us and we'll remove it.
        </Para>
      </Section>

      <Section title="9. Changes">
        <Para>
          We may update this policy as the app grows. Material changes will update the
          “Last updated” date above.
        </Para>
      </Section>

      <Section title="10. Contact">
        <Para>
          Questions or requests: <B>{CONTACT_EMAIL}</B>. You can also reach us through the{' '}
          <Link href="/contact" className="underline text-clay-700">Contact page</Link>.
        </Para>
      </Section>

      <View className="h-6" />
    </TabScreen>
  )
}

function Section({ title, children }) {
  return (
    <View className="mb-6">
      <Text className="font-serif text-xl text-stone-900 mb-2">{title}</Text>
      <View className="gap-2">{children}</View>
    </View>
  )
}

function Para({ children }) {
  return <Text className="text-base text-stone-700 leading-relaxed">{children}</Text>
}

function Bullet({ children }) {
  return (
    <View className="flex-row gap-2">
      <Text className="text-clay-600">•</Text>
      <Text className="flex-1 text-base text-stone-700 leading-relaxed">{children}</Text>
    </View>
  )
}

function B({ children }) {
  return <Text className="font-semibold text-stone-900">{children}</Text>
}

function SafetyRow({ label, value, last = false }) {
  return (
    <View className={`flex-row gap-3 py-2 ${last ? '' : 'border-b border-cream-200'}`}>
      <Text className="text-sm font-semibold text-stone-800 w-32">{label}</Text>
      <Text className="flex-1 text-sm text-stone-700 leading-relaxed">{value}</Text>
    </View>
  )
}
