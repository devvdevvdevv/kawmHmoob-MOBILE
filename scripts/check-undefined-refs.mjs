// Finds identifiers that are USED but never declared, imported, or global.
//
// WHY THIS EXISTS: on 2026-08-29 a `Button` was shipped that rendered
// `{icon ? <Icon .../> : null}` while `icon` was never destructured from props.
// Babel parsed it happily — the SYNTAX is valid; the reference is not. The app
// then failed at runtime on every screen that renders a Button.
//
// `node -e "require('@babel/core').transformFileSync(f)"` cannot catch this.
// Scope analysis can. There is no eslint in this project, so this is the floor.
//
// Run: node scripts/check-undefined-refs.mjs [file ...]
import { parseSync, traverse } from '@babel/core'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const GLOBALS = new Set([
  'console', 'process', 'require', 'module', 'exports', 'globalThis',
  'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'requestAnimationFrame',
  'cancelAnimationFrame', 'fetch', 'Promise', 'Object', 'Array', 'String', 'Number',
  'Boolean', 'Math', 'JSON', 'Date', 'Error', 'Map', 'Set', 'WeakMap', 'WeakSet',
  'Symbol', 'RegExp', 'Infinity', 'NaN', 'undefined', 'parseInt', 'parseFloat',
  'isNaN', 'isFinite', 'encodeURIComponent', 'decodeURIComponent', 'Intl',
  'Float32Array', 'Int16Array', 'Uint8Array', 'ArrayBuffer', 'DataView', 'TextDecoder',
  '__DEV__', 'global', 'AbortController', 'URL', 'Buffer', 'structuredClone',
  // base64 + the rest of the typed-array family. RN provides all of these.
  'atob', 'btoa', 'Float64Array', 'Int8Array', 'Uint8ClampedArray', 'Int32Array',
  'Uint16Array', 'Uint32Array', 'BigInt', 'Reflect', 'Proxy', 'queueMicrotask',
  'performance', 'WeakRef', 'FinalizationRegistry',
])

// ⚠️ Walk the tree ourselves. This previously shelled out to
// `git ls-files … || find …`, which returned DIFFERENT FILE COUNTS between
// runs (181 vs 182) and therefore different verdicts. A check that is not
// reproducible is not a check. No shell, no git dependency, sorted output.
function walk(dir, acc = []) {
  const entries = readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (/.jsx?$/.test(e.name)) acc.push(p)
  }
  return acc
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['app', 'src'].filter((d) => existsSync(d)).flatMap((d) => walk(d))

let bad = 0
for (const file of files) {
  let ast
  try {
    ast = parseSync(readFileSync(file, 'utf8'), {
      filename: file,
      presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
      ast: true, code: false,
    })
  } catch (e) {
    console.error(`✗ ${file}\n    parse failed: ${e.message.split('\n')[0]}`)
    bad++
    continue
  }

  traverse(ast, {
    ReferencedIdentifier(path) {
      const { name } = path.node
      if (GLOBALS.has(name)) return
      if (path.scope.hasBinding(name, true)) return
      // JSX member expressions like <Animated.View> resolve on the object only.
      if (path.parentPath.isJSXMemberExpression() && path.parent.property === path.node) return
      console.error(`✗ ${file}:${path.node.loc?.start.line}`)
      console.error(`    '${name}' is used but never declared, imported, or destructured`)
      bad++
    },
  })
}

console.log(`\nchecked ${files.length} files`)
console.log(bad ? `${bad} UNDEFINED REFERENCE(S)` : 'no undefined references ✅')
process.exit(bad ? 1 : 0)
