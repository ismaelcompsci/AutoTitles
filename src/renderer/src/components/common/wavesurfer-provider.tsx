import { useAtomValue, useSetAtom } from 'jotai'
import {
  createContext,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback
} from 'react'
import WaveSurfer from 'wavesurfer.js'
import { audioURLAtom, currentTimeAtom, durationAtom, playingAtom } from '../../state/state'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions'
import { Subtitle } from 'src/shared/models'
import { store } from '@/state/store'

type WavesurferContext = {
  ws: WaveSurfer | null
  containerRef: RefObject<HTMLDivElement>
  videoRef: RefObject<HTMLVideoElement>
  regionsPlugin: RegionsPlugin
  addRegion: (subtitle: Subtitle) => void
  reloadMedia: () => void
}

const WavesurferContext = createContext<WavesurferContext | undefined>(undefined)

const regionColor = {
  default: 'rgb(214 214 215 / 0.08)',
  selected: 'rgb(56 189 248 / 0.27)',
  bookmarked: 'rgb(251 191 36 / 0.26)'
}

type Props = {
  children: React.ReactNode
}

export const WavesurferProvider = ({ children }: Props) => {
  const audioURL = useAtomValue(audioURLAtom)
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const regionsPlugin = useMemo(() => RegionsPlugin.create(), [])

  const setDuration = useSetAtom(durationAtom)
  const setIsPlaying = useSetAtom(playingAtom)
  const setCurrentTime = useSetAtom(currentTimeAtom)

  const renderRegions = useCallback(() => {}, [])

  const handleDecode = useCallback((duration: number) => {
    wavesurfer?.stop()
    setIsPlaying(false)
    setDuration(duration)
    renderRegions()
  }, [])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const handleTimeUpdate = useCallback((currentTime: number) => {
    setCurrentTime(currentTime)
  }, [])

  const handleLoading = useCallback((progress: number) => {
    // Add your loading logic here
  }, [])

  const handleError = useCallback((error: Error) => {
    // Add your error handling logic here
    console.error('Wavesurfer error:', error)
  }, [])

  const reloadMedia = useCallback(() => {
    if (wavesurfer && containerRef.current) {
      console.log('%c[useWavesurfer] Reset containerRef and re-render', 'color:#59B8DE')
      wavesurfer.setOptions({ container: containerRef.current })
      if (videoRef.current && audioURL) {
        videoRef.current.src = audioURL
        wavesurfer.setMediaElement(videoRef.current)
      }
      wavesurfer.setTime(store.get(currentTimeAtom))
    }
  }, [containerRef, videoRef, wavesurfer])

  useEffect(() => {
    if (containerRef.current) {
      const ws = WaveSurfer.create({
        height: 'auto',
        barWidth: 2,
        cursorWidth: 1,
        waveColor: '#868689',
        progressColor: '#868689',
        cursorColor: 'var(--ds-gray-alpha-1000)',
        minPxPerSec: 50,
        autoCenter: false,
        autoScroll: true,
        container: containerRef.current,
        url: audioURL ?? undefined,
        media: videoRef.current ?? undefined,
        plugins: [regionsPlugin]
      })

      setWavesurfer(ws)

      const subscriptions = [
        ws.on('decode', handleDecode),
        ws.on('play', handlePlay),
        ws.on('pause', handlePause),
        ws.on('timeupdate', handleTimeUpdate),
        ws.on('loading', handleLoading),
        ws.on('error', handleError)
      ]

      return () => {
        subscriptions.forEach((unsubscribe) => unsubscribe())
        ws.destroy()
      }
    }

    return
  }, [containerRef, videoRef, audioURL, regionsPlugin])

  useEffect(() => {
    if (!videoRef.current || !audioURL) {
      audioURL === undefined && wavesurfer?.empty()
      return
    }

    videoRef.current.src = audioURL
  }, [audioURL, videoRef])

  const addRegion = useCallback(
    (segment: Subtitle) => {
      regionsPlugin.addRegion({
        id: String(segment.id),
        start: segment.start / 1000,
        end: segment.end / 1000,
        content: segment.text,
        color: regionColor.default,
        minLength: 0.2,
        drag: false,
        resize: false
      })
    },
    [regionsPlugin]
  )

  return (
    <WavesurferContext.Provider
      value={{
        ws: wavesurfer,
        containerRef,
        videoRef,
        regionsPlugin,
        addRegion,
        reloadMedia
      }}
    >
      {children}
    </WavesurferContext.Provider>
  )
}

export function useWavesurfer() {
  const context = useContext(WavesurferContext)
  if (!context) throw new Error('useWavesurfer must be used within a WavesurferProvider')
  return context
}
