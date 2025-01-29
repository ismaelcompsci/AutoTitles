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
  exportPath: string
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

export type SerializedJobForType<T extends JobType> = T extends 'Transcribe'
  ? TranscribeListSerialized
  : T extends 'Export'
    ? ExportJobData
    : never

export type WhisperInputConfig = {
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

export type Subtitle = {
  id: string
  start: number
  end: number
  text: string
}
