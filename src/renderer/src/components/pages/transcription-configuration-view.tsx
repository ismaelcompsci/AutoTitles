import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '../ui/button'
import { FileVolume, MoveRight } from 'lucide-react'
import NumberInput from '../common/number-input'
import { ConfigSection } from '../common/config-section'
import { ConfigItem } from '../common/config-item'
import {
  audioURLAtom,
  durationAtom,
  pageAtom,
  subtitlesAtom,
  subtitlesByIdAtom,
  transcribeJobListAtom,
  transcribeOptionsAtom
} from '@/state/state'
import { Page } from '../ui/page'
import { useEffect, useState } from 'react'
import { ModelCategory, WhisperInputConfig } from 'src/shared/models'
import { useWavesurfer } from '../common/wavesurfer-provider'
import { getBasename } from '@/lib/utils'

export const TranscriptionConfigurationView = () => {
  const setPage = useSetAtom(pageAtom)
  const setAudioURL = useSetAtom(audioURLAtom)
  const setSubtitles = useSetAtom(subtitlesAtom)
  const setSubtitlesById = useSetAtom(subtitlesByIdAtom)
  const setDuration = useSetAtom(durationAtom)
  const [transcribeOptions, setTranscribeOptions] = useAtom(transcribeOptionsAtom)
  const transcribeJobList = useAtomValue(transcribeJobListAtom)
  const { clearRegions } = useWavesurfer()

  const handleStartTranscription = async () => {
    try {
      await window.api.queuePendingJobs()

      const job = transcribeJobList[0]

      setAudioURL(job.originalMediaFilePath)
      setSubtitles([])
      setSubtitlesById({})
      clearRegions()
      setDuration(0)
      setPage('transcript')
    } catch (e) {
      console.log(e)
    }
  }

  const getTranscribeOptions = async () => {
    const options = await window.api.getTranscribeOptions()
    const models = (await window.api.getModelList()).flatMap((group) => {
      if (group.id === 'downloaded') {
        return group.items
      }
      return []
    })

    const initialModelExisits =
      options.model !== '' && options.model !== null && options.model !== undefined

    if (!initialModelExisits) {
      const model = models[0]
      await window.api.updateTranscribeOptions({ key: 'model', value: model?.id ?? '' })
    }

    setTranscribeOptions({ ...options })
  }

  useEffect(() => {
    getTranscribeOptions()
  }, [])

  return (
    <Page.Root>
      <Page.Header>
        <span>Transcript Configuration</span>

        <div className="flex-1" />
        <Button
          className="px-2 drag-none"
          variant={'secondary'}
          size={'tiny'}
          suffix={<MoveRight className="h-4 w-4" />}
          onClick={handleStartTranscription}
        >
          Start
        </Button>
      </Page.Header>
      <Page.Body className="flex flex-col">
        <div className="h-8" />

        <div className="flex flex-col gap-12">
          {transcribeOptions && (
            <TranscriptConfigurationForm transcribeOptions={transcribeOptions} />
          )}
          {transcribeJobList.length !== 0 && (
            <ConfigSection title="Info">
              {transcribeJobList.map((job) => (
                <ConfigItem key={job.id} label="" className="text-sm text-muted-foreground">
                  <div className="flex flex-row grow gap-4 items-center">
                    <FileVolume className="h-4 w-4" />
                    <span className="line-clamp-1 pr-4 text-balance">
                      {getBasename(job.originalMediaFilePath)}
                    </span>
                  </div>

                  <div className="grow" />
                </ConfigItem>
              ))}
            </ConfigSection>
          )}
        </div>

        <Button
          size={'lg'}
          onClick={handleStartTranscription}
          className="mt-12 max-w-42 self-end flex"
          loading={false}
          suffix={<MoveRight className="h-4 w-4" />}
        >
          Start Transcription
        </Button>
      </Page.Body>
    </Page.Root>
  )
}

export const TranscriptConfigurationForm = ({
  transcribeOptions
}: {
  transcribeOptions: WhisperInputConfig
}) => {
  const setPage = useSetAtom(pageAtom)
  const [modelList, setModelList] = useState<ModelCategory[]>([])

  const handleValueChange = async (key: string, value: any) => {
    await window.api.updateTranscribeOptions({ key, value })
  }

  useEffect(() => {
    window.api.getModelList().then(setModelList)
  }, [])

  return (
    <ConfigSection title="General">
      <ConfigItem label="Model" divider className="flex flex-1">
        <Button
          size={'tiny'}
          className="ml-2"
          onClick={() => {
            setPage('model-manager')
          }}
        >
          Download models...
        </Button>

        <div className="grow" />
        <Select
          key={transcribeOptions.model}
          defaultValue={transcribeOptions.model}
          onValueChange={(value) => handleValueChange('model', value)}
        >
          <SelectTrigger className="border-none gap-1 w-fit">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {modelList.map((group, i) => {
              if (group.id === 'downloaded') {
                return null
              }

              return (
                <div key={group.id}>
                  <SelectGroup>
                    <SelectLabel className="text-muted-foreground">{group.id}</SelectLabel>
                    {group.items.map((item) => {
                      return (
                        <SelectItem
                          disabled={item.disabled}
                          key={`${item.id}-${i}`}
                          value={item.id}
                        >
                          {item.label}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>

                  {i !== modelList.length - 1 && <SelectSeparator />}
                </div>
              )
            })}
          </SelectContent>
        </Select>
      </ConfigItem>

      <ConfigItem label="Limit Characters per Segments/Line">
        <div className="grow" />
        <NumberInput
          value={transcribeOptions.maxLen}
          onChange={(value) => handleValueChange('maxLen', value)}
        />
      </ConfigItem>
    </ConfigSection>
  )
}
