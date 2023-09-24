//日誌
module.exports = class {
  #logs = []
  #states = {}

  constructor (core) {
    core.workerHandler.worker.addListener('message', (msg) => {
      if (msg.type === 'addLog') this.addLog(msg.logType, msg.content)
      else if (msg.type === 'addState') core.workerHandler.worker.postMessage({ type: 'response', data: this.addState(msg.color, msg.title, msg.content, msg.parentState), requestID: msg.requestID })
      else if (msg.type === 'changeState') this.changeState(msg.id, msg.color, msg.title, msg.content)
      else if (msg.type === 'finishState') this.finishState(msg.id, msg.color, msg.title, msg.content)
    })
  }

  static get pluginID () {return 'Log'}
  get childThreadApiPath () {return getPath(__dirname, ['ChildThreadAPI.js'])}

  //取得日誌
  get () {
    let lines = []

    this.#logs.forEach((item) => {
      if (typeof item === 'string') lines = lines.concat(item.split('\n'))
      else {
        lines.push(`${this.#states[item.stateID].color}[${this.#states[item.stateID].title}]: ${this.#states[item.stateID].content}`)
        Object.keys(this.#states[item.stateID].children).forEach((item2) => lines.push(`｜└${this.#states[item.stateID].children[item2].color}[${this.#states[item.stateID].children[item2].title}]: ${this.#states[item.stateID].children[item2].content}`))
      }
    })

    return lines
  }

  //添加日誌
  addLog (type, content) {
    if (type !== 'state' && typeof content !== 'string') content = JSON.stringify(content, null, 2)

    if (type === 'running') this.#logs.splice(0, 0, `[運行中]: ${content}`)
    else if (type === 'complete') this.#logs.splice(0, 0, `${FontColor.green}[完成]: ${content}`)
    else if (type === 'warn') this.#logs.splice(0, 0, `${FontColor.yellow}[警告]: ${content}`)
    else if (type === 'error') this.#logs.splice(0, 0, `${FontColor.red}[錯誤]: ${content}`)
    else if (type === 'state') this.#logs.splice(0, 0, { stateID: content })

    this.#logs = this.#logs.slice(0, 999)
  }

  //添加狀態
  addState (color, title, content, parentState) {
    if (parentState === undefined) {
      let id = generateID(5, Object.keys(this.#states))

      this.#states[id] = { color, title, content, children: [] }
      this.addLog('state', id)

      return id
    } else {
      let id = generateID(5, Object.keys(this.#states[parentState].children))

      this.#states[parentState].children[id] = { color, title, content }

      return `${parentState}.${id}`
    }
  }

  //改變狀態
  changeState (id, color, title, content) {
    if (id.includes('.')) this.#states[id.split('.')[0]].children[id.split('.')[1]] = { color, title, content }
    else this.#states[id] = { color, title, content, children: this.#states[id].children }
  }

  //完成狀態
  finishState (id, color, title, content) {
    if (id.includes('.')) delete this.#states[id.split('.')[0]].children[id.split('.')[1]]
    else {
      for (let i = 0; i < this.#logs.length; i++) {
        if (typeof this.#logs[i] !== 'string' && this.#logs[i].stateID === id) {
          delete this.#states[id]
          this.#logs[i] = `${color}[${title}]: ${content}`
          break
        }
      }
    }
  }
}

const { FontColor } = require('../../Tools/DynamicCliBuilder')
const generateID = require('../../Tools/GenerateID')
const getPath = require('../../Tools/GetPath')