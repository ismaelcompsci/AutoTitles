import { DisplayTop } from './display-top'
import { DisplayBottom } from './display-bottom'
import { toast } from 'sonner'
import { useEffect, useMemo, useRef } from 'react'
import { clampPosition } from '@/lib/utils'
import {
  waveformContainerRefAtom,
  mediaProviderAtom,
  wavesurferAtom,
  regionsAtom,
  decodedAtom,
  durationAtom,
  currentTaskAtom,
  panelsRefsAtom,
  ResizeablePanelRef
} from '@/state/whisper-model-state'
import { useAtomValue, useAtom, useSetAtom } from 'jotai'

import WaveSurfer from 'wavesurfer.js'
import Regions from 'wavesurfer.js/dist/plugins/regions'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizeable'
import { getPanelGroupElement, getResizeHandleElement } from 'react-resizable-panels'
import { getPanelElement } from 'react-resizable-panels'
import { WhisperResponse } from 'src/shared/models'

export const WhisperSubtitleDisplay = () => {
  const setPanelsRef = useSetAtom(panelsRefsAtom)
  const task = useAtomValue(currentTaskAtom)
  const waveformContainerRef = useAtomValue(waveformContainerRefAtom)
  const mediaProvider = useAtomValue(mediaProviderAtom)
  const [wavesurfer, setWavesurfer] = useAtom(wavesurferAtom)
  const [regions, setRegions] = useAtom(regionsAtom)
  const [decoded, setDecoded] = useAtom(decodedAtom)
  const [duration, setDuration] = useAtom(durationAtom)

  const media = useMemo(() => {
    return task?.media
  }, [task?.media])

  const addTranscriptionRegions = (regions: Regions, captions: WhisperResponse) => {
    console.log('[addTranscriptionRegions] setting regions...')

    const hasRegions = regions.getRegions().length > 0
    if (hasRegions) return
    for (const cap of captions) {
      const { from, to, text } = cap

      const start = clampPosition(duration, from / 1000)
      const end = clampPosition(duration, to / 1000)

      regions.addRegion({
        id: `id-${from}-${end}`,
        start: start,
        end: end,
        drag: false,
        resize: false,
        content: text
      })
    }
  }

  const initializeWavesurfer = async () => {
    if (!media) return
    if (!mediaProvider) return
    if (!waveformContainerRef?.current) return
    // if (decoded) return
    // if (regions) return
    // if (!media.original_input_path) return

    console.log('[initializeWavesurfer] initing wavesurfer...')

    const container = waveformContainerRef.current.querySelector(
      '.waveform-container'
    ) as HTMLElement | null
    if (!container) return

    const ws = WaveSurfer.create({
      container: container,
      waveColor: 'gray',
      progressColor: 'white',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      autoScroll: true,
      media: mediaProvider,
      minPxPerSec: 100,
      hideScrollbar: true,
      fillParent: true,
      // height: height,
      // width: width,
      cursorColor: 'hsl(173 80% 36%)',
      duration: task?.media.duration,
      backend: task?.media.type === 'video' ? 'MediaElement' : 'WebAudio'
    })

    ws.registerPlugin(
      ZoomPlugin.create({
        // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
        scale: 0.5,
        // Optionally, specify the maximum pixels-per-second factor while zooming
        maxZoom: 100
      })
    )

    // TODO CHANGE THIS TO SUPPORTED
    const fileURL = `file://${media.original_input_path}`
    const blob = await fetch(fileURL).then((res) => res.blob())

    ws.loadBlob(blob)

    console.log('[initializeWavesurfer] setting wavesurfer')
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
  }, [waveformContainerRef?.current, mediaProvider])

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
        setDuration(wavesurfer?.getDuration() ?? 0)
      }),
      wavesurfer.on('error', (err: Error) => {
        toast.error(err?.message || 'Error occurred while decoding audio')
      })
    ]

    return () => {
      subscriptions.forEach((unsub) => unsub())
      wavesurfer?.destroy()
    }
  }, [wavesurfer])

  const refs = useRef<ResizeablePanelRef | null>(null)

  useEffect(() => {
    const groupElement = getPanelGroupElement('group')
    const bottomPanelElement = getPanelElement('bottom-panel')
    const topPanelElement = getPanelElement('top-panel')
    const resizeHandleElement = getResizeHandleElement('resize-handle')
    // If you want to, you can store them in a ref to pass around
    refs.current = {
      groupElement,
      bottomPanelElement,
      topPanelElement,
      resizeHandleElement
    }
    setPanelsRef(refs)
  }, [])

  return (
    <ResizablePanelGroup id="group" direction="vertical">
      <ResizablePanel id="top-panel" defaultSize={70} minSize={20}>
        <DisplayTop />
      </ResizablePanel>

      <ResizableHandle id="resize-handle" withHandle />
      <ResizablePanel id="bottom-panel" defaultSize={30} minSize={20} maxSize={70}>
        <DisplayBottom />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
