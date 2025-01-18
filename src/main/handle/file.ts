import { dialog } from 'electron'

export async function handleFileOpen(
  _event: Electron.IpcMainInvokeEvent,
  options: Electron.OpenDialogOptions
): Promise<Electron.OpenDialogReturnValue> {
  return await dialog.showOpenDialog(options)
}
