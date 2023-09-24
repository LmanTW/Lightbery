const { parentPort } = require('worker_threads')

const checkRepeatImages = require('./CheckRepeatImages')
const checkImagesData = require('./CheckImagesData')
const addImage = require('./AddImage')

parentPort.addListener('message', async (msg) => {
  if (msg.type === 'addImage') parentPort.postMessage({ type: 'response', data: await addImage(msg.imageID), requestID: msg.requestID })
  else if (msg.type === 'checkImagesData') parentPort.postMessage({ type: 'response', data: await checkImagesData(msg.images), requestID: msg.requestID })
  else if (msg.type === 'checkRepeatImages') parentPort.postMessage({ type: 'response', data: await checkRepeatImages(msg.images), requestID: msg.requestID })
})

// const { parentPort } = require('worker_threads')

// const checkImagesData = require('./CheckImageData')
// const checkRepeatImage = require('./CheckRepeatImage')
// const addImage = require('./AddImage')

// parentPort.addListener('message', async (msg) => {
//   if (msg.type === 'addTask') {
//     if (msg.name === 'addImage') parentPort.postMessage({ type: 'taskFinish', taskID: msg.taskID, data: await addImage(msg.data) })
//     else if (msg.name === 'checkImagesData') parentPort.postMessage({ type: 'taskFinish', taskID: msg.taskID, data: await checkImagesData(msg.data) })
//     else if (msg.name === 'checkRepeatImage') parentPort.postMessage({ type: 'taskFinish', taskID: msg.taskID, data: await checkRepeatImage(msg.data) })
//     else parentPort.postMessage({ type: 'taskFinish', taskID: msg.taskID })
//   }
// })