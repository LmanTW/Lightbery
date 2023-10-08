//文字顏色
module.exports = class {
  //紅色
  static get red () {return '\x1b[31m'}
  static get brightRed () {return '\x1b[92m'}

  //黃色
  static get yellow () {return '\x1b[33m'}
  static get brightYellow () {return '\x1b[93m'}

  //綠色
  static get green () {return '\x1b[32m'}
  static get brightGreen () {return '\x1b[92m'}

  //青色
  static get cyan () {return '\x1b[36m'}
  static get brightCyan () {return '\x1b[96m'}

  //藍色
  static get blue () {return '\x1b[34m'}
  static get brightBlue () {return '\x1b[94m'}

  //紫色
  static get purple () {return '\x1b[35m'}
  static get brightPurple () {return '\x1b[95m'}

  //黑白灰色
  static get white () {return '\x1b[97m'}
  static get black () {return '\x1b[30m'}
  static get gray () {return '\x1b[90m'}
}