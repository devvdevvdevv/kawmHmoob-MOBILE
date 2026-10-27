import { VOWEL_TONE_AUDIO_FEMALE } from './vowelToneAudio.js'

// ⚠️ THE BARE VOWEL `o` NOW PLAYS THE NEW NO-TONE RECORDING — 2026-10-18, the author:
// "for the o no tone, reference on the far left, reuse the o again for the new notone we
// used because the o youre using is not the correct one."
//
// The old clip (`vowels/single-vowels/hmong-single-vowels-o.mp3`) is wrong, and it was
// the reference `o` everywhere: the vowel × tone grid's left column, "Hear the vowel" on
// /vowel/o, the vowels quiz, and the Speak vowel drill all read this one `audio` value.
// Changed in both places it appears (the flat `vowels` list and `singleVowels`).
//
// ⚠️ IT IS THE SAME SOUND BY DEFINITION, which is why reusing it is correct rather than a
// patch: a vowel written with NO tone letter *is* the mid tone, so `o-notone.wav` and a
// correct bare-`o` clip are the same recording. Same speaker and session as the other 103
// too, so the column is now consistent with the grid it labels.
//
// TO REVERT: put '/assets/audio/vowels/single-vowels/hmong-single-vowels-o.mp3' back. The
// old file is still on disk.
// ⚠️ THE OTHER 12 VOWELS STILL USE THEIR ORIGINAL CLIPS. Only `o` was reported wrong, so
// only `o` changed — but every vowel now HAS a no-tone recording, so if another one
// sounds off, the same one-line swap fixes it (see src/data/vowelToneAudio.js).

// ⚠️ ELEVEN CONSONANTS RE-RECORDED — 2026-10-18 (the author: "i added a bunch of audio
// … Yes, swap them in"). Their `audio` paths below now point at the new takes, which are
// .wav: there is no encoder on the authoring machine, and scripts/convert-audio.mjs is
// what turns them into mp3 later (the app needs no edit when that happens).
//
// ⚠️ THE OLD mp3 FILES ARE STILL ON DISK and are the way back — swap the strings:
//   double-consonant-ch.mp3  →  Ch-redo.wav   (2 places)
//   double-consonant-dh.mp3  →  dh-redo.wav   (2 places)
//   single-consonant-p.mp3  →  p-redo.wav   (1 place)
//   single-consonant-r.mp3  →  R-redo.wav   (1 place)
//   single-consonant-x.mp3  →  x-consonant-redo.wav   (1 place)
//   triple-consonants-nch.mp3  →  Nch-redo.wav   (2 places)
//   triple-consonants-nkh.mp3  →  Nkh-redo.wav   (2 places)
//   triple-consonants-nph.mp3  →  Nph.wav   (2 places)
//   triple-consonants-npl.mp3  →  Npl.wav   (2 places)
//   quad-consonants-nplh.mp3  →  Nplh.wav   (1 place)
//   quad-consonants-ntsh.mp3  →  Ntsh.wav   (1 place)
//
// ⚠️ UNVERIFIED BY EAR. These replaced clips the author judged wrong, so the new ones
// should be listened to in the Reference tab before release.

// Reference data — the things you LOOK UP, not the things you're taught.
//
// Job split (see notes/34): a table here STATES a fact ("txoj = long, winding
// things"); a lesson in src/data/lessons/ EXPLAINS it. Same content, different
// moment — cross-linked, not duplicated. Keep tables terse: no teaching prose.
//
// Exports: consonants, doubleConsonants, vowels, tones, grammar
// (grammar arrived here when the old /course page dissolved.)

export const consonants = [
  { letter: 'c', sound: 'C', audio: '/assets/audio/consonants/single-consonants/single-consonant-c.mp3' },
  // ⚠️ audioFemale ADDED 2026-10-24 — the first second-speaker recordings
  // (Emily). See src/lib/voicePrefs.js for how a voice is picked; an item with
  // no audioFemale (every OTHER letter below) just falls back to `audio`.
  // ⚠️ MALE `ch` RE-RECORDED 2026-10-25 — `ch-redo-2.wav` replaces `Ch-redo.wav`.
  // The old take is still in assets/ and still bundled. RESTORE by swapping the
  // `audio` path back to '/assets/audio/consonants/double-consonants/Ch-redo.wav'.
  { letter: 'ch', sound: 'ch', audio: '/assets/audio/consonants/double-consonants/ch-redo-2.wav', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-ch.wav' },
  { letter: 'd', sound: 'd', audio: '/assets/audio/consonants/single-consonants/single-consonant-d.mp3' },
  { letter: 'dh', sound: 'd-h', audio: '/assets/audio/consonants/double-consonants/dh-redo.wav', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-dh.wav' },
  { letter: 'f', sound: 'f', audio: '/assets/audio/consonants/single-consonants/single-consonant-f.mp3' },
  { letter: 'h', sound: 'h', audio: '/assets/audio/consonants/single-consonants/single-consonant-h.mp3' },
  { letter: 'hl', sound: 'voiceless l', audio: '/assets/audio/consonants/double-consonants/double-consonant-hl.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-hl.wav' },
  // ⚠️ NO audioFemale — Emily's set does not include 'hm'. Falls back to `audio`.
  { letter: 'hm', sound: 'voiceless m', audio: '/assets/audio/consonants/double-consonants/double-consonant-hm.mp3' },
  { letter: 'hn', sound: 'voiceless n', audio: '/assets/audio/consonants/double-consonants/double-consonant-hn.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-hn.wav' },
  { letter: 'k', sound: 'k', audio: '/assets/audio/consonants/single-consonants/single-consonant-k.mp3' },
  { letter: 'kh', sound: 'k-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-kh.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-kh.wav' },
  // ⚠️ ML AND NK ADDED 2026-10-24, with nr — the author's full inventory lists 22
  // doubles and this list had 19. Their male recordings (the author's own redos)
  // arrived 2026-10-25; until then `audio` pointed at Emily's clip too.
  { letter: 'ml', sound: 'ml', audio: '/assets/audio/consonants/double-consonants/ml-redo.wav', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-ml.wav' },
  { letter: 'l', sound: 'l', audio: '/assets/audio/consonants/single-consonants/single-consonant-l.mp3' },
  { letter: 'm', sound: 'm', audio: '/assets/audio/consonants/single-consonants/single-consonant-m.mp3' },
  { letter: 'n', sound: 'n', audio: '/assets/audio/consonants/single-consonants/single-consonant-n.mp3' },
  { letter: 'nc', sound: 'nj', audio: '/assets/audio/consonants/double-consonants/double-consonant-nc.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-nc.wav' },
  // `sound: 'ng-g'` — the velar partner of nq's 'ng-g (uvular)'.
  { letter: 'nk', sound: 'ng-g', audio: '/assets/audio/consonants/double-consonants/nk-redo.wav', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-nk.wav' },
  { letter: 'np', sound: 'mb', audio: '/assets/audio/consonants/double-consonants/double-consonant-np.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-np.wav' },
  { letter: 'nq', sound: 'ng-g (uvular)', audio: '/assets/audio/consonants/double-consonants/double-consonant-nq.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-nq.wav' },
  // ⚠️ NR ADDED 2026-10-24 (author: "add it in"). It was missing from this list
  // while the triple `nrh` was here and typingDrill.js already hand-added `nr`
  // as an onset (`nrog`, `nruab`) — an omission, not a ruling.
  //
  // ⚠️ `audio` WAS EMILY TOO UNTIL 2026-10-25, on purpose: there was no male
  // recording, and wordFamilies.js reads `.audio` directly (not via pickVoice()),
  // so an empty one would have been a silent Speak drill item. The author's own
  // redo (`nr-redo.wav`) has replaced it, as planned; `audioFemale` stays.
  //
  // `sound: 'ndr'` follows the row's own pattern: r is 'tr', and the
  // prenasalised forms here add the nasal and voice it (nt → 'nd', np → 'mb').
  { letter: 'nr', sound: 'ndr', audio: '/assets/audio/consonants/double-consonants/nr-redo.wav', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-nr.wav' },
  { letter: 'nt', sound: 'nd', audio: '/assets/audio/consonants/double-consonants/double-consonant-nt.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-nt.wav' },

  { letter: 'ny', sound: 'ny', audio: '/assets/audio/consonants/double-consonants/double-consonant-ny.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-ny.wav' },
  { letter: 'p', sound: 'p', audio: '/assets/audio/consonants/single-consonants/p-redo.wav' },
  { letter: 'ph', sound: 'p-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-ph.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-ph.wav' },
  { letter: 'pl', sound: 'pl', audio: '/assets/audio/consonants/double-consonants/double-consonant-pl.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-pl.wav' },
  { letter: 'q', sound: 'k (uvular)', audio: '/assets/audio/consonants/single-consonants/single-consonant-q.mp3' },
  { letter: 'qh', sound: 'q-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-qh.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-qh.wav' },
  { letter: 'r', sound: 'tr', audio: '/assets/audio/consonants/single-consonants/R-redo.wav' },
  { letter: 'rh', sound: 'tr-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-rh.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-rh.wav' },
  { letter: 's', sound: 'sh', audio: '/assets/audio/consonants/single-consonants/single-consonant-s.mp3' },
  { letter: 't', sound: 't', audio: '/assets/audio/consonants/single-consonants/single-consonant-t.mp3' },
  { letter: 'th', sound: 't-h', audio: '/assets/audio/consonants/double-consonants/double-consonant-th.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-th.wav' },
  { letter: 'ts', sound: 'ts', audio: '/assets/audio/consonants/double-consonants/double-consonant-ts.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-ts.wav' },

  { letter: 'tx', sound: 'ts (English)', audio: '/assets/audio/consonants/double-consonants/double-consonant-tx.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-tx.wav' },

  { letter: 'v', sound: 'v', audio: '/assets/audio/consonants/single-consonants/single-consonant-v.mp3' },
  { letter: 'x', sound: 's', audio: '/assets/audio/consonants/single-consonants/x-consonant-redo.wav' },
  { letter: 'xy', sound: 'sh-y', audio: '/assets/audio/consonants/double-consonants/double-consonant-xy.mp3', audioFemale: '/assets/audio/consonants/double-consonants/female/emily-xy.wav' },
  { letter: 'y', sound: 'y', audio: '/assets/audio/consonants/single-consonants/single-consonant-y.mp3' },
  { letter: 'z', sound: 'zh', audio: '/assets/audio/consonants/single-consonants/single-consonant-z.mp3' },
  // Triple consonants (3 letters, one sound). Sound column left blank — these
  // are learned by ear; the full set matches the Triple Consonants lesson.
  // (nts, ntx, tsh, txh already appear above with sounds.)
  
  { letter: 'hml', sound: 'hml', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hml.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-hml.wav' },
  { letter: 'hny', sound: 'hny', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hny.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-hny.wav' },
  { letter: 'nch', sound: 'nch', audio: '/assets/audio/consonants/triple-consonants/Nch-redo.wav', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-nch.wav' },
  { letter: 'nkh', sound: 'nkh', audio: '/assets/audio/consonants/triple-consonants/Nkh-redo.wav', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-nkh.wav' },
  { letter: 'nph', sound: 'nph', audio: '/assets/audio/consonants/triple-consonants/Nph.wav', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-nph.wav' },
  { letter: 'npl', sound: 'npl', audio: '/assets/audio/consonants/triple-consonants/Npl.wav', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-npl.wav' },
  { letter: 'nqh', sound: 'nqh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nqh.mp3' },
  { letter: 'nrh', sound: 'nrh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nrh.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-nrh.wav' },
  { letter: 'nth', sound: 'nth', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nth.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-nth.wav' },
  { letter: 'nts', sound: 'ndz', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nts.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-nts.wav' },
  { letter: 'ntx', sound: 'ndj', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-ntx.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-ntx.wav' },
  { letter: 'txh', sound: 'tx-h', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-txh.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-txh.wav' },
  { letter: 'tsh', sound: 'tsh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-tsh.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-tsh.wav' },
  
  { letter: 'plh', sound: 'plh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-plh.mp3', audioFemale: '/assets/audio/consonants/triple-consonants/female/emily-plh.wav' },
  // Quadruple consonants (4 letters, one sound) — the whole set in White Hmong.
  { letter: 'nplh', sound: 'nplh', audio: '/assets/audio/consonants/quad-consonants/Nplh.wav', audioFemale: '/assets/audio/consonants/quad-consonants/female/emily-nplh.wav' },
  { letter: 'ntsh', sound: 'ntsh', audio: '/assets/audio/consonants/quad-consonants/Ntsh.wav', audioFemale: '/assets/audio/consonants/quad-consonants/female/emily-ntsh.wav' },
  { letter: 'ntxh', sound: 'ntxh' ,  audio: '/assets/audio/consonants/quad-consonants/quad-consonants-ntxh.mp3', audioFemale: '/assets/audio/consonants/quad-consonants/female/emily-ntxh.wav' },
]

// Consonants grouped by cluster length, for the categorized Reference view.
// Derived from `consonants` above (length = category), so there's one source.
// Empty groups drop out. See notes/43.
export const consonantGroups = [
  { id: 'single', title: 'Single | Cov Tsiaj Ntawv Txiv Tab', blurb: 'One letter, one sound.' },
  { id: 'double', title: 'Double | Cov Txiv Txooj', blurb: 'Two letters, one sound.' },
  { id: 'triple', title: 'Triple | Cov Txiv Peb Tug', blurb: 'Three letters, one sound.' },
  { id: 'quadruple', title: 'Quadruple | Cov Txiv Plaub Tug', blurb: 'Four letters, one sound.' },
]
  .map((g, i) => ({ ...g, items: consonants.filter((c) => c.letter.length === i + 1) }))
  .filter((g) => g.items.length > 0)

export const doubleConsonants = [
  { letter: 'Ch', audio: '/assets/audio/consonants/double-consonants/Ch-redo.wav', exampleWord: 'Chiaj' },
  { letter: 'Dh', audio: '/assets/audio/consonants/double-consonants/dh-redo.wav', exampleWord: '' },
  { letter: 'Dl', audio: '/assets/audio/consonants/double-consonants/double-consonant-dl.mp3', exampleWord: '' },
  { letter: 'Hl', audio: '/assets/audio/consonants/double-consonants/double-consonant-hl.mp3', exampleWord: '' },
  { letter: 'Hm', audio: '/assets/audio/consonants/double-consonants/double-consonant-hm.mp3', exampleWord: '' },
  { letter: 'Hn', audio: '/assets/audio/consonants/double-consonants/double-consonant-hn.mp3', exampleWord: '' },
  { letter: 'Kh', audio: '/assets/audio/consonants/double-consonants/double-consonant-kh.mp3', exampleWord: '' },
  { letter: 'Ml', audio: '/assets/audio/consonants/double-consonants/double-consonant-ml.mp3', exampleWord: '' },
  { letter: 'Nc', audio: '/assets/audio/consonants/double-consonants/double-consonant-nc.mp3', exampleWord: '' },
  { letter: 'Nk', audio: '/assets/audio/consonants/double-consonants/double-consonant-nk.mp3', exampleWord: '' },
  { letter: 'Np', audio: '/assets/audio/consonants/double-consonants/double-consonant-np.mp3', exampleWord: '' },
  { letter: 'Nq', audio: '/assets/audio/consonants/double-consonants/double-consonant-nq.mp3', exampleWord: '' },
  { letter: 'Nt', audio: '/assets/audio/consonants/double-consonants/double-consonant-nt.mp3', exampleWord: '' },
  { letter: 'Ny', audio: '/assets/audio/consonants/double-consonants/double-consonant-ny.mp3', exampleWord: '' },
  { letter: 'Ph', audio: '/assets/audio/consonants/double-consonants/double-consonant-ph.mp3', exampleWord: '' },
  { letter: 'Pl', audio: '/assets/audio/consonants/double-consonants/double-consonant-pl.mp3', exampleWord: '' },
  { letter: 'Qh', audio: '/assets/audio/consonants/double-consonants/double-consonant-qh.mp3', exampleWord: '' },
  { letter: 'Rh', audio: '/assets/audio/consonants/double-consonants/double-consonant-rh.mp3', exampleWord: '' },
  { letter: 'Th', audio: '/assets/audio/consonants/double-consonants/double-consonant-th.mp3', exampleWord: '' },
  { letter: 'Ts', audio: '/assets/audio/consonants/double-consonants/double-consonant-ts.mp3', exampleWord: '' },
  { letter: 'Tx', audio: '/assets/audio/consonants/double-consonants/double-consonant-tx.mp3', exampleWord: '' },
  { letter: 'Xy', audio: '/assets/audio/consonants/double-consonants/double-consonant-xy.mp3', exampleWord: '' },
]


export const tripleConsonants = [
  { letter: 'Hml', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hml.mp3', exampleWord: '' },
  { letter: 'Hny', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-hny.mp3', exampleWord: '' },
  { letter: 'Nch', audio: '/assets/audio/consonants/triple-consonants/Nch-redo.wav', exampleWord: '' },
  { letter: 'Nkh', audio: '/assets/audio/consonants/triple-consonants/Nkh-redo.wav', exampleWord: '' },
  { letter: 'Nph', audio: '/assets/audio/consonants/triple-consonants/Nph.wav', exampleWord: '' },
  { letter: 'Npl', audio: '/assets/audio/consonants/triple-consonants/Npl.wav', exampleWord: '' },
  { letter: 'Nqh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nqh.mp3', exampleWord: '' },
  { letter: 'Nrh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nrh.mp3', exampleWord: '' },
  { letter: 'Nth', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-nth.mp3', exampleWord: '' },
  { letter: 'Plh', audio: '/assets/audio/consonants/triple-consonants/triple-consonants-plh.mp3', exampleWord: '' },
]

export const vowels = [
  { letter: 'a', sound: 'ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-a.mp3' },
  { letter: 'e', sound: 'eh', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-e.mp3' },
  { letter: 'i', sound: 'ee', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-i.mp3' },
  { letter: 'o', sound: 'aw', audio: '/assets/audio/vowels + tones/o-tone/o-notone.wav' },  // ⚠️ see the note at the top of this file: the old single-vowel 'o' clip was wrong
  { letter: 'u', sound: 'oo', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-u.mp3' },
  { letter: 'w', sound: 'uh (schwa)', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-w.mp3' },
  // ⚠️ COMMENTED OUT 2026-09-28 — the author: "aa" is Green Hmong, not Hmoob Dawb. TO RESTORE: uncomment.
  // { letter: 'aa', sound: 'an', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-aa.mp3` },
  { letter: 'ai', sound: 'eye', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-ai.mp3` },
  { letter: 'au', sound: 'ow', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-au.mp3` },
  { letter: 'aw', sound: 'aw-uh', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-aw.mp3` },
  { letter: 'ee', sound: 'eng', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-ee.mp3` },
  { letter: 'ia', sound: 'ee-ah', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-ia.mp3` },
  // ⚠️ COMMENTED OUT 2026-10-14 — the author: "oi" is not a Hmong vowel. It had carried a
  // TODO-VERIFY since it was added, for the reason that now reads as the answer: the recording
  // existed but the letter was missing from this list entirely. No headword in vocabulary.js
  // contains `oi`. TO RESTORE: uncomment (and the twin in `doubleVowels` below).
  // { letter: 'oi', sound: 'oy', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-oi.mp3` },
  { letter: 'oo', sound: 'ong', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-oo.mp3` },
  { letter: 'ua', sound: 'oo-ah', audio: `/assets/audio/vowels/double-vowels/hmong-double-vowels-ua.mp3` },
].map((v) => ({
  ...v,
  // ⚠️ EMILY'S BARE VOWEL IS HER NO-TONE SYLLABLE — 2026-10-25. Same rule as the male
  // `o` above: a vowel with no tone letter IS the mid tone, so `emily-a-notone` is her
  // `a`. All 13 exist; a missing one leaves audioFemale undefined → male fallback.
  audioFemale: VOWEL_TONE_AUDIO_FEMALE[v.letter],
}))


// Seperation

export const vowelGroups = [

  { id: 'single', title: 'Single | Cov Tab', blurb: 'One letter, one sound.' },
  { id: 'double', title: 'Double | Cov Txooj', blurb: 'Two letters,  sound.' },

]
  .map((g, i) => ({ ...g, items: vowels.filter((c) => c.letter.length === i + 1) }))
  .filter((g) => g.items.length > 0)




// Groups


export const singleVowels = [
  { letter: 'a', sound: 'ah', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-a.mp3' },
  { letter: 'e', sound: 'eh', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-e.mp3' },
  { letter: 'i', sound: 'ee', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-i.mp3' },
  { letter: 'o', sound: 'aw', audio: '/assets/audio/vowels + tones/o-tone/o-notone.wav' },  // ⚠️ see the note at the top of this file: the old single-vowel 'o' clip was wrong
  { letter: 'u', sound: 'oo', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-u.mp3' },
  { letter: 'w', sound: 'uh (schwa)', audio: '/assets/audio/vowels/single-vowels/hmong-single-vowels-w.mp3' },
].map((v) => ({ ...v, audioFemale: VOWEL_TONE_AUDIO_FEMALE[v.letter] })) // Emily, 2026-10-25 — same rule as `vowels` above; the vowel lessons read this list


export const doubleVowels = [
  // ⚠️ COMMENTED OUT 2026-09-28 — the author: "aa" is Green Hmong, not Hmoob Dawb. TO RESTORE: uncomment.
  // { letter: 'aa', sound: 'an', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-aa.mp3' },
  { letter: 'ai', sound: 'eye', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-ai.mp3' },
  { letter: 'au', sound: 'ow', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-au.mp3' },
  { letter: 'aw', sound: 'aw-uh', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-aw.mp3' },
  { letter: 'ee', sound: 'eng', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-ee.mp3' },
  { letter: 'ia', sound: 'ee-ah', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-ia.mp3' },
  // ⚠️ COMMENTED OUT 2026-10-14 — the author: "oi" is not a Hmong vowel. The twin of the entry
  // in `vowels` above; both must stay commented or the Reference grid and the flat list disagree.
  // TO RESTORE: uncomment both.
  // { letter: 'oi', sound: 'oy', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-oi.mp3' },
  { letter: 'oo', sound: 'ong', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-oo.mp3' },
  { letter: 'ua', sound: 'oo-ah', audio: '/assets/audio/vowels/double-vowels/hmong-double-vowels-ua.mp3' },
].map((v) => ({ ...v, audioFemale: VOWEL_TONE_AUDIO_FEMALE[v.letter] })) // Emily, 2026-10-25 — same rule as `vowels` above; the vowel lessons read this list


// Vowel Tones








/**
 * What every tone recording in the app is, said once — 2026-10-18 (the author: "for the
 * tones, need a flag to show that it's the first version and the pronounciations are
 * exagerated to give it more effect").
 *
 * ⚠️ TWO FACTS, AND THE SECOND ONE IS NOT AN APOLOGY. The clips are a first pass, and the
 * tones in them are said MORE STRONGLY than in ordinary speech — deliberately, so the
 * shape of each tone is unmistakable to someone who has never heard it. A learner who
 * does not know that will hear a native speaker later and think one of the two is wrong.
 * Saying it is the difference between a teaching exaggeration and a bad recording.
 *
 * ⚠️ ONE STRING, FOUR SURFACES, because a notice that drifts is worse than none: the
 * tones tab, /tone/<marker>, /vowel/<letter> and the vowel × tone grid all import this.
 * Same rule as SCORE_CAVEAT in lib/pronounceScore.js.
 *
 * TO RETIRE IT, once the clips are re-recorded at natural strength: delete this constant
 * and the four <ToneAudioNote /> tags (grep for it). ⚠️ Keep the "first version" half only
 * as long as it is true.
 */
export const TONE_AUDIO_NOTICE =
  'First recordings. The tones are said more strongly here than in normal speech, on purpose — it makes the shape of each one easier to hear.'

export const tones = [
  { marker: 'b', name: 'High', description: 'Pitch is High', example: 'pob (ball)', example2: 'Cim Siab' },
  { marker: 'j', name: 'High-falling', description: 'Pitch is High Falling', example: 'poj (female)', example2: 'Cim Ntuj' },
  { marker: 'v', name: 'Rising', description: 'Pitch is Rising', example: 'pov (throw)', example2: 'Cim Kuv' },
  { marker: '', name: 'Mid', description: 'Pitch Mid (no marker)', example: 'po (spleen)', example2: 'Cim Ua' },
  { marker: 's', name: 'Low', description: 'Pitch is Low', example: 'pos (thorn)', example2: 'Cim Mus' },
  { marker: 'g', name: 'Mid-Falling with Air', description: 'Pitch is Mid-Falling with Air', example: 'pog (grandma)', example2: 'Cim Neeg' },
  { marker: 'm', name: 'Low-Falling', description: 'Pitch is Low-Falling', example: 'pom (see)', example2: 'Cim Niam' },
  { marker: 'd', name: 'Low-Rising', description: 'Pitch is Low-Rising', example: 'pod (?)', example2: 'Cim Tod' },
].map((t) => ({
  ...t,
  audio: t.marker
    ? `/assets/audio/tones/hmong-tone-${t.marker}.mp3`
    : '/assets/audio/tones/hmong-tone-none.mp3',
  // Emily (female) saying the Cim name — added 2026-10-25. Her files arrived as
  // `emily-cimsiab.mp3` etc. and were renamed by marker on copy to match the male set.
  audioFemale: `/assets/audio/tones/female/emily-tone-${t.marker || 'none'}.mp3`,
}))

// ── Grammar cheat sheets ────────────────────────────────────────────────────
// Came from the dissolved /course page. These are LOOKUP tables — the "what",
// stripped of teaching. `lesson` points at the Learn lesson that explains the
// "why", and the Reference page renders it as a "Learn this →" link. Omit
// `lesson` when no lesson covers the table yet.

export const grammar = [
  {
    title: 'Pronouns',
    note: 'Hmong marks singular, dual (exactly two), and plural.',
    lesson: { unitId: 'grammar', lessonId: 'foundations-pronouns' },
    items: [
      { hmong: 'Kuv', english: 'I' },
      { hmong: 'Koj', english: 'You (singular)' },
      { hmong: 'Nws', english: 'He / she / it' },
      { hmong: 'Wb', english: 'We two' },
      { hmong: 'Neb', english: 'You two' },
      { hmong: 'Nkawd', english: 'They two' },
      { hmong: 'Peb', english: 'We (plural)' },
      { hmong: 'Nej', english: 'You (plural)' },
      { hmong: 'Lawv', english: 'They' },
    ],
  },
  {
    title: 'Common Verbs',
    note: 'Verbs never conjugate — tense comes from the markers below.',
    lesson: { unitId: 'grammar', lessonId: 'foundations-action-verbs' },
    items: [
      { hmong: 'Mus', english: 'To go' },
      { hmong: 'Los', english: 'To come' },
      { hmong: 'Noj', english: 'To eat' },
      { hmong: 'Haus', english: 'To drink' },
      { hmong: 'Hais', english: 'To say / speak' },
      { hmong: 'Pom', english: 'To see' },
      { hmong: 'Paub', english: 'To know' },
      { hmong: 'Ua', english: 'To do / make' },
    ],
  },
  {
    title: 'Tense Markers',
    note: 'Small words placed around the verb to place it in time.',
    lesson: { unitId: 'grammar', lessonId: 'foundations-tense-markers' },
    items: [
      { hmong: 'tab tom', english: 'Currently (-ing)' },
      { hmong: 'yuav', english: 'Will (future)' },
      { hmong: 'tau', english: 'Already (past completed)' },
      { hmong: 'tseem', english: 'Still' },
      { hmong: 'lawm', english: 'Sentence-final completed marker' },
    ],
  },
  {
    title: 'Question Words',
    note: 'These usually sit at the END of the sentence in Hmong.',
    // ⚠️ REDIRECTED 2026-09-25 (author): "Learn this" now opens the dedicated
    // Asking Questions unit. Was { unitId: 'numbers-and-time', lessonId:
    // 'numbers-how-much' } — the How Much? lesson, which teaches pes tsawg and
    // prices, not question words.
    lesson: { unitId: 'questions', lessonId: 'grammar-question-words' },
    items: [
      { hmong: 'Dab tsi?', english: 'What?' },
      { hmong: 'Leej twg?', english: 'Who?' },
      { hmong: 'Qhov twg?', english: 'Where?' },
      { hmong: 'Thaum twg?', english: 'When?' },
      { hmong: 'Vim li cas?', english: 'Why?' },
      { hmong: 'Li cas?', english: 'How?' },
      { hmong: 'Pes tsawg?', english: 'How much / how many?' },
    ],
  },
  {
    title: 'Noun Classifiers',
    note: 'Pattern: number + classifier + noun — "ib tus aub" (one dog).',
    lesson: { unitId: 'grammar', lessonId: 'foundations-noun-classifiers' },
    items: [
      { hmong: 'Tus', english: 'People and animals' },
      { hmong: 'Lub', english: 'Round / 3-D objects' },
      { hmong: 'Daim', english: 'Flat objects' },
      { hmong: 'Txoj', english: 'Long, winding things' },
      { hmong: 'Rab', english: 'Tools / weapons' },
      { hmong: 'Phau', english: 'Books' },
    ],
  },
  {
    title: 'Numbers 1–10',
    note: 'Teens stack on kaum: "kaum ib" = eleven.',
    lesson: { unitId: 'numbers-and-time', lessonId: 'numbers-counting' },
    items: [
      { hmong: 'Ib', english: 'One' },
      { hmong: 'Ob', english: 'Two' },
      { hmong: 'Peb', english: 'Three' },
      { hmong: 'Plaub', english: 'Four' },
      { hmong: 'Tsib', english: 'Five' },
      { hmong: 'Rau', english: 'Six' },
      { hmong: 'Xya', english: 'Seven' },
      { hmong: 'Yim', english: 'Eight' },
      { hmong: 'Cuaj', english: 'Nine' },
      { hmong: 'Kaum', english: 'Ten' },
    ],
  },
]
