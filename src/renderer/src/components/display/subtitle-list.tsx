import { ScrollArea } from '../ui/scrollarea'
import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { activeRegionIdAtom } from '@/state/media-display-state'
import { clampPosition, cn, millisecondsToTimestamp } from '@/lib/utils'
import { durationAtom, panelsRefsAtom, wavesurferAtom } from '@/state/whisper-model-state'
import { WhisperResponse } from 'src/shared/shared'

export const SubtitleList = ({ subtitles }: { subtitles: WhisperResponse }) => {
  const activeRegionId = useAtomValue(activeRegionIdAtom)
  const duration = useAtomValue(durationAtom)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const refs = useAtomValue(panelsRefsAtom)
  const wavesurfer = useAtomValue(wavesurferAtom)

  useEffect(() => {
    if (!activeRegionId) return

    const activeElement = document.getElementById(activeRegionId)
    const scrollAreaElement = scrollAreaRef.current

    if (!activeElement || !scrollAreaElement) return

    activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [activeRegionId])

  useEffect(() => {
    if (!refs?.current) return
    if (!refs.current.bottomPanelElement) return

    let rafId: null | number
    const observer = new ResizeObserver(([entry]) => {
      rafId = requestAnimationFrame(() => {
        const containerHeight = refs.current?.groupElement?.getBoundingClientRect().height ?? 0
        const bottomPanelHeight = entry.contentRect.height
        if (scrollAreaRef.current) {
          // 256 height of video
          // 48 height of buttons
          scrollAreaRef.current.style.height = `${containerHeight - bottomPanelHeight - 256 - 48}px`
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
    <ScrollArea ref={scrollAreaRef} className="overflow-y-auto w-full">
      {subtitles?.map((subtitle) => {
        const start = clampPosition(duration, subtitle.from / 1000)
        const end = clampPosition(duration, subtitle.to / 1000)

        const id = `id-${start}-${end}`
        const active = id === activeRegionId

        return (
          <div id={id} key={id} className="">
            <div
              onClick={() => handleRowClicked(start)}
              className={cn(
                'group flex items-start space-x-4 px-2 p-3 hover:bg-gray-200 transition-colors rounded-md',
                active ? 'bg-teal-100 text-teal-700 hover:bg-teal-200' : undefined
              )}
            >
              <span className="flex-shrink-0 text-sm font-mono text-teal-700 group-hover:text-teal-900 pt-1">
                {millisecondsToTimestamp(subtitle.from)}
              </span>
              <p
                className={cn(
                  'flex-grow text-gray-800 group-hover:text-gray-900',
                  active && 'text-teal-700'
                )}
              >
                {subtitle.text}
              </p>
            </div>
          </div>
        )
      })}
    </ScrollArea>
  )
}
