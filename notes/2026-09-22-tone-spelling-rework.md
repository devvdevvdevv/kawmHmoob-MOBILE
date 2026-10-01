# Spell it out: two picks per syllable, not three (2026-09-22)

The brief: *"I need for you to rework the tones spelling logic, because
everything is too clunky."*

Reworks `notes/2026-09-20-tone-aware-typing-drill.md`, which now opens with a
pointer here. Rollback point: `archive/2026-09-22-pre-tone-rework/` (README says
how; both files, byte-identical).

## Where the clunk actually was

Measured before changing anything:

- **3 taps per syllable** (consonant tray → vowel tray → tone row), so a
  two-syllable word was **6 taps, plus Check, plus Next**.
- **The tray swapped after every tap.** One tray on screen at a time was a
  deliberate choice (20 chips is too many for a phone), but it means the thing
  under your finger is replaced three times per syllable.
- **Undo only popped the last pick.** Fixing the first consonant of a
  two-syllable word meant undoing everything after it.
- **Check was a separate tap** on an answer the app already knew was complete.

## What it is now

Two picks per syllable — the **letters** (consonant + vowel as one chip), then
the **tone**:

| | before | now |
|---|---|---|
| taps, 2-syllable word | 6 + Check + Next | **4** + Next |
| trays on screen | one, swapping | **both**, neither swaps mid-syllable |
| pick order | fixed | either half first |
| fixing a mistake | Undo, repeatedly | **tap the syllable**, pick again |
| checking | a button | **automatic** when the last slot fills |

## ⚠️ The decisions that matter

**The tone still gets its own pick, and all eight are always offered.** Folding
it into the letters chip would delete the feature: in RPA the tone IS the final
consonant, and this drill exists to say so. The eight never shuffle, so each
tone keeps its place and picking one becomes muscle memory.

**The letters tray is still hard.** The decoys are three wrong-consonant and two
wrong-vowel variants of the right answer (`txi` → `tsi ntxi thi txa txai`), so
one tap still means telling `tx` from `ts` and `i` from `a` — both skills the
three-tray version drilled.

**Real syllables are preferred as decoys.** A body no Hmong word uses is easy to
rule out on sight, which quietly gives the answer away. `bodyTray()` scores
attested bodies (parsed out of the whole vocabulary, cached) above invented ones.

**A vowel-initial word gets vowel-initial decoys.** `au` among five chips that
all start with a consonant would be the only one without one. The vowel-swap
decoys keep the empty onset, which is what hides it. (The old screen solved the
same problem with a dedicated "none" chip in the consonant tray.)

**The answer is per-syllable, not a flat pick list.** The flat list made Undo a
one-liner and made tap-to-fix impossible. `{ body, tone }` per syllable is what
lets any half of any syllable be replaced in any order. `undefined` still means
"not answered" and `''` still means "answered: Mid" — collapsing those was a bug
the first version had already fixed, and it stays fixed.

**Grading did not change.** Same four verdicts (`correct`, `alternative`, `tone`,
`spelling`), same named tones on both sides, same "`mis` is a word of its own —
milk". `diagnose()` takes the new answer shape and is otherwise untouched.

## The trade-off

**Auto-check means a mis-tap on the last slot is graded immediately**, with no
chance to fix it. That is the cost of removing the Check button. If it grates on
a real phone, the smallest fix is to bring Check back for the final slot only.

## Files

- `src/lib/typingDrill.js` — `bodyTray()`, `toneTray()`, `bodyOf()`, and the
  answer model (`emptyAnswer`, `setPart`, `nextFocus`, `isAnswerComplete`,
  `answerToSyllables`, `spellAnswer`). `diagnose()` takes the new shape.
  The retired `trayForStep()`, `trayFor()` and the flat-pick helpers are
  **commented out in place** with a restore pointer.
- `app/words/typing.jsx` — tappable syllable boxes, both trays, no Undo, no Check.
- `notes/2026-09-20-tone-aware-typing-drill.md` — header block pointing here.

Unchanged on purpose: `typingExercisesFor` / `allTypingExercises` /
`buildTypingSession` keep their signatures, so `src/lib/pathProgress.js` and the
path's tone step needed no edit.

## Verified

- Pool is still **919 exercises** — the rework changed the interaction, not the content.
- Trays spot-checked in Node: `zoo` → `hoo coo zo foo zau`; `aub` → includes `a`, `aa`;
  `ntses` → `ntsee ntse ntshe nple nte ntsa`.
- A two-syllable walk-through in Node: focus advances after both halves, wrong
  tone grades as `status: 'tone'` with 1/2 syllables right, fixing the tone grades
  `correct`.
- 200 trays in 7 ms.
- `stepAvailability().tone` still true for all 9 live path units.
- Lint clean on both files.

## ⚠️ Not verified

**Nobody has used this on a device.** Tone chip labels are the thing to watch:
"Mid-Falling with Air" at 10px inside a 23%-wide chip is the tightest piece of
layout on the screen, and Android clips letter-spaced text (which is why the
label has none). A two-syllable word is the best test — it exercises
tap-to-change and the focus wrap.
