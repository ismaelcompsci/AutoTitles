import Database, { Database as DBType } from 'better-sqlite3'
import { ExportConfig, WhisperInputConfig } from '../shared/models'
import path from 'path'
import os from 'os'
import fs from 'fs'

const root = path.join(os.homedir(), '.autotitles')
const dbpath = path.join(root, 'database')

fs.mkdirSync(dbpath, { recursive: true })

const fullpath = path.join(dbpath, 'autotitles.db')
// remove database TODO
// fs.unlinkSync(fullpath)

export const db: DBType = new Database(fullpath)
db.pragma('journal_mode = WAL')

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS whisperconfig (
    id INTEGER PRIMARY KEY,
    model TEXT,
    useGpu INTEGER,
    maxLen INTEGER,
    splitOnWord INTEGER,
    language TEXT,
    nThreads INTEGER,
    beamSize INTEGER,
    temperatureInc REAL,
    entropyThold REAL,
    prompt TEXT,
    maxContext INTEGER
  );
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS export_settings (
    id INTEGER PRIMARY KEY,
    format TEXT,
    folder TEXT
  );
`)

// Initialize default data if tables are empty
export function initializeDefaultData() {
  const whisperConfig = db.prepare('SELECT * FROM whisperconfig').all() as WhisperInputConfig[]
  const exportConfig = db.prepare('SELECT * FROM export_settings').all() as ExportConfig[]

  if (whisperConfig.length === 0) {
    db.prepare(
      `
      INSERT INTO whisperconfig (
        model, useGpu, maxLen, splitOnWord, language, nThreads,
        beamSize, temperatureInc, entropyThold, prompt, maxContext
      ) VALUES (
        @model, @useGpu, @maxLen, @splitOnWord, @language, @nThreads,
        @beamSize, @temperatureInc, @entropyThold, @prompt, @maxContext
      )
    `
    ).run({
      ...baseWhisperInputConfig,
      useGpu: Number(baseWhisperInputConfig.useGpu),
      splitOnWord: Number(baseWhisperInputConfig.splitOnWord)
    })
  }

  if (exportConfig.length === 0) {
    db.prepare('INSERT INTO export_settings (format, folder) VALUES (@format, @folder)').run(
      baseExportConfig
    )
  }
}

export const baseWhisperInputConfig: WhisperInputConfig = {
  model: '',
  useGpu: false,
  maxLen: 0,
  splitOnWord: false,
  language: 'en',
  nThreads: 4,
  beamSize: 1,
  temperatureInc: 0.2,
  entropyThold: 2.4,
  prompt: '',
  maxContext: 0
}

export const baseExportConfig: ExportConfig = {
  format: '',
  folder: ''
}

export const defaultDownloadedModels: { name: string; path: string }[] = []
