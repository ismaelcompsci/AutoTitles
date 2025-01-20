import path from 'path'
import { useState } from 'react'
import { flushSync } from 'react-dom'
// @ts-ignore
import { WhisperParams, WhisperResponse } from '../../../shared/shared'

export type WhisperTaskMedia = {
  /**
   * folder to store all this ez cleanup
   */
  folder: string
  original_input_path: string

  whisper_compatible_audio_input_path?: string

  /**
   * optional because the original input maybe already compatible
   */
  converted_html5_video_supported_path?: string
  /**
   * optional because the original input maybe already compatible
   * if the input is only audio format
   */
  converted_html5_audio_supported_path?: string
  duration: number
}

export type Step = 'IDLE' | 'AUDIO' | 'TRANSCRIBING' | 'DONE'
export type WhisperTask = {
  step: Step
  // model path only
  model: string
  maxLen: number
  lang: string
  id: string

  media: WhisperTaskMedia

  // whisper response
  response?: WhisperResponse
}

export const useTranscription = () => {
  const [transcribing, setTranscribing] = useState(false)
  const [task, setTask] = useState<WhisperTask | null>(null)

  const generateTranscription = async (task: WhisperTask) => {
    if (transcribing) return

    setTranscribing(true)
    setTask(task)
    const audiopath = path.join(task.media.folder, `${task.id}.mp3`)

    setTask({ ...task, step: 'AUDIO' })
    const encodedFilePath = await window.api.encodeForWhisper(task.media.original_input_path)
    const browserencodedaudio = await window.api.encodeAudioForBrowser({
      inputPath: task.media.original_input_path,
      outputPath: audiopath
    })

    const whisperParams: WhisperParams = {
      language: 'en',
      model: task.model,
      audioInput: encodedFilePath,
      maxLen: task.maxLen === 0 ? 60 : task.maxLen,
      translate: false,
      split_on_word: task.maxLen > 0,
      tokenTimestamps: task.maxLen > 0
    }

    setTask({ ...task, step: 'TRANSCRIBING' })

    const response = await window.api.transcribe(whisperParams)
    const media: WhisperTaskMedia = {
      original_input_path: task.media.original_input_path,
      whisper_compatible_audio_input_path: encodedFilePath,
      converted_html5_audio_supported_path: browserencodedaudio,
      folder: task.media.folder,
      duration: task.media.duration
    }

    // remove whisper input
    flushSync(() => {
      setTask({
        ...task,
        response: response,
        media: media,
        step: 'DONE'
      })
    })

    setTranscribing(false)
  }

  return {
    generateTranscription,
    transcribing,
    task
  }
}
