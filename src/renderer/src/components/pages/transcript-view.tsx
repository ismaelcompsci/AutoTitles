import { MediaPlayerControls } from '../transcript/controls'
import { VideoPlayer } from '../transcript/video-player'
import { SubtitleList } from '../transcript/subtitle-list'
import { Waveform } from '../transcript/waveform'
import { ResizablePanel } from '../common/resizeable-panel'

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
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <VideoPlayer />

        <SubtitleList />
      </div>
    </div>
  )
}
