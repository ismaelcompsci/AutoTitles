import {
  DownloadEvent,
  DownloadParams,
  JobDataForType,
  JobType,
  ModelCategory,
  SerializedJobForType,
  Subtitle,
  WhisperInputConfig,
  WhisperParams,
  WhisperResponse
} from '../shared/models'

export interface IAPI extends QueueMangaerAPI, DownloadManagerAPI {
  getModelDownloadsFolder: () => Promise<string>
  showOpenDialog: (args: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
  showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>
  getModelList: () => Promise<ModelCategory[]>
  deleteModel: (modelName: string) => Promise<void>
  onModelListUpdated: (callback: (models: ModelCategory[]) => void) => () => void
}

interface QueueMangaerAPI {
  createJob: <T extends JobType>(args: { type: T; data: JobDataForType<T> }) => Promise<void>
  getJobList: <T extends JobType>(args: { type: T }) => Promise<SerializedJobForType<T>[]>
  getTranscribeOptions: () => Promise<WhisperInputConfig>
  updateTranscribeOptions: (args: { key: string; value: string }) => Promise<void>
  queuePendingJobs: () => Promise<void>

  onSubtitleAdded: (callback: (value: Subtitle) => void) => () => void
}

type DownloadCallback = (callback: (value: DownloadEvent) => void) => () => void

interface DownloadManagerAPI {
  download: (args: DownloadParams) => Promise<void>
  cancel: (args: { id: string }) => Promise<void>
  onDownloadStarted: DownloadCallback
  onDownloadProgress: DownloadCallback
  onDownloadCompleted: DownloadCallback
  onDownloadCancelled: DownloadCallback
  onDownloadInterrupted: DownloadCallback
  onDownloadError: DownloadCallback
}
