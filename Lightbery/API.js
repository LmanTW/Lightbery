const checkPackages = require('./Modules/Tools/CheckPackages')

checkPackages(['sharp', 'skia-canvas', 'wcwidth'])

//API
module.exports = {
  Lightbery: require('./Modules/Lightbery/Main'),
  Plugins: {
    CLI: require('./Modules/Plugins/CLI/Main')
  }
}