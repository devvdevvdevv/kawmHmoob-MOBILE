# Story vocabulary scan — 42 words added, 2 bugs fixed, grammar flags (2026-09-24/25)

Two passes over the reading library:

1. **Glossary pass (09-24):** every story glossary entry checked against
   `src/data/vocabulary.js`.
2. **Word-by-word pass (09-25):** every token of every live story run through
   the reader's own `lookupWord(raw, story)` to find taps that return
   "no entry yet".

After both passes, **all four non-Zong Vang stories resolve 100% of their
tokens.** Checks green: `check-reading`, `check-vocabulary`,
`check-undefined-refs`. Not verified on a device.

---

## What was added to the dictionary

All tagged `'reading', 'unreviewed'`, in the existing `reading-*` groups (no
new categories — those groups are exempt from the one-sense-per-card check by
design). **Every example sentence is the story's own line, not new Hmong**, and
none carry `source: 'ai'`. The sentence builder still skips them because they
are longer than `MAX_TOKENS`.

**09-24 — 35 words from the two Society stories' glossaries**, under a
`HARVESTED FROM THE SOCIETY STORIES` header in each group. These include ib puag ncig,
kev tswj xyuas, lub luag haujlwm, khoom muaj nuj nqis, tsiaj txhu, tsim kho,
cog qoob loo, tshuaj lom, pa roj avgas, khoom pov tseg, qias neeg,
kws tshawb fawb, nag xob nag cua, tub ki xeeb ntxwv, tsoom fwv,
kev cai lij choj, koom haum lag luam, hluav taws xob, hnub ci, kab lis kev cai,
yav pem suab, lub xeev siab, kev hloov pauv, kev cuam tshuam, sib cuam tshuam,
txoj kev xav, kev coj cwj pwm, kev tawm tswv yim, kev sib xyaw, kws txawj ntse,
txhawb nqa, muaj txiaj ntsig, thawj coj, rov xav dua, txoj hau kev.
*kev tswj xyuas* and *kev cuam tshuam* only occur in story titles, so their
examples are the titles.

**09-25 — 7 words no story glossed and the dictionary lacked:**
to taub (understand), hwm (respect), xws li (such as), suav daws (everyone),
tiav (complete; "kom tiav"), xyoo pua (century), tuaj yeem (can).
`suav daws` has **no example** on purpose — its only story line is flagged below.

**Spelling variants → story glossary, not dictionary.** The stories write
*tiam sis* / *tab sis* and *ntiajteb*; the dictionary has *tiamsis* and
*ntiaj teb*. On 09-20 the spaced *tiam sis* was deliberately merged out of the
dictionary as a duplicate, so the fix is a glossary line in each story that
uses the variant (Ntxawm, Tus Miv, Kev Tswj). This is tier 1 lookup, the same
mechanism as the `rau` context gloss. It does not correct the text.

## What was deliberately NOT added

- **Zong Vang's "missing" general words** (bicycle, twenty, but, the public, or).
  All of them already exist under another spelling or with their classifier
  (`neesnkaum`, `tiamsis`, `lub tsheb kauj vab`, `pejxeem`). The spaced copies
  were commented out on 09-20. Re-adding them would reverse that cleanup.
- **Names, places, English loans.** They stay glossary-only, per the rule in
  `stories.js` (vocabulary.js feeds quizzes and SRS).
- **One-off phrases:** ploj ntais mus ib txhis, raug kev puas tsuaj,
  raug kev nyuaj siab, yam uas yug los nrog, tseem nyob qhib, sib cav hnyav,
  txheej ntau theem, haiv neeg Hmoob, hluav taws xob ntuj. They still resolve
  inside their stories.

## Bugs fixed (commented out, not deleted)

- **A whole story pasted inside another story's `questions`.** A second copy of
  `story-kev-hloov-pauv-lub-xeev-siab` sat inside
  `story-kev-tswj-ib-puag-ncig.questions`, so the quiz rendered it as a question
  with no prompt and no options. `check-reading` caught it. It was identical to
  the live copy except `level`: 'intermediate' there, 'advanced' live.
  **Open: which level is right?**
- **Three duplicate glossary entries** in the environment story (tsiaj txhu,
  tub ki xeeb ntxwv, kab lis kev cai) could never be shown.

## Not a bug

In the word-scan, 20 Zong Vang tokens looked unresolved, like `nyob—tseem`. That was the
scan script splitting on spaces only. The reader splits on em/en dashes too
(`app/reading/story/[storyId]/index.jsx`, `split(/(\s+|[—–])/)`), so those taps
work.

---

## ⚠️ Grammar flags — high / medium APPLIED 2026-09-25, low still open

**Update, same day: every high and medium flag below was applied on request**
(each changed line in `stories.js` carries a `FIXED 2026-09-25` comment with
the `Was:` text). The ¶2 environment line got a NEW Hmong subject —
*Kev hloov pauv ntawm huab cua* — written by Claude from words already in the
text, so that one line needs a fluent read most. Its unused glossary entry
*hluav taws xob ntuj* was commented out. The four **low** flags are untouched.

Originally: none of these were changed. The story text is the author's, and the file's own
rule is that no Hmong ships unread by a fluent speaker. Zong Vang was **not**
re-audited (it already had a line-by-line review). Confidence is my estimate.

### Kev Tswj Xyuas Ib Puag Ncig (environment)

| ¶ | Line | Concern | Conf. |
|---|---|---|---|
| 5 | …nyob ze rau ib puag ncig **suav daws** los ntev lawm. | *suav daws* (everyone) sits after the object, and the English drops it. Probably belongs after the subject: *Peb haiv neeg Hmoob suav daws…*, or should be removed. | high |
| 2 | **Hluav taws xob ntuj** uas tswj huab cua yuav ua rau nag xob nag cua loj tuaj ntxiv. | Hmong ≠ English. The Hmong says "natural electricity that controls the weather will make storms bigger". The English says "the *disruption* of natural forces". Nothing in the Hmong means disruption, and *hluav taws xob ntuj* as "natural forces" is doubtful. | high |
| 3 | …kom **txhob** pov tseg cov **khoom puas** ib puag ncig. | (a) The app's ruling is *tsis txhob* for a negative ("Tsis txhob mus ze tus tsov"); *kom txhob* is colloquial. (b) *khoom puas* reads as "broken things". The meaning intended is "things that damage the environment", e.g. *khoom uas ua rau ib puag ncig puas tsuaj*. | medium |

### Kev Hloov Pauv … Lub Xeev Siab

| ¶ | Line | Concern | Conf. |
|---|---|---|---|
| 4 | …nws twb tau hloov pauv **lawm** txoj kev uas peb saib… | *lawm* is clause-final. Here it sits before the object. Expected: *…twb hloov pauv txoj kev uas peb saib … lawm.* | medium |
| 4 | …tib neeg lub neej thiab lub zej zog **ib nkag**. | *ib nkag* for "as a whole" is unusual. *tag nrho* or *huv tib si* would be the common choices. | low |
| 3 | …los tsim **ib lub ib puag ncig**… | The doubled *ib* is awkward. | low |

### Tus Miv Thiab Tus Nas

| ¶ | Line | Concern | Conf. |
|---|---|---|---|
| 3, 4, 5, 6 | me**’**, xuav**’**, muaj**’**, no**’**, mus**’** los**’** | Stray apostrophes. RPA doesn't use them. Lookup strips them, but they display. They look like leftover typing marks. | high |
| 2 | Tus miv **xav tau tias**… | *xav tau* = want; *xav tias* = think. The English says "thinks". | medium |
| 2 | …tus nas **xis noj** heev | For "tasty", *qab* is the usual word. *xis* may be dialectal. | low |
| 6 | Tus nas mas **niam** mus los… | Unclear word. Possibly meant "back and forth" (*mus mus los los*). | low |

## Open

- [ ] A fluent reader checks the applied fixes (esp. environment ¶2) and rules on the four low flags.
- [ ] Level of the Lub Xeev Siab story: advanced (live) or intermediate?
- [ ] The 42 new entries are `unreviewed`. Glosses were rewritten from story
      glossaries for general use.

---

## Update, same day: 45 standalone words (the "tswj" pass)

**The author:** "identify whatever words aren't already in dictionary in the
reading stories and implement them … like tswj, to govern or manage."

**Why the first scan missed these:** it counted a word as covered if a tap
resolved to *anything*, including a longer compound. `tswj` "resolved", but only
as **kev tswj xyuas** (management). Nobody could learn what `tswj` itself means.

**This pass** asked a stricter question: *does the word have a dictionary entry
of its own?* **167 tokens had none**, plus 66 capitalised tokens (names, places,
English loans), which were skipped. Triaged:

- **Added: 45 real standalone words**, ids `rw-<word>`, in the `reading-*`
  groups:
  - law: tswj, yuam, tswv
  - work: tsim, tshawb, kuaj, xam, pauv
  - motion: thaiv, tiv, zam, ncig, ploj, cais, xyaw, raws, tshwm
  - general: khoom, tshuaj, lom, roj, pa, yeeb, kab, npoo, ntsis, pawg, feem,
    mas, tsam, npau, ris
  - place: cua, nag, hav
  - qualities: nyuaj, ncaj, khov, txawv, ruam, ntse, laus, ntsuab, haum
  - body: yug

  **Each example sentence is the shortest story line using the word, verbatim.**
  Glosses are Claude's, tagged `unreviewed`. Where a compound matters, the gloss
  names it ("tiv thaiv", to protect).
- **Deliberately NOT added: compound halves with no meaning alone.** Examples:
  sis (tiam sis), kauj (tsheb kauj vab), lws (txiv lws suav), cwj/pwm, tij/laug,
  raub (kab raub ris), zeb (pob zeb), ntsuj/plig, qoob/loo, hluav/taws. The
  compound tier already explains them in context. A standalone entry would teach
  something false.
- **Also not added:**
  - `ntu`, `ntus`, `pliag` and `npaum`: their phrase entries (*ib ntus*, *npaum
    li cas*) already mean the same thing.
  - `tsheb`: the bare form was merged into `lub tsheb` on 09-20, and that is kept.
  - `teg`: Green Hmong for hand; the White Hmong word is *tes*.
  - English loans (feet, cement, trauma, cocaine, bass, cello, oak, drive-by).

**Verified:** tapping *tswj* in the environment story now answers **tswj — to
govern, to control, to manage**, from the dictionary, and it is saveable. Checks
pass: vocabulary, splits, path, refs, reading, notes. The TODO unreviewed count is
now **781** (was 736).

⚠️ **For a fluent read, the glosses most worth checking:** `mas` (particle),
`tsam` (lest), `npoo`, `haum`, `hav`, and the second senses of `kab` (line) and
`yug` (to raise).
