// Daily Life — simple starter lesson (content migrated from the old /course
// everyday tab). Intentionally minimal; refine later.
export const dailyLife = {
  id: 'conversational-daily-life',
  title: 'Daily Life',
  summary: 'Everyday things you say — hungry, thirsty, tired.',
  steps: [
    {
      id: 'conversational-daily-life-intro',
      kind: 'intro',
      title: 'Everyday phrases',
      body: [
        '"Koj noj mov tau?" (Have you eaten?) is a common Hmong greeting — asking whether someone has eaten is a way of showing you care.',
      ],
    },
    {
      id: 'conversational-daily-life-examples',
      kind: 'examples',
      title: 'Daily phrases',
      intro: 'Read each one aloud.',
      items: [
        { hmong: 'Koj noj mov tau?', english: 'Have you eaten?' },
        { hmong: 'Kuv tshaib plab', english: "I'm hungry" },
        { hmong: 'Kuv nqhis dej', english: "I'm thirsty" },
        { hmong: 'Kuv tsaug zog', english: "I'm tired / sleepy" },
      ],
    },
  ],
}
