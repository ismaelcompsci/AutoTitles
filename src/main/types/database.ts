import { ExportConfig, WhisperInputConfig } from '../../shared/models'

export interface DBSubtitle {
  segmentId: number
  fileName: string
  segmentIndex: number
  segmentText: string
  startTime: number
  endTime: number
  duration: number
}

export const baseWhisperInputConfig: WhisperInputConfig = {
  model: '',
  useGpu: false,
  maxLen: 0,
  splitOnWord: false,
  language: 'en',
  nThreads: 4,
  beamSize: 1,
  temperatureInc: 0.2,
  entropyThold: 2.4,
  prompt: '',
  maxContext: 0
}

export const baseExportConfig: ExportConfig = {
  format: '',
  folder: ''
}

export const defaultDownloadedModels: { name: string; path: string }[] = []
