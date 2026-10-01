# Snapshot: before the tone-spelling rework (2026-09-22)

The typing drill ("Spell it out") as it was before it moved from three taps per
syllable (consonant → vowel → tone) to two (letters → tone).

TO RESTORE: copy these two files back over the live ones.

    app/words/typing.jsx
    src/lib/typingDrill.js

Nothing else changed shape: `typingExercisesFor` / `allTypingExercises` /
`buildTypingSession` keep their signatures, so pathProgress.js is unaffected.
