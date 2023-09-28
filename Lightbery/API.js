require('../Lightbery/Modules/Tools/CheckPackages')(['sharp', 'skia-canvas', 'wcwidth'])

//API
module.exports = {
  Lightbery: require('./Modules/Lightbery/Main'),
  Plugins: {
    CLI: require('./Plugins/CLI/Main')
  }
}