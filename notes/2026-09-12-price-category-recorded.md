# The price category, recorded end to end (2026-09-12)

31 takes across two sessions — 16 words, 15 phrases — wired into all three price
lessons. **`cat-price` is the first COMPLETE category in the course**, and the
recording backlog went **184 → 154**.

```
cat-greetings        3/3 lessons recorded   FREE
cat-price            3/3 lessons recorded   PRO   ← complete
cat-family           0/2                    PRO
cat-food             0/5                    PRO
cat-understanding    0/1                    PRO
cat-everyday         0/6                    PRO
cat-questions        0/1                    PRO
```

Six lessons, 167 steps, every one playing a native speaker.

## Why these two matter more than the count suggests

**This is the first thing a subscriber could be sold honestly.** Until today
`cat-price` was three cards that could not do the thing they were paying for —
no clip means nothing to imitate and nothing for the scorer to compare against.
Now the whole category works: ask a price, push back on it, count the money.

It does not clear the monetisation gate — fifteen skeletons are still silent
behind the same lock, and none of this has been reviewed by a fluent speaker —
but it changes the shape of that gate. **One complete category is the unit worth
shipping**, and it turns out to cost about two recording sessions.

The pipeline held up: skeleton → recording checklist → record → wire, with the
checklist generated from the lesson data rather than kept by hand.

## ⚠️ The bundle is the thing to watch now

| | files | size |
|---|---|---|
| reference library (.mp3) | 315 | **11 MB** |
| lesson takes (.wav) | 55 | **30 MB** |

**Fifty-five raw takes outweigh the entire 315-clip reference library nearly
three to one.**

Extrapolating the 154 clips still to record at ~550KB each adds roughly **85MB**,
putting the app's audio near **115MB**. That is no longer a tidiness question —
it is a Play listing and a first-install experience.

Converting the 45 existing takes to mp3 would put them around **2MB**, and
nothing in the code changes but the paths in the `A` map: `generate-audio-map.js`
bundles both extensions, `resolveAudioSrc` keys on the path, and expo-audio plays
either. The conversion has no dependency on any of the content work.

> The decision to ship .wav was taken deliberately on 2026-09-12 with the cost
> stated at ~12MB. It has doubled in a day. It should be revisited before the
> next recording session, not after it.

## One discrepancy to listen for

The take for "I only have a little money" arrived as **`KuvMuajTsawgXwb.wav`** —
with no `nyiaj`. The lesson teaches:

> Kuv muaj **nyiaj** tsawg xwb. — I only have a little money.

Either the recording drops the word or the filename is shorthand, and only a
listener can say which. It is wired to the lesson's sentence, and the `A` map
carries the warning: **if the clip really omits `nyiaj`, the sentence is what
should change, not the path.**

Same class as `KojNojZoo.wav` (noj/nyob) and `Txuas Siab.wav` (txuas/txaus) —
three filename-versus-content mismatches in two days, all caught by reading
filenames, none catchable by any check in this repo.

## ⚠️ Recording a lesson does not review it

The Hmong here is still the author's list verbatim, and the English is still
drafted from the word annotations beside it. **A clip proves the words were
said, not that the translation under them is right.** Both lesson headers now
say so explicitly, in place of the "NO AUDIO" banner they carried.

## Files touched

- `assets/audio/lessons/price-how-much/` — 10 clips
- `assets/audio/lessons/price-too-much/` — 11 clips
- `assets/audio/lessons/price-numbers/` — 10 clips
- `src/lib/audioMap.js` — regenerated, 339 → 370 entries
- `src/data/speakLessons.js` — 31 `A` paths, 77 steps filled, three headers rewritten
- `notes/audio-todo.md` — regenerated: 184 → 154

## Still open

- **The price words are not in the dictionary.** `kim`, `nqi`, `npaum`,
  `pes tsawg`, `qhov no`, `tsawg`, `puas`, `luv nqi`, `pheej yig`, `txo nqi` all
  have recordings and lesson glosses but no `vocabulary.js` entry, so the reader
  cannot define them and no quiz can use them. Deliberately not added here: those
  glosses are drafts, and pushing drafts into the dictionary spreads them.
- **Three filename-versus-content mismatches in this category alone.** Along with
  `KuvMuajTsawgXwb` (missing `nyiaj`), the money phrase arrived as
  `…IbPuasDuaslaux…` while its own word file says `Duaslas` and the lesson
  teaches `duas las` — **three spellings of one word inside a single session.**
  The `duas las / tsib caum / xees / nyiaj nawb` set was already flagged
  unverified when the skeleton was written; it still is.
- **Next complete category** is `cat-family` at two lessons, or
  `cat-understanding` at one.
