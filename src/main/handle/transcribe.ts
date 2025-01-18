import path from 'path'
import { promisify } from 'util'
import { WhisperParams } from '../shared/shared'
console.log(__dirname)
const { whisper } = require(path.join(__dirname, '../../whisper.cpp/build/Release/addon.node.node'))

// Define the type for the whisper function

const whisperAsync: (params: WhisperParams) => Promise<any> = promisify(whisper)

const defaultWhisperParams = {
  // use_gpu: true,
  // flash_attn: false,
  // no_prints: true,
  // comma_in_time: false,
  // translate: false,
  // no_timestamps: false,
  // audio_ctx: 0,
  // split_on_word: false,
  // max_len: 0
  use_gpu: true,
  flash_attn: false,
  no_prints: false,
  comma_in_time: true,
  translate: true,
  no_timestamps: false,
  audio_ctx: 0,
  split_on_word: true,
  max_len: 24
}

export async function transcribe(
  _event: Electron.IpcMainInvokeEvent,
  params: WhisperParams
): Promise<void> {
  const wparams: WhisperParams = {
    use_gpu: defaultWhisperParams.use_gpu,
    flash_attn: defaultWhisperParams.flash_attn,
    no_prints: defaultWhisperParams.no_prints,
    comma_in_time: defaultWhisperParams.comma_in_time,
    no_timestamps: defaultWhisperParams.no_prints,
    audio_ctx: defaultWhisperParams.audio_ctx,
    translate: defaultWhisperParams.translate,

    split_on_word: Boolean(defaultWhisperParams.split_on_word),
    max_len: Number(defaultWhisperParams.max_len),

    language: params.language,
    model: params.model,
    fname_inp: params.fname_inp
  }

  for (const [key, value] of Object.entries(wparams)) {
    console.log(key, typeof value)
  }

  const output = await whisperAsync({
    use_gpu: true,
    flash_attn: false,
    no_prints: true,
    comma_in_time: false,
    translate: true,
    no_timestamps: false,
    audio_ctx: 0,
    language: params.language,
    model: params.model,
    fname_inp: params.fname_inp
  })
  return output
}
