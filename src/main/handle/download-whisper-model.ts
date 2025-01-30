import path from 'path'
import { downloadManager } from '../index'
import fs from 'fs'
import { BrowserWindow } from 'electron'
import os from 'node:os'
import { MODELS } from '../../shared/constants'

const root = path.join(os.homedir(), '.autotitles')
const models = path.join(root, 'models')

fs.mkdirSync(models, { recursive: true })

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

  // @ts-ignore
  if (!MODELS.includes(model)) {
    throw new Error(`Invalid whisper model ${model} . Available: ${MODELS.join(', ')}`)
  }

  const filename = `ggml-${model}.bin`
  const modelFilePath = path.join(models, filename)
  if (fs.existsSync(modelFilePath)) {
    return { alreadyExisted: true, filePath: modelFilePath }
  }

  let downloadId
  const baseModelUrl = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${model}.bin`

  downloadId = await downloadManager.download({
    url: baseModelUrl,
    directory: models,
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
