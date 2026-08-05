module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Reanimated 4 (SDK 54) moved its worklet transform into react-native-worklets.
      // This must stay LAST in the plugins list.
      'react-native-worklets/plugin',
    ],
  };
};