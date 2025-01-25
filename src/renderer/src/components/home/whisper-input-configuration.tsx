import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  currentTaskAtom,
  downloadedModelsAtom,
  showDownloadModalDialogAtom,
  whisperUserConfigurationAtom
} from '@/state/whisper-model-state'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import { FileVolume, Loader2 } from 'lucide-react'
import { WhisperModel } from '@/util/models'
import NumberInput from '../common/number-input'
import { stepAtom } from '@/state/main-state'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { WhisperTask } from '@/hooks/use-transcription'
import { WhisperTaskMedia } from '@/hooks/use-transcription'
import { getMediaType, MediaType } from '@/lib/utils'
import { ConfigSection } from '../common/config-section'
import { ConfigItem } from '../common/config-item'

interface Props {
  file: File | null
}

type ProbeState = {
  loading: boolean
  data: { duration: number; type: MediaType } | undefined
}

export const WhisperInputConfiguration = ({ file }: Props) => {
  const setShowDownloadModalDialog = useSetAtom(showDownloadModalDialogAtom)
  const downloadedModels = useAtomValue(downloadedModelsAtom)
  const setCurrentTask = useSetAtom(currentTaskAtom)
  const [mediaData, setMediaData] = useState<ProbeState>({ loading: false, data: undefined })
  const setStep = useSetAtom(stepAtom)

  const [config, setConfig] = useAtom(whisperUserConfigurationAtom)

  useEffect(() => {
    const a = async () => {
      if (!file?.path) {
        return
      }

      const duration = await loadVideo(file)

      setMediaData({
        loading: false,
        data: {
          duration: duration,
          type: getMediaType(file.type)
        }
      })
    }

    a()
  }, [file?.path])

  const handleStartTranscription = async () => {
    if (!config.model) {
      toast.error('Select a Model')
      return
    }

    if (!file?.path) {
      return
    }

    const modelPath = downloadedModels.find((model) => model.name === config.model)?.path

    if (!modelPath || mediaData.loading) {
      return
    }

    const taskId = uuidv4()
    const downloadsFolder = await window.api.getDownloadsFolder()
    const type = getMediaType(file.type)

    if (type === 'unsupported') {
      toast.error('Unsupported file.')
      return
    }

    const media: WhisperTaskMedia = {
      original_input_path: file.path,
      folder: path.join(downloadsFolder, taskId),
      duration: mediaData.data?.duration ?? 0,
      type: type
    }

    const task: WhisperTask = {
      model: modelPath,
      maxLen: config.maxLen,
      lang: config.lang,
      media: media,
      id: taskId,
      step: 'IDLE'
    }

    setCurrentTask(task)
    setStep('TRANSCRIBE')
  }

  const formatSecondsToTimeStamp = (seconds: number) => {
    seconds = Math.floor(seconds) // Remove decimals
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  const videoTime = mediaData.data?.duration
    ? formatSecondsToTimeStamp(mediaData.data?.duration)
    : undefined

  const handleSelectModelChange = (value: WhisperModel) => {
    setConfig((p) => ({ ...p, model: value }))
  }

  const handleMaxCharPerSegmentInputChange = (value: number) => {
    setConfig((p) => ({ ...p, maxLen: value }))
  }

  return (
    <div className="flex flex-col max-w-2xl w-full px-6">
      <span className="text-xl font-semibold">Whisper Configuration</span>
      <div className="h-8" />

      <div className="flex flex-col gap-12">
        <ConfigSection title="General">
          <ConfigItem label="Model" divider>
            <div className="grow" />
            <Select
              disabled={downloadedModels.length === 0}
              value={config?.model}
              onValueChange={handleSelectModelChange}
            >
              <SelectTrigger className="w-full border-none gap-1 max-w-[140px]">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectGroup>
                  <SelectLabel className="text-[10px] text-muted-foreground">
                    Installed Models
                  </SelectLabel>
                  {downloadedModels.map((model) => {
                    return (
                      <SelectItem key={`${model.name}`} value={model.name}>
                        {model.name}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button
              size={'tiny'}
              variant={'secondary'}
              className="text-[10px] text-muted-foreground"
              onClick={() => setShowDownloadModalDialog(true)}
            >
              Download models...
            </Button>
          </ConfigItem>

          <ConfigItem label="Limit Characters per Segments/Line">
            <div className="grow" />
            <NumberInput
              value={Number(config.maxLen)}
              onChange={handleMaxCharPerSegmentInputChange}
            />
          </ConfigItem>
        </ConfigSection>

        <ConfigSection title="Info">
          <ConfigItem label="" className="text-sm text-muted-foreground">
            <div className="flex flex-row grow gap-4 items-center">
              <FileVolume className="h-4 w-4" />
              <span className="line-clamp-1 pr-4 text-balance">{file?.name}</span>
            </div>

            <div className="grow" />
            {videoTime ? (
              <div className="font-gesit-mono">{videoTime}</div>
            ) : (
              <Loader2 className="h-2 w-2 animate-spin" />
            )}
          </ConfigItem>
        </ConfigSection>
      </div>

      <Button onClick={handleStartTranscription} className="mt-12" loading={mediaData.loading}>
        transcribe
      </Button>
    </div>
  )
}

const loadVideo = (file: File): Promise<number> =>
  new Promise((resolve, reject) => {
    try {
      let video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = function () {
        resolve(video.duration)
      }

      video.onerror = function () {
        reject('Invalid video. Please select a video file.')
      }

      video.src = window.URL.createObjectURL(file)
    } catch (e) {
      reject(e)
    }
  })
