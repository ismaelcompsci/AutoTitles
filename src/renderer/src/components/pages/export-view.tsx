import { useEffect, useState } from 'react'
import { Page } from '../ui/page'
import { useAtom, useSetAtom } from 'jotai'
import {
  audioURLAtom,
  exportJobListAtom,
  pageAtom,
  captionsAtom,
  captionsByIdAtom
} from '@/state/state'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { ConfigSection } from '../common/config-section'
import { ConfigItem } from '../common/config-item'
import { ExportConfig } from 'src/shared/models'
import { getBasename } from '@/lib/utils'
import { toast } from 'sonner'

const ExportOptions = [
  {
    label: '.SRT',
    value: 'srt'
  }
]

export const ExportView = () => {
  const [exportJobList, setExportJobList] = useAtom(exportJobListAtom)
  const [exportOptions, setExportOptions] = useState<ExportConfig>()
  const [audioURL, setAudioUrl] = useAtom(audioURLAtom)
  const setCaptions = useSetAtom(captionsAtom)
  const setCaptionsById = useSetAtom(captionsByIdAtom)
  const setPage = useSetAtom(pageAtom)

  const handleStartOver = () => {
    setPage('home')
  }

  const handleExport = async () => {
    if (exportJobList.length) {
      await window.api.queuePendingJobs('Export')
    }

    setExportJobList([])
    setAudioUrl(null)
    setCaptions([])
    setCaptionsById({})
  }

  const getExportJobList = async () => {
    const exportJobList = await window.api.getJobList({ type: 'Export' })
    if (exportJobList.length) {
      setExportJobList(exportJobList)
    }
  }

  const handleFolderSelect = async () => {
    const folder = await window.api.showOpenDialog({
      properties: ['createDirectory', 'openDirectory'],
      message: 'Choose a destination folder',
      buttonLabel: 'Select'
    })

    const path = folder.filePaths[0]

    updateExportOptions('folder', path)
  }

  const updateExportOptions = async (key: string, value: string) => {
    await window.api.updateExportOptions({ key, value }),
      setExportOptions((p) => {
        if (p) {
          return { ...p, [key]: value }
        }

        return undefined
      })
  }

  const getExportOptions = async () => {
    const options = await window.api.getExportOptions()
    setExportOptions(options)
  }

  useEffect(() => {
    getExportJobList()
    getExportOptions()

    const subs = [
      window.api.onExportCompleted((data) => {
        toast(`${getBasename(data.outputPath)} export completed!`, {
          action: {
            label: 'Open',
            onClick: () => window.api.showItemInFilesystem(data.outputPath)
          },
          cancel: {
            label: 'Cancel',
            onClick: () => {}
          }
        })
      })
    ]

    return () => {
      subs.forEach((s) => s())
    }
  }, [])

  const isDisabled =
    exportJobList.length === 0 ||
    !exportJobList ||
    exportOptions?.folder === '' ||
    exportOptions?.format === ''

  return (
    <Page.Root>
      <Page.Header>Export</Page.Header>
      <Page.Body className="gap-12 flex flex-col pt-10 overflow-auto">
        <ConfigSection title="General">
          <ConfigItem label="Format" divider>
            <div className="grow" />
            <div>
              <Select
                value={exportOptions?.format}
                onValueChange={(value) => updateExportOptions('format', value)}
              >
                <SelectTrigger className="w-full border-none gap-1 max-w-[140px]">
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectGroup>
                    <SelectLabel className="text-[10px] text-muted-foreground">
                      Supported Export Formats
                    </SelectLabel>
                    {ExportOptions.map((option) => {
                      return (
                        <SelectItem key={`${option.value}`} value={option.value}>
                          {option.label}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </ConfigItem>

          <ConfigItem
            label="Export Folder"
            sublabel={exportOptions ? exportOptions.folder : undefined}
          >
            <div className="grow" />

            <Button
              className="text-sm w-32"
              onClick={handleFolderSelect}
              variant={'secondary'}
              size={'sm'}
            >
              Select Folder
            </Button>
          </ConfigItem>
        </ConfigSection>

        {exportJobList.length !== 0 && (
          <ConfigSection title="Transcripts">
            {exportJobList.map((job) => (
              <ConfigItem key={job.id} label={'Transcribed'}>
                <div className="grow" />
                <p className="text-muted-foreground text-sm">
                  {getBasename(job.originalMediaFilePath)}
                </p>
              </ConfigItem>
            ))}
          </ConfigSection>
        )}

        {audioURL ? (
          <Button onClick={handleExport} disabled={isDisabled}>
            Export
          </Button>
        ) : (
          <Button onClick={handleStartOver}>Go Home</Button>
        )}
      </Page.Body>
    </Page.Root>
  )
}
