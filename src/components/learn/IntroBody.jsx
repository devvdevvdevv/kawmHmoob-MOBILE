import { View, Text } from 'react-native'

// The intro-body renderer, shared by the Learn lesson screen and the beginner
// path's unit screen.
//
// ⚠️ EXTRACTED FROM app/learn/[unitId]/[lessonId].jsx ON 2026-09-23, when the
// path unit screen started showing a unit's introduction before its first step.
// It is one renderer on purpose: the two prefixes below are a private little
// markup, and a second copy would drift the moment either screen gained a third
// prefix. The lesson screen's IntroStep now renders the title and delegates the
// body here.
//
// An intro body is an array of paragraphs with two opt-in prefixes that give the
// long explainers real structure (mirrors the web IntroStep):
//   '## Heading' → a subheading
//   '> line'     → an indented example line (a Hmong form + its gloss)
//   '---'        → a divider line (added 2026-09-29)
// Both are backwards compatible — no plain paragraph starts with either, so
// every other intro renders as a normal leading-relaxed paragraph.
export default function IntroBody({ body }) {
  if (!Array.isArray(body)) return null
  return (
    <View className="gap-4">
      {body.map((p, i) => {
        if (typeof p !== 'string') return null // tolerate holes in the array

        // '## ' → subheading
        if (p.startsWith('## ')) {
          return (
            <Text key={i} className={`font-serif text-xl text-stone-900 ${i === 0 ? '' : 'mt-2'}`}>
              {p.slice(3)}
            </Text>
          )
        }

        // '---' → a divider line between two parts of a long lesson — 2026-09-29 (author: "add a
        // line that separates the verb definitions with tau, from everything else").
        if (p === '---') {
          return <View key={i} className="h-0.5 bg-cream-300 rounded-full my-3" />
        }

        // '> ' → indented example line, set off with a clay left rule
        if (p.startsWith('> ')) {
          return (
            <View key={i} className="border-l-2 border-clay-600/40 pl-4">
              <Text className="text-clay-700 font-medium leading-relaxed">{p.slice(2)}</Text>
            </View>
          )
        }

        // plain paragraph
        return (
          <Text key={i} className="text-stone-800 leading-relaxed">{p}</Text>
        )
      })}
    </View>
  )
}
