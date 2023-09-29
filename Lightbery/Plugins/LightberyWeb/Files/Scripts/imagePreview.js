//圖片
export default async (parent, imageID) => {
  let div = parent.appendChild(createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#032039', borderRadius: '10px', margin: '5px', width: '200px', height: '200px', overflow: 'hidden' }}))
  
  let previewData = await (await fetch(`/api/getImageData?imageID=${imageID}&quality=50`)).text()
  
  let imagePreview = div.appendChild(createElement('img', { src: `data:image/jpeg;base64,${previewData}`, classList: 'imagePreview', style: { opacity: 0, cursor: 'pointer' }}))

  imagePreview.onload = () => {
    if (imagePreview.width > imagePreview.height) imagePreview.style.height = '200px'
    else imagePreview.style.width = '200px'
    
    imagePreview.style.opacity = 1

    let open = false

    imagePreview.onclick = async () => {
      if (!open) {
        let div2 = document.body.appendChild(createElement('div', { style: { position: 'fixed', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', left: '0px', top: '0px', width: '100vw', height: '100vh', backdropFilter: 'blur(5px) brightness(75%)', animation: 'opacityIn 0.5s 1', overflowY: 'scroll', zIndex: 999 }}))
        let div3 = div2.appendChild(createElement('div', { style: { flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}))

        let imageInfo = await (await fetch(`/api/getImageInfo?imageID=${imageID}`)).json()
        let imageData = await (await fetch(`/api/getImageData?imageID=${imageID}&quality=100`)).text()
      
        let image = div3.appendChild(createElement('img', { src: `data:image/jpeg;base64,${imageData}`, classList: 'shadow', style: { borderRadius: '5px', height: '90vh' }}))
      
        let div4 = div2.appendChild(createElement('div', { classList: 'shadow', style: { flexShrink: 0, backgroundColor: '#032039', borderRadius: '5px', marginLeft: '20px', marginTop: '5vh', maxHeight: '90vh', maxWidth: '50vw' }}))
        div4.appendChild(createElement('h1', { innerHTML: imageInfo.title, style: { color: '#448FA3', whiteSpace: 'wrap', margin: '0px', padding: '10px', paddingBottom: '0px' } }))
        div4.appendChild(createElement('h4', { innerHTML: `by <a href="/?query=${imageInfo.author.name}&type=author" style="color: #0197F6">${imageInfo.author.name}</a>`, style: { color: '#448FA3', whiteSpace: 'wrap', margin: '0px', padding: '10px', paddingTop: '0px' }}))
        div4.appendChild(createElement('h3', { innerHTML: imageInfo.description, style: { color: '#448FA3', whiteSpace: 'wrap', margin: '0px', padding: '10px', paddingBottom: '0px' }}))

        let div5 = div4.appendChild(createElement('div', { style: { display: 'flex', flexWrap: 'wrap', marginLeft: '10px', marginTop: '15px' }}))
        imageInfo.tags.forEach((item) => div5.appendChild(createElement('h4', { innerHTML: item, style: { backgroundColor: '#053966', color: '#68C5DB', borderRadius: '5px', margin: '3px', padding: '2px 5px', cursor: 'pointer' }})).onclick = () => window.location.href = `/?query=${item}&type=tags`)
      
        div2.addEventListener('click', () => {
          div2.style.animation = 'opacityOut 0.5s 1'
          setTimeout(() => div2.remove(), 500)
        }, { once: true })
      }
    }
  }
}

import createElement from '/script/createElement.js'