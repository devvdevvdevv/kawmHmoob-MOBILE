// SPEAK LAB — experimental lesson script format. NOT wired into the real Speak
// module; nothing here is imported by app/(tabs)/speak.jsx or src/data/speak.js.
// Safe to break.
//
// THE IDEA: a lesson is a SCRIPT — an ordered list of TYPED steps. The screen is
// a switch on step.type. Adding an interaction later = one new type + one new
// branch; the stepper never changes.
//
// Step types (extend freely — this is the sandbox):
//   { type: 'hear',  hmong, english, audio }        listen to the whole phrase
//   { type: 'word',  hmong, english, audio }        meet ONE word
//   { type: 'say',   hmong, english, audio }        record yourself
//   { type: 'build', parts: [...], hmong, english } assemble words into a phrase
//   { type: 'dialogue', turns: [{ speaker, hmong, english }] }
//
// `audio` uses the SAME convention as speak.js: '' when no recording exists.

export const LAB_LESSON = {
  id: 'lab-greetings',
  title: 'Greetings (lab)',
  description: 'Test script for the Natulang-style flow.',
  steps: [
    // 1. Hear the target phrase whole, before it means anything.
    { type: 'hear', hmong: 'Nyob zoo, kuv lub npe hu ua Ntxawg.', english: 'Hello, my name is Ntxawg.', audio: '' },

    // 2-3. Meet a word, then say it.
    { type: 'word', hmong: 'nyob zoo', english: 'hello', audio: '' },
    { type: 'say',  hmong: 'nyob zoo', english: 'hello', audio: '' },

    // 4-5. Another word, same pattern.
    { type: 'word', hmong: 'kuv', english: 'I / my', audio: '' },
    { type: 'say',  hmong: 'kuv', english: 'I / my', audio: '' },

    { type: 'word', hmong: 'npe', english: 'name', audio: '' },
    { type: 'say',  hmong: 'npe', english: 'name', audio: '' },

    // 6. Combine what was just learned.
    { type: 'build', parts: ['kuv', 'lub', 'npe'], hmong: 'kuv lub npe', english: 'my name', audio: '' },

    // 7. Full sentence.
    { type: 'say', hmong: 'Kuv lub npe hu ua Ntxawg.', english: 'My name is Ntxawg.', audio: '' },

    // 8. Dialogue reusing everything — mini-test + practice conversation.
    {
      type: 'dialogue',
      turns: [
        { speaker: 'A', hmong: 'Nyob zoo! Koj lub npe hu li cas?', english: 'Hello! What is your name?' },
        { speaker: 'B', hmong: 'Kuv lub npe hu ua Ntxawg.',        english: 'My name is Ntxawg.' },
      ],
    },
  ],
}

// ⚠️ Hmong above is PLACEHOLDER for wiring the flow — verify before it becomes
// real lesson content.
