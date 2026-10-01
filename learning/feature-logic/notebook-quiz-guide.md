# Build it yourself: a quiz from the words in your notebook

*A learn-by-doing guide. You write the code; this tells you where it goes, why,
and what will bite you. Written 2026-09-25.*

**The goal:** a learner saves words to their notebook, then taps **Quiz me** and
gets a multiple-choice quiz made **only from those words**, using the same quiz
screen, scoring and audio as every other quiz.

Read `quiz-engine-explained.md` (same folder) first if you haven't. This guide
assumes you know what `getQuizConfig`, `getQuizDataset` and `buildQuestions` do.

---

## 1. The one idea that makes this interesting

Every quiz today is found **by id, from fixed data**:

```
/quiz/vocab-animals  →  getQuizConfig('vocab-animals')   →  the Animals config
                     →  getQuizDataset('vocab-animals')  →  the Animals words
```

`src/data/quizzes.js` can build those from `vocabulary.js` alone, because they
are **the same for everyone**. Path quizzes (`path-u-verbs`) are built on demand
the same way.

**A notebook quiz is different: the words belong to one person.** They live in
`NotebookContext` (`savedWords` = `{ [wordId]: { note, savedAt } }`), loaded
from device storage per user. `quizzes.js` can't see them. It's a plain data
file, and check scripts load it in plain Node, so it must never import a React
context.

So the whole design question is: **how do the saved word ids get from the
notebook into `getQuizDataset`?**

### Three ways to do it. Pick one before you write any code.

| option | how | good | bad |
|---|---|---|---|
| **A. Put the ids in the URL** | `/quiz/notebook?ids=animals-dog,verbs-eat,…` | stateless; the quiz works from a link | 25 ids is a long URL; the ids can go stale |
| **B. The engine reads the context** | in `QuizEngine`, `if (topicId === 'notebook') words = useNotebook().savedWords` | simple | special-case code inside the engine; hooks order is easy to break |
| **C. Pass the words INTO the data function** | `getQuizDataset('notebook', { savedIds })`: the engine hands the ids in | `quizzes.js` stays pure and Node-testable; one small seam | you add one parameter |

**Recommendation: C.** It is the same move the path made
(`defineToken({ …, story })` takes its data as an argument instead of reaching
for it). The data file stays a data file; the screen supplies the user's part.

---

## 2. Build it, step by step

### Step 1: the config (`src/data/quizzes.js`)

Next to `pathQuizConfig`, add a `notebookQuizConfig(id)` that returns a config
**only** for the id `'notebook'`, and chain it into `getQuizConfig`:

```js
export function getQuizConfig(id) {
  return quizzes.find((q) => q.id === id) || pathQuizConfig(id) || notebookQuizConfig(id)
}
```

Things to decide in the config:
- `questionTypes: ['multiple-choice']` and `reversible: true`, like a vocab quiz.
- **`tier`:** saving words is Pro (`WordDetail.jsx`, `WordSheet.jsx`), so a free
  learner's notebook is normally empty. Setting `tier: 'pro'` states that
  honestly, and QuizEngine's `PaywallGate` enforces it for free.
- **Keep it out of the `quizzes` list**, the way path quizzes are. That list
  feeds the Vocabulary page's quiz counts and Drills section, and a notebook
  quiz is neither.

### Step 2: the dataset (`src/data/quizzes.js`)

Give `getQuizDataset` a second, optional argument, and a branch:

```js
export function getQuizDataset(id, { savedIds = [] } = {}) {
  if (id === 'notebook') {
    // 1. build a word-by-id map from `categories` (the notebook screen already
    //    does exactly this — app/notebook/[tab].jsx, `wordById`)
    // 2. map savedIds → words, and DROP ids that no longer resolve
    // 3. return the same item shape a vocab quiz uses:
    //    { id: w.id, prompt: w.hmongRPA, answer: w.english, audio: w.audioFile }
  }
  // …existing branches unchanged
}
```

**Why drop unresolved ids:** a saved id can outlive its word (a word renamed or
removed from vocabulary.js). The notebook screen already filters these for the
same reason. Look at the comment above its `deck`.

**Why that exact item shape:** `buildQuestions`, the Direction setting
(`orientDataset`), the status filter and the new quiz audio all read `id`,
`prompt`, `answer` and `audio`. Match it and you get all four for free.

### Step 3: hand the ids in (`src/components/quiz/QuizEngine.jsx`)

Find where the dataset is built (`const raw = getQuizDataset(topicId)`) and pass
the notebook's ids:

```js
const { savedWords } = useNotebook()
const savedIds = useMemo(() => Object.keys(savedWords), [savedWords])
// …inside the dataset useMemo:
const raw = getQuizDataset(topicId, { savedIds })
```

⚠️ **Two traps here:**
- **Hooks order.** Call `useNotebook()` at the top of the component with the
  other hooks, **unconditionally**. Don't call it only when
  `topicId === 'notebook'`, or React breaks when the route changes.
- **The useMemo dependency list.** Add `savedIds`. Otherwise unsaving a word
  and coming back shows a quiz with the old words.

### Step 4: the status filter (optional, same file)

`statusOf` only turns on for ids that start with `'vocab-'`. Notebook items carry
the word's `id` too, so let it work for `'notebook'` as well. Then "only words
I'm still Learning" works on the notebook quiz.

### Step 5: the button (`app/notebook/[tab].jsx`)

Two places, both in `SavedWords`:
1. **In list mode**, next to "Study", add **Quiz me** →
   `router.push('/quiz/notebook')`.
2. **At the end of the flashcard deck**, the comment says *"minus the quiz link
   at the end — a notebook quiz doesn't exist yet."* That slot is waiting for
   you. Replace the restart-only control with a "Quiz me" option there too, and
   update the comment.

### Step 6: getting back

QuizEngine works out a "back" target and label from the id (a path quiz goes back
to its unit, a vocab quiz to its words). Add the notebook case, so it goes back
to `/notebook/saved` with the label "Back to your notebook". Search QuizEngine
for `backTo`.

---

## 3. The part that needs thought: too few words, and easy distractors

Think these through before you call it done. They're the real design work.

**Too few words.** A multiple-choice question needs **4 distinct answers**.
`buildQuestions` takes its wrong answers from the **same dataset**, so a
3-word notebook can only offer 2 wrong options. Choose one:
- **Require at least 4 saved words.** Hide or disable "Quiz me" below that, and
  say "Save N more words to unlock your quiz". This is the simplest fix.
- **Pad the distractors.** Add a small `distractors` list to the config: extra
  English glosses from the saved words' own categories, used for wrong answers
  only, never asked. Then `buildQuestions` needs to read it. That's more work,
  and more to test.

**Too-easy distractors.** A notebook mixes categories. "dog" asked with the
options *because / red / Tuesday* is guessable without knowing Hmong. It's a
better quiz if wrong answers come from the **same category** as the right one
when possible. It's optional, but it's the difference between a quiz and a
formality.

**Best score means little here.** `recordQuizScore` saves a best score per quiz
id. The notebook's words change, so "best 90%" on last week's words says little
about today's. Consider not showing "best" for `'notebook'`, or keying it on
something that changes when the words do. Either way, decide on purpose.

---

## 4. Test checklist

- [ ] 0 saved words: "Quiz me" is hidden, or explains why.
- [ ] 3 saved words: you get your chosen behaviour (locked, or padded).
- [ ] 10 saved words: every question is one of *your* words, and all 10 appear.
- [ ] Unsave a word, go back to the quiz: it's gone (the dependency-list trap).
- [ ] Direction set to English → Hmong: questions flip, and the audio waits
      until you answer (the quiz-audio rule).
- [ ] A word with audio plays it; one without shows the greyed speaker.
- [ ] Free account at `/quiz/notebook` by URL: the paywall appears (`tier`).
- [ ] "Back" lands on the notebook.
- [ ] Run `check-undefined-refs`, lint the three files, and load `quizzes.js`
      in plain Node (it must still have no React imports).

---

## 5. Exercises (do these after it works)

1. Why is option C safer than option B for the check scripts? What would break
   if `quizzes.js` imported `NotebookContext.jsx`?
2. The notebook caps at 25 words (`NOTEBOOK_WORD_LIMIT`). Why does a *small*
   cap help a quiz built from it? (Read the comment above the constant.)
3. Add same-category distractors. Where does the category come from on a
   dataset item, and what do you do when a category has fewer than 4 saved
   words?
4. Stretch: a "review my mistakes" mode, which quizzes only the saved words you
   got wrong last time. What would you need to store, and where?
