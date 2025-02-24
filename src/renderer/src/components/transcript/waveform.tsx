import { useAtom, useAtomValue } from 'jotai'
import { activeRegionIdAtom, audioURLAtom, captionsAtom, captionsByIdAtom } from '@/state/state'
import { useEffect } from 'react'

import { useWavesurfer } from '../common/wavesurfer-provider'

export const Waveform = () => {
  const [captions, setCaptions] = useAtom(captionsAtom)
  const [captionsById, setCaptionsById] = useAtom(captionsByIdAtom)
  const audioURL = useAtomValue(audioURLAtom)
  const { ws, containerRef, addRegion, reloadMedia, selectRegion } = useWavesurfer()
  const activeRegionId = useAtomValue(activeRegionIdAtom)

  useEffect(() => {
    if (activeRegionId) {
      selectRegion(activeRegionId)
    }
  }, [activeRegionId])

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current?.hasChildNodes() === false) {
        reloadMedia()
      }
    }, 100)
  }, [containerRef])

  useEffect(() => {
    if (!ws) return

    const subs = [
      window.api.onCaptionAdded((caption) => {
        const id = `id-${caption.startMs}-${caption.endMs}`
        if (!captions[id]) {
          captionsById[id] = caption
          captions.push(caption)

          setCaptions([...captions])
          setCaptionsById({ ...captionsById })
          addRegion(caption)
        }
      })
    ]

    return () => {
      subs.forEach((s) => s())
    }
  }, [ws])

  return (
    <div className="relative flex size-full flex-col overflow-hidden">
      {typeof audioURL === 'string' ? (
        <div id="waveform" ref={containerRef} className="flex-1 overflow-hidden" />
      ) : (
        <div className="size-full flex justify-center items-center">
          <p className="text-muted-foreground text-xs">hmm, something is missing...</p>
        </div>
      )}
    </div>
  )
}
