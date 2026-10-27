// Lesson 05 practice — promises, async/await, try/catch, Promise.all.
// Run:  node js-ts-course/practice/p05-async.mjs
import { check, assert, run, todo } from './check.mjs'

// ── A fake AsyncStorage ─────────────────────────────────────────────────────
// Same API as @react-native-async-storage: getItem / setItem return Promises.
// Every call takes 20ms. Two booby traps:
//   • the key 'broken' holds text that is NOT valid JSON
//   • setItem on the key 'full' REJECTS (pretend the disk is full)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const disk = new Map([['broken', '{oops not json']])
const AsyncStorage = {
  async getItem(key) { await sleep(20); return disk.has(key) ? disk.get(key) : null },
  async setItem(key, value) {
    await sleep(20)
    if (key === 'full') throw new Error('disk full')
    disk.set(key, value)
  },
}

// ── Exercise 1: predict the order ───────────────────────────────────────────
// What does this print? Write the letters in order as one string, e.g. 'ABCD'.
//   console.log('A')
//   setTimeout(() => console.log('B'), 0)
//   Promise.resolve().then(() => console.log('C'))
//   console.log('D')
const predictedOrder = ''

// ── Exercise 2: loadJSON ────────────────────────────────────────────────────
// Read `key`, JSON.parse it, return it.
// Return `fallback` when the key is missing (getItem gives null) OR the JSON is broken.
// Must never throw.
async function loadJSON(key, fallback) {
  return todo('loadJSON')
}

// ── Exercise 3: saveJSON ────────────────────────────────────────────────────
// JSON.stringify `value` and write it. If writing fails, swallow the error
// (don't throw); storage failures shouldn't crash the UI.
async function saveJSON(key, value) {
  return todo('saveJSON')
}

// ── Exercise 4: consume (the heart of useDailyQuota) ────────────────────────
// The record at `key` looks like { date: '2026-10-04', count: 3 }.
//   • Read it FRESH with your loadJSON (fallback null).
//   • If it's missing or from another day, the count is 0.
//   • If count >= limit → return false and change nothing.
//   • Otherwise save { date: today, count: count + 1 } and return true.
async function consume(key, limit, today) {
  return todo('consume')
}

// ── Exercise 5: make it fast ────────────────────────────────────────────────
// Load the three keys below and return { profile, progress, notebook }.
// Each read takes 20ms. Done one after another, that's 60ms+.
// The check requires under 50ms, so the three reads must run AT THE SAME TIME.
// Hint: Promise.all + array destructuring.
async function loadEverything() {
  return todo('loadEverything')
}

// ── Exercise 6: retry ───────────────────────────────────────────────────────
// Call the async function `fn`. If it throws, try again, up to `times` attempts in total.
// Return the first successful result. If every attempt fails, throw the LAST error.
// Hint: a for loop with try/catch inside; `return await fn()` inside the try.
async function retry(fn, times) {
  return todo('retry')
}

// ─────────────────────────── checks (don't edit) ────────────────────────────
check('1. predicted order', () => {
  assert.equal(predictedOrder, 'ADCB', 'plain code first, then promise callbacks, then timers')
})
check('2. loadJSON', async () => {
  disk.set('notebook', JSON.stringify({ savedWords: { 'animals-dog': {} } }))
  assert.deepEqual(await loadJSON('notebook', {}), { savedWords: { 'animals-dog': {} } })
  assert.deepEqual(await loadJSON('missing', { empty: true }), { empty: true })
  assert.equal(await loadJSON('broken', 'fallback'), 'fallback', 'broken JSON must give the fallback, not throw')
  const p = loadJSON('missing', 1)
  assert.ok(p instanceof Promise, 'an async function always returns a Promise')
})
check('3. saveJSON', async () => {
  await saveJSON('settings', { theme: 'dark' })
  assert.equal(disk.get('settings'), '{"theme":"dark"}')
  await saveJSON('full', { x: 1 }) // must not throw
})
check('4. consume', async () => {
  disk.delete('q')
  assert.equal(await consume('q', 2, '2026-10-04'), true, '1st use today')
  assert.equal(await consume('q', 2, '2026-10-04'), true, '2nd use today')
  assert.equal(await consume('q', 2, '2026-10-04'), false, '3rd use — over the limit of 2')
  assert.deepEqual(JSON.parse(disk.get('q')), { date: '2026-10-04', count: 2 }, 'a denied use saves nothing')
  assert.equal(await consume('q', 2, '2026-10-05'), true, 'a new day resets the count')
  assert.deepEqual(JSON.parse(disk.get('q')), { date: '2026-10-05', count: 1 })
})
check('5. loadEverything (parallel)', async () => {
  disk.set('profile', '{"name":"Devan"}'); disk.set('progress', '{"xp":120}'); disk.set('notebook', '{"notes":[]}')
  const t0 = Date.now()
  const all = await loadEverything()
  const ms = Date.now() - t0
  assert.deepEqual(all, { profile: { name: 'Devan' }, progress: { xp: 120 }, notebook: { notes: [] } })
  assert.ok(ms < 50, `took ${ms}ms — are the reads running one after another?`)
})
check('6. retry', async () => {
  let calls = 0
  const flaky = async () => { calls++; if (calls < 3) throw new Error(`fail ${calls}`); return 'ok' }
  assert.equal(await retry(flaky, 5), 'ok')
  assert.equal(calls, 3, 'stop as soon as it works')
  calls = 0
  await assert.rejects(retry(flaky, 2), /fail 2/, 'after 2 failed attempts, throw the LAST error')
})

run('Lesson 05 — async')
