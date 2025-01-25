export const ROUTES = {
  HOME: '/',
  SETTINGS: '/SETTINGS'
}

export const IPCCHANNELS = {
  DOWNLOAD_WHISPER_MODEL: 'download-whisper-modal',
  WHISPER_TRANSCRIBE: 'whisper:transcribe',
  WHISPER_ENCODE: 'whisper:encode',
  WHISPER_ENCODE_AUDIO: 'whisper:encodeaudio',
  FILESYSTEM_GET_DOWNLOADS_FOLDER: 'filesystem:getDownloadsFolder',
  PROBE: 'filesystem:probe',
  FILESYSTEM_CHOOSE_FOLDER: 'filesystem:chooseFolder'
}
