# Answering & Agreeing, Rau, Common Describing Words, Yesterday & Tomorrow, and the question-word rules (2026-09-27)

Four new path units, three new lessons, and an expanded Question Words lesson. The
rules below are the author's. Anything marked Claude's is TODO-VERIFY.

## The path now (33 units)
- 7 Joining Words → **8 Rau: Six, To & Wear** (`u-rau`, free), then Questions.
- 12 Not & Don't → **13 Answering & Agreeing** (`u-answers`, free).
- 16 Describing Words → **17 Common Describing Words** (`u-adjective-words`, free). This
  is the `descriptions` set, which had no unit before, with 20 explicit words.
- 27 **Time of Day** (was "Days & Time of Day"): the parts of the day only.
- **28 Yesterday & Tomorrow** (`u-day-frames`, Pro): 13 words, from hnub hnub to puag
  nraus, plus the hnub words.

Every `order` after an insert shifted by one, with a `// was N` comment on each.

## Answering & Agreeing (`answering` set, 9 cards; lesson `grammar-answering`)
- Hmong has no literal "yes".
- **yog** is used as yes, usually as the answer to a question.
- **aws** is the everyday yes: agreeing, acknowledging, understanding, or allowing.
- **The answer takes the question word's place**, and keeps the question's word order.
  The author's pairs:
  - *Koj lub npe hu li cas? → Kuv lub npe hu ua Chai.*
  - *Nws yog leej twg? → Nws yog kuv tus phooj ywg.*
  - *Koj ua dab tsi? → Kuv sau ntawv.*
  - *Lawv nyob li cas? → Lawv tsis nyob zoo.*
  - *Koj puas nkag siab? → Kuv tsis nkag siab.*
- **Typos fixed on import:** "kub npe" → lub npe, "kus" → kuv, "datsi" → dab tsi,
  "phoojywg" → phooj ywg.
- Claude's sentences: *Aws, kuv nkag siab.* and *Koj puas yog Mai? Yog.*
- Registered after `tsisNegation` in the actions-and-time group.

## Rau (`rau-uses` set, 5 cards; lesson `grammar-rau`)
Rau is a homonym, and context decides which meaning it has:
- **six:** before a classifier.
- **to / for:** after a verb, before a person.
- **to put on / wear:** only for the feet (shoes, socks, slippers).

**verb + rau + person + verb** = "for someone to do something". The second rau is
implied, not said: *Kuv sau ntawv rau koj nyeem* = "I am writing for you to read".
- The author typed "Kauv", read here as Kuv.
- Claude's sentences: *Kuv muaj rau tus aub.* and *Kuv rau khau.*
- Registered after `conjunctions`.
- The tone drill is skipped because all five cards are patterns. That doesn't block
  the unit.

## Yesterday & Tomorrow (lesson `grammar-day-frames`, vocab `timeframes-days`)
- Before today: hnub hnub (3 days ago), hnub hmos (2 days ago), nag hmos (yesterday).
- hnub no (today).
- After today: tag kis (tomorrow), nag kis (2 days on), puag nraus (3 days on).
- The hnub words:
  - ib hnub: one day, all day, or someday, by context.
  - tas hnub: all the time.
  - txhua hnub: every day.
  - hnub i: the other day.
  - lwm hnub: some other day.
- **Spelling:** the author writes them joined (naghmo, tagkis, nagkis, puagnraus). The
  lesson uses the dictionary's spaced forms and mentions the joined ones. **Open.**
- **The Beatles:** English stops at yesterday and tomorrow, "since Paul McCartney only ever
  sang about Yesterday". It's a reference, not a quoted lyric.
- Registered after `time` in numbers-and-time.
- `time.js` was trimmed to Time of Day. The day sections are commented out, with a pointer
  to the new lesson.
- **Time of Day lost its Sentences step** when its day-frame words moved out. It's topped
  back up with `moreExamples` on 5 time cards. These are Claude's thaum sentences,
  `source: 'ai'`, for example *Kuv nyeem ntawv thaum hmo ntuj*.

## Question Words (expanded)
- **What each one asks:**
  - puas: a yes/no "is it / do you".
  - twg: which (+ classifier).
  - li cas: how (an explanation or a state; depends on context).
  - dab tsi: what.
  - vim li cas: why.
- **Only vim li cas and puas can start a question:** *Vim li cas koj ua ntawd?*,
  *Puas zoo?*
- **puas always sits right before the verb or adjective:**
  - puas + verb/adj = a direct confirming question.
  - subject + puas + verb/adj = a more open confirming question.
- Added a practice step ("Which question word can start a question?") and the two examples.

## Counts and checks
- TODO unreviewed count: **930** (was 916; +9 answering, +5 rau).
- All checks pass: vocabulary, path, splits, undefined-refs, reading, lesson-audio,
  theme, sense-pins, notes, scoring.
- Step availability: every new unit has flashcards, quiz, sentences and reading
  (Rau has no tone drill).
- Nothing has been tested on a device.

## Follow-up, the same day
- **Joined spellings (author):** naghmo, tagkis, nagkis, puagnraus, and tagkis no, "because
  we want to iterate it's common enough to be a dedicated word on its own". Changed on 58
  lines across 8 files (cards keep a `// was` trail). **stories.js left verbatim** (spaced
  forms). The builder's time-word list matches both spellings. The lesson now says the
  words are written as one, and may be seen apart.
- **Yog questions:** new card `ans-pattern-puas-yog` (puas yog …? → yog / tsis yog), a
  "Yog questions" examples step, and a practice step in Answering & Agreeing. Also
  *… puas yog?* = "right?". Claude's sentences, TODO-VERIFY. TODO count: **931**.
- **Typos:** "pestsawg" → pes tsawg in the Time Explained title and one example. The
  answering typos were already fixed on import.
- **Path unit screen:** the "not ready yet does not hold you back" line is commented out
  (author).

## GPT fact-check applied (same day)
- **Changed:**
  - `food-nroj-zaub` → **roj zaub**, since *nroj* = weeds. Example: *Kuv siv roj zaub ua
    noj.* All 33 path units are now ready.
  - *Kuv rau khau* → "I put on shoes"; the Hmong has no "my".
  - **kos** gained two senses: scrape (`rw-kos-scrape`) and **tom kos**, "over there"
    (`rw-tom-kos`). Tripod and bill were left out (weak or no source). TODO count: **933**.
- **Settled, no card:**
  - *noun + tau* is not a rule to teach.
  - *tau* ≠ "must". "You must go" is *Koj yuav tsum mus*. The held sense won't be restored.
  - *qhov tsev no* is wrong; it's *lub tsev no*.
- **Confirmed as written:** the yog Q&As (incl. *…, puas yog?* = "right?"), *Aws, kuv
  nkag siab*, and the thaum sentences.
- **Kept against GPT (author decisions):**
  - Joined *naghmo*: GPT prefers the spaced *nag hmo*, but it agrees there's no -s.
  - *tsis tau* glossed "not yet, haven't, not completed": the author's wording, and
    GPT's preferred glosses already come first.
- **Asked the author:**
  - *aub* vs *dev* for dog: GPT says *dev* is White Hmong.
  - Socks: GPT says *looj thom khwm*, not *rau*.
  - *tsaus ntuj*: "evening" or "night".
  - The story apostrophes: not a standard RPA convention.
  - Whether the stories should use the joined day words.
- **Answered, dog:** *aub* stays. dev/aub is regional, and both work in the US (author).
  Added to the card comment and saved to memory.
- **Answered, socks:** *rau* stays (author). *Looj* = cover/wrap/enclose (*looj taw*, cover
  the feet). It can work depending on context, but *rau* fits better because it's about
  putting things on your feet. One line added to the rau lesson.
- **Answered, story apostrophes:** remove them, commented so they can be restored (author).
  Two live lines were left: *yuav’ kauv* and *pov toj liab’*. The mouse story's (*me’ li*,
  *xuav’*, *mus’ los’*…) were already removed on 2026-09-25; my search had matched their
  `Was:` comments.
- **Answered, stories use the joined day words** (author): 12 lines in stories.js, each
  with a `Was:` comment. The quiz `because:` quotes were changed too, so they still match
  the text. Most of these are *tagkis* = morning (*ib tagkis*, *tagkis no*).
- **Answered, tsaus ntuj:** "night, evening; p.m." stays (author). Night is the literal
  meaning, and all three are correct depending on context: with a clock time it's p.m.
  Added the author's examples to the card: *Kaum teev tsaus ntuj* (10 p.m.), *Tam sim no
  yog tsaus ntuj* (right now it's night). The author wrote "tamsis no"; the app spells it
  *tam sim no*.

## Rau expanded, and "bill" (author, same day)
- **Rau is context-based, and has more meanings than the first three.** The lesson is now
  "Rau | Six, To, Put & Wear" and the unit "Rau: Six, To, Put & Wear" (9 cards, was 5):
  - **put / place / apply:** *Nws rau tshuaj*, he applies medicine. The author wrote
    "tsuaj"; medicine is *tshuaj* throughout the dictionary. *Muab phau ntawv rau saum
    rooj*, put the book on the table.
  - **to / toward / in / on / at a place:** context-based, and uncommon for going places,
    where other words do the job and rau is often left out and implied. *Lawv mus rau tsev
    kawm ntawv* = *Lawv mus tsev kawm ntawv* (they go to school). *Taug kev rau hauv nroog*
    (walk to the city).
  - **location:** *Nws nyob rau tsev* (it's at / in the house) is possible, but *ntawm* or
    *hauv* is more usual. *Nws nyob hauv tsev* is Claude's example, TODO-VERIFY.
  - The wear card lost "only for the feet". For clothing, rau is the feet verb, but rau
    itself isn't feet-only.
  - A second practice question was added: *Nws rau tshuaj* → applies.
- **kos ≠ bill.** A bill is **daim nqi** or **daim ntawv them nyiaj**. Both were added to the
  money set, and u-money is now 20 words (at the cap). Example sentences are Claude's,
  TODO-VERIFY. The tripod sense is still not added.
- TODO count: **939** (+4 rau, +2 bill).
