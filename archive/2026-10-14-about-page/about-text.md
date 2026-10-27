# The About page's text, as it read on 2026-10-14

Archived before the rewrite ("rewrite it so it does not sound like ai"). The
screen file as it stood is beside this, `about.jsx` — it holds **two** versions:
the shipping one and `AboutBefore()`, the pre-2026-09-28 page kept as a dead
function. Both are transcribed here as prose so the wording can be read without
JSX in the way.

TO RESTORE either version: copy `about.jsx` from this folder back over
`app/about.jsx`. For the older one, also make `AboutBefore` the default export
and drop the newer `About`.

---

## Version B — shipping until 2026-10-14 (written 2026-09-28)

**About KawmHmong** · eyebrow: KawmHmoob 1.0

> KawmHmong comes from Kawm Hmoob, "learn Hmong". This app exists to help keep
> our language alive.
>
> Its official name is **KawmHmoob**, spelled the way Hmong spells itself in RPA.
> You will see **KawmHmong** throughout the app so it is obvious at a glance
> which language it teaches — the same app, the same name, written for two sets
> of eyes.
>
> This is **version 1.0**, the first release. The course, the recordings and the
> stories are added to as they are finished.

**Dedication**

> This app is dedicated to preserving our beautiful language — Hmoob Dawb, White
> Hmong.

**Why it matters**

> For most of its history, Hmong was passed down by speaking it: at home, at the
> table, in the stories our elders told. A language kept that way lives only as
> long as people keep speaking it.
>
> Many of us grew up hearing Hmong but never learned to speak it well, or to read
> and write it. Every generation that lets it slip takes words, sayings and
> stories with it. Learning it, even a little at a time, is how it stays.

**White Hmong, done properly**

> Every lesson, recording and translation in KawmHmong is **White Hmong (Hmoob
> Dawb)**, written in RPA, the Romanized Popular Alphabet. Focusing on one
> dialect means it can be taught carefully, with its grammar, its tones and its
> everyday speech, instead of a mix that gets each of them a little wrong.

**Why we are careful**

> A wrong translation or a pronunciation score that is confidently wrong does not
> just frustrate you. It teaches a person their own language incorrectly.
>
> - **Tones carry meaning.** One tone apart is a different word, so pronunciation
>   feedback has to be right or absent — never confident and wrong.
> - **Grammar comes from speakers.** The rules in these lessons are checked by a
>   Hmong speaker, and corrected when they are wrong.

**How you can help keep it**

> - **Speak it.** At home, with family, even a word at a time.
> - **Ask your elders.** The words, sayings and stories they know are the language.
> - **Tell us when something is wrong.** A correction here fixes it for every
>   learner after you.

**Who built this**

> KawmHmong is built and maintained by one person: **Devv**, 21, a college
> dropout, addicted to learning Hmong and set on preserving it.

**Questions or corrections**

> If something here is wrong — a translation, a recording, a rule — we want to
> hear it. [Contact] [Privacy]

---

## Version A — the original page (shipped until 2026-09-28)

Replaced because it led with the population table (China first, and every figure
uncited) and covered Chinese Hmong, which the author cut: *"something more for
preserving the language, no chinese hmong, focus hmong white"*.

**About Kawm Hmoob**

> A Hmong language-learning app, built for people who want their language back.

**Dedication** — the same sentence as version B.

**Hmong is not a small language**

> It is easy to think of Hmong as a heritage language that a few families still
> speak. It is not. Millions of people speak it, across five countries — and the
> largest community of all is the one this app serves least today.

Then the population table (⚠️ approximate and uncited — the page said so):

| where | count | note |
|---|---|---|
| China | ~4.5 million | Chuanqiandian cluster — "Chinese Hmong" |
| Vietnam | ~1.4 million | |
| Laos | ~600,000 | |
| Thailand | ~150,000–250,000 | |
| United States | ~300,000 | Largest communities in California, Minnesota, Wisconsin |

> Figures are approximate — national censuses and language surveys, rounded.

**What this app teaches**

> Every lesson, every recording and every translation in Kawm Hmoob is **White
> Hmong (Hmoob Dawb)**. That is a deliberate scope, not an oversight.
>
> You can still tell us which dialect you are learning — Green Hmong and
> Dananshan Hmong are both in the picker. Choosing one saves your preference for
> later; it does not change the content yet, and the app says so rather than
> quietly handing you the wrong dialect.
>
> Standard Chinese Hmong is built on the Dananshan dialect, uses a different
> romanisation, and does not line up with RPA sound for sound. Teaching it
> properly is a different app, not a translation layer.

**Why we are careful**

> A wrong translation, a mislabelled recording, or a pronunciation score that is
> confidently wrong does not just frustrate you — it teaches a person their own
> language incorrectly.
>
> - **Recordings are labelled by dialect.** Mixing varieties silently is how a
>   learner ends up practising against the wrong voice.
> - **Tones carry meaning.** One vowel apart is a different word, so pronunciation
>   feedback has to be right or absent — never confident and wrong.

**Who built this** — the same bio line as version B.

**Questions or corrections** — the same card as version B.

### Lines that were commented out of version A, and why

- *"Nothing ships unread. Hmong written correctly is not the same as Hmong
  written well, and a language app cannot ship prose no fluent speaker has
  read."* — removed 2026-09-21, when AI-written example sentences started
  shipping before a speaker had read them. It was no longer true.
- *"Every lesson, recording, translation and line of code here is one person's
  work. That is why some of it is still unfinished — and why none of it is padded
  out to look bigger than it is."* — removed the same day, for the same reason.

⚠️ Both are still false today. Any rewrite that claims every word here is
human-written is a claim the content cannot support.
