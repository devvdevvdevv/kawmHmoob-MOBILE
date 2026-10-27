import { Text } from 'react-native'

// INLINE BOLD FOR LESSON PROSE — 2026-10-20 (author: "if there is a hmong
// word/phrase within the english explainations, please bold it and add a quote to
// convey distinguishment").
//
// Lesson text is plain strings in the data, rendered by one <Text>. There was no
// way to emphasise part of a sentence, so a Hmong word inside an English
// explanation looked like any other word — which is the problem: in "Kuv refers
// to one speaker" the reader cannot see where the Hmong stops and the English
// starts.
//
// The markup is `**…**`, the same two asterisks every writer already knows:
//
//   'Kuv refers to one speaker'  →  '**"Kuv"** refers to one speaker'
//
// ⚠️ RETURNS NODES, NOT AN ELEMENT, so it is used as the CHILDREN of whatever
// <Text> already styles the line:
//
//   <Text className="text-stone-800">{rich(paragraph)}</Text>
//
// Nested <Text> inherits size, colour and line height in React Native, so a bold
// run keeps the surrounding style and only changes weight. That is why this is a
// function and not a component with its own <Text> wrapper — a wrapper would
// have to re-declare the style of every caller.
//
// ⚠️ A STRING WITH NO `**` COMES BACK UNCHANGED (as itself), so every existing
// lesson renders exactly as before. Nothing had to be migrated.
//
// ⚠️ AN UNCLOSED `**` IS LEFT AS LITERAL TEXT rather than swallowing the rest of
// the paragraph. A typo should look like a typo, not like a vanished sentence.
export function rich(text) {
  if (typeof text !== 'string' || !text.includes('**')) return text

  // Split on the delimiter, keeping it, so the segments alternate
  // plain / bold / plain / bold …
  const parts = text.split('**')

  // An even number of parts means an odd number of delimiters — one is unclosed.
  // Hand the original back untouched.
  if (parts.length % 2 === 0) return text

  return parts.map((part, i) =>
    i % 2 === 1
      ? <Text key={i} className="font-semibold text-clay-700">{part}</Text>
      : part
  )
}
