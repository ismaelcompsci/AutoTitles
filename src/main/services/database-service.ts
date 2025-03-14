import Database, { Database as DBType } from 'better-sqlite3'
import path from 'path'
import os from 'os'
import fs from 'fs'

export class DatabaseService {
  private static instance: DatabaseService
  protected db: DBType

  private constructor() {
    const root = path.join(os.homedir(), '.autotitles')
    const dbpath = path.join(root, 'database')
    fs.mkdirSync(dbpath, { recursive: true })

    const fullpath = path.join(dbpath, 'autotitles.db')
    this.db = new Database(fullpath)
    this.db.pragma('journal_mode = WAL')
    this.initializeTables()
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  private initializeTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS captions (
        captionId INTEGER PRIMARY KEY AUTOINCREMENT,
        captionIndex INTEGER,
        fileName TEXT NOT NULL,
        text TEXT,
        startMs REAL,
        endMs REAL,
        confidence REAL,
        timestampMs REAL
      )
    `)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS whisperconfig (
        id INTEGER PRIMARY KEY,
        model TEXT,
        maxLen INTEGER,
        splitOnWord INTEGER,
        language TEXT,
        translate INTEGER
      )
    `)

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS export_settings (
        id INTEGER PRIMARY KEY,
        format TEXT,
        folder TEXT
      )
    `)
  }

  protected runInTransaction<T>(operation: () => T): T {
    const transaction = this.db.transaction(operation)
    return transaction()
  }

  getDatabase(): DBType {
    return this.db
  }
}
