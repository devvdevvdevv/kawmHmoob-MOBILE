# Process playbook: how to handle the major kinds of change (2026-09-28)

This is written from two days of building (09-27 and 09-28). Each section is a checklist for one
kind of work, in the order that avoids the mistakes those days actually hit. It assumes the
standing rules in memory: comment out, never delete; the author's Hmong is deliberate; `notes/`
is for dated engineering notes.

---

## 1. The author gives a grammar ruling
Examples: "NO yog before a describing word", "hu alone when asking", "rau is context-based".

1. **Find every place the old rule is taught before editing anything.** Search the lessons, the
   cards and `pathSentences.js`. One rule was taught in four places (Yog, Describing Words and
   Action Verbs lessons, plus a card), and fixing one left the others contradicting it.
2. **Rewrite, don't delete.** Comment out the old line with a `Was:` and the reason, then write
   the new one. Restored lines get a "Restored" comment.
3. **Update the ✗ "common mistakes" lines too.** They encode the rule in reverse.
4. **Check the example sentences against the rule.** *Tsev yog loj* was the author's own example
   and still broke the final rule. When an example conflicts with a rule the author states more
   emphatically, comment the example out and say so.
5. **Save to memory any rule that has flipped, or could flip**, e.g.
   `hmong-no-yog-before-adjective`. The yog rule went GPT → softened → restored in one day.
6. **Log it** in the day's note under its own heading, quoting the author.

## 2. Adding a new path unit
1. **Set (vocabulary.js).**
   - Set membership is where a card PHYSICALLY sits, and `category` must match it
     (check-vocabulary catches a mismatch).
   - To move a card, cut the line into the other set.
   - Tag `unreviewed` on anything Claude wrote.
2. **Unit (path.js).**
   - Insert with the `insertAfter` pattern: every later `order` shifts by one, each with a
     `// was N` comment.
   - At most **20 words** and at most **3 categories**.
   - An explicit `words` list only reaches cards inside the unit's own categories.
3. **Lesson file.**
   - Steps: intro (`## ` headings, `> ` examples), examples, practice, quiz.
   - Exactly one `vocab`. Register it in `lessons.js` (import plus a group).
   - Point the unit's `introLesson` at it. If the lesson is a draft, set `placeholder: true`.
4. **Access and theme.**
   - Grammar units are FREE: add the set to `FREE_CATEGORY_IDS` in `lib/vocabAccess.js`, and to
     the fundamentals memory.
   - Add the set to a theme line in `CATEGORY_THEMES`.
   - A set that should appear in the path only goes in `PATH_ONLY_CATEGORIES`.
5. **Sentences.** Every unit needs **7 or more** drillable sentences.
   - Each card needs an `exampleSentence`, or the unit isn't ready.
   - Top up with `pathSentences.js` (section 3).
6. **Counts.** Update the TODO "unreviewed" count to the exact number; check-notes compares it
   to the data.
7. **Verify.** Run every check (section 8), then `stepAvailability` for the new unit.

## 3. GPT sentence batches (the 7-per-unit sentences)
1. **Write the prompt with every settled rule in it.** Ask for JSON as
   `{unit, word, hmong, english, note}`, 5–9 words, and the unit's focus in every sentence.
2. **Review each sentence against the rules before import.** GPT's typical faults:
   - yog before an adjective;
   - yog with a name;
   - day words in the wrong direction (*nagkis* glossed as the past);
   - *kaum ib nrab* for 10:30;
   - rau for location;
   - English-greeting calques;
   - li for people;
   - "eat rice" for *noj mov*;
   - duplicates.
3. **Drop or fix, recording `was:` on every fix.** Put `note:` on anything still uncertain.
4. **Import into `src/data/pathSentences.js`.**
   - Sentences go in after the unit's own, up to `FULL_SESSION_LENGTH` (10).
   - They're skipped automatically if over 9 chips (`MAX_TOKENS`), duplicated, or (for u-yog)
     missing yog.
5. **Scan for sentences over the chip limit**, then **count per unit**.
6. **Say the kept and dropped numbers accurately.** Recount before reporting; the 75 / 88
   mix-up happened once.

## 4. Research lists from outside (GPT summaries, papers)
1. **Verify against the primary source.** Bisang 1993 is local, at
   `Downloads/Hmong18.pdf`; read it with `pdftotext`. Don't scrape online.
2. **Add only what's missing.** Check the existing sets first.
3. **When a list contradicts the author, ask; don't choose.** Leave the item out until they
   answer.
4. **Be exact about what was wrong.** When the author said "your sentence of *na* is
   hallucinated", Claude concluded the *word* was fake, and it wasn't. Separate "the example is
   wrong" from "the word is wrong".

## 5. Sentence-builder levers (lib/sentenceBuilder.js)
- **`KEEP_WHOLE` and `KEEP_WHOLE_CATEGORIES`** decide which multi-word entries stay one chip:
  grammar words and calendar names. Verbs and nouns split.
- **Punctuation is a hard boundary** for phrase chips. When phrases overlap, the later phrase
  wins (the *nag los, yog li* fix).
- **`sentencesMustInclude`** (on a unit in path.js) drills only sentences that contain a word
  (u-yog: yog).
- **`DECOY_WORDS` / `DECOY_TWINS`** add wrong chips for look-alike words (u-so-then). Never offer
  an interchangeable twin as a decoy.
- **`PATH_ONLY_CATEGORIES`** (vocabulary.js) keeps a set out of the Words tab and the mixed
  drills.
- **After changing tokenization, diff every sentence's tokens before and after, and recount
  each unit.** A change can quietly push a unit under 5 (Writing Dates fell to 3 once).

## 6. Placeholder lessons
- Set `placeholder: true` on the lesson. `PlaceholderBadge` shows an orange "✎ Placeholder" pill,
  **for admins only**, on the Learn card, the unit preview and the lesson screen.
- Build a placeholder only from settled rules and reviewed sentences.
- To replace one, write the real lesson and delete `placeholder: true`.

## 7. Mechanics that bit
- **Edit with scripts written by the Write tool.** Bash heredocs and `node -e` mangle
  backslashes and quotes. Match on text, not line numbers.
- **Files are CRLF.** Normalise to LF, edit, then write back with the original line ending.
- **Parse every touched file with `@babel/core` after each edit.**
- **A script that throws halfway leaves earlier writes on disk.** Check which files changed
  before rerunning (the tense-future and answers runs).
- **Harness classifier outages** block Bash, Write and Edit, but reads still work. Keep going
  with read-only work, and redo the writes once it recovers.

## 8. The checks (print each one's real last line)
`check-vocabulary`, `check-path`, `check-splits`, `check-undefined-refs`, `check-reading`,
`check-lesson-audio`, `check-theme`, `check-sense-pins`, `check-notes`, `check-scoring`.
`check-path` can end on a warning; read its PROBLEMS block. Then rebuild the index with
`node scripts/build-notes-index.mjs`.
