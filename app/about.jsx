import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import Button from '../src/components/ui/Button.jsx'

// ABOUT — why this app exists, and who speaks Hmong.
//
// The in-app version of notes/2026-09-12-why-this-app-exists.md. That note is
// the engineering record; this is the page a learner reads. If one changes,
// change the other — they are the same claim addressed to two audiences.
//
// ⚠️ THE POPULATION FIGURES ARE APPROXIMATE AND UNCITED. They come from national
// censuses and language surveys around 2020, rounded. This is the one screen in
// the app that states facts about the world rather than about Hmong grammar, and
// a wrong number here is the kind that gets quoted back at you. Before this ships
// — and certainly before any of it goes in a store listing — pin each one to a
// source. See the same warning in the note.
//
// The US figure in particular was corrected once already: an early draft said
// 28,000, which is roughly a single city's community rather than the national
// population.

// Approximate speaker populations, largest first. Deliberately ordered by size
// rather than by relevance to this app's current audience — the ordering IS the
// point of the section.
const POPULATIONS = [
  { where: 'China', count: '~4.5 million', note: 'Chuanqiandian cluster — “Chinese Hmong”' },
  { where: 'Vietnam', count: '~1.4 million' },
  { where: 'Laos', count: '~600,000' },
  { where: 'Thailand', count: '~150,000–250,000' },
  { where: 'United States', count: '~300,000', note: 'Largest communities in California, Minnesota, Wisconsin' },
]

// ⚠️ THE ORIGINAL PAGE (until 2026-09-28), kept but not exported. TO RESTORE: make this the default
// export and remove `About` below.
// eslint-disable-next-line no-unused-vars
function AboutBefore() {
  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">About Kawm Hmoob</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed mt-1">
          A Hmong language-learning app, built for people who want their language back.
        </Text>
      </View>

      {/* ── The dedication ───────────────────────────────────────────────────
          Given its own card and set in the serif at card-heading size, because
          it is the one sentence on this screen that is not information. */}
      <View className="rounded-md bg-cream-50 p-5 mb-8">
        <Eyebrow tone="accent" className="mb-3">Dedication</Eyebrow>
        <Text className="font-serif text-2xl text-stone-900 leading-snug">
          This app is dedicated to preserving our beautiful language — Hmoob Dawb,
          White Hmong.
        </Text>
      </View>

      <Section title="Hmong is not a small language">
        <Para>
          It is easy to think of Hmong as a heritage language that a few families
          still speak. It is not. Millions of people speak it, across five
          countries — and the largest community of all is the one this app serves
          least today.
        </Para>
      </Section>

      <View className="rounded-md bg-cream-50 p-5 mb-3">
        {POPULATIONS.map((p, i) => (
          <PopRow key={p.where} {...p} last={i === POPULATIONS.length - 1} />
        ))}
      </View>

      <Text className="text-xs text-stone-500 leading-relaxed mb-8">
        Figures are approximate — national censuses and language surveys, rounded.
      </Text>

      <Section title="What this app teaches">
        <Para>
          Every lesson, every recording and every translation in Kawm Hmoob is
          <B> White Hmong (Hmoob Dawb)</B>. That is a deliberate scope, not an
          oversight.
        </Para>
        <Para>
          You can still tell us which dialect you are learning — Green Hmong and
          Dananshan Hmong are both in the picker. Choosing one saves your
          preference for later; it does not change the content yet, and the app
          says so rather than quietly handing you the wrong dialect.
        </Para>
        <Para>
          Standard Chinese Hmong is built on the Dananshan dialect, uses a
          different romanisation, and does not line up with RPA sound for sound.
          Teaching it properly is a different app, not a translation layer.
        </Para>
      </Section>

      <Section title="Why we are careful">
        <Para>
          A wrong translation, a mislabelled recording, or a pronunciation score
          that is confidently wrong does not just frustrate you — it teaches a
          person their own language incorrectly.
        </Para>
        <Bullet><B>Recordings are labelled by dialect.</B> Mixing varieties silently is how a learner ends up practising against the wrong voice.</Bullet>
        {/* ⚠️ REMOVED 2026-09-21: no longer true once AI-written example sentences
            ship before a speaker has read them. Restore by uncommenting — once it
            is true again.
        <Bullet><B>Nothing ships unread.</B> Hmong written correctly is not the same as Hmong written well, and a language app cannot ship prose no fluent speaker has read.</Bullet>
        */}
        <Bullet><B>Tones carry meaning.</B> One vowel apart is a different word, so pronunciation feedback has to be right or absent — never confident and wrong.</Bullet>
      </Section>

      {/* ── Who built this ───────────────────────────────────────────────────
          Placed last, immediately above "Questions or corrections", because it
          is what makes that card credible: a correction goes to a person, not
          to a support queue.

          ⚠️ THE PAGE SAYS "WE" ELSEWHERE AND THIS SECTION SAYS ONE PERSON.
          That is a real inconsistency, left in deliberately rather than
          silently rewritten — changing the voice of the whole page is an
          editorial decision for the author, not a side effect of adding a bio.
          If it should read "I" throughout, the places to change are
          "Why we are careful" and the contact card below. */}
      <Section title="Who built this">
        <Para>
          Kawm Hmoob is built and maintained by one person: <B>Devv</B>, 21, a
          college dropout, addicted to learning Hmong and set on preserving it.
        </Para>
        {/* ⚠️ REMOVED 2026-09-21 with the other made-by-a-person claims — example
            sentences are now partly AI-written. Restore by uncommenting.
        <Para>
          Every lesson, recording, translation and line of code here is one
          person&apos;s work. That is why some of it is still unfinished — and why
          none of it is padded out to look bigger than it is.
        </Para>
        */}
      </Section>

      <View className="rounded-md bg-cream-50 p-5 mb-8">
        <Text className="text-sm font-semibold text-stone-800 mb-1">Questions or corrections</Text>
        <Text className="text-xs text-stone-600 mb-3">
          If something here is wrong — a figure, a translation, a recording — we
          want to hear it.
        </Text>
        <View className="flex-row gap-2">
          <Link href="/contact" asChild><Button variant="ghost">Contact</Button></Link>
          <Link href="/privacy" asChild><Button variant="ghost">Privacy</Button></Link>
        </View>
      </View>
    </TabScreen>
  )
}

// ── ABOUT — rewritten 2026-09-28 (author: "something more for preserving the language, no chinese
// hmong, focus hmong white"). No population table (it led with China, and its figures were uncited),
// no Chinese Hmong. Kept from the old page: the dedication, the tone-accuracy promise, the author's
// own bio line, and the contact card.
export default function About() {
  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      <View className="mb-6">
        <Text className="font-serif text-4xl text-stone-900 mb-2">About KawmHmong</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed mt-1">
          KawmHmong comes from Kawm Hmoob, “learn Hmong”. This app exists to help keep our language alive.
        </Text>
      </View>

      <View className="rounded-md bg-cream-50 p-5 mb-8">
        <Eyebrow tone="accent" className="mb-3">Dedication</Eyebrow>
        <Text className="font-serif text-2xl text-stone-900 leading-snug">
          This app is dedicated to preserving our beautiful language — Hmoob Dawb,
          White Hmong.
        </Text>
      </View>

      <Section title="Why it matters">
        <Para>
          For most of its history, Hmong was passed down by speaking it: at home, at the
          table, in the stories our elders told. A language kept that way lives only as long
          as people keep speaking it.
        </Para>
        <Para>
          Many of us grew up hearing Hmong but never learned to speak it well, or to read and
          write it. Every generation that lets it slip takes words, sayings and stories with
          it. Learning it, even a little at a time, is how it stays.
        </Para>
      </Section>

      <Section title="White Hmong, done properly">
        <Para>
          Every lesson, recording and translation in KawmHmong is <B>White Hmong (Hmoob
          Dawb)</B>, written in RPA, the Romanized Popular Alphabet. Focusing on one dialect
          means it can be taught carefully, with its grammar, its tones and its everyday
          speech, instead of a mix that gets each of them a little wrong.
        </Para>
      </Section>

      <Section title="Why we are careful">
        <Para>
          A wrong translation or a pronunciation score that is confidently wrong does not just
          frustrate you. It teaches a person their own language incorrectly.
        </Para>
        <Bullet><B>Tones carry meaning.</B> One tone apart is a different word, so pronunciation feedback has to be right or absent — never confident and wrong.</Bullet>
        <Bullet><B>Grammar comes from speakers.</B> The rules in these lessons are checked by a Hmong speaker, and corrected when they are wrong.</Bullet>
      </Section>

      <Section title="How you can help keep it">
        <Bullet><B>Speak it.</B> At home, with family, even a word at a time.</Bullet>
        <Bullet><B>Ask your elders.</B> The words, sayings and stories they know are the language.</Bullet>
        <Bullet><B>Tell us when something is wrong.</B> A correction here fixes it for every learner after you.</Bullet>
      </Section>

      <Section title="Who built this">
        <Para>
          KawmHmong is built and maintained by one person: <B>Devv</B>, 21, a
          college dropout, addicted to learning Hmong and set on preserving it.
        </Para>
      </Section>

      <View className="rounded-md bg-cream-50 p-5 mb-8">
        <Text className="text-sm font-semibold text-stone-800 mb-1">Questions or corrections</Text>
        <Text className="text-xs text-stone-600 mb-3">
          If something here is wrong — a translation, a recording, a rule — we want to hear it.
        </Text>
        <View className="flex-row gap-2">
          <Link href="/contact" asChild><Button variant="ghost">Contact</Button></Link>
          <Link href="/privacy" asChild><Button variant="ghost">Privacy</Button></Link>
        </View>
      </View>
    </TabScreen>
  )
}

// ⚠️ THESE FOUR ARE A COPY of the helpers at the foot of app/privacy.jsx.
//
// Deliberate, and the distinction matters: those are PRESENTATION, where drift
// costs a slightly different margin. The dialect list in src/data/dialects.js
// was copied the same way and drift there meant a learner's saved preference
// could not be displayed — that is DATA, and it got a shared module.
//
// If a third prose page appears, move these into src/components/common/ and
// import them in all three. Two copies is the threshold, not one.
function Section({ title, children }) {
  return (
    <View className="mb-6">
      <Text className="font-serif text-xl text-stone-900 mb-2">{title}</Text>
      <View className="gap-2">{children}</View>
    </View>
  )
}

function Para({ children }) {
  return <Text className="text-base font-medium text-stone-700 leading-relaxed">{children}</Text>
}

function Bullet({ children }) {
  return (
    <View className="flex-row gap-2">
      <Text className="text-clay-600">•</Text>
      <Text className="flex-1 text-base text-stone-700 leading-relaxed">{children}</Text>
    </View>
  )
}

function B({ children }) {
  return <Text className="font-semibold text-stone-900">{children}</Text>
}

function PopRow({ where, count, note, last }) {
  return (
    <View className={`py-2.5 ${last ? '' : 'border-b border-cream-200'}`}>
      <View className="flex-row items-baseline justify-between gap-3">
        <Text className="text-base font-semibold text-stone-800">{where}</Text>
        <Text className="font-serif text-lg text-clay-700">{count}</Text>
      </View>
      {!!note && <Text className="text-xs text-stone-500 mt-0.5">{note}</Text>}
    </View>
  )
}
