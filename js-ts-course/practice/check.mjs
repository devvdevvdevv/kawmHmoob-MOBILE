// The tiny test runner every practice file uses. You don't need to change this
// file — but read it once after Lesson 05, because it uses everything from
// Lessons 01–05 (functions as values, try/catch, async/await, template strings).
//
//   check('name of the test', () => { ...assertions... })
//
// Each check prints ✅ if the function runs without throwing, or ❌ plus the
// reason if it throws. An assertion is just "throw if this isn't true".

import assert from 'node:assert/strict'

export { assert }

let passed = 0
let failed = 0
const queue = []

export function check(name, fn) {
  queue.push({ name, fn })
}

// Runs every queued check in order (awaiting async ones), then prints a score.
export async function run(title) {
  console.log(`\n── ${title} ──\n`)
  for (const { name, fn } of queue) {
    try {
      await fn()
      passed++
      console.log(`  ✅ ${name}`)
    } catch (err) {
      failed++
      const reason = err?.message?.split('\n')[0] ?? String(err)
      console.log(`  ❌ ${name}\n       → ${reason}`)
    }
  }
  console.log(`\n  ${passed}/${passed + failed} passing${failed === 0 ? ' — all done 🎉' : ''}\n`)
}

// Stubs call this so an unwritten exercise fails with a clear message
// instead of a confusing "undefined is not a function".
// The JSDoc line tells TypeScript (Lessons 11–12) that this never returns
// normally, so `return todo('x')` type-checks in a function that returns a string.
/** @param {string} what  @returns {never} */
export function todo(what) {
  throw new Error(`not written yet: ${what}`)
}
