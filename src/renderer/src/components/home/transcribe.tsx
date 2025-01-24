import { currentTaskAtom } from '@/state/whisper-model-state'
import { useAtomValue } from 'jotai'
import './p.css'
import { useEffect } from 'react'
import { useTranscription } from '@/hooks/use-transcription'
import { WhisperSubtitleDisplay } from '../display/subtitle-display'

export const Transcribe = () => {
  const task = useAtomValue(currentTaskAtom)

  const { generateTranscription } = useTranscription()

  useEffect(() => {
    ;(async () => {
      if (task) {
        if (task.step !== 'DONE') {
          await generateTranscription(task)
        }
      }
    })()
  }, [task])

  if (!task) {
    return <div className="h-full w-full animate-pulse"></div>
  }

  return (
    <div className="flex flex-col justify-center h-full flex-1 w-full">
      <WhisperSubtitleDisplay />
    </div>
  )
}
