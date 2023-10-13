//命令行介面 API
module.exports = class {
  #core

  #cli

  #commandSuggestion = getCommandSuggestion('').lines

  constructor (core) {
    this.#core = core

    if (this.#core.plugins.Log === undefined) this.#core.addPlugin(require('../Log/Main'))

    this.#cli = new CLI()
      .addPage('日誌', () => this.#core.plugins.Log.get())
      .addPage('指令', () => this.#commandSuggestion)

      .event('enter', async (text) => {
        this.#commandSuggestion = getCommandSuggestion('').lines
        this.#cli.switchPage(0)

        let command = parseCommand(text)

        if (command.path[0] === 'stop') {
          process.stdout.write(`\x1B[2J\x1B[3J\x1B[H\x1Bc`)
          process.exit()
        } else if (command.path[0] === 'check') {
          if (command.path[1] !== undefined) {
            
          } else {
            if (!command.parameter.includes('-d') && !command.parameter.includes('-r')) {
              await core.checkImagesData(Object.keys(core.images))
              await core.checkRepeatImages()
            } else {
              if (command.parameter.includes('-d')) core.checkImagesData(Object.keys(core.images))
              if (command.parameter.includes('-r')) core.checkRepeatImages()
            }
          }
        } else if (command.path[0] === 'remove') {
          if (this.#core.images[command.path[1]] === undefined) this.#core.plugins.Log.addLog('error', `找不到圖片 ${command.path[1]}`)
          else {
            this.#core.remove(command.path[1])
            this.#core.plugins.Log.addLog('complete', `成功移除圖片 ${command.path[1]}`)
          }
        } else if (command.path[0] === 'size') {
          this.#core.plugins.Log.addLog('complete', `圖庫大小: ${Object.keys(this.#core.images).length}`)
        } else if (!isNaN(command.path[0])) {
          if (this.#core.getImageInfo(command.path[0]) === undefined) this.#core.add(command.path[0])
          else this.#core.plugins.Log.addLog('error', `已經有 ID 為 ${command.path[0]} 的圖片存在了`)
        }
      })

      .event('input', () => {
        this.#commandSuggestion = getCommandSuggestion(this.#cli.data.input).lines
        this.#cli.switchPage(1)
      })
      .event('keyPress', (data) => {
        if (data.toString('hex') === '7f') this.#commandSuggestion = getCommandSuggestion(this.#cli.data.input).lines
        else if (data.toString('hex') === '09') {
          let result = getCommandSuggestion(this.#cli.data.input).result[0]
          if (result !== undefined) {
            if (result.includes('<')) this.#cli.setInput(result.substring(0, result.indexOf('<')))
            else this.#cli.setInput(result)
          }
        }
      })
  }

  static get pluginID () {return 'LightberyCLI'}
  get childThreadApiPath () {return undefined}

  get cli () {return this.#cli}
  get parseCommand () {return parseCommand}

  //添加指令
  addCommand (name, description, child) {
    addCommand(name, description, child)

    this.#commandSuggestion = getCommandSuggestion(this.#cli.data.input).lines
  }
}

const { CLI } = require('./DynamicCliBuilder')

const { getCommandSuggestion, addCommand } = require('./GetCommandSuggestion')
const parseCommand = require('./ParseCommand')