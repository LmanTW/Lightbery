const fs = require('fs')

//核心
module.exports = class {
  #path

  #workerHandler

  #plugins = {}
  
  constructor (path, options) {
    this.#path = path
    this.checkFiles()

    this.#workerHandler = new WorkerHandler(this.#path, options)

    this.images = require(getPath(this.#path, ['Images.json']))

    this.#workerHandler.worker.addListener('message', (msg) => {
      if (msg.type === 'setImageInfo') this.#workerHandler.worker.postMessage({ type: 'response', data: this.images[msg.imageID] = msg.data, requestID: msg.requestID })
      else if (msg.type === 'deleteImageInfo') this.#workerHandler.worker.postMessage({ type: 'response', data: this.images[msg.imageID] = msg.data, requestID: msg.requestID })
    })
  }

  get path () {return this.#path}
  get workerHandler () {return this.#workerHandler}
  get plugins () {return this.#plugins}

  //添加插件
  addPlugin (Plugin, options) {
    if (Plugin.pluginID === undefined) throw new Error('無法識別插件')
    if (this.#plugins[Plugin.pluginID] !== undefined) throw new Error(`已經有ID為 ${Plugin.pluginID} 的插件被添加了`)

    this.#plugins[Plugin.pluginID] = new Plugin(this, options)
    this.#workerHandler.worker.postMessage({ type: 'addPlugin', pluginID: Plugin.pluginID, childThreadApiPath: this.#plugins[Plugin.pluginID].childThreadApiPath })

    return this.#plugins[Plugin.pluginID]
  }

  //取得圖片的資訊
  getImageInfo (imageID) {
    return this.images[imageID]
  }

  //取得圖片的資料
  getImageData (imageData) {
    if (this.images[imageData] !== undefined) {
      if (fs.existsSync(getPath(this.#path, ['Images', `${imageData}.jpg`]))) {
        return {
          imagePath: getPath(this.#path, ['Images', `${imageData}.jpg`]),
  
          width: this.images[imageData].width,
          height: this.images[imageData].height,
  
          data: fs.readFileSync(getPath(this.#path, ['Images', `${imageData}.jpg`])),
        }
      } else return 'Image Data Not Found'
    }
  }

  //搜尋圖片
  search (query, type) {
    let keys = Object.keys(this.images)
    let result = []
  
    if (type === undefined) {
      result = this.search(query, 'title')
      this.search(query, 'author').forEach((item) => {
        if (!result.includes(item)) result.push(item)
      })
      this.search(query, 'tags').forEach((item) => {
        if (!result.includes(item)) result.push(item)
      })
    } else if (type === 'title') {
      result = keys.filter((item) => {
        let state = true
        for (let item2 of query) {
          state = this.images[item].title.toLowerCase().includes(item2.toLowerCase())
          if (!state) break
        }
        return state
      })
    } else if (type === 'author') {
      result = keys.filter((item) => {
        let state = true
        for (let item2 of query) {
          state = this.images[item].author.name.toLowerCase().includes(item2.toLowerCase())
          if (!state) break
        }
        return state
      })
    } else if (type === 'tags') {
      result = keys.filter((item) => {
        let state = true
        for (let item2 of this.images[item].tags) {
          for (let item3 of query) {
            state = item2.toLowerCase().includes(item3.toLowerCase())
            if (!state) break
          }
          return state
        }
      })
    }

    return result
  }

  //新增圖片
  async add (imageID) {
    let data = await this.#workerHandler.sendRequest({ type: 'addImage', imageID })

    this.save()

    return data
  }

  //檢查圖片的資料
  async checkImagesData (images) {
    for (let item of images) {
      if (this.images[item] === undefined) throw new Error(`找不到圖片 ${item}`)
    }

    await this.#workerHandler.sendRequest({ type: 'checkImagesData', images })
  }

  //檢查重複的圖片
  async checkRepeatImages () {
    return await this.#workerHandler.sendRequest({ type: 'checkRepeatImages', images: Object.keys(this.images) })
  }

  //移除圖片
  async remove (imageID) {
    if (this.images[imageID] === undefined) throw new Error(`找不到圖片 ${imageID}`)

    delete this.images[imageID]
    fs.unlinkSync(getPath(this.#path, ['Images', `${imageID}.jpg`]))
    
    this.save()
  }

  //儲存圖庫
  async save () {
    fs.writeFileSync(getPath(this.#path, ['Images.json']), JSON.stringify(this.images))
  }

  //檢查檔案
  checkFiles () {
    if (!fs.existsSync(this.#path)) fs.mkdirSync(this.#path)
    if (!fs.existsSync(getPath(this.#path, ['Images.json']))) fs.writeFileSync(getPath(this.#path, ['Images.json']), '{}')
    if (!fs.existsSync(getPath(this.#path, ['ImagesPixelData.json']))) fs.writeFileSync(getPath(this.#path, ['ImagesPixelData.json']), '{}')
    if (!fs.existsSync(getPath(this.#path, ['Images']))) fs.mkdirSync(getPath(this.#path, ['Images']))
  }
}

const getPath = require('../../Tools/GetPath')

const WorkerHandler = require('./WorkerHandler')