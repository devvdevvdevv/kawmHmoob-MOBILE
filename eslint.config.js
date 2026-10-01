// ESLint flat config (ESLint 9+ format — the `eslintrc` style is gone).
//
// Added 2026-08-29: the project had 24k lines and no linter, so nothing caught
// unused variables, missing hook dependencies, or a typo'd identifier until it
// showed up as a runtime crash on device.
//
// `eslint-config-expo/flat` brings the React, React Hooks, and React Native
// rules Expo tunes for this SDK. Only project-specific adjustments live below.
const expoConfig = require('eslint-config-expo/flat')

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'android/**',
      'ios/**',
      '.expo/**',
      'patches/**',
    ],
  },
  {
    // scripts/ are Node programs, not app code: they legitimately use Buffer,
    // __dirname, process. Without this they report 4 phantom no-undef errors, and
    // a linter with known-false errors is a linter people stop reading.
    files: ["scripts/**"],
    languageOptions: {
      globals: { Buffer: "readonly", __dirname: "readonly", process: "readonly", console: "readonly" },
    },
  },
  {
    rules: {
      // This codebase deliberately keeps disabled features commented out rather
      // than deleting them (a house rule), which leaves real, intentionally
      // unused imports and helpers behind. Warn so they stay visible, but never
      // fail a build over one.
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // The dependency array is where stale-closure bugs come from — the exact
      // class of bug that is invisible until a value silently stops updating.
      // Worth seeing on every save.
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]
