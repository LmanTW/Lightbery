const fs = require('fs')
const os = require('os')

//Lightbery API
module.exports = class {
  #core

  constructor (path, options) {
    if (typeof path !== 'string') throw new Error('參數 path 必須為一個 <string>')
    if (!fs.existsSync(path)) throw new Error(`找不到資料夾 ${path}`)
    if (!fs.statSync(path).isDirectory()) throw new Error(`${path} 不是一個資料夾`)

    this.#core = new Core(path, Object.assign({
      networkThread: 5,
      workerThread: os.cpus().length 
    }, options))

    this.#core.checkFiles()
  }

  get path () {return this.#core.path}
  get size () {return Object.keys(this.#core.images).length}

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
    return await this.#core.checkRepeatImages()
  }
}

const Core = require('./MainThread/Core')