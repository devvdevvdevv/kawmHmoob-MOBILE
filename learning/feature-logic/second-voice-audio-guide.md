# Guide: adding a second voice — how Emily's recordings were wired in

Built 2026-10-24, when the first second-speaker recordings arrived: Emily
(female) reading the double consonants. This walks through every step in the
order it happened, then hands you the next group to wire yourself.

Read it with these files open:
`src/lib/voicePrefs.js` · `src/data/reference.js` (the `consonants` list) ·
`src/components/reference/LetterGrid.jsx` · `src/components/reference/VoiceToggle.jsx` ·
`scripts/generate-audio-map.js`

---

## The picture first

A letter tile has always had ONE clip:

```js
{ letter: 'ch', sound: 'ch', audio: '/assets/audio/…/Ch-redo.wav' }
```

The job was: give some letters a SECOND clip, let the learner choose which voice
they hear, and change nothing for letters that only have one.

That breaks into five pieces, and each one exists for a reason:

```
 recording on disk ─▶ bundled in the app ─▶ named in the data ─▶ chosen by a preference ─▶ played by the button
   (Emily's folder)     (assets + audioMap)   (audioFemale)        (voicePrefs.js)            (LetterGrid)
```

---

## Step 1 — get the files INTO the app

Emily's recordings lived outside the project:

```
Documents/Hmong-Language-Dataset/Emily/Consonants/Double Consonants/Saved Doubles Oct 24/emily-ch.wav …
```

They were copied to `assets/audio/consonants/double-consonants/female/`.

**Why copy, not link?** A phone has no access to your Documents folder. Anything
the app plays offline has to be INSIDE the project, under `assets/`, so it ships
in the APK.

**Why a `female/` subfolder?** Every existing file in `double-consonants/` is the
male voice, unlabelled. A subfolder keeps the second voice obviously separate and
means no filename can collide with an existing one.

## Step 2 — bundle them: the audio map

The data stores web-style paths:

```js
audio: '/assets/audio/consonants/double-consonants/female/emily-ch.wav'
```

A path is just a string. The phone needs an actual bundled file. The bridge is
`src/lib/audioMap.js`, which looks like this:

```js
export const AUDIO_MAP = {
  '/assets/audio/…/female/emily-ch.wav': require('../../assets/audio/…/female/emily-ch.wav'),
  // …one line per file
}
```

**Why one line per file, and why generated?** Metro (the bundler) only includes a
file when it sees a `require()` with a LITERAL string. You cannot write
`require(somePath)` with a variable — Metro reads the code before it runs, so it
cannot know what the variable will be. So a script writes a literal `require` for
every audio file:

```bash
node scripts/generate-audio-map.js     # 485 → 506 entries
```

**Rule:** add audio files → run the script. Forget it and the path resolves to
nothing, and the button quietly does nothing.

## Step 3 — name the second clip in the data

One field was added beside the existing one:

```js
{ letter: 'ch', sound: 'ch',
  audio:       '/assets/audio/…/double-consonants/Ch-redo.wav',
  audioFemale: '/assets/audio/…/double-consonants/female/emily-ch.wav' },
```

**Why ADD a field instead of renaming `audio` to `audioMale`?** Because `audio` is
read in many places — `LetterGrid`, the Speak word families, the typing drill. A
rename means editing all of them at once and breaking any you miss. Adding
`audioFemale` touches nothing that already works. `audio` simply *becomes* "the
default voice", which it always was.

18 doubles got `audioFemale`. `hm` did not — Emily has no recording of it — and
it says so in a comment above the line, so the gap is visible to the next reader.

## Step 4 — choose a clip: `pickVoice`

```js
export function pickVoice(item, voice) {
  if (!item) return null
  if (voice === 'female' && item.audioFemale) return item.audioFemale
  return item.audio || item.audioFemale || null
}
```

Read it as three cases:

| voice | item has `audioFemale`? | plays |
|---|---|---|
| female | yes | Emily |
| female | no (`hm`, every vowel…) | the male clip |
| male | either | the male clip |

**The fallback is the important decision.** Picking Female on a letter Emily
hasn't recorded plays the male clip instead of greying the button out.

That might look like the vowel-tone fallback that was *removed* on 2026-10-20 —
so why is this one fine? Ask what the fallback plays:

- **The removed one** played a *different word* when a syllable's clip was
  missing. The learner heard the wrong sound. That teaches something false.
- **This one** plays the *same sound in the other voice*. The content is right
  either way; only the speaker changes.

> A fallback is fine when it is still correct. It is a bug when it is
> plausible but wrong.

## Step 5 — remember the choice: the preference

The voice has to survive closing the app, so it is saved with `saveJSON` under
`kawmhmoob.audio.voice` — the same storage every other preference uses.

**And here is where the first version broke.** Read the next section slowly; it
is the real lesson in this guide.

---

## ⚠️ The bug: "I cannot hear Emily's voice"

The first `voicePrefs.js` was copied from `readingPrefs.js`:

```js
export function useVoicePrefs() {
  const [voice, setVoiceState] = useState('male')   // ← lives INSIDE the hook
  // …load from storage, setVoice saves…
  return { voice, setVoice }
}
```

Two components called it:

```
reference.jsx  ── useVoicePrefs() ── its OWN voice ── drives the toggle pills
LetterGrid     ── useVoicePrefs() ── its OWN voice ── picks the clip
```

Tap **Female**:

1. The toggle's copy becomes `'female'` → the pill turns clay. ✓
2. It is saved to storage. ✓
3. The grid's copy is still `'male'` — read once, when it mounted. ✗
4. The button plays the male clip.

Everything *looked* right, which is what made it hard: no error, the pill
responded, the file was there. The audio was simply coming from the other copy.

**Why `readingPrefs` gets away with it:** only one component reads the reading
size at a time, so there is only ever one copy. The voice has a *writer* (the
toggle) and a *reader* (the grid) on screen together. Two copies, and they drift.

### The fix: one value, many readers

```js
let current = 'male'            // ONE value, at module scope
const listeners = new Set()

export function setVoice(next) {
  current = next
  for (const l of listeners) l()   // tell everyone
  saveJSON(KEY, next)
}

export function useVoicePrefs() {
  const voice = useSyncExternalStore(subscribe, () => current)
  return { voice, setVoice }
}
```

`useSyncExternalStore` is React's built-in way to say "this value lives outside
React; re-render me when it changes." Every component subscribes to the SAME
`current`. Change it once, everyone re-renders.

This is the exact shape `useAudio.js` already used for the single audio player —
see [hook-state-vs-one-device-resource.md](../concepts/hook-state-vs-one-device-resource.md),
which now has a section on this bug.

---

## Step 6 — the toggle and the grid

`VoiceToggle.jsx` is two pills. `reference.jsx` reads `{ voice, setVoice }` and
passes them in. `LetterGrid.jsx` reads `voice` itself and changes one line:

```jsx
<AudioButton audioSrc={pickVoice(it, voice)} wordId={it.letter} />
```

**Why does the toggle sit above ALL the consonant groups**, when only Double has
a second voice? Because `pickVoice` already does the right thing everywhere —
singles fall back to male. Scoping the toggle to Double would have been more
precise today and wrong the moment Emily records the singles.

---

## Step 7 — the letters that weren't in the list

Emily also recorded `ml`, `nk` and `nr`, which the app did not list at all. The
full inventory (17 / 22 / 14 / 3) showed they belonged, so they were added — with
one twist:

```js
{ letter: 'nr', sound: 'ndr',
  audio:       '/assets/audio/…/female/emily-nr.wav',   // ← Emily here too
  audioFemale: '/assets/audio/…/female/emily-nr.wav' },
```

**Why does `audio` point at Emily?** There was no male recording yet. And not
every screen goes through `pickVoice` — `wordFamilies.js` builds the Speak drill
by reading `c.audio` directly when the app starts. An empty `audio` there would be
a drill item with no sound. Pointing both fields at the one recording that exists
means every screen plays something real. When a male clip arrives, it replaces
`audio`.

**And that is exactly what happened next (2026-10-25):** the male redos landed,
and the change was one path per letter —

```js
{ letter: 'nr', sound: 'ndr',
  audio:       '/assets/audio/…/double-consonants/nr-redo.wav',   // ← now the male voice
  audioFemale: '/assets/audio/…/female/emily-nr.wav' },
```

Nothing else moved. That is the payoff of the stopgap: it kept every screen
working without blocking on a recording, and undoing it was a data edit.

### A trap the next batch hit: filename case

Emily's triples arrived as a mix of `Emily-hml.wav`, `emily-nch.wav` and a bare
`ntxh.wav`. They were all copied in as lowercase `emily-<letter>.wav`. **Windows
ignores filename case; the Android bundle does not.** A path that said
`emily-hml.wav` while the file was `Emily-hml.wav` would play on your machine and
be silent on a phone. Normalise names when you copy, not after something breaks.

---

## What it does NOT reach yet

The Speak double-consonant drill still plays the male voice only. `wordFamilies.js`
reads `c.audio` once, at load, into a plain object — no React, no subscription —
so a preference changed later can never reach it. Fixing that means choosing the
clip when the Speak screen RENDERS (`pickVoice(word, voice)` in the component)
instead of baking one path in at load.

---

## Your turn

Emily records the **single consonants** next. Wire them in yourself:

1. Where do the files go, and what do you run after copying them?
2. Which field do you add to each single in `reference.js`, and what do you leave
   alone?
3. Do you need to change `LetterGrid`, `VoiceToggle` or `voicePrefs.js`? Why?
4. One single has no recording from Emily. What happens when a learner picks
   Female and taps it?
5. **Harder:** make the Speak drill voice-aware. Where does `pickVoice` need to be
   called, and why can it not be called inside `wordFamilies.js`?

<details>
<summary>Answers</summary>

1. `assets/audio/consonants/single-consonants/female/`, then
   `node scripts/generate-audio-map.js`. Restart Metro with `npx expo start -c`
   so it notices the new files.
2. Add `audioFemale: '/assets/audio/consonants/single-consonants/female/emily-x.wav'`.
   Leave `audio` alone — it is the male voice, and other screens read it.
3. No. That is the payoff of the design: `pickVoice` and the shared preference
   already handle any item with an `audioFemale`. New recordings are a DATA
   change only.
4. `pickVoice` falls back to `audio` — they hear the male clip. The button never
   goes dead.
5. In the component that renders each Speak word, at render time:
   `pickVoice(word, voice)` with `voice` from `useVoicePrefs()`. It cannot go in
   `wordFamilies.js` because that file runs ONCE when the app starts and is not a
   component — it cannot call a hook and cannot re-run when the voice changes.
   (The family objects would also need to keep `audioFemale` alongside `audio`,
   instead of copying only `c.audio`.)

</details>

---

## Where this happened

- `src/lib/voicePrefs.js` — the shared preference and `pickVoice`, with the bug
  written into its header
- `src/data/reference.js` — `audioFemale` on 21 doubles; `ml`, `nk`, `nr` added
- `src/components/reference/VoiceToggle.jsx`, `LetterGrid.jsx`, `app/(tabs)/reference.jsx`
- `notes/2026-10-24-second-voice-double-consonants.md` — the engineering record
