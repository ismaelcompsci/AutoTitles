import { app, dialog } from 'electron'
import path from 'path'

export const DEFAULT_DOWNLOADS_DIR = path.join(app.getPath('downloads'))

export const getDownloadsFolder = (_event: Electron.IpcMainInvokeEvent) => {
  return DEFAULT_DOWNLOADS_DIR
}

export const chooseFolder = async (_event: Electron.IpcMainInvokeEvent) => {
  const response = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  const directory = response.filePaths[0]

  return response.canceled ? undefined : directory
}
