import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import {
  ExportListSerialized,
  Subtitle,
  TranscribeListSerialized,
  WhisperInputConfig
} from 'src/shared/models'
import type Regions from 'wavesurfer.js/dist/plugins/regions'

export type Page = 'home' | 'transcript-config' | 'transcript' | 'export'
export const pageAtom = atom<Page>('home')
export const mainContainerRefAtom = atom<HTMLDivElement | null>(null)

export const transcribeJobListAtom = atom<TranscribeListSerialized[]>([])
export const exportJobListAtom = atom<ExportListSerialized[]>([])
export const subtitlesAtom = atom<Subtitle[]>([])
export const subtitlesByIdAtom = atom<Record<string, Subtitle>>({})
export const regionsAtom = atom<Regions | null>(null)
export const decodedAtom = atom(false)
export const durationAtom = atom(0)

export const playingAtom = atom(false)
export const currentTimeAtom = atom(0)
export const activeRegionIdAtom = atom<string | null>(null)

// * whisper input
export const transcribeOptionsAtom = atom<WhisperInputConfig>({} as WhisperInputConfig)
export const audioURLAtom = atom<string | null>(null)

export const downloadedModelsAtom = atomWithStorage<{ name: string; path: string }[]>(
  'downloaded-models-key',
  []
)
export const showDownloadModalDialogAtom = atom(false)
