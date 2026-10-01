// Thin async wrapper around AsyncStorage that mimics the localStorage shape
// (sync read returning JSON, write that takes a value). Used by Notebook/
// Subscription contexts which were originally synchronous against localStorage.
//
// On native there is no synchronous storage, so callers must `await`.

import AsyncStorage from '@react-native-async-storage/async-storage'

export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  } catch {
    // swallow — storage failures shouldn't crash the UI
  }
}
