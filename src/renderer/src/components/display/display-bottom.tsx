import { useRef, useEffect, useState } from 'react'
import { MediaPlayerControls } from './media-player-controls'
import { useAtomValue, useSetAtom } from 'jotai'
import { activeRegionIdAtom } from '@/state/media-display-state'
import { regionsAtom, waveformContainerRefAtom, wavesurferAtom } from '@/state/whisper-model-state'
import { debounce } from 'lodash'

export const DisplayBottom = () => {
  const regions = useAtomValue(regionsAtom)
  const setWaveformContainerRefAtom = useSetAtom(waveformContainerRefAtom)
  const setActiveRegionId = useSetAtom(activeRegionIdAtom)
  const ref = useRef<HTMLDivElement | null>(null)
  const wavesurfer = useAtomValue(wavesurferAtom)

  const [size, setSize] = useState<{ width: number; height: number }>()

  const calContainerSize = () => {
    const size = ref?.current?.closest('.media-player-wrapper')?.getBoundingClientRect()
    const controlsSize = ref?.current?.querySelector('.media-controls')?.getBoundingClientRect()

    if (!size) return

    setSize({ width: size.width, height: size.height })
    if (wavesurfer) {
      wavesurfer.setOptions({
        height: size.height - (controlsSize?.height ?? 0)
      })
    }
  }

  const debouncedCalContainerSize = debounce(calContainerSize, 100)

  useEffect(() => {
    if (!ref?.current) return
    setWaveformContainerRefAtom(ref)

    if (!wavesurfer) return

    let rafId: number
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        debouncedCalContainerSize()
      })
    })
    observer.observe(ref.current)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
    }
  }, [ref, wavesurfer])

  useEffect(() => {
    if (!regions) return

    const subscriptions = [
      regions.on('region-in', (ev) => {
        ev.setOptions({ id: `active id-${ev.start}-${ev.end}` })
        setActiveRegionId(`id-${ev.start}-${ev.end}`)
      }),

      regions.on('region-out', (ev) => {
        ev.setOptions({ id: `id-${ev.start}-${ev.end}` })
      })
    ]

    return () => {
      subscriptions.forEach((sub) => sub())
    }
  }, [regions])

  return (
    <div ref={ref} className="media-player-wrapper min-h-24 w-full bg-background-200 h-full">
      <MediaPlayerControls />

      <div className="media-player-wrapper max-w-full overflow-x-scroll">
        <div
          style={{
            width: `${size?.width}px`,
            height: `${size?.height}px`
          }}
          className="waveform-container"
          id="waveform"
        />
      </div>
    </div>
  )
}
