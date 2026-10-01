// Standalone lesson: TAU — did, got, can, and for a timeframe. Written 2026-09-26.
//
// ⚠️ THE RULES AND EXAMPLES COME FROM THE AUTHOR'S THREE PASTES, same day, not
// Claude's own grammar:
//   • tau + verb  → attained/reached: the action or situation was achieved or came about  "Kuv tau mus" = I went
//     (was: "attained (did / have done in a past context)" — 2026-09-29, tau is aspect, not tense)
//   • verb + tau  → can, be able to (was able to / managed to by context)  "Kuv mus tau" = I can go
//   ⚠️ FACT-CHECKED 2026-09-26 (the author ran this past GPT): preverbal tau is an
//   ATTAINMENT marker, not simply past tense; V + tau is mainly modal ("can"), with a
//   separate accomplishment reading (Nws kawm tau). "Kuv mus tau is NOT I went" was
//   softened: it is not the normal way to say it, and context still decides.
//   • tau + noun  → got / received          "Kuv tau nyiaj" = I got money
//   • tau + time + lawm → for (that long)  "…tau peb hnub lawm" = for three days
//   • got to / had the chance to            "Kuv tau ntsib nws nag hmos"
//   • tau + verb + lawm → done already      "Kuv tau mus tsev lawm" (gs-038)
//   • tsis tau + verb → not yet / didn't; verb + tsis tau (+ object) → can't. Briefly
//     taught as tsis + verb + tau on 2026-09-26; the author's GPT review confirmed
//     verb + tsis tau as the standard "can't", and tsis V tau as a different reading.
// The third paste CORRECTED the first ("Kuv tau mus = I can go" was wrong), so
// word order is the spine of this lesson. "Must / need to" (Koj tau mus) is held
// out, as in the dictionary — see notes/2026-09-26-tau-senses.md.
// Spelling: "nag hmos" (the app's standard, with its recording), where the paste
// wrote "nag hmo".
//
// Word bank: the `tau-uses` set (vocab below), which also backs path unit u-tau —
// this lesson is that unit's introduction. The puas tau / tsis tau examples are
// the HIGH-confidence grammar sentences gs-013 and gs-004.
export const tauLesson = {
  id: 'grammar-tau',
  title: 'Tau | Did, Got & Can',
  // Was: 'One of the most common words in Hmong — and where it sits changes what it means.'
  summary: 'One of the most common words in Hmong, and extremely context-based: where it sits and what surrounds it decide what it means.',
  vocab: 'tau-uses',
  reference: 'grammar',
  steps: [
    {
      id: 'grammar-tau-intro',
      kind: 'intro',
      title: 'One word, several jobs',
      body: [
        'Tau is one of the most common words in Hmong, and it has no single English translation. Its meaning depends on where it sits and what comes after it.',
        // The author, 2026-09-26: "iterate that tau is extremely context based".
        // Same "## Important:" callout as the classifiers lesson.
        '## Important: tau is extremely context-based',
        'Never translate tau on its own. The same word can mean did, got, can, or for a timeframe, and only its context tells you which: where it sits (before or after the verb), what comes right after it (a verb, a noun, a timeframe), and the words around it (puas, tsis, lawm). Read the whole sentence first, then decide what tau is doing.',
        'The cards in this unit keep the same verb and noun, noj (eat) and mov (food), so you can see that moving tau alone changes the meaning.',
        // Was: '## Before the verb: attained — did, have done', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        '## Before the verb: attained, reached',
        // Was: 'Tau in front of a verb marks the action as attained: it happened, or was achieved. It is not simply a past tense; when the context is past, English translates it as did or have done.', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        'Tau in front of a verb marks the action as attained or reached: the action or situation was achieved, or came about. Tau is an ASPECT marker, not a tense marker. English often translates tau + verb in the past (did, have done), but the past comes from English and from the context, not from tau.',
        '> Kuv tau mus. — I went.',
        '> Kuv tau noj mov. — I have eaten.',
        // Moved here from after the timeframe section — 2026-09-29 (author: "move this up … near the verbs").
        '## Got to: the chance to do something',
        '> Kuv tau ntsib nws naghmo. — I got to meet him yesterday.',
        // noj example with its context — 2026-09-29 (author). Same sentence as the 'Every tau, with noj' card.
        '> Naghmo kuv tau noj mov nrog kuv pog. — Yesterday I got to eat with my grandmother. (the chance came, eating with her, and I took it)',
        '## After the verb: can, be able to',
        // Was (before 2026-09-29's review): the RESULT reading presented alongside can. (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        'Put the same two words the other way round and the meaning changes: tau after the verb means can, be able to. The action is possible, achievable, or within someone’s ability. In a past context it reads was able to, and in some contexts the same words are understood as the action having been successfully accomplished: “Kuv ua tau”, I managed to do it, I was able to do it.',
        '> Kuv mus tau. — I can go.',
        '> Kuv noj tau. — I can eat.',
        'So “Kuv mus tau” is not the normal way to say “I went” (that is “Kuv tau mus”). Its usual meaning is “I can go”, but context still decides.',
        // The author, 2026-09-26: "tau is very complicated in its ability to
        // distinguish ability in verbs." Same "## Important:" callout style.
        '## Important: ability is where tau gets tricky',
        'Telling ability apart from everything else tau does is the hardest part of the word. The same verb + tau can mean three things, and nothing in the words themselves says which:',
        '> Kuv noj tau. — I can eat. (ability, now)',
        // Was: '> Kuv noj tau. — I was able to eat. (ability, in a past context)', (context added 2026-09-29, author: bare verb + tau reads as can)
        // Short noj versions first — 2026-09-29 (author: "good sentences, keep them, but need simpler concise
        // sentences that use noj so it stays consistent"). One word carries the context in each.
        '> Naghmo kuv noj tau. — Yesterday I was able to eat. (naghmo makes it past)',
        '> Naghmo kuv mob, tiam sis kuv noj tau me ntsis. — Yesterday I was sick, but I was able to eat a little. (ability, in a past context: naghmo sets it)',
        // Was: '> Nws kawm tau. — He learned it successfully. (accomplishment: he managed it)' — the author,
        // 2026-09-29: use Kuv noj tau (successful completion), set against Kuv tau noj (I ate).
        // Was: '> Kuv noj tau. — I ate it successfully. (result: the action was completed)'
        // (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        // Was: '> Kuv ua tau. — I managed to do it. (in context: the action was accomplished)', (context added 2026-09-29, author: bare verb + tau reads as can)
        '> Kuv noj tau tag. — I managed to eat all of it. (tag, all of it, makes it success)',
        '> Naghmo, txawm nws nyuaj heev los kuv ua tau. — Yesterday, even though it was very hard, I managed to do it. (success: the past effort is what makes it “managed to”)',
        // Emphasis — 2026-09-29 (author: "add emphasis that its context based extremely - and really isn't used often").
        'That last reading is extremely context-based and not used often. When in doubt, verb + tau means can.',
        // (Kuv tau noj moved to its own callout below, 2026-09-29.)
        // Reorganised 2026-09-29 (author: "organize this better so its easier to read"). Was two paragraphs:
        //   'Work it out in this order. First the position: tau AFTER the verb is about being able; tau BEFORE the verb is about the action being attained (Kuv tau noj, I have eaten). Then the time: is the sentence about now, or about something that already happened? Then the situation: was it a one-off effort that succeeded, or a general ability?',
        //   'The negative keeps the same shape: verb + tsis tau means can’t, unable (Kuv noj tsis tau, I can’t eat, I am unable to eat). Tsis tau BEFORE the verb is a different thing: not yet.',
        '## Work it out: three questions',
        '1. Where is tau? AFTER the verb, it is about being able. BEFORE the verb, the action was attained.',
        '> Kuv noj tau. — I can eat.',
        '> Kuv tau noj. — I have eaten.',
        '2. When is it? Is the sentence about now, or about something that already happened?',
        '3. What is the situation? A general ability, or (rarely) a one-off effort that succeeded?',
        '## The negative keeps the same shape',
        'Where tsis tau sits decides the meaning, just like tau.',
        '> Kuv noj tsis tau. — I can’t eat. (verb + tsis tau: unable)',
        '> Kuv tsis tau noj. — I haven’t eaten yet. (tsis tau + verb: not yet)',
        // ── EMPHASIS — 2026-09-29 (author: "gotta differentiate these two contexts … place an
        // emphasis"). Its own Important callout, the pair side by side.
        // Was: '## Important: Kuv tau noj vs Kuv noj tau' (author, 2026-09-29)
        '## Important: Kuv tau noj (past completion) vs Kuv noj tau (present completion)',
        // Rewritten 2026-09-29 (author: "easier to digest … describe the context better"). Was:
        //   'Both can be about eating that already happened, so this is the pair to get right. The words are the same; what changes is what the sentence is telling you.',
        //   '> Kuv tau noj. — I ate. (tau BEFORE the verb: a past action, it happened)',
        //   '> Kuv noj tau. — I ate it successfully. (tau AFTER the verb: the result, the action was completed)',
        //   'Tau noj tells you THAT it happened. Noj tau tells you it WORKED: the eating was carried out and finished successfully. Depending on the context, noj tau can also mean the ability: I can eat.',
        // The situations (sick, spicy, no time) are Claude's illustrations — TODO-VERIFY with the author.
        // Rewritten again 2026-09-29 in the AUTHOR'S OWN FRAMING (success / ability vs action /
        // opportunity / past experience). The previous version (Claude's, with sick / spicy / no-time
        // situations) was:
        //   'Start with what tau means on its own: to get, to reach. Where you put it decides WHAT got reached.',
        //   '> Kuv tau noj. — I ate.',
        //   'Tau comes FIRST, so it points at the whole action: the eating was reached, it happened. This is the everyday way to say you did something. It answers: did it happen?',
        //   '> Kuv noj tau. — I ate it successfully.',
        //   'Tau comes AFTER, so it points at how the eating turned out: it reached its goal. Use it when the result is the point: you were sick, the food was very spicy, there was barely time, and you still managed to eat. It answers: did it work?',
        //   'That same idea, the action can reach its goal, is why noj tau also means ability. Let the time decide: about something already done, Kuv noj tau is I ate it successfully; about now or in general, it is I can eat.',
        //   'Quick check. Someone asks Koj puas tau noj mov? (Have you eaten?): answer Kuv tau noj lawm. Someone asks whether you could eat it: answer Kuv noj tau.',
        'Same two words, two different ideas. Tau means to get, to reach, and where you put it decides what got reached.',
        'TAU + VERB: the action, the opportunity, the past experience.',
        // Was: '> Kuv tau noj. — I ate. (the action was done)', (context added 2026-09-29, author: bare verb + tau reads as can)
        '> Kuv tau noj ua ntej kuv tuaj. — I ate before I came. (the action was done)',
        '> Kuv tau ntsib nws. — I got to meet him. (the chance came, and I took it)',
        // Was: 'Use it for the past: you did the verb, or you had the chance to do it and you did. It is not really used for the present.', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        'English usually says it in the past: you did the verb, or you had the chance to do it and you did. But tau itself is not a tense. It says the action was reached, and the context tells you when.',
        // Was: 'VERB + TAU: success, and ability.', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        'VERB + TAU: ability, and in context, success.',
        // Was: '> Kuv noj tau. — I ate it successfully. (result: the action was completed)', listed first
        // (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        '> Kuv noj tau. — I can eat. (ability, right now)',
        // Was: '> Kuv noj tau. — I was able to eat it, I managed to eat it. (in context: it was accomplished)', (context added 2026-09-29, author: bare verb + tau reads as can)
        '> Lub tais mov loj heev, tiam sis kuv noj tau tag. — The bowl of rice was huge, but I managed to eat all of it. (success: the effort, and tag, all of it)',
        // Was: 'Use it when the point is that you SUCCEEDED: you learned something, did something, finished something. It also covers what you are able to do now, in the present, which tau + verb does not.', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        'Its main meaning is ability: what is possible, or what you are able to do, now or in general. In some contexts it is understood as success: you managed to do it, you learned it, you finished it. Not every verb + tau means successfully; the context decides.',
        // Emphasis — 2026-09-29 (author: "add emphasis that its context based extremely - and really isn't used often").
        'Keep this in mind: reading verb + tau as SUCCESS is extremely context-based, and it really isn’t used often. Most of the time, noj tau simply means can eat.',
        // Was: 'In short: tau first = it happened (past). Tau after = it worked, or you can (success or ability).', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        'In short: tau first = the action was reached (English usually says it in the past). Tau after = can, be able to; in context, managed to.',
        // ── DIVIDER — 2026-09-29 (author: "add a line that separates the verb definitions with tau,
        // from everything else"). Rendered by IntroBody's '---' prefix.
        '---',
        '## Before a noun: got, received',
        '> Kuv tau nyiaj. — I got money.',
        '> Kuv tau ib txoj haujlwm. — I got a job.',
        '## Done already: tau + verb + lawm',
        '> Kuv tau mus tsev lawm. — I have gone home already.',
        '## With a timeframe and lawm: for … now',
        'The timeframe goes between tau and lawm.',
        '> Kuv nyob ntawm no tau peb hnub lawm. — I have been here for three days.',
        '> Kuv kawm Hmoob tau peb xyoo lawm. — I have studied Hmong for three years.',
        // ("Got to" moved up, next to "Before the verb" — 2026-09-29, author.)
        '## Asking: puas tau',
        'Puas tau goes before the verb and asks for the completion of that verb: has it been done yet? Puas turns the sentence into a question and tau marks the action as completed, so together they ask whether the verb is complete. You expect it might be done, and you want to confirm.',
        '> Koj puas tau noj mov? — Have you eaten (yet)?',
        // tsis tau — its own section, 2026-09-26 (author: "keep it a distinct entity").
        '## Tsis tau: not yet, and can’t',
        'Tsis tau is a unit of its own: tsis (not) and tau together. It follows tau’s word order rule, so where it sits decides what it means: before the verb it is about the action being attained, after the verb it is about being able.',
        'Before the verb, tsis tau means not yet: the action has not been completed. In a past context it can also mean didn’t.',
        '> Kuv tsis tau noj mov. — I haven’t eaten yet.',
        '> Nws tsis tau los. — He hasn’t come yet.',
        '> Kuv tsis tau mus. — I haven’t gone yet.',
        '## Important: verb + tsis tau = can’t, unable',
        'After the verb, tsis tau always means can’t: you are unable to do it. It is the negative of verb + tau (can). In a past context it reads wasn’t able to. The object comes after it.',
        '> Kuv noj tsis tau. — I can’t eat.',
        '> Kuv mus tsis tau. — I can’t go.',
        '> Kuv nqa tsis tau. — I can’t carry it.',
        '> Kuv nrhiav tsis tau lwm txoj kev. — I can’t find another way.',
        'Compare the two, with the same verb: Kuv nrhiav tsis tau lwm txoj kev (I can’t find another way) and Kuv tsis tau nrhiav lwm txoj kev (I haven’t looked for another way yet). Same words, different order, different meaning.',
        // The author, 2026-09-26, after the GPT review: "then tsis + verb + tau is
        // incorrect". Was a softer "You may also hear tsis + verb + tau … it leans
        // toward did not manage to."
        'Don’t say tsis + verb + tau (Kuv tsis mus tau) for can’t. It is not the normal construction. Keep the three straight:',
        '> Kuv tsis tau mus. — I haven’t gone yet. / I didn’t go.',
        '> Kuv mus tsis tau. — I can’t go. / I wasn’t able to go.',
        '> Kuv tsis mus tau. — ✗ not the way to say “I can’t go”.',
        '> Kuv xav tiamsis tsis tau. — I want to, but I can’t.',
        'On its own, Tsis tau means not yet. It is used as a reply, typically to a question asking whether something has been completed, which is usually a puas tau question. The other answer is Tau lawm, yes, already.',
        '> Koj puas tau noj mov? — Have you eaten yet?',
        '> Tsis tau. — Not yet.',
        '> Tau lawm. — Yes, already.',
        // Was (one line inside "Asking and saying no: puas tau, tsis tau"):
        //   'Tsis tau is the other side of that question. Before the verb it means not yet — the action has not been completed. After the verb it means can’t — the same word order rule as tau.',
        //   '> Kuv tsis tau noj mov. — I haven’t eaten yet.',
        //   '> Kuv mus tsis tau. — I can’t go.',
        '## An easy way to remember',
        // Was: '> tau + verb → attained: did, have done (in a past context)', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        '> tau + verb → attained, reached: the action or situation came about (English often uses the past)',
        // Was: '> verb + tau → can, be able to (was able to, managed to, by context)', (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        '> verb + tau → can, be able to (in context: was able to, managed to)',
        '> tau + noun → got, received',
        '> tau + verb + lawm → done already',
        '> tau + timeframe + lawm → for that timeframe, up to now',
        '> puas tau + verb → asks if the verb is completed: did you…? have you…yet?',
        '> tsis tau + verb → not yet, haven’t, not completed (didn’t, in a past context)',
        '> verb + tsis tau (+ object) → can’t, unable to',
        '> puas tau …? → Tsis tau. (not yet) / Tau lawm. (yes, already)',
      ],
    },
    {
      id: 'grammar-tau-examples',
      kind: 'examples',
      title: 'Where tau sits',
      intro: 'Read each pair aloud. Same words, different order, different meaning.',
      items: [
        { hmong: 'Kuv tau mus.', english: 'I went.', note: 'tau before the verb: it happened.' },
        { hmong: 'Kuv mus tau.', english: 'I can go.', note: 'tau after the verb: can, be able to.' },
        { hmong: 'Kuv tau noj mov.', english: 'I have eaten.' },
        { hmong: 'Kuv noj tau.', english: 'I can eat.' },
        // The emphasised pair — 2026-09-29 (author).
        { hmong: 'Kuv tau noj ua ntej kuv tuaj.', english: 'I ate before I came.', note: 'tau before the verb: the action was done.' },  // Was hmong: 'Kuv tau noj.' (context added 2026-09-29, author: bare verb + tau reads as can)
        { hmong: 'Naghmo kuv mob, tiam sis kuv noj tau me ntsis.', english: 'Yesterday I was sick, but I was able to eat a little.', note: 'tau after the verb: without naghmo and the sickness, Kuv noj tau would just mean I can eat.' },  // Was hmong: 'Kuv noj tau.' (context added 2026-09-29, author: bare verb + tau reads as can)  // Was english: 'I ate it successfully.' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        { hmong: 'Kuv tau nyiaj.', english: 'I got money.', note: 'tau before a noun: got, received.' },
        { hmong: 'Nws tau khoom plig.', english: 'He received a gift.' },
        { hmong: 'Kuv nyob ntawm no tau peb hnub lawm.', english: 'I have been here for three days.', note: 'tau + timeframe + lawm.' },
        { hmong: 'Koj puas tau noj mov?', english: 'Have you eaten?', note: 'puas tau before the verb: asks whether the eating is completed.' },
        { hmong: 'Kuv tsis tau noj mov.', english: 'I haven’t eaten yet.', note: 'tsis tau before the verb: not yet, not completed.' },
        { hmong: 'Kuv mus tsis tau.', english: 'I can’t go.', note: 'tsis tau after the verb: can’t, unable to.' },
        { hmong: 'Nws tsis tau los.', english: 'He hasn’t come yet.', note: 'tsis tau before the verb: not yet.' },
        { hmong: 'Kuv nqa tsis tau.', english: 'I can’t carry it.', note: 'tsis tau after the verb: can’t, unable to.' },
        { hmong: 'Kuv nrhiav tsis tau lwm txoj kev.', english: 'I can’t find another way.', note: 'the object comes after tsis tau.' },
        { hmong: 'Tsis tau.', english: 'Not yet.', note: 'On its own: the reply to a question asking whether something is completed.' },
        { hmong: 'Kuv tau mus tsev lawm.', english: 'I have gone home already.', note: 'tau + verb + lawm: done already.' },
      ],
    },
    // ── EVERY TAU, WITH NOJ — 2026-09-29 (author: "write a bunch of sentences using the verb kuv
    // noj with tau that explains every context"). One verb, every position, so only tau moves.
    // ⚠️ Claude's Hmong, built on the lesson's own rules — TODO-VERIFY each sentence with the author.
    {
      id: 'grammar-tau-noj-contexts',
      kind: 'examples',
      title: 'Every tau, with noj',
      intro: 'The same verb, noj (eat), every time. Watch where tau sits and what the sentence means.',
      items: [
        // tau + verb — past completion: the action, the opportunity, the past experience
        { hmong: 'Kuv tau noj mov ua ntej kuv tuaj.', english: 'I ate before I came.', note: 'tau + verb — the ACTION: it was done (past completion).' },  // Was hmong: 'Kuv tau noj mov.' (context added 2026-09-29, author: bare verb + tau reads as can)
        { hmong: 'Naghmo kuv tau noj mov nrog kuv pog.', english: 'Yesterday I got to eat with my grandmother.', note: 'tau + verb — the OPPORTUNITY: the chance came, and I took it.' },
        { hmong: 'Kuv tau noj ntses nyoos ib zaug.', english: 'I have eaten raw fish once.', note: 'tau + verb — PAST EXPERIENCE: something I have done before.' },
        { hmong: 'Kuv tau noj mov lawm.', english: 'I have already eaten.', note: 'tau + verb + lawm — done already.' },
        // verb + tau — ability, and in context, success
        { hmong: 'Lub tais mov loj heev, tiam sis kuv noj tau tag.', english: 'The bowl of rice was huge, but I managed to eat all of it.',  /* Was hmong: 'Kuv noj tau tag.' (context added 2026-09-29, author: bare verb + tau reads as can) */ note: 'verb + tau — in context, success: I was able to finish it. Rare, and extremely context-based.' },  // Was note: 'verb + tau — SUCCESS: …' (author + GPT review, 2026-09-29: tau is aspect, not tense; success is contextual)
        { hmong: 'Kuv noj tau.', english: 'I can eat.', note: 'verb + tau — ABILITY, right now.' },
        { hmong: 'Kuv noj tau kua txob.', english: 'I can eat chili peppers.', note: 'verb + tau + object — ability: I can handle it.' },
        { hmong: 'Kuv zoo lawm, tam sim no kuv noj tau lawm.', english: 'I am better; now I can eat again.',  /* Was hmong: 'Tam sim no kuv noj tau lawm.' (context added 2026-09-29, author: bare verb + tau reads as can) */ note: 'verb + tau + lawm — the ability is back (after being sick).' },
        { hmong: 'Tagkis koj yuav noj tau.', english: 'Tomorrow you will be able to eat.', note: 'yuav + verb + tau — ability in the future.' },
        // negatives
        { hmong: 'Kuv noj tsis tau.', english: 'I can’t eat.', note: 'verb + tsis tau — no ability: unable.' },
        { hmong: 'Kuv noj tsis tau kua txob.', english: 'I can’t eat chili peppers.', note: 'verb + tsis tau + object.' },
        { hmong: 'Kuv tsis tau noj mov.', english: 'I haven’t eaten yet.', note: 'tsis tau + verb — not yet: not completed.' },
        // questions
        { hmong: 'Koj puas tau noj mov?', english: 'Have you eaten?', note: 'puas tau + verb — asks about the action: has it been done?' },
        { hmong: 'Koj puas noj tau kua txob?', english: 'Can you eat chili peppers?', note: 'puas + verb + tau — asks about the ability.' },
        // tau with a noun or a timeframe
        { hmong: 'Kuv tau mov noj.', english: 'I got food to eat.', note: 'tau + noun — got, received.' },
        { hmong: 'Kuv noj mov tau ib teev lawm.', english: 'I have been eating for an hour now.', note: 'tau + timeframe + lawm — for how long.' },
      ],
    },
    {
      id: 'grammar-tau-quiz',
      kind: 'quiz',
      title: 'Learn the words',
    },
  ],
}
