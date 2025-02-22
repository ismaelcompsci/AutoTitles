import EmbeddedQueue from 'embedded-queue'
import fs from 'fs'
import { Whisper } from 'smart-whisper'
import path from 'path'
import { ExportJob, Subtitle, TranscribeJob } from '../../shared/models'
import { BrowserWindow } from 'electron'
import { encodeForWhisper } from '../handle/encode-for-whisper'
import { decode } from 'node-wav'
import { SubtitleService } from '../services/subtitle-service'
import { ConfigService } from '../services/config-service'
import { IPCCHANNELS } from '../../shared/constants'
import { modelsDir } from '../model-manager'

const subtitleService = SubtitleService.getInstance()
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
    const whisper = new Whisper(modelPath, { gpu: true })
    const pcm = read_wav(encodedFilePath)
    await job.setProgress(25, 100)

    const task = await whisper.transcribe(pcm, {
      ...config,
      suppress_non_speech_tokens: true,
      print_progress: false,
      suppress_blank: true,
      print_realtime: false,
      print_special: false,
      print_timestamps: false,
      debug_mode: false
      // token_timestamps: true,
      // format: 'detail',
      // split_on_word: true,
      // max_len: 1
    })

    const durationInMilliseconds = duration * 1000
    let index = 0

    task.on('transcribed', (subtitle) => {
      if (job.state !== EmbeddedQueue.State.ACTIVE) return

      const id = `id-${subtitle.from}-${subtitle.to}`
      console.log(subtitle)

      const window = BrowserWindow.getFocusedWindow()
      window?.webContents.send(IPCCHANNELS.SUBTITLE_ADDED, {
        id,
        start: subtitle.from,
        end: subtitle.to,
        text: subtitle.text
      })

      subtitleService.insertSubtitle({
        fileName: basename,
        segmentIndex: index,
        segmentText: subtitle.text,
        startTime: subtitle.from,
        endTime: subtitle.to,
        duration: subtitle.to - subtitle.from
      })

      index += 1

      const transcriptionProgress = 50 + Math.min((subtitle.to / durationInMilliseconds) * 49, 49)
      job.setProgress(Math.round(transcriptionProgress), 100)
    })

    await task.result
    await whisper.free()

    fs.rmSync(encodedFilePath)
    await job.setProgress(100, 100)
  } catch (e) {
    console.log('[handleTranscribeJob] Error: ', e)
  }
}

export const handleExportJob = async (job: ExportJob): Promise<string> => {
  const { originalMediaFilePath } = job.data
  const basename = path.basename(originalMediaFilePath)
  console.log('[handleExportJob] starting ', basename)

  const config = configService.getExportConfig()
  const subs = subtitleService.getSubtitlesByFileName(basename)

  let content = ''
  switch (config.format) {
    case 'srt':
      content = generateSRT(
        subs.map((s) => ({
          id: `id-${s.startTime}-${s.endTime}`,
          start: s.startTime,
          end: s.endTime,
          text: s.segmentText
        }))
      )
      break
  }

  const basenameNoExt = path.basename(originalMediaFilePath, path.extname(originalMediaFilePath))
  const outputPath = path.join(config.folder, basenameNoExt + '.srt')
  fs.writeFileSync(outputPath, content, 'utf-8')

  subtitleService.removeAll()
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
export function generateSRT(data: Subtitle[]): string {
  return data
    .map((item, index) => {
      const startTime = formatTime(item.start)
      const endTime = formatTime(item.end)
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
