import { clsx, type ClassValue } from 'clsx'
import { WhisperResponse } from '../../../shared/models'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function secondsToTimestamp(seconds: number) {
  const h = Math.floor(seconds / 3600).toString()
  const m = Math.floor((seconds % 3600) / 60).toString()
  const s = Math.floor((seconds % 3600) % 60).toString()

  if (h === '0') {
    return `${m.padStart(2, '0')}:${s.padStart(2, '0')}`
  } else {
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`
  }
}

export function millisecondsToTimestamp(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

export const clampPosition = (duration: number, time: number): number => {
  return Math.max(0, Math.min(duration, time))
}

export const supportedFormats = [
  'MP3',
  'WAV',
  'M4A',
  'AAC',
  'FLAC',
  'OGG',
  'OPUS',
  'MP4',
  'MOV',
  'MKV'
]

export function getMediaType(mimeType: string): 'video' | 'audio' | 'unsupported' {
  const audioFormats = [
    'audio/mpeg', // MP3
    'audio/wav', // WAV
    'audio/mp4', // M4A
    'audio/aac', // AAC
    'audio/flac', // FLAC
    'audio/ogg', // OGG
    'audio/opus' // OPUS
  ]

  const videoFormats = [
    'video/mp4', // MP4
    'video/quicktime', // MOV
    'video/x-matroska' // MKV
  ]

  if (audioFormats.includes(mimeType)) {
    return 'audio'
  } else if (videoFormats.includes(mimeType)) {
    return 'video'
  } else {
    return 'unsupported'
  }
}

export const scrollItemToCenter = (element: HTMLElement, container: HTMLElement) => {
  if (!element) return
  if (!container) return

  // const activeElementTop = element.offsetTop
  // const activeElementHeight = element.offsetHeight
  // const containerHeight = element.clientHeight

  // const scrollPosition = activeElementTop - containerHeight / 2 + activeElementHeight / 2

  element.scrollIntoView({ block: 'center' })
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
