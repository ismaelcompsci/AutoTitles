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

  const scrollToActive = (id: string) => {
    const activeElement = document.getElementById(id)
    if (!activeElement) return
    activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }

  useEffect(() => {
    if (!activeRegionId) return

    setTimeout(() => {
      scrollToActive(activeRegionId)
    }, 1)
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
          // 43 height of buttons
          scrollAreaRef.current.style.height = `${containerHeight - bottomPanelHeight - 258 - 43}px`
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
    <ScrollArea ref={scrollAreaRef} className="w-full min-h-24">
      <div className="absolute h-full w-full pointer-events-none bg-gradient-to-t from-background-200 via-transparent to-transparent from-1% via-1% to-5%" />
      <div className="absolute h-full w-full pointer-events-none bg-gradient-to-b from-background-200 via-transparent to-transparent from-1% via-1% to-5%" />

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
              'p-4 rounded-lg transition-colors hover:bg-gray-200',
              active && 'bg-gray-100',
              i !== subtitles.length ? 'mb-1' : undefined
            )}
          >
            <div className="text-sm text-muted-foreground">
              {millisecondsToTimestamp(subtitle.from)}
            </div>
            <div className="text-sm">{subtitle.text}</div>
          </div>
        )
      })}
    </ScrollArea>
  )
}
