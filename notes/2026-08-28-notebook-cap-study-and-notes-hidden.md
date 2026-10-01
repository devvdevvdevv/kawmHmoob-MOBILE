# Notebook: 15-word cap, saved-words study deck, Notes tab hidden (2026-08-28)

One pass over the Notebook. The tab is now **saved words only**: a capped, small
deck you can study as flashcards. Free-text notes are switched off (not deleted),
and every word card says what kind of word it is and where you are with it.

Nothing here was removed — every disabled piece is commented out in place, so
switching a feature back on is uncommenting, not rewriting.

## 1. Hard cap: 15 words

`src/context/NotebookContext.jsx`

- `export const NOTEBOOK_WORD_LIMIT = 15` — the single source. Change the number
  there and every surface follows.
- `saveWord(wordId, note)` now **returns a boolean**: `false` only when the
  notebook is full AND the word isn't already in it. Re-saving a word that's
  already saved is a no-op that returns `true`, so it can never trip the cap.
- The context also exposes derived state so no screen counts keys itself:
  `savedWordCount`, `wordLimit`, `isWordLimitReached`.

**Why a cap at all:** the notebook is about to get its own study deck and (later)
its own quiz, built ONLY from these words. A deck has to stay finishable in one
sitting — an uncapped notebook makes both features meaningless.

**Why in the context, not the UI:** unlike the Pro lock (see
[2026-08-06-notebook-pro-lock], deliberately enforced in components), the cap is a
property of the data, not of who the user is. It has no provider-order problem —
`NotebookContext` needs nothing from `SubscriptionContext` to count its own words.

### The one write surface

`src/components/vocabulary/WordDetail.jsx` is the only caller of `saveWord`. It now
reads the return value:

- `setLimitHit(!saveWord(word.id))` — a refused tap sets a flag.
- The flag renders a line under the button: *"Notebook is full (15/15). Remove a
  word to add this one."*
- Shown only **after a tap that did nothing** — the button stays live and the count
  never nags on every word.
- `useEffect(() => setLimitHit(false), [wordId])` clears it when you open a
  different word; the warning belongs to the tap, not the screen.

## 2. Study mode on the saved tab

`app/notebook/[tab].jsx` → `SavedWords()`

A **List / Study** toggle, mirroring a vocabulary category's List / Study Mode. The
saved-word count (`12 / 15 words saved`) sits opposite it.

Study mode reuses `src/components/vocabulary/Flashcard.jsx` unchanged — same flip,
same status badge, same Mark Learning/Known — just fed from the notebook instead of
`cat.words`. **No quiz.** At the end of the deck the arrow becomes a restart button
only, where a category's deck offers "Take the quiz". A notebook quiz is the next
piece of this feature; it doesn't exist yet, so nothing links to one.

### The deck skips dead ids

```js
const deck = Object.keys(savedWords).map((id) => wordById[id]).filter(Boolean)
```

A saved id can outlive its word (renamed or dropped from `vocabulary.js`). Building
the deck from ids that still resolve means the counter and arrows can't run off the
end. Note the header count is `savedWordCount` (ALL saved ids) while the deck
counter is `deck.length` — deliberate: the cap counts what's stored, the deck counts
what's showable.

### Shared deck icons

`ArrowLeftIcon` / `ArrowRightIcon` / `RefreshIcon` were local to `VocabList.jsx`.
Both decks need them, so they moved to `src/components/common/DeckNavIcons.jsx`
and `VocabList` imports them from there. Same paths, same 24x24 / 2px stroke; RN SVG
has no `currentColor`, so the color is still passed in from the active theme.

## 3. Notes tab — hidden, not deleted

- `app/notebook/[tab].jsx`: the `{ id: 'notes', label: 'Notes' }` tab entry and its
  `{tab === 'notes' && <Notes />}` render line are commented out. The `Notes` and
  `NoteItem` components stay in the file, fully styled — uncomment two lines to
  bring the tab back.
- **Per-word notes** are commented out too: the `note`/`editing` state, the `save`
  handler, the `onUpdate` prop, and the TextInput / `+ Add a note` block.
  `updateWordNote` stays on the context, commented out of the destructure.
- `src/components/home/TodayCard.jsx` linked to `/notebook/notes`, which would now
  land on an empty tab. Repointed to `/notebook/saved` with the old label and path
  commented directly above it. **Restore both lines when the Notes tab returns.**
- `app/(tabs)/index.jsx` home tile blurb said "Saved words and your own notes." —
  now "Save up to 15 words and study them.", old line commented above it.
- `src/data/pageInfo.js` `/notebook` copy no longer promises notes; the old line is
  commented above the new one.

## 4. What a saved word card shows now

Replacing the note, each card carries two facts:

- **Status flag** (top-right, above Remove) — New / Learning / Known, read from
  `vocabProgress[wordId]`, reusing the exact colors of `VocabList`'s `StatusPill` so
  a word reads the same in both places.
- **Category + part of speech** where `+ Add a note` used to sit, e.g.
  `👕 Hmong Clothing Words · adjective`.

Part of speech has no field in the data — `noun` / `verb` / `adjective` etc. live in
each word's `tags` array (see [2026-08-18-vocabulary-head-face-category]), so
`partOfSpeechOf()` returns the first tag matching a known parts-of-speech list.
Words without such a tag show the category alone.

## 5. Fonts

The page was mostly rendering in the system face: an RN `<Text>` with no font class
does NOT get Nunito. Every text node on the Notebook page (saved words AND the
hidden Notes components) now names one — `font-sans` for body, `font-serif` for
headings/word titles.

**Watch this one:** `font-semibold` on `font-sans` does nothing on Android.
expo-google-fonts registers each weight as a separate family and `tailwind.config.js`
maps only `NunitoSans_400Regular` to `font-sans`. For bold small text use
`font-serif` (which is `Nunito_700Bold`) — that's what the status pill does now.

Still on the system font, left alone because they're shared and would shift type
app-wide: `src/components/Tabs.jsx` labels, and `src/components/ui/Button.jsx`
(which sets its font inline).

## 6. Audio file field hidden

`WordDetail.jsx` had `{__DEV__ && <Field label="Audio file">…</Field>}` — already
invisible in release builds, now commented out entirely so it isn't on screen in dev
either.

## Next

- Notebook quiz, drawn from the saved words (the reason the cap exists).
- The cap is per-notebook and local-only; if saved words ever sync to Supabase, the
  limit needs to be enforced server-side too.

Related: [2026-08-06-notebook-pro-lock],
[2026-08-05-audit-cleanup-notebook-alert-and-dead-code],
[2026-07-29-flashcard-status-badge], [2026-07-31-tabs-controlled-mode].
