import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import fs from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// @ts-ignore
import icon from '../../resources/icon.png?asset'
import { downloadWhisperModel } from './handle/download-whisper-model'
import { ElectronDownloadManager } from 'electron-dl-manager'
import { probe } from './handle/ffmpeg'
import { transcribe } from './handle/transcribe'
import { encodeForWhisper } from './handle/encode-for-whisper'
import { encodeAudioForBrowser } from './handle/encode-for-browser'
import { DEFAULT_DOWNLOADS_DIR, getDownloadsFolder } from './handle/filesystem'
import { IPCCHANNELS } from '../shared/constants'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
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
      preload: join(__dirname, '../preload/index.js'),
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
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle(IPCCHANNELS.DOWNLOAD_WHISPER_MODEL, downloadWhisperModel)
  ipcMain.handle(IPCCHANNELS.PROBE, probe)
  ipcMain.handle(IPCCHANNELS.WHISPER_TRANSCRIBE, transcribe)
  ipcMain.handle(IPCCHANNELS.WHISPER_ENCODE, encodeForWhisper)
  ipcMain.handle(IPCCHANNELS.WHISPER_ENCODE_AUDIO, encodeAudioForBrowser)
  ipcMain.handle(IPCCHANNELS.FILESYSTEM_GET_DOWNLOADS_FOLDER, getDownloadsFolder)

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
