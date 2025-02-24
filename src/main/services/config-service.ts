import { DatabaseService } from './database-service'
import { ExportConfig, WhisperInputConfig } from '../../shared/models'

export class ConfigService {
  private static instance: ConfigService
  private dbService: DatabaseService

  private constructor() {
    this.dbService = DatabaseService.getInstance()
    this.initializeDefaultConfigs()
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService()
    }
    return ConfigService.instance
  }

  private readonly baseWhisperInputConfig = {
    model: '',
    language: 'auto',
    maxLen: 60,
    splitOnWord: 1,
    translate: 0
  }

  private readonly baseExportConfig: ExportConfig = {
    format: '',
    folder: ''
  }

  private initializeDefaultConfigs(): void {
    const db = this.dbService.getDatabase()

    const whisperConfig = db.prepare('SELECT * FROM whisperconfig').all()
    const exportConfig = db.prepare('SELECT * FROM export_settings').all()

    if (whisperConfig.length === 0) {
      db.prepare(
        `
        INSERT INTO whisperconfig (
          model, maxLen, splitOnWord, language, translate
        ) VALUES (
          @model, @maxLen, @splitOnWord, @language, @translate
        )
      `
      ).run(this.baseWhisperInputConfig)
    }

    if (exportConfig.length === 0) {
      db.prepare('INSERT INTO export_settings (format, folder) VALUES (@format, @folder)').run(
        this.baseExportConfig
      )
    }
  }

  getWhisperConfig(): WhisperInputConfig {
    const dbConfig = this.dbService
      .getDatabase()
      .prepare('SELECT * FROM whisperconfig LIMIT 1')
      .get() as WhisperInputConfig

    return {
      model: dbConfig.model,
      language: dbConfig.language,
      maxLen: dbConfig.maxLen,
      splitOnWord:
        typeof dbConfig.splitOnWord === 'number'
          ? dbConfig.splitOnWord === 1
          : dbConfig.splitOnWord,
      translate:
        typeof dbConfig.translate === 'number' ? dbConfig.translate === 1 : dbConfig.translate
    }
  }

  updateWhisperConfig(key: keyof WhisperInputConfig, value: unknown): void {
    const stmt = this.dbService
      .getDatabase()
      .prepare(`UPDATE whisperconfig SET ${key} = ? WHERE id = 1`)

    if (typeof value === 'boolean') {
      value = value ? 1 : 0
    }

    stmt.run(value)
  }

  getExportConfig(): ExportConfig {
    return this.dbService
      .getDatabase()
      .prepare('SELECT * FROM export_settings LIMIT 1')
      .get() as ExportConfig
  }

  updateExportConfig(key: keyof ExportConfig, value: string): void {
    const stmt = this.dbService
      .getDatabase()
      .prepare(`UPDATE export_settings SET ${key} = ? WHERE id = 1`)
    stmt.run(value)
  }
}
