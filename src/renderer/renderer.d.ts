import type {
  DownloadCompleted,
  DownloadProgress,
  DownloadStarted,
  DownloadWhisperModel
} from '../main/handle/download-whisper-model'
import type { FfprobeData } from 'fluent-ffmpeg'
import {
  JobDataForType,
  JobType,
  SerializedJobForType,
  Subtitle,
  WhisperInputConfig,
  WhisperParams,
  WhisperResponse
} from '../shared/models'

export interface IAPI extends QueueMangaerAPI {
  downloadWhisperModel: (
    args: DownloadWhisperModel
  ) => Promise<{ alreadyExisted: boolean; downloadId: string; filePath?: string }>
  probe: (file: string) => Promise<FfprobeData>
  transcribe: (whisper: WhisperParams) => Promise<WhisperResponse>
  encodeForWhisper: (file: string) => Promise<string>
  encodeAudioForBrowser: (args: { inputPath: string; outputPath: string }) => Promise<string>
  getDownloadsFolder: () => Promise<string>
  showOpenDialog: (args: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
  exportSubtitles: (args: {
    filepath: string
    data: { from: number; to: number; text: string }[]
    type: string
  }) => Promise<string>

  onDownloadStarted: (callback: (value: DownloadStarted) => void) => Electron.IpcRenderer
  onDownloadProgress: (callback: (value: DownloadProgress) => void) => Electron.IpcRenderer
  onDownloadCompleted: (callback: (value: DownloadCompleted) => void) => Electron.IpcRenderer
}

interface QueueMangaerAPI {
  createJob: <T extends JobType>(args: { type: T; data: JobDataForType<T> }) => Promise<void>
  getJobList: <T extends JobType>(args: { type: T }) => Promise<SerializedJobForType<T>[]>
  getTranscribeOptions: () => Promise<WhisperInputConfig>
  updateTranscribeOptions: (args: { key: string; value: string }) => Promise<void>
  queuePendingJobs: () => Promise<void>

  onSubtitleAdded: (callback: (value: Subtitle) => void) => Electron.IpcRenderer
}
