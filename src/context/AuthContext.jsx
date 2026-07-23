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
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    const uid = data.user?.id
    if (!uid) throw new Error('Sign-up succeeded but no user id was returned')

    const { error: profileError } = await supabase.from('profiles').insert({
      id: uid,
      username,
      display_name: displayName,
      email,
      dialect_preference: dialectPreference || 'white',
    })
    if (profileError) throw profileError

    if (!data.session) return { pendingConfirmation: true, email }
    return hydrateProfile(uid)
  }, [hydrateProfile])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(guestUser)
  }, [])

  const updateProfile = useCallback(async (patch) => {
    const { data: sessData } = await supabase.auth.getSession()
    const uid = sessData?.session?.user?.id
    if (!uid) throw new Error('Not authenticated')

    const dbPatch = {}
    if (patch.username !== undefined) dbPatch.username = patch.username
    if (patch.displayName !== undefined) dbPatch.display_name = patch.displayName
    if (patch.email !== undefined) dbPatch.email = patch.email
    if (patch.dialectPreference !== undefined) dbPatch.dialect_preference = patch.dialectPreference

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
