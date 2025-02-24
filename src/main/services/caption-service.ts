import { DatabaseService } from './database-service'
import { DBCaption } from '../types/database'

export class CaptionService {
  private static instance: CaptionService
  private dbService: DatabaseService

  private constructor() {
    this.dbService = DatabaseService.getInstance()

    this.removeAll()
  }

  static getInstance(): CaptionService {
    if (!CaptionService.instance) {
      CaptionService.instance = new CaptionService()
    }
    return CaptionService.instance
  }

  removeAll() {
    console.log('[CaptionService] clearing captions table...')
    this.dbService.getDatabase().prepare(`DELETE FROM captions`).run()
    this.dbService
      .getDatabase()
      .prepare(`UPDATE sqlite_sequence SET seq=1 WHERE name=?`)
      .run('captions')
  }

  insertCaption(caption: Omit<DBCaption, 'captionId'>): void {
    const stmt = this.dbService.getDatabase().prepare(`
      INSERT INTO captions (
        fileName,
        captionIndex,
        text,
        startMs,
        endMs,
        timestampMs,
        confidence
      ) VALUES (
        @fileName,
        @captionIndex,
        @text,
        @startMs,
        @endMs,
        @timestampMs,
        @confidence
      )
    `)

    stmt.run(caption)
  }

  getCaptionsByFileName(fileName: string, limit: number = 99999): DBCaption[] {
    const stmt = this.dbService.getDatabase().prepare(`
      SELECT * FROM captions 
      WHERE fileName = ? 
      ORDER BY startTime ASC 
      LIMIT ?
    `)

    return stmt.all(fileName, limit) as DBCaption[]
  }
}
