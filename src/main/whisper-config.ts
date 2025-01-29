import { WhisperInputConfig } from '../shared/models'

export const whisperInputConfig: WhisperInputConfig = {
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
