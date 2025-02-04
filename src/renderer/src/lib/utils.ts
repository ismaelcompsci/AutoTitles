import { clsx, type ClassValue } from 'clsx'
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
  'wav',
  'mp3',
  'm4a',
  'aac',
  'flac',
  'ogg',
  'opus',
  'mp4',
  'mov',
  'mkv'
]

export type MediaType = 'video' | 'audio' | 'unsupported'

export function getMediaType(mimeType: string): MediaType {
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
