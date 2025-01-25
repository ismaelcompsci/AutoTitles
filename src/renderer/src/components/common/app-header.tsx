import { Step } from '@/hooks/use-transcription'
import { currentTaskAtom, fileInputAtom } from '@/state/whisper-model-state'
import { useAtomValue, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { ArrowRight, MoveLeft, MoveRight, Plus } from 'lucide-react'
import { Gauge } from '@/components/ui/gauge'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useLocation, useNavigate } from 'react-router-dom'
import { stepAtom } from '@/state/main-state'
import { MenuContainer, MenuButton, MenuItem, Menu } from '@/components/ui/dropdown'
import { Modal } from '@/components/ui/modal'
import { ConfigSection } from './config-section'
import { ConfigItem } from './config-item'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { useState } from 'react'
import { toast } from 'sonner'
import { generateSRT } from '@/lib/utils'
import path from 'path'

const taskStepAtom = selectAtom(currentTaskAtom, (task) => task?.step)
export const AppHeader = () => {
  const setFileInput = useSetAtom(fileInputAtom)
  const setCurrentTask = useSetAtom(currentTaskAtom)
  const setCurrentStep = useSetAtom(stepAtom)
  const file = useAtomValue(fileInputAtom)
  const step = useAtomValue(taskStepAtom)
  // force update on nav
  const nav = useNavigate()
  const location = useLocation()

  const hasHistory = window.history.state.idx !== 0

  const handleButton = () => {
    if (location.pathname === '/' || location.pathname === '/home') {
    } else {
      nav('/home')
    }

    setFileInput(null)
    setCurrentStep('INPUT')
    setCurrentTask(null)

    console.log(location)
    console.log('handleButton')
  }

  return (
    <div className="header h-10 flex items-center gap-8 shrink-0 bg-background [app-region:drag;]">
      <div
        style={{
          paddingLeft: '81px'
        }}
        className="flex gap-2"
      >
        <SidebarTrigger />

        <Button
          onClick={() => {
            window.history.back()
          }}
          disabled={!hasHistory}
          className="px-0 text-muted-foreground disabled:text-muted [app-region:no-drag;] disabled:bg-background-100 disabled:border-none"
          size={'tiny'}
          shape="square"
          variant={'tertiary'}
        >
          <MoveLeft className="h-4 w-4" />
        </Button>

        <Button
          className="px-0 text-muted-foreground disabled:text-muted [app-region:no-drag;] disabled:bg-background-100 disabled:border-none"
          size={'tiny'}
          shape="square"
          variant={'tertiary'}
          onClick={() => {
            window.history.forward()
          }}
        >
          <MoveRight className="h-4 w-4 text-muted" />
        </Button>
      </div>
      <div className="flex items-center gap-2 min-w-0 w-full">
        <div className="flex flex-shrink gap-2 w-full">
          <div className=" w-full flex justify-center items-center">
            <span className="[app-region:no-drag;] cursor-default">{file?.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-row items-center gap-2 mr-4">
        {step && step !== 'DONE' ? (
          <Gauge size="tiny" value={calcPercentForStep(step)} />
        ) : (
          <MenuContainer>
            <MenuButton variant={'tertiary'} size={'tiny'} className="[app-region:no-drag;]">
              <Plus className="w-4 h-4" />
            </MenuButton>

            <Menu
              side="bottom"
              collisionPadding={{
                right: 20
              }}
            >
              <MenuItem onClick={handleButton} className="gap-2 h-9 text-sm">
                <Plus className="w-4 h-4" />
                New
              </MenuItem>
            </Menu>
          </MenuContainer>
        )}

        {step === 'DONE' && <ExportDialog />}
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

const ExportOptions = [
  {
    label: '.SRT',
    value: 'srt'
  }
]

const downloadsFolder = await window.api.getDownloadsFolder()

const subtitlesAtom = selectAtom(currentTaskAtom, (task) => task?.response)
export const ExportDialog = () => {
  const [format, setFormat] = useState<string>()
  const [folder, setFolder] = useState<string>(downloadsFolder)
  const subtitles = useAtomValue(subtitlesAtom)

  const handleClick = async () => {
    const folder = await window.api.chooseFolder()

    if (folder) {
      setFolder(folder)
    }
  }

  const handleExport = async () => {
    // export

    if (!subtitles) {
      toast.error('No subtitles')

      return
    }

    const srt = generateSRT(subtitles)
    const filename = `expoted.srt`
    const filepath = path.join(folder, filename)
  }

  return (
    <Modal.Modal>
      <Modal.Trigger asChild>
        <Button
          size={'tiny'}
          className="[app-region:no-drag;]"
          prefix={<ArrowRight className="h-4 w-4" />}
        >
          Export
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Body>
          <Modal.Header>
            <Modal.Title>Export Manager</Modal.Title>
          </Modal.Header>

          <ConfigSection title="General">
            <ConfigItem label="Format" divider>
              <div className="grow" />
              <div>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger className="w-full border-none gap-1 max-w-[140px]">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectGroup>
                      <SelectLabel className="text-[10px] text-muted-foreground">
                        Supported Export Formats
                      </SelectLabel>
                      {ExportOptions.map((option) => {
                        return (
                          <SelectItem key={`${option.value}`} value={option.value}>
                            {option.label}
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </ConfigItem>

            <ConfigItem
              label="Export Folder"
              // GET DEFAULT FOLDER
              sublabel={folder ? folder : downloadsFolder}
            >
              <div className="grow" />

              <Button
                className="text-sm w-32"
                onClick={handleClick}
                variant={'secondary'}
                size={'sm'}
              >
                Select Folder
              </Button>
            </ConfigItem>
          </ConfigSection>
        </Modal.Body>

        <Modal.Actions>
          <Modal.Cancel>Cancel</Modal.Cancel>
          <Modal.Action onClick={handleExport} disabled={!format}>
            Continue
          </Modal.Action>
        </Modal.Actions>
      </Modal.Content>
    </Modal.Modal>
  )
}
