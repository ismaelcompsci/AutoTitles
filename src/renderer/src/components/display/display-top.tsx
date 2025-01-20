import { MediaShadowProviderContext } from '@/state/context'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { CornerUpLeft, CornerUpRight, Trash2, Copy, Search } from 'lucide-react'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { Button } from '../ui/button'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { activeRegionIdAtom, playingAtom } from '@/state/media-display-state'
import { clampPosition, cn, millisecondsToTimestamp } from '@/lib/utils'

export const DisplayTop = () => {
  return (
    <div className="flex-grow overflow-auto flex flex-col justify-center items-center pt-4">
      {/* video */}
      <DisplayTopVideo />

      {/* caps */}
      <DisplayTopSubtitles />
    </div>
  )
}

export const DisplayTopSubtitles = () => {
  const activeRegionId = useAtomValue(activeRegionIdAtom)
  const { subtitles, duration } = useContext(MediaShadowProviderContext)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeRegionId) return

    const activeElement = document.getElementById(activeRegionId)
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [activeRegionId])

  return (
    <div className="w-full rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center py-2 px-24">
        <div className="flex gap-2">
          <Button shape="circle" size="tiny" className="flex flex-row border-none">
            <CornerUpLeft className="w-4 h-4" />
          </Button>
          <Button shape="circle" size="tiny" className=" flex flex-row border-none">
            <CornerUpRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button shape="circle" size="tiny" className=" flex flex-row border-none">
            <Trash2 className="w-4 h-4 " />
          </Button>
          <Button shape="circle" size="tiny" className=" flex flex-row border-none">
            <Copy className="w-4 h-4 " />
          </Button>
          <Button shape="circle" size="tiny" className=" flex flex-row border-none">
            <Search className="w-4 h-4 " />
          </Button>
        </div>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-grow px-24 h-24 overflow-auto"
        style={{ height: 'calc(100vh - 500px - 96px - 2px)' }}
      >
        {subtitles?.map((subtitle) => {
          const start = subtitle.from / 1000
          const end = clampPosition(duration, subtitle.to / 1000)

          const id = `id-${start}-${end}`
          const active = id === activeRegionId

          return (
            <div
              id={id}
              key={id}
              className={cn(
                'group flex items-start space-x-4 px-2 p-3 hover:bg-gray-200 transition-colors rounded-md',
                active ? 'bg-teal-200' : undefined
              )}
            >
              <span className="flex-shrink-0 text-sm font-mono text-teal-700 group-hover:text-teal-900 pt-1">
                {millisecondsToTimestamp(subtitle.from)}
              </span>
              <p className="flex-grow text-gray-800 group-hover:text-gray-900">{subtitle.text}</p>
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}

export const DisplayTopVideo = () => {
  const setPlaying = useSetAtom(playingAtom)
  const { media, setMediaProvider } = useContext(MediaShadowProviderContext)

  const videoSrc = useMemo(() => {
    return `file://${media?.original_input_path}`
  }, [media?.original_input_path])

  return (
    <div className="w-full shadow-md  max-w-lg">
      <video
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        ref={(ref) => {
          if (ref) {
            setMediaProvider(ref)
          }
        }}
        loop
        className="aspect-video rounded-lg"
        controls={false}
      >
        <source src={videoSrc} />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
