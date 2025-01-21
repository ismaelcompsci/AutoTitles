import { WhisperTask } from '@/hooks/use-transcription'
import { WhisperModel } from '@/util/models'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { RefObject } from 'react'
import type WaveSurfer from 'wavesurfer.js'
import type Regions from 'wavesurfer.js/dist/plugins/regions'

export const downloadedModelsAtom = atomWithStorage<{ name: string; path: string }[]>(
  'downloaded-models-key',
  []
)
export const showDownloadModalDialogAtom = atom(false)
export const currentTaskAtom = atom<WhisperTask | null>(null)
export const waveformContainerRefAtom = atom<RefObject<HTMLDivElement> | null>(null)
export const mediaProviderAtom = atom<HTMLMediaElement | null>(null)
export const regionsAtom = atom<Regions | null>(null)
export const decodedAtom = atom(false)
export const durationAtom = atom(0)
export const wavesurferAtom = atom<WaveSurfer | null>(null)
export const panelsRefsAtom = atom<RefObject<ResizeablePanelRef> | null>(null)

export type ResizeablePanelRef = {
  groupElement: HTMLElement | null
  bottomPanelElement: HTMLElement | null
  topPanelElement: HTMLElement | null
  resizeHandleElement: HTMLElement | null
}
export type WhisperUserConfig = {
  model?: WhisperModel
  lang: string
  maxLen: number
}

export const whisperUserConfigurationAtom = atomWithStorage<WhisperUserConfig>(
  'user-whisper-config',
  {
    model: undefined,
    lang: 'en',
    maxLen: 60
  }
)
