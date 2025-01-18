import { WhisperTask } from '@/hooks/use-transcription'
import { WhisperModel } from '@/util/models'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const downloadedModelsAtom = atomWithStorage<{ name: string; path: string }[]>(
  'downloaded-models-key',
  []
)
export const showDownloadModalDialogAtom = atom(false)

export const currentTaskAtom = atom<WhisperTask | null>(null)

export type WhisperUserConfig = {
  model?: WhisperModel
  lang: string
  maxWordsPerSegment: number
}

export const whisperUserConfigurationAtom = atomWithStorage<WhisperUserConfig>(
  'user-whisper-config',
  {
    model: undefined,
    lang: 'en',
    maxWordsPerSegment: 3
  }
)
