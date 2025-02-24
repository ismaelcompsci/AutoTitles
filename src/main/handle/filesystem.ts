import { app } from 'electron'
import path from 'path'

export const DEFAULT_DOWNLOADS_DIR = path.join(app.getPath('downloads'))
