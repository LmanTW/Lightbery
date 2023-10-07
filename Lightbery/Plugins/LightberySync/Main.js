const http = require('http')
const fs = require('fs')

require('../../Modules/Tools/CheckPackages')(['socket.io', 'socket.io-client'])

const { io } = require('socket.io-client')
const { Server } = require('socket.io')

//圖庫同步
module.exports = class {
  #core
  
  #connection

  constructor (core, options) {
    this.#core = core
  
    if (options === undefined) options = {}

    let httpServer = http.createServer()
    let socketServer = new Server(httpServer)

    socketServer.on('connection', (client) => {
      if (this.#connection === undefined) {
        this.#connection = new Connection(this.#core, client, true)

        this.#connection.socket.once('connect_error', () => this.#connection = undefined)
        this.#connection.socket.once('disconnect', () => {
          if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.addLog('warn', `與 ${this.#connection.connectionAddress} 的連接以斷開`)
          this.#connection = undefined
        })
      } else client.disconnect()
    })

    httpServer.listen((options.port === undefined) ? 3000 : options.port)

    if (this.#core.plugins.LightberyCLI !== undefined) {
      this.#core.plugins.LightberyCLI.cli.addPage('LightberySync', () => {
        if (this.#connection === undefined) return ['沒有任何連接的 Lightbery']
        else return [`連接位置: ${(this.#connection.connectionAddress)}`, `延遲: ${Math.trunc(this.#connection.info.ping)}ms`, '', `圖片數: ${this.#connection.info.imageAmount}`]
      })

      this.#core.plugins.LightberyCLI.addCommand('connect <url>', '連接至另一個 Lightbery', [])
      this.#core.plugins.LightberyCLI.addCommand('download <type>', '下載連線至的 Lightbery', [
        { name: '-m', description: '合併 Lightbery' },
        { name: '-r', description: '替換 Lightbery' }
      ])
      this.#core.plugins.LightberyCLI.addCommand('disconnect', '關閉連接', [])

      this.#core.plugins.LightberyCLI.cli.event('enter', async (text) => {
        let command = this.#core.plugins.LightberyCLI.parseCommand(text)

        if (command.path[0] === 'connect') {
          let data = await this.connect(command.path[1])

          if (data.error) this.#core.plugins.Log.addLog('error', '無法連接，因為已經連接至了另一個 Lightbery') 
        } else if (command.path[0] === 'download') {
          if (command.parameter.includes('-m') || command.parameter.includes('-r')){
            let data
            if (command.parameter.includes('-m')) data = await this.merge()
            else if (command.parameter.includes('-r')) data = await this.replace()

            if (data.error) this.#core.plugins.Log.addLog('error', '沒有任何連接的 Lightbery')
          } else this.#core.plugins.Log.addLog('error', '請選擇一種下載模式')
        } else if (command.path[0] === 'disconnect') this.disconnect()
      })
    }
  }

  static get pluginID () {return 'LightberySync'}
  get childThreadApiPath () {return undefined}

  //連接
  async connect (url) {
    return new Promise((resolve) => {
      if (this.#connection === undefined) {
        this.#connection = new Connection(this.#core, io(url), false)
        
        this.#connection.socket.once('connection', () => resolve({ error: false }))
        this.#connection.socket.once('connect_error', () => {
          this.#connection = undefined
          resolve({ error: true, content: 'Connection Faild' })
        })
        this.#connection.socket.once('disconnect', () => {
          if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.addLog('warn', `與 ${this.#connection.connectionAddress} 的連接以斷開`)
          this.#connection = undefined
        })
      } else resolve({ error: true, content: 'Already have a connection' })
    })
  }

  //合併
  async merge () {
    if (this.#connection === undefined) return { error: true, content: 'Connection Not Found' }
    else {
      let state = (this.#core.plugins.Log === undefined) ? undefined : this.#core.plugins.Log.addState('white', 'LightberySync', '正在下載資料')
      let data = (await this.#connection.request({ type: 'download' })).data

      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.changeState(state, 'white', 'LightberySync', '正在備份現有的 Lightbery')
      this.#checkFile()
      fs.writeFileSync(getPath(this.#core.path, ['Backup', `${Date.now()}.json`]), JSON.stringify(this.#core.images))

      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.changeState(state, 'white', 'LightberySync', '正在合併 Lightbery')
      this.#core.images = Object.assign(this.#core.images, JSON.parse(data))
      this.#core.save()

      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.finishState(state, 'green', 'LightberySync', '成功合併 Lightbery')
      return { error: false }
    } 
  }

  //替換
  async replace () {
    if (this.#connection === undefined) return { error: true, content: 'Connection Not Found' }
    else {
      let state = (this.#core.plugins.Log === undefined) ? undefined : this.#core.plugins.Log.addState('white', 'LightberySync', '正在下載資料')
      let data = (await this.#connection.request({ type: 'download' })).data

      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.changeState(state, 'white', 'LightberySync', '正在備份現有的 Lightbery')
      this.#checkFile()
      fs.writeFileSync(getPath(this.#core.path, ['Backup', `${Date.now()}.json`]), JSON.stringify(this.#core.images))

      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.changeState(state, 'white', 'LightberySync', '正在替換 Lightbery')
      this.#core.images = JSON.parse(data)
      this.#core.save()

      if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.finishState(state, 'green', 'LightberySync', '成功替換 Lightbery')
      return { error: false }
    } 
  }

  //關閉連接
  disconnect () {
    if (this.#core.plugins.Log !== undefined) this.#core.plugins.Log.addLog('complete', `成功關閉與 ${this.#connection.connectionAddress} 的連線`)

    this.#connection.socket.disconnect()
  }

  #checkFile = () => {
    if (!fs.existsSync(getPath(this.#core.path, ['Backup']))) fs.mkdirSync(getPath(this.#core.path, ['Backup']))
  }
}

const getPath = require('../../Modules/Tools/GetPath')

const Connection = require('./Connection')