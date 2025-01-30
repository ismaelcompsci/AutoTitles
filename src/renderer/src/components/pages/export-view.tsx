import { useEffect } from 'react'
import { Page } from '../ui/page'
import { useAtom } from 'jotai'
import { exportJobListAtom } from '@/state/state'
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

const ExportOptions = [
  {
    label: '.SRT',
    value: 'srt'
  }
]

export const ExportView = () => {
  const [exportJobList, setExportJobList] = useAtom(exportJobListAtom)
  const job = exportJobList[0]

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
      // defaultPath:
      buttonLabel: 'Select'
    })
  }

  const getExportOptions = async () => {}

  useEffect(() => {
    getExportJobList()
    getExportOptions()
  }, [])

  return (
    <Page.Root>
      <Page.Header>Export</Page.Header>
      <Page.Body>
        <div className="h-8" />
        <ConfigSection title="General">
          <ConfigItem label="Format" divider>
            <div className="grow" />
            <div>
              <Select
              // value={format} onValueChange={setFormat}
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
            // GET DEFAULT FOLDER
            // sublabel={folder ? folder : downloadsFolder}
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
      </Page.Body>
    </Page.Root>
  )
}
