import { Step } from '@/hooks/use-transcription'
import { currentTaskAtom, fileInputAtom } from '@/state/whisper-model-state'
import { useAtomValue } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { Plus } from 'lucide-react'

import { Gauge } from '../ui/gauge'
import { Button } from '../ui/button'

const taskStepAtom = selectAtom(currentTaskAtom, (task) => task?.step)

export const AppHeader = () => {
  const file = useAtomValue(fileInputAtom)
  const step = useAtomValue(taskStepAtom)

  return (
    <div className="header h-10 flex items-center gap-8 shrink-0 bg-background [app-region:drag;]">
      <div
        style={{
          paddingLeft: '81px'
        }}
        className="flex"
      ></div>
      <div className="flex items-center gap-2 min-w-0 w-full">
        <div className="flex flex-shrink gap-2 w-full">
          <div className=" w-full flex justify-center items-center">
            <span className="[app-region:no-drag;] cursor-default">{file?.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-1 mr-6">
        {step && step !== 'DONE' ? (
          <Gauge size="tiny" value={calcPercentForStep(step)} />
        ) : (
          <Button variant={'tertiary'} size={'tiny'} className="[app-region:no-drag;]">
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

const calcPercentForStep = (step: Step) => {
  switch (step) {
    case 'IDLE':
      return 0
    case 'AUDIO':
      return 25
    case 'TRANSCRIBING':
      return 50
    case 'DONE':
      return 100
    default:
      return 0
  }
}
