# ⚠️ IMPORTANT REFERENCE — Bisang (1993), "Classifiers, Quantifiers and Class Nouns in Hmong" (2026-09-26)

**The author flagged this as important.** It is the foundational academic
account of the Hmong classifier system, and the source to check the app's
classifier teaching against.

## Citation (verified via Crossref)

> Bisang, Walter (University of Mainz). 1993. **"Classifiers, Quantifiers and
> Class Nouns in Hmong."** *Studies in Language* 17(1): 1–51. John Benjamins.
> DOI: [10.1075/sl.17.1.02bis](https://doi.org/10.1075/sl.17.1.02bis)

Links: [ResearchGate](https://www.researchgate.net/publication/233703489_Classifiers_Quantifiers_and_Class_Nouns_in_Hmong) ·
[John Benjamins](https://benjamins.com/catalog/sl.17.1.02bis) ·
[Semantic Scholar](https://www.semanticscholar.org/paper/Classifiers,-Quantifiers-and-Class-Nouns-in-Hmong-Bisang/b2db93bba1c41c296ad33a269018f4ea13f3aaeb) ·
[Ingenta](https://www.ingentaconnect.com/content/jbp/sl/1993/00000017/00000001/art00001?crawler=true)

## What could and couldn't be scraped (2026-09-26)

- **The full text was not available.** ResearchGate, John Benjamins and JBE
  Platform all returned **403 Forbidden** to an automated fetch. Semantic
  Scholar's API rate-limited. The article is behind the publisher's paywall.
- **What was obtained:** the Crossref record (citation and abstract summary),
  and a search across indexed sources quoting or citing the paper. Everything
  below is from those; nothing is invented.
- **To get the full paper:** a university library (John Benjamins journals are
  widely held), requesting it from the author on ResearchGate, or buying it from
  John Benjamins. A PDF dropped in the repo could be summarised properly.

## What the paper says (from the abstract and citing sources)

**1. Four "operations of nominal concretization"** form the basis of a typology
of classifier languages:
- **individualization**: picking out one unit
- **classification**: sorting nouns into kinds
- **relationalization**: possession
- **referentialization**: making a noun refer to a specific thing

**The first three are at work in the Hmong classifier system.**

**2. A grammaticalization continuum,** described by the parameters [±exact],
[±entity] and cohesion:

> **nouns → class nouns → quantifiers → intrinsic quantifiers → classifiers**

In other words, Hmong "measure words" are not one category. Some are still nearly
nouns, some are quantifiers, and the most grammaticalized are true classifiers.

**3. The core classifiers**, as the citing literature summarises them:

| classifier | for |
|---|---|
| **lub** and **tus** | the two most common: lub for round, three-dimensional things; tus for animate beings and long, rigid things |
| **leej** | humans (respectful) |
| **rab** | tools |
| **txoj** | long, one-dimensional objects **and abstracts** |
| **daim** | flat, two-dimensional objects |
| **txhais** | individualizes objects (one of a pair) |

**4. Classifiers do far more than count.** A later account building on Bisang
(1993) and Riddle (1989), covering White Hmong and Green Mong, says that **most
Hmong classifiers serve several roles at once**:
- noun classifier
- **numeral** classifier (*ib tus aub*, one dog)
- **possessed** classifier (*kuv lub tsev*, my house)
- **deictic** classifier (*tus aub no*, this dog)

It also notes that **definiteness and referentiality are marked by the
classifier**: *tus aub* can mean "**the** dog".

**5. Quantifier float** (a related, more recent paper): Hmong has **both bare
classifiers and quantifier float**, a combination previously unattested, which
runs against current typological proposals.

## Why it matters to this app — what it confirms

- **The "Important" section in the Classifiers lesson**
  (`src/data/lessons/noun-classifiers.js`, 2026-09-25): "the majority of nouns
  have a classifier… it is how a noun is normally said". **This paper supports
  it.** A classifier marks individualization, possession and reference, not
  just counting. The lesson's older opening line, "when counting or pointing
  something out", undersells this, which is why the Important section was added.
- **"Which one?" = classifier + twg** (the `questions-which` lesson): this is the
  deictic/referential use. *lub twg*, *tus twg*.
- **This & That** (path unit 8): *tus aub **no***, the deictic classifier.
- **Possessives**: *kuv **lub** tsev*, the relationalization (possessed-classifier)
  use.
- **Some, Many, All** (path unit 10) and the `quantifiers` set: *ib co*,
  *ob peb* and *txhua* sit on the **quantifier** step of Bisang's continuum.
  That makes them a different kind of word from *lub* or *tus*. Worth saying so
  if that unit ever gets a lesson.

## What to do with it later

- [ ] **Get the full text**, then check the classifiers lesson's six-row table
      (tus, lub, daim, txoj, rab, phau) against Bisang's semantic classes. In
      particular: **leej** and **txhais** aren't taught yet.
- [ ] **Consider a lesson line on the four jobs** of a classifier (count / own /
      point / "the"). It is the clearest single explanation of why the
      Important section is true.
- [ ] **When the Some, Many, All unit gets an intro lesson,** use the
      quantifier-vs-classifier distinction.

## Sources

- [Crossref record, DOI 10.1075/sl.17.1.02bis](https://api.crossref.org/works/10.1075/sl.17.1.02bis)
- [ResearchGate: Classifiers, Quantifiers and Class Nouns in Hmong](https://www.researchgate.net/publication/233703489_Classifiers_Quantifiers_and_Class_Nouns_in_Hmong)
- [John Benjamins catalogue](https://benjamins.com/catalog/sl.17.1.02bis)
- [Semantic Scholar](https://www.semanticscholar.org/paper/Classifiers,-Quantifiers-and-Class-Nouns-in-Hmong-Bisang/b2db93bba1c41c296ad33a269018f4ea13f3aaeb)
- [ResearchGate: Classifiers in Hmong](https://www.researchgate.net/publication/336787710_Classifiers_in_Hmong) (the later account of multiple classifier roles)
- [Academia: Quantifier Float in Hmong](https://www.academia.edu/127662041/Quantifier_Float_in_Hmong)
- [Academia: Classifiers and Nominalizers in Hmongic](https://www.academia.edu/44079051/Classifiers_and_Nominalizers_in_Hmongic_A_Preliminary_Database)

---

## ✅ Update, same day: full text obtained and put into the app

The author downloaded the paper (`~/Downloads/Hmong18.pdf`). It was read with
`pdftotext`, which is available in Git Bash. The Read tool's PDF renderer needs
poppler, which isn't installed.

**What was taken from the paper and implemented:**

1. **The Noun Classifiers lesson** (`src/data/lessons/noun-classifiers.js`):
   - **tus and lub corrected** (Appendix I, citing Mottin 1978). *tus* also
     takes **long things and long body parts**: *tus choj* (bridge), *tus mem*
     (pen), *tus hniav* (tooth). *lub* also takes **vehicles, buildings and
     abstract nouns**: *lub tsheb*, *lub npe*, *lub neej*. The old notes are in
     a `Was:` comment.
   - **leej and txhais added** to the table, with the existing classifier audio.
     *leej txiv* = father, but *tus txiv* = husband (ex. 55–56). *Leej twg?* =
     who? (ex. 57). *txhais tes / npab / ko taw* = one hand, arm or foot.
   - **New section, "The four jobs of a classifier":** count (*ib tus aub*),
     own (*nws rab riam*, ex. 48), point (*tus aub no*), and "the" (§4, citing
     Riddle's "referential salience").
   - **New section, "When the classifier is left out"** (§5, ex. 52): family and
     inalienable nouns drop it (*kuv txiv, kuv niam, koj npe*). Body parts
     usually keep it.
2. **A new word set, `measure-words` ("Measure & Group Words", 📏),** from
   Appendix I §2: pab, hom, yam, thaj, qais, kauj, lo, xub, zag, kob, nthwv, tauv
   and phaum.
   - **Every example is the paper's own, verbatim**, with
     `source: 'bisang-1993'`, not `'ai'`. **12 of 13 now appear in the sentence
     builder**; *ib lo lus* is too short once split into chips.
   - It sits in **Grammar Essentials**, next to quantifiers, and is **free**
     (`FREE_CATEGORY_IDS`).
   - Words already in `classifiers` (nkawm, tsob, thooj, phau, yim, pob) were
     not repeated.

**What the paper confirmed about existing app choices:**
- **"Nws npe hu ua Mim"** (the author's fix on 2026-09-25) is attested:
  *koj npe* (your name) takes no classifier (ex. 52). *Lub npe* is also valid.
- The "Important: most nouns take a classifier" section, and *lub twg* / *tus twg*.
- The `classifiers` word set already had leej, txhais and the long-objects sense
  of tus. The data was right; the lesson hadn't caught up.

**A dialect note:** the paper glosses *txhais teg* as "leg". In White Hmong, *teg*
is hand in Green Mong usage, and White Hmong uses *tes*. Only the White Hmong
examples (*txhais tes*) went into the app.

**Not implemented, and worth a look later:**
- **Qualifying attributes** (§2.1): a small closed class of adjectives that can
  go *before* a quantifier: *me / nyuag* (little), *tuam / niag* (big), *qub*
  (old, former), *zoo*, *laus*. This is a nice "why" for a future lesson.
- **The class nouns** (Appendix II: *txiv-* fruits, *noog-* birds, *ntses-*
  fish, *kws-* experts, *tub-* agents, *sab-* sides). These are a strong
  vocabulary-building idea ("*kws* + X = an expert in X").
- Measures of time, weight and capacity (Appendix I §2.1).

**Checks:** vocabulary, splits, path, refs, theme, notes and reading all pass.
**Not seen on a device.** Look at the Classifiers lesson intro and the new set
under Grammar Essentials.

---

## Update, same day: "tus nqi". The classifier attached to the headword

**The author:** "attach 'nqi' to the nqi, if it exists." This was read as
**attach the classifier to *nqi*.** The entry `money-tus-nqi` had the headword
**"nqi"**, while its **id**, its example (*"Tus nqi yog tsawg?"*) and its own
note ("Takes classifier 'tus'") all said *tus nqi*. Bisang (Appendix I) lists
it as *tus nqe* (the price).

- The headword is now **`tus nqi`**, and the id is kept (progress keys on it).
  There is a dated comment and a `Was:`.
- **A bare *nqi* still resolves.** The compound tier answers *tus nqi*, and also
  lists *txo nqi, lov nqi, nqi pes tsawg?*. Inside "Tus nqi yog tsawg?", tier 0
  matches the phrase exactly. Both were verified.
- Checks pass: vocabulary, path, refs.
- **If "attach nqi" meant something else, say so.** The change is one line.
