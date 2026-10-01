# Subheaders: heavier, and shorter

**2026-08-29** · 36 files across `app/` and `src/`

> "make them more concise, and increase the font weight slightly … every
> subheader in general"

Two jobs that look like one. **Weight is mechanical; conciseness is judgement.**
Running them as a single find/replace is how you end up rewriting a privacy
policy by accident.

---

## Pass 1 — weight (mechanical, app-wide)

**85 subheaders across 36 files** gained `font-medium`. Supporting copy at
`text-sm` / `text-base` reads thin at phone brightness; 500 is one step up from
the default 400.

**Not `font-semibold`** — that competes with the heading directly above it, and
a subheader that fights its own header is worse than a thin one.

⚠️ The script rewrote **whole `className` strings**, not the matched fragment:

```js
s.replace(/className="([^"]*)"/g, (whole, cls) => {
  if (/\bfont-(medium|semibold|bold|light|serif)\b/.test(cls)) return whole
  …
})
```

A regex on `text-sm text-stone-600` alone cannot see a `font-semibold` sitting
three tokens later. Matching the full attribute is what makes "skip anything
already styled" possible at all. Verified afterwards: zero double-weighted
classes.

Targets were the five supporting-copy combinations actually in use —
`text-sm|base` × `stone-600|700`, plus `text-sm text-cream-200` for the dark
cards.

---

## Pass 2 — conciseness (18 rewrites, hand-picked)

A regex found ~22 long strings; most were **template literals**, not prose —
level counters, streak text, question numbers. Shortening those would mean
changing what they report, so they were left alone.

Representative cuts:

| before | after |
|---|---|
| Listen, record your own voice, and compare. Hmong tones carry the meaning — this is where you train your ear and your mouth together. | Record yourself, compare to a native speaker. In Hmong, tone carries the meaning. |
| Tone carries meaning in Hmong. Start here — it is always free. | Tone carries meaning. Start here — always free. |
| Drill one sound at a time — words that share the same ending. | Words that share an ending, one sound at a time. |
| Hmong verbs never change form — a small word before (or after) does the work. | Verbs never change form. A small word does the work. |
| Structured units. Each lesson walks you through an intro, examples, a quick check, and a mini-quiz. | Structured units: intro, examples, a quick check, a mini-quiz. |
| An advanced reading test: read a passage, then answer comprehension questions and get scored — building toward real fluency. | Read a passage, answer comprehension questions, get scored. |

Also: the five Speak `SectionHeading` blurbs, five group descriptions in
`speak.js`, Reference, Onboarding, GuestBanner, VocabCategoryGrid.

### ⚠️ JSX wraps prose, so exact-match replace does not work

The source almost never contains a sentence as one string:

```jsx
<Text className="…">
  Listen, record your own voice, and compare. Hmong tones carry the meaning — this is
  where you train your ear and your mouth together.
</Text>
```

So replacement matched on the **normalized** form — collapse whitespace, compare,
then rewrite the element body while preserving its indentation:

```js
const norm = (t) => t.replace(/\s+/g, ' ').trim()
if (norm(body) !== norm(from)) return whole
```

Every rewrite asserted **exactly one** match and refused on zero or many. This
is the fix for the class of silent no-op edits that bit three times earlier today
— see [[2026-08-29-undefined-icon-prop-and-ref-checker]].

---

## Deliberately not touched

| | why |
|---|---|
| `app/privacy.jsx` | legal copy. Trimming a privacy policy is not a style decision. |
| ProfilePage delete warning | *"Permanently delete your account and all progress. This can't be undone."* Already tight, and brevity in a destructive-action warning costs force, not adds it. |
| `{template}` lines | data, not prose — several matched the size filter, but shortening them changes what they report. |

> **A length filter finds candidates, not targets.** Every one still needs a
> human question: is this long because it is padded, or because it is doing
> something?

---

## Verification

- Babel parse — all 8 files with copy changes
- `check-undefined-refs.mjs` — 190 files, clean
- `check-lesson-audio.mjs`, `pronunciation-selftest.mjs` — unaffected, still pass
- No double-weighted classes

⚠️ **`font-medium` is a real visual change on ~85 elements across every tab, and
only compilation is confirmed.** If it reads heavy in the denser lists — the
vocab grid especially — narrowing the targets to section subheaders only is a
small edit.
