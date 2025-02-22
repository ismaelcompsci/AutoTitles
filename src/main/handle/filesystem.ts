import { app } from 'electron'
import path from 'path'
import os from 'os'

export const DEFAULT_DOWNLOADS_DIR = path.join(app.getPath('downloads'))
