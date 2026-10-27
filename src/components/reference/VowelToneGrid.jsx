import { useState } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import AudioButton from '../common/AudioButton.jsx'
import { vowelToneAudio } from '../../data/vowelToneAudio.js'
import { useVoicePrefs } from '../../lib/voicePrefs.js'
import ToneAudioNote from './ToneAudioNote.jsx'

// VOWEL × TONE — every vowel written with every tone marker.
//
// ⚠️ WHAT THIS IS, AND WHAT IT IS NOT — 2026-10-14 (author: "let's focus on the
// vowel x tone grid reference").
//
// It is a SPELLING table. Hmong writes the tone as a final consonant letter, so
// `a` + the high marker `b` is `ab`; the grid is that rule applied to all 13
// vowels and all 8 tones. Nothing here is invented: a cell is mechanical
// orthography, the vowels come from reference.js, and the tones come with it.
//
// ⚠️ A CELL IS NOT A CLAIM THAT THE SYLLABLE IS A WORD. `ab` is a legal Hmong
// spelling; whether anyone says it is a different question, and this screen does
// not answer it. The caption says so in the UI, because a learner who reads a
// grid as a vocabulary list will try to use `wd` in a sentence.
//
// ⚠️ IT NEVER PLAYS A SOUND IT DOES NOT HAVE — and as of 2026-10-18 it HAS all of them.
// The author recorded the full matrix (13 × 8 = 104), so a selected cell now plays ITSELF.
//
// What this rule used to force, kept because the rule is the valuable part: there were no
// vowel+tone clips, only a clip per bare vowel and a clip per tone (the `po` series), so
// the vowel column played the VOWEL and a selected cell offered the TONE's own word
// (pob, poj…) clearly labelled as such. Showing 104 dead speakers, or playing `pob`
// while the cell says `ab`, would each have taught something false.
//
// Now: cell → the cell's own clip. The tone's reference word stays in the detail panel
// underneath, because hearing the tone ON A WORD is a different and still-useful thing.
// ⚠️ A cell with no clip falls back to exactly the old behaviour rather than going dead.
export default function VowelToneGrid({ vowels, tones }) {
  // The selected cell, as { vowel, tone }. One at a time: the detail line below
  // the grid is the only place a tone's name and reference clip appear, so two
  // selections would need two of them.
  const [picked, setPicked] = useState(null)

  return (
    <View>
      <Text className="text-sm font-medium text-stone-700 leading-relaxed mb-1">
        Hmong writes the tone as a letter at the END of the syllable. Every vowel
        takes every tone, so one vowel is really eight written forms.
      </Text>
      {/* ⚠️ THE DISCLAIMER IS PART OF THE FEATURE, not boilerplate. See the
          header comment: a grid reads as a word list unless it says otherwise. */}
      <Text className="text-xs font-medium text-stone-600 italic leading-relaxed mb-3">
        These are spellings, not a word list — a real word needs a consonant in
        front of most of them.
      </Text>
      {/* Beside the existing disclaimer: one says what these ARE, the other says what the
          recordings are. Both are things a learner would otherwise get wrong. */}
      <ToneAudioNote className="mb-4" />

      {/* Horizontal scroll: 8 tone columns plus the vowel column will not fit a
          phone, and shrinking the type to make it fit is how a reference table
          becomes unreadable. */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header row — the marker, and the tone's name under it. */}
          <View className="flex-row">
            <View className="w-14" />
            {tones.map((t) => (
              <View key={t.name} className="w-16 items-center pb-2">
                <Text className="font-serif text-lg text-clay-700">
                  {t.marker || '—'}
                </Text>
                {/* The name wraps to two lines at this width, which is why the
                    row is tall enough for it rather than clipping. */}
                <Text className="text-[10px] font-medium text-stone-600 text-center leading-tight mt-0.5">
                  {t.name}
                </Text>
              </View>
            ))}
          </View>

          {vowels.map((v) => (
            <View key={v.letter} className="flex-row items-center">
              {/* Vowel column: the one cell here with a real recording. */}
              <View className="w-14 flex-row items-center gap-1">
                <Text className="font-serif text-lg text-stone-900">{v.letter}</Text>
                <AudioButton audioSrc={v.audio} wordId={`vt-${v.letter}`} />
              </View>

              {tones.map((t) => {
                const syllable = v.letter + t.marker
                const isPicked = picked?.vowel === v.letter && picked?.tone === t.name
                return (
                  <Pressable
                    key={t.name}
                    onPress={() => setPicked(isPicked ? null : { vowel: v.letter, tone: t.name })}
                    accessibilityRole="button"
                    accessibilityLabel={`${syllable}, ${v.letter} with the ${t.name} tone`}
                    accessibilityState={{ selected: isPicked }}
                    // Static classes only — a style FUNCTION is dropped by
                    // NativeWind on native and renders the cell invisible.
                    className={`w-16 h-11 items-center justify-center rounded-md m-0.5 ${
                      isPicked ? 'bg-clay-600' : 'bg-cream-50'
                    }`}
                  >
                    <Text
                      className={`font-serif text-base ${isPicked ? 'text-cream-50' : 'text-stone-900'}`}
                    >
                      {syllable}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {picked ? <PickedDetail picked={picked} tones={tones} /> : (
        <Text className="text-xs font-medium text-stone-600 mt-4">
          Tap any cell to see which tone it carries.
        </Text>
      )}
    </View>
  )
}

/**
 * What a tapped cell explains: the syllable, the tone it carries, and the tone's
 * OWN reference word to hear.
 *
 * ⚠️ THE AUDIO BUTTON IS LABELLED WITH THE TONE'S WORD, NOT THE CELL. Tapping it
 * plays `pob`, so it says `pob`. A button beside `ab` that plays `pob` without
 * saying so teaches the learner that `ab` sounds like `pob`.
 */
function PickedDetail({ picked, tones }) {
  // The voice switch above the grid (2026-10-25) — read here, before the early return.
  const { voice } = useVoicePrefs()
  const tone = tones.find((t) => t.name === picked.tone)
  if (!tone) return null
  const syllable = picked.vowel + tone.marker
  // ⚠️ THE CELL'S OWN CLIP, added 2026-10-18 — see the header. `hero` size because on
  // this panel it is the only thing to do.
  // Was: vowelToneAudio(picked.vowel, tone.marker) — male only, before Emily's set.
  const own = vowelToneAudio(picked.vowel, tone.marker, voice)

  return (
    <View className="rounded-md bg-cream-100 p-4 mt-4">
      <View className="flex-row items-center gap-3 flex-wrap">
        {own ? <AudioButton audioSrc={own} wordId={`vt-${syllable}`} size="xl" /> : null}
        <View className="flex-1">
          <Text className="font-serif text-2xl text-stone-900">{syllable}</Text>
          <Text className="text-sm font-medium text-stone-700">
            {picked.vowel} + {tone.marker ? `“${tone.marker}”` : 'no marker'} — the {tone.name} tone
          </Text>
        </View>
      </View>

      {tone.description ? (
        <Text className="text-sm font-medium text-stone-700 leading-relaxed mt-2">
          {tone.description}
        </Text>
      ) : null}

      {/* ⚠️ COMMENTED OUT 2026-10-20 — the author: "comment out the po- references hear
          the word from tone in the tone+vowel, bc thats not implemented in yet."
          This played `tone.audio` (the po- series: pob, poj, pog…) under the label "Hear
          the High tone on its own word". The RECORDING for that is not in place, so the
          button was offering a word the app cannot say.
          ⚠️ IT IS NOT NEEDED FOR THE PANEL TO WORK: the cell's own clip sits at the top
          of this card (`vowelToneAudio`, wired 2026-10-18) and all 104 exist, so a
          selected cell still speaks. This was the extra — the tone on a real WORD.
          TO RESTORE: uncomment, once the po- clips are recorded and verified to say the
          word rather than the Cim name. The same question is open on /tone/<marker>'s
          "Hear this tone" card, which still plays this clip.
      {tone.example ? (
        <View className="flex-row items-center gap-2 mt-3">
          <AudioButton audioSrc={tone.audio} wordId={`vt-tone-${tone.name}`} size="lg" />
          <View className="flex-1">
            <Text className="text-xs font-medium text-stone-600">
              Hear the {tone.name} tone on its own word
            </Text>
            <Text className="font-serif text-base text-clay-700">{tone.example}</Text>
          </View>
        </View>
      ) : null}
      */}
    </View>
  )
}
