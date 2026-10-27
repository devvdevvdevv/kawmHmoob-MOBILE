# The Speak tab's Alphabet section, and the Reference practice rows (2026-10-15)

Two author reports, both about the same thing from different screens: the places that
bridge *reading* a letter and *saying* it looked like afterthoughts.

## 1. Reference: "for the speak section in the alphabet page, we need to make the ui better"

`PracticeLink` in `app/(tabs)/reference.jsx` — the row under each letter group and under
the tones.

| before | after |
|---|---|
| thin `cream-100` strip | `cream-50` card with `shadow-warm`, matching the vowel cards directly above it |
| mic on the **right** | mic in a `clay-600/12` chip on the **left**, arrow on the right |
| "Try practising double consonants" | "**Practise saying double consonants**" + "Record yourself, compare to a native speaker." |
| no section label | a **Speak** eyebrow, dot `bg-clay-600` |

⚠️ **The mic was sitting where every other row in this app puts its "go" arrow**, so it
read as a status icon rather than a destination. That, plus being the only navigation
element on the page that was not a cream-50 card, is the whole of why it looked weak.

The dot is clay-600 because that is Speak's own tab-indicator token (`Eyebrow.jsx`): the
mark here and the highlighted tab it leads to are then the same fact.

⚠️ **ONE COMPONENT CHANGED.** The letter grids, the groups and their order are untouched
— the complaint was that the row was weak, not that the page was wrong.

## 2. Speak tab: "actual alphabet section of the speak tab, the ui is pretty amateur"

Three separate problems, and the heading was the worst of them.

### ⚠️ The heading described a different feature

It read **"Word families · Words that share an ending, one sound at a time."** All six
families in `wordFamilies.js` are **letters**: 17 single consonants, 19 double, 14 triple,
3 quadruple, 6 single vowels, 7 double. 66 letters, no words among them.

On a tab called Alphabet, under a section about tones, a heading promising word endings is
answering a question nobody on that screen asked. Now **"Consonants"** and **"Vowels"**.

⚠️ The data keeps the name `wordFamilies`, and every `family-*` id stays — those are
progress keys. Only the copy changed.

### Vowels are their own section

*"seperate and isolate the vowels, dont mix it in with the consosnants. Colors must be
distinct"* — one list of six put **Single Vowels** directly under **Quadruple
Consonants**, which reads as a fifth kind of consonant.

Split on `kind`, which the derivation already sets (`'consonant'` | `'vowel'`), so there
is no list to keep in step: a new group added to `reference.js` lands in the right section
on its own. A family of any other kind (the file has room for tone and phrase contrast
sets) is swept into neither.

```
The tones     3 cards
Consonants    4 cards · 53 letters
Vowels        2 cards · 13 letters
```

### The rows became cards (`FamilyCard`)

They were flat: title, "19 words · One letter, one sound.", arrow — directly under the
tone cards, which carry an icon chip, a progress bar, a completion tick and a shadow. Two
card shapes in one list, and **the weaker one held the actual alphabet**. Same anatomy as
`GroupCard` now.

⚠️ **THE PROGRESS KEY IS THE RAW WORD ID, NOT `speakStepId(id)`.** `GroupCard` counts
`speakStepId(p.id)` because that is what the phrase screens write; the family screen
(`app/speak/family/[familyId].jsx`) calls `markStepComplete(word.id)` with the bare id.
Copying GroupCard's line would have rendered a bar that could never fill. Checked against
that screen rather than assumed.

No Pro pill: families are the alphabet, which is free, and that screen has no gate.

Also "4/19 **letters**", not "19 words" — the one piece of copy on the old row that was
factually wrong.

## 3. Capitalisation

*"Capitalize everything"*. Applied where the families are DERIVED, in
`src/data/wordFamilies.js`, so all eight display sites change at once: the cards, the
letter tiles, the big letter on the drill, the prev/next buttons and the accessibility
labels.

⚠️ **THE SOURCE DATA WAS INCONSISTENT, and that was part of the amateur look.**
`reference.js` has single consonants lowercase (`c`, `d`) and doubles/triples already
capitalised (`Ch`, `Hml`), so one card read "c d f h" and the next "Ch Dh Hl Hm".

| before | after |
|---|---|
| `c d f h k` / `Ch Dh Hl Hm` | `C D F H K` / `Ch Dh Hl Hm` |
| `a e i o u` / `ai au aw ee` | `A E I O U` / `Ai Au Aw Ee` |
| "Single consonants" | "Single Consonants" |

⚠️ **ON `hmong` ONLY — NEVER ON `id` OR `audio`.** The ids are progress keys
(`family-consonant-c`) and the audio values are filenames; capitalising either would
detach every practised letter and every clip. Nothing in the app matches on the display
field, which was checked before the change (`defineToken.js`'s `sub.hmong === entry.hmong`
is dictionary entries, not these).

First-letter capitals (`Ch`, `Nplh`, `Ai`), which is the RPA convention and what the
reference data already does for multi-letter consonants. Full caps would be a
one-character change to `cap()`.

Verified: `check-lesson-audio` — "all referenced paths exist in audioMap ✅"; lint clean
(the `import/first` warning in `wordFamilies.js` is pre-existing, checked against the
committed version).

## Still open

- **`/alphabet` is a second, poorer copy of these Reference tabs**, and its tone list
  renders `<AudioButton audioSrc={null} />` — hardcoded, so **all eight tone buttons there
  are permanently disabled.** The cause is the data: `src/data/alphabet.js` has no `audio`
  field on anything (0 of 8 tones), while `reference.js` has working paths for all 8.
  Either point that page at `reference.js` or retire the route to `/reference`.
- Nothing here has been seen on a device.
