export interface ImagePixelData {
  width: number
  height: number
  colors: Uint8Array
  pixelCount: number
}

export async function loadImagePixels(src: string): Promise<ImagePixelData> {
  const img = new Image()
  img.crossOrigin = 'anonymous'

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })

  const { width, height } = img

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Failed to create canvas context')
  }

  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, width, height)

  return {
    width,
    height,
    colors: new Uint8Array(imageData.data),
    pixelCount: width * height,
  }
}
