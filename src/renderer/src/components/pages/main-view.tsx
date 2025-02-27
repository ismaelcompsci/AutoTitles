import { useAtomValue, useSetAtom } from 'jotai'
import { HomeView } from './home-view'
import { TranscriptionConfigurationView } from './transcription-configuration-view'
import { TranscriptView } from './transcript-view'
import { pageAtom } from '@/state/state'
import { mainContainerRefAtom } from '@/state/state'
import { ExportView } from './export-view'
import { ModelManagerView } from './model-manager-view'
import { cn } from '@/lib/utils'
import { VideoPage } from './video-page'

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
    case 'model-manager':
      View = ModelManagerView
      break
    case 'video':
      View = VideoPage
      break
  }

  return (
    <div className={cn('z-0 size-full p-0', 'pb-2.5 pl-0 pr-2.5')}>
      <div
        ref={setMainContainerRef}
        className="relative size-full bg-background-100 overflow-hidden rounded-sm border-[0.5px] contain-inline-size [container-type:inline-size]"
      >
        <View />
      </div>
    </div>
  )
}
