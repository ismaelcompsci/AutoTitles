import { clsx, type ClassValue } from 'clsx'
import { ModelCategory } from 'src/shared/models'
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
export const supportedFormats = ['mp4', 'mov']

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

export const getBasename = (file: string) => file.split(/[\\/]/).pop()

export const getMediaDuration = (mediaUrl: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const media = document.createElement('video') // Works for both video and audio
    media.src = mediaUrl
    media.preload = 'metadata'

    media.onloadedmetadata = () => {
      resolve(media.duration)
      media.remove() // Clean up
    }

    media.onerror = () => {
      reject(new Error('Failed to load media'))
      media.remove() // Clean up
    }
  })
}

export function upperCaseFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const filterModelListByTab = (modelList: ModelCategory[], tab: string) => {
  return modelList.reduce((acc: ModelCategory[], modelGroup) => {
    let filteredItems = [...modelGroup.items]

    switch (tab) {
      case 'downloaded':
        filteredItems = modelGroup.items.filter((item) => !item.disabled)
        if (filteredItems.length > 0) {
          acc.push({
            ...modelGroup,
            items: filteredItems
          })
        }
        break
      case 'multilingual':
        if (modelGroup.id === 'multilingual') {
          acc.push(modelGroup)
        }
        break
      case 'english':
        if (modelGroup.id === 'english') {
          acc.push(modelGroup)
        }
        break
      case 'all':
      default:
        acc.push(modelGroup)
        break
    }
    return acc
  }, [])
}
