import fs from 'fs'
import { WhisperResponse } from '../../shared/models'

interface SubtitleData {
  from: number
  to: number
  text: string
}

export const exportSubtitles = async (
  _event: Electron.IpcMainInvokeEvent,
  args: { filepath: string; data: SubtitleData[]; type: string }
) => {
  const { filepath, data, type } = args

  let content = ''
  switch (type) {
    case 'srt':
      content = generateSRT(data)
      break
    default:
      throw new Error(`Unsupported subtitle format: ${type}`)
  }

  fs.writeFileSync(filepath, content, 'utf-8')
  return filepath
}

// Generate SRT content
export function generateSRT(data: WhisperResponse): string {
  return data
    .map((item, index) => {
      const startTime = formatTime(item.from)
      const endTime = formatTime(item.to)
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
