import { atom } from 'jotai'
import {
  Caption,
  ExportListSerialized,
  QueueProgress,
  TranscribeListSerialized,
  WhisperInputConfig
} from 'src/shared/models'
import type Regions from 'wavesurfer.js/dist/plugins/regions'
import { withUndo } from 'jotai-history'

export type Page =
  | 'home'
  | 'transcript-config'
  | 'transcript'
  | 'export'
  | 'model-manager'
  | 'video'
export const pageAtom = atom<Page>('home')
export const pageHistory = withUndo<Page>(pageAtom, 10)
export const mainContainerRefAtom = atom<HTMLDivElement | null>(null)

export const jobProgressAtom = atom<QueueProgress | null>()
export const jobIsRunningAtom = atom<boolean>(false)
export const transcribeJobListAtom = atom<TranscribeListSerialized[]>([])
export const exportJobListAtom = atom<ExportListSerialized[]>([])
export const captionsAtom = atom<Caption[]>([])
export const captionsByIdAtom = atom<Record<string, Caption>>({})
export const regionsAtom = atom<Regions | null>(null)
export const decodedAtom = atom(false)
export const durationAtom = atom(0)

export const playingAtom = atom(false)
export const currentTimeAtom = atom(0)
export const activeRegionIdAtom = atom<string | null>(null)

// * whisper input
export const transcribeOptionsAtom = atom<WhisperInputConfig>({} as WhisperInputConfig)
export const audioURLAtom = atom<string | null>(null)
// export const showDownloadModalDialogAtom = atom(false)
