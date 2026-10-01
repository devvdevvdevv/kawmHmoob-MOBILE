// PATH SENTENCES — extra practice sentences for the path units' sentence builder.
//
// Added 2026-09-28 (author: "every thing has at least 7 moderately difficult sentences in the
// path"). Written by GPT from a prompt carrying the author's settled rules, then reviewed by
// Claude against those rules before import. ALL are unreviewed by a speaker (TODO-VERIFY):
// pathUnitExercises (lib/sentenceBuilder.js) marks every one `unreviewed: true`.
//
// How they are used: a unit's own human sentences come first, then its cards' moreExamples
// (up to SESSION_LENGTH), then these — up to FULL_SESSION_LENGTH. Sentences over MAX_TOKENS
// chips, duplicates, and (u-yog) sentences without yog are skipped automatically.
//
// `word` is the focus the sentence practises; shown as "teaches …" after an answer.
// `was` records what Claude changed on review, so the author can see every edit.
//
// Block A, 2026-09-28. Dropped on review (not here): "Koj puas yog Chai lub xeem" (nonsense),
// "Nyob zoo sawv ntxov os niam" (a calque of "good morning"), "Wb mloog lus Hmoob zoo heev"
// (mloog lus is "listen / obey", not "understand"), "Tus menyuam no yog nej li" (li for a
// child), "Koj mus zoo nawb hmo ntuj no" (awkward "tonight"), and the duplicate "Koj nyob li
// cas hnub no" under u-nyob.

export const PATH_SENTENCES = {
  'u-greetings': [
    { word: 'nyob zoo', hmong: 'Nyob zoo koj thiab koj tsev neeg.', english: 'Hello to you and your family.' },
    { word: 'ua tsaug', hmong: 'Ua tsaug rau koj txoj kev pab.', english: 'Thank you for your help.', was: '"Ua tsaug rau koj kev pab kuv" — txoj kev pab, classifier + noun (author, 2026-09-28)' },
    { word: 'sib ntsib dua', hmong: 'Peb yuav sib ntsib dua tagkis.', english: 'We will meet again tomorrow.' },
    { word: 'koj nyob li cas', hmong: 'Koj nyob li cas hnub no?', english: 'How are you today?' },
    { word: 'ua tsaug', hmong: 'Lawv ua tsaug ntau rau peb.', english: 'They thank us very much.' },
  ],
  'u-pronouns': [
    { word: 'kuv', hmong: 'Kuv noj mov nrog kuv niam.', english: 'I eat with my mother.', was: 'english: "I eat rice with my mother"' },
    { word: 'koj', hmong: 'Koj puas mus kawm ntawv hnub no?', english: 'Are you going to school today?' },
    { word: 'nws', hmong: 'Nws nyiam nyeem phau ntawv loj.', english: 'He likes to read the big book.' },
    { word: 'peb', hmong: 'Peb zaum hauv lub tsev no.', english: 'We sit in this house.' },
    { word: 'nej', hmong: 'Nej yuav mus qhov twg tagkis?', english: 'Where will you all go tomorrow?' },
    { word: 'lawv', hmong: 'Lawv tsis tau pom kuv naghmo.', english: 'They did not see me yesterday.' },
    { word: 'wb', hmong: 'Wb tau sib ntsib thaum sawv ntxov.', english: 'We two met in the morning.' },
  ],
  'u-yog': [
    { word: 'yog', hmong: 'Nws yog ib tug neeg zoo.', english: 'He is a good person.' },
    { word: 'tsis yog', hmong: 'Qhov no tsis yog kuv phau ntawv.', english: 'This is not my book.' },
    { word: 'yog', hmong: 'Peb yog phooj ywg zoo heev.', english: 'We are very good friends.' },
    { word: 'los yog', hmong: 'Koj yuav noj mov los yog nqaij?', english: 'Will you eat rice or meat?' },
    { word: 'yog tias', hmong: 'Yog tias koj mus kuv mam los.', english: 'If you go, then I will come.' },
    { word: 'yog', hmong: 'Lub tsev no yog lawv lub tsev.', english: 'This house is their house.' },
  ],
  'u-hu-ua': [
    { word: 'hu li cas', hmong: 'Koj lub npe hu li cas?', english: 'What is your name?' },
    { word: 'hu ua', hmong: 'Kuv lub npe hu ua Mai.', english: 'My name is Mai.' },
    { word: 'lub npe', hmong: 'Nws lub npe hu ua Tou.', english: 'His name is Tou.' },
    { word: 'lub xeem', hmong: 'Kuv lub xeem yog Vaj.', english: 'My clan name is Vang.' },
    { word: 'hu … ua', hmong: 'Peb hu nws ua Pa.', english: 'We call him Pa.', was: '"Peb hu ua nws yog Pa" — hu + someone + ua + name' },
    { word: 'hu li cas', hmong: 'Tus menyuam no lub npe hu li cas?', english: 'What is this child\'s name?', was: '"Tus menyuam no hu li cas"' },
    { word: 'lub npe', hmong: 'Kuv niam lub npe hu ua Nou.', english: 'My mother\'s name is Nou.', was: '"Lawv lub npe hu ua Nou" (their name)' },
  ],
  'u-nyob': [
    { word: 'nyob', hmong: 'Kuv nyob hauv lub tsev loj.', english: 'I live in the big house.' },
    { word: 'tsis nyob', hmong: 'Nws tsis nyob hauv tsev lawm.', english: 'He is not at home anymore.' },
    { word: 'nyob', hmong: 'Peb nyob kub heev thaum tav su.', english: 'We are very hot at noon.' },
    { word: 'nyob', hmong: 'Lawv nyob hauv lub nroog no.', english: 'They live in this city.', was: '"nyob rau lub nroog" — hauv is the usual word for location (author)' },
    { word: 'nyob li cas', hmong: 'Nej nyob li cas tagkis no?', english: 'How are you all this morning?' },
    { word: 'nyob', hmong: 'Wb nyob nrog peb niam txiv.', english: 'We two live with our parents.' },
  ],
  'u-verbs': [
    { word: 'noj', hmong: 'Kuv noj mov thaum sawv ntxov.', english: 'I eat in the morning.', was: 'english: "I eat rice"' },
    { word: 'haus', hmong: 'Koj haus dej nrog kuv thiab.', english: 'You drink water with me too.' },
    { word: 'mus', hmong: 'Nws mus kawm ntawv hnub no.', english: 'He goes to school today.' },
    { word: 'los', hmong: 'Peb los tsev thaum tsaus ntuj.', english: 'We come home in the evening.' },
    { word: 'ua', hmong: 'Lawv ua haujlwm hauv tsev.', english: 'They work at home.' },
    { word: 'muaj', hmong: 'Kuv muaj ob tug phooj ywg.', english: 'I have two friends.' },
    { word: 'pom', hmong: 'Nej pom kuv lub tsev loj.', english: 'You all see my big house.' },
  ],
  'u-verb-noun': [
    { word: 'taug kev', hmong: 'Kuv taug kev mus rau tsev.', english: 'I walk home.' },
    { word: 'noj mov', hmong: 'Koj noj mov nrog koj niam.', english: 'You eat with your mother.', was: 'english: "eat rice"' },
    { word: 'nyeem ntawv', hmong: 'Nws nyeem ntawv hauv tsev.', english: 'He reads at home.' },
    { word: 'sau ntawv', hmong: 'Peb sau ntawv rau peb txiv.', english: 'We write to our father.' },
    { word: 'kawm ntawv', hmong: 'Lawv kawm ntawv thaum sawv ntxov.', english: 'They study in the morning.' },
    { word: 'hais lus', hmong: 'Nej hais lus nrog kuv thiab.', english: 'You all speak with me too.' },
  ],
  'u-classifiers': [
    { word: 'tus', hmong: 'Kuv muaj ib tug aub me.', english: 'I have a small dog.' },
    { word: 'lub', hmong: 'Nws nyob hauv lub tsev loj.', english: 'He lives in the big house.' },
    { word: 'daim', hmong: 'Peb muaj daim ntawv dawb no.', english: 'We have this white paper.' },
    { word: 'phau', hmong: 'Koj nyeem phau ntawv zoo heev.', english: 'You are reading a very good book.' },
    { word: 'rab', hmong: 'Lawv muaj rab riam ntev.', english: 'They have a long knife.' },
    { word: 'txoj', hmong: 'Wb taug txoj kev loj no.', english: 'We two walk along this big road.' },
    { word: 'cov', hmong: 'Nej pom cov menyuam hauv tsev.', english: 'You all see the children in the house.' },
  ],
  'u-this-that': [
    { word: 'no', hmong: 'Lub tsev no yog kuv lub.', english: 'This house is mine.' },
    { word: 'ko', hmong: 'Tus aub ko zoo nkauj heev.', english: 'That dog over there is very pretty.' },
    { word: 'ntawd', hmong: 'Phau ntawv ntawd yog koj li.', english: 'That book is yours.' },
    { word: 'qhov no', hmong: 'Qhov no yog peb lub tsev.', english: 'This is our house.', was: 'english: "This place is our house"' },
    { word: 'tus no', hmong: 'Tus no yog kuv tus phooj ywg.', english: 'This one is my friend.' },
    { word: 'no', hmong: 'Kuv nyiam lub tsev no heev.', english: 'I like this house a lot.' },
    { word: 'ntawd', hmong: 'Lawv nyob hauv lub tsev ntawd.', english: 'They live in that house.' },
  ],
  'u-possession': [
    { word: 'kuv phau ntawv', hmong: 'Kuv phau ntawv nyob hauv tsev.', english: 'My book is in the house.' },
    { word: 'koj li', hmong: 'Lub tsev no yog koj li.', english: 'This house is yours.' },
    { word: 'nws tus aub', hmong: 'Nws tus aub nyob tom tsev.', english: 'His dog is at the house.' },
    { word: 'peb lub tsev', hmong: 'Peb lub tsev loj heev.', english: 'Our house is very big.' },
    { word: 'lawv li', hmong: 'Cov ntawv no yog lawv li.', english: 'These papers are theirs.' },
    { word: 'wb phau ntawv', hmong: 'Wb phau ntawv nyob ntawm no.', english: 'Our book is here.' },
  ],
  'u-conjunctions': [
    { word: 'thiab', hmong: 'Kuv noj mov thiab haus dej.', english: 'I eat and drink water.', was: 'english: "eat rice"' },
    { word: 'nrog', hmong: 'Nws mus nrog nws niam txiv.', english: 'He goes with his parents.' },
    { word: 'tiamsis', hmong: 'Koj yuav mus tiamsis kuv nyob.', english: 'You will go, but I will stay.' },
    { word: 'vim', hmong: 'Peb tsis mus vim nws mob.', english: 'We are not going because he is sick.' },
    { word: 'los yog', hmong: 'Koj noj nqaij los yog zaub?', english: 'Do you eat meat or vegetables?' },
    { word: 'kom', hmong: 'Lawv hais kom kuv los tsev.', english: 'They tell me to come home.' },
    { word: 'txawm … los', hmong: 'Txawm koj mus los kuv tseem nyob.', english: 'Even if you go, I will still stay.', was: '"… los kuv nyob" — tseem makes the contrast clearer (author, 2026-09-28)' },
  ],

  // ── Block B, 2026-09-28 — 98 in, 88 kept. Dropped: "Nws yuav rau rau kuv noj" (nonsense),
  // "Txawm nws mus los kuv nyob" (txawm … los, not txawm "so"), "Nej noj tsis tau mov no" (object
  // after tsis tau, unsure), "Leej twg nyob? — Kuv nyob hauv", "Nej sib pab noj mov ntau", three
  // particle sentences (puas … lov, sas, mus zoo nawb tagkis), and two Block A duplicates.
  // Answering items: the " — " between question and answer removed (it became a chip).
  'u-rau': [
    { word: 'rau', hmong: 'Kuv sau ntawv rau koj nyeem.', english: 'I am writing for you to read.' },
    { word: 'rau', hmong: 'Nws muab mov rau kuv noj.', english: 'He gives me food to eat.' },
    { word: 'rau', hmong: 'Peb rau khau thaum sawv ntxov.', english: 'We put on shoes in the morning.' },
    { word: 'rau', hmong: 'Lawv muab tshuaj rau nws haus.', english: 'They give him medicine to drink.' },
    { word: 'rau', hmong: 'Koj hais lus rau kuv mloog.', english: 'You speak for me to listen.' },
    { word: 'rau', hmong: 'Wb muab phau ntawv rau nej.', english: 'We two give the book to you all.' },
  ],
  'u-questions': [
    { word: 'dab tsi', hmong: 'Koj ua dab tsi hnub no?', english: 'What are you doing today?' },
    { word: 'leej twg', hmong: 'Leej twg nyob hauv tsev?', english: 'Who is in the house?' },
    { word: 'qhov twg', hmong: 'Nws nyob qhov twg tam sim no?', english: 'Where is he right now?', was: '"thaum no" → tam sim no' },
    { word: 'thaum twg', hmong: 'Peb yuav mus thaum twg?', english: 'When will we go?' },
    { word: 'vim li cas', hmong: 'Vim li cas koj tsis los?', english: 'Why aren’t you coming?' },
    { word: 'pes tsawg', hmong: 'Koj muaj pes tsawg tus menyuam?', english: 'How many children do you have?' },
  ],
  'u-tense': [
    { word: 'tab tom', hmong: 'Kuv tab tom noj mov.', english: 'I am eating right now.' },
    { word: 'yuav', hmong: 'Nws yuav mus kawm ntawv.', english: 'He is going to go to school.' },
    { word: 'mam li', hmong: 'Peb mam li los tsev.', english: 'We will come home.' },
    { word: 'tab tom yuav', hmong: 'Lawv tab tom yuav noj.', english: 'They are about to eat.' },
    { word: 'tau', hmong: 'Koj tau pom kuv naghmo.', english: 'You saw me yesterday.' },
    { word: 'twb … lawm', hmong: 'Wb twb noj mov lawm.', english: 'We two already ate.' },
    { word: 'nyuam qhuav', hmong: 'Nej nyuam qhuav los tsev.', english: 'You all just came home.' },
  ],
  'u-tau': [
    { word: 'tau + verb', hmong: 'Kuv tau noj mov naghmo.', english: 'I ate yesterday.' },
    { word: 'verb + tau', hmong: 'Nws mus tau tom khw.', english: 'He can go to the market.', was: '"Nws mus tau hauv lub tsev"' },
    { word: 'tau + noun', hmong: 'Peb tau ib phau ntawv tshiab.', english: 'We got a new book.' },
    { word: 'tsis tau + verb', hmong: 'Koj tsis tau noj mov.', english: 'You haven’t eaten yet.' },
    { word: 'verb + tsis tau', hmong: 'Lawv mus tsis tau hnub no.', english: 'They can’t go today.' },
    { word: 'tau + verb', hmong: 'Wb tau pom nws thaum sawv ntxov.', english: 'We two saw him in the morning.', was: '"thaum ntxov" → thaum sawv ntxov' },
    { word: 'tau + noun', hmong: 'Nej tau ib lub tsev loj.', english: 'You all got a big house.' },
  ],
  'u-negation': [
    { word: 'tsis', hmong: 'Kuv tsis nyiam noj nqaij.', english: 'I don’t like to eat meat.' },
    { word: 'tsis txhob', hmong: 'Koj tsis txhob mus deb.', english: 'Don’t go far.' },
    { word: 'tsis tau', hmong: 'Nws tsis tau los tsev.', english: 'He hasn’t come home yet.' },
    { word: 'tsis', hmong: 'Peb tsis pom koj naghmo.', english: 'We didn’t see you yesterday.' },
    { word: 'tsis txhob', hmong: 'Lawv tsis txhob hais lus ntau.', english: 'They must not talk too much.' },
    { word: 'tsis', hmong: 'Wb tsis muaj phau ntawv.', english: 'We two don’t have a book.' },
  ],
  'u-answers': [
    { word: 'dab tsi', hmong: 'Koj ua dab tsi? Kuv sau ntawv.', english: 'What are you doing? I am writing.' },
    { word: 'qhov twg', hmong: 'Nws nyob qhov twg? Nws nyob hauv tsev.', english: 'Where is he? He is in the house.', was: 'answer "Hauv tsev" — the answer keeps the question’s order' },
    { word: 'puas → the verb', hmong: 'Koj puas mus tom khw? Kuv mus.', english: 'Are you going to the market? I am going.', was: '"Koj puas mus? — Yog, kuv mus." — yes to a puas question is the verb said back' },
    { word: 'aws', hmong: 'Koj puas nyob zoo? Aws, kuv nyob zoo.', english: 'Are you well? Yes, I am well.', was: '"Koj nyob zoo? — Aws, kuv zoo."' },
    { word: 'thaum twg', hmong: 'Peb mus thaum twg? Peb mus tagkis.', english: 'When do we go? We go tomorrow.', was: 'answer "Tagkis"' },
    { word: 'pes tsawg', hmong: 'Muaj pes tsawg tus aub? Muaj ob tus.', english: 'How many dogs are there? There are two.', was: '"Muaj pes tsawg? — Muaj ob tug." (a first fix, Koj muaj … Kuv muaj ob tus, was 10 chips)' },
  ],
  'u-adjectives': [
    { word: 'loj', hmong: 'Lub tsev ntawm no loj heev.', english: 'The house here is very big.', was: '"Lub tsev loj heev ntawm no"' },
    { word: 'me', hmong: 'Tus aub me no zoo nkauj.', english: 'This small dog is pretty.' },
    { word: 'dua', hmong: 'Phau ntawv no zoo dua phau qub.', english: 'This book is better than the old one.', was: '"Phau ntawv zoo dua qhov qub"' },
    { word: 'dhau', hmong: 'Cov menyuam phem dhau lawm.', english: 'The children are too naughty.' },
    { word: 'tshiab', hmong: 'Kuv muaj ib lub tsev tshiab.', english: 'I have a new house.' },
    { word: 'tshaj', hmong: 'Tsob ntoo no siab tshaj.', english: 'This tree is the tallest.', was: '"Tsob ntoo siab tshaj ntawm no"' },
    { word: 'dhau', hmong: 'Txoj kev no ntev dhau.', english: 'This road is too long.', was: '"Txoj kev ntev heev rau peb"' },
  ],
  'u-adjective-words': [
    { word: 'loj', hmong: 'Lub tsev loj nyob ntawm no.', english: 'The big house is here.' },
    { word: 'me', hmong: 'Tus menyuam me noj mov ntau.', english: 'The little child eats a lot.' },
    { word: 'zoo', hmong: 'Phau ntawv zoo rau kuv nyeem.', english: 'A good book for me to read.' },
    { word: 'phem', hmong: 'Cov neeg phem tsis nyob deb.', english: 'The bad people don’t live far away.' },
    { word: 'tshiab', hmong: 'Koj muaj ib daim ntawv tshiab.', english: 'You have a new sheet of paper.' },
    { word: 'qub', hmong: 'Peb nyob hauv lub tsev qub.', english: 'We live in the old house.' },
    { word: 'zoo nkauj', hmong: 'Tus ntxhais zoo nkauj heev.', english: 'The girl is very pretty.' },
  ],
  'u-location': [
    { word: 'nraum', hmong: 'Nws zaum nraum lub tsev.', english: 'He sits outside the house.' },
    { word: 'saum', hmong: 'Phau ntawv nyob saum lub rooj.', english: 'The book is on the table.', was: '"Peb nyob saum lub rooj" (we are on the table)' },
    { word: 'hauv qab', hmong: 'Lawv nyob hauv qab tsob ntoo.', english: 'They are under the tree.' },
    { word: 'ntawm', hmong: 'Wb nyob ntawm qhov rooj.', english: 'We two are at the door.', was: '"ntawm lub qhov rooj"' },
    { word: 'ze', hmong: 'Nej nyob ze kuv lub tsev.', english: 'You all live near my house.' },
    { word: 'deb', hmong: 'Tus aub nyob deb heev.', english: 'The dog is very far away.' },
  ],
  'u-quantity': [
    { word: 'ib co', hmong: 'Kuv muaj ib co dej haus.', english: 'I have some drinking water.' },
    { word: 'tej txhia', hmong: 'Tej txhia neeg nyob hauv tsev.', english: 'Some people are in the house.' },
    { word: 'ob peb', hmong: 'Nws muaj ob peb phau ntawv.', english: 'He has a few books.' },
    { word: 'ntau', hmong: 'Peb muaj ntau tus phooj ywg.', english: 'We have many friends.' },
    { word: 'coob', hmong: 'Lawv muaj menyuam coob heev.', english: 'They have very many children.', note: 'settled 2026-09-28: after the noun is common and natural; before the classifier (coob tus menyuam) is more precise' },
    { word: 'tsawg', hmong: 'Wb muaj ntawv tsawg xwb.', english: 'We two have only a little paper.', note: 'settled 2026-09-28: after the noun is natural' },
    { word: 'txhua', hmong: 'Nej pom txhua tus menyuam.', english: 'You all see every child.' },
  ],
  'u-noun-purpose': [
    { word: 'phau ntawv kawm', hmong: 'Kuv muaj phau ntawv kawm.', english: 'I have a textbook.' },
    { word: 'phau ntawv nyeem', hmong: 'Nws nyeem phau ntawv nyeem.', english: 'He is reading a novel.' },
    { word: 'rab riam txiav nqaij', hmong: 'Peb muaj rab riam txiav nqaij.', english: 'We have a meat knife.' },
    { word: 'tsev kho mob', hmong: 'Lawv mus tsev kho mob.', english: 'They go to the hospital.' },
    { word: 'kws qhia ntawv', hmong: 'Wb pom kws qhia ntawv.', english: 'We two see the teacher.' },
    { word: 'chav ua noj', hmong: 'Nej nyob hauv chav ua noj.', english: 'You all are in the kitchen.' },
    { word: 'dej haus', hmong: 'Koj muaj dej haus ntau.', english: 'You have a lot of drinking water.' },
  ],
  'u-so-then': [
    { word: 'yog li', hmong: 'Yog li kuv yuav mus tsev.', english: 'In that case, I will go home.' },
    { word: 'thiaj li', hmong: 'Nws mob, nws thiaj li tsis los.', english: 'He is sick, so he isn’t coming.', was: '"Nws mob thiaj li tsis los" — thiaj li after the second subject' },
    { word: 'ces', hmong: 'Koj noj mov ces kuv los.', english: 'You eat, then I come.' },
    { word: 'yog li ntawd', hmong: 'Yog li ntawd peb mam li mus.', english: 'In that case, we will go.' },
    { word: 'thiaj', hmong: 'Lawv pab, peb thiaj ua tau haujlwm.', english: 'They helped, so we could get the work done.', was: '"Lawv pab thiaj ua tau haujlwm"' },
    { word: 'ces', hmong: 'Wb los ces nej noj mov.', english: 'We two come, then you all eat.' },
  ],
  'u-sib': [
    { word: 'sib hlub', hmong: 'Peb sib hlub heev.', english: 'We love each other very much.', was: '"Peb sib hlub heev hnub no"' },
    { word: 'sib pab', hmong: 'Koj thiab kuv sib pab ua haujlwm.', english: 'You and I help each other at work.', was: '"Kuv thiab koj sib pab ua", then "Kuv thiab koj" — the Hmong order follows the English: koj thiab kuv = you and I; kuv thiab koj = me and you (author, 2026-09-28)' },
    { word: 'sib tham', hmong: 'Lawv sib tham hauv tsev.', english: 'They talk with each other at home.' },
    { word: 'sib ntsib', hmong: 'Wb sib ntsib thaum sawv ntxov.', english: 'We two meet in the morning.' },
    { word: 'sib hlub', hmong: 'Nws thiab kuv sib hlub.', english: 'He and I love each other.' },
    { word: 'sib tham', hmong: 'Cov phooj ywg sib tham zoo.', english: 'The friends talk well together.' },
  ],
  'u-particles': [
    // Removed 2026-09-28 (author: the soft hello is just Nyob zoo os — 2 chips, too short for the
    // builder, so it lives on the os card instead). Was:
    // { word: 'os', hmong: 'Nyob zoo os kuv niam.', english: 'Hello, mother.' },
    { word: 'ne', hmong: 'Koj nyob li cas ne?', english: 'And how are you?', note: 'confirmed 2026-09-28' },
    // Removed 2026-09-28 — the author: "there is no na"; it was a hallucination (Claude's GPT prompt
    // listed na as a particle). Was: { word: 'na', hmong: 'Nws nyob hauv tsev na.', … }
    { word: 'os', hmong: 'Ua tsaug rau koj os.', english: 'Thank you.', was: '"Ua tsaug os rau koj"', note: 'confirmed 2026-09-28' },
  ],

  // ── Block C, 2026-09-28 — 84 in, 81 kept. Dropped: three exact duplicates of earlier sentences
  // ("Kuv noj mov thaum sawv ntxov", "Peb los tsev thaum tsaus ntuj", "Kuv sawv thaum sawv ntxov"
  // under u-daily). Two meaning errors fixed: nagkis / puagnraus are days AHEAD, not behind.
  'u-numbers': [
    { word: 'peb tus', hmong: 'Kuv muaj peb tus aub me.', english: 'I have three small dogs.' },
    { word: 'kaum', hmong: 'Nws nyeem kaum phau ntawv.', english: 'He read ten books.' },
    { word: 'muaj … xyoo', hmong: 'Kuv muaj kaum ob xyoo.', english: 'I am twelve years old.', was: '"Peb muaj kaum ob xyoo" (we are twelve)' },
    { word: 'tsib', hmong: 'Lawv muaj tsib lub tsev.', english: 'They have five houses.' },
    { word: 'kaum tsib', hmong: 'Wb muaj kaum tsib tus qaib.', english: 'We two have fifteen chickens.', was: '"kaum tsib tug menyuam" (fifteen children)' },
    { word: 'pebcaug', hmong: 'Koj muaj pebcaug xyoo lawm.', english: 'You are thirty years old now.', was: '"peb caug" — the app writes the tens joined' },
    { word: 'rau', hmong: 'Nej muaj rau phau ntawv tshiab.', english: 'You all have six new books.' },
  ],
  'u-money': [
    { word: 'yog pes tsawg', hmong: 'Lub tsho no yog pes tsawg?', english: 'How much is this shirt?' },
    { word: 'kim', hmong: 'Phau ntawv no kim heev.', english: 'This book is very expensive.' },
    { word: 'pheej yig', hmong: 'Cov zaub no pheej yig heev.', english: 'These vegetables are very cheap.' },
    { word: 'them nyiaj', hmong: 'Kuv yuav them nyiaj rau koj.', english: 'I will pay you.' },
    { word: 'nyiaj', hmong: 'Nws muaj ntau nyiaj heev.', english: 'He has a lot of money.' },
    { word: 'daim nqi', hmong: 'Peb saib daim nqi hnub no.', english: 'We look at the bill today.' },
    { word: 'kim npaum li cas', hmong: 'Nws kim npaum li cas?', english: 'How expensive is it?' },
  ],
  'u-family': [
    { word: 'niam', hmong: 'Kuv niam ua noj hauv tsev.', english: 'My mother cooks at home.' },
    { word: 'txiv', hmong: 'Nws txiv mus ua haujlwm.', english: 'His father goes to work.' },
    { word: 'tij laug', hmong: 'Peb tij laug nyob hauv tsev.', english: 'Our older brother is at home.' },
    { word: 'muam', hmong: 'Koj muam nyeem ntawv zoo.', english: 'Your sister reads well.' },
    { word: 'menyuam', hmong: 'Lawv muaj peb tus menyuam.', english: 'They have three children.' },
    { word: 'tsev neeg', hmong: 'Wb tsev neeg nyob ze.', english: 'Our family lives nearby.' },
    { word: 'pog', hmong: 'Nej pog zaum hauv tsev.', english: 'Your grandmother is sitting at home.' },
  ],
  'u-food': [
    { word: 'dej', hmong: 'Nws haus dej nrog kuv.', english: 'He drinks water with me.' },
    { word: 'nqaij', hmong: 'Peb noj nqaij hauv tsev.', english: 'We eat meat at home.' },
    { word: 'zaub', hmong: 'Lawv nyiam noj zaub ntau.', english: 'They like to eat a lot of vegetables.' },
    { word: 'ua noj', hmong: 'Koj ua noj rau peb.', english: 'You cook for us.' },
    { word: 'txiv hmab txiv ntoo', hmong: 'Wb noj txiv hmab txiv ntoo.', english: 'We two eat fruit.' },
    { word: 'kas fes', hmong: 'Nej haus kas fes hnub no.', english: 'You all are drinking coffee today.' },
  ],
  'u-time': [
    { word: 'sawv ntxov', hmong: 'Kuv sawv thaum sawv ntxov.', english: 'I get up in the morning.' },
    { word: 'tav su', hmong: 'Nws noj mov thaum tav su.', english: 'He eats at noon.' },
    { word: 'nruab hnub', hmong: 'Lawv ua haujlwm thaum nruab hnub.', english: 'They work during the day.' },
    { word: 'hmo ntuj', hmong: 'Koj pw thaum hmo ntuj.', english: 'You sleep at night.' },
    { word: 'ib tag hmo', hmong: 'Wb tseem tsis tau pw thaum ib tag hmo.', english: 'We two still haven’t slept at midnight.', was: '"Wb tseem nyob thaum ib tag hmo" (still up)' },
    { word: 'sawv ntxov', hmong: 'Nej mus kawm ntawv thaum sawv ntxov.', english: 'You all go to school in the morning.', was: '"mus kawm" → mus kawm ntawv' },
  ],
  'u-day-frames': [
    { word: 'naghmo', hmong: 'Kuv pom nws naghmo.', english: 'I saw him yesterday.' },
    { word: 'hnub no', hmong: 'Nws nyob hauv tsev hnub no.', english: 'He is at home today.' },
    { word: 'tagkis', hmong: 'Peb yuav mus tagkis.', english: 'We will go tomorrow.' },
    { word: 'nagkis', hmong: 'Lawv yuav los tsev nagkis.', english: 'They will come home the day after tomorrow.', was: '"Lawv los tsev nagkis" glossed "the day before yesterday" — nagkis is two days AFTER' },
    { word: 'puagnraus', hmong: 'Koj yuav mus puagnraus.', english: 'You will go three days from now.', was: '"Koj mus puagnraus" glossed "the day after tomorrow" — puagnraus is three days on' },
    { word: 'txhua hnub', hmong: 'Wb noj mov txhua hnub.', english: 'We two eat every day.' },
    { word: 'lwm hnub', hmong: 'Nej yuav los lwm hnub.', english: 'You all will come another day.' },
  ],
  'u-calendar': [
    { word: 'hnub ib', hmong: 'Hnub ib kuv mus kawm ntawv.', english: 'On Monday I go to school.' },
    { word: 'hnub ob', hmong: 'Hnub ob nws ua haujlwm.', english: 'On Tuesday he works.' },
    { word: 'lub ib hlis ntuj', hmong: 'Lub ib hlis ntuj peb nyob tsev.', english: 'In January we stay home.' },
    { word: 'hnub xya', hmong: 'Hnub xya lawv so haujlwm.', english: 'On Sunday they rest from work.' },
    { word: 'lub kaum ob hlis ntuj', hmong: 'Lub kaum ob hlis ntuj wb los.', english: 'In December we two come.' },
    { word: 'hnub tsib', hmong: 'Hnub tsib koj nyeem ntawv.', english: 'On Friday you read.' },
    { word: 'lub rau hlis ntuj', hmong: 'Lub rau hlis ntuj nej mus.', english: 'In June you all go.' },
  ],
  'u-dates': [
    { word: 'hnub tim', hmong: 'Hnub no yog hnub tim pes tsawg?', english: 'What is the date today?' },
    { word: 'hnub yug', hmong: 'Kuv hnub yug yog hnub tim kaum.', english: 'My birthday is on the tenth.' },
    { word: 'month + hnub tim', hmong: 'Lub ib hlis ntuj hnub tim ob.', english: 'January second.' },
    { word: 'hnub tim', hmong: 'Nws yug hnub tim tsib.', english: 'He was born on the fifth.' },
    { word: 'xyoo', hmong: 'Peb yuav mus xyoo tshiab.', english: 'We will go at the New Year.' },
    { word: 'hnub yug', hmong: 'Koj hnub yug yog thaum twg?', english: 'When is your birthday?' },
    { word: 'hnub tim', hmong: 'Lawv los hnub tim kaum tsib.', english: 'They come on the fifteenth.' },
  ],
  'u-clock': [
    { word: 'teev', hmong: 'Yog pes tsawg teev lawm?', english: 'What time is it?' },
    { word: 'ob teev', hmong: 'Nws los ob teev tsaus ntuj.', english: 'He comes at 2 p.m.' },
    { word: 'kaum teev', hmong: 'Peb sawv kaum teev sawv ntxov.', english: 'We get up at 10 a.m.' },
    { word: 'ib nrab', hmong: 'Lawv noj mov kaum teev ib nrab.', english: 'They eat at half past ten.', was: '"kaum ib nrab" — reads as eleven-half; teev was missing' },
    { word: 'feeb', hmong: 'Koj los kaum feeb tom qab.', english: 'You come ten minutes later.' },
    { word: 'peb teev', hmong: 'Wb mus peb teev tsaus ntuj.', english: 'We two go at 3 p.m.' },
    { word: 'kaum teev', hmong: 'Nej pw kaum teev tsaus ntuj.', english: 'You all go to bed at 10 p.m.', was: '"Nej pw rau teev hmo ntuj" (bed at six)' },
  ],
  'u-daily': [
    { word: 'ntxuav muag', hmong: 'Nws ntxuav muag hauv tsev.', english: 'He washes his face at home.' },
    { word: 'da dej', hmong: 'Peb da dej thaum tsaus ntuj.', english: 'We bathe in the evening.' },
    { word: 'mus ua haujlwm', hmong: 'Lawv mus ua haujlwm hnub no.', english: 'They go to work today.' },
    { word: 'los tsev', hmong: 'Koj los tsev thaum tav su.', english: 'You come home at noon.' },
    { word: 'ua noj', hmong: 'Wb ua noj rau tsev neeg.', english: 'We two cook for the family.' },
    { word: 'pw', hmong: 'Nej pw thaum hmo ntuj.', english: 'You all sleep at night.' },
  ],
  'u-siab': [
    { word: 'zoo siab', hmong: 'Kuv zoo siab heev hnub no.', english: 'I am very happy today.' },
    { word: 'nyuaj siab', hmong: 'Nws nyuaj siab vim tsis muaj nyiaj.', english: 'He is worried because he has no money.' },
    { word: 'chim siab', hmong: 'Peb chim siab rau lawv.', english: 'We are angry at them.' },
    { word: 'siab ntev', hmong: 'Koj siab ntev heev.', english: 'You are very patient.' },
    { word: 'ntshai', hmong: 'Lawv ntshai mus hmo ntuj.', english: 'They are afraid to go out at night.' },
    { word: 'vam', hmong: 'Wb vam tias koj yuav los.', english: 'We two hope that you will come.' },
    { word: 'ntxub', hmong: 'Nej ntxub ua haujlwm ntau.', english: 'You all hate doing a lot of work.' },
  ],
  'u-colors': [
    { word: 'liab', hmong: 'Kuv muaj lub tsho liab.', english: 'I have a red shirt.' },
    { word: 'dub', hmong: 'Nws hnav ris tsho dub.', english: 'He wears black clothes.' },
    { word: 'dawb', hmong: 'Peb pom lub tsev dawb.', english: 'We see the white house.' },
    { word: 'ntsuab', hmong: 'Lawv nyiam lub tsho ntsuab.', english: 'They like the green shirt.' },
    { word: 'daj', hmong: 'Koj muaj daim ntaub daj.', english: 'You have a yellow cloth.' },
    { word: 'xiav', hmong: 'Kuv hnav lub tsho xiav.', english: 'I am wearing a blue shirt.', was: '"Wb hnav lub tsho xiav" (two people, one shirt)' },
    { word: 'liab', hmong: 'Nej pom tus noog liab.', english: 'You all see the red bird.', was: '"tus aub liab" (a red dog)' },
  ],

  // ── How a Sentence Is Built, 2026-09-28 — from the same GPT lesson reply, reviewed.
  'u-sentence-structure': [
    { word: 'subject + verb + object', hmong: 'Kuv noj mov.', english: 'I eat.' },
    { word: 'subject + verb + object', hmong: 'Koj nyeem ntawv.', english: 'You read.' },
    { word: 'noun + describing word', hmong: 'Lub tsev loj.', english: 'The house is big.' },
    { word: 'classifier + noun', hmong: 'Kuv tus aub pw.', english: 'My dog sleeps.' },
    { word: 'time + subject + tau + verb', hmong: 'Naghmo kuv tau mus.', english: 'Yesterday I went.', was: '"Tonight I am going" — naghmo is yesterday; then "Naghmo kuv mus." — went takes tau (author 2026-09-28)' },
    { word: 'time + tense + verb', hmong: 'Tagkis kuv yuav mus.', english: 'Tomorrow I will go.' },
    { word: 'tsis', hmong: 'Kuv tsis noj.', english: 'I don’t eat.' },
    { word: 'question word', hmong: 'Koj noj dab tsi?', english: 'What do you eat?' },
    { word: 'puas', hmong: 'Koj puas noj?', english: 'Do you eat?' },
    { word: 'two verbs', hmong: 'Kuv mus noj mov.', english: 'I go to eat.' },
    { word: 'location', hmong: 'Kuv nyob hauv tsev.', english: 'I am at home.' },
    { word: 'age', hmong: 'Kuv muaj neesnkaum xyoo.', english: 'I am twenty years old.', was: '"nees nkaum" — the app joins the tens' },
    { word: 'full sentence', hmong: 'Naghmo kuv noj mov hauv tsev.', english: 'Yesterday I ate at home.', was: '"Tonight I eat…" — naghmo is yesterday' },
  ],
}
