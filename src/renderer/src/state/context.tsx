import { WhisperTask, WhisperTaskMedia } from '@/hooks/use-transcription'
import { createContext, RefObject, useEffect, useMemo, useState } from 'react'
import Regions from 'wavesurfer.js/dist/plugins/regions'
import WaveSurfer from 'wavesurfer.js'
import { toast } from 'sonner'
import { WhisperResponse } from 'src/shared/shared'
import { clampPosition } from '@/lib/utils'

type MediaContextType = {
  media: WhisperTaskMedia | null
  setMediaProvider: (element: HTMLMediaElement) => void
  wavesurfer: WaveSurfer | null
  setWaveformContainerRef: (ref: RefObject<HTMLDivElement>) => void
  decoded: boolean
  regions: Regions | null
  task: WhisperTask
  /**
   * duration in seconds
   */
  duration: number
  subtitles?: WhisperResponse
}

export const MediaShadowProviderContext = createContext<MediaContextType>({} as MediaContextType)

type Props = {
  children: React.ReactNode
  task: WhisperTask
}

export const MediaProvider = ({ children, task }: Props) => {
  const [waveformContainerRef, setWaveformContainerRef] =
    useState<RefObject<HTMLDivElement> | null>(null)
  const [mediaProvider, setMediaProvider] = useState<HTMLMediaElement | null>(null)
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [regions, setRegions] = useState<Regions | null>(null)
  const [decoded, setDecoded] = useState(false)

  const subtitles = useMemo(() => {
    return task.response
  }, [task.response])

  const duration = useMemo(() => {
    const duration = wavesurfer?.getDuration() ?? 0
    return duration
  }, [task, wavesurfer, decoded])

  const media = useMemo(() => {
    return task.media
  }, [task.media])

  const addTranscriptionRegions = (regions: Regions, captions: WhisperResponse) => {
    for (const cap of captions) {
      const { from, to, text } = cap

      const start = clampPosition(duration, from / 1000)
      const end = clampPosition(duration, to / 1000)

      const d = regions.addRegion({
        id: `id-${from}-${end}`,
        start: start,
        end: end,
        drag: false,
        resize: false,
        content: text
      })

      // d._setTotalDuration(duration)
    }
  }

  const initializeWavesurfer = async () => {
    if (!media) return
    if (!mediaProvider) return
    if (!waveformContainerRef?.current) return

    const ws = WaveSurfer.create({
      container: waveformContainerRef.current,
      height: 180,
      waveColor: 'gray',
      progressColor: 'white',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      autoScroll: true,
      media: mediaProvider,
      minPxPerSec: 150,
      hideScrollbar: true,
      cursorColor: 'hsl(173 80% 36%)',
      duration: task.media.duration,
      backend: 'MediaElement'
    })

    const fileURL = `file://${media.original_input_path}`
    const blob = await fetch(fileURL).then((res) => res.blob())

    ws.loadBlob(blob)

    setWavesurfer(ws)
  }

  useEffect(() => {
    if (decoded && task?.step === 'DONE' && task.response && !!regions && duration !== 0) {
      addTranscriptionRegions(regions, task.response)
    }
  }, [decoded, task, regions, duration])

  /*
   * Initialize wavesurfer when container ref is available
   * and mediaProvider is available
   */
  useEffect(() => {
    initializeWavesurfer()

    return () => {
      if (wavesurfer) wavesurfer.destroy()
      setDecoded(false)
    }
  }, [media, waveformContainerRef?.current, mediaProvider])

  /*
   * When wavesurfer is decoded,
   * set up event listeners for wavesurfer
   * and clean up when component is unmounted
   */
  useEffect(() => {
    if (!wavesurfer) return

    setRegions(wavesurfer.registerPlugin(Regions.create()))

    const subscriptions = [
      wavesurfer.on('ready', () => {
        setDecoded(true)
      }),
      wavesurfer.on('error', (err: Error) => {
        toast.error(err?.message || 'Error occurred while decoding audio')
        // Reload page when error occurred after decoding
        if (decoded) {
          window.location.reload()
        }
      })
    ]

    return () => {
      subscriptions.forEach((unsub) => unsub())
      wavesurfer?.destroy()
    }
  }, [wavesurfer])

  return (
    <MediaShadowProviderContext.Provider
      value={{
        media,
        setMediaProvider,
        wavesurfer,
        setWaveformContainerRef,
        decoded,
        regions,
        task,
        duration,
        subtitles
      }}
    >
      {children}
    </MediaShadowProviderContext.Provider>
  )
}
