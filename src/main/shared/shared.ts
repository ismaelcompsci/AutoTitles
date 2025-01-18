export interface WhisperParams {
  language: string
  model: string
  // filename input
  fname_inp: string

  use_gpu?: boolean
  flash_attn?: boolean
  no_prints?: boolean
  no_timestamps?: boolean
  audio_ctx?: number // Use number for int32_t
  comma_in_time?: boolean
  translate?: boolean
  max_len?: number
  split_on_word?: boolean
}
