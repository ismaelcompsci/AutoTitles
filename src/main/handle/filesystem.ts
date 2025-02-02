import { app } from 'electron'
import path from 'path'
import { modelsDir } from '../model-manager'

export const DEFAULT_DOWNLOADS_DIR = path.join(app.getPath('downloads'))

export const getModelDownloadsFolder = () => {
  return modelsDir
}
