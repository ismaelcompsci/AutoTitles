import path from 'path'
import { useState } from 'react'
import { flushSync } from 'react-dom'
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
}

export type Step = 'IDLE' | 'AUDIO' | 'TRANSCRIBING' | 'DONE'
export type WhisperTask = {
  step: Step
  // model path only
  model: string
  maxWordsPerSegment: number
  lang: string
  id: string

  media: WhisperTaskMedia

  // whisper response
  response?: string[][]
}

export const useTranscription = () => {
  const [transcribing, setTranscribing] = useState(false)
  const [task, setTask] = useState<WhisperTask | null>(null)

  const generateTranscription = async (task: WhisperTask) => {
    setTranscribing(true)
    setTask(task)
    const audiopath = path.join(task.media.folder, `${task.id}.mp3`)

    setTask({ ...task, step: 'AUDIO' })
    const encodedFilePath = await window.api.encodeForWhisper(task.media.original_input_path)
    const browserencodedaudio = await window.api.encodeAudioForBrowser({
      inputPath: task.media.original_input_path,
      outputPath: audiopath
    })

    const whisperParams = {
      language: 'en',
      model: task.model,
      fname_inp: encodedFilePath,
      max_len: task.maxWordsPerSegment
    }

    setTask({ ...task, step: 'TRANSCRIBING' })

    for (const [key, value] of Object.entries(whisperParams)) {
      console.log(key, typeof value)
    }
    const response = await window.api.transcribe(whisperParams)
    const media: WhisperTaskMedia = {
      original_input_path: task.media.original_input_path,
      whisper_compatible_audio_input_path: encodedFilePath,
      converted_html5_audio_supported_path: browserencodedaudio,
      folder: task.media.folder
    }

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
