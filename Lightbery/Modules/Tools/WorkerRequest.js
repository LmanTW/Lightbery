const { parentPort } = require('worker_threads')

//發送訊息
module.exports = (data) => {
  return new Promise((resolve) => {
    let id = generateID(10, Object.keys(requests))

    requests[id] = (returnData) => resolve(returnData)

    parentPort.postMessage(Object.assign(data, { requestID: id }))
  })
}

const generateID = require('./GenerateID')

let requests = {}

parentPort.addListener('message', (msg) => {
  if (msg.type === 'response' && requests[msg.requestID] !== undefined) {
    requests[msg.requestID](msg.data)
    delete requests[msg.requestID]
  }
})