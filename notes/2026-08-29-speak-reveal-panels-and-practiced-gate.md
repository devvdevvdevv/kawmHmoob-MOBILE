# Speak: reveal panels reworked, and "Mark practiced" now needs a recording (2026-08-29)

Two small UI changes that were made and never written down. Both are in the Speak
module; the first touches Conversations, the second the speaking modules.

---

## 1. The reveal panels — subtext gone, label bigger

`src/components/speak/LessonSteps.jsx`

Both reveal panels used to be a bold-ish label with a 10px line of guidance under
it:

```
Reveal the answer
check how you did              ← removed
```

The subtext is commented out and the label went `text-sm font-semibold` →
`font-serif text-lg`.

### Two things worth knowing

**`font-serif`, not `font-semibold`.** This is the recurring Android trap in this
codebase: `font-semibold` on an unmapped Nunito Sans weight renders as REGULAR on
Android, because expo-google-fonts registers each weight as its own family and
`tailwind.config.js` maps only `NunitoSans_400Regular` to `font-sans`. `font-serif`
IS `Nunito_700Bold`, so it is the only way to get a real bold here. Same fix as the
notebook pass — see [2026-08-28-notebook-cap-study-and-notes-hidden].

**Padding went UP (`py-2.5` → `py-3`) while the panel got smaller.** That looks
backwards. Removing the subtext took ~14px out of the panel, which would have
dropped the tap target close to the 44pt floor — and the comment above this panel
says explicitly that a learner reaching for it is "usually mid-struggle and should
not have to aim at 10px of text." The extra padding buys the height back: 28
(line-height) + 24 (padding) = 52pt.

### Both panels, not one

The request named "Reveal the answer". There is a second, identical panel — "Reveal
the meaning" (with subtext "answer in your head first") — on an adjacent card in the
same lesson flow. It got the same treatment, because one large bare panel next to
one small panel with subtext reads as a mistake rather than as a design. Both old
subtexts are commented in place.

---

## 2. "Mark practiced" only appears after a finished recording

`src/components/speak/PronounceStep.jsx`

The button that completes a phrase used to always be there, so a phrase could be
marked practiced without ever saying it. Now:

```jsx
{done || (uri && status !== 'recording') ? <Button …/> : <hint/>}
```

### Why each half of that condition

**`status !== 'recording'` is the "finished" half.** Gating on `uri` alone would
show the button *while you are still talking* — that `uri` is the PREVIOUS take,
not the one in progress.

**`done ||` is an escape hatch.** Without it, returning to a phrase you already
practiced would hide its Continue button and demand a fresh recording just to move
past it. A completed phrase keeps its button.

| state | shows |
|---|---|
| fresh phrase, nothing recorded | hint |
| mid first recording | hint |
| re-recording over an old take | hint |
| finished a take | button |
| revisiting an already-practiced phrase | button |
| mic blocked | hint |

### The replacement text is not decoration

When the button is hidden, a muted line takes its place: *"Record yourself to finish
this phrase."* Without it the screen simply ends, and a missing button reads as a bug
rather than as something you have not done yet.

### ⚠️ Open decision: mic-denied is a hard stop

A learner who denies or cannot grant mic permission can no longer mark anything
practiced in the speaking modules. That is the gate working as asked — and the card
above already tells them to enable access in Settings — but it IS a dead end for
that user. Adding `|| status === 'denied'` to the condition would let them through.
Left strict deliberately; flagging it because it is a product call, not a code one.

---

Related: [2026-08-29-speak-tone-breakdown-and-scoring],
[2026-08-06-speak-module-ui-restructure].
