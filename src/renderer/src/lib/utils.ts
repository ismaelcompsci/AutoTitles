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
