//命令行介面 API
module.exports = class {
  #core

  #commandSuggestion = getCommandSuggestion('').lines

  constructor (core) {
    this.#core = core

    if (this.#core.plugins.Log === undefined) this.#core.addPlugin(require('../Log/Main'))

    let cli = new CLI()
      .addPage('日誌', () => this.#core.plugins.Log.get())
      .addPage('指令', () => this.#commandSuggestion)

      .event('enter', async (text) => {
        this.#commandSuggestion = getCommandSuggestion('').lines
        cli.switchPage(0)

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
        } else core.add(command.path[0])
      })

      .event('input', () => {
        this.#commandSuggestion = getCommandSuggestion(cli.data.input).lines
        cli.switchPage(1)
      })
      .event('keyPress', (data) => {
        if (data.toString('hex') === '7f') this.#commandSuggestion = getCommandSuggestion(cli.data.input).lines
        else if (data.toString('hex') === '09') {
          let result = getCommandSuggestion(cli.data.input).result[0]
          if (result.includes('<')) cli.setInput(result.substring(0, result.indexOf('<')))
          else cli.setInput(result)
        }
      })
  }

  static get pluginID () {return 'LightberyCLI'}
  get childThreadApiPath () {return undefined}
}

const { CLI } = require('./DynamicCliBuilder')

const getCommandSuggestion = require('./GetCommandSuggestion')
const parseCommand = require('./ParseCommand')