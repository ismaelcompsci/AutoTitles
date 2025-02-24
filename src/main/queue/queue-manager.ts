import EmbeddedQueue, { CreateJobData, Job, Processor } from 'embedded-queue'
import { v4 as uuid } from 'uuid'
import {
  ExportListSerialized,
  QueueJob,
  SerializedJobForType,
  TranscribeListSerialized
} from '../../shared/models'
import { ExportJobData, TranscribeJobData } from '../../shared/models'
import { JobType } from '../../shared/models'
import { JobDataForType } from '../../shared/models'

import { handleExportJob } from './jobs'
import { handleTranscribeJob } from './jobs'
import { BrowserWindow } from 'electron'
import { IPCCHANNELS } from '../../shared/constants'

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
    this.queue?.on(EmbeddedQueue.Event.Start, () => {
      const window = BrowserWindow.getFocusedWindow()
      window?.webContents.send(IPCCHANNELS.QUEUE_SET_RUNNING, true)
    })

    this.queue?.on(EmbeddedQueue.Event.Complete, (job: QueueJob, result) => {
      const window = BrowserWindow.getFocusedWindow()
      window?.webContents.send(IPCCHANNELS.QUEUE_SET_RUNNING, false)

      if (job.type === 'Export') {
        const data = {
          outputPath: result
        }

        window?.webContents.send(IPCCHANNELS.EXPORT_COMPLETED, data)
      }
    })

    this.queue?.on(EmbeddedQueue.Event.Failure, (job: QueueJob) => {
      console.log('EmbeddedQueue.Event.Failure', job.type, job.id)

      const window = BrowserWindow.getFocusedWindow()
      window?.webContents.send(IPCCHANNELS.QUEUE_SET_RUNNING, false)
    })
    this.queue?.on(EmbeddedQueue.Event.Remove, (job: QueueJob) => {
      console.log('EmbeddedQueue.Event.Remove', job.type, job.id)

      const window = BrowserWindow.getFocusedWindow()
      window?.webContents.send(IPCCHANNELS.QUEUE_SET_RUNNING, false)
    })

    this.queue?.on(EmbeddedQueue.Event.Progress, (job: QueueJob, progress: number) => {
      const window = BrowserWindow.getFocusedWindow()
      const data = {
        id: job.id,
        type: job.type,
        progress: progress,
        file: job.data.originalMediaFilePath
      }

      window?.webContents.send(IPCCHANNELS.QUEUE_PROGRESS, data)
    })
  }

  abortRunningJob = async () => {
    try {
      await this.queue?.shutdown(100, 'Transcribe')

      this.setupProcessors()

      return true
    } catch (e) {
      console.log('[abortRunningJob] Error', e)
      return false
    }
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

  queuePendingJobs = async (type?: JobType) => {
    console.log(type, this.pendingJobs)
    for (const job of this.pendingJobs) {
      if (type === 'Transcribe') {
        await this.queue?.addJob(job)
        continue
      }

      if (type === 'Export') {
        await this.queue?.addJob(job)
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

    const window = BrowserWindow.getFocusedWindow()
    window?.webContents.send(IPCCHANNELS.QUEUE_SET_JOBLIST, type, this.getJobList(type))
  }

  createExportJob = async (data: ExportJobData) => {
    const createNewJobData: CreateJobData = {
      type: 'Export',
      data: data
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
    const createNewJobData: CreateJobData = {
      type: 'Transcribe',
      data: data
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
