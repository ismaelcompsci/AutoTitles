import { flushSync } from 'react-dom'
import { atom, useAtom, useSetAtom } from 'jotai'
import { toast } from 'sonner'
import { currentTaskAtom } from '@/state/whisper-model-state'
import { WhisperParams, WhisperResponse } from '../../../shared/models'

export type WhisperTaskMedia = {
  type: 'audio' | 'video'
  duration: number
  original_input_path: string
  /**
   * folder to store all this ez cleanup
   */
  folder: string
  whisper_compatible_audio_input_path?: string
  converted_browser_video_supported_path?: string
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

export const transcribingAtom = atom(false)

export const useTranscription = () => {
  const setTask = useSetAtom(currentTaskAtom)
  const [transcribing, setTranscribing] = useAtom(transcribingAtom)

  const generateTranscription = async (task: WhisperTask) => {
    if (transcribing) return

    setTranscribing(true)
    setTask(task)

    try {
      setTask({ ...task, step: 'AUDIO' })
      const encodedFilePath = await window.api.encodeForWhisper(task.media.original_input_path)
      // convert to correct browser audio if it is not supported on web
      // const browserencodedaudio = await window.api.encodeAudioForBrowser({
      //   inputPath: task.media.original_input_path,
      //   outputPath: audiopath
      // })

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
        type: task.media.type,
        original_input_path: task.media.original_input_path,
        whisper_compatible_audio_input_path: encodedFilePath,
        converted_browser_video_supported_path: task.media.original_input_path,
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
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong!'
      console.error(e)
      toast.error(message)
    }
  }

  return {
    generateTranscription
  }
}
