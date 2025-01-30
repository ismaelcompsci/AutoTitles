import { useAtomValue, useSetAtom } from 'jotai'
import { HomeView } from './home-view'
import { TranscriptionConfigurationView } from './transcription-configuration-view'
import { TranscriptView } from './transcript-view'
import { pageAtom } from '@/state/state'
import { mainContainerRefAtom } from '@/state/state'
import { ExportView } from './export-view'

export const MainView = () => {
  const setMainContainerRef = useSetAtom(mainContainerRefAtom)
  const page = useAtomValue(pageAtom)

  let View: () => JSX.Element
  switch (page) {
    case 'home':
      View = HomeView
      break
    case 'transcript-config':
      View = TranscriptionConfigurationView
      break
    case 'transcript':
      View = TranscriptView
      break
    case 'export':
      View = ExportView
      break
  }

  let title: string

  switch (page) {
    case 'home':
      title = 'New Transcript'
      break
    case 'transcript-config':
      title = 'Transcript Configuration'
      break
    case 'transcript':
      title = 'Transcription'
      break
    case 'export':
      title = 'Export'
      break
  }

  return (
    <div className="z-0 size-full md:pb-2.5 md:pl-0 md:pr-2.5 p-0">
      <div
        ref={setMainContainerRef}
        className="relative size-full bg-background-100 overflow-hidden md:rounded-sm border-[0.5px] rounded-none"
      >
        <View />
        {/* 
        <div className="size-full">

          <header className="drag px-4 min-h-9 border-b-[0.5px] gap-3 max-w-full flex items-center text-xs font-medium">
            <div>{title}</div>

            <div className="flex flex-1" />

            <Button
              size={'tiny'}
              variant={'secondary'}
              className="text-xs drag-none px-3"
              suffix={<MoveRight className="w-4 h-4" />}
            >
              Start
            </Button>
          </header>

          <div className="size-full">
            <View />
          </div>
        </div> */}
      </div>
    </div>
  )
}
