// SEND A MESSAGE — the Contact screen's one job, with an honest outcome.
//
// ⚠️ THE WHOLE POINT IS THAT "SENT" MEANS SENT. /contact used to be a mailto
// link, and a mailto cannot be confirmed: Linking.openURL resolves when the MAIL
// APP OPENS, and whether anything left the phone after that is another app's
// business. So this writes a row to public.messages (supabase/03-messages.sql)
// and reports what actually happened.
//
// ⚠️ EVERY FAILURE IS NAMED, because "Something went wrong" is the copy that
// makes people give up. Each reason below gets its own sentence on screen AND
// says whether trying again is worth it — a too-short message is the sender's to
// fix, a dropped request is not.
//
// This file holds NO UI and no React: the screen renders whatever comes back,
// and every rule about what counts as sendable lives here rather than inside a
// component. (It is not importable by a plain-Node script, though — `Platform`
// and `expo-constants` are native-only. If these rules ever need testing from
// Node, validateDraft() is the part to split out; it touches neither.)

import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { supabase, isSupabaseConfigured } from './supabase.js'

/** The topics on the form. `id` is stored — it is in a CHECK constraint, so
 *  changing one means a migration. Labels are free to change. */
export const TOPICS = [
  { id: 'bug', label: 'Something is broken' },
  { id: 'word', label: 'A word looks or sounds wrong' },
  { id: 'idea', label: 'An idea or request' },
  { id: 'account', label: 'Account or payment' },
  { id: 'hello', label: 'Just saying hello' },
]

// Matches the CHECK constraints in supabase/03-messages.sql. Two copies of one
// rule, and the comment there says why: the database is the one that cannot be
// bypassed, this one is the one that can explain itself.
export const MIN_BODY = 10
export const MAX_BODY = 4000

/** Long enough to stop a double tap and an accidental resend, short enough not
 *  to punish someone who spots a typo and sends a correction. */
export const COOLDOWN_MS = 30_000

export const EMAIL = 'techkage@proton.me'

// ⚠️ NOT VALIDATION — a deliberately loose check. Rejecting a real address
// because a regex disagrees with it is worse than accepting one that bounces,
// and the field is optional anyway: a message with no reply address is still
// worth having.
const looksLikeEmail = (s) => /\S+@\S+\.\S+/.test(String(s || '').trim())

/**
 * What is wrong with this draft, or null when it is ready.
 * Called on every keystroke to enable the button, so it stays cheap.
 */
export function validateDraft({ topic, body, replyTo }) {
  const text = String(body || '').trim()
  if (!topic) return { field: 'topic', message: 'Pick what this is about.' }
  if (!text) return { field: 'body', message: 'Type your message first.' }
  if (text.length < MIN_BODY) {
    return { field: 'body', message: `A few more words — ${MIN_BODY - text.length} to go.` }
  }
  if (text.length > MAX_BODY) {
    return { field: 'body', message: `That is ${text.length - MAX_BODY} characters too long.` }
  }
  if (replyTo && !looksLikeEmail(replyTo)) {
    return { field: 'replyTo', message: 'That email address looks incomplete.' }
  }
  return null
}

/**
 * Send it.
 *
 * Returns `{ ok: true }`, or `{ ok: false, reason, message, retry }` where
 * `retry` says whether trying the same thing again could work. Never throws:
 * the caller is a screen, and a screen has to render something either way.
 *
 * @param draft   { topic, body, replyTo }
 * @param user    the AuthContext user (isGuest, id, email)
 */
export async function sendMessage(draft, user) {
  const invalid = validateDraft(draft)
  if (invalid) return { ok: false, reason: 'invalid', message: invalid.message, retry: false, field: invalid.field }

  // ⚠️ A GUEST FILES AS NULL, and the RLS policy requires exactly that. Sending
  // `user.id` for a guest would be the string 'guest', which is not a uuid, and
  // the insert would fail on a type error rather than a policy error — a much
  // harder thing to read in a log.
  const signedIn = Boolean(user && !user.isGuest && user.id)

  if (!isSupabaseConfigured()) {
    // The local dev case, and the honest thing to say about it. Retrying cannot help.
    return {
      ok: false,
      reason: 'not-configured',
      message: 'This build has no server connection, so the message cannot be sent from inside the app.',
      retry: false,
    }
  }

  const row = {
    user_id: signedIn ? user.id : null,
    // A signed-in sender's own address is used unless they typed another, so a
    // reply has somewhere to go without asking for what the account already knows.
    reply_to: String(draft.replyTo || '').trim() || (signedIn ? user.email || null : null),
    topic: draft.topic,
    body: String(draft.body).trim(),
    app_version: String(Constants.expoConfig?.version || ''),
    platform: Platform.OS,
  }

  try {
    const { error } = await supabase.from('messages').insert(row)
    if (!error) return { ok: true }

    // ⚠️ THE TWO FAILURES THAT LOOK THE SAME AND ARE NOT. A missing table (the
    // migration was never run) and a rejected policy are both "the server said
    // no", but one is the developer's fault and no amount of retrying fixes it.
    const code = String(error.code || '')
    if (code === '42P01') {
      return {
        ok: false,
        reason: 'no-table',
        message: 'The message could not be filed — this app’s messages table is missing.',
        retry: false,
        detail: error.message,
      }
    }
    if (code === '42501' || /row-level security/i.test(error.message || '')) {
      return {
        ok: false,
        reason: 'refused',
        message: 'The server refused the message. That is a bug on my side, not yours.',
        retry: false,
        detail: error.message,
      }
    }
    if (code === '23514') {
      return {
        ok: false,
        reason: 'invalid',
        message: 'The server would not accept that message — check the length and try again.',
        retry: true,
        detail: error.message,
      }
    }
    // Anything else: most often no network. supabase-js reports a failed fetch
    // as a plain TypeError message, with no code at all.
    return {
      ok: false,
      reason: 'network',
      message: 'The message did not get through — you may be offline.',
      retry: true,
      detail: error.message,
    }
  } catch (err) {
    return {
      ok: false,
      reason: 'network',
      message: 'The message did not get through — you may be offline.',
      retry: true,
      detail: err?.message || String(err),
    }
  }
}

/**
 * The same message as an email, for when the insert cannot work.
 *
 * ⚠️ THIS IS WHY A FAILURE IS NOT A DEAD END. Someone who has typed three
 * paragraphs about a bug should not be told "try later" and lose them. The
 * fallback carries the text into their mail app, where it is theirs to keep.
 */
export function mailtoFor(draft) {
  const topic = TOPICS.find((t) => t.id === draft?.topic)
  const subject = `KawmHmong — ${topic ? topic.label : 'message'}`
  const body = String(draft?.body || '')
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
