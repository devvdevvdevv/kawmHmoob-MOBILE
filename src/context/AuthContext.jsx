import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

// Auth + profile via Supabase. Same external API as the web version — only
// the session storage adapter (AsyncStorage) differs, and that's configured
// in src/lib/supabase.js.

const AuthContext = createContext(null)

const guestUser = {
  id: 'guest',
  username: 'guest',
  displayName: 'Guest',
  email: '',
  dialectPreference: 'white',
  joinedAt: null,
  isGuest: true,
}

function rowToUser(row) {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    email: row.email,
    dialectPreference: row.dialect_preference,
    joinedAt: row.joined_at,
    onboardedAt: row.onboarded_at,
    isGuest: false,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(guestUser)
  const [loading, setLoading] = useState(true)

  const hydrateProfile = useCallback(async (uid) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    if (error || !data) {
      setUser(guestUser)
      return null
    }
    const next = rowToUser(data)
    setUser(next)
    return next
  }, [])

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      const session = data?.session
      if (session) hydrateProfile(session.user.id).finally(() => setLoading(false))
      else { setUser(guestUser); setLoading(false) }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      if (session) hydrateProfile(session.user.id)
      else setUser(guestUser)
    })

    return () => {
      active = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [hydrateProfile])

  const login = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return hydrateProfile(data.user.id)
  }, [hydrateProfile])

  const register = useCallback(async ({ email, password, username, displayName, dialectPreference }) => {
    // Pass the profile fields as sign-up METADATA so the DB trigger
    // (handle_new_user) creates the profile row with them, atomically.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName || '',
          dialect_preference: dialectPreference || 'white',
        },
      },
    })
    if (error) throw error

    const uid = data.user?.id
    if (!uid) throw new Error('Sign-up succeeded but no user id was returned')

    // The trigger already inserted the profile, so a plain .insert() here throws
    // "duplicate key value violates unique constraint profiles_pkey". UPSERT
    // instead, and only when we actually have a session (RLS on the row needs
    // auth.uid() === id).
    if (data.session) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          { id: uid, username, display_name: displayName || '', email, dialect_preference: dialectPreference || 'white' },
          { onConflict: 'id' }
        )
      if (profileError) throw profileError
      return hydrateProfile(uid)
    }

    // Email confirmation is on → no session yet. The trigger populated the row
    // from the metadata above, so there's nothing else to write right now.
    return { pendingConfirmation: true, email }
  }, [hydrateProfile])

  const logout = useCallback(async () => {
    // Never reject: signOut can error when there's no session (guest / already
    // signed out) or offline. Logging out must ALWAYS land you at the guest state,
    // so swallow any error and reset regardless. (An unhandled reject here showed
    // up as "Uncaught (in promise) Not authenticated".)
    try { await supabase.auth.signOut() } catch {}
    setUser(guestUser)
  }, [])

  const updateProfile = useCallback(async (patch) => {
    const { data: sessData } = await supabase.auth.getSession()
    const uid = sessData?.session?.user?.id
    if (!uid) {
      // No session — a guest, or a session that expired out from under us. There's
      // no server row to write (RLS would reject it anyway), so apply the patch to
      // LOCAL state only. This makes e.g. the Settings dialect Picker work for
      // guests instead of throwing an uncaught "Not authenticated". Server-only
      // fields (onboardedAt, age, etc.) simply don't persist without an account.
      const localFields = {}
      if (patch.username !== undefined) localFields.username = patch.username
      if (patch.displayName !== undefined) localFields.displayName = patch.displayName
      if (patch.email !== undefined) localFields.email = patch.email
      if (patch.dialectPreference !== undefined) localFields.dialectPreference = patch.dialectPreference
      let next = null
      setUser((u) => (next = { ...u, ...localFields }))
      return next
    }

    const dbPatch = {}
    if (patch.username !== undefined) dbPatch.username = patch.username
    if (patch.displayName !== undefined) dbPatch.display_name = patch.displayName
    if (patch.email !== undefined) dbPatch.email = patch.email
    if (patch.dialectPreference !== undefined) dbPatch.dialect_preference = patch.dialectPreference
    // Optional onboarding metadata (same columns as the web app's profiles table).
    if (patch.ageRange !== undefined) dbPatch.age_range = patch.ageRange
    if (patch.gender !== undefined) dbPatch.gender = patch.gender
    if (patch.ethnicity !== undefined) dbPatch.ethnicity = patch.ethnicity
    if (patch.hmongRelationship !== undefined) dbPatch.hmong_relationship = patch.hmongRelationship
    if (patch.region !== undefined) dbPatch.region = patch.region
    if (patch.onboardedAt !== undefined) dbPatch.onboarded_at = patch.onboardedAt

    const { data, error } = await supabase
      .from('profiles')
      .update(dbPatch)
      .eq('id', uid)
      .select()
      .single()
    if (error) throw error

    const next = rowToUser(data)
    setUser(next)
    return next
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
