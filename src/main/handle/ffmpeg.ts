import orignal_ffmpeg from 'fluent-ffmpeg'

const ffmpegPath = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked')

orignal_ffmpeg.setFfmpegPath(ffmpegPath)

export const ffmpeg = orignal_ffmpeg
