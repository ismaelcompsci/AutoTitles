import { app, dialog } from 'electron'
import path from 'path'

export const DEFAULT_DOWNLOADS_DIR = path.join(app.getPath('downloads'))

export const getDownloadsFolder = (_event: Electron.IpcMainInvokeEvent) => {
  return DEFAULT_DOWNLOADS_DIR
}

export const showOpenDialog = async (
  _event: Electron.IpcMainInvokeEvent,
  options: Electron.OpenDialogOptions
): Promise<Electron.OpenDialogReturnValue> => {
  const response = await dialog.showOpenDialog(options)
  return response
}
