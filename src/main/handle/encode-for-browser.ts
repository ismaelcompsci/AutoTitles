import path from 'path'
import { ffmpeg } from '@/main/handle/ffmpeg'
import fs from 'fs'

export const encodeAudioForBrowser = async (
  _event: Electron.IpcMainInvokeEvent,
  input: { inputPath: string; outputPath: string }
) => {
  const { inputPath, outputPath } = input

  const dir = path.dirname(outputPath)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }

  await new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(inputPath)
      .toFormat('mp3') // Specify MP3 format
      .audioCodec('libmp3lame') // Use libmp3lame codec
      .on('end', () => {
        resolve(outputPath)
      })
      .on('error', (err) => {
        console.error('Error:', err.message)
        reject(err)
      })
      .save(outputPath) // Save to the specified path
  })

  return outputPath
}
