const { Worker, workerData } = require('worker_threads')
const fs = require('fs')

//檢查是否有重複的圖片
module.exports = async (images) => {
  let state = (plugins.Log === undefined) ? undefined : await plugins.Log.addState('white', '檢查器', '正在加載圖片像素資料')

  await loadImagePixelData(images, state)

  let repeatImages = []

  if (plugins.Log !== undefined) state.change('white', '檢查器', '正在檢查是否有重複的圖片')
  images.forEach((item) => {
    images.forEach((item2) => {
      if (item !== item2 && checkTwoArray(imagesPixelData[item], imagesPixelData[item2])) {
        if (plugins.Log !== undefined) plugins.Log.warn(`重複的圖片 ${item} - ${item2}`)
        repeatImages.push(item2)
      }
    })
  })

  if (plugins.Log !== undefined) state.change('green', '檢查器', '重複圖片檢查完成')

  return { error: false, data: repeatImages }
}

//加載圖片像素資料
async function loadImagePixelData (images, state) {
  let change = false

  Object.keys(imagesPixelData).forEach((item) => {
    if (!images.includes(item)) delete imagesPixelData[item]
  })

  await resolvePromise(images, async (item, index) => {
    if (plugins.Log !== undefined) state.change('white', '檢查器', `正在加載圖片像素資料 (${Math.trunc((100/images.length)*index)}%)`)
  
    if (imagesPixelData[item] === undefined) {
      change = true     
      let state2 = (plugins.Log === undefined) ? undefined : await plugins.Log.addState('gray', item, `正在加載圖片`, state.id)
      return new Promise((resolve) => {
        for (let i = 0; i < workers.length; i++) {
          if (!workers[i].analyzing) {
            workers[i].analyzing = true

            workers[i].worker.postMessage(item)
            workers[i].worker.addListener('message', (msg) => {
              if (msg.type === 'state') {
                if (msg.state === 1) state2.change('white', item, '正在統計圖片的像素')
                else if (msg.state === 2) state2.change('white', item, '正在取得圖片中最常見的顏色')
              } else if (msg.type === 'data') {
                state2.finish('green', item, `成功創建圖片的像素資料`)
                imagesPixelData[item] = msg.data

                workers[i].analyzing = false
                workers[i].worker.removeAllListeners('message')

                if (workerData.options.safetyMode === true) fs.writeFileSync(getPath(workerData.path, ['ImagesPixelData.json']), JSON.stringify(imagesPixelData))
                resolve()
              }
            })

            break
          }
        }
      })
    } else return
  }, workerData.options.workerThread)
  
  state.change('green', '檢查器', '圖片像素資料加載完成')
  
  if (change) {
    fs.writeFileSync(getPath(workerData.path, ['ImagesPixelData.json']), JSON.stringify(imagesPixelData))
    change = false
  }
}

//檢查兩個陣列是否是一樣的
function checkTwoArray (array, array2) {
  for (let i = 0; i < array.length; i++) {
    if ((array[i].name !== array2[i].name || array[i].value !== array2[i].value) || array2[i] === undefined) return false
  }
  return true
}

const resolvePromise = require('../../Tools/ResolvePromise')
const getPath = require('../../Tools/GetPath')

const plugins = require('./Plugin')

let imagesPixelData = require(getPath(workerData.path, ['ImagesPixelData.json']))

let workers = []
let change = false

for (let i = 0; i < workerData.options.workerThread; i++) workers.push({ analyzing: false, worker: new Worker(getPath(__dirname, ['AnalyzeImage.js']), { workerData: { path: workerData.path }})})

process.addListener('exit', () => {
  if (change) fs.writeFileSync(getPath(workerData.path, ['ImagesPixelData.json']), JSON.stringify(imagesPixelData))
})