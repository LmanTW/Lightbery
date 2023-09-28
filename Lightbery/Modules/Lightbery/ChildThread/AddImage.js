const { workerData } = require('worker_threads')
const sharp = require('sharp')
const fs = require('fs')

//添加圖片
module.exports = async (imageID, parentStateID) => {
  let state = (plugins.Log === undefined) ? undefined : await plugins.Log.addState('white', imageID, '正在取得圖片的資訊', parentStateID)

  let imageInfo = await fetchImageInfo(imageID)

  if (imageInfo.error) {
    if (plugins.Log !== undefined) state.finish('red', imageID, '無法添加圖片，因為無法抓取圖片的資訊')
    return imageInfo
  } else {
    imageInfo = imageInfo.data

    if (plugins.Log !== undefined) state.change('white', imageID, '正在下載圖片 (0%)')
    let imageData = await httpsGet(imageInfo.url, (progress) => state.change('white', imageID, `正在下載圖片 (${Math.trunc(progress)}%)`))

    if (plugins.Log !== undefined) state.change('white', imageID, '正在轉檔圖片')
    let buffer
    try {
      buffer = await sharp(imageData).jpeg().toBuffer()
    } catch (error) {
      if (plugins.Log !== undefined) state.finish('red', imageID, '無法添加圖片，因為無法轉換圖片')
      return { error: true, content: 'Can Not Convert Image' }
    }

    if (plugins.Log !== undefined)  state.change('white', imageID, '正在儲存圖片')
    await sendRequest({ type: 'setImageInfo', imageID, data: imageInfo })
    fs.writeFileSync(getPath(workerData.path, ['Images', `${imageID}.jpg`]), buffer)

    if (plugins.Log !== undefined) state.finish('green', imageID, '成功添加圖片')
    return { error: false }
  }
}

const sendRequest = require('../../Tools/WorkerRequest')
const getPath = require('../../Tools/GetPath')

const fetchImageInfo = require('./FetchImageInfo')
const httpsGet = require('./HttpsGet')
const plugins = require('./Plugin')