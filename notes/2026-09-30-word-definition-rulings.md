# Word definition rulings: aws, tus, leej, nim no, tom qab (2026-09-30)

Five author rulings applied to `src/data/vocabulary.js` (and `stories.js` where
the same word is glossed for the reading dictionary). Each edit carries an
inline comment with the old wording, per the comment-out-never-delete rule.

---

## aws — concise and educationally neutral

Two entries, both rewritten.

| id | was | now |
|---|---|---|
| `ans-aws` | `yes, mm-hm, okay — agreeing, acknowledging, or allowing; the everyday "yes", though not a literal one` | `yes; okay — used to agree or acknowledge` |
| `discourse-aws` | `(soft agreement: "oh", "yes", "I see") — preferred over as` | `yes; I see — a soft agreement or acknowledgement (spelled aws, not as)` |

**Why.** "mm-hm" transcribes a *sound* rather than defining a word, and the
trailing hedge ("though not a literal one") told a learner what `aws` is NOT
before telling them what it is. The spelling note on `discourse-aws` was kept:
that is a real orthographic point, not a hedge about meaning.

## tus — people, animals and living things. Not long narrow objects.

`classifiers-tus`:

- **english:** `classifier for people and animals` → **`classifier for people,
  animals, and living things`**
- **sense REMOVED:** `classifier for long, narrow or individually identified
  objects`

**Why.** Long, narrow things take **`txoj`**, not `tus`. Left in, that sense was
teaching learners to say `tus kev` for a road, which contradicts the `txoj kev`
ruling already recorded elsewhere. The pronominal sense (`the one; that
individual`) was kept — it is a genuine separate use.

## leej — people only

`classifiers-leej` in `vocabulary.js`, and the matching gloss in `stories.js`:

- **english:** `classifier for people; respectful individual classifier` →
  **`classifier used only for people`**
- **sense:** now reads `classifier used only for people — never for animals or
  objects`

**Why.** The old wording left the boundary to inference. A learner reading `tus`
and `leej` side by side had nothing telling them the sets differ — and they do:
`tus` covers animals and other living things, `leej` does not. The `leej twg =
who` sense was kept.

## nim no — right now, not nowadays

`gen-nim-no`: `nowadays` → **`right now; currently`**

**Why.** `nim no` points at *this moment*. "Nowadays" is a different span of
time — the present era — and a learner reaching for "right now" would have been
handed the wrong word.

## tom qab — two senses, time and space

`time-context-tom-qab`:

- **english:** `after` → **`after (in time); back, behind (in space)`**
- **senses added:**
  - `after — when sequencing events in time` (context: `time-context`)
  - `back; behind — when describing physical space` (context: `reading`)
- **tags:** `place` added

**Why.** `after` alone is half the word. In a spatial frame `tom qab` means back
or behind, and a learner with only the temporal gloss would read "behind the
house" as "after the house". The time sense is listed first because this entry
lives in `time-context` and that is the sense its surrounding lesson teaches.

The two `stories.js` glosses for `tom qab` already carried both senses
(`after; behind` and `behind; after`) and needed no change — worth noting that
the reading dictionary was ahead of the vocabulary entry here.

---

## Checked and left alone

- **`tus` example sentence.** A first pass through concatenated `sed` output
  appeared to show a duplicate `exampleSentence` key on this entry
  (`Ib fab.` / "One side/section", which belongs to a different classifier)
  silently overwriting the dog sentence. Re-reading the file directly showed no
  such duplicate — the apparent adjacency was two printed ranges meeting. The
  entry is clean and still reads `Kuv muaj ib tus aub.` / "I have one dog."
  Recorded because the false alarm is easy to repeat: **`sed -n 'a,b p;c,d p'`
  concatenates ranges with no separator**, so the boundary looks like adjacent
  lines.
- `aub` for dog was left as-is throughout — regional, correct in the US, and not
  to be flagged.

`node -e "import('./src/data/vocabulary.js')"` parses clean after the edits.
