import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { cn, millisecondsToTimestamp } from '@/lib/utils'

import { captionsAtom } from '@/state/state'
import { activeRegionIdAtom } from '@/state/state'

export const CaptionList = () => {
  const captions = useAtomValue(captionsAtom)
  const activeRegionId = useAtomValue(activeRegionIdAtom)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const captionRefs = useRef({})

  useEffect(() => {
    if (!activeRegionId) return

    const element = captionRefs.current[activeRegionId]
    if (!element) return

    element.scrollIntoView({
      behavior: 'instant',
      block: 'nearest'
    })
  }, [activeRegionId])

  // const handleRowClicked = (start: number) => {}

  return (
    <div ref={scrollAreaRef} className="relative flex h-full overflow-hidden @container">
      <div className="flex flex-1 justify-center overflow-y-auto pb-10 pl-2 pr-1 pt-4 outline-none [scroll-padding-block:48px] [scrollbar-gutter:stable] [&::-webkit-scrollbar-thumb]:bg-gray-100/15 [&::-webkit-scrollbar]:w-[8px]">
        {captions.length > 0 ? (
          <div className="flex h-full w-full min-w-[380px] max-w-[800px] select-none flex-col gap-px outline-none after:pb-10">
            {captions?.map((caption, i) => {
              const start = caption.startMs
              const end = caption.endMs
              const id = `id-${start}-${end}`
              const active = id === activeRegionId

              return (
                <div
                  ref={(el) => {
                    if (el) captionRefs.current[id] = el
                  }}
                  // onClick={() => handleRowClicked(start)}
                  key={id}
                  id={id}
                  className={cn(
                    'p-4 rounded-lg transition-colors hover:bg-gray-200 relative',
                    active && 'bg-gray-100',
                    i !== captions.length ? 'mb-1' : undefined
                  )}
                >
                  <div className="text-sm text-muted-foreground">
                    {millisecondsToTimestamp(caption.startMs)}
                  </div>
                  <div className="text-sm">{caption.text}</div>

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
