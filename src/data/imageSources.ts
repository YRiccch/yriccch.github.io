import generatedImages from './generatedImages.json'

type ResponsiveImage = {
  src: string
  srcSet?: string
  width?: number
  height?: number
}

const images: Record<string, ResponsiveImage> = generatedImages

/** Build-generated previews; new or unsupported assets retain their original URL. */
export function imageSource(source: string): ResponsiveImage {
  return images[source] ?? { src: source }
}
