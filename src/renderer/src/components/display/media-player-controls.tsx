import * as SliderPrimitive from '@radix-ui/react-slider'
import { secondsToTimestamp } from '@/lib/utils'
import { Pause, Play } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '../ui/button'
import { useAtom, useAtomValue } from 'jotai'
import { currentTimeAtom, playingAtom } from '@/state/media-display-state'
import { durationAtom, wavesurferAtom } from '@/state/whisper-model-state'

const TimeSlider = () => {
  const duration = useAtomValue(durationAtom)
  const wavesurfer = useAtomValue(wavesurferAtom)
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom)

  useEffect(() => {
    if (!wavesurfer) return

    const subs = [
      wavesurfer.on('timeupdate', (time: number) => {
        setCurrentTime(Math.ceil(time * 100) / 100)
      })
    ]

    return () => {
      subs.forEach((s) => s())
    }
  }, [wavesurfer])

  return (
    <SliderPrimitive.Root
      value={[(currentTime / duration) * 100]}
      onValueChange={([v]) => wavesurfer?.seekTo((duration * (v / 100)) / duration)}
      className={'relative flex h-5 w-full touch-none select-none items-center'}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-3 w-2 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  )
}

const CurrentTimeDisplay = () => {
  const duration = useAtomValue(durationAtom)
  const currentTime = useAtomValue(currentTimeAtom)

  return (
    <span className="text-sm font-gesit-mono">
      <span className="text-lg text-teal-700">{secondsToTimestamp(currentTime)}</span>
      <span className="text-teal-500"> / {secondsToTimestamp(duration)}</span>
    </span>
  )
}

const MediaPlayerPlayPauseButton = () => {
  const playing = useAtomValue(playingAtom)
  const wavesurfer = useAtomValue(wavesurferAtom)

  const playOrPause = () => {
    if (!wavesurfer) return

    // CAHNGE
    wavesurfer.setVolume(0.3)
    wavesurfer.playPause()
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
        <Pause className="h-5 w-5 fill-primary" />
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
      <Play className="h-5 w-5 fill-primary" />
    </Button>
  )
}
export const MediaPlayerControls = () => {
  return (
    <div className="media-controls border-t-[1px] px-4 py-1 flex flex-col w-full">
      <div className="flex items-center gap-4">
        <CurrentTimeDisplay />

        <MediaPlayerPlayPauseButton />
      </div>
      <TimeSlider />
    </div>
  )
}
