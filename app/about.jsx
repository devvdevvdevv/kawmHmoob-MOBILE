import { View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import Constants from 'expo-constants'
import TabScreen from '../src/components/TabScreen.jsx'
import Breadcrumbs from '../src/components/common/Breadcrumbs.jsx'
import Eyebrow from '../src/components/ui/Eyebrow.jsx'
import Icon from '../src/components/ui/Icon.jsx'
import { categories } from '../src/data/vocabulary.js'
import { livePath } from '../src/data/path.js'
import { stories } from '../src/data/stories.js'

// ABOUT — why this app exists, in the author's voice.
//
// ⚠️ REWRITTEN 2026-10-14: "rewrite it so it does not sound like ai", plus a
// visual pass ("so its not just text on solid background"). The previous page,
// the one before THAT, and both of their full texts are in
// archive/2026-10-14-about-page/ (TO RESTORE: copy its about.jsx back).
//
// ⚠️ IT SAYS "I" NOW, NOT "WE". The old page said "we want to hear it" in one
// card and "built by one person" two inches below, and a comment here called
// that out as an editorial decision for the author rather than something to fix
// silently. The rewrite settles it: one person built it, so it speaks as one
// person. "We/us/our" survives only where it means Hmong people, not the app.
//
// ⚠️ WHAT THIS PAGE MUST NOT CLAIM. Two sentences were cut on 2026-09-21 —
// "nothing ships unread" and "every lesson, recording, translation and line of
// code here is one person's work" — because AI-written example sentences ship
// before a speaker has read them. Both are still false. Do not write anything
// here that implies every word in the app is hand-written by a human; the
// content cannot back it up. See archive/2026-10-14-about-page/about-text.md.
//
// The engineering record this page is the public face of:
// notes/2026-09-12-why-this-app-exists.md.

// ⚠️ DERIVED, NOT TYPED IN. An About page that says "2,000 words" goes stale the
// week after it ships, and a number a learner can check is worth more than an
// adjective. Deduped by category id, the same way app/(tabs)/index.jsx counts.
const STATS = (() => {
  const byId = new Map()
  for (const c of categories) if (!byId.has(c.id)) byId.set(c.id, c)
  const cats = [...byId.values()]
  return {
    words: cats.reduce((n, c) => n + c.words.length, 0),
    units: livePath().length,
    // Placeholder stories exist to prove the library's layout (stories.js says
    // so in its own ⚠️ comment). There are none today, and this page must not
    // start counting them as finished reading if some come back.
    stories: stories.filter((s) => !s.placeholder).length,
  }
})()

const VERSION = Constants.expoConfig?.version || '1.0.0'

export default function About() {
  return (
    <TabScreen>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'About' }]} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <View className="mb-5">
        <Eyebrow className="mb-2">KawmHmoob · v{VERSION}</Eyebrow>
        <Text className="font-serif text-4xl text-stone-900 mb-3 leading-tight">
          About KawmHmong
        </Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          KawmHmong means Kawm Hmoob: learn Hmong. I am building it to keep the language
          alive, and to teach it the way it is actually spoken.
        </Text>
      </View>

      {/* ── What is actually in here ───────────────────────────────────────
          Three real numbers, read off the data at launch. This is also the
          first thing on the page that is not a paragraph, which is most of why
          it is here: the page used to open with four stacked blocks of prose. */}
      <View className="flex-row gap-3 mb-6">
        <Stat value={STATS.words.toLocaleString()} label="words" icon="layers" />
        <Stat value={STATS.units} label="units" icon="award" />
        <Stat value={STATS.stories} label="stories" icon="bookOpen" />
      </View>

      {/* ── The dedication ─────────────────────────────────────────────────
          ⚠️ THIS SENTENCE IS NOT REWRITTEN AND SHOULD NOT BE. It is the
          author's own line, kept word for word through every version of this
          page. It gets the biggest card and the serif because it is the one
          thing here that is not information. */}
      <View className="rounded-md bg-cream-50 shadow-warm p-6 mb-8">
        <View className="flex-row items-center gap-2.5 mb-3">
          <View className="h-9 w-9 rounded-full bg-clay-600/12 items-center justify-center">
            <Icon name="star" size={18} tone="accent" />
          </View>
          <Eyebrow>Dedication</Eyebrow>
        </View>
        <Text className="font-serif text-2xl text-stone-900 leading-snug">
          This app is dedicated to preserving our beautiful language — Hmoob Dawb,
          White Hmong.
        </Text>
      </View>

      {/* ⚠️ REWRITTEN 2026-10-19 (the author: "gotta replace this with something less ai
          isey"). The previous version is in archive/2026-10-14-about-page/about-text.md.
          What made it read as AI, so it does not creep back:
            · aphorisms — "that works until the day it does not", "a language can go quiet
              inside one lifetime";
            · the closer, which is the biggest tell: "Nobody fixes that in one go. It gets
              fixed the way it was built in the first place" — a neat reversal that sounds
              earned and says nothing;
            · every paragraph landing on a turn of phrase, and all three the same length.
          This version is plainer, the sentences are uneven, and it ends on something
          concrete instead of something quotable.
          ⚠️ STILL NOT SPECIFIC TO THE AUTHOR. One real detail — who he learned from, where
          he is from, the thing that made him start — would do more than any rewrite. It is
          not invented here; see the ⚠️ on the "Who built this" card below. */}
      <Section icon="flame" title="Why I keep working on it">
        <Para>
          Hmong gets passed down by being spoken. At home, at parties, by the elders who
          tell the same story every year. When that stops, it goes fast.
        </Para>
        <Para>
          A lot of us grew up hearing it and answering in English. We understand more than
          we can say, and plenty of us never learned to read it at all.
        </Para>
        <Para>
          I can&apos;t fix that on my own. What I can do is learn it properly and build the
          app I wanted when I started, so the next person has somewhere to begin.
        </Para>
      </Section>

      <Section icon="check" title="White Hmong only">
        <Para>
          Everything here is White Hmong (<B>Hmoob Dawb</B>), written in RPA. One
          dialect, so its tones, its grammar and the way people actually say things can
          all be right at the same time. Teaching three at once usually means getting
          all three slightly wrong.
        </Para>
      </Section>

      <Section icon="music" title="Where I would rather say nothing">
        <Para>
          A bad translation teaches you your own language wrong. So does a pronunciation
          score that is confident and mistaken. I would rather this app go quiet than
          guess at you.
        </Para>
        <Bullet>
          <B>Tones are the word.</B> One tone apart is a different word, so the app only
          grades your pronunciation when it can genuinely hear the difference.
        </Bullet>
        <Bullet>
          <B>The rules come from speakers.</B> Grammar in these lessons gets checked by a
          Hmong speaker and corrected when it is wrong.
        </Bullet>
        <Bullet>
          <B>Unfinished parts say so.</B> Where a lesson or a drill is not ready, you
          will see that instead of filler.
        </Bullet>
      </Section>

      {/* ── How to help ──────────────────────────────────────────────────
          Its own card, not a Section, because it is the only part of the page
          asking the reader to do something. */}
      <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-8">
        <Text className="font-serif text-xl text-stone-900 mb-1">How you can help keep it</Text>
        <Text className="text-sm font-medium text-stone-600 mb-4">
          None of this needs an app.
        </Text>
        <View className="gap-3.5">
          <Help title="Speak it">At home, with family, one word at a time.</Help>
          <Help title="Ask your elders">What they know is the language. Write it down.</Help>
          <Help title="Tell me when something is wrong">
            One correction fixes it for everyone who comes after you.
          </Help>
        </View>
      </View>

      {/* ── The two names ──────────────────────────────────────────────────
          ⚠️ TWO NAMES, ON PURPOSE, and this paragraph exists so nobody
          "fixes" one into the other later.
            • KawmHmoob — the OFFICIAL name, in RPA, the way the language
              spells itself. Every id in the codebase uses it (entitlement,
              package, storage keys) and those must never be renamed: changing
              the entitlement id alone would revoke Pro for every existing
              subscriber.
            • KawmHmong — what users see, so an English-reading learner can tell
              at a glance which language it teaches.
          Demoted to a small note card in this rewrite: it is a detail about the
          app's name, and it had been sitting in the hero where the reason the
          app exists should be. */}
      <View className="rounded-md bg-cream-100 p-5 mb-8">
        <Eyebrow className="mb-2">On the name</Eyebrow>
        <Text className="text-sm font-medium text-stone-700 leading-relaxed">
          The official name is <B>KawmHmoob</B>, spelled the way Hmong spells itself in
          RPA. You will see <B>KawmHmong</B> on the storefront and around the app so it
          is obvious which language it teaches. Same app, same name, two sets of eyes.
        </Text>
        <Text className="text-sm font-medium text-stone-700 leading-relaxed mt-2">
          This is <B>v{VERSION}</B>. Lessons, recordings and stories get added as they
          are finished.
        </Text>
      </View>

      {/* ── Who built this ─────────────────────────────────────────────────
          Immediately above "Found something wrong", because it is what makes
          that card credible: a correction goes to a person, not a support
          queue.

          ⚠️ The bio is deliberately thin — it is the author's to fill in. If
          you want the page to be unmistakably yours, this is the card to add a
          line to (where you are from, who you learned from, what made you
          start). I have not invented any of that. */}
      <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-8">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="h-12 w-12 rounded-full bg-clay-600 items-center justify-center">
            <Text className="font-serif text-xl text-cream-50">D</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-stone-900">Devv</Text>
            <Text className="text-sm font-medium text-stone-600">
              Built and maintains KawmHmong
            </Text>
          </View>
        </View>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">
          I am 21 and a college dropout. Learning Hmong took over my life a while ago,
          and this is what came of it. That is also why some corners are still rough:
          there is one of me.
        </Text>
      </View>

      {/* ── Footer links ───────────────────────────────────────────────────
          Full-width rows with an arrow, the same shape as Home's Explore list,
          instead of two small ghost buttons that read as an afterthought. */}
      <View className="mb-4">
        <Text className="font-serif text-xl text-stone-900 mb-1">Found something wrong?</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed mb-4">
          A translation, a recording, a rule I have got backwards. Send it over. I read
          every message.
        </Text>
        <View className="gap-3">
          {/* ⚠️ THE CHANGELOG'S ONLY DOOR — 2026-10-19. It is deliberately not in the tab
              bar or the Explore list: a changelog is something you look up once, usually
              right after wondering whether the app is still being worked on. About is
              where that question gets asked, and the version stamp at the top of this
              page is the other half of the answer. */}
          <LinkRow to="/changelog" icon="fileText" label="What's new" blurb="Every major change, newest first." />
          <LinkRow to="/contact" icon="inbox" label="Contact" blurb="Tell me what is wrong, or just say hello." />
          <LinkRow to="/privacy" icon="lock" label="Privacy" blurb="What this app stores, and what it does not." />
        </View>
      </View>
    </TabScreen>
  )
}

// ── Pieces ──────────────────────────────────────────────────────────────────
//
// ⚠️ `Para`, `Bullet` and `B` ARE STILL A COPY of the helpers at the foot of
// app/privacy.jsx, and that stays deliberate: they are presentation, where drift
// costs a slightly different margin. (Compare src/data/dialects.js, which was
// copied the same way — but that is DATA, and drift there meant a learner's
// saved dialect could not be displayed, so it got a shared module.)
//
// `Section` has now DIVERGED: on this page it is a card with an icon, on
// privacy.jsx it is still a bare heading. If a third prose page appears, move
// Para/Bullet/B into src/components/common/ and leave Section where it is.

function Stat({ value, label, icon }) {
  return (
    <View className="flex-1 rounded-md bg-cream-50 p-4 items-center">
      <Icon name={icon} size={18} tone="accent" />
      <Text className="font-serif text-2xl text-stone-900 mt-1.5">{value}</Text>
      <Text className="text-xs font-medium text-stone-600 mt-0.5">{label}</Text>
    </View>
  )
}

// A section is a card now, with an icon chip beside its heading. That is the
// whole of the "not just text on a background" fix: same words, but each one is
// an object on the page instead of another paragraph in a column.
function Section({ icon, title, children }) {
  return (
    <View className="rounded-md bg-cream-50 shadow-warm p-5 mb-5">
      <View className="flex-row items-center gap-2.5 mb-3">
        <View className="h-9 w-9 rounded-full bg-clay-600/12 items-center justify-center">
          <Icon name={icon} size={18} tone="accent" />
        </View>
        <Text className="font-serif text-xl text-stone-900 flex-1">{title}</Text>
      </View>
      <View className="gap-2.5">{children}</View>
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

function Help({ title, children }) {
  return (
    <View className="flex-row gap-3">
      {/* A filled tick, so the three asks read as a list of actions rather than
          three more bullet points. */}
      <View className="h-6 w-6 rounded-full bg-clay-600/12 items-center justify-center mt-0.5">
        <Icon name="check" size={13} tone="accent" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-stone-900">{title}</Text>
        <Text className="text-base font-medium text-stone-700 leading-relaxed">{children}</Text>
      </View>
    </View>
  )
}

function LinkRow({ to, icon, label, blurb }) {
  return (
    <Link href={to} asChild>
      {/* active: variant, never a function `style` — NativeWind drops those on
          native and the row renders invisible. */}
      <Pressable className="rounded-md bg-cream-50 p-4 flex-row items-center gap-4 active:bg-cream-100">
        <View className="h-11 w-11 rounded-full bg-clay-600/12 items-center justify-center">
          <Icon name={icon} size={20} tone="accent" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-stone-900">{label}</Text>
          <Text className="text-sm font-medium text-stone-600 mt-0.5">{blurb}</Text>
        </View>
        <Icon name="arrowRight" size={18} tone="muted" />
      </Pressable>
    </Link>
  )
}

function B({ children }) {
  return <Text className="font-semibold text-stone-900">{children}</Text>
}
