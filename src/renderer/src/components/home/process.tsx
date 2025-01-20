import { currentTaskAtom } from '@/state/whisper-model-state'
import { useAtom } from 'jotai'
import { Loader2 } from 'lucide-react'
import './p.css'
import { useEffect } from 'react'
import { Step, useTranscription } from '@/hooks/use-transcription'
import { MediaProvider } from '@/state/context'
import { WhisperSubtitleDisplay } from '../display/subtitle-display'

const stepToInfoMap: Record<Step, string> = {
  AUDIO: 'Converting audio to correct format...',
  DONE: 'Finished',
  IDLE: 'Waiting for things...',
  TRANSCRIBING: 'Generating subtitles for you...'
}

export const Process = () => {
  const [task, setTask] = useAtom(currentTaskAtom)

  const { generateTranscription, task: workingTask } = useTranscription()

  useEffect(() => {
    ;(async () => {
      if (task) {
        if (task.step !== 'DONE') {
          await generateTranscription(task)
        }
      }
    })()
  }, [task])

  useEffect(() => {
    // DEV ONLY
    if (workingTask?.step === 'DONE') {
      setTask(workingTask)
    }
  }, [workingTask])

  if (workingTask) {
    return (
      <div>
        <MediaProvider task={workingTask}>
          <WhisperSubtitleDisplay />
        </MediaProvider>
      </div>
    )
  }

  return <div>PROCESS Done</div>
}
