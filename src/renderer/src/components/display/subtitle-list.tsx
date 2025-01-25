import { ScrollArea } from '../ui/scrollarea'
import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { activeRegionIdAtom } from '@/state/media-display-state'
import { clampPosition, cn, millisecondsToTimestamp, scrollItemToCenter } from '@/lib/utils'
import {
  currentTaskAtom,
  durationAtom,
  panelsRefsAtom,
  wavesurferAtom
} from '@/state/whisper-model-state'
import { WhisperResponse } from '../../../../shared/models'
import { selectAtom } from 'jotai/utils'

const mediaTypeAtom = selectAtom(currentTaskAtom, (task) => task?.media.type)

export const SubtitleList = ({ subtitles }: { subtitles: WhisperResponse }) => {
  const activeRegionId = useAtomValue(activeRegionIdAtom)
  const duration = useAtomValue(durationAtom)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const refs = useAtomValue(panelsRefsAtom)
  const wavesurfer = useAtomValue(wavesurferAtom)
  const mediaType = useAtomValue(mediaTypeAtom)

  useEffect(() => {
    if (!activeRegionId) return

    const activeElement = document.getElementById(activeRegionId) as HTMLElement | null | undefined

    const container = scrollAreaRef.current

    if (!activeElement) return
    if (!container) return

    scrollItemToCenter(activeElement, container)
  }, [activeRegionId])

  useEffect(() => {
    if (!refs?.current) return
    if (!refs.current.bottomPanelElement) return
    const defaultHeight = mediaType === 'video' ? 254 : 0

    // height does not change
    const subtitleControlsHeight =
      refs.current?.topPanelElement?.querySelector('#subtitle-controls')?.getBoundingClientRect()
        .height ?? 12

    const topVideoHeight =
      refs.current?.topPanelElement?.querySelector('#media-display-top')?.getBoundingClientRect()
        .height ?? defaultHeight

    let rafId: null | number
    const observer = new ResizeObserver(([entry]) => {
      rafId = requestAnimationFrame(() => {
        const containerHeight = refs.current?.groupElement?.getBoundingClientRect().height ?? 0
        const bottomPanelHeight = entry.contentRect.height

        if (scrollAreaRef.current) {
          // 20 padding top
          scrollAreaRef.current.style.height = `${containerHeight - bottomPanelHeight - topVideoHeight - subtitleControlsHeight}px`
        }
      })
    })

    observer.observe(refs.current.bottomPanelElement)
    return () => {
      observer.disconnect()

      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [refs])

  const handleRowClicked = (start: number) => {
    wavesurfer?.setTime(start + 0.01)
  }

  return (
    <div
      ref={scrollAreaRef}
      className="w-full overflow-auto justify-center items-center flex flex-1"
    >
      <ScrollArea className="max-w-3xl w-full h-full">
        {subtitles?.map((subtitle, i) => {
          const start = clampPosition(duration, subtitle.from / 1000)
          const end = clampPosition(duration, subtitle.to / 1000)

          const id = `id-${start}-${end}`
          const active = id === activeRegionId

          return (
            <div
              onClick={() => handleRowClicked(start)}
              key={id}
              id={id}
              className={cn(
                'mx-2 p-4 rounded-lg transition-colors hover:bg-gray-200 relative',
                active && 'bg-gray-100',
                i !== subtitles.length ? 'mb-1' : undefined
              )}
            >
              <div className="text-sm text-muted-foreground">
                {millisecondsToTimestamp(subtitle.from)}
              </div>
              <div className="text-sm">{subtitle.text}</div>

              <div
                className={cn(
                  'h-1 w-1 bg-[#50e3c2] absolute rounded-full right-2 top-1/2 -translate-y-1/2',
                  active ? 'block' : 'hidden'
                )}
              />
            </div>
          )
        })}
      </ScrollArea>
    </div>
  )
}
