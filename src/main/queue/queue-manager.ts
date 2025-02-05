import EmbeddedQueue, { CreateJobData, Job, Processor } from 'embedded-queue'
import { v4 as uuid } from 'uuid'
import {
  ExportConfig,
  ExportListSerialized,
  QueueJob,
  SerializedJobForType,
  TranscribeListSerialized,
  WhisperInputConfig
} from '../../shared/models'
import { ExportJobData, TranscribeJobData } from '../../shared/models'
import { JobType } from '../../shared/models'
import { JobDataForType } from '../../shared/models'

import { handleExportJob } from './jobs'
import { handleTranscribeJob } from './jobs'

export class QueueManager {
  private static instance: QueueManager
  private queue?: EmbeddedQueue.Queue
  private pendingJobs: Job[] = []

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
    this.queue?.process('Transcribe', handleTranscribeJob as Processor, 1)
    this.queue?.process('Export', handleExportJob as Processor, 1)
  }

  private setupEventListeners = () => {
    this.queue?.on(EmbeddedQueue.Event.Enqueue, (job) => {
      console.log(job)
    })
  }

  clear = async () => {
    const jobs = await this.queue?.listJobs()

    if (jobs) {
      for (const job of jobs) {
        this.queue?.removeJob(job)
      }
    }

    this.pendingJobs.splice(0, this.pendingJobs.length)
  }

  getJobList = <T extends JobType>(type: string): SerializedJobForType<T>[] => {
    return this.pendingJobs
      ?.filter((job) => job.type === type)
      .map((job) => {
        const { type } = job

        switch (type) {
          case 'Transcribe': {
            const data = job.data as TranscribeJobData

            return {
              id: job.id,
              originalMediaFilePath: data.originalMediaFilePath
            } as TranscribeListSerialized
          }
          case 'Export': {
            const data = job.data as ExportJobData

            return {
              id: job.id,
              originalMediaFilePath: data.originalMediaFilePath
            } as ExportListSerialized
          }
          default:
            throw new Error(`Unsupported job type: ${type}`)
        }
      }) as SerializedJobForType<T>[]
  }

  queuePendingJobs = (type?: JobType) => {
    for (const job of this.pendingJobs) {
      if (type === 'Transcribe') {
        this.queue?.addJob(job)
        continue
      }

      if (type === 'Export') {
        this.queue?.addJob(job)
        continue
      }

      this.queue?.addJob(job)
    }

    this.pendingJobs.splice(0, this.pendingJobs.length)
  }

  createJob = async <T extends JobType>(type: T, data: JobDataForType<T>): Promise<void> => {
    try {
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

  createExportJob = async (data: ExportJobData) => {
    const { originalMediaFilePath } = data

    const createNewJobData: CreateJobData = {
      type: 'Export',
      data: { originalMediaFilePath }
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

  createTranscribeJob = async (data: TranscribeJobData) => {
    const { originalMediaFilePath } = data

    const createNewJobData: CreateJobData = {
      type: 'Transcribe',
      data: { originalMediaFilePath } as TranscribeJobData
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
