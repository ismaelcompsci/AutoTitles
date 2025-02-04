import { secondsToTimestamp } from '@/lib/utils'
import { MoreVertical, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useAtomValue } from 'jotai'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Slider } from '../common/slider'
import { useWavesurfer } from '../common/wavesurfer-provider'
import { currentTimeAtom, playingAtom } from '@/state/state'
import { durationAtom } from '@/state/state'
import { debounce } from 'lodash'

const TimeSlider = () => {
  const duration = useAtomValue(durationAtom)
  const currentTime = useAtomValue(currentTimeAtom)
  const { ws } = useWavesurfer()

  return (
    <Slider
      className="flex-1"
      value={[(currentTime / duration) * 100]}
      onValueChange={([v]) => ws?.seekTo((duration * (v / 100)) / duration)}
    />
  )
}

const CurrentTimeDisplay = () => {
  const duration = useAtomValue(durationAtom)
  const currentTime = useAtomValue(currentTimeAtom)

  return (
    <span className="text-sm font-gesit-mono text-gray-900">
      <span className="">{secondsToTimestamp(currentTime)}</span>
      <span className=""> / {secondsToTimestamp(duration)}</span>
    </span>
  )
}

const MediaPlayerPlayPauseButton = () => {
  const playing = useAtomValue(playingAtom)
  const { ws } = useWavesurfer()

  const playOrPause = () => {
    if (!ws) return

    ws.playPause()
  }

  if (playing) {
    return (
      <Button
        onClick={playOrPause}
        className="border-none"
        size={'tiny'}
        variant={'secondary'}
        shape="circle"
      >
        <Pause className="h-4 w-4 fill-primary" />
      </Button>
    )
  }

  return (
    <Button
      onClick={playOrPause}
      className="border-none"
      size={'tiny'}
      variant={'secondary'}
      shape="circle"
    >
      <Play className="h-4 w-4 fill-primary" />
    </Button>
  )
}
export const MediaPlayerControls = () => {
  return (
    <div className="media-controls p-4 flex flex-col w-full">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MediaPlayerPlayPauseButton />
            <CurrentTimeDisplay />
          </div>

          <TimeSlider />

          <div className="flex items-center gap-2">
            <VolumeSlider />

            <span className="text-sm font-medium text-zinc-400">{1.0}x</span>
            <Button variant="tertiary" size="tiny" className="text-zinc-400">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export const VolumeSlider = () => {
  const [volume, setVolume] = useState(getStoredVolume() ?? 75)
  const { ws } = useWavesurfer()

  useEffect(() => {
    if (!ws) return

    ws.setVolume(volume / 100)
    storeVolume(volume)
  }, [volume, ws])

  const storeVolume = debounce(setStoredVolume, 100)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'tertiary'} size={'tiny'}>
          <Volume2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="flex flex-col items-center gap-2 h-52 w-fit justify-center bg-background-100"
      >
        <Volume2 className="shrink-0 opacity-60 w-4 h-4 stroke-2" aria-hidden="true" />
        <Slider
          value={[volume]}
          onValueChange={(v) => setVolume(v[0])}
          className="w-1"
          orientation="vertical"
        />
        <VolumeX className="shrink-0 opacity-60 w-4 h-4 stroke-2" aria-hidden="true" />
      </PopoverContent>
    </Popover>
  )
}

const setStoredVolume = (volume: number) => {
  localStorage.setItem(`volume`, volume.toString())
}

const getStoredVolume = (): number | undefined => {
  const volumeString = localStorage.getItem(`volume`)

  if (volumeString) {
    return Number(volumeString)
  }

  return undefined
}
