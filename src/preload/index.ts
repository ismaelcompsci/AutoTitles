import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { IAPI } from '../renderer/renderer'
import { IPCCHANNELS } from '../shared/constants'

const api: IAPI = {
  // main <-> renderer
  downloadWhisperModel: (args) => ipcRenderer.invoke(IPCCHANNELS.DOWNLOAD_WHISPER_MODEL, args),
  probe: (args) => ipcRenderer.invoke(IPCCHANNELS.PROBE, args),
  transcribe: (args) => ipcRenderer.invoke(IPCCHANNELS.WHISPER_TRANSCRIBE, args),
  encodeForWhisper: (args) => ipcRenderer.invoke(IPCCHANNELS.WHISPER_ENCODE, args),
  encodeAudioForBrowser: (args) => ipcRenderer.invoke(IPCCHANNELS.WHISPER_ENCODE_AUDIO, args),
  getDownloadsFolder: () => ipcRenderer.invoke(IPCCHANNELS.FILESYSTEM_GET_DOWNLOADS_FOLDER),
  showOpenDialog: (args) => ipcRenderer.invoke(IPCCHANNELS.FILESYSTEM_CHOOSE_FOLDER, args),
  exportSubtitles: (args) => ipcRenderer.invoke(IPCCHANNELS.EXPORT_SUBTITLES, args),
  createJob: (args) => ipcRenderer.invoke(IPCCHANNELS.CREATE_JOB, args),
  getJobList: (args) => ipcRenderer.invoke(IPCCHANNELS.GET_JOBLIST, args),
  getTranscribeOptions: () => ipcRenderer.invoke(IPCCHANNELS.GET_TRANSCRIBE_OPTIONS),
  updateTranscribeOptions: (args) => ipcRenderer.invoke(IPCCHANNELS.UPDATE_TRANSCRIBE_OPTION, args),
  queuePendingJobs: () => ipcRenderer.invoke(IPCCHANNELS.QUEUE_PENDING_JOBS),

  // main -> renderer
  onDownloadStarted: (callback) =>
    ipcRenderer.on('download-started', (_event, value) => callback(value)),
  onDownloadProgress: (callback) =>
    ipcRenderer.on('download-progress', (_event, value) => callback(value)),
  onDownloadCompleted: (callback) =>
    ipcRenderer.on('download-completed', (_event, value) => callback(value)),

  onSubtitleAdded: (callback) =>
    ipcRenderer.on('segments:segment-added', (_event, value) => callback(value))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
