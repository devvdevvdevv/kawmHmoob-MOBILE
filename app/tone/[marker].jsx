import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import AudioButton from '../../src/components/common/AudioButton.jsx'
import { toneBySlug, toneSlug, vowelsForTone, allTones } from '../../src/lib/syllableTable.js'
import { vowelToneAudio } from '../../src/data/vowelToneAudio.js'
import ToneAudioNote from '../../src/components/reference/ToneAudioNote.jsx'
import VoiceToggle from '../../src/components/reference/VoiceToggle.jsx'
import { useVoicePrefs, pickVoice } from '../../src/lib/voicePrefs.js'

// ONE TONE, ON EVERY VOWEL — 2026-10-14 (author: "click the tone… it would link
// to another tabbed page, that would contain the tone specific to that shape
// (b). so ab ib eb wb etc etc, but organized").
//
// Reached from the Tones tab's "See this tone on every vowel →" link.
//
// ⚠️ GROUPED, NOT A LIST OF THIRTEEN. The vowels arrive already split into
// single and double by `vowelGroups` in reference.js, and the split is the
// teaching unit: `ab eb ib ob ub wb` is one pattern, `aib aub awb…` is another.
// A flat run of thirteen hides that.
//
// ⚠️ EVERY SYLLABLE PLAYS, AS OF 2026-10-18. Until then this page's only sound was the
// tone's own reference word at the top, because the vowel+tone matrix — 13 × 8 = 104
// clips — had never been recorded, and the rule was that no syllable gets a speaker
// button it cannot honour. (The bare vowel clips were deliberately not offered either: a
// learner tapping beside `ab` expects `ab`, and hearing `a` is a different lesson.)
//
// The author recorded all 104, so the rule is satisfied rather than bent. The tone's
// reference word stays at the top: it is the tone on a REAL WORD, which is the thing the
// syllables cannot show.
export default function TonePage() {
  const { marker } = useLocalSearchParams()
  const tone = toneBySlug(marker)
  // Before the early return — a hook can't sit behind one.
  const { voice, setVoice } = useVoicePrefs()

  if (!tone) {
    return (
      <TabScreen>
        <Text className="text-stone-900">That tone does not exist.</Text>
        <Link href="/reference?tab=tones" asChild>
          <Text className="text-clay-700 underline mt-4">Back to the tones</Text>
        </Link>
      </TabScreen>
    )
  }

  const groups = vowelsForTone(tone)

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Reference', to: '/reference' },
          { label: 'Tones', to: '/reference?tab=tones' },
          { label: tone.name },
        ]}
      />

      {/* Male / Female for every clip on this page — "Hear this tone" and all 13
          syllables. At the top so it is seen before the first sound (2026-10-25). */}
      <VoiceToggle voice={voice} onChange={setVoice} />

      <View className="mb-6">
        <Eyebrow tone="accent" className="mb-2">Tone</Eyebrow>
        <View className="flex-row items-center gap-3 mb-2">
          <Text className="font-serif text-5xl text-stone-900">{tone.marker || '—'}</Text>
          <View className="flex-1">
            <Text className="font-serif text-2xl text-stone-900">{tone.name}</Text>
            {/* ⚠️ THE CIM NAME MOVED DOWN TO THE AUDIO CARD — 2026-10-18. It used to sit
                here as a subtitle, and the card below now carries it (the author asked for
                the Cim name beside the sound rather than the po- word). Showing it in both
                places put the same two words twice within an inch.
                TO RESTORE this subtitle, uncomment — but then take it off the card, or the
                duplication comes back.
            {tone.example2 ? (
              <Text className="text-sm font-medium text-stone-600">{tone.example2}</Text>
            ) : null}
            */}
          </View>
        </View>

        {tone.description ? (
          <Text className="text-base font-medium text-stone-700 leading-relaxed">
            {tone.description}
          </Text>
        ) : null}

        {/* ⚠️ THE CARD NAMES THE TONE, NOT A WORD — 2026-10-18, the author: "replace this
            with the 'Cim (tone)' … not with po-".
            Was: {tone.example} — "pog (grandma)", the po- series. The Hmong NAME of the
            tone (`example2`: Cim Siab, Cim Ntuj, Cim Neeg…) is what a learner should read
            beside its sound; the po- word is a demonstration of the tone, not its name.
            ⚠️ THAT OPEN QUESTION IS ANSWERED — 2026-10-20. This comment used to warn that
            if `tone.audio` says the po- word, the Cim label disagrees with what plays. The
            author then asked for the po- references to be removed from the vowel+tone
            screens "bc thats not implemented in yet" — i.e. THERE ARE NO po- WORD
            RECORDINGS. These clips are the Cim names, which is why the label change was
            asked for in the first place. Card and clip agree. */}
        {tone.example2 ? (
          <View className="flex-row items-center gap-3 mt-4 rounded-md bg-cream-50 p-4">
            {/* Was: audioSrc={tone.audio} — male only, before Emily's Cim names (2026-10-25). */}
            <AudioButton audioSrc={pickVoice(tone, voice)} wordId={`tone-${toneSlug(tone)}`} size="xl" />
            <View className="flex-1">
              <Text className="text-xs font-medium text-stone-600">Hear this tone</Text>
              <Text className="font-serif text-2xl text-clay-700">{tone.example2}</Text>
            </View>
          </View>
        ) : null}

        {/* Directly under the clip it describes: this page's whole subject is one tone's
            sound, so the flag belongs with the sound rather than at the top of the page. */}
        <ToneAudioNote className="mt-3" />
      </View>

      <Text className="font-serif text-2xl text-stone-900 mb-1">
        {tone.marker ? `Every vowel with “${tone.marker}”` : 'Every vowel with no marker'}
      </Text>
      {/* The same disclaimer the grid carries, for the same reason: a table of
          syllables reads as a word list unless it says it is not one. */}
      <Text className="text-xs font-medium text-stone-600 italic leading-relaxed mb-4">
        Spellings, not words — most need a consonant in front to become one.
      </Text>
      {/* ⚠️ MOVED TO THE TOP OF THE PAGE — 2026-10-25, the author asked for the switch on
          "the tone pages … tone b high". Here it sat BELOW "Hear this tone", so the first
          clip on the page played before the learner ever saw the control.
          TO RESTORE it here, uncomment and remove the one under the Breadcrumbs.
      <VoiceToggle voice={voice} onChange={setVoice} />
      */}

      <View className="gap-6">
        {groups.map((g) => (
          <View key={g.id}>
            <Eyebrow className="mb-2">{g.title}</Eyebrow>
            {/* ⚠️ EVERY CELL PLAYS NOW — 2026-10-18. The whole 13 × 8 matrix was recorded,
                so the clips this page's header used to call "104 clips that do not exist"
                exist. This is the page where that matters most: all 13 vowels carrying
                ONE tone, side by side, is the only place a learner (or the author) can
                hear a single tone's shape held steady across every vowel — and the only
                place a mis-recorded clip in that set stands out by ear.
                Was: a plain <View> per form, with the note that the only sound on the
                page was the tone's reference word at the top. */}
            <View className="flex-row flex-wrap gap-2">
              {g.forms.map((f) => {
                const clip = vowelToneAudio(f.vowel, tone.marker, voice)
                return (
                  <View key={f.syllable} className="rounded-md bg-cream-50 px-4 py-3 items-center min-w-[72px]">
                    <Text className="font-serif text-xl text-stone-900">{f.syllable}</Text>
                    {/* The vowel it is built on, so the pattern is readable as
                        "this vowel, carrying this tone" rather than a new letter. */}
                    <Text className="text-[10px] font-medium text-stone-500 mt-0.5">
                      {f.vowel}{tone.marker ? ` + ${tone.marker}` : ''}
                    </Text>
                    {/* No clip → no button, never a disabled one: 104 dead speakers was
                        the reason this page had none at all. */}
                    {clip ? (
                      <View className="mt-1.5">
                        <AudioButton audioSrc={clip} wordId={`vt-${f.syllable}`} />
                      </View>
                    ) : null}
                  </View>
                )
              })}
            </View>
          </View>
        ))}
      </View>

      {/* ── ⚠️ ALL EIGHT, WITH THIS ONE MARKED — reworked 2026-10-14 ───────────
          It listed the other seven and hid the current one, which threw away the
          most useful thing a set of eight can show: WHERE YOU ARE IN IT. Eight
          tones is a closed set a learner is trying to memorise, so the page now
          shows the whole set with this tone held in place and the rest
          tappable — the same reason a stepper disables its ends instead of
          hiding them.

          Each row also carries the tone's own example word, which was sitting
          unused in reference.js: "j · High-falling · poj" teaches the contrast
          that "j · High-falling" alone does not. */}
      <Text className="font-serif text-xl text-stone-900 mt-8 mb-1">All eight tones</Text>
      <Text className="text-xs font-medium text-stone-600 mb-3">
        The same syllable, once per tone — tap any to see it on every vowel.
      </Text>

      <View className="gap-2">
        {allTones().map((t) => {
          const isCurrent = t.name === tone.name
          const row = (
            <View
              className={`rounded-md flex-row items-center gap-4 p-4 ${
                isCurrent ? 'bg-clay-600' : 'bg-cream-50'
              }`}
            >
              <Text
                className={`font-serif text-2xl w-8 text-center ${
                  isCurrent ? 'text-cream-50' : 'text-clay-700'
                }`}
              >
                {t.marker || '—'}
              </Text>

              <View className="flex-1">
                <Text
                  className={`font-serif text-base ${isCurrent ? 'text-cream-50' : 'text-stone-900'}`}
                >
                  {t.name}
                </Text>
                {t.example ? (
                  <Text
                    className={`text-xs font-medium mt-0.5 ${
                      isCurrent ? 'text-cream-100' : 'text-stone-600'
                    }`}
                  >
                    as in {t.example}
                  </Text>
                ) : null}
              </View>

              {isCurrent ? (
                <Text className="text-[10px] font-semibold uppercase tracking-wider text-cream-100">
                  You are here
                </Text>
              ) : (
                <Icon name="arrowRight" size={18} tone="accent" />
              )}
            </View>
          )

          // The current tone is not a link — tapping it would reload the page
          // you are on, which reads as a dead button.
          if (isCurrent) return <View key={t.name}>{row}</View>
          return (
            <Link key={t.name} href={`/tone/${toneSlug(t)}`} asChild>
              <Pressable className="active:opacity-80">{row}</Pressable>
            </Link>
          )
        })}
      </View>
    </TabScreen>
  )
}
