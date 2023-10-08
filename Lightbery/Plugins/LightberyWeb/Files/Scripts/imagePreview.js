//圖片預覽
export default async (parent, imageID) => {
  let div = parent.appendChild(createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#032039', borderRadius: '10px', margin: '5px', width: '200px', height: '200px', overflow: 'hidden' }}))
  
  let previewData = await (await fetch(`/api/getImageData?imageID=${imageID}&quality=50`)).text()
  
  let imagePreview = div.appendChild(createElement('img', { src: `data:image/jpeg;base64,${previewData}`, classList: 'imagePreview', style: { opacity: 0, cursor: 'pointer' }}))

  imagePreview.onload = () => {
    if (imagePreview.width > imagePreview.height) imagePreview.style.height = '200px'
    else imagePreview.style.width = '200px'
    imagePreview.style.opacity = 1

    let state = false
    imagePreview.onclick = async () => {
      if (!state) {
        state = true
        await fullImage(imageID) 
        state = false
      }
    }
  }
}

import createElement from '/script/createElement.js'
import fullImage from '/script/fullImage.js'