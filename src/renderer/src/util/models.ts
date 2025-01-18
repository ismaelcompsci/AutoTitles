export const models = [
  'tiny',
  'tiny.en',
  'base',
  'base.en',
  'small',
  'small.en',
  'medium',
  'medium.en',
  'large-v1',
  'large-v2',
  'large-v3',
  'large-v3-turbo'
] as const

export const modelSizes: { [key in WhisperModel]: string } = {
  tiny: '77.7 MB',
  'tiny.en': '77.7 MB',
  base: '148 MB',
  'base.en': '148 MB',
  small: '488 MB',
  'small.en': '488 MB',
  medium: '1.53 GB',
  'medium.en': '1.53 GB',
  'large-v1': '3.09 GB',
  'large-v2': '3.09 GB',
  'large-v3': '3.1 GB',
  'large-v3-turbo': '1.62 GB'
}

export type WhisperModel = (typeof models)[number]
