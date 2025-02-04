import type { DownloadConfig } from 'electron-dl-manager'
import type { Job } from 'embedded-queue'

export interface WhisperParams {
  language: string
  model: string
  audioInput: string

  maxLen: number // max segment length in characters
  translate: boolean
  split_on_word: boolean
  // max_tokens: number
  tokenTimestamps: boolean
}

export type WhisperResponse = {
  from: number
  to: number
  text: string
}[]

// Define the specific job data interfaces
export interface TranscribeJobData {
  filePath: string
  fileName?: string
  duration?: number
}

export interface ExportJobData {
  exportPath?: string
  filePath?: string
}

// Define the job types
export type JobType = 'Transcribe' | 'Export'

// Create discriminated unions for QueueJob
export interface QueueJobBase<T extends JobType, D> extends Job {
  type: T
  data: D
}

// Specific implementations for each job type
export type TranscribeJob = QueueJobBase<'Transcribe', TranscribeJobData>
export type ExportJob = QueueJobBase<'Export', ExportJobData>

// Union type of all possible QueueJob types
export type QueueJob = TranscribeJob | ExportJob

export type JobDataForType<T extends JobType> = T extends 'Transcribe'
  ? TranscribeJobData
  : T extends 'Export'
    ? ExportJobData
    : never

export type TranscribeListSerialized = TranscribeJobData & {
  id: string
}
export type ExportListSerialized = ExportJobData & {
  id: string
}

export type SerializedJobForType<T extends JobType> = T extends 'Transcribe'
  ? TranscribeListSerialized
  : T extends 'Export'
    ? ExportListSerialized
    : never

export type WhisperInputConfig = {
  /**
   * model id
   */
  model: string
  language: string
  maxLen: number
  splitOnWord: boolean
  useGpu: boolean
  maxContext: number
  nThreads: number
  beamSize: number
  temperatureInc: number
  entropyThold: number
  prompt: string
}

export type ExportConfig = {
  folder: string
  format: string
}

export type Subtitle = {
  id: string
  start: number
  end: number
  text: string
}

export type Model = { name: string; path: string }

export type DownloadParams = Pick<DownloadConfig, 'directory' | 'url' | 'saveAsFilename'>

export type DownloadEvent = {
  id: string
  filename: string
  totalBytes: number
  progress: number
  url: string
  receivedBytes: number
  error?: string
}

export type ModelItem = {
  id: string
  label: string
  url: string
  description: string
  disabled: boolean
  size: string
  type: string
}

export type ModelCategory = {
  id: string
  items: ModelItem[]
}
