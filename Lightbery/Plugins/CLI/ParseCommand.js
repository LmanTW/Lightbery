//解析指令
module.exports = (text) => {
  let command = { path: [], parameter: [] }

  text.split(' ').forEach((item) => {
    if (item[0] === '-') command.parameter.push(item)
    else command.path.push(item)
  })

  return command
}