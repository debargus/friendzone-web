import { Crop } from 'react-image-crop'

export function getCroppedImg(
    imageEl: HTMLImageElement,
    pixelCrop: Crop
): Promise<{ imgBlob: Blob; base64Image: string }> {
    const canvas = document.createElement('canvas')
    const scaleX = imageEl.naturalWidth / imageEl.width
    const scaleY = imageEl.naturalHeight / imageEl.height
    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height
    const ctx = canvas.getContext('2d')

    if (ctx === null) throw Error('ctx not found')

    ctx.drawImage(
        imageEl,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    )

    const base64Image = canvas.toDataURL('image/jpeg')

    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) {
                resolve({
                    imgBlob: file,
                    base64Image
                })
            } else {
                reject('blob not found')
            }
        }, 'image/jpeg')
    })
}
