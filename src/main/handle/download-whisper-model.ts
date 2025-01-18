import path from 'path'
import { downloadManager } from '..'
import { existsSync } from 'fs'
import { app, BrowserWindow } from 'electron'

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

export type WhisperModel = (typeof models)[number]

export interface DownloadWhisperModel {
  model: WhisperModel
}

export async function downloadWhisperModel(
  _event: Electron.IpcMainInvokeEvent,
  args: DownloadWhisperModel
) {
  const browserWindow = BrowserWindow.fromId(_event.sender.id)

  if (!browserWindow) {
    throw new Error('Window context not found')
  }

  const { model } = args

  if (!models.includes(model)) {
    throw new Error(`Invalid whisper model ${model}. Available: ${models.join(', ')}`)
  }

  const modelFolder = path.join(app.getPath('userData'), 'models')
  const modelFilePath = getModelPath(modelFolder, model)
  if (existsSync(modelFilePath)) {
    return { alreadyExisted: true }
  }

  let downloadId
  const filename = `ggml-${model}.bin`
  const baseModelUrl = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${model}.bin`

  downloadId = await downloadManager.download({
    url: baseModelUrl,
    directory: modelFilePath,
    saveAsFilename: filename,
    window: browserWindow,
    callbacks: {
      onDownloadStarted: async ({ id, item, resolvedFilename }) => {
        browserWindow.webContents.send('download-started', {
          id,
          // The filename that the file will be saved as
          filename: resolvedFilename,
          // Get the file size to be downloaded in bytes
          totalBytes: item.getTotalBytes()
        })
      },
      onDownloadProgress: async ({ id, item, percentCompleted }) => {
        // Send the download progress back to the renderer
        browserWindow.webContents.send('download-progress', {
          id,
          percentCompleted,
          // Get the number of bytes received so far
          bytesReceived: item.getReceivedBytes()
        })
      },
      onDownloadCompleted: async ({ id, item }) => {
        // Send the download completion back to the renderer
        browserWindow.webContents.send('download-completed', {
          id,
          // Get the path to the file that was downloaded
          filePath: item.getSavePath(),
          model: model
        })
      }
    }
  })

  return { alreadyExisted: false, downloadId }
}

export const getModelPath = (folder: string, model: WhisperModel) => {
  return path.join(folder, `ggml-${model}.bin`)
}

export interface DownloadStarted {
  id: string
  filename: string
  totalBytes: number
}

export interface DownloadProgress {
  id: string
  percentCompleted: number
  bytesReceived: number
}

export interface DownloadCompleted {
  id: string
  filePath: string
  model: string
}
