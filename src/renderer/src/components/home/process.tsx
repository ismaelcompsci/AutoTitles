import { currentTaskAtom } from '@/state/whisper-model-state'
import { useAtomValue } from 'jotai'
import { Loader2 } from 'lucide-react'
import './p.css'
import { useEffect, useRef } from 'react'

const stepToInfoMap: Record<Step, string> = {
  AUDIO: 'Converting audio to correct format...',
  DONE: 'Finished',
  IDLE: 'Waiting for things...',
  TRANSCRIBING: 'Generating subtitles for you...'
}

export const Process = () => {
  const task = useAtomValue(currentTaskAtom)

  const { generateTranscription, task: workingTask, transcribing } = useTranscription()

  useEffect(() => {
    if (task) {
      generateTranscription(task)
    }
  }, [task])

  const taskNotDone = workingTask?.step !== 'DONE'
  if (transcribing || taskNotDone) {
    const stepInfo = workingTask?.step ? stepToInfoMap[workingTask?.step] : '...'
    return (
      <div className="flex w-full flex-col h-full justify-center items-center">
        <Loader2 className="animate-spin h-16 w-16" />

        {taskNotDone ? <div>{stepInfo}</div> : <span>Loading</span>}
      </div>
    )
  }

  if (workingTask && workingTask.step === 'DONE') {
    return <WhisperDisplayTask task={workingTask} />
  }

  return <div>PROCESS Done</div>
}

import Regions from 'wavesurfer.js/dist/plugins/regions'
import WaveSurfer from 'wavesurfer.js'
import { Step, useTranscription, WhisperTask } from '@/hooks/use-transcription'

type WhisperDisplayTaskProps = {
  task: WhisperTask
}

const WhisperDisplayTask = ({ task }: WhisperDisplayTaskProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const regionsRef = useRef<Regions | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const addTranscriptionRegions = (regions: Regions, captions: string[][]) => {
    console.log(captions)
    for (const cap of captions) {
      const [startS, endS, text] = cap

      const start = getSecondsFromTimestamp(startS)
      const end = getSecondsFromTimestamp(endS)
      console.log({ startS, endS, start, end })

      if (isNaN(start) || isNaN(end)) {
        continue
      }

      regions.addRegion({
        id: `id-${start}-${end}`,
        start: start,
        end: end,
        drag: false,
        resize: false,
        content: text
      })
    }
  }

  const createWavesurfer = (container: HTMLDivElement) => {
    const ws = WaveSurfer.create({
      container: container,
      url: `file://${task.media.converted_html5_audio_supported_path}`,
      waveColor: 'gray',
      progressColor: 'hsl(173 80% 36%)',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 180,
      barHeight: 0.8
    })

    return ws
  }

  const initWavesurfer = () => {
    if (!containerRef.current) return

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy()
    }

    const ws = createWavesurfer(containerRef.current)
    const regions = ws.registerPlugin(Regions.create())

    setupListeners(ws, regions)
    console.log(task.response)
    wavesurferRef.current = ws
    regionsRef.current = regions
  }

  const setupListeners = (wavesurfer: WaveSurfer, regions: Regions) => {
    wavesurfer.on('ready', () => {
      if (task.response && regionsRef.current) {
        addTranscriptionRegions(regionsRef.current, task.response)
      }

      if (videoRef.current) {
        wavesurfer.setMediaElement(videoRef.current)
      }
    })

    regions.on('region-clicked', (region) => {
      regions
        .getRegions()
        .filter((r) => r.id.startsWith('active'))
        .forEach((r) => {
          r.remove()
          regions.addRegion({
            ...r,
            id: `id-${region.start}-${region.end}`
          })
        })

      region.remove()
      regions.addRegion({
        ...region,
        id: `active id-${region.start}-${region.end}`
      })
    })
  }

  useEffect(() => {
    initWavesurfer()

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [])

  const getSecondsFromTimestamp = (stamp: string) => {
    const [hours, minutes, seconds] = stamp.split(':').map(Number)

    // Calculate the total seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    return totalSeconds
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div>
        <span>{task.step}</span>
      </div>
      <div className="h-full">
        <video
          src={`file://${task.media.original_input_path}`}
          className="rounded-md aspect-video"
          ref={videoRef}
          width="320"
          height="420"
          controls
        ></video>
      </div>

      <div className="max-w-full overflow-x-scroll h-full">
        <div className="" id="waveform" ref={containerRef} />
      </div>
    </div>
  )
}
