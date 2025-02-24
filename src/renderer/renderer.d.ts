import {
  DownloadEvent,
  DownloadParams,
  JobDataForType,
  JobType,
  ModelCategory,
  SerializedJobForType,
  WhisperInputConfig,
  ExportConfig,
  QueueProgress,
  ExportCompleted,
  TranscribeListSerialized,
  ExportListSerialized,
  Caption
} from '../shared/models'

export interface IAPI extends QueueMangaerAPI, DownloadManagerAPI {
  getModelDownloadsFolder: () => Promise<string>
  showOpenDialog: (args: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
  showMessageBox: (options: Electron.MessageBoxOptions) => Promise<Electron.MessageBoxReturnValue>
  getModelList: () => Promise<ModelCategory[]>
  deleteModel: (modelName: string) => Promise<void>
  showItemInFilesystem: (path: string) => Promise<void>

  onModelListUpdated: (callback: (models: ModelCategory[]) => void) => () => void
  onExportCompleted: (callback: (data: ExportCompleted) => void) => () => void
}

interface QueueMangaerAPI {
  createJob: <T extends JobType>(args: { type: T; data: JobDataForType<T> }) => Promise<void>
  getJobList: <T extends JobType>(args: { type: T }) => Promise<SerializedJobForType<T>[]>
  getTranscribeOptions: () => Promise<WhisperInputConfig>
  updateTranscribeOptions: (args: { key: string; value: unknown }) => Promise<void>
  queuePendingJobs: (type?: JobType) => Promise<void>
  clearQueue: () => Promise<void>
  onCaptionAdded: (callback: (value: Caption) => void) => () => void
  onQueueProgress: (callback: (value: QueueProgress) => void) => () => void
  onQueueSetRunning: (callback: (value: boolean) => void) => () => void
  onQueueSetJobList: (
    callback: (list: (TranscribeListSerialized | ExportListSerialized)[]) => void
  ) => () => void

  getExportOptions: () => Promise<ExportConfig>
  updateExportOptions: (args: { key: string; value: string }) => Promise<void>
  abortRunningJob: () => Promise<boolean>
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
