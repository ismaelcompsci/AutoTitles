import { BrowserWindow, dialog } from 'electron'

export const showOpenDialog = async (
  _event: Electron.IpcMainInvokeEvent,
  options: Electron.OpenDialogOptions
): Promise<Electron.OpenDialogReturnValue> => {
  const response = await dialog.showOpenDialog(options)
  return response
}

export const showMessageBox = async (
  _event: Electron.IpcMainInvokeEvent,
  options: Electron.MessageBoxOptions
) => {
  const browserWindow = BrowserWindow.fromId(_event.sender.id)

  if (!browserWindow) return

  return await dialog.showMessageBox(browserWindow, options)
}
