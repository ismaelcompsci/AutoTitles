import EmbeddedQueue, { CreateJobData, Job } from 'embedded-queue'
import { v4 as uuid } from 'uuid'
import path from 'path'
import { ExportConfig, QueueJob, WhisperInputConfig } from '../../shared/models'
import { ExportJobData, TranscribeJobData } from '../../shared/models'
import { JobType } from '../../shared/models'
import { JobDataForType } from '../../shared/models'

import { handleExportJob } from './jobs'
import { handleTranscribeJob } from './jobs'

export class QueueManager {
  private static instance: QueueManager
  private queue?: EmbeddedQueue.Queue
  private pendingJobs: Job[] = []
  private whisperConfig: WhisperInputConfig = baseWhisperInputConfig
  private exportConfig: ExportConfig = baseExportConfig

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager()
    }
    return QueueManager.instance
  }

  async init() {
    this.queue = await EmbeddedQueue.Queue.createQueue({ inMemoryOnly: true })
    this.setupProcessors()
    this.setupEventListeners()
  }

  private setupProcessors = () => {
    this.queue?.process('Transcribe', handleTranscribeJob, 1)
    this.queue?.process('Export', handleExportJob, 1)
  }

  private setupEventListeners = () => {
    this.queue?.on(EmbeddedQueue.Event.Enqueue, (job) => {
      console.log(job)
    })
  }

  getJobList = (type: string) => {
    console.log('[QueueManager.getJobList] type: ', type)
    return this.pendingJobs?.filter((job) => job.type === type) as QueueJob[]
  }

  queuePendingJobs = () => {
    for (const job of this.pendingJobs) {
      this.queue?.addJob(job)
    }

    // clear pending jobs
    this.pendingJobs.splice(0, this.pendingJobs.length)
    // return queued jobs
  }

  createJob = async <T extends JobType>(type: T, data: JobDataForType<T>): Promise<void> => {
    try {
      console.log(type, data)
      switch (type) {
        case 'Transcribe':
          await this.createTranscribeJob(data as TranscribeJobData)
          break
        case 'Export':
          await this.createExportJob(data as ExportJobData)
          break
        default:
          throw new Error(`Unsupported job type: ${type}`)
      }
    } catch (error) {
      console.error(`Failed to create ${type} job:`, error)
      throw error
    }
  }

  getTranscribeOptions() {
    return this.whisperConfig
  }

  updateTranscribeOption(key: string, value: string) {
    console.log(key, ': ', value)
    this.whisperConfig[key] = value
  }

  createExportJob = async (_data: ExportJobData) => {}

  createTranscribeJob = async (data: TranscribeJobData) => {
    const { filePath } = data
    const basename = path.basename(filePath)

    const createNewJobData: CreateJobData = {
      type: 'Transcribe',
      data: { filePath, fileName: basename }
    }

    const now = new Date()

    const job = new Job(
      Object.assign({}, createNewJobData, {
        queue: this.queue!,
        id: uuid(),
        createdAt: now,
        updatedAt: now,
        logs: [],
        saved: false
      })
    )

    this.pendingJobs.push(job)
  }
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
