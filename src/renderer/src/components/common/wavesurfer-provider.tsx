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
import {
  activeRegionIdAtom,
  audioURLAtom,
  currentTimeAtom,
  durationAtom,
  playingAtom
} from '../../state/state'
import RegionsPlugin, { Region } from 'wavesurfer.js/dist/plugins/regions'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom'
import { Caption } from 'src/shared/models'
import { store } from '@/state/store'

type WavesurferContext = {
  ws: WaveSurfer | null
  containerRef: RefObject<HTMLDivElement>
  videoRef: RefObject<HTMLVideoElement>
  regionsPlugin: RegionsPlugin
  addRegion: (caption: Caption) => void
  reloadMedia: () => void
  clearRegions: () => void
  selectRegion: (id: string) => void
}

const WavesurferContext = createContext<WavesurferContext | undefined>(undefined)

const regionColor = {
  default: 'rgb(214 214 215 / 0.08)',
  selected: 'hsla(213, 94%, 42%, 0.24)'
}

type Props = {
  children: React.ReactNode
}

export const WavesurferProvider = ({ children }: Props) => {
  const audioURL = useAtomValue(audioURLAtom)
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const zoomPlugin = useMemo(() => ZoomPlugin.create({ maxZoom: 400 }), [])
  const regionsPlugin = useMemo(() => RegionsPlugin.create(), [])

  const setDuration = useSetAtom(durationAtom)
  const setIsPlaying = useSetAtom(playingAtom)
  const setCurrentTime = useSetAtom(currentTimeAtom)
  const setActiveRegionId = useSetAtom(activeRegionIdAtom)
  const setAudioURL = useSetAtom(audioURLAtom)

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

  const handleLoading = useCallback(() => {}, [])

  const handleError = useCallback(() => {
    setAudioURL(null)
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

  const selectRegion = useCallback(
    (id: string) => {
      const regionsToSelect = regionsPlugin
        .getRegions()
        .filter((region) => region.id.startsWith(id))

      if (regionsToSelect.length > 0) {
        regionsToSelect.forEach((r) => r.setOptions({ color: regionColor.selected }))
      }
    },
    [regionsPlugin]
  )

  const handleRegionIn = useCallback(
    (region: Region) => {
      const activeRegionId = store.get(activeRegionIdAtom)
      if (activeRegionId) {
        const regionToReset = regionsPlugin
          .getRegions()
          .find((region) => region.id === activeRegionId)

        regionToReset?.setOptions({ color: regionColor.default })
      }

      setActiveRegionId(region.id)
    },
    [regionsPlugin]
  )

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
        plugins: [regionsPlugin, zoomPlugin]
      })

      setWavesurfer(ws)

      const subscriptions = [
        ws.on('decode', handleDecode),
        ws.on('play', handlePlay),
        ws.on('pause', handlePause),
        ws.on('timeupdate', handleTimeUpdate),
        ws.on('loading', handleLoading),
        ws.on('error', handleError),

        regionsPlugin.on('region-in', handleRegionIn)
        // regionsPlugin.on('region-clicked', handleRegionClicked),
        // regionsPlugin.on('region-double-clicked', handleRegionDoubleClicked)
      ]

      return () => {
        subscriptions.forEach((unsubscribe) => unsubscribe())
        ws.destroy()
      }
    }

    return
  }, [containerRef, videoRef, audioURL, regionsPlugin, zoomPlugin])

  useEffect(() => {
    if (!videoRef.current || !audioURL) {
      audioURL === undefined && wavesurfer?.empty()
      return
    }

    videoRef.current.src = audioURL
  }, [audioURL, videoRef])

  const addRegion = useCallback(
    (caption: Caption) => {
      regionsPlugin.addRegion({
        id: `id-${caption.startMs}-${caption.endMs}`,
        start: caption.startMs / 1000,
        end: caption.endMs / 1000,
        content: caption.text,
        color: regionColor.default,
        minLength: 0.2,
        drag: false,
        resize: false
      })
    },
    [regionsPlugin]
  )

  const clearRegions = useCallback(() => {
    regionsPlugin.clearRegions()
  }, [])

  return (
    <WavesurferContext.Provider
      value={{
        ws: wavesurfer,
        containerRef,
        videoRef,
        regionsPlugin,
        addRegion,
        reloadMedia,
        clearRegions,
        selectRegion
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
