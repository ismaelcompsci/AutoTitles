import { Whisper } from 'smart-whisper'
import EmbeddedQueue, { CreateJobData, Job } from 'embedded-queue'
import { v4 as uuid } from 'uuid'
import { read_wav } from '../handle/transcribe'
import path from 'path'
import { QueueJob } from '../../shared/models'
import { ExportJobData, TranscribeJobData } from '../../shared/models'
import { JobType } from '../../shared/models'
import { JobDataForType } from '../../shared/models'
import { whisperInputConfig } from '../whisper-config'
import { BrowserWindow } from 'electron'
import { encodeForWhisper } from '../handle/encode-for-whisper'
import os from 'node:os'

const root = path.join(os.homedir(), '.autotitles')
const models = path.join(root, 'models')

const filename = `ggml-tiny.en.bin`
const modelPath = path.join(models, filename)

const handleTranscribeJob = async (job: Job): Promise<void> => {
  console.log('[handleTranscribeJob]', job.id, job.data)

  const { data } = job as QueueJob
  const { filePath } = data as TranscribeJobData

  // @ts-ignore
  const encodedFilePath = await encodeForWhisper(null, filePath)

  const whisper = new Whisper(modelPath, { gpu: true })
  const pcm = read_wav(encodedFilePath)

  const task = await whisper.transcribe(pcm, {
    suppress_non_speech_tokens: true,
    ...whisperInputConfig
  })

  task.on('transcribed', (subtitle) => {
    const id = `id-${subtitle.from}-${subtitle.to}`
    console.log({ id, ...subtitle })

    const window = BrowserWindow.getFocusedWindow()

    window?.webContents.send('segments:segment-added', {
      id,
      start: subtitle.from,
      end: subtitle.to,
      text: subtitle.text
    })
  })

  const result = await task.result

  console.log(result[0])
  await whisper.free()
}

const handleExportJob = async (job: Job): Promise<void> => {
  console.log(job.id, job.data)
}

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
    return whisperInputConfig
  }

  // move these away from queuemanagaer
  createExportJob = async (_data) => {
    // todop
  }

  createTranscribeJob = async ({ filePath }: { filePath: string }) => {
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
