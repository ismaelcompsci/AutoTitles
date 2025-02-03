import EmbeddedQueue, { CreateJobData, Job } from 'embedded-queue'
import { v4 as uuid } from 'uuid'
import path from 'path'
import { QueueJob, WhisperInputConfig } from '../../shared/models'
import { ExportJobData, TranscribeJobData } from '../../shared/models'
import { JobType } from '../../shared/models'
import { JobDataForType } from '../../shared/models'

import { handleExportJob } from './jobs'
import { handleTranscribeJob } from './jobs'
import '../db'
import { db } from '../db'

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
    this.queue?.process('Transcribe', handleTranscribeJob, 1)
    this.queue?.process('Export', handleExportJob, 1)
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

  getJobList = (type: string) => {
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
    return db.prepare('SELECT * FROM whisperconfig LIMIT 1').get() as WhisperInputConfig
  }

  updateTranscribeOption(key: string, value: any) {
    console.log(`[UPDATE] ${key}: ${value}`)
    const stmt = db.prepare(`UPDATE whisperconfig SET ${key} = ? WHERE id = 1`)

    // Convert boolean values to integers for SQLite storage
    if (typeof value === 'boolean') {
      value = value ? 1 : 0
    }

    stmt.run(value)
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
