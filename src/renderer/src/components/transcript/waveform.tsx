import { useAtom, useAtomValue } from 'jotai'
import { audioURLAtom, subtitlesAtom, subtitlesByIdAtom } from '@/state/state'
import { useEffect } from 'react'

import { useWavesurfer } from '../common/wavesurfer-provider'

export const Waveform = () => {
  const [subtitles, setSubtitles] = useAtom(subtitlesAtom)
  const [subtitlesById, setSubtitlesById] = useAtom(subtitlesByIdAtom)
  const audioURL = useAtomValue(audioURLAtom)
  const { ws, containerRef, addRegion, reloadMedia } = useWavesurfer()

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current?.hasChildNodes() === false) {
        reloadMedia()
      }
    }, 100)
  }, [containerRef])

  useEffect(() => {
    if (!ws) return

    // TODO FIGURE OUT HOW TO REMOVE LISTENER
    window.api.onSubtitleAdded((sub) => {
      if (!subtitlesById[sub.id]) {
        subtitlesById[sub.id] = sub
        subtitles.push(sub)

        setSubtitles([...subtitles])
        setSubtitlesById({ ...subtitlesById })
        addRegion(sub)
      }
    })
  }, [ws])

  return (
    <div className="relative flex size-full flex-col overflow-hidden">
      {typeof audioURL === 'string' ? (
        <div id="waveform" ref={containerRef} className="flex-1 overflow-hidden" />
      ) : (
        <div>error...</div>
      )}
    </div>
  )
}
