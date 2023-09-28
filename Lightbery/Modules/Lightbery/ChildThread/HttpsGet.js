const https = require('https')

//Https 取得
module.exports = async (url, progressCallback) => {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        Referer: 'https://www.pixiv.net/',

        'Accept-Language': 'en-US'
      },
    }, (res) => {
      let buffer = Buffer.alloc(0)
      res.on('data', (chunk) => {
        buffer = Buffer.concat([buffer, chunk])
        if (progressCallback !== undefined) progressCallback((100/parseInt(res.headers['content-length'], 10))*buffer.length)
      })
      res.on('end', () => resolve(buffer))
    })
  })
}