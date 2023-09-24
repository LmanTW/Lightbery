const { spawn } = require('child_process')
const wcwidth = require('wcwidth')
const os = require('os')

//命令行操作介面
module.exports = (lightbery, log) => {
  const commands = {
    'stop': {
      description: '關閉 CLI',
      child: []
    },
    'size': {
      description: '取得圖庫的大小',
      child: []
    },
    'check <imageID>': {
      description: '檢查圖片 (不提供 <imageID> 將檢查整個圖庫)',
      child: [
        { name: '-d', description: '只檢查圖片的資料' },
        { name: '-r', description: '只檢查是否有重複的圖片' }
      ]
    },
    'remove <imageID>': {
      description: '移除圖片',
      child: []
    },
    'open <imageID>': {
      description: '打開圖片',
      child: []
    },
    '<imaegID>': {
      description: '添加圖片',
      child: []
    }
  }

  //取得指令建議
  function getCommandSuggestion (input) {
    let result = []
    let longestName = 0

    Object.keys(commands).forEach((item) => {
      if ((item.includes('<') && item.includes(input.substring(0, item.indexOf('<')))) || item.includes(input)) {
        if (wcwidth(item) > longestName) longestName = wcwidth(item)
        result.push(item)
      }
    })

    let lines = []

    result.forEach((item) => {
      let string = item
      while (wcwidth(string) < longestName) string+=' '
      string+=`｜${commands[item].description}`
      lines.push(string)

      commands[item].child.forEach((item2) => {
        let string2 = `｜${item2.name}`
        while (wcwidth(string2) < longestName) string2+=' '
        string2+=`｜${item2.description}`
        lines.push(string2)
      })
    })

    return { result, lines }
  }

  let commandSuggestion = getCommandSuggestion('').lines

  let cli = new CLI()
    .addPage('日誌', () => log.get())
    .addPage('指令', () => commandSuggestion)
    .event('enter', (data) => {
      commandSuggestion = getCommandSuggestion('').lines

      cli.switchPage(0)
      
      let command = data.split(' ')

      if (command[0] === 'stop') {
        process.stdout.write('\x1B[2J\x1B[3J\x1B[H\x1Bc')
        process.exit()
      } else if (command[0] === 'size') {
        log.complete(`圖庫大小: ${lightbery.size}`)
      } else if (command[0] === 'check') {
        if (command.length === 2 && !command[1].includes('-')) {}
        else lightbery.check(undefined, command[1])
      } else if (command[0] === 'remove') {
        lightbery.remove(command[1])
      } else if (command[0] === 'open') {
        if (lightbery.get(command[1]) === undefined) log.error(`找不到圖片 ${command[1]}`)
        else {
          let command2
          if (os.platform() === 'linux') command2 = 'xdg-open'
          else if (os.platform() === 'darwin') command2 = 'open'
          else if (os.platform() === 'win32') command2 = 'explorer'
          
          spawn(command2, [getPath(lightbery.path, ['Images', `${command[1]}.jpg`])])
        }
      } else lightbery.add(command[0])
    })
    .event('input', () => {
      commandSuggestion = getCommandSuggestion(cli.data.input).lines
      cli.switchPage(1)
    })
    .event('keyPress', (data) => {
      if (data.toString('hex') === '7f') commandSuggestion = getCommandSuggestion(cli.data.input).lines
      else if (data.toString('hex') === '09') {
        let result = getCommandSuggestion(cli.data.input).result[0]
        if (result.includes('<')) cli.setInput(result.substring(0, result.indexOf('<')))
        else cli.setInput(result)
      }
    })
}

const { CLI } = require('../Tools/DynamicCliBuilder')
const getPath = require('../Tools/GetPath')