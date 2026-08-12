// Battle pass — 50 tiers for the current season.
//
// ⚠️ PLACEHOLDER DATA, but grounded. The reward MIX is realistic — mostly things
// the app can actually deliver itself (streak freezes, XP boosts, themes, badges,
// bonus content) so the pass reads as real even with zero partners. A handful of
// partner COUPONS remain as the eventual monetization hook; every business named is
// INVENTED (mocking real names would read as genuine offers nobody agreed to). When
// real partners sign, swap the `brand` strings and set `placeholder: false` there.
// Everything else (`coupon` aside) is deliverable and can ship for real.
//
// Reward types:
//   streak-freeze  consumable — skips a day without breaking the streak
//   theme          cosmetic — unlocks an app theme
//   badge          cosmetic — profile flair
//   content        unlocks real app content (lesson packs, voice packs)
//   coupon         partner discount (the monetization hook)
//   boost          temporary points multiplier
//
// `premium: true` sits on the paid track. With PAYWALL_ENABLED off (testing),
// the page shows them unlocked-but-marked so the layout can be judged.
// See notes/57.

export const PASS = {
  seasonId: 'season-1',
  title: 'Season 1 Pass',
  freeTrackLabel: 'Free',
  premiumTrackLabel: 'Pro Pass',
  premiumPrice: '$9.99 / season',
}

// Invented storefronts. Hmong-American small-business flavored, none real.
export const PLACEHOLDER_BRANDS = [
  'Toj Siab Noodle Bar',
  'Paj Ntaub Threads',
  'Nkauj Hmoob Boba',
  'Zaub Ntsuab Grocery',
  'Sib Hlub Bakery',
  'Hmoob Village Market',
  'Txiv Neeb Coffee House',
]

const t = (level, type, name, detail, extra = {}) => ({
  level,
  type,
  name,
  detail,
  placeholder: true,
  premium: false,
  ...extra,
})

export const tiers = [
  t(1, 'badge', 'Seedling', 'Your first profile badge — you showed up.'),
  t(2, 'streak-freeze', 'Streak Freeze ×1', 'Miss a day without losing your streak.'),
  t(3, 'boost', '2× XP · 30 min', 'Double XP for your next half hour of study.'),
  t(4, 'badge', 'Tone Reader', 'Awarded for clearing the eight-tones lesson.'),
  t(5, 'content', 'Bonus quiz: Everyday 20', 'Twenty extra review questions from daily words.'),
  t(6, 'streak-freeze', 'Streak Freeze ×1', 'Bank another rest day.'),
  t(7, 'boost', '2× XP · 30 min', 'Stack it onto a focused session.'),
  t(8, 'badge', 'Consonants', 'All four consonant lessons cleared.'),
  t(9, 'content', 'Word pack: Kitchen', 'A themed set of cooking & food vocabulary.'),
  t(10, 'theme', 'Midnight Indigo', 'A deep batik-inspired dark theme.', { milestone: true }),
  t(11, 'streak-freeze', 'Streak Freeze ×2', 'Two banked rest days.'),
  t(12, 'boost', '2× XP · 1 hour', 'A longer double-XP window.'),
  t(13, 'badge', 'Word Bank', '100 words marked known.'),
  t(14, 'content', 'Bonus reading: Market Day', 'An extra intermediate passage with glossary.'),
  t(15, 'coupon', '15% off one item', 'Placeholder partner offer — Paj Ntaub Threads (invented).', { brand: 'Paj Ntaub Threads', milestone: true }),
  t(16, 'boost', '2× XP · 1 hour', 'Save it for the weekend grind.'),
  t(17, 'badge', 'Ear for Tones', 'A perfect run on a tone drill.'),
  t(18, 'streak-freeze', 'Streak Freeze ×2', 'Keep the chain alive.'),
  t(19, 'content', 'Word pack: Family', 'Kinship terms in one focused set.'),
  t(20, 'theme', 'Paj Ntaub', 'A textile-pattern accent theme.', { milestone: true }),
  t(21, 'boost', '3× XP · 30 min', 'The big multiplier, short and sweet.'),
  t(22, 'streak-freeze', 'Streak Freeze ×3', 'A generous cushion.'),
  t(23, 'badge', 'Classifiers', 'All twenty classifiers marked known.'),
  t(24, 'content', 'Bonus quiz: Grammar 20', 'Twenty extra grammar review questions.'),
  t(25, 'content', 'Word pack: Kitchen II', 'The advanced cooking & food set.', { premium: true, milestone: true }),
  t(26, 'coupon', 'Free topping', 'Placeholder partner offer — Nkauj Hmoob Boba (invented).', { brand: 'Nkauj Hmoob Boba' }),
  t(27, 'badge', 'Tone Master', 'A perfect score on every tone drill.'),
  t(28, 'boost', '3× XP · 1 hour', 'Serious grind fuel.'),
  t(29, 'content', 'Bonus reading: New Year', 'Noj Peb Caug, annotated line by line.'),
  t(30, 'theme', 'Gold Leaf', 'The prestige gold accent theme.', { milestone: true }),
  t(31, 'streak-freeze', 'Streak Freeze ×3', 'Travel-proof your streak.'),
  t(32, 'boost', '3× XP · 2 hours', 'A double session, tripled.'),
  t(33, 'badge', 'Storyteller', 'Every reading completed.'),
  t(34, 'content', 'Word pack: Numbers & Time', 'The trickiest ordering, drilled.'),
  t(35, 'content', 'Reading pack: Folktales', 'Three narrated long-form passages.', { premium: true, milestone: true }),
  t(36, 'coupon', '20% off one order', 'Placeholder partner offer — Hmoob Village Market (invented).', { brand: 'Hmoob Village Market' }),
  t(37, 'badge', 'Centurion', 'A 100-day streak.'),
  t(38, 'streak-freeze', 'Streak Freeze ×5', 'Basically a vacation.'),
  t(39, 'content', 'Word pack: Ceremony', 'Ritual & kinship vocabulary set.', { premium: true }),
  t(40, 'theme', 'Aurora', 'An animated northern-lights theme.', { premium: true, milestone: true }),
  t(41, 'boost', '3× XP · 4 hours', 'A full study day, and then some.'),
  t(42, 'badge', 'Word Hoard', '500 words marked known.'),
  t(43, 'content', 'Bonus reading: Letters Home', 'An advanced correspondence passage.', { premium: true }),
  t(44, 'streak-freeze', 'Streak Freeze ×5', 'The long-trip safety net.'),
  t(45, 'badge', 'Season 1 Veteran', 'Reached level 45 in the first season.', { milestone: true }),
  t(46, 'boost', '3× XP · 8 hours', 'Nearly a whole day, tripled.'),
  t(47, 'coupon', '$5 off $25', 'Placeholder partner offer — Zaub Ntsuab Grocery (invented).', { brand: 'Zaub Ntsuab Grocery', premium: true }),
  t(48, 'content', 'Reading pack: Migration', 'A premium set on the Hmong journey.', { premium: true }),
  t(49, 'streak-freeze', 'Streak Freeze ×10', 'The ultimate safety net.'),
  t(50, 'badge', 'Founding Voice', 'A permanent profile crown for finishing Season 1.', {
    premium: true,
    milestone: true,
  }),
]

export function tierAt(level) {
  return tiers.find((x) => x.level === level) || null
}

// The next reward worth walking toward — drives the "up next" card.
export function nextMilestone(level) {
  return tiers.find((x) => x.level > level && x.milestone) || null
}

export const TYPE_META = {
  'streak-freeze': { label: 'Streak Freeze', icon: '❄️' },
  theme: { label: 'Theme', icon: '🎨' },
  badge: { label: 'Badge', icon: '🏅' },
  content: { label: 'Content', icon: '📖' },
  coupon: { label: 'Coupon', icon: '🎟️' },
  boost: { label: 'Boost', icon: '⚡' },
}
