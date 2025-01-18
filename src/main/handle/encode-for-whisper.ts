import { randomUUID } from 'crypto'
import { ffmpeg } from './ffmpeg'
import { DEFAULT_DOWNLOADS_DIR } from './filesystem'

export const encodeForWhisper = async (_event: Electron.IpcMainInvokeEvent, inputFile: string) => {
  const newFile = `${DEFAULT_DOWNLOADS_DIR}/${randomUUID()}.wav`

  await new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(inputFile)
      .audioFrequency(16000)
      .audioBitrate(16000)
      .audioFilters(['lowpass=3000', 'highpass=200', 'afftdn=nf=-80'])
      .audioChannels(1)
      .on('error', (err) => {
        console.error(err)
        reject(err)
      })
      .on('end', () => {
        resolve(newFile)
      })
      .save(newFile)
  })
  return newFile
}

export const extractAudio = async () => {}
