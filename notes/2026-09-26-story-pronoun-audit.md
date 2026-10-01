# Pronoun audit — "Mus Saib Yeeb Yam" (2026-09-26)

The author asked for the pronoun story to be audited against their own table.
The goal: every pronoun used correctly, at least 15 times each, and specific
enough that a reader can see *why* each pronoun was chosen.

| | One | Two (dual) | Three or more |
|---|---|---|---|
| 1st | kuv | wb | peb |
| 2nd | koj | neb | nej |
| 3rd | nws | nkawd | lawv |

The cast: the narrator (**kuv**) + Fong = **wb**. Mai + Nraug = **nkawd**. All
four = **peb**. Yaj is the ticket seller. Ntxawm and Nplooj are friends met at
the end.

## Counts

| | kuv | wb | peb | koj | neb | nej | nws | nkawd | lawv |
|---|---|---|---|---|---|---|---|---|---|
| before | 169 | 75 | 33 | 36 | 23 | 26 | 51 | 33 | 24 |
| after | 168 | 77 | 37 | 37 | 25 | 22 | 50 | 37 | 17 |

Every pronoun was already over 15. The
problem was **correctness**, not quantity.

## The four recurring mistakes

1. **The narrator said nej or lawv about their own group.** The narrator is one
   of the four, so narration of the group is always **peb**. "Yaj hais rau nej"
   → "Yaj hais rau peb" (¶12 ×5, ¶14 ×2, ¶19). Only Yaj's own words say *nej*.
2. **Yaj said lawv plaub leeg to two of the four.** When he's *talking to* them,
   it's "the four of you" = **nej plaub leeg** (¶5 ×2, ¶10 ×3).
3. **Seats "near them" meant Mai + Nraug**, who are two people, so **ze nkawd**,
   not *ze lawv* (¶5 ×2, ¶10 ×2).
4. **A pair member was counted outside their own pair.** "Fong sat beside wb"
   → "beside kuv". Mai and Nraug "watched with peb" → "with wb". Mai put away
   "nkawd daim pib" → "nws daim pib" (¶16, ¶18).

## Other fixes

- **Possessives:** "wb tuaj nrog peb cov phooj ywg" → "wb ob tug phooj ywg"
  (the friends belong to the two speakers, and there are two of them) (¶4, ¶5).
- **Plot logic, so the pronouns are traceable:**
  - ¶3: all four arrive (¶2 says they left home together), then Mai and Nraug go
    ahead to the door.
  - ¶7: a new line, "Kuv muab ob daim pib rov qab rau nkawd", so the borrowed
    tickets go back to Mai and Nraug.
  - ¶8: "rov qab mus cuag Fong" → "tig mus rau Fong", because Fong was already
    there.
  - ¶11: removed "kuv daim pib ko uas nws twb muab rau kuv". It was Mai's ticket,
    not mine.
  - ¶13: "kuv coj wb" → "kuv coj Fong".
  - ¶19: "Kuv hais rau peb" → "Kuv hais rau sawv daws".
  - ¶20: now says exactly which two Ntxawm and Nplooj meet
    ("pom wb ob leeg ntawm qhov rooj, hos Mai thiab Nraug tseem nyob tom qab").
    "Peb ua tsaug rau neb" → "Wb ua tsaug rau neb".
- **¶15 rewritten.** It had the narrator saying "lawv plaub leeg" about their own
  group, plus Yaj lines after Yaj had left. It's now a group of **five
  strangers** (*lawv tsib leeg*), so *lawv* is genuinely "they, 3+". Nraug whispers
  "Wb paub lawv" to show *wb* from the other pair's side. **Claude-written Hmong:
  the author should review it.**
- **English glosses** now name the pair where it could be ambiguous, e.g. "the two
  of us (Fong and me)" and "We two (Mai and I)".
- **Quiz:** q8 was updated to match ¶20. Two new questions were added: q9 (*nej*
  vs *neb*) and q10 (*lawv* vs *nkawd*).
- **Glossary** +7: *sawv daws, hais me me, tham nrov nrov, nyob twj ywm, kawm
  ntawv, lawv tsib leeg, nej plaub leeg*.
- **Dictionary:** +2 (*sawv daws*, *nyob twj ywm*, both unreviewed). **Movie
  theater** is now `bld-lub-tsev-ntsia-yeeb-yam` ("lub tsev ntsia yeeb yam", the
  author's more faithful literal term). The old `lub tsev yeeb yaj duab` is
  commented out, and the buildings split points at the new id. The TODO unreviewed
  count is 806.

## Supersedes
This supersedes the earlier "the pronouns are deliberate, don't touch" rule for
this story. The author asked for the audit and supplied the table. The memory
`author-hmong-choices-are-deliberate` was updated: an explicit audit request
overrides import-verbatim.

## Checks
check-reading passes (6 stories, 66 questions), as do check-vocabulary, splits,
undefined-refs, path and notes. **Not seen on a device.**

## Follow-up: single words (same day)
The author asked for every common single word in the story to be in the
dictionary. A strict re-scan found two real words: **lej** (number, maths;
`numbers-lej`) and **ntej** (front, before; `locprep-ntej`). Both use the author's
lines as examples and are tagged unreviewed; the TODO count is 808. The rest are
bound halves of phrases that already resolve (*ke, tsaug, tam, txhij, zem,
pliag, twj, ywm, nrab, daws*). *sis* is the spaced spelling of `tiamsis`, which
has been a single entry since the 2026-09-20 cleanup, so no duplicate was added.
The dictionary restructure (one entry per word) will make spaced spellings find
their joined entry.
