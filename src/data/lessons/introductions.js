// Introductions — simple starter lesson (content migrated from the old /course
// everyday tab). Intentionally minimal; refine later.
export const introductions = {
  id: 'conversational-introductions',
  title: 'Introductions',
  summary: "Ask someone's name, say yours, and the basics.",
  steps: [
    {
      id: 'conversational-introductions-intro',
      kind: 'intro',
      title: 'Meeting someone',
      body: [
        'These phrases let you introduce yourself and ask a few basics when you meet someone new.',
      ],
    },
    {
      id: 'conversational-introductions-examples',
      kind: 'examples',
      title: 'Introduction phrases',
      intro: 'Read each one aloud.',
      items: [
        { hmong: 'Koj lub npe hu li cas?', english: 'What is your name?' },
        { hmong: 'Kuv lub npe hu ua…', english: 'My name is…' },
        { hmong: 'Koj nyob qhov twg?', english: 'Where do you live?' },
        { hmong: 'Koj muaj pes tsawg xyoo?', english: 'How old are you?' },
      ],
    },
  ],
}
