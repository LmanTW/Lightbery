//抓取圖片的資訊
module.exports = async (imageID) => {
  let data = JSON.parse((await httpsGet(`https://www.pixiv.net/ajax/illust/${imageID}`)).toString())

  if (data.error) return { error: true, content: 'Can Not Fetch Image Info' }

  data = data.body

  return {
    error: false,
    data: {
      id: data.illustId,

      url: (data.pageCount > 1) ? `https://pixiv.cat/${data.illustId}-1.jpg` : `https://pixiv.cat/${data.illustId}.jpg`,
      width: data.width,
      height: data.height,

      title: data.title,
      description: data.description,
      tags: data.tags.tags.map((item) => item.tag),

      author: {
        id: data.userId,
        name: data.userName
      },

      ai: data.aiType === 2
    }
  }
}

const httpsGet = require('./HttpsGet')