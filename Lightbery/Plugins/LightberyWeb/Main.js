const sharp = require('sharp')
const http = require('http')
const url = require('url')
const fs = require('fs')

//網頁圖片瀏覽器
module.exports = class {
  #core

  constructor (core, options) {
    this.#core = core

    if (options === undefined) options = {}

    let server = http.createServer(async (req, res) => {
      let path = url.parse(req.url).path
      if (path.includes('?')) path = path.substring(0, path.indexOf('?'))
      path = path.split('/')
      path.splice(0, 1)

      if (path[0] === 'api') {
        let query = url.parse(req.url, true).query

        if (path[1] === 'search') {
          let amount = (query.amount === undefined || query.amount > 25) ? 25 : query.amount

          let array = []
          if (query.query === undefined) {
            let keys = Object.keys(this.#core.images)
            while (array.length < amount) {
              let random = getRandom(0, keys.length)
              while (array.includes(keys[random])) random = getRandom(0, keys.length)
              array.push(keys[random])
            }
          } else {
            let chunk = (query.chunk === undefined) ? 0 : query.chunk

            array = this.#core.search(query.query, (query.type === 'all') ? undefined : query.type).slice(chunk*25, (chunk*25)+25)
          }

          res.end(JSON.stringify(array))
        } else if (path[1] === 'getImageInfo') {
          let data = this.#core.getImageInfo(query.imageID)

          if (data === undefined) res.end('Image Not Found')
          else res.end(JSON.stringify(data))
        } else if (path[1] === 'getImageData') {
          let data = this.#core.getImageData(query.imageID)

          if (data === undefined) res.end('Image Not Found')
          else if (data === 'Image Data Not Found') res.end()
          else res.end((await sharp(data.data).jpeg({ quality: (query.quality === undefined || +query.quality < 10 || +query.quality > 100) ? 100 : +query.quality }).toBuffer()).toString('base64'))
        }
      } else if (path[0] === 'script') {
        if (fs.existsSync(getPath(__dirname, ['Files', 'Scripts', path[1]]))) {
          res.writeHead(200, { 'Content-Type': 'text/javascript' })
          res.end(fs.readFileSync(getPath(__dirname, ['Files', 'Scripts', path[1]])))
        } else res.end('Resource Not Found')
      } else if (path[0] === 'style') {
        if (fs.existsSync(getPath(__dirname, ['Files', 'Styles', path[1]]))) res.end(fs.readFileSync(getPath(__dirname, ['Files', 'Styles', path[1]])))
        else res.end('Resource Not Found')
      } else if (fs.existsSync(getPath(__dirname, ['Files', 'Pages', `${path[0]}.html`]))) res.end(fs.readFileSync(getPath(__dirname, ['Files', 'Pages', `${path[0]}.html`])))
      else res.end(fs.readFileSync(getPath(__dirname, ['Files', 'Pages', 'home.html'])))
    })

    server.listen((options.port === undefined) ? 8080 : options.port)
  }

  static get pluginID () {return 'LightberyWeb'}
  get childThreadApiPath () {return undefined}
}

const getRandom = require('../../Modules/Tools/GetRandom')
const getPath = require('../../Modules/Tools/GetPath')