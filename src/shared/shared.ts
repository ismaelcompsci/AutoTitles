export interface WhisperParams {
  language: string
  model: string
  audioInput: string

  maxLen: number // max segment length in characters
  translate: boolean
  split_on_word: boolean
  // max_tokens: number
  tokenTimestamps: boolean
}

export type WhisperResponse = {
  from: number
  to: number
  text: string
}[]
