import { useState } from 'react'
import { View, Text, TextInput, Pressable, Linking } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Button from '../src/components/ui/Button.jsx'
import Icon from '../src/components/ui/Icon.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import { useAuth } from '../src/context/AuthContext.jsx'
import {
  TOPICS,
  MAX_BODY,
  COOLDOWN_MS,
  EMAIL,
  validateDraft,
  sendMessage,
  mailtoFor,
} from '../src/lib/sendMessage.js'

// CONTACT — a real form, with a real answer about whether it sent.
//
// ⚠️ IT WAS A MAILTO LINK UNTIL 2026-09-22, and the old comment here said "no
// form: a form implies a backend that receives it, which doesn't exist." There
// is one now (public.messages, supabase/03-messages.sql), and the reason for
// building it was the question this screen could not answer: a mailto hands off
// to the mail app and NOTHING comes back, so the app could never say "sent".
//
// ⚠️ FOUR STATES, AND THE TWO IN THE MIDDLE ARE THE FEATURE:
//
//   form     the draft, and what is still missing from it
//   sending  the button says so and cannot be pressed twice
//   sent     a full success screen — the only screen that clears the draft
//   failed   the form, UNCHANGED, with a card on top saying what happened
//
// ⚠️ FAILURE IS NOT A SCREEN OF ITS OWN, and that is deliberate. A full-page
// error would either throw the typed message away or hide it behind a button.
// Keeping the form exactly as it was means the words are still on screen, one
// tap from being retried or sent as an email instead. Success is a full screen
// because there is nothing left to do there.
//
// ⚠️ THE EMAIL LINK STAYS. It is the fallback when the insert cannot work
// (no server in this build, missing table, offline), carrying the draft with it —
// see mailtoFor(). A failed send must never cost someone their paragraphs.
export default function Contact() {
  const { user } = useAuth()

  const [phase, setPhase] = useState('form') // form | sending | sent
  const [topic, setTopic] = useState(null)
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState('')
  const [failure, setFailure] = useState(null)
  const [sentAt, setSentAt] = useState(0)
  // Shown only after a failed submit, so the form does not scold anyone for a
  // message they are still in the middle of typing.
  const [showInvalid, setShowInvalid] = useState(false)

  const draft = { topic, body, replyTo }
  const invalid = validateDraft(draft)

  const submit = async () => {
    if (phase === 'sending') return
    if (invalid) {
      setShowInvalid(true)
      setFailure(null)
      return
    }
    // The cooldown is here rather than in sendMessage() because it is about this
    // screen's buttons, not about the message: a second send from a fresh visit
    // to the screen is a different message, and should go.
    const since = Date.now() - sentAt
    if (sentAt && since < COOLDOWN_MS) {
      setFailure({
        reason: 'cooldown',
        message: `Just a moment — you can send again in ${Math.ceil((COOLDOWN_MS - since) / 1000)}s.`,
        retry: true,
      })
      return
    }

    setPhase('sending')
    setFailure(null)
    const result = await sendMessage(draft, user)
    if (result.ok) {
      setSentAt(Date.now())
      setPhase('sent')
    } else {
      setFailure(result)
      setPhase('form')
    }
  }

  const reset = () => {
    setTopic(null)
    setBody('')
    setFailure(null)
    setShowInvalid(false)
    setPhase('form')
  }

  // ── sent ──────────────────────────────────────────────────────────────────
  // ⚠️ IT SAYS WHAT HAPPENS NEXT, not just "thanks". The honest version — one
  // person, replies are slow, and a reply needs an address — is what stops the
  // next message being "did you get my message?".
  if (phase === 'sent') {
    const replyAddress = replyTo.trim() || (!user.isGuest && user.email) || null
    return (
      <TabScreen>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

        <View className="items-center py-6">
          <View className="h-16 w-16 rounded-full bg-lime-200 items-center justify-center mb-5">
            <Icon name="check" size={32} tone="ink" />
          </View>

          {/* muted, not accent: accent means Pro or a limit — see Eyebrow.jsx. */}
          <Eyebrow className="mb-2">Sent</Eyebrow>
          <Text className="font-serif text-4xl text-stone-900 mb-3 text-center">
            Your message is in.
          </Text>
          <Text className="text-base font-medium text-stone-700 leading-relaxed text-center mb-6">
            It landed — I have it, and I read every one. KawmHmong is built by one person, so a
            reply may take a little while.
          </Text>

          <View className="w-full rounded-md bg-cream-50 p-5 gap-3 mb-6">
            <Row label="About" value={TOPICS.find((t) => t.id === topic)?.label || '—'} />
            <Row
              label="Reply to"
              value={replyAddress || 'No address — I won’t be able to reply'}
            />
          </View>

          <View className="w-full gap-3">
            <Link href="/" asChild>
              <Button size="lg">Back to Home</Button>
            </Link>
            <Button size="lg" variant="secondary" onPress={reset}>
              Send another
            </Button>
          </View>
        </View>
      </TabScreen>
    )
  }

  // ── the form (also the failed state) ──────────────────────────────────────
  const sending = phase === 'sending'

  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Contact' }]} />

      <View className="py-4 max-w-md w-full self-center">
        <Text className="font-serif text-4xl text-stone-900 mb-3 text-center">Get in touch</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed mb-6 text-center">
          Questions, bugs, a word that sounds wrong, or just want to say hello — I read every
          message.
        </Text>

        {/* ⚠️ THE FAILURE CARD SITS ABOVE THE FORM, NOT INSTEAD OF IT. The draft
            below is untouched, so "Try again" is one tap and nothing is retyped. */}
        {failure && <FailureCard failure={failure} draft={draft} onRetry={submit} sending={sending} />}

        <View className="rounded-md bg-cream-50 p-5 gap-5">
          <View>
            <Text className="text-sm font-semibold text-stone-800 mb-2">What is this about?</Text>
            <View className="flex-row flex-wrap gap-2">
              {TOPICS.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => setTopic(t.id)}
                  disabled={sending}
                  className={`rounded-full px-3.5 py-2 ${
                    topic === t.id ? 'bg-clay-600' : 'bg-cream-200 active:bg-cream-300'
                  }`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: topic === t.id }}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      topic === t.id ? 'text-cream-50' : 'text-stone-800'
                    }`}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-sm font-semibold text-stone-800">Your message</Text>
              {/* Only near the limit: a counter on an empty box is pressure, and
                  4000 characters is not a limit anyone writes up to by accident. */}
              {body.length > MAX_BODY - 500 && (
                <Text className="text-xs font-medium text-stone-600">
                  {MAX_BODY - body.length} left
                </Text>
              )}
            </View>
            <TextInput
              value={body}
              onChangeText={setBody}
              editable={!sending}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholder="What happened, or what you noticed…"
              // minHeight as a static style OBJECT, never a style function —
              // NativeWind drops those on native.
              style={{ minHeight: 128 }}
              className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2.5 text-base text-stone-900"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-stone-800 mb-1.5">
              Email {user.isGuest ? '(optional)' : '(optional — your account address is used otherwise)'}
            </Text>
            <TextInput
              value={replyTo}
              onChangeText={setReplyTo}
              editable={!sending}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={user.isGuest ? 'you@example.com' : user.email || 'you@example.com'}
              className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2.5 text-base text-stone-900"
            />
            <Text className="text-xs font-medium text-stone-600 mt-1.5">
              Without an address I can read your message but not reply to it.
            </Text>
          </View>

          {/* The one thing still missing, and only once they have tried to send. */}
          {showInvalid && invalid && !failure && (
            <View className="rounded bg-cream-200 px-3 py-2">
              <Text className="text-sm font-medium text-stone-800">{invalid.message}</Text>
            </View>
          )}

          {/* ⚠️ NOT `disabled={Boolean(invalid)}`. A button that cannot be pressed
              does not say what is wrong with the draft; pressing this one does
              (showInvalid above). It is disabled only while a send is in flight,
              which is the one case where a second tap would send twice. */}
          <Button size="lg" onPress={submit} disabled={sending} className="w-full">
            {sending ? 'Sending…' : 'Send message'}
          </Button>
        </View>

        {/* The email address stays visible and always works, whatever the form
            is doing — it is the app's oldest promise on this screen. */}
        <View className="items-center mt-6">
          <Text className="text-sm font-medium text-stone-600 mb-1">Or email me directly</Text>
          <Text
            className="font-serif text-lg text-clay-700"
            onPress={() => Linking.openURL(`mailto:${EMAIL}`)}
          >
            {EMAIL}
          </Text>
        </View>
      </View>
    </TabScreen>
  )
}

function Row({ label, value }) {
  return (
    <View className="flex-row justify-between gap-4">
      <Text className="text-sm font-medium text-stone-600">{label}</Text>
      <Text className="text-sm font-semibold text-stone-900 flex-1 text-right">{value}</Text>
    </View>
  )
}

// ── the failure card ────────────────────────────────────────────────────────
//
// ⚠️ IT NAMES THE FAILURE AND SAYS WHOSE PROBLEM IT IS. "Something went wrong"
// leaves the sender to guess whether to wait, retry, or give up. `retry` from
// sendMessage() decides whether Try again is even offered: a missing table is
// not going to fix itself, and a button that cannot work is worse than none.
function FailureCard({ failure, draft, onRetry, sending }) {
  return (
    <View className="rounded-md bg-cream-200 border border-clay-500 p-5 mb-5">
      <View className="flex-row items-center gap-2 mb-2">
        <View className="h-7 w-7 rounded-full bg-clay-600 items-center justify-center">
          <Text className="text-base font-bold text-cream-50">!</Text>
        </View>
        <Text className="text-base font-bold text-stone-900">Not sent</Text>
      </View>

      <Text className="text-sm font-medium text-stone-800 leading-snug mb-1">{failure.message}</Text>
      <Text className="text-sm font-medium text-stone-700 leading-snug mb-4">
        Your message is still here — nothing was lost.
      </Text>

      <View className="gap-2">
        {failure.retry && (
          <Button size="md" onPress={onRetry} disabled={sending}>
            {sending ? 'Sending…' : 'Try again'}
          </Button>
        )}
        {/* ⚠️ THE DRAFT TRAVELS. mailtoFor() puts the typed text in the mail
            body, so the way out of a broken send is not "start over". */}
        <Button
          size="md"
          variant="secondary"
          onPress={() => Linking.openURL(mailtoFor(draft))}
        >
          Send it as an email instead
        </Button>
      </View>

      {/* The server's own words, dev builds only: useful to me, meaningless and
          alarming to a learner. */}
      {__DEV__ && failure.detail && (
        <Text className="text-xs text-stone-600 mt-3">dev: {failure.reason} — {failure.detail}</Text>
      )}
    </View>
  )
}
