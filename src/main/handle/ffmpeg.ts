import orignal_ffmpeg from 'fluent-ffmpeg'
import type { FfprobeData } from 'fluent-ffmpeg'
import { promisify } from 'util'

const ffmpegPath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked')
const ffprobePath = require('ffprobe-static').path.replace('app.asar', 'app.asar.unpacked')

console.info('ffmpegPath', ffmpegPath)
console.info('ffprobePath', ffprobePath)
orignal_ffmpeg.setFfmpegPath(ffmpegPath)
orignal_ffmpeg.setFfprobePath(ffprobePath)

export const ffmpeg = orignal_ffmpeg

const _probeAsync: (file: string) => Promise<FfprobeData> = promisify(ffmpeg.ffprobe)

export async function probe(_event: Electron.IpcMainInvokeEvent, filePath: string) {
  return await _probeAsync(filePath)
}
