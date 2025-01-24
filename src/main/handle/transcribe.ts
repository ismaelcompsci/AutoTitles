import { decode } from 'node-wav'
import fs from 'fs'
import { WhisperParams, WhisperResponse } from '../../shared/models'
import { Whisper } from 'smart-whisper'

export async function transcribe(
  _event: Electron.IpcMainInvokeEvent,
  params: WhisperParams
): Promise<WhisperResponse> {
  const whisper = new Whisper(params.model, { gpu: true })
  const pcm = read_wav(params.audioInput)

  const whisperParams = {
    n_threads: 4,
    language: 'en',
    best_of: 5,
    beam_size: 1,
    n_max_text_ctx: 0,
    temperature_inc: 0.2,
    entropy_thold: 2.4,
    translate: false,
    split_on_word: params.split_on_word,
    token_timestamps: params.tokenTimestamps,
    max_len: params.maxLen
  }

  console.log({ whisperParams })
  const task = await whisper.transcribe(pcm, {
    ...whisperParams,
    suppress_non_speech_tokens: true
  })

  // task.on('transcribed', (ev) => {
  //   console.log('OUT', ev)
  // })

  const result = await task.result
  await whisper.free()
  return result
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
