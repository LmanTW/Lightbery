//完成承諾
module.exports = (keys, func, maxLength) => {
  return new Promise((resolve) => {
    keys = JSON.parse(JSON.stringify(keys))

    let count = 0
    let waiting = 0

    async function check () {
      if (waiting < 1 && keys.length < 1) {
        resolve()
      } else if (waiting < maxLength && keys.length > 0) {
        count++
        waiting++
        let item = keys[0]
        keys.splice(0, 1)
        await func(item, count-1)
        waiting--
      }
    }

    let interval = setInterval(async () => {
      if (waiting < 1 && keys.length < 1) {
        clearInterval(interval)
        resolve()
      } else if (waiting < maxLength && keys.length > 0) {
        count++
        waiting++
        let item = keys[0]
        keys.splice(0, 1)
        await func(item, count-1)
        waiting--
      }
    }, 1)
  })
}