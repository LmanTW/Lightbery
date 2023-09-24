const { workerData } = require('worker_threads')
const fs = require('fs')

//檢查圖片資料
module.exports = async (images) => {
  let state = (plugins.Log === undefined) ? undefined : await plugins.Log.addState(FontColor.white, '檢查器', '正在檢查圖片的資料 (0%)')

  await resolvePromise(images, async (item, index) => {
    if (plugins.Log !== undefined) state.change(FontColor.white, '檢查器', `正在檢查圖片的資料 (${Math.trunc((100/images.length)*index)}%)`)

    let imageInfo = await fetchImageInfo(item)

    if (imageInfo.error) {
      if (plugins.Log !== undefined) plugins.Log.warn(`圖片 ${item} 被移除，因為無法在 Pixiv 上找到該圖片`)
      await sendRequest({ type: 'deleteImageInfo', imageID: item })
      if (fs.existsSync(getPath(workerData.path, ['Images', `${item}.jpg`]))) fs.unlink(getPath(workerData.path, ['Images', `${item}.jpg`]))
    } else if (!fs.existsSync(getPath(workerData.path, ['Images', `${item}.jpg`]))) await addImage(item, state.id)
  }, workerData.options.networkThread)

  if (plugins.Log !== undefined) state.change(FontColor.white, '檢查器', `正在檢查是否有多餘的圖片資料`)
  let files = fs.readdirSync(getPath(workerData.path, ['Images']))
  for (let i = 0; i < files.length; i++) {
    if (!images.includes(files[i].split('.')[0])) await addImage(files[i], state.id)
  }

  if (plugins.Log !== undefined) state.finish(FontColor.green, '檢查器', '圖片資料檢查完成')
}

const { FontColor } = require('../../Tools/DynamicCliBuilder')
const resolvePromise = require('../../Tools/ResolvePromise')
const sendRequest = require('../../Tools/WorkerRequest')
const getPath = require('../../Tools/GetPath')

const fetchImageInfo = require('./FetchImageInfo')
const addImage = require('./AddImage')
const plugins = require('./Plugins')