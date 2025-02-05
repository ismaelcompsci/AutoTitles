export const IPCCHANNELS = {
  FILESYSTEM_GET_MODEL_DOWNLOADS_FOLDER: 'filesystem:getDownloadsFolder',
  FILESYSTEM_CHOOSE_FOLDER: 'dialog.showOpenDialog',

  CREATE_JOB: 'queue.createJob',
  GET_JOBLIST: 'queue.getJobList',
  QUEUE_PENDING_JOBS: 'queue.queuePendingJobs',
  GET_TRANSCRIBE_OPTIONS: 'queue.getTranscribeOptions',
  UPDATE_TRANSCRIBE_OPTION: 'queue.updateTranscribeOption',
  QUEUE_CLEAR: 'queue.clear',

  DOWNLOAD_MANAGER_DOWNLOAD: 'downloadManager.download',
  DOWNLOAD_MANAGER_CANCEL: 'downloadManager.cancel',

  DOWNLOAD_MANAGER_STARTED: 'downloadManager.started',
  DOWNLOAD_MANAGER_PROGRESS: 'downloadManager.progress',
  DOWNLOAD_MANAGER_COMPLETED: 'downloadManager.completed',
  DOWNLOAD_MANAGER_CANCELLED: 'downloadManager.cancelled',
  DOWNLOAD_MANAGER_INTERRUPTED: 'downloadManager.interrupted',
  DOWNLOAD_MANAGER_ERROR: 'downloadManager.error',

  MODEL_MANAGER_GET_MODEL_LIST: 'modelManager.getModelList',
  MODEL_MANAGER_DELETE_MODEL: 'modelManager.deleteModel',
  MODEL_MANAGER_SET_MODEL_LIST: 'modelManager.setModelList',

  DIALOG_SHOW_MESSAGE_BOX: 'dialog.showMessageBox',

  GET_EXPORT_OPTIONS: 'queue.getExportOptions',
  UPDATE_EXPORT_OPTION: 'queue.updateExportOption'
} as const

export const MODELS = [
  'tiny',
  'tiny.en',
  'base',
  'base.en',
  'small',
  'small.en',
  'medium',
  'medium.en',
  'large-v1',
  'large-v2',
  'large-v3',
  'large-v3-turbo'
] as const

export const modelSizes: Record<string, string> = {
  tiny: '77.7 MB',
  'tiny.en': '77.7 MB',
  base: '148 MB',
  'base.en': '148 MB',
  small: '488 MB',
  'small.en': '488 MB',
  medium: '1.53 GB',
  'medium.en': '1.53 GB',
  'large-v1': '3.09 GB',
  'large-v2': '3.09 GB',
  'large-v3': '3.1 GB',
  'large-v3-turbo': '1.62 GB'
}

export type WhisperModel = (typeof MODELS)[number]
