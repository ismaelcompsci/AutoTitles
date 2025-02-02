import { BrowserWindow } from 'electron'
import { DownloadParams } from '../shared/models'
import { ElectronDownloadManager } from 'electron-dl-manager'
import { IPCCHANNELS } from '../shared/constants'

export const downloadManager = new ElectronDownloadManager()

export const cancel = async (id: string) => {
  downloadManager.cancelDownload(id)
}

export const download = async (_event: Electron.IpcMainInvokeEvent, args: DownloadParams) => {
  const browserWindow = BrowserWindow.fromId(_event.sender.id)

  if (!browserWindow) return

  await downloadManager.download({
    ...args,
    window: browserWindow,
    callbacks: {
      onDownloadStarted: ({ id, item, resolvedFilename, percentCompleted }) => {
        browserWindow.webContents.send(IPCCHANNELS.DOWNLOAD_MANAGER_STARTED, {
          id,
          filename: resolvedFilename,
          totalBytes: item.getTotalBytes(),
          progress: percentCompleted,
          url: args.url
        })
      },
      onDownloadProgress: ({ id, item, percentCompleted, resolvedFilename }) => {
        // Send the download progress back to the renderer
        browserWindow.webContents.send('downloadManager.progress', {
          id,
          filename: resolvedFilename,
          totalBytes: item.getTotalBytes(),
          progress: percentCompleted,
          url: args.url
        })
      },
      onDownloadCompleted: ({ id, item, resolvedFilename, percentCompleted }) => {
        browserWindow.webContents.send('downloadManager.completed', {
          id,
          filename: resolvedFilename,
          totalBytes: item.getTotalBytes(),
          progress: percentCompleted,
          url: args.url,
          receivedBytes: item.getReceivedBytes()
        })
      },
      onDownloadCancelled: ({ id, resolvedFilename, item, percentCompleted }) => {
        browserWindow.webContents.send('downloadManager.cancelled', {
          id,
          filename: resolvedFilename,
          totalBytes: item.getTotalBytes(),
          progress: percentCompleted,
          url: args.url
        })
      },
      onDownloadInterrupted: ({ id, resolvedFilename, item, percentCompleted }) => {
        browserWindow.webContents.send('downloadManager.interrupted', {
          id,
          filename: resolvedFilename,
          totalBytes: item.getTotalBytes(),
          progress: percentCompleted,
          url: args.url
        })
      },
      onError: (error) => {
        browserWindow.webContents.send('downloadManager.error', {
          url: args.url,
          error: error.message
        })
      }
    }
  })
}
