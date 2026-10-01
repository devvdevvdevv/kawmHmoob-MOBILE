# Countries: names on their own, teb chaws as its own entry, repeats commented out (2026-09-26)

**The author:** "remove the tebchaw classifier, but include it as a standalone,
tebchaw is the classifier for countries — then for the countries just the word
themselves. Capitalize since these are nouns. Comment out the repeating ones."

## What changed (`src/data/vocabulary.js`)

**1. The "Teb Chaws" prefix was removed from 7 entries**, leaving the capitalised
name alone. **Their ids were kept**, so word progress and notebook saves survive:
Thaib, Suav, Nyab Laj, Qhab Meem, Fabkis, Nyij Pooj, Kaus Lim. Each line has a
dated comment.

**2. `teb chaws` is its own entry,** `country-teb-chaws`, first in Countries 1:
*"country, nation — said before a country's name, like a classifier: 'teb chaws
Nplog', the country of Laos"*. Its example, *"Lawv mus ncig teb chaws Iyi."*, is
an existing sentence.
- **Spelling:** the author wrote *tebchaw*. The app spelling is **teb chaws**
  (spaced, with the final s), per the 09-20 ruling that *teb* and *chaws* are each
  words. The general `misc-teb-chaws` entry in `reading-place` stays, and lookup
  merges the two.

**3. Six repeats commented out,** each with its reason and a restore hint:

| commented out | why |
|---|---|
| Teb Chaws Meskas | same as **Meskas** once the prefix is gone |
| Teb Chaws Nplog | same as **Nplog** |
| Nplog teb / Thaib teb / Suav teb | the short forms of Nplog, Thaib, Suav. **Their example sentences were moved onto those plain entries**, which were the only country entries with examples |
| Pem | a second name for Myanmar, beside **Mias Mas** |

**4. `SET_SPLITS`:** Countries 1 lists `country-teb-chaws` first, and the six
commented ids were removed from it. `check-splits` is clean.

Every name was already capitalised (Kaus Lim Qaum Teb, Iyi…), and the plain
names now are too.

## Effects to know
- **Stories:** Zong Vang's *"Nplog teb thiab Thaib teb"*: tapping *Nplog* or
  *Thaib* now resolves to the plain entry. The story glossary's own *Tebchaws
  Meskas* line still answers first inside that story.
- The unreviewed count in TODO.md is re-counted (commented entries no longer
  count).
- Checks pass: splits, vocabulary, refs, reading, path, notes. **Not seen on a
  device.**

## Open
- **Pem vs Mias Mas:** if both names are in real use, restore Pem with a gloss
  that says which is older or more common.

---

## Update, same day: it is **Tebchaws**, joined and capitalised

**The author:** "capitalize tebchaw, also these are one of those words where we
can combine 'tebchaws'."

- `country-teb-chaws` is now **`Tebchaws`** (it was `teb chaws`). Its gloss reads
  "Tebchaws Nplog", and its example is *"Lawv mus ncig Tebchaws Iyi."*
- **The 09-20 note** in vocabulary.js ("`Teb Chaws Meskas` is the correct
  spelling… the rule is whether the parts are words") is marked **SUPERSEDED**
  in place. The author decides which words combine.
- **The spaced `misc-teb-chaws` in `reading-place` stays**, so older text with
  *teb chaws* (e.g. "txawv teb chaws") still resolves. Its gloss now names
  **Tebchaws** as the preferred spelling. Both taps were verified.
- **Saved to memory** as a standing spelling rule (`hmong-tebchaws-joined`).

---

## Update, same day: ethnicities capitalised, and Meskas as a people word

**The author:** "the ethnicities we need to capitalize them too" and "add meskas,
it also means white people, white general".

- **Capitalised**, headword and example sentence, each with a dated comment:
  *khej dub* → **Khej Dub**, *qhab* → **Qhab**, *mev* → **Mev**. The other nine
  (Suav, Fabkis, Thaib, Nyab Laj, Qhab Meem, Nyij Pooj, Kaus Lim, Askiv, Hmoob)
  were already capitalised.
- **New `eth-meskas`**: **Meskas**, "American; a white person — white people in
  general". This is the people sense. The country sense (United States) stays in
  countries as `country-meskas`, and a tap now shows **both senses** (verified).
  Its example, *"Kuv tus phooj ywg yog Meskas."*, was drafted in the pattern of the
  set's other examples and is `source: 'ai'`, `unreviewed`.
- The TODO unreviewed count went +1.
