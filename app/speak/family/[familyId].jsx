import { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Link, Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import TabScreen from '../../../src/components/TabScreen.jsx'
import { SPEAK_ENABLED } from '../../../src/lib/launch.js'
import Breadcrumbs from '../../../src/components/common/Breadcrumbs.jsx'
import Button from '../../../src/components/ui/Button.jsx'
import Icon from '../../../src/components/ui/Icon.jsx'
import PronounceStep from '../../../src/components/speak/PronounceStep.jsx'
import { getWordFamily } from '../../../src/data/wordFamilies.js'
import { useProgress } from '../../../src/hooks/useProgress.js'
import { useAudio } from '../../../src/hooks/useAudio.js'
import { useVoicePrefs, pickVoice } from '../../../src/lib/voicePrefs.js'
import Eyebrow from '../../../src/components/ui/Eyebrow.jsx'

// ⚠️ REDESIGNED 2026-09-28 (author: "make the word families for the alphabet ui better and not super
// basic like that, the chooser should be interactive for the user to firmly understand"). The
// alphabet is free (author). Was: one letter at a time with ← / → buttons only — the previous screen
// is kept below as SpeakFamilyBefore.
//
// Now, top to bottom:
//   · progress — how many of the family you have practised
//   · THE CHOOSER — every letter as a tile. Tap: it becomes the letter you are on AND you hear it.
//     Practised tiles are green, the current one is filled clay, so the whole family is visible
//     at once and you can jump anywhere.
//   · THE LETTER CARD — the letter large, split into its pieces for a multi-letter sound
//     (N + t = one sound), the family's rule, its sound note and example word when there is one,
//     and "Hear it again".
//   · the recorder (PronounceStep), unchanged
//   · "Next one you haven't practised" — so a learner never has to hunt for what is left.
//
// ⚠️ Static className strings only (no function `style` on a Pressable — renders invisible on
// native in this app). State picks between whole strings.
export default function SpeakFamily() {
  if (!SPEAK_ENABLED) return <Redirect href="/speak" />   // v1: Speak coming soon
  const { familyId } = useLocalSearchParams()
  const router = useRouter()
  const family = getWordFamily(familyId)
  const { completedSteps, markStepComplete } = useProgress()
  const { play, playing } = useAudio()
  // Male / Female, 2026-10-25 — the tiles and the letter card follow the same voice
  // PronounceStep plays and scores against.
  const { voice } = useVoicePrefs()
  const [index, setIndex] = useState(0)

  if (!family) {
    return (
      <TabScreen>
        <Text className="text-stone-900 mb-4">Word family not found.</Text>
        <Button onPress={() => router.push('/speak')}>Back to Speak</Button>
      </TabScreen>
    )
  }

  const words = family.words
  const word = words[index]
  const done = completedSteps.includes(word.id)
  const practiced = words.filter((w) => completedSteps.includes(w.id)).length
  const allDone = practiced === words.length

  const phrase = {
    id: word.id,
    hmong: word.hmong,
    english: word.english,
    audio: word.audio,
    audioFemale: word.audioFemale,
    tip: word.vowel
      ? `${word.consonant} + ${word.vowel} + ${word.tone || '(no tone)'}`
      : family.pattern,
  }

  // Tap a tile: move there and hear it — the two things a learner wants from a letter.
  const choose = (i) => {
    setIndex(i)
    const w = words[i]
    const src = pickVoice(w, voice)
    if (src) play(src, w.id)
  }

  // ⚠️ COMMENTED OUT WITH THE BUTTON IT FED — 2026-10-15. These three lines
  // existed only for the "Next one you haven't practised" button, which the
  // arrows replaced; leaving them computing on every render would be work
  // nothing reads. Restore them together.
  //
  // ⚠️ `handleDone` BELOW DOES NOT USE THEM. It finds its own next-unpractised
  // letter after a recording, so advancing on success still works with these
  // gone. (An earlier version of this comment claimed handleDone depended on
  // them; it does not, and lint caught it.)
  //
  // // The next letter not yet practised, looking forward first, then from the start.
  // const after = words.findIndex((w, i) => i > index && !completedSteps.includes(w.id))
  // const before = words.findIndex((w, i) => i < index && !completedSteps.includes(w.id))
  // const nextOpen = after >= 0 ? after : before

  const handleDone = () => {
    if (!done) markStepComplete(word.id)
    // Move on to the next one still to do; if none are left, stay — the banner says so.
    const next = words.findIndex((w, i) => i !== index && !completedSteps.includes(w.id))
    if (next >= 0) choose(next)
  }

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Speak', to: '/speak' },
          { label: family.title },
        ]}
      />

      <View className="mb-5">
        <Eyebrow dot className="mb-2">Word family</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-2">{family.title}</Text>
        <Text className="text-stone-700 leading-relaxed">{family.description}</Text>
      </View>

      {/* Progress through the family */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-semibold text-stone-800">{practiced} of {words.length} practised</Text>
        {allDone && <Text className="text-sm font-semibold text-emerald-700">✓ All done</Text>}
      </View>
      <View className="h-2 rounded-full bg-cream-200 overflow-hidden mb-5">
        <View className="h-full bg-clay-600" style={{ width: `${(practiced / words.length) * 100}%` }} />
      </View>

      {allDone && (
        <View className="rounded-md bg-emerald-100 px-4 py-3 mb-5">
          <Text className="text-sm font-semibold text-emerald-800">
            You have practised every letter in this family. Tap any tile to go over one again.
          </Text>
        </View>
      )}

      {/* THE CHOOSER */}
      <Text className="font-serif text-xl text-stone-900">Pick a letter</Text>
      <Text className="text-sm font-medium text-stone-600 mb-3">Tap one to hear it. Green ones are practised.</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {words.map((w, i) => {
          const isCurrent = i === index
          const isDone = completedSteps.includes(w.id)
          const tile = isCurrent
            ? 'min-w-[60px] items-center rounded-md px-3 py-3 bg-clay-600 active:opacity-80'
            : isDone
              ? 'min-w-[60px] items-center rounded-md px-3 py-3 bg-emerald-100 active:opacity-80'
              : 'min-w-[60px] items-center rounded-md px-3 py-3 bg-cream-50 active:bg-cream-100'
          const label = isCurrent
            ? 'font-serif text-xl text-cream-50'
            : isDone
              ? 'font-serif text-xl text-emerald-800'
              : 'font-serif text-xl text-stone-900'
          return (
            <Pressable key={w.id} onPress={() => choose(i)} className={tile} accessibilityRole="button" accessibilityLabel={`Letter ${w.hmong}`}>
              <Text className={label}>{w.hmong}</Text>
              {isDone && !isCurrent && <Text className="text-[10px] font-semibold text-emerald-700">✓</Text>}
              {playing === w.id && <Text className={isCurrent ? 'text-[10px] font-semibold text-cream-50' : 'text-[10px] font-semibold text-clay-700'}>♪</Text>}
            </Pressable>
          )
        })}
      </View>

      {/* THE LETTER CARD */}
      <LetterCard family={family} word={word} onHear={() => pickVoice(word, voice) && play(pickVoice(word, voice), word.id)} hearing={playing === word.id} />

      {/* Record yourself */}
      <View className="rounded-md bg-cream-50 shadow-warm p-6 mt-4">
        <PronounceStep key={word.id} phrase={phrase} done={done} onDone={handleDone} />
      </View>

      <View className="mt-6 gap-3">
        {/* ⚠️ REPLACED BY THE ARROWS BELOW — 2026-10-15 (author: "replace the
            Next one you haven't practised: h, comment it out, and replace it
            with the left / right arrow buttons").
            Commented, not deleted. Restoring it means uncommenting BOTH this and
            the `nextOpen` block near the top of the component — they were one
            feature. Finishing a recording still advances to the next
            unpractised letter either way: `handleDone` works that out itself.
        {nextOpen >= 0 && nextOpen !== index && (
          <Button onPress={() => choose(nextOpen)}>{`Next one you haven't practised: ${words[nextOpen].hmong}`}</Button>
        )} */}

        {/* ── Prev / next through the family, in the order it is taught ───────
            The old button jumped to the next UNPRACTISED letter, which meant
            the destination moved as you worked and going BACK to one you had
            already done was only possible from the tile grid. Arrows walk the
            list in order, both ways, so the letter you want is at most a few
            taps away and never in a surprising place.

            ⚠️ THE ENDS DISABLE RATHER THAN WRAP — the same rule as the text-size
            stepper: wrapping from the last letter to the first turns "one more
            tap" into a silent jump across the whole family, which reads as a
            bug. The tile grid above is how you leap. */}
        <View className="flex-row items-center gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            disabled={index === 0}
            onPress={() => choose(index - 1)}
          >
            {`←  ${index > 0 ? words[index - 1].hmong : ''}`}
          </Button>

          {/* Where you are in the family. Without it the arrows are two buttons
              with no sense of a list behind them. */}
          <Text className="text-xs font-medium text-stone-600 w-16 text-center">
            {index + 1} of {words.length}
          </Text>

          <Button
            variant="secondary"
            className="flex-1"
            disabled={index === words.length - 1}
            onPress={() => choose(index + 1)}
          >
            {`${index < words.length - 1 ? words[index + 1].hmong : ''}  →`}
          </Button>
        </View>

        <Button variant="secondary" onPress={() => router.push('/speak')}>Back to Speak</Button>
      </View>
    </TabScreen>
  )
}

// The letter, taken apart. A multi-letter sound is shown piece by piece (N + t) and then as ONE
// sound, because that is the thing a learner coming from English gets wrong: "nt" is not two sounds.
function LetterCard({ family, word, onHear, hearing }) {
  const pieces = String(word.hmong).split('')
  const multi = pieces.length > 1
  const kindWord = family.kind === 'vowel' ? 'vowel sound' : 'sound'
  return (
    <View className="rounded-md bg-cream-50 p-5">
      <Text className="text-xs font-semibold uppercase tracking-widest text-clay-700 mb-2">This letter</Text>
      <View className="flex-row items-center justify-between gap-4">
        <Text className="font-serif text-6xl text-stone-900">{word.hmong}</Text>
        {!!word.audio && (
          <Pressable onPress={onHear} className="flex-row items-center gap-2 rounded-full bg-clay-600/15 px-4 py-2 active:opacity-80" accessibilityRole="button">
            <Icon name="music" size={18} tone="accent" />
            <Text className="text-sm font-semibold text-clay-700">{hearing ? 'Playing…' : 'Hear it again'}</Text>
          </Pressable>
        )}
      </View>

      {multi && (
        <View className="mt-4">
          <View className="flex-row flex-wrap items-center gap-2">
            {pieces.map((p, i) => (
              <View key={`${p}-${i}`} className="flex-row items-center gap-2">
                {i > 0 && <Text className="text-lg font-semibold text-stone-500">+</Text>}
                <View className="rounded-md bg-cream-200 px-3 py-1.5">
                  <Text className="font-serif text-xl text-stone-900">{p}</Text>
                </View>
              </View>
            ))}
            <Text className="text-lg font-semibold text-stone-500">=</Text>
            <View className="rounded-md bg-clay-600 px-3 py-1.5">
              <Text className="text-sm font-semibold text-cream-50">one {kindWord}</Text>
            </View>
          </View>
          <Text className="text-sm font-medium text-stone-600 mt-2">
            {pieces.length} letters, said together as a single {kindWord} — not {pieces.length} separate ones.
          </Text>
        </View>
      )}

      {!!family.pattern && (
        <Text className="text-sm font-medium text-stone-700 mt-4">{family.pattern}</Text>
      )}
      {!!word.english && (
        <Text className="text-sm font-medium text-stone-600 mt-1">Sounds like: {word.english}</Text>
      )}
      {!!word.example && (
        <Text className="text-sm font-semibold text-clay-700 mt-1">Example: {word.example}</Text>
      )}
    </View>
  )
}

// ── THE PREVIOUS SCREEN (until 2026-09-28), kept for reference ────────────────
// Word-family practice — steps through the family one letter at a time and hands each to
// PronounceStep, the same loop as phrase practice. Progress uses the WORD id as the key.
// TO RESTORE: export this as default instead of SpeakFamily.
// eslint-disable-next-line no-unused-vars
function SpeakFamilyBefore() {
  const { familyId } = useLocalSearchParams()
  const router = useRouter()
  const family = getWordFamily(familyId)
  const { completedSteps, markStepComplete } = useProgress()
  const [index, setIndex] = useState(0)
  if (!family) return null
  const words = family.words
  const word = words[index]
  const done = completedSteps.includes(word.id)
  const practiced = words.filter((w) => completedSteps.includes(w.id)).length
  const phrase = {
    id: word.id, hmong: word.hmong, english: word.english, audio: word.audio,
    tip: word.vowel ? `${word.consonant} + ${word.vowel} + ${word.tone || '(no tone)'}` : family.pattern,
  }
  const handleDone = () => {
    if (!done) markStepComplete(word.id)
    if (index < words.length - 1) setIndex(index + 1)
    else router.push('/speak')
  }
  return (
    <TabScreen>
      <View className="mb-6">
        <Eyebrow dot className="mb-2">Word family</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-2">{family.title}</Text>
        <Text className="text-stone-700 leading-relaxed">{family.description}</Text>
      </View>
      <Text className="text-sm font-medium text-stone-700">{index + 1} of {words.length} · ✓ {practiced} practiced</Text>
      <View className="rounded-md bg-cream-50 shadow-warm p-6">
        <PronounceStep key={word.id} phrase={phrase} done={done} onDone={handleDone} />
      </View>
      <View className="mt-6 flex-row justify-between items-center gap-3">
        {index > 0 && <Button variant="secondary" className="flex-1" onPress={() => setIndex(index - 1)}>{`← ${words[index - 1].hmong}`}</Button>}
        {index < words.length - 1 && <Button variant="secondary" className="flex-1" onPress={() => setIndex(index + 1)}>{`${words[index + 1].hmong} →`}</Button>}
      </View>
      <Link href="/speak" asChild><Button variant="secondary">← Speak</Button></Link>
    </TabScreen>
  )
}
