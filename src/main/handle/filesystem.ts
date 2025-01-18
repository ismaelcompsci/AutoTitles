import { app } from 'electron'
import path from 'path'

export const DEFAULT_DOWNLOADS_DIR = path.join(app.getPath('userData'), 'downloads')

export const getDownloadsFolder = (_event: Electron.IpcMainInvokeEvent) => {
  return DEFAULT_DOWNLOADS_DIR
}
