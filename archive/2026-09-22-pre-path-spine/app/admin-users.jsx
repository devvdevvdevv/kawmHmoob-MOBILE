import { useCallback, useEffect, useState } from 'react'
import { View, Text, ScrollView, Platform, RefreshControl } from 'react-native'
import AdminGate from '../src/components/common/AdminGate.jsx'
import { supabase, isSupabaseConfigured } from '../src/lib/supabase.js'

// 📊 ADMIN — who signed up, and are they paying.
//
// Reads `admin_users` and `admin_totals` from supabase/02-admin.sql.
//
// ⚠️ THE GATE HERE IS NOT THE SECURITY. AdminGate hides the screen; the real
// enforcement is `public.is_admin()` in Postgres, which both views call. A
// patched build that walks past AdminGate still gets zero rows.
//
// ⚠️ AN EMPTY RESULT AND "YOU ARE NOT AN ADMIN" ARE THE SAME RESPONSE. RLS
// returns an empty set, never a permission error — so this screen calls
// `admin_whoami()` to tell the two apart instead of showing a blank page and
// letting you guess. That diagnostic is the whole reason the RPC exists.
//
// ⚠️ SIGNED-IN USERS ONLY. Guest progress lives in device storage
// ('kawmhmoob.progress.guest') and never reaches Supabase, so nobody who
// skipped signup is counted here. Said on the screen, not just in this comment.
//
// Styling follows app/dev.jsx: a hardcoded dark console palette that never
// consults the theme, so it stays legible in light/dark/neon and never looks
// like a shipped page.
const C = {
  bg: '#0F1115',
  card: '#1B1F27',
  border: '#39414F',
  title: '#F5F7FA',
  body: '#B9C2D0',
  meta: '#8D97A8',
  accent: '#7EE787',
  warn: '#F0883E',
}

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' })

function day(v) {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '—' : d.toISOString().slice(0, 10)
}

function Stat({ label, value, tone }) {
  return (
    <View style={{ flexGrow: 1, flexBasis: 92, backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 10, padding: 12 }}>
      <Text style={{ color: C.meta, fontSize: 11, marginBottom: 4 }}>{label}</Text>
      <Text style={{ color: tone || C.title, fontFamily: MONO, fontSize: 22 }}>{value}</Text>
    </View>
  )
}

function Box({ tone, children }) {
  return (
    <View style={{ backgroundColor: C.card, borderColor: tone || C.border, borderWidth: 1, borderRadius: 10, padding: 12, gap: 6 }}>
      {children}
    </View>
  )
}

function AdminUsersInner() {
  const [totals, setTotals] = useState(null)
  const [rows, setRows] = useState([])
  const [who, setWho] = useState(null)
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(true)

  const load = useCallback(async () => {
    setBusy(true)
    setErr(null)
    if (!isSupabaseConfigured()) {
      setErr('Supabase is not configured — set EXPO_PUBLIC_SUPABASE_URL and _ANON_KEY.')
      setBusy(false)
      return
    }
    const [w, t, u] = await Promise.all([
      supabase.rpc('admin_whoami'),
      supabase.from('admin_totals').select('*').maybeSingle(),
      supabase.from('admin_users').select('*').order('joined_at', { ascending: false }).limit(200),
    ])
    // ⚠️ Report the FIRST real error, not the last. A missing view makes all
    // three fail and the last message is the least informative of them.
    const firstErr = [w, t, u].find((r) => r.error)?.error
    if (firstErr) setErr(firstErr.message)
    setWho(w.data?.[0] || w.data || null)
    setTotals(t.data || null)
    setRows(u.data || [])
    setBusy(false)
  }, [])

  useEffect(() => { load() }, [load])

  const notAdmin = who && who.is_admin === false
  const noUsers = who && who.is_admin === true && Number(who.total_profiles) === 0

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 60, gap: 14 }}
      refreshControl={<RefreshControl refreshing={busy} onRefresh={load} tintColor={C.accent} />}
    >
      <View>
        <Text style={{ color: C.title, fontSize: 22, fontWeight: '700' }}>📊 Users</Text>
        <Text style={{ color: C.meta, fontSize: 12, marginTop: 4 }}>
          Signed-in accounts only — guests never reach Supabase. Pull to refresh.
        </Text>
      </View>

      {err && (
        <Box tone={C.warn}>
          <Text style={{ color: C.warn, fontFamily: MONO, fontSize: 12 }}>{err}</Text>
          {/permission denied|does not exist|schema cache/i.test(err) && (
            <Text style={{ color: C.body, fontSize: 12 }}>
              Run supabase/02-admin.sql in the SQL editor. It drops and recreates the views —
              the first version used security_invoker and could not read auth.users.
            </Text>
          )}
        </Box>
      )}

      {notAdmin && (
        <Box tone={C.warn}>
          <Text style={{ color: C.warn, fontSize: 13, fontWeight: '600' }}>
            This account is not in public.admins.
          </Text>
          <Text style={{ color: C.body, fontSize: 12 }}>
            The views return an empty set rather than an error, so this would otherwise look
            like an app with no users. {who?.total_profiles ?? '?'} profiles exist.
          </Text>
          {/* ⚠️ SEED BY UID, NOT BY EMAIL. The previous version printed a
              `where email = 'you@example.com'` template, which is one more
              thing to get right while looking at a screen that says something
              is wrong — and it silently inserts nothing if the auth email
              differs from the profile email. The uid below is THIS session's,
              so the statement is correct as written with nothing to edit.

              `on conflict do nothing` so re-running is safe; without it a
              second run errors on the primary key and reads like a new fault. */}
          <Text selectable style={{ color: C.body, fontFamily: MONO, fontSize: 11 }}>
            insert into public.admins (user_id, note){'\n'}
            values (&apos;{who?.uid ?? '<your uid>'}&apos;, &apos;me&apos;){'\n'}
            on conflict (user_id) do nothing;
          </Text>
          <Text style={{ color: C.meta, fontSize: 10 }}>
            Run in the Supabase SQL editor, then pull to refresh.
          </Text>
        </Box>
      )}

      {noUsers && (
        <Box>
          <Text style={{ color: C.body, fontSize: 13 }}>
            You are an admin and there are genuinely no signed-up accounts yet.
          </Text>
        </Box>
      )}

      {totals && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Stat label="Total users" value={totals.total_users ?? 0} tone={C.accent} />
          <Stat label="Pro" value={totals.pro_users ?? 0} tone={C.accent} />
          <Stat label="Free" value={totals.free_users ?? 0} />
          <Stat label="Active 7d" value={totals.active_7d ?? 0} />
          <Stat label="Active 30d" value={totals.active_30d ?? 0} />
          <Stat label="New this week" value={totals.new_7d ?? 0} />
          <Stat label="Ever practised" value={totals.ever_practised ?? 0} />
        </View>
      )}

      {rows.map((r) => (
        <View key={r.id} style={{ backgroundColor: C.card, borderColor: C.border, borderWidth: 1, borderRadius: 10, padding: 12, gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Text style={{ color: C.title, fontSize: 14, fontWeight: '600', flex: 1 }} numberOfLines={1}>
              {r.display_name || r.username || '(no name)'}
            </Text>
            <Text style={{
              color: r.is_pro ? C.accent : C.meta, fontFamily: MONO, fontSize: 11,
              borderColor: r.is_pro ? C.accent : C.border, borderWidth: 1,
              borderRadius: 999, paddingHorizontal: 8, paddingVertical: 1,
            }}>
              {r.is_pro ? 'PRO' : 'free'}
            </Text>
          </View>
          <Text style={{ color: C.body, fontSize: 12 }} numberOfLines={1}>{r.email}</Text>
          <Text style={{ color: C.meta, fontFamily: MONO, fontSize: 11 }}>
            joined {day(r.joined_at)} · last seen {day(r.last_sign_in_at)} · {r.xp ?? 0} XP
          </Text>
        </View>
      ))}

      {!busy && rows.length > 0 && (
        <Text style={{ color: C.meta, fontSize: 11, textAlign: 'center' }}>
          {rows.length} shown{rows.length === 200 ? ' (capped at 200)' : ''}
        </Text>
      )}

      {/* ⚠️ Client-reported, and the screen says so rather than letting a number
          look more authoritative than it is. */}
      <Text style={{ color: C.meta, fontSize: 10, textAlign: 'center', marginTop: 4 }}>
        Pro status is written by the app when it resolves the RevenueCat entitlement.
        Good for counting; never gate on it.
      </Text>
    </ScrollView>
  )
}

export default function AdminUsers() {
  return (
    <AdminGate>
      <AdminUsersInner />
    </AdminGate>
  )
}
