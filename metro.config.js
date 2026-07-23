const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)

// supabase-js optionally `import()`s @opentelemetry/api for tracing and swallows
// the failure. Metro resolves every import statically, so the missing optional
// dependency breaks the bundle instead. Stub it out.
const defaultResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@opentelemetry/api') {
    return { type: 'empty' }
  }
  return (defaultResolveRequest ?? context.resolveRequest)(
    context,
    moduleName,
    platform
  )
}

module.exports = withNativeWind(config, { input: './global.css' })
