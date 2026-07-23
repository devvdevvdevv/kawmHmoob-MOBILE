// Supabase client for Expo / React Native (+ web).
//
// Differences from the web-only version:
//   - Reads env via process.env.EXPO_PUBLIC_* (not import.meta.env).
//   - Uses AsyncStorage as the auth storage adapter, since RN has no localStorage.
//   - Polyfills `URL` via react-native-url-polyfill for the native runtime.
//
// The stub client + isSupabaseConfigured() behavior is unchanged so the rest
// of the app can run with no env file (every call errors gracefully).

import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export function isSupabaseConfigured() {
  return Boolean(url && anonKey)
}

function stubResult(message) {
  return Promise.resolve({
    data: null,
    error: { message: `Supabase not configured: ${message}` },
  })
}

const stubClient = {
  auth: {
    getSession: () => stubResult('auth.getSession'),
    signInWithPassword: () => stubResult('auth.signInWithPassword'),
    signUp: () => stubResult('auth.signUp'),
    signOut: () => stubResult('auth.signOut'),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table) => ({
    select: () => stubResult(`from(${table}).select`),
    insert: () => stubResult(`from(${table}).insert`),
    update: () => stubResult(`from(${table}).update`),
    upsert: () => stubResult(`from(${table}).upsert`),
    delete: () => stubResult(`from(${table}).delete`),
    eq: function () { return this },
    single: function () { return this },
  }),
}

export const supabase = isSupabaseConfigured()
  ? createClient(url, anonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : stubClient
