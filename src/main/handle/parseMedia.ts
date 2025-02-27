import { ffprobe, FfprobeData } from 'fluent-ffmpeg'

export const parseMedia = async (file: string) => {
  const getMetadata = async (): Promise<FfprobeData> => {
    return new Promise((resolve, reject) => {
      ffprobe(file, (err, metadata) => {
        if (err) {
          reject(err)
          return
        }
        resolve(metadata)
      })
    })
  }

  const metadata = await getMetadata()
  const duration = metadata.format.duration
  if (!duration) {
    throw new Error('Failed to get duration')
  }

  const [fpsNum, fpsDen] = metadata.streams[0].r_frame_rate?.split('/') ?? ['', '']
  const fps = parseInt(fpsNum) / parseInt(fpsDen)
  const width = metadata.streams[0].width
  const height = metadata.streams[0].height

  if (!width) {
    throw new Error('Failed to get width')
  }

  if (!height) {
    throw new Error('Failed to get height')
  }

  const aspectRatio = width / height

  return { duration, fps, width, height, aspectRatio }
}
