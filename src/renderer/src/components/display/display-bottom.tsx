import { MediaShadowProviderContext } from '@/state/context'
import { useContext, useRef, useEffect } from 'react'
import { MediaPlayerControls } from './media-player-controls'
import { useSetAtom } from 'jotai'
import { activeRegionIdAtom } from '@/state/media-display-state'

export const DisplayBottom = () => {
  const setActiveRegionId = useSetAtom(activeRegionIdAtom)
  const { setWaveformContainerRef, regions, duration } = useContext(MediaShadowProviderContext)

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref?.current) return
    setWaveformContainerRef(ref)
  }, [ref])

  useEffect(() => {
    if (!regions) return
    if (duration === 0) return

    const subscription = regions.on('region-clicked', (region) => {
      regions
        .getRegions()
        .filter((r) => r.id.startsWith('active'))
        .forEach((r) => {
          // remove active regions
          r.remove()
          const newR = regions.addRegion({
            ...r,
            id: `id-${r.start}-${r.end}`
          })

          newR._setTotalDuration(duration)
          setActiveRegionId(null)
        })

      // active region
      region.remove()
      const newR = regions.addRegion({
        ...region,
        id: `active id-${region.start}-${region.end}`
      })

      newR._setTotalDuration(duration)
      setActiveRegionId(`id-${region.start}-${region.end}`)
    })

    return () => {
      subscription()
    }
  }, [regions, duration])

  return (
    <div className="w-full">
      <MediaPlayerControls />

      {/* wave  200px height */}
      <div className="max-w-full overflow-x-scroll">
        <div className="cont" id="waveform" ref={ref} />
      </div>
    </div>
  )
}
