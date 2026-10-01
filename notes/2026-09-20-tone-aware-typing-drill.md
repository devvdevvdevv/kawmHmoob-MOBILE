# Spell it out — the tone-aware typing drill (2026-09-20)

> **⚠️ REWORKED 2026-09-22: two picks per syllable, not three.** The author
> found the three-tray flow clunky: six taps plus Check for a two-syllable
> word, a tray that swapped after every tap, and Undo as the only way back.
> Now each syllable is one **letters** chip (consonant + vowel together, with
> decoys that are confusable and preferably real syllables) plus one **tone**
> chip. Both trays are on screen at once, you tap any syllable to change it,
> and the answer checks itself when the last slot is filled. Grading is
> unchanged: a wrong final letter is still reported as a tone error, by name.
> The exercise pool is the same size (919). Where this note describes the
> consonant → vowel → tone trays, it describes the old version, which is
> archived in `archive/2026-09-22-pre-tone-rework/`.
> Full record: `notes/2026-09-22-tone-spelling-rework.md`.

Challenge type **4 of 5** from
[2026-09-16-writing-unit-and-challenge-todo], built. It was taken out of order
— the note suggested 1 → 2 → 3-content → 4 → 5 — for one reason: types 1, 2 and
3 are all limited by the same missing content (example sentences), and this one
is limited by nothing. It runs on words that already exist.

It is also the only one of the five that is about **Hmong** rather than about
quizzing.

---

## What it is

`/words/typing` — "Spell it out". Read an English word, build the Hmong for it
in three steps per syllable:

```
        cat
   ┌───┬───┬───┐
   │ m │ i │ v │   ← consonant, vowel, TONE
   └───┴───┴───┘
        Rising
```

One tray on screen at a time. Consonant and vowel trays are **six chips: the
right answer plus five confusable decoys**. The tone row is **all eight, every
time**.

⚠️ **That asymmetry is the design, not an oversight.** Narrowing the tone row to
a plausible few would hand over the answer to the one question the drill exists
to ask. Narrowing the letters is the opposite — picking `nts` out of `nt` /
`ntx` / `nth` / `ntsh` / `ntxh` *is* the Triple Consonants lesson, as a drill.

## Why it earns its place

The argument, copied here because it is the thing to re-read if anyone proposes
replacing this with a text input:

> In RPA the tone IS the final consonant. A learner who types `zos` when they
> meant `zoo` has not made a typo — they have said a different word. On a phone
> keyboard that mistake is invisible: it looks like a slipped finger, autocorrect
> may even "fix" it, and nothing ever tells them a **tone** was the thing they
> got wrong.

So `diagnose()` returns **four** statuses, not two:

| status | means | what the learner is told |
|---|---|---|
| `correct` | the target, exactly | ✓ |
| `alternative` | a different real word that also answers the prompt | "Also right ✓ — the one being asked for was …" |
| `tone` | every consonant and vowel right, ≥1 tone wrong | "**zoo** takes the **Mid** tone (no letter) — you wrote **zos**, the **Low** tone (-s)" |
| `spelling` | a consonant or a vowel is wrong | the two spellings, side by side |

`tone` and `spelling` are both scored as wrong. The split exists entirely for
what is said afterwards — collapse them and this drill is a keyboard again.

### The payoff nobody has to author

⚠️ **526.** Walking every one-syllable word in the pool against all seven wrong
tones gives 3332 wrong answers, and **526 of them spell another word the app has
already taught.** `miv` cat / `mis` milk. `nab` snake / `nas` mouse. `pob` ball /
`pom` see / `pog` grandmother.

So a wrong tone usually is not nonsense, and the drill says so:

> "**mis**" is a word of its own — breast.

That line is the single most useful thing a tone drill can show, and it cost no
content: it is a lookup against `vocabulary.js`.

## Measured, not assumed

Everything below was counted against the real data on the day, so a future
change can be measured rather than argued about.

| | |
|---|---|
| vocabulary entries | 1351 |
| one syllable / two | 621 / 508 |
| ⚠️ capped at two syllables | keeps 1129, costs 222 |
| fail to parse, dropped | 47 |
| deduped by Hmong **and** by English gloss | 967 |
| ⚠️ prompts that would have leaked the answer, dropped | 50 → **917 exercises** |
| every tray well-formed (6/6/8, contains the answer, no dupes) | 917/917 |
| every exercise graded `correct` when answered correctly | 917/917 |
| prompts leaking the answer / over 48 chars / duplicated | 0 / 0 / 0 |

The 47 that drop out are compounds written **solid** (`tiamsis`, `lossis`,
`xibfwb`, `menyuam`, `neesnkaum`) plus loanword place names (`Meskas`, `Fabkis`,
`Askiv`). A solid compound is more than one syllable however it is spaced, so
the parser cannot split it. Both groups are poor tone-drill material anyway.

⚠️ **Deduping by ENGLISH matters as much as by Hmong.** `txiv` is five entries
(father, husband, fruit classifier…); without the gloss dedupe one session can
ask "father" twice and expect a different answer each time, which reads as a bug.

⚠️ **English→Hmong is not one-to-one**, which is why `alternative` exists.
"sister" is `muam` from a man and `viv ncaus` from a woman. Marking the second
one wrong would be the app being wrong, so a real word carrying the same
first-sense gloss is accepted and the reveal names the one that was expected.

## Decisions taken, and what they close

- **Quota: its own budget** (`typing`, 2/day), not shared with the sentence
  builder. This answers the open question in the 09-16 note. Sharing would mean
  spelling five words locks the sentence builder — a limit that reads as a bug.
- **Scoring: session-local**, the same boundary `sentenceBuilder.js` holds. The
  09-16 note lists "where does scoring go" as a decision to make *before* adding
  a sixth scoring surface, and that decision is still open. Nothing here writes
  to `ProgressContext.xp` or `lib/leveling.js`.
- **`ResultEmblem` / `ResultStat` lifted** out of
  `app/words/sentences/[groupId].jsx` into
  `src/components/common/ResultStats.jsx`, unchanged. Two drills one tile apart
  have to finish the same way.

## Three bugs worth keeping

1. **38 of 967 prompts contained their own answer.** `english` in the vocabulary
   is a dictionary entry, not a prompt, and it carries worked examples *in
   Hmong*: `tsav` was prompted as `to drive — "tsav tsheb"`. The drill was
   printing the word above the trays and then asking for it to be spelled.
   Splitting on `·` and `;` was not enough — the examples hang off an em dash or
   a colon. Now: cut at the first sense separator, then **reject any prompt
   whose letters contain the answer's letters**, whatever route it took there.
   Blunt (it also drops "like" for `li`) and worth it — 50 exercises for a
   guarantee. ⚠️ The same `firstSense()` builds the prompt *and* keys the word
   index, so an accepted alternative answer cannot drift out of reach of the
   prompt it answers.

2. **`picksToSyllables` must leave an unanswered part `undefined`, never `''`.**
   An empty string is a real answer *twice over* here — the word starts with its
   vowel (`os`, `ib`, `aub`), and the mid tone has no letter. Defaulting to `''`
   made every empty slot render as an already-chosen "none".
3. **The tray had to be memoised, and not for speed.** `trayForStep()` shuffles,
   so calling it from the render body re-ordered the chips on every re-render —
   the chip under a finger about to tap it moved because a counter changed.

## Known, and deliberately not done

- ⚠️ **`consonants` and `doubleConsonants` in `reference.js` disagree.** `nk`,
  `ml`, `dl` and `nr` are in the second list and missing from the first, so
  `typingDrill.js` patches them back in via `MISSING_FROM_REFERENCE` rather than
  editing the Reference tab's rendered alphabet. **That is a content decision
  someone should make** — reconcile the two lists and delete the array.
- **No group picker.** The drill is one mixed pool. The theme and grammar axes
  on `/words/sentences` are derived from `categoryGroups` and would port almost
  directly; it was left out to keep the first version one screen.
- **Not run on a device.** Logic is verified end to end in node (917 exercises
  walked pick-by-pick); the screen itself has been linted and its imports
  checked, but not seen.

---

## Status

- `src/lib/typingDrill.js` — pool, parser, trays, grading
- `app/words/typing.jsx` — the screen
- `src/components/common/ResultStats.jsx` — shared results furniture
- tile on the Words hub, under the sentence builder (the two production drills)
- `typing: { guest: 2, free: 2 }` in `quotaLimits.js`

Remaining from the 09-16 list: types 1, 2, 3-content and 5.

Related: [2026-09-16-writing-unit-and-challenge-todo],
[2026-09-16-sentence-builder-grammar-axis],
[2026-09-12-sentence-builder-scoring-and-words-hub].
