# Why this app exists (2026-09-12)

Not an engineering note. This is the thing the code is for, written down so it
survives the next refactor.

> **KawmHmoob is dedicated to preserving our beautiful language — Hmoob Dawb,
> White Hmong.**

## Hmong is not a small language

It is easy, building an app in English for a diaspora audience, to think of Hmong
as a heritage language a few families still speak. It is not. It is a language
with **millions** of speakers, and the largest community by far is the one this
app currently serves least.

| where | roughly how many |
|---|---|
| China | **~4.5 million** speakers of the Chuanqiandian (Chinese Hmong) cluster |
| Vietnam | ~1.4 million |
| Laos | ~600,000 |
| Thailand | ~150,000–250,000 |
| United States | ~300,000 |

⚠️ **These are approximate and none were verified against a source while writing
this.** They come from census figures and language surveys as of ~2020 and are
the kind of number that gets repeated wrongly for years. If any of them ends up
in front of a user — a marketing page, an onboarding screen, a store listing —
check it against a citation first.

⚠️ **One figure needs correcting before it is repeated.** This note was prompted
by a figure of *28,000* Hmong Americans. That is off by roughly an order of
magnitude: the 2020 US Census counted around **327,000** people identifying as
Hmong alone or in combination, concentrated in California (~91k), Minnesota
(~85k) and Wisconsin (~58k). 28,000 is closer to the size of a single city's
Hmong community than the national population. Worth pinning down properly — it is
exactly the sort of number a language app gets asked about.

## What that means for the app, concretely

**The app is White Hmong. Every lesson, every recording, every gloss.** That is a
deliberate scope, not an oversight, and the dialect picker says so plainly rather
than pretending otherwise.

But the arithmetic above is why `dananshan` is in that picker (added the same day
— see `2026-09-12-dananshan-dialect-and-the-copied-list.md`). **The largest group
of Hmong speakers in the world writes and speaks a variety this app does not
teach.** Standard Chinese Hmong is based on the Dananshan dialect, uses a
different romanisation, and does not map onto RPA sound-for-sound. Offering the
option is honest about who exists; the "not yet available" label is honest about
what is ready.

Three things follow from that, and they are already load-bearing elsewhere in
this repo:

1. **`dialectPreference` is corpus metadata, not just a setting.** A recording
   has to carry its speaker's dialect. Mixing them silently is the failure mode —
   a learner drilling tones against a clip from a different variety is being
   taught something wrong with full confidence.
2. **Placeholder Hmong cannot ship.** Nine of ten stories and all eighteen new
   lesson skeletons are unreviewed. For a language with this many living
   speakers, shipping prose nobody fluent has read is not a rough edge — it is
   the one thing the app exists not to do.
3. **The tone scorer has to actually work.** Telling a learner their tone is
   right when it is wrong teaches an error in the thing that carries meaning.

## The line to hold

Everything in `notes/` is about making the software correct. This note is the
reason correctness matters here more than it would in another app: **a wrong
gloss, a mislabelled clip, or a confidently scored bad tone does not just
frustrate a user — it teaches a person their own language incorrectly.**

That is the standard. The txuas/txaus mis-take, caught by one vowel, is what
meeting it looks like in practice.
