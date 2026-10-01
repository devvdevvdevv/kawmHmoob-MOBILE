import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import Tabs from '../../src/components/Tabs.jsx'
import TabScreen from '../../src/components/TabScreen.jsx'
import PaywallGate from '../../src/components/common/PaywallGate.jsx'
import { useNotebook } from '../../src/context/NotebookContext.jsx'
import { useProgress } from '../../src/hooks/useProgress.js'
import { useTheme } from '../../src/context/ThemeContext.jsx'
import { THEME_TOKENS } from '../../src/lib/themes.js'
import Flashcard from '../../src/components/vocabulary/Flashcard.jsx'
import { ArrowLeftIcon, ArrowRightIcon, RefreshIcon } from '../../src/components/common/DeckNavIcons.jsx'
import { categories } from '../../src/data/vocabulary.js'
import Button from '../../src/components/ui/Button.jsx'
import ConfirmModal from '../../src/components/common/ConfirmModal.jsx'
// ⚠️ allSenses, NOT word.english. The notebook is a personal dictionary with no
// category context, and `english` is now the narrowed in-category gloss — so
// rendering it raw here would quietly drop senses this screen used to show.
import { allSenses } from '../../src/lib/senses.js'


// ⚠️ CARD BORDER REMOVED HERE — 2026-08-29. The 1px cream hairline
// (`border` + `border-cream-200`) read too dark on cream; shadow-warm and the
// background contrast do the separating now.
//
// A className is a STRING — one class inside it cannot be commented out, so the
// token was deleted and this note is the record.
// TO RESTORE: re-add those two classes to the card classNames below.
const tabs = [
  { id: 'saved', label: 'Saved Words' },
  // { id: 'notes', label: 'Notes' },
]

export default function Notebook() {
  const { tab } = useLocalSearchParams()
  return (
    <TabScreen>
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Notebook</Text>
        <Text className="font-sans text-stone-700">
          A place for words you want to remember and notes from your reading.
        </Text>
      </View>
      <PaywallGate tier="pro" contentLabel="Your notebook is part of KawmHmong Pro">
        <Tabs basePath="/notebook" tabs={tabs} />
        {tab === 'saved' && <SavedWords />}
        {/* {tab === 'notes' && <Notes />} */}
      </PaywallGate>
    </TabScreen>
  )
}

// The saved tab has two modes, mirroring a vocabulary category: the LIST of saved
// words, and STUDY — the same Flashcard deck, built from the notebook instead of a
// category. No quiz here yet; that comes later.
function SavedWords() {
  const { savedWords, unsaveWord, savedWordCount, wordLimit /* , updateWordNote */ } = useNotebook()
  const { vocabProgress } = useProgress()
  const { theme } = useTheme()
  const [mode, setMode] = useState('list')
  const [cardIdx, setCardIdx] = useState(0)
  const router = useRouter()

  const tk = THEME_TOKENS[theme] || THEME_TOKENS.light
  const inkColor = `rgb(${tk['--c-stone-800']})`
  const creamColor = `rgb(${tk['--c-cream-50']})`

  const wordById = {}
  for (const cat of categories) {
    for (const w of cat.words) wordById[w.id] = { ...w, _category: cat }
  }

  // Saved ids can outlive the word they point at (a word renamed or dropped from
  // vocabulary.js), so the deck is built from the ids that still resolve — that
  // way the card counter and the arrows can never run off the end.
  const deck = Object.keys(savedWords).map((id) => wordById[id]).filter(Boolean)

  if (deck.length === 0) {
    return (
      <EmptyState icon="📖" title="No saved words yet" message="From any word's detail page, tap 'Save' to add it here." />
    )
  }

  const card = deck[Math.min(cardIdx, deck.length - 1)]

  return (
    <View>
      <View className="flex-row flex-wrap items-center justify-between gap-3 mb-4">
        {/* The cap is shown as a count, not a warning — it only reads as a limit
            once you're near it. */}
        <Text className="font-sans text-sm text-stone-600">
          {savedWordCount} / {wordLimit} words saved
        </Text>
        <View className="flex-row gap-1 rounded bg-cream-100 p-1">
          <Pressable
            onPress={() => setMode('list')}
            className={`px-3 py-1.5 rounded-sm ${mode === 'list' ? 'bg-cream-50 shadow-warm' : ''}`}
          >
            <Text className={`text-sm ${mode === 'list' ? 'font-serif text-clay-700' : 'font-sans text-stone-600'}`}>List</Text>
          </Pressable>
          <Pressable
            onPress={() => { setMode('flashcard'); setCardIdx(0) }}
            className={`px-3 py-1.5 rounded-sm ${mode === 'flashcard' ? 'bg-cream-50 shadow-warm' : ''}`}
          >
            <Text className={`text-sm ${mode === 'flashcard' ? 'font-serif text-clay-700' : 'font-sans text-stone-600'}`}>Study</Text>
          </Pressable>
        </View>
      </View>

      {mode === 'list' && (
        <View className="gap-3">
          {deck.map((w) => (
            <SavedWordItem
              key={w.id}
              word={w}
              entry={savedWords[w.id]}
              status={vocabProgress[w.id] || 'new'}
              onOpen={() => router.push(`/vocabulary/${w._category.id}/${w.id}`)}
              // onUpdate={(note) => updateWordNote(w.id, note)}
              onRemove={() => unsaveWord(w.id)}
            />
          ))}
        </View>
      )}

      {mode === 'flashcard' && (
        <View>
          <Flashcard word={card} />

          {/* Same deck controls as a category's study mode, minus the quiz link
              at the end — a notebook quiz doesn't exist yet. Restart only. */}
          <View className="flex-row justify-between items-center mt-4 gap-3">
            <Pressable
              onPress={() => setCardIdx((i) => Math.max(0, i - 1))}
              disabled={cardIdx === 0}
              className={`h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300 ${cardIdx === 0 ? 'opacity-40' : ''}`}
            >
              <ArrowLeftIcon color={inkColor} />
            </Pressable>

            <Text className="font-sans text-sm text-stone-700">
              {Math.min(cardIdx, deck.length - 1) + 1} / {deck.length}
            </Text>

            {cardIdx >= deck.length - 1 ? (
              <Pressable
                onPress={() => setCardIdx(0)}
                className="h-12 w-12 rounded-full bg-cream-200 items-center justify-center active:bg-cream-300"
              >
                <RefreshIcon color={inkColor} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setCardIdx((i) => Math.min(deck.length - 1, i + 1))}
                className="h-12 w-12 rounded-full bg-clay-600 items-center justify-center active:bg-clay-700"
              >
                <ArrowRightIcon color={creamColor} />
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  )
}

// Part-of-speech tags a word may carry, most specific first. Words are tagged in
// vocabulary.js (e.g. tags: ['adjective', 'clothing']); the first match is shown
// next to the topic category so a saved word says what kind of word it is.
const PARTS_OF_SPEECH = [
  'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'classifier',
  'number', 'quantifier', 'conjunction', 'particle', 'preposition', 'phrase',
]

function partOfSpeechOf(word) {
  return (word.tags || []).find((t) => PARTS_OF_SPEECH.includes(t)) || null
}

function SavedWordItem({ word, entry, status, onOpen, onUpdate, onRemove }) {
  // Per-word notes are hidden for now — kept here so they can be switched back on.
  // const [note, setNote] = useState(entry.note)
  // const [editing, setEditing] = useState(false)
  // const save = () => { onUpdate(note); setEditing(false) }

  const pos = partOfSpeechOf(word)

  return (
    <View className="rounded-md bg-cream-50 p-5">
      <View className="flex-row items-start justify-between gap-3">
        <Pressable onPress={onOpen} className="flex-1">
          <Text className="font-serif text-xl text-clay-700">{word.hmongRPA}</Text>
          <Text className="font-sans text-sm text-stone-600">{allSenses(word).join(' · ')}</Text>
        </Pressable>
        <View className="items-end gap-2">
          <StatusPill status={status} />
          <Pressable onPress={onRemove}>
            <Text className="font-sans text-xs text-stone-500">Remove</Text>
          </Pressable>
        </View>
      </View>

      {/* Where the note used to sit: the word's category, plus its part of
          speech when it has one. */}
      <Text className="font-sans text-sm text-stone-600 mt-3">
        {word._category.emoji ? `${word._category.emoji} ` : ''}
        {word._category.title}
        {pos ? ` · ${pos}` : ''}
      </Text>

      {/* {editing ? (
        <View className="mt-3">
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Your note about this word…"
            multiline
            numberOfLines={3}
            className="w-full rounded border border-cream-300 bg-cream-50 p-3 font-sans text-sm text-stone-900"
          />
          <View className="flex-row gap-2 mt-2">
            <Button onPress={save} size="sm">Save</Button>
            <Button onPress={() => { setNote(entry.note); setEditing(false) }} size="sm" variant="ghost">Cancel</Button>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setEditing(true)} className="mt-3">
          <Text className="font-sans text-sm text-stone-700 italic">
            {entry.note || '+ Add a note'}
          </Text>
        </Pressable>
      )} */}
    </View>
  )
}

// Same three states (and colors) the vocabulary list uses, so a word reads the
// same here as it does in its category.
function StatusPill({ status }) {
  const styles = {
    known: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Known' },
    learning: { bg: 'bg-cream-200', text: 'text-clay-700', label: 'Learning' },
    new: { bg: 'bg-cream-100', text: 'text-stone-600', label: 'New' },
  }
  const s = styles[status] || styles.new
  return (
    <View className={`px-2.5 py-1 rounded-full ${s.bg}`}>
      <Text className={`font-serif text-xs ${s.text}`}>{s.label}</Text>
    </View>
  )
}

function Notes() {
  const { notes, createNote } = useNotebook()

  return (
    <View>
      <View className="flex-row justify-end mb-3">
        <Button onPress={() => createNote({ title: 'Untitled note', body: '' })}>
          + New Note
        </Button>
      </View>
      {notes.length === 0 ? (
        <EmptyState icon="📝" title="No notes yet" message="Tap 'New Note' to start writing." />
      ) : (
        <View className="gap-3">
          {notes.map((n) => (<NoteItem key={n.id} note={n} />))}
        </View>
      )}
    </View>
  )
}

function NoteItem({ note }) {
  const { updateNote, deleteNote } = useNotebook()
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  const [showDelete, setShowDelete] = useState(false)

  const save = () => { updateNote(note.id, { title, body }); setEditing(false) }

  if (!editing) {
    return (
      <Pressable
        onPress={() => setEditing(true)}
        className="rounded-md bg-cream-50 p-5"
      >
        <Text className="font-serif text-xl text-stone-900 mb-1">{note.title || 'Untitled'}</Text>
        {note.body ? <Text className="font-sans text-sm text-stone-700">{note.body}</Text> : null}
        <Text className="font-sans text-xs text-stone-500 mt-3">Updated {note.updatedAt.slice(0, 10)}</Text>
      </Pressable>
    )
  }

  return (
    <View className="rounded-md bg-cream-50 p-5">
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 font-serif text-base text-stone-900 mb-2"
      />
      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Write here…"
        multiline
        numberOfLines={6}
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 font-sans text-sm text-stone-900"
      />
      <View className="flex-row gap-2 mt-2">
        <Button onPress={save} size="sm">Save</Button>
        <Button onPress={() => { setTitle(note.title); setBody(note.body); setEditing(false) }} size="sm" variant="ghost">
          Cancel
        </Button>
        <Pressable onPress={() => setShowDelete(true)} className="ml-auto self-center">
          <Text className="font-sans text-xs text-stone-500">Delete</Text>
        </Pressable>
      </View>

      {/* Web-safe confirm (Alert.alert doesn't render on web) */}
      <ConfirmModal
        visible={showDelete}
        title="Delete this note?"
        message="This can't be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={() => { deleteNote(note.id); setShowDelete(false) }}
        onCancel={() => setShowDelete(false)}
      />
    </View>
  )
}

function EmptyState({ icon, title, message }) {
  return (
    <View className="rounded-md border-2 border-dashed border-cream-400 bg-cream-50/60 p-10 items-center">
      <Text className="text-5xl mb-3">{icon}</Text>
      <Text className="font-serif text-xl text-stone-900">{title}</Text>
      <Text className="font-sans text-sm text-stone-600 mt-1 text-center">{message}</Text>
    </View>
  )
}
