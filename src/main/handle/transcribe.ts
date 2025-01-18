import { decode } from 'node-wav'
import fs from 'fs'
import { WhisperParams } from '../shared/shared'
import { Whisper } from 'smart-whisper'

export async function transcribe(
  _event: Electron.IpcMainInvokeEvent,
  params: WhisperParams
): Promise<{ from: number; to: number; text: string }[]> {
  const whisper = new Whisper(params.model, { gpu: true })
  const pcm = read_wav(params.fname_inp)

  const task = await whisper.transcribe(pcm, { language: 'en' })

  return await task.result
}

function read_wav(file: string): Float32Array {
  const { sampleRate, channelData } = decode(fs.readFileSync(file))

  if (sampleRate !== 16000) {
    throw new Error(`Invalid sample rate: ${sampleRate}`)
  }
  if (channelData.length !== 1) {
    throw new Error(`Invalid channel count: ${channelData.length}`)
  }

  return channelData[0]
}
