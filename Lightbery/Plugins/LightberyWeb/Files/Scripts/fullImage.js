//完整圖片
export default async (imageID) => {
  return new Promise(async (resolve) => {
    window.history.pushState({}, null, `?${add(remove(window.location.search, 'imageID'), [`imageID=${imageID}`])}`)

    updateTitle()


    let div = document.body.appendChild(createElement('div', { style: { position: 'fixed', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', left: '0px', top: '0px', width: '100vw', height: '100vh', backdropFilter: 'blur(5px) brightness(75%)', '-webkit-backdrop-filter': 'blur(10px) brightness(75%)', animation: 'opacityIn 0.5s 1', overflowY: 'scroll', zIndex: 998 }}))
    let div2 = div.appendChild(createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}))
    let image_loading = div2.appendChild(createElement('img', { src: '/image/cloudDownload.svg', style: { width: '100px', animation: 'fetching 1s infinite' }}))
  
    let imageInfo = await (await fetch(`/api/getImageInfo?imageID=${imageID}`)).json()
    let imageData = await (await fetch(`/api/getImageData?imageID=${imageID}&quality=100`)).text()

    div2.remove()

    div2 = div.appendChild(createElement('div', { style: { backgroundColor: '#032039', borderRadius: '10px', marginTop: 'calc(5vw)', marginBottom: 'calc(5vw)', width: 'calc(100vw - 10vw)', overflow: 'hidden' }}))
    let div3 = div2.appendChild(createElement('div', { style: { display: 'flex', justifyContent: 'center', marginBottom: '5px', width: 'calc(100vw - 10vw)' }}))
    let div4 = div3.appendChild(createElement('div', { style: { display: 'flex', justifyContent: 'center', backgroundColor: '#031C32', borderRadius: '5px',  marginTop: '2.5vw', width: 'calc(100vw - 15vw)', overflow: 'hidden' }}))
    let image = div4.appendChild(createElement('img', { src: `data:image/jpeg;base64,${imageData}`, style: { opacity: 0 }}))
    image.onload = () => {
      if (image.height > image.width) image.style.height = 'calc(100vh - 100px)'
      else image.style.width = 'calc(100vw - 15vw)'

      image.style.opacity = 1
    }
    let div5 = div2.appendChild(createElement('div', { style: { display: 'flex', justifyContent: 'center', width: 'calc(100vw - 10vw)' }}))
    let div6 = div5.appendChild(createElement('div', { style: { width: 'calc(100vw - 15vw)' }}))
    div6.appendChild(createElement('h1', { innerHTML: `${imageInfo.title}${(imageInfo.ai) ? '<span style="background-color: #053966; color: #F50035; border-radius: 5px; font-size: 15px; padding: 0px 5px; margin-left: 10px">AI</span>' : ''}`, style: { color: '#448FA3', whiteSpace: 'wrap', margin: '0px' } }))
    div6.appendChild(createElement('h4', { innerHTML: `by <a href="/?query=${imageInfo.author.name}&type=author" style="color: #0197F6">${imageInfo.author.name}</a>`, style: { color: '#448FA3', whiteSpace: 'wrap', margin: '0px', marginBottom: '25px' }}))
    
    if (imageInfo.description !== '') div6.appendChild(createElement('h3', { innerHTML: imageInfo.description, style: { backgroundColor: '042544', borderRadius: '5px', color: '#448FA3', whiteSpace: 'wrap', padding: '5px 7px', margin: '0px', marginBottom: '25px' }}))

    let div7 = div6.appendChild(createElement('div', { style: { display: 'flex', flexWrap: 'wrap', marginBottom: '25px' }}))
    imageInfo.tags.forEach((item) => div7.appendChild(createElement('h4', { innerHTML: item, style: { backgroundColor: '#053966', color: '#68C5DB', borderRadius: '5px', margin: '0px', marginRight: '5px', marginBottom: '5px', padding: '2px 5px', cursor: 'pointer' }})).onclick = () => window.location.href = `/?query=${item}&type=tags`)

    let div8 = div6.appendChild(createElement('div', { style: { display: 'flex', flexWrap: 'wrap', marginBottom: '25px' }}))
    div8.appendChild(createElement('img', { src: '/image/download.svg', style: { marginRight: '25px', width: '40px', cursor: 'pointer' }})).onclick = () => window.open(`/api/downloadImage?imageID=${imageID}`, '_blank')
    div8.appendChild(createElement('img', { src: '/image/openURL.svg', style: { width: '40px', cursor: 'pointer' }})).onclick = () => window.open(`https://www.pixiv.net/artworks/${imageID}`, '_blank')
    
    //添加聆聽器
    function listener () {
      div.addEventListener('click', (e) => {
        if (e.target === div) {
          window.history.pushState({}, null, `?${remove(window.location.search, 'imageID')}`)
          updateTitle()

          div.style.animation = 'opacityOut 0.5s 1'
          setTimeout(() => {
            div.remove()
            resolve()
          }, 475)
        } else listener()
      }, { once: true })
    }

    listener()
  })
}

import createElement from '/script/createElement.js'
import updateTitle from '/script/updateTitle.js'
import { add, remove } from '/script/query.js'