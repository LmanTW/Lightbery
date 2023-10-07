require('../Lightbery/Modules/Tools/CheckPackages')(['sharp', 'skia-canvas', 'wcwidth'])

//API
module.exports = {
  Lightbery: require('./Modules/Lightbery/Main'),
  Plugins: {
    LightberyCLI: require('./Plugins/LightberyCLI/Main'),
    LightberyWeb: require('./Plugins/LightberyWeb/Main'),
    LightberySync: require('./Plugins/LightberySync/Main')
  }
}