//連線
module.exports = class {
  #core

  #socket
  #info = { ping: 0, imageAmount: 0 }

  #requests = {}

  constructor (core, socket, server) {
    this.#core = core

    this.#socket = socket

    let state = (this.#core.plugins.Log === undefined) ? undefined : this.#core.plugins.Log.addState('white', 'LightberySync', (server) ? `${this.#socket.handshake.address} 正在嘗試連接` : `正在嘗試連接至 ${this.#socket.io.uri}`)

    this.#socket.once('connect_error', () => {
      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.finishState(state, 'red', 'LightberySync', (server) ? `${this.#socket.handshake.address} 連接失敗` : `無法連接至 ${this.#socket.io.uri}`)
      this.#socket.disconnect()
    })

    this.#socket.emit('info', { imageAmount: Object.keys(this.#core.images).length })
    this.#socket.once('info', (data) => {
      this.#info = Object.assign(this.#info, data)
  
      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.changeState(state, 'green', 'LightberySync', (server) ? `成功連接 ${this.#socket.handshake.address}` : `成功連接至 ${this.#socket.io.uri}`)
  
      this.#socket.once('info', (data) => {this.#info = Object.assign(this.#info, data)})
  
      setInterval(async () => {
        let sendTime = performance.now()
        await this.request({ type: 'ping' })
        this.#info.ping = performance.now()-sendTime
      }, 1000)
  
      setInterval(() => socket.emit('info', { imageAmount: Object.keys(this.#core.images).length }), 10000)
    })
  
    this.#socket.on('request', (data) => {
      if (data.type === 'ping') this.#socket.emit('response', { requestID: data.requestID })
      else if (data.type === 'download') this.#socket.emit('response', { requestID: data.requestID, data: JSON.stringify(this.#core.images) })
    })
  
    this.#socket.on('response', (data) => {
      if (this.#requests[data.requestID] !== undefined) {
        this.#requests[data.requestID](data)
        delete this.#requests[data.requestID]
      }
    })
  }

  get socket () {return this.#socket}
  get info () {return this.#info}
  get connectionAddress () {return (this.server) ? this.#socket.handshake.address : this.#socket.io.uri}

  //請求
  async request (data) {
    return new Promise((resolve) => {
      let requestID = generateID(5, Object.keys(this.#requests))

      this.#requests[requestID] = resolve

      this.#socket.emit('request', Object.assign(data, { requestID }))
    })
  }
}

const generateID = require('../../Modules/Tools/GenerateID')