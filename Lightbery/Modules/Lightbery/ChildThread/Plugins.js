const { parentPort } = require('worker_threads')

let plugins = {}

module.exports = plugins

parentPort.addListener('message', (msg) => {
  if (msg.type === 'plugins') msg.plugins.forEach((item) => plugins[item.name] = (item.childThreadApiPath === undefined) ? true : require(item.childThreadApiPath))
})