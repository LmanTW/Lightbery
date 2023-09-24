const fs = require('fs')
const os = require('os')

//Lightbery API
module.exports = class {
  #core

  constructor (path, options) {
    if (!fs.existsSync(path)) throw new Error(`找不到資料夾 ${path}`)
    else if (!fs.statSync(path).isDirectory()) throw new Error(`${path} 不是一個資料夾`)

    options = Object.assign({
      networkThread: 5,
      workerThread: os.cpus().length 
    }, options)

    this.#core = new Core(path, { networkThread: options.networkThread, workerThread: options.workerThread })

    this.#core.checkFiles()
  }

  get size () {return this.#core.size}

  //添加插件
  addPlugin (Plugin, options) {
    return this.#core.addPlugin(Plugin, options)
  }

  //取得圖片的資訊
  getImageInfo (imageID) {
    return this.#core.getImageInfo(imageID)
  }

  //取得圖片的資料
  getImageData (imageID) {
    return this.#core.getImageData(imageID)
  }

  //搜尋圖片
  search (query, type) {
    return this.#core.search(query, type)
  }

  //新增圖片
  async add (imageID) {
    return await this.#core.add(imageID)
  }

  //檢查圖片的資料
  async checkImagesData (images) {
    await this.#core.checkImagesData(images)
  }

  //檢查重複的圖片
  async checkRepeatImages () {
    await this.#core.checkRepeatImages()
  }
}

const Core = require('./MainThread/Core')