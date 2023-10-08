const { parentPort } = require('worker_threads')

let plugins = {}

module.exports = plugins

parentPort.addListener('message', (msg) => {
  if (msg.type === 'addPlugin') {
    plugins[msg.pluginID] = (msg.childThreadApiPath === undefined) ? undefined : require(msg.childThreadApiPath) 
  }
})