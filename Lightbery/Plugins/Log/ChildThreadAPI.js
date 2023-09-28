const { parentPort } = require('worker_threads')


//CLI 子線程 API
module.exports = class {
  //添加日誌
  static addLog (type, content) {
    parentPort.postMessage({ type: 'addLog', logType: type, content })
  }

  //添加狀態
  static async addState (color, title, content, parentState) {
    let id = await sendRequest({ type: 'addState', color, title, content, parentState })

    return class {
      static get id () {return id}

      //改變狀態
      static change (color, title, content) {
        parentPort.postMessage({ type: 'changeState', id, color, title, content })
      }

      //完成狀態
      static finish (color, title, content) {
        parentPort.postMessage({ type: 'finishState', id, color, title, content })
      }
    }
  }
}

const sendRequest = require('../../Modules/Tools/WorkerRequest')