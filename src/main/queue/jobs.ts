import fs from 'fs'
import { Whisper } from 'smart-whisper'
import { Job } from 'embedded-queue'
import path from 'path'
import { QueueJob } from '../../shared/models'
import { TranscribeJobData } from '../../shared/models'
import { BrowserWindow } from 'electron'
import { encodeForWhisper } from '../handle/encode-for-whisper'
import os from 'node:os'
import { QueueManager } from './queue-manager'
import { decode } from 'node-wav'

const root = path.join(os.homedir(), '.autotitles')
const models = path.join(root, 'models')

const filename = `ggml-tiny.en.bin`
const modelPath = path.join(models, filename)

export const handleTranscribeJob = async (job: Job): Promise<void> => {
  const { data } = job as QueueJob
  const { filePath } = data as TranscribeJobData

  // @ts-ignore
  const encodedFilePath = await encodeForWhisper(filePath)

  const whisper = new Whisper(modelPath, { gpu: true })
  const pcm = read_wav(encodedFilePath)

  const config = QueueManager.getInstance().getTranscribeOptions()
  const task = await whisper.transcribe(pcm, {
    suppress_non_speech_tokens: true,
    ...config
  })

  task.on('transcribed', (subtitle) => {
    const id = `id-${subtitle.from}-${subtitle.to}`
    console.log({ id, ...subtitle })

    const window = BrowserWindow.getFocusedWindow()

    window?.webContents.send('segments:segment-added', {
      id,
      start: subtitle.from,
      end: subtitle.to,
      text: subtitle.text
    })
  })

  await whisper.free()
  fs.rm(encodedFilePath, (e) => e && console.log(e))
}

export const handleExportJob = async (job: Job): Promise<void> => {
  console.log(job.id, job.data)
}

/**
 * helpers ->
 */
export function read_wav(file: string): Float32Array {
  const { sampleRate, channelData } = decode(fs.readFileSync(file))

  if (sampleRate !== 16000) {
    throw new Error(`Invalid sample rate: ${sampleRate}`)
  }
  if (channelData.length !== 1) {
    throw new Error(`Invalid channel count: ${channelData.length}`)
  }

  return channelData[0]
}
