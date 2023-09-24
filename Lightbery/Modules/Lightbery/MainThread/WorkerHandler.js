const { Worker } = require('worker_threads')

//Worker 處理器
module.exports = class {
  #worker
  #requests = {}

  constructor (path, options) {
    this.#worker = new Worker(getPath(__dirname, ['<', 'ChildThread', 'Main.js']), { workerData: { path, options }})

    this.#worker.addListener('message', (msg) => {
      if (msg.type === 'response' && this.#requests[msg.requestID] !== undefined) {
        this.#requests[msg.requestID](msg.data)
        delete this.#requests[msg.requestID]
      }  
    })
  }

  get worker () {return this.#worker}

  //發送請求
  async sendRequest (data) {
    return new Promise((resolve) => {
      let id = generateID(5, Object.keys(this.#requests))

      this.#requests[id] = (responseData) => resolve(responseData)

      this.#worker.postMessage(Object.assign(data, { requestID: id }))
    })
  }
}

const generateID = require('../../Tools/GenerateID')
const getPath = require('../../Tools/GetPath')