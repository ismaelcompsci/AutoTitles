import EmbeddedQueue from 'embedded-queue'
import fs from 'fs'
import { Whisper } from 'smart-whisper'
import path from 'path'
import { Caption, ExportJob, TranscribeJob } from '../../shared/models'
import { BrowserWindow } from 'electron'
import { encodeForWhisper } from '../handle/encode-for-whisper'
import { decode } from 'node-wav'
import { CaptionService } from '../services/caption-service'
import { ConfigService } from '../services/config-service'
import { IPCCHANNELS, supportedLanguages } from '../../shared/constants'
import { MODEL_TO_ALIGNMENT_PRESET, modelsDir } from '../model-manager'

const captionService = CaptionService.getInstance()
const configService = ConfigService.getInstance()

export const handleTranscribeJob = async (job: TranscribeJob): Promise<void> => {
  try {
    await job.setProgress(0, 100)
    const { data } = job
    const { originalMediaFilePath, duration } = data
    const config = configService.getWhisperConfig()
    const modelPath = path.join(modelsDir, `ggml-${config.model}.bin`)
    const basename = path.basename(modelPath)
    const encodedFilePath = await encodeForWhisper(originalMediaFilePath)
    const whisper = new Whisper(modelPath, {
      use_gpu: true,
      dtw_token_timestamps: true,
      dtw_aheads_preset: MODEL_TO_ALIGNMENT_PRESET[config.model]
    })
    const pcm = read_wav(encodedFilePath)
    await job.setProgress(25, 100)

    if (config.language !== 'auto' && !supportedLanguages[config.language]) {
      throw new Error(`Language ${config.language} is not supported`)
    }

    if (!isModelMultilingual(config.model)) {
      if (config.translate || config.language !== 'en') {
        config.language = 'en'
        config.translate = false
        console.log('WARNING: model is not multilingual, ignoring language and translation options')
      }
    }

    const task = await whisper.transcribe(pcm, {
      print_progress: false,
      print_realtime: false,
      print_special: false,
      print_timestamps: false,
      debug_mode: false,
      suppress_blank: false,
      suppress_non_speech_tokens: true,
      token_timestamps: true,
      format: 'detail',
      split_on_word: true,
      max_len: config.maxLen === 0 ? 60 : config.maxLen,
      language: config.language
    })

    const durationInMilliseconds = duration * 1000
    // WHEN TOKEN_TIMESTAMPS IS TRUE
    // THIS GETS BAD SUBTITLES
    // BUT THE task.result is fine
    task.on('transcribed', (caption) => {
      if (job.state !== EmbeddedQueue.State.ACTIVE) return

      const transcriptionProgress = 50 + Math.min((caption.to / durationInMilliseconds) * 49, 49)
      job.setProgress(Math.round(transcriptionProgress), 100)
    })

    const result = await task.result
    const window = BrowserWindow.getFocusedWindow()

    for (const [index, caption] of result.entries()) {
      console.log(index, caption)

      if (caption.text === '') {
        continue
      }

      const addedCaption: Caption = {
        text: index === 0 ? caption.text.trimStart() : caption.text,
        startMs: caption.from,
        endMs: caption.to,
        timestampMs: caption.tokens[0].t_dtw === -1 ? null : caption.tokens[0].t_dtw * 10,
        confidence: caption.tokens[0].p
      }

      window?.webContents.send(IPCCHANNELS.CAPTION_ADDED, addedCaption)

      captionService.insertCaption({
        ...addedCaption,
        fileName: basename,
        captionIndex: index
      })
    }

    fs.rmSync(encodedFilePath)
    await job.setProgress(100, 100)
    await whisper.free()
  } catch (e) {
    console.log('[handleTranscribeJob] Error: ', e)
  }
}

export const handleExportJob = async (job: ExportJob): Promise<string> => {
  const { originalMediaFilePath } = job.data
  const basename = path.basename(originalMediaFilePath)
  console.log('[handleExportJob] starting ', basename)

  const config = configService.getExportConfig()
  const subs = captionService.getCaptionsByFileName(basename)

  let content = ''
  switch (config.format) {
    case 'srt':
      content = generateSRT(subs)
      break
  }

  const basenameNoExt = path.basename(originalMediaFilePath, path.extname(originalMediaFilePath))
  const outputPath = path.join(config.folder, basenameNoExt + '.srt')
  fs.writeFileSync(outputPath, content, 'utf-8')

  captionService.removeAll()
  return outputPath
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

// Generate SRT content
export function generateSRT(data: Caption[]): string {
  return data
    .map((item, index) => {
      const startTime = formatTime(item.startMs)
      const endTime = formatTime(item.endMs)
      return `${index + 1}\n${startTime} --> ${endTime}\n${item.text}\n`
    })
    .join('\n')
}
// Helper to convert milliseconds to SRT timestamp format
function formatTime(ms: number) {
  const milliseconds = (ms % 1000).toString().padStart(3, '0')
  const seconds = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
    .toString()
    .padStart(2, '0')
  const hours = Math.floor(ms / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0')
  return `${hours}:${minutes}:${seconds},${milliseconds}`
}

const isModelMultilingual = (model: string) => {
  if (!model.endsWith('.en') && model.startsWith('large')) {
    return true
  }
  return false
}
