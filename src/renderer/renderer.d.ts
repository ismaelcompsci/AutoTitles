import type {
  DownloadCompleted,
  DownloadProgress,
  DownloadStarted,
  DownloadWhisperModel
} from '../main/handle/download-whisper-model'
import type { FfprobeData } from 'fluent-ffmpeg'
import { WhisperParams, WhisperResponse } from '../shared/models'

export interface IAPI {
  downloadWhisperModel: (
    args: DownloadWhisperModel
  ) => Promise<{ alreadyExisted: boolean; downloadId: string; filePath?: string }>
  probe: (file: string) => Promise<FfprobeData>
  transcribe: (whisper: WhisperParams) => Promise<WhisperResponse>
  encodeForWhisper: (file: string) => Promise<string>
  encodeAudioForBrowser: (args: { inputPath: string; outputPath: string }) => Promise<string>
  getDownloadsFolder: () => Promise<string>
  chooseFolder: () => Promise<string | undefined>
  exportSubtitles: (args: {
    filepath: string
    data: { from: number; to: number; text: string }[]
    type: string
  }) => Promise<string>

  onDownloadStarted: (callback: (value: DownloadStarted) => void) => Electron.IpcRenderer
  onDownloadProgress: (callback: (value: DownloadProgress) => void) => Electron.IpcRenderer
  onDownloadCompleted: (callback: (value: DownloadCompleted) => void) => Electron.IpcRenderer
}
