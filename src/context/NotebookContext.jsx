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

  const saveWord = useCallback((wordId, note = '') => {
    setState((s) => ({
      ...s,
      savedWords: {
        ...s.savedWords,
        [wordId]: { note, savedAt: new Date().toISOString() },
      },
    }))
  }, [])

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

  const value = useMemo(
    () => ({
      ...state,
      saveWord, unsaveWord, updateWordNote,
      createNote, updateNote, deleteNote,
    }),
    [state, saveWord, unsaveWord, updateWordNote, createNote, updateNote, deleteNote]
  )

  return <NotebookContext.Provider value={value}>{children}</NotebookContext.Provider>
}

export function useNotebook() {
  const ctx = useContext(NotebookContext)
  if (!ctx) throw new Error('useNotebook must be used inside NotebookProvider')
  return ctx
}
