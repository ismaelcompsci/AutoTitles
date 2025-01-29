export const ROUTES = {
  HOME: '/',
  SETTINGS: '/SETTINGS'
}

export const IPCCHANNELS = {
  DOWNLOAD_WHISPER_MODEL: 'download-whisper-modal',
  WHISPER_TRANSCRIBE: 'whisper:transcribe',
  WHISPER_ENCODE: 'whisper:encode',
  WHISPER_ENCODE_AUDIO: 'whisper:encodeaudio',
  FILESYSTEM_GET_DOWNLOADS_FOLDER: 'filesystem:getDownloadsFolder',
  PROBE: 'filesystem:probe',
  FILESYSTEM_CHOOSE_FOLDER: 'dialog:showOpenDialog',
  EXPORT_SUBTITLES: 'export-subtitles',

  CREATE_JOB: 'queue.createJob',
  GET_JOBLIST: 'queue.getJobList',
  QUEUE_PENDING_JOBS: 'queue.queuePendingJobs'
} as const

export const models = [
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

export const modelSizes: { [key in WhisperModel]: string } = {
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

export type WhisperModel = (typeof models)[number]
