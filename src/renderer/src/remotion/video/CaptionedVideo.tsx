import { useMemo } from 'react'
import { AbsoluteFill, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'
import { Caption } from 'src/shared/models'
import { createTikTokStyleCaptions, TikTokPage } from '@remotion/captions'
import { cn } from '../../lib/utils'

// How many captions should be displayed at a time?
// Try out:
// - 1500 to display a lot of words at a time
// - 200 to only display 1 word at a time
const SWITCH_CAPTIONS_EVERY_MS = 1200

export const CaptionedVideo = ({ src, captions }: { src: string; captions: Caption[] }) => {
  const { fps } = useVideoConfig()

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: captions
    })
  }, [captions])

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <AbsoluteFill>
        <OffthreadVideo
          style={{
            objectFit: 'cover'
          }}
          src={src}
        />
      </AbsoluteFill>
      <AbsoluteFill className="flex flex-col">
        {pages.map((page, index) => {
          const nextPage = pages[index + 1] ?? null
          const subtitleStartFrame = (page.startMs / 1000) * fps
          const subtitleEndFrame = Math.min(
            nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
            subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS
          )
          const durationInFrames = subtitleEndFrame - subtitleStartFrame

          if (durationInFrames <= 0) {
            return null
          }

          return (
            <Sequence key={index} from={subtitleStartFrame} durationInFrames={durationInFrames}>
              <Chunk page={page} />
            </Sequence>
          )
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

export const Chunk = ({ page }: { page: TikTokPage }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const timeInMs = (frame / fps) * 1000

  return (
    <AbsoluteFill className="absolute top-0 z-20 flex h-full w-full items-center justify-center">
      <AbsoluteFill>
        <div
          className="absolute text-center w-[84%] ml-[8%]"
          style={{
            top: '68%',
            textTransform: 'uppercase',
            whiteSpace: 'break-spaces',
            WebkitTextStroke: '12px black',
            paintOrder: 'stroke',
            fontWeight: 900,
            color: 'rgb(255, 255, 255)',
            fontSize: 64
          }}
        >
          {page.tokens.map((token, index) => {
            const startRelativeToSequence = token.fromMs - page.startMs
            const endRelativeToSequence = token.toMs - page.startMs

            const active = startRelativeToSequence <= timeInMs && endRelativeToSequence > timeInMs

            return (
              <span
                key={index}
                style={{
                  top: '0px',
                  transform: 'scale(1)',
                  opacity: 1
                }}
              >
                <span
                  className={cn('relative inline-flex', active && 'text-red-500')}
                  style={{
                    top: '0px',
                    transform: 'scale(1)',
                    opacity: 1
                  }}
                >
                  {token.text}
                </span>
              </span>
            )
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
