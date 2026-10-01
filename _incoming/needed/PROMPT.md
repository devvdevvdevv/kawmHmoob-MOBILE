You are writing beginner example sentences for a White Hmong (Hmoob Dawb)
learning app, in Hmong RPA spelling.

For EACH row in the JSON below, fill in "hmong" and "english":
- "hmong": ONE short, natural sentence (4–8 words) that uses the row's "word"
  EXACTLY as spelled — same spacing, same letters. Use it in the sense given by
  "gloss". Simple, everyday, the kind of thing a beginner would actually say.
- "english": a natural translation of that sentence.
Return the SAME JSON array with only those two fields filled. Do not change
"id", "word" or any other field. Do not add or drop rows.

Hard rules — each one has already caused a wrong sentence in this app:
1. Negative commands are "tsis txhob …", NEVER "txhob tsis".
2. Age uses muaj: "Kuv muaj 20 xyoos." Never drop muaj, even in a list.
3. Roads take txoj kev ("txoj kev Webster Avenue"); cities take "lub nroog";
   states take "xeev" with no lub.
4. A classifier (tus, lub, daim, rab, txoj…) comes before a specific or counted
   noun: "ib tus aub", "lub tsev no".
5. Adjectives follow the noun with NO "yog": "Tus poj niam zoo siab." — not
   "…yog zoo siab". Use "yog" only to equate two nouns.
6. "kuv txiv" is my father; "kuv tus txiv" is my HUSBAND. Keep family terms
   consistent with the English.
7. Write these solid, never spaced: tiamsis, lossis, neesnkaum. Write "li cas"
   and "teb chaws" spaced.
8. "mov" means food in general, not only rice.
9. No English words inside the Hmong sentence.
10. White Hmong spelling throughout: the classifier is "tus", not "tug", and
    dog is "aub", never "dev". Follow
    the spelling the row's "word" uses, and do not mix dialects in one sentence.
11. If you are not sure a sentence is natural Hmong, leave "hmong" as "" rather
    than guess. An empty row is fine. A confident wrong one is not.

Examples of the style wanted (written by a speaker):
- tus: "Kuv muaj ib tus aub." — "I have one dog."
- lub: "Ib lub tsev." — "One house."
- phau: "Ib phau ntawv." — "One book."
- ib: "Ib tus aub." — "One dog."
- ob: "Ob tus miv." — "Two cats."
- peb: "Peb tus menyuam." — "Three children."
- nyeem: "Kuv nyeem ntawv." — "I read."
- sau: "Kuv sau ntawv." — "I write."
- kawm: "Kuv kawm lus Hmoob." — "I study Hmong."
- loj: "Tsev no loj." — "This house is big."
- me: "Me nyuam no me." — "This child is small."
- ntau: "Dej ntau." — "There is a lot of water."
- tij laug: "Kuv tus tij laug." — "My older brother."
- kwv: "Kuv tus kwv." — "My younger brother."
- muam: "Kuv tus muam." — "My sister."
