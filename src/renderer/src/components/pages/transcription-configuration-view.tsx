import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  downloadedModelsAtom,
  showDownloadModalDialogAtom,
  pageAtom,
  transcribeJobListAtom,
  transcribeOptionsAtom
} from '@/state/state'
import { Page } from '../ui/page'
import { useEffect } from 'react'

export const TranscriptionConfigurationView = () => {
  const setShowDownloadModalDialog = useSetAtom(showDownloadModalDialogAtom)
  const downloadedModels = useAtomValue(downloadedModelsAtom)
  const setPage = useSetAtom(pageAtom)
  const setAudioURL = useSetAtom(audioURLAtom)

  const [transcribeOptions, setTranscribeOptions] = useAtom(transcribeOptionsAtom)
  const transcribeJobList = useAtomValue(transcribeJobListAtom)

  const job = transcribeJobList[0]

  const handleStartTranscription = async () => {
    try {
      await window.api.queuePendingJobs()

      setAudioURL(job.filePath)
      setPage('transcript')
    } catch (e) {
      console.log(e)
    }
  }

  const handleValueChange = async (key: string, value: any) => {
    await window.api.updateTranscribeOptions({ key, value })
  }

  const getTranscribeOptions = async () => {
    const options = await window.api.getTranscribeOptions()
    setTranscribeOptions(options)
  }

  const getPathForModel = (model: string) => {
    return downloadedModels.filter((m) => m.name === model)[0].path
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
          <ConfigSection title="General">
            <ConfigItem label="Model" divider>
              <div className="grow" />
              <Select
                defaultValue={transcribeOptions?.model}
                disabled={downloadedModels.length === 0}
                onValueChange={(value) => handleValueChange('model', getPathForModel(value))}
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
                value={transcribeOptions.maxLen}
                onChange={(value) => handleValueChange('maxLen', value)}
              />
            </ConfigItem>
          </ConfigSection>

          <ConfigSection title="Info">
            <ConfigItem label="" className="text-sm text-muted-foreground">
              <div className="flex flex-row grow gap-4 items-center">
                <FileVolume className="h-4 w-4" />
                <span className="line-clamp-1 pr-4 text-balance">{job?.fileName}</span>
              </div>

              <div className="grow" />
              {/* {videoTime ? (
              <div className="font-gesit-mono">{videoTime}</div>
            ) : (
              <Loader2 className="h-2 w-2 animate-spin" />
            )} */}
            </ConfigItem>
          </ConfigSection>
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
