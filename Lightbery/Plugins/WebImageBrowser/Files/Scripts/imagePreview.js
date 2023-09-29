//圖片
export default async (parent, imageID) => {
  let div = parent.appendChild(createElement('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#032039', borderRadius: '10px', margin: '5px', width: '200px', height: '200px', overflow: 'hidden' }}))
  
  let data = await (await fetch(`/api/getImageData?imageID=${imageID}`)).text()
  
  let image = div.appendChild(createElement('img', { src: `data:image/jpeg;base64,${data}`, classList: 'imagePreview', style: { opacity: 0, cursor: 'pointer' }}))

  image.onload = () => {
    if (image.width > image.height) image.style.height = '200px'
    else image.style.width = '200px'
    
    image.style.opacity = 1
  }
}

import createElement from '/script/createElement.js'