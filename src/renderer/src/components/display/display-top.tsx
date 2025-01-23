import { CornerUpLeft, CornerUpRight, Trash2, Copy, Search } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { Button } from '../ui/button'
import { useAtomValue, useSetAtom } from 'jotai'
import { playingAtom } from '@/state/media-display-state'
import { currentTaskAtom, mediaProviderAtom } from '@/state/whisper-model-state'
import { SubtitleList } from './subtitle-list'

export const DisplayTop = () => {
  return (
    <div className="pt-5">
      {/* video */}
      <DisplayTopVideo />

      {/* caps */}
      <DisplayTopSubtitles />
    </div>
  )
}

export const DisplayTopSubtitles = () => {
  const task = useAtomValue(currentTaskAtom)

  return (
    <>
      <div id="subtitle-controls" className="flex justify-between items-center py-2">
        <div className="flex gap-2">
          <Button
            variant={'secondary'}
            shape="circle"
            size="tiny"
            className="flex flex-row border-none"
          >
            <CornerUpLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={'secondary'}
            shape="circle"
            size="tiny"
            className=" flex flex-row border-none"
          >
            <CornerUpRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={'secondary'}
            shape="circle"
            size="tiny"
            className=" flex flex-row border-none"
          >
            <Trash2 className="w-4 h-4 " />
          </Button>
          <Button
            variant={'secondary'}
            shape="circle"
            size="tiny"
            className=" flex flex-row border-none"
          >
            <Copy className="w-4 h-4 " />
          </Button>
          <Button
            variant={'secondary'}
            shape="circle"
            size="tiny"
            className=" flex flex-row border-none"
          >
            <Search className="w-4 h-4 " />
          </Button>
        </div>
      </div>

      {task?.response ? <SubtitleList subtitles={task?.response} /> : <div>making...</div>}
    </>
  )
}

export const DisplayTopVideo = () => {
  const setPlaying = useSetAtom(playingAtom)
  const setMediaProvider = useSetAtom(mediaProviderAtom)
  const task = useAtomValue(currentTaskAtom)

  const { videoSrc, type } = useMemo(() => {
    return {
      videoSrc: `file://${task?.media?.original_input_path}`,
      type: task?.media.type
    }
  }, [task?.media])

  const handleRef = useCallback((ref: HTMLMediaElement | undefined | null) => {
    if (ref) {
      setMediaProvider(ref)
    }
  }, [])

  return (
    <div id="media-display-top" className="w-full flex justify-center">
      {type === 'video' ? (
        <video
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          ref={handleRef}
          loop
          className="aspect-video h-64 rounded-lg bg-black"
          controls={false}
        >
          <source src={videoSrc} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <audio
          loop
          controls={false}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          ref={handleRef}
        >
          <source src={videoSrc} />
        </audio>
      )}
    </div>
  )
}
