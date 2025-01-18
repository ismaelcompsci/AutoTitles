import type { WhisperParams } from 'src/main/shared/shared'
import type {
  DownloadCompleted,
  DownloadProgress,
  DownloadStarted,
  DownloadWhisperModel
} from '../main/handle/download-whisper-model'
import type { FfprobeData } from 'fluent-ffmpeg'

export interface IAPI {
  openFile: (options: Electron.OpenDialogOptions) => Promise<Electron.OpenDialogReturnValue>
  downloadWhisperModel: (
    args: DownloadWhisperModel
  ) => Promise<{ alreadyExisted: boolean; downloadId: string }>
  probe: (file: string) => Promise<FfprobeData>
  transcribe: (whisper: WhisperParams) => Promise<string[][]>
  encodeForWhisper: (file: string) => Promise<string>
  encodeAudioForBrowser: (args: { inputPath: string; outputPath: string }) => Promise<string>
  getDownloadsFolder: () => Promise<string>

  onDownloadStarted: (callback: (value: DownloadStarted) => void) => Electron.IpcRenderer
  onDownloadProgress: (callback: (value: DownloadProgress) => void) => Electron.IpcRenderer
  onDownloadCompleted: (callback: (value: DownloadCompleted) => void) => Electron.IpcRenderer
}
