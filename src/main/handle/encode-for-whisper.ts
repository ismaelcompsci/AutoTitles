import { randomUUID } from 'crypto'
import { ffmpeg } from './ffmpeg'
import { app } from 'electron'

const tmp = app.getPath('temp')

// TODO STORE WAV FILES SOMEWHERE ELSE
export const encodeForWhisper = async (inputFile: string) => {
  const newFile = `${tmp}/${randomUUID()}.wav`

  await new Promise((resolve, reject) => {
    ffmpeg()
      .addInput(inputFile)
      .audioFrequency(16000)
      .audioBitrate(16000)
      .audioFilters(['lowpass=3000', 'highpass=200', 'afftdn=nf=-80'])
      .audioChannels(1)
      .on('error', (error) => {
        console.error(error)
        reject(new Error('Could not decode video. Video is not supported'))
      })
      .on('end', () => {
        resolve(newFile)
      })
      .save(newFile)
  })

  return newFile
}
