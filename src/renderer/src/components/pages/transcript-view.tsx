import { MediaPlayerControls } from '../transcript/controls'
import { VideoPlayer } from '../transcript/video-player'
import { SubtitleList } from '../transcript/subtitle-list'
import { Waveform } from '../transcript/waveform'
import { ResizablePanel } from '../common/resizeable-panel'
import { useAtomValue, useSetAtom } from 'jotai'
import { pageAtom, transcribeJobListAtom } from '@/state/state'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'
import { TranscribeListSerialized } from 'src/shared/models'

export const TranscriptView = () => {
  return (
    <div className="flex size-full flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <TopPanel />
      </div>

      <ResizablePanel minSize={90} defaultSize={200}>
        <BottomPanel />
      </ResizablePanel>
    </div>
  )
}

export const BottomPanel = () => {
  return (
    <div id="timeline" className="flex size-full flex-col border-t ">
      <MediaPlayerControls />
      <Waveform />
    </div>
  )
}

export const TopPanel = () => {
  return (
    <div className="relative flex size-full flex-col text-sm">
      <TranscriptHeader />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <VideoPlayer />

        <SubtitleList />
      </div>
    </div>
  )
}

const TranscriptHeader = () => {
  const setPage = useSetAtom(pageAtom)
  const transcribeJobList = useAtomValue(transcribeJobListAtom)
  const job = transcribeJobList[0] as TranscribeListSerialized | null

  const handleStartExport = async () => {
    await window.api.createJob({ type: 'Export', data: { filePath: job?.filePath } })
    setPage('export')
  }

  return (
    <div className="relative min-h-9 px-4 text-gray-900 drag-none border-b-[0.5px] justify-center gap-3 max-w-full flex items-center text-xs font-medium ">
      {job?.fileName && (
        <>
          <span>{job?.fileName}</span>

          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            <Button
              size={'tiny'}
              variant={'secondary'}
              suffix={<ArrowRight className="w-4 h-4 mr-1 " />}
              onClick={handleStartExport}
            >
              Export
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
