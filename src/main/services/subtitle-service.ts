import { DatabaseService } from './database-service'
import { DBSubtitle } from '../types/database'

export class SubtitleService {
  private static instance: SubtitleService
  private dbService: DatabaseService

  private constructor() {
    this.dbService = DatabaseService.getInstance()

    this.removeAll()
  }

  static getInstance(): SubtitleService {
    if (!SubtitleService.instance) {
      SubtitleService.instance = new SubtitleService()
    }
    return SubtitleService.instance
  }

  removeAll() {
    console.log('[SubtitleService] clearing subtitles table...')
    this.dbService.getDatabase().prepare(`DELETE FROM subtitles`).run()
    this.dbService
      .getDatabase()
      .prepare(`UPDATE sqlite_sequence SET seq=1 WHERE name=?`)
      .run('subtitles')
  }

  insertSubtitle(subtitle: Omit<DBSubtitle, 'segmentId'>): void {
    const stmt = this.dbService.getDatabase().prepare(`
      INSERT INTO subtitles (
        fileName, 
        segmentIndex, 
        segmentText, 
        startTime, 
        endTime, 
        duration
      ) VALUES (
        @fileName,
        @segmentIndex,
        @segmentText,
        @startTime,
        @endTime,
        @duration
      )
    `)

    stmt.run(subtitle)
  }

  getSubtitlesByFileName(fileName: string, limit: number = 99999): DBSubtitle[] {
    const stmt = this.dbService.getDatabase().prepare(`
      SELECT * FROM subtitles 
      WHERE fileName = ? 
      ORDER BY startTime ASC 
      LIMIT ?
    `)

    return stmt.all(fileName, limit) as DBSubtitle[]
  }
}
