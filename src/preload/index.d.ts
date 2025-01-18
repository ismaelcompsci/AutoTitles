import { ElectronAPI } from '@electron-toolkit/preload'
import { IAPI } from '../renderer/renderer'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IAPI
  }
}
