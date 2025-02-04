import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { clampPosition, cn, millisecondsToTimestamp, scrollItemToCenter } from '@/lib/utils'
import { useWavesurfer } from '../common/wavesurfer-provider'
import { subtitlesAtom } from '@/state/state'
import { durationAtom } from '@/state/state'
import { activeRegionIdAtom } from '@/state/state'

export const SubtitleList = () => {
  const subtitles = useAtomValue(subtitlesAtom)
  const activeRegionId = useAtomValue(activeRegionIdAtom)
  const duration = useAtomValue(durationAtom)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { ws } = useWavesurfer()

  useEffect(() => {
    if (!activeRegionId) return

    const activeElement = document.getElementById(activeRegionId) as HTMLElement | null | undefined

    const container = scrollAreaRef.current

    if (!activeElement) return
    if (!container) return

    scrollItemToCenter(activeElement, container)
  }, [activeRegionId])

  const handleRowClicked = (start: number) => {
    ws?.setTime(start + 0.01)
  }

  return (
    <div ref={scrollAreaRef} className="relative flex h-full overflow-hidden @container">
      <div className="flex flex-1 justify-center overflow-y-auto pb-10 pl-2 pr-1 pt-4 outline-none [scroll-padding-block:48px] [scrollbar-gutter:stable] [&::-webkit-scrollbar-thumb]:bg-gray-100/15 [&::-webkit-scrollbar]:w-[8px]">
        {subtitles.length > 0 ? (
          <div className="flex h-full w-full min-w-[380px] max-w-[800px] select-none flex-col gap-px outline-none after:pb-10">
            {subtitles?.map((subtitle, i) => {
              const start = clampPosition(duration, subtitle.start / 1000)
              const end = clampPosition(duration, subtitle.end / 1000)

              const id = `id-${start}-${end}`
              const active = id === activeRegionId

              return (
                <div
                  onClick={() => handleRowClicked(start)}
                  key={id}
                  id={id}
                  className={cn(
                    'p-4 rounded-lg transition-colors hover:bg-gray-200 relative',
                    active && 'bg-gray-100',
                    i !== subtitles.length ? 'mb-1' : undefined
                  )}
                >
                  <div className="text-sm text-muted-foreground">
                    {millisecondsToTimestamp(subtitle.start)}
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
          </div>
        ) : (
          <div className="size-full flex justify-center items-center">
            <p className="text-muted-foreground text-xs">...</p>
          </div>
        )}
      </div>
    </div>
  )
}
