// Standalone lesson: the tense/aspect markers that place a Hmong verb in time.
// Written 2026-07-16 — this is the lesson the action-verbs intro promises
// ("you will meet these markers properly in a later lesson").
// Cheat sheet: the Tense Markers table in src/data/reference.js.
//
// ⚠️ REWRITTEN 2026-09-26 (author: "update time marker … tab tom … currently doing
// something present … research and fill the lesson with good better info").
//   • The old intro said "Two of them sit BEFORE the verb" — wrong: every marker but
//     lawm goes before the verb (tab tom, yuav, mam li, tau, tseem, twb, nyuam qhuav).
//   • tab tom is taught as happening RIGHT NOW (am/is/are -ing), as the author asked.
//   • Added the markers the app already had cards for but the lesson never taught:
//     mam li, tab tom yuav, twb … lawm, nyuam qhuav — and that a plain sentence with a
//     time word (nag hmos, tag kis) needs no marker at all.
//   • heev ("very") was a card in this UNIT (path u-tense) — an intensifier, not a
//     time marker. Removed from the unit.
// Sources checked: Study Hmong's Glossary of Grammar (tab tom = in progress, before
// the verb, used to EMPHASISE it is ongoing; lawm = already, end of the thought; tau
// = got/achieved, V + tau = can) and its White Hmong Grammar Cheat Sheet (perfect
// lawm, progressive tabtom, future yuav "going to" / mam li "will"). Examples are the
// app's own cards (tense-markers, time-context, grammar) and the tau lesson's.

export const tenseMarkers = {
  id: 'foundations-tense-markers',
  title: 'Tense Markers',
  summary: 'How Hmong says when something happens — without changing the verb.',
  vocab: 'tense-markers',
  reference: 'grammar',
  steps: [
    {
      id: 'foundations-tense-markers-intro',
      kind: 'intro',
      title: 'Time without conjugation',
      body: [
        'English changes the verb itself to move through time: eat, ate, eating, will eat. Hmong never does this. "Noj" is always "noj" — what changes is the small marker word placed around it.',
        'That means there is nothing to memorize verb-by-verb. Learn a handful of little words once, and every verb you know is available in the past, the present and the future.',
        '## Often, no marker at all',
        'A plain sentence already works. A time word like naghmo (yesterday), hnub no (today) or tagkis (tomorrow), or simply the context, tells you when. Markers are added when you want to be exact about it.',
        // Was: 'Naghmo kuv mus.' — "went" takes tau (author, 2026-09-28). The author's own no-marker past sentence stands in here.
        '> Naghmo, kuv noj mov ntawm tsev. — Yesterday, I ate at home.',
        '> Tagkis kuv mus. — Tomorrow I will go.',
        // ── TENSE BY TENSE — the author, 2026-09-28: "time context, back to the future 88 miles
        // per hour. Past tense forms in Hmong are set through context … words in the context
        // are used to set the context." Past and present are the author's (examples theirs;
        // the concert sentence and the past-continuous ending are Claude's — both confirmed by the author
// 2026-09-28: "mus saib kev hu nkauj" is acceptable pure Hmong, though many just say concert). The
        // FUTURE block is built from this lesson's own markers (yuav, mam li, tab tom yuav) —
        // the author has not sent a future section yet. Spelled "tab tom" (the app's form);
        // the author wrote "tabtom" — asked.
        '## Tense by tense: setting the time',
        'In Back to the Future, Doc Brown’s DeLorean had to hit 88 miles per hour to travel through time. Hmong gets there with one word. Like everything else in Hmong grammar, tense is set by the context: a time word, or a small marker, tells you when, and the verb itself never changes.',
        '## Past',
        'A time word sets the scene, and a single plain verb does the rest:',
        '> Naghmo, kuv noj mov ntawm tsev. — Yesterday, I ate at home.',
        'Tau before the verb marks the action as completed. It is often not even needed; when it is used, it usually sets up more of the story, the way a narrator does:',
        '> Kuv tau noj ntawm tsev. — I ate at home. (it is done)',
        '> Naghmo, kuv tau mus saib kev hu nkauj. — Yesterday, I went to a concert.',
        'Past continuous: tab tom literally means currently. Put it in the past with a time word and thaum (when), and it means you were in the middle of doing it:',
        '> Naghmo thaum kuv tab tom noj mov, kuv niam hu xov tooj tuaj. — Yesterday, while I was eating, my mom called.',
        '## Present',
        'A plain verb sentence is the present:',
        '> Kuv noj mov. — I eat.',
        'Present perfect: twb … lawm (already). It is for something that has already happened, but is not told as the past: it says whether you have done it or not.',
        '> Kuv twb noj mov lawm. — I already ate. / I have already eaten.',
        'Present continuous: tab tom, currently.',
        '> Kuv tab tom noj mov. — I am eating. / I am currently eating.',
        // FUTURE — the author's, 2026-09-28 (replaces Claude's placeholder built from the markers;
        // "Kuv mam li mov" in the message read as Kuv mam li noj mov). Was:
        // 'A time word again, or yuav (going to, will) before the verb:',
        // '> Tagkis kuv mus. — Tomorrow I will go.', '> Kuv yuav noj mov. — I am going to eat.',
        // '> Kuv mam li noj. — I will eat (later).', '> Kuv tab tom yuav noj. — I am about to eat.',
        '## Future',
        'A time word sets it, just like the past. Tagkis (tomorrow), and a plain verb:',
        '> Tagkis, kuv noj mov. — Tomorrow I eat. / I will eat tomorrow.',
        'Yuav means something is going to happen, or will. It is the softer future, and the one used most often:',
        '> Kuv yuav noj mov. — I will eat. / I am going to eat. (the most common meaning)',
        'Mam li is firmer: something that WILL happen. It is planned, or you are determined to do it, and it is actually going to happen. Yuav is softer.',
        '> Kuv mam li noj mov. — I will eat.',
        'Future progressive: tab tom yuav, for a verb that is just about to happen.',
        '> Kuv tab tom yuav noj mov. — I am about to eat.',
        'Same verb, noj, in every one of them. Great Scott.',
        '## Where they go',
        'Almost every marker sits right BEFORE the verb. The one big exception is lawm, which goes at the END of the sentence. Position is part of the meaning.',
        '> Kuv yuav noj. — I will eat. (before the verb)',
        '> Kuv noj mov lawm. — I have eaten already. (at the end)',
        '## Happening right now: tab tom',
        'Tab tom means the action is going on right now: you are in the middle of doing it. It is the Hmong “am / is / are …-ing”.',
        '> Kuv tab tom noj mov. — I am eating (right now).',
        '> Kuv tab tom noj hmo. — I am eating dinner.',
        'Without tab tom, “Kuv noj mov” can already mean I eat or I am eating. Add tab tom to make it clear that it is happening at this moment.',
        '## Later: yuav and mam li',
        'Yuav is the everyday future, “going to” or “will”. Mam li is “will”, often with the sense of later or then, once something else has happened.',
        '> Kuv yuav mus. — I am going to go.',
        '> Kuv mam li mus. — I will go (later).',
        'Put the two together and you get about to: tab tom yuav, right on the edge of doing it.',
        '> Kuv tab tom yuav mus. — I am about to go.',
        '## Done: tau and lawm',
        'Tau before the verb marks the action as attained: it happened. Lawm at the end says it is done and that is now the situation. They often appear together. (Tau has its own unit: Did, Got & Can.)',
        '> Kuv tau noj mov. — I have eaten.',
        '> Kuv noj mov lawm. — I have eaten already.',
        '## Already, and just now: twb … lawm, nyuam qhuav',
        'Twb before the verb with lawm at the end stresses already. Nyuam qhuav before the verb means just, recently.',
        '> Kuv twb mus lawm. — I have already gone.',
        '> Kuv nyuam qhuav tuaj. — I just came.',
        '## Still: tseem',
        'Tseem means the action has not stopped yet.',
        '> Kuv tseem noj. — I am still eating.',
        '## An easy way to remember',
        '> tab tom + verb → happening right now (am / is / are …-ing)',
        '> yuav + verb → going to, will',
        '> mam li + verb → will (later, then)',
        '> tab tom yuav + verb → about to',
        '> tau + verb → attained: did, have done',
        '> verb … lawm → done, and it shows now',
        '> twb + verb … lawm → already',
        '> nyuam qhuav + verb → just, recently',
        '> tseem + verb → still',
        // Was (2026-07-16 — "Two of them sit BEFORE the verb" was wrong):
        //   'That means there is nothing to memorize verb-by-verb. Learn five little words once, and every verb you know is instantly available in past, present, and future.',
        //   'Two of them sit BEFORE the verb, and one sits at the very END of the sentence — position is part of the meaning:',
        //   '> Kuv yuav noj. — I will eat. (marker before the verb)',
        //   '> Kuv noj lawm. — I already ate. (marker after the verb)',
      ],
    },
    {
      // Added 2026-09-28 — the author's tense-by-tense frame. New id: no progress key reused.
      id: 'foundations-tense-markers-by-tense',
      kind: 'examples',
      title: 'Past, present, future',
      intro: 'The same verb, noj, all the way through. Read each one aloud.',
      items: [
        { hmong: 'Naghmo, kuv noj mov ntawm tsev.', english: 'Yesterday, I ate at home.', note: 'past — the time word sets it' },
        { hmong: 'Kuv tau noj ntawm tsev.', english: 'I ate at home.', note: 'past — tau: completed' },
        { hmong: 'Naghmo thaum kuv tab tom noj mov …', english: 'Yesterday, while I was eating …', note: 'past continuous — thaum + tab tom' },
        { hmong: 'Kuv noj mov.', english: 'I eat.', note: 'present' },
        { hmong: 'Kuv twb noj mov lawm.', english: 'I already ate.', note: 'present perfect — twb … lawm' },
        { hmong: 'Kuv tab tom noj mov.', english: 'I am eating.', note: 'present continuous — tab tom' },
        { hmong: 'Tagkis, kuv noj mov.', english: 'Tomorrow I eat.', note: 'future — the time word sets it' },
        { hmong: 'Kuv yuav noj mov.', english: 'I am going to eat.', note: 'future — yuav: softer, most common' },
        { hmong: 'Kuv mam li noj mov.', english: 'I will eat.', note: 'future — mam li: planned, for sure' },
        { hmong: 'Kuv tab tom yuav noj mov.', english: 'I am about to eat.', note: 'future progressive — tab tom yuav' },
      ],
    },
    {
      id: 'foundations-tense-markers-examples',
      kind: 'examples',
      // Was: title 'The five markers'. The five recorded markers first (with audio),
      // then the four the lesson now also teaches (2026-09-26).
      title: 'The markers, one by one',
      intro: 'Read each one aloud with the verb "noj" (to eat).',
      items: [
        {
          hmong: 'tab tom', audio: 'grammar/tense-markers/hmong-tense-markers-tabtom.mp3',
          // Was: english: 'Currently (-ing)'
          english: 'Right now (am / is / are …-ing)',
          note: 'Goes before the verb. The action is happening at this moment: "Kuv tab tom noj" — I am eating right now.',
        },
        {
          hmong: 'yuav', audio: 'grammar/tense-markers/hmong-tense-markers-yuav.mp3',
          english: 'Will (future)',
          note: 'Goes before the verb: "Kuv yuav noj" — I will eat.',
        },
        {
          hmong: 'tau', audio: 'grammar/tense-markers/hmong-tense-markers-tau.mp3',
          // Was: english: 'Already (past completed)' — "already" is twb/lawm (2026-09-26).
          english: 'Did, have done (attained, completed)',
          note: 'Goes before the verb: "Kuv tau noj" — I have eaten / I did eat. After the verb it usually means can: "Kuv noj tau" — I can eat.',
        },
        {
          hmong: 'tseem', audio: 'grammar/tense-markers/hmong-tense-markers-tseem.mp3',
          english: 'Still',
          note: 'Goes before the verb: "Kuv tseem noj" — I am still eating.',
        },
        {
          hmong: 'lawm', audio: 'grammar/tense-markers/hmong-tense-markers-lawm.mp3',
          english: 'Completed (sentence-final)',
          note: 'Goes at the END: "Kuv noj lawm" — I ate / I have eaten already.',
        },
        // Added 2026-09-26 — markers the app had cards for but the lesson never taught.
        {
          hmong: 'mam li',
          english: 'Will (later, then)',
          note: 'Goes before the verb: "Kuv mam li mus" — I will go (later).',
        },
        {
          hmong: 'tab tom yuav',
          english: 'About to',
          note: 'Goes before the verb: "Kuv tab tom yuav mus" — I am about to go.',
        },
        {
          hmong: 'twb … lawm',
          english: 'Already',
          note: 'Twb before the verb, lawm at the end: "Kuv twb mus lawm" — I have already gone.',
        },
        {
          hmong: 'nyuam qhuav',
          english: 'Just, recently',
          note: 'Goes before the verb: "Kuv nyuam qhuav tuaj" — I just came.',
        },
      ],
    },
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-tense-markers-practice',
      kind: 'practice',
      title: 'Quick check',
      prompt: 'Which marker would you use to say "I WILL eat"?',
      options: ['Yuav', 'Tau', 'Tseem', 'Lawm'],
      answer: 'Yuav',
    },*/
    // quick-check removed — the lesson now hands off to the word bank (notes/37)
    /*{
      id: 'foundations-tense-markers-practice-2',
      kind: 'practice',
      title: 'One more',
      prompt: 'Where does "lawm" go in the sentence?',
      options: [
        'At the very end of the sentence',
        'Directly before the verb',
        'At the start of the sentence',
        'It replaces the verb',
      ],
      answer: 'At the very end of the sentence',
    },*/
    {
      id: 'foundations-tense-markers-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
