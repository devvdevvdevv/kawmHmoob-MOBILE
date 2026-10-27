import { View, Text, Pressable } from 'react-native'
import { Link, useLocalSearchParams } from 'expo-router'
import TabScreen from '../../src/components/TabScreen.jsx'
import Breadcrumbs from '../../src/components/common/Breadcrumbs.jsx'
import Eyebrow from '../../src/components/ui/Eyebrow.jsx'
import Icon from '../../src/components/ui/Icon.jsx'
import AudioButton from '../../src/components/common/AudioButton.jsx'
import { vowelByLetter, tonesForVowel, toneSlug, allVowels } from '../../src/lib/syllableTable.js'
import { vowelToneAudio } from '../../src/data/vowelToneAudio.js'
import ToneAudioNote from '../../src/components/reference/ToneAudioNote.jsx'
import VoiceToggle from '../../src/components/reference/VoiceToggle.jsx'
import { useVoicePrefs, pickVoice } from '../../src/lib/voicePrefs.js'

// ONE VOWEL, IN ALL EIGHT TONES — 2026-10-14 (author: "for vowels, a similar
// logic would apply, each vowel would get their own page, containing everything
// for that vowel. So example 'a': ab aj am etc").
//
// The mirror of app/tone/[marker].jsx. Same data, the other axis.
//
// ⚠️ EACH ROW CARRIES THE TONE'S NAME AND ITS REFERENCE WORD, because the
// syllable alone teaches nothing: `ad` is only useful once you know it is the
// low-rising tone and can hear that tone on a word somebody says.
//
// ⚠️ THE ROWS PLAY THE REAL SYLLABLE NOW — 2026-10-18. The author recorded the whole
// 13 × 8 matrix, so the 104 clips this file used to say "do not exist" exist. Each row's
// button plays THAT ROW (`ad`), not the tone's reference word.
//
// The rule it used to obey is still the right rule, and it is why this matters: before,
// the button played the tone's own word (`pod`) and the row had to SAY so, because a
// button beside `ad` that silently plays `pod` teaches that `ad` sounds like `pod`. The
// honest workaround is gone because the honest recording arrived.
// Was: <AudioButton audioSrc={r.audio} …/>  (r.audio is the TONE's word clip)
//
// ⚠️ IF A SYLLABLE CLIP IS EVER MISSING the row falls back to the tone's word AND keeps
// the old label, rather than rendering a dead button — see `clipFor()` below.
/**
 * The clip a row should play: the real syllable, or nothing.
 *
 * ⚠️ IT USED TO FALL BACK to the tone's own reference word, which is what let a
 * half-recorded matrix ship. That fallback is gone (2026-10-20) because the thing it fell
 * back TO does not exist — there are no po- word recordings. Coverage is 104/104
 * (`node scripts/generate-vowel-tone-audio.mjs` reports it), so a null here means a clip
 * genuinely went missing, and the row showing no button is the honest outcome.
 */
function clipFor(vowel, row, voice) {
  // ⚠️ THE po- FALLBACK IS GONE — 2026-10-20, the author: "comment out the po- references
  // … bc thats not implemented in yet." It used to fall back to the TONE's own word clip
  // (pob, poj, pog…) when a syllable clip was missing. Those recordings are not in place,
  // so the fallback could only offer a sound the app does not have.
  // The matrix is complete (104/104 as of 2026-10-18), so there is nothing to fall back
  // FROM: a null here now means a genuinely missing clip and the row shows no button,
  // which is the honest outcome.
  // Was: return vowelToneAudio(vowel.letter, row.marker) || (row.example ? row.audio : null)
  // `voice` added 2026-10-25 (Emily's single vowels); a vowel she hasn't recorded plays male.
  return vowelToneAudio(vowel.letter, row.marker, voice)
}

export default function VowelPage() {
  const { letter } = useLocalSearchParams()
  const vowel = vowelByLetter(letter)
  // Before the early return — a hook can't sit behind one.
  const { voice, setVoice } = useVoicePrefs()

  if (!vowel) {
    return (
      <TabScreen>
        <Text className="text-stone-900">That vowel does not exist.</Text>
        <Link href="/reference?tab=vowels" asChild>
          <Text className="text-clay-700 underline mt-4">Back to the vowels</Text>
        </Link>
      </TabScreen>
    )
  }

  const rows = tonesForVowel(vowel)
  const others = allVowels().filter((v) => v.letter !== vowel.letter)

  return (
    <TabScreen>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Reference', to: '/reference' },
          { label: 'Vowels', to: '/reference?tab=vowels' },
          { label: vowel.letter },
        ]}
      />

      {/* Male / Female for every clip on this page (2026-10-25). */}
      <VoiceToggle voice={voice} onChange={setVoice} />

      <View className="mb-6">
        <Eyebrow tone="accent" className="mb-2">Vowel</Eyebrow>
        <View className="flex-row items-center gap-4">
          <Text className="font-serif text-6xl text-stone-900">{vowel.letter}</Text>
          <View className="flex-1">
            {vowel.sound ? (
              <Text className="text-base font-medium text-stone-700">
                sounds like “{vowel.sound}”
              </Text>
            ) : null}
            <View className="flex-row items-center gap-2 mt-2">
              {/* Was: audioSrc={vowel.audio} — male only (2026-10-25). */}
              <AudioButton audioSrc={pickVoice(vowel, voice)} wordId={`vowel-${vowel.letter}`} size="lg" />
              <Text className="text-xs font-medium text-stone-600">Hear the vowel</Text>
            </View>
          </View>
        </View>
      </View>

      <Text className="font-serif text-2xl text-stone-900 mb-1">
        “{vowel.letter}” in all eight tones
      </Text>
      <Text className="text-xs font-medium text-stone-600 italic leading-relaxed mb-3">
        Spellings, not words — most need a consonant in front to become one.
      </Text>
      {/* Above the eight rows, each of which now plays a real syllable (2026-10-18). */}
      <ToneAudioNote className="mb-4" />
      {/* ⚠️ MOVED TO THE TOP, under the Breadcrumbs — 2026-10-25 ("add the switch to every
          screen"). "Hear the vowel" now has Emily too (her no-tone syllable), so the switch
          has to sit above it. TO RESTORE here: uncomment and remove the top one.
      <VoiceToggle voice={voice} onChange={setVoice} />
      */}

      <View className="gap-2">
        {rows.map((r) => (
          <Link key={r.name} href={`/tone/${toneSlug(r.tone)}`} asChild>
            {/* ⚠️ Pressable, NOT View — the same dead-link bug as "The other vowels"
                below, fixed 2026-10-15. These eight rows had never been tappable.
                ⚠️ IT HOLDS AN AudioButton, which is itself a Pressable. React Native
                gives the deepest touch target priority, so the speaker plays and the
                rest of the row navigates. If they ever fight on a device, the fix is the
                one ToneRows.jsx already documents ("THE ROW IS NOT THE LINK"): move the
                link to its own strip under the row rather than nesting. */}
            <Pressable className="rounded-md bg-cream-50 p-4 flex-row items-center gap-4 active:bg-cream-100">
              {/* The syllable leads — it is what the learner came to see. */}
              <Text className="font-serif text-2xl text-stone-900 w-16">{r.syllable}</Text>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-stone-800">{r.name}</Text>
                <Text className="text-xs font-medium text-stone-600 mt-0.5">
                  {r.marker ? `marker “${r.marker}”` : 'no marker'}
                  {/* ⚠️ "· as in pob" COMMENTED OUT 2026-10-20 with the po- audio above.
                      The row's button plays the SYLLABLE (`ab`), so naming a different
                      word beside it invited the tap the clip cannot honour — and with the
                      audio gone, the reference word is a claim with nothing behind it.
                      The po- words are still on /tone/<marker>, where the tone itself is
                      the subject.
                      Was: {r.example ? ` · as in ${r.example}` : ''}
                      Was, below it: a "· hear the tone" hint shown only when the button
                      was the fallback rather than the syllable — dead once the fallback
                      went, since every button is now the syllable or nothing. */}
                </Text>
              </View>

              {clipFor(vowel, r, voice) ? (
                <AudioButton
                  audioSrc={clipFor(vowel, r, voice)}
                  // The id keys the "which clip is playing" state, so it has to be the
                  // SYLLABLE: two rows playing the same tone word would share an id.
                  wordId={`vt-${r.syllable}`}
                />
              ) : null}
              <Icon name="arrowRight" size={16} tone="muted" />
            </Pressable>
          </Link>
        ))}
      </View>

      <Text className="font-serif text-xl text-stone-900 mt-8 mb-2">The other vowels</Text>
      <View className="flex-row flex-wrap gap-2">
        {others.map((v) => (
          <Link key={v.letter} href={`/vowel/${v.letter}`} asChild>
            {/* ⚠️ Pressable, NOT View — fixed 2026-10-15 (author: "the other vowels not
                tappable in the eight tones page"). `<Link asChild>` hands its press
                handler to the child, and a View has no press handling to hand it to, so
                every one of these tiles was dead: it looked like a button, had a href,
                and did nothing. Nothing logs, nothing throws — the tap is simply never
                received. Any `Link asChild` in this app must wrap a Pressable (or a Text,
                which also takes onPress). */}
            <Pressable className="rounded-md bg-cream-50 px-4 py-3 items-center min-w-[64px] active:bg-cream-100">
              <Text className="font-serif text-xl text-clay-700">{v.letter}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </TabScreen>
  )
}
