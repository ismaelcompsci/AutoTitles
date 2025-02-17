import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Button } from '../ui/button'
import { Component, FileVolume, MoveRight, Plus } from 'lucide-react'
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
import { ModelCategory, ModelItem, WhisperInputConfig } from 'src/shared/models'
import { useWavesurfer } from '../common/wavesurfer-provider'
import { cn, getBasename, upperCaseFirstLetter } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { ScrollArea } from '../ui/scroll-area'

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

        <div className="flex flex-row mt-12 justify-end">
          <Button
            size={'md'}
            onClick={handleStartTranscription}
            className="max-w-42 self-end flex"
            loading={false}
            suffix={<MoveRight className="h-4 w-4" />}
          >
            Start Transcription
          </Button>
        </div>
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
  const [selectedModel, setSelectedModel] = useState<ModelItem | undefined>()

  const handleValueChange = async (key: string, value: any) => {
    await window.api.updateTranscribeOptions({ key, value })
  }

  const syncModelList = async (modelCategorys: ModelCategory[]) => {
    setModelList(modelCategorys)

    const flatModelList = modelCategorys.flatMap((cat) => cat.items)
    const found = flatModelList.find((item) => item.id === transcribeOptions.model)

    setSelectedModel(found)
  }

  useEffect(() => {
    window.api.getModelList().then(syncModelList)
  }, [transcribeOptions])

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

        <DropdownMenu modal>
          <DropdownMenuTrigger
            className={cn(
              'flex items-center gap-2 p-2 sm:px-3 h-8',
              'rounded-full transition-all duration-300',
              'border border-neutral-800',
              'hover:shadow-md'
            )}
          >
            {selectedModel ? (
              <>
                <Component className="w-3.5 h-3.5" />
                <span className="block text-xs font-medium overflow-hidden">
                  {selectedModel.label}
                </span>
              </>
            ) : (
              <span className="block text-xs font-medium overflow-hidden">Select Model</span>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="!font-sans rounded-lg bg-neutral-900 sm:ml-4 !mt-1.5 sm:m-auto !z-[52] shadow-lg border border-neutral-800"
            collisionPadding={12}
            side="left"
            align="start"
          >
            <ScrollArea className="h-96 w-[220px] p-1">
              {Object.entries(modelList).map(([category, categoryModel], categoryIndex) => {
                return (
                  <div key={category} className={cn(categoryIndex > 0 && 'mt-1')}>
                    <div className="px-2 py-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400 select-none">
                      {upperCaseFirstLetter(categoryModel.id)}
                    </div>

                    <div className="space-y-0.5">
                      {categoryModel.items.map((model) => {
                        const isSelected = model.id === selectedModel?.id

                        return (
                          <DropdownMenuItem
                            key={model.id}
                            id={model.id}
                            onSelect={() => {
                              setSelectedModel(model)
                              handleValueChange('model', model.id)
                            }}
                            ref={(item) => {
                              if (model.id === selectedModel?.id) {
                                item?.scrollIntoView({ block: 'center' })
                              }
                            }}
                            className={cn(
                              'flex items-center gap-2 px-2 py-1.5 rounded-md text-xs',
                              'transition-all duration-200',
                              'hover:shadow-sm',
                              isSelected ? 'bg-opacity-100 bg-[#505050] hover:!bg-[#404040]' : ''
                            )}
                            disabled={model.disabled}
                          >
                            <div
                              className={cn(
                                'p-1.5 rounded-md',
                                isSelected ? 'bg-white/10' : 'bg-white/5',
                                'group-hover:bg-white/10',
                                'transition-colors duration-200',
                                isSelected ? '' : ''
                              )}
                            >
                              <Component className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col gap-px min-w-0">
                              <div className="font-medium truncate">{model.label}</div>
                              <div className="text-[10px] max-w-[150px] opacity-80 truncate leading-tight">
                                {model.description}
                              </div>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>

                    {categoryIndex !== modelList.length - 1 && (
                      <div className="my-1 border-t border-neutral-200 dark:border-neutral-800" />
                    )}
                  </div>
                )
              })}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
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
