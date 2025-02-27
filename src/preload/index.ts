import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { IAPI } from '../renderer/renderer'
import { IPCCHANNELS } from '../shared/constants'
import {
  Caption,
  DownloadEvent,
  ExportCompleted,
  ExportListSerialized,
  ModelCategory,
  QueueProgress,
  TranscribeListSerialized
} from '../shared/models'

const api: IAPI = {
  // main <-> renderer
  getModelDownloadsFolder: () =>
    ipcRenderer.invoke(IPCCHANNELS.FILESYSTEM_GET_MODEL_DOWNLOADS_FOLDER),
  showOpenDialog: (args) => ipcRenderer.invoke(IPCCHANNELS.FILESYSTEM_CHOOSE_FOLDER, args),
  createJob: (args) => ipcRenderer.invoke(IPCCHANNELS.CREATE_JOB, args),
  getJobList: (args) => ipcRenderer.invoke(IPCCHANNELS.GET_JOBLIST, args),
  getTranscribeOptions: () => ipcRenderer.invoke(IPCCHANNELS.GET_TRANSCRIBE_OPTIONS),
  updateTranscribeOptions: (args) => ipcRenderer.invoke(IPCCHANNELS.UPDATE_TRANSCRIBE_OPTION, args),
  queuePendingJobs: (args) => ipcRenderer.invoke(IPCCHANNELS.QUEUE_PENDING_JOBS, args),
  download: (args) => ipcRenderer.invoke(IPCCHANNELS.DOWNLOAD_MANAGER_DOWNLOAD, args),
  cancel: (args) => ipcRenderer.invoke(IPCCHANNELS.DOWNLOAD_MANAGER_CANCEL, args),
  getModelList: () => ipcRenderer.invoke(IPCCHANNELS.MODEL_MANAGER_GET_MODEL_LIST),
  deleteModel: (modelName) => ipcRenderer.invoke(IPCCHANNELS.MODEL_MANAGER_DELETE_MODEL, modelName),
  showMessageBox: (options) => ipcRenderer.invoke(IPCCHANNELS.DIALOG_SHOW_MESSAGE_BOX, options),
  clearQueue: () => ipcRenderer.invoke(IPCCHANNELS.QUEUE_CLEAR),
  getExportOptions: () => ipcRenderer.invoke(IPCCHANNELS.GET_EXPORT_OPTIONS),
  updateExportOptions: (args) => ipcRenderer.invoke(IPCCHANNELS.UPDATE_EXPORT_OPTION, args),
  showItemInFilesystem: (file) => ipcRenderer.invoke(IPCCHANNELS.SHOW_FILE_IN_FILESYSTEM, file),
  abortRunningJob: () => ipcRenderer.invoke(IPCCHANNELS.QUEUE_ABORT_RUNNING_JOB),
  parseMedia: (file) => ipcRenderer.invoke(IPCCHANNELS.PARSE_MEDIA, file),

  // main -> renderer
  onDownloadStarted: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: DownloadEvent) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.DOWNLOAD_MANAGER_STARTED, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.DOWNLOAD_MANAGER_STARTED, subscription)
    }
  },
  onDownloadProgress: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: DownloadEvent) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.DOWNLOAD_MANAGER_PROGRESS, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.DOWNLOAD_MANAGER_PROGRESS, subscription)
    }
  },
  onDownloadCompleted: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: DownloadEvent) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.DOWNLOAD_MANAGER_COMPLETED, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.DOWNLOAD_MANAGER_COMPLETED, subscription)
    }
  },
  onDownloadCancelled: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: DownloadEvent) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.DOWNLOAD_MANAGER_CANCELLED, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.DOWNLOAD_MANAGER_CANCELLED, subscription)
    }
  },
  onDownloadInterrupted: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: DownloadEvent) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.DOWNLOAD_MANAGER_INTERRUPTED, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.DOWNLOAD_MANAGER_INTERRUPTED, subscription)
    }
  },
  onDownloadError: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: DownloadEvent) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.DOWNLOAD_MANAGER_ERROR, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.DOWNLOAD_MANAGER_ERROR, subscription)
    }
  },
  onCaptionAdded: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: Caption) => callback(value)
    ipcRenderer.on(IPCCHANNELS.CAPTION_ADDED, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.CAPTION_ADDED, subscription)
    }
  },
  onQueueProgress: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: QueueProgress) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.QUEUE_PROGRESS, subscription)
    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.QUEUE_PROGRESS, subscription)
    }
  },
  onExportCompleted: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: ExportCompleted) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.EXPORT_COMPLETED, subscription)
    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.EXPORT_COMPLETED, subscription)
    }
  },
  onQueueSetRunning: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: boolean) => callback(value)
    ipcRenderer.on(IPCCHANNELS.QUEUE_SET_RUNNING, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.QUEUE_SET_RUNNING, subscription)
    }
  },
  onQueueSetJobList: (callback) => {
    const subscription = (
      _event: Electron.IpcRendererEvent,
      value: (TranscribeListSerialized | ExportListSerialized)[]
    ) => callback(value)
    ipcRenderer.on(IPCCHANNELS.QUEUE_SET_JOBLIST, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.QUEUE_SET_JOBLIST, subscription)
    }
  },
  onModelListUpdated: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, value: ModelCategory[]) =>
      callback(value)
    ipcRenderer.on(IPCCHANNELS.MODEL_MANAGER_SET_MODEL_LIST, subscription)

    return () => {
      ipcRenderer.removeListener(IPCCHANNELS.MODEL_MANAGER_SET_MODEL_LIST, subscription)
    }
  }
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
