const wcwidth = require('wcwidth')

module.exports = { getCommandSuggestion, addCommand }

let commands = {
  'stop': {
    description: '關閉 CLI',
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
  'size': {
    description: '取得圖庫的大小',
    child: []
  },
  'open <imageID>': {
    description: '打開圖片',
    child: []
  },
  '<imageID>': {
    description: '添加圖片',
    child: []
  }
}

let externalCommands = {}

//取得指令建議
function getCommandSuggestion (input) {
  let longestName = 0
  
  let result = []
  Object.keys(commands).forEach((item) => {
    if (item === '<imageID>') {
      if (!isNaN(+input)) {
        if (wcwidth(item) > longestName) longestName = wcwidth(item)
        result.push(item)
      }
    } else if ((item.includes('<') && item.includes(input.substring(0, item.indexOf('<')))) || item.includes(input)) {
      if (wcwidth(item) > longestName) longestName = wcwidth(item)
      result.push(item)
    }
  })

  let result2 = []
  Object.keys(externalCommands).forEach((item) => {
    if ((item.includes('<') && item.includes(input.substring(0, item.indexOf('<')))) || item.includes(input)) {
      if (wcwidth(item) > longestName) longestName = wcwidth(item)
      result2.push(item)
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

  if (result2.length > 0) {
    if (result.length > 0) lines.push('')
    lines.push('- 外部指令 -')
    lines.push('')
    result2.forEach((item) => {
      let string = item
      while (wcwidth(string) < longestName) string+=' '
      string+=`｜${externalCommands[item].description}`
      lines.push(string)
    
      externalCommands[item].child.forEach((item2) => {
        let string2 = `｜${item2.name}`
        while (wcwidth(string2) < longestName) string2+=' '
        string2+=`｜${item2.description}`
        lines.push(string2)
      })
    })
  }
  
  return { result: result.concat(result2), lines }
}

//添加指令
function addCommand (name, description, child) {
  externalCommands[name] = { description, child }
}