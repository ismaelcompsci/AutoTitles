import { app, shell, BrowserWindow, ipcMain, nativeImage } from 'electron'
import path from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// @ts-ignore
import icon from '../../resources/icon.png?asset'
import { downloadWhisperModel } from './handle/download-whisper-model'
import { ElectronDownloadManager } from 'electron-dl-manager'
import { encodeAudioForBrowser } from './handle/encode-for-browser'
import { DEFAULT_DOWNLOADS_DIR, getDownloadsFolder, showOpenDialog } from './handle/filesystem'
import { IPCCHANNELS } from '../shared/constants'
import { exportSubtitles } from './handle/export-subtitles'
import { QueueManager } from './queue/queue-manager'
import { ExportJobData, JobType, TranscribeJobData } from '../shared/models'
import { JobDataForType } from '../shared/models'

const appIcon = nativeImage.createFromPath(icon)

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    icon: appIcon,
    width: 1024,
    height: 728,
    minWidth: 250,
    minHeight: 150,
    frame: false,
    titleBarStyle: 'hidden',
    /* You can use *titleBarOverlay: true* to use the original Windows controls */
    titleBarOverlay: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    trafficLightPosition: { x: 10, y: 10 },
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle(IPCCHANNELS.DOWNLOAD_WHISPER_MODEL, downloadWhisperModel)
  ipcMain.handle(IPCCHANNELS.WHISPER_ENCODE_AUDIO, encodeAudioForBrowser)
  ipcMain.handle(IPCCHANNELS.FILESYSTEM_GET_DOWNLOADS_FOLDER, getDownloadsFolder)
  ipcMain.handle(IPCCHANNELS.FILESYSTEM_CHOOSE_FOLDER, showOpenDialog)
  ipcMain.handle(IPCCHANNELS.EXPORT_SUBTITLES, exportSubtitles)

  createWindow()

  if (!fs.existsSync(DEFAULT_DOWNLOADS_DIR)) {
    fs.mkdirSync(DEFAULT_DOWNLOADS_DIR)
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

export const downloadManager = new ElectronDownloadManager()
setupQueueHandlers()

// Move IPC handlers to a separate file
async function setupQueueHandlers() {
  const queue = QueueManager.getInstance()
  await queue.init()

  ipcMain.handle(IPCCHANNELS.GET_TRANSCRIBE_OPTIONS, (_event) => {
    return QueueManager.getInstance().getTranscribeOptions()
  })

  ipcMain.handle(IPCCHANNELS.UPDATE_TRANSCRIBE_OPTION, (_event, { key, value }) => {
    return QueueManager.getInstance().updateTranscribeOption(key, value)
  })

  ipcMain.handle(
    IPCCHANNELS.CREATE_JOB,
    <T extends JobType>(_event, args: { type: T; data: JobDataForType<T> }) => {
      const { type, data } = args
      return QueueManager.getInstance().createJob(type, data)
    }
  )
  ipcMain.handle(IPCCHANNELS.QUEUE_PENDING_JOBS, () => {
    return QueueManager.getInstance().queuePendingJobs()
  })

  ipcMain.handle(IPCCHANNELS.GET_JOBLIST, <T extends JobType>(_event, args: { type: T }) => {
    const { type } = args
    const jobs = QueueManager.getInstance().getJobList(type)

    return jobs.map((job) => {
      switch (type) {
        case 'Transcribe': {
          const data = job.data as TranscribeJobData

          return {
            id: job.id,
            fileName: data.fileName,
            duration: data.duration,
            filePath: data.filePath
          }
        }
        case 'Export': {
          const data = job.data as ExportJobData

          return {
            id: job.id,
            filePath: data.filePath
          }
        }
        default:
          throw new Error(`Unsupported job type: ${type}`)
      }
    })
  })
}
