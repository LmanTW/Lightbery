//更新標題
export default () => {
  let params = new URLSearchParams(window.location.search)

  if (params.get('imageID') !== null ) document.title = `Lightbery｜${params.get('imageID')}`
  else if (params.get('query') === null) document.title = 'Lightbery｜探索'
  else document.title = 'Lightbery｜搜尋'
}