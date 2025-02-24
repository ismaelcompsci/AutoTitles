import type { DownloadConfig } from 'electron-dl-manager'
import type { Job } from 'embedded-queue'

export interface WhisperParams {
  language: string
  model: string
  audioInput: string

  maxLen: number // max segment length in characters
  translate: boolean
  split_on_word: boolean
  tokenTimestamps: boolean
}

export type Caption = {
  text: string
  startMs: number
  endMs: number
  timestampMs: number | null
  confidence: number | null
}

// Define the specific job data interfaces
export interface TranscribeJobData {
  originalMediaFilePath: string
  /**
   * duration of media in seconds
   */
  duration: number
}

export interface ExportJobData {
  originalMediaFilePath: string
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
  translate: boolean
}

export type ExportConfig = {
  folder: string
  format: string
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

export type QueueProgress = {
  id: string
  type: JobType
  progress: number
  file: string
}

export type ExportCompleted = {
  outputPath: string
}
