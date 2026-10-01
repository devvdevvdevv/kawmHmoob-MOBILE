import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useAuth } from './AuthContext.jsx'
import { loadJSON, saveJSON } from '../lib/storage.js'

const NotebookContext = createContext(null)
const KEY_PREFIX = 'kawmhmoob.notebook.'

const initialState = {
  savedWords: {},
  notes: [],
}

function newId(prefix = 'note') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

// A notebook holds at most 25 words (was 15 until 2026-09-23). The cap is
// deliberate: the notebook is about to grow its own study deck (and later a
// quiz) built ONLY from these words, and that deck has to stay small enough to
// finish in one sitting. 25 is still one sitting; it is the ceiling that keeps
// this a shortlist rather than a second vocabulary tab. Raise the number here
// and every surface below follows — but the COPY does not: grep for the old
// number in src/data/pageInfo.js and app/(tabs)/index.jsx.
export const NOTEBOOK_WORD_LIMIT = 25

export function NotebookProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || 'guest'
  const [state, setState] = useState(initialState)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let active = true
    setHydrated(false)
    loadJSON(KEY_PREFIX + userId, initialState).then((next) => {
      if (!active) return
      setState({ ...initialState, ...next })
      setHydrated(true)
    })
    return () => { active = false }
  }, [userId])

  useEffect(() => {
    if (!hydrated) return
    saveJSON(KEY_PREFIX + userId, state)
  }, [userId, state, hydrated])

  // Returns false when the notebook is full and the word ISN'T already in it, so
  // the caller can say why nothing happened. Re-saving a word that's already
  // there is a no-op that still returns true — it never trips the cap.
  const saveWord = useCallback((wordId, note = '') => {
    if (state.savedWords[wordId]) return true
    if (Object.keys(state.savedWords).length >= NOTEBOOK_WORD_LIMIT) return false
    setState((s) => ({
      ...s,
      savedWords: {
        ...s.savedWords,
        [wordId]: { note, savedAt: new Date().toISOString() },
      },
    }))
    return true
  }, [state.savedWords])

  const unsaveWord = useCallback((wordId) => {
    setState((s) => {
      const next = { ...s.savedWords }
      delete next[wordId]
      return { ...s, savedWords: next }
    })
  }, [])

  const updateWordNote = useCallback((wordId, note) => {
    setState((s) => {
      if (!s.savedWords[wordId]) return s
      return {
        ...s,
        savedWords: {
          ...s.savedWords,
          [wordId]: { ...s.savedWords[wordId], note },
        },
      }
    })
  }, [])

  const createNote = useCallback((data = {}) => {
    const note = {
      id: newId(),
      title: data.title || '',
      body: data.body || '',
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setState((s) => ({ ...s, notes: [note, ...s.notes] }))
    return note.id
  }, [])

  const updateNote = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      notes: s.notes.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
      ),
    }))
  }, [])

  const deleteNote = useCallback((id) => {
    setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }))
  }, [])

  const savedWordCount = Object.keys(state.savedWords).length

  const value = useMemo(
    () => ({
      ...state,
      // Derived cap state, so no screen has to count keys itself.
      savedWordCount,
      wordLimit: NOTEBOOK_WORD_LIMIT,
      isWordLimitReached: savedWordCount >= NOTEBOOK_WORD_LIMIT,
      saveWord, unsaveWord, updateWordNote,
      createNote, updateNote, deleteNote,
    }),
    [state, savedWordCount, saveWord, unsaveWord, updateWordNote, createNote, updateNote, deleteNote]
  )

  return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>
}

export function useNotebook() {
  const ctx = useContext(NotebookContext)
  if (!ctx) throw new Error('useNotebook must be used inside NotebookProvider')
  return ctx
}
