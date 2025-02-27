import { Player } from '@remotion/player'
import { CaptionedVideo } from '@/remotion/video/CaptionedVideo'
import { useEffect, useState } from 'react'
import { audioURLAtom, jobIsRunningAtom } from '@/state/state'
import { useAtom, useAtomValue } from 'jotai'
import { VideoMetadata } from 'src/shared/models'
import { captionsAtom } from '@/state/state'
import { Page } from '@/components/ui/page'

export const VideoPage = () => {
  const videoURL = useAtomValue(audioURLAtom)
  const [loading, setLoading] = useState(true)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [captions, setCaptions] = useAtom(captionsAtom)
  const jobIsRunning = useAtomValue(jobIsRunningAtom)

  useEffect(() => {
    if (!videoURL) return
    ;(async () => {
      const videoMetadata = await window.api.parseMedia(videoURL)
      console.log(videoMetadata)
      setVideoMetadata(videoMetadata)
      setLoading(false)
    })()
  }, [videoURL])

  useEffect(() => {
    const subs = [
      window.api.onCaptionAdded((caption) => {
        captions.push(caption)
        setCaptions([...captions])
      })
    ]

    return () => {
      subs.forEach((s) => s())
    }
  }, [])

  if (!videoURL) {
    return <div>No video selected</div>
  }

  if (loading) {
    return <div>Loading video metadata...</div>
  }

  if (jobIsRunning) {
    return <div>Processing captions...</div>
  }

  if (!videoMetadata) {
    return <div>Video metadata not found</div>
  }

  return (
    <Page.Root>
      <Page.Header>Video Player</Page.Header>
      <Page.Body className="flex flex-row w-full justify-between p-4">
        <div>settings</div>
        <Player
          component={CaptionedVideo}
          controls
          inputProps={{
            src: videoURL,
            captions: captions
          }}
          durationInFrames={Math.round(videoMetadata.duration * videoMetadata.fps)}
          fps={videoMetadata.fps}
          compositionWidth={videoMetadata.width}
          compositionHeight={videoMetadata.height}
          style={{ height: '500px' }}
        />
      </Page.Body>
    </Page.Root>
  )
}
