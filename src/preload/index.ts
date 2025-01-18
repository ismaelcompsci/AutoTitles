import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { IAPI } from '../renderer/renderer'

const api: IAPI = {
  // main <-> renderer
  openFile: (args) => ipcRenderer.invoke('dialog:openFile', args),
  downloadWhisperModel: (args) => ipcRenderer.invoke('download-whisper-modal', args),
  probe: (args) => ipcRenderer.invoke('probe', args),
  transcribe: (args) => ipcRenderer.invoke('whisper:transcribe', args),
  encodeForWhisper: (args) => ipcRenderer.invoke('whisper:encode', args),
  encodeAudioForBrowser: (args) => ipcRenderer.invoke('whisper:encodeaudio', args),
  getDownloadsFolder: () => ipcRenderer.invoke('filesystem:getDownloadsFolder'),

  // main -> renderer
  onDownloadStarted: (callback) =>
    ipcRenderer.on('download-started', (_event, value) => callback(value)),
  onDownloadProgress: (callback) =>
    ipcRenderer.on('download-progress', (_event, value) => callback(value)),
  onDownloadCompleted: (callback) =>
    ipcRenderer.on('download-completed', (_event, value) => callback(value))
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
