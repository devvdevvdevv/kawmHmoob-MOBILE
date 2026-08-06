import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import Tabs from '../../src/components/Tabs.jsx'
import TabScreen from '../../src/components/TabScreen.jsx'
import PaywallGate from '../../src/components/common/PaywallGate.jsx'
import { useNotebook } from '../../src/context/NotebookContext.jsx'
import { categories } from '../../src/data/vocabulary.js'
import Button from '../../src/components/ui/Button.jsx'
import ConfirmModal from '../../src/components/common/ConfirmModal.jsx'

const tabs = [
  { id: 'saved', label: 'Saved Words' },
  { id: 'notes', label: 'Notes' },
]

export default function Notebook() {
  const { tab } = useLocalSearchParams()
  return (
    <TabScreen>
      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">Notebook</Text>
        <Text className="text-stone-700">
          A place for words you want to remember and notes from your reading.
        </Text>
      </View>
      <PaywallGate tier="pro" contentLabel="Your notebook is part of Kawm Hmoob Pro">
        <Tabs basePath="/notebook" tabs={tabs} />
        {tab === 'saved' && <SavedWords />}
        {tab === 'notes' && <Notes />}
      </PaywallGate>
    </TabScreen>
  )
}

function SavedWords() {
  const { savedWords, unsaveWord, updateWordNote } = useNotebook()
  const ids = Object.keys(savedWords)
  const router = useRouter()

  const wordById = {}
  for (const cat of categories) {
    for (const w of cat.words) wordById[w.id] = { ...w, _category: cat }
  }

  if (ids.length === 0) {
    return (
      <EmptyState icon="📖" title="No saved words yet" message="From any word's detail page, tap 'Save' to add it here." />
    )
  }

  return (
    <View className="gap-3">
      {ids.map((id) => {
        const w = wordById[id]
        if (!w) return null
        return (
          <SavedWordItem
            key={id}
            word={w}
            entry={savedWords[id]}
            onOpen={() => router.push(`/vocabulary/${w._category.id}/${w.id}`)}
            onUpdate={(note) => updateWordNote(id, note)}
            onRemove={() => unsaveWord(id)}
          />
        )
      })}
    </View>
  )
}

function SavedWordItem({ word, entry, onOpen, onUpdate, onRemove }) {
  const [note, setNote] = useState(entry.note)
  const [editing, setEditing] = useState(false)

  const save = () => { onUpdate(note); setEditing(false) }

  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
      <View className="flex-row items-start justify-between gap-3 mb-3">
        <Pressable onPress={onOpen}>
          <Text className="font-serif text-xl text-clay-700">{word.hmongRPA}</Text>
          <Text className="text-sm text-stone-600">{word.english}</Text>
        </Pressable>
        <Pressable onPress={onRemove}>
          <Text className="text-xs text-stone-500">Remove</Text>
        </Pressable>
      </View>
      {editing ? (
        <View>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Your note about this word…"
            multiline
            numberOfLines={3}
            className="w-full rounded border border-cream-300 bg-cream-50 p-3 text-sm text-stone-900"
          />
          <View className="flex-row gap-2 mt-2">
            <Button onPress={save} size="sm">Save</Button>
            <Button onPress={() => { setNote(entry.note); setEditing(false) }} size="sm" variant="ghost">Cancel</Button>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setEditing(true)}>
          <Text className="text-sm text-stone-700 italic">
            {entry.note || '+ Add a note'}
          </Text>
        </Pressable>
      )}
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
        className="rounded-md bg-cream-50 border border-cream-200 p-5"
      >
        <Text className="font-serif text-xl text-stone-900 mb-1">{note.title || 'Untitled'}</Text>
        {note.body ? <Text className="text-sm text-stone-700">{note.body}</Text> : null}
        <Text className="text-xs text-stone-500 mt-3">Updated {note.updatedAt.slice(0, 10)}</Text>
      </Pressable>
    )
  }

  return (
    <View className="rounded-md bg-cream-50 border border-cream-200 p-5">
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
        className="w-full rounded border border-cream-300 bg-cream-50 px-3 py-2 text-sm text-stone-900"
      />
      <View className="flex-row gap-2 mt-2">
        <Button onPress={save} size="sm">Save</Button>
        <Button onPress={() => { setTitle(note.title); setBody(note.body); setEditing(false) }} size="sm" variant="ghost">
          Cancel
        </Button>
        <Pressable onPress={() => setShowDelete(true)} className="ml-auto self-center">
          <Text className="text-xs text-stone-500">Delete</Text>
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
      <Text className="text-sm text-stone-600 mt-1 text-center">{message}</Text>
    </View>
  )
}
