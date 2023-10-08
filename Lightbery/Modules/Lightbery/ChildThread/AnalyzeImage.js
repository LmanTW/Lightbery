const { Canvas, loadImage } = require('skia-canvas')
const { parentPort, workerData } = require('worker_threads')

parentPort.addListener('message', async (imageID) => {
  let image = await loadImage(getPath(workerData.path, ['Images', `${imageID}.jpg`]))

  let ctx = new Canvas(image.width/2, image.height/2).getContext('2d')
  ctx.drawImage(image, 0, 0, image.width/2, image.height/2)

  let data = ctx.getImageData(0, 0, image.width/2, image.height/2).data
  let colors = {}

  parentPort.postMessage({ type: 'state', state: 1 })
  for (let i = 0; i < data.length; i+=4) {
    if (colors[`${data[i]},${data[i+1]},${data[i+2]}`] === undefined) colors[`${data[i]},${data[i+1]},${data[i+2]}`] = 1
    else colors[`${data[i]},${data[i+1]},${data[i+2]}`]++
  }

  parentPort.postMessage({ type: 'state', state: 2 })
  parentPort.postMessage({ type: 'data', data: Object.keys(colors).map((item) => {return { name: item, value: colors[item] }}).sort((a, b) => b.value-a.value).slice(0, 10) })
})

const getPath = require('../../Tools/GetPath')