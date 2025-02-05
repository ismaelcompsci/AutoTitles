import { AudioLines, Paperclip } from 'lucide-react'
import { Button } from '../ui/button'
import { supportedFormats } from '@/lib/utils'
import { useSetAtom } from 'jotai'
import { pageAtom, transcribeJobListAtom } from '@/state/state'
import { Page } from '../ui/page'

export const HomeView = () => {
  const setPage = useSetAtom(pageAtom)
  const setTranscribeJobList = useSetAtom(transcribeJobListAtom)

  const handleClick = async () => {
    const { filePaths } = await window.api.showOpenDialog({
      message: 'Select and Audio or Video file to transcribe',
      properties: ['openFile', 'createDirectory'],
      filters: [{ name: 'Medial Files', extensions: supportedFormats }]
    })

    const filePath = filePaths[0]

    if (filePath) {
      await window.api.createJob({
        data: { originalMediaFilePath: `file://${filePath}` },
        type: 'Transcribe'
      })

      const transcribeJobs = await window.api.getJobList({ type: 'Transcribe' })
      setTranscribeJobList(transcribeJobs)
      setPage('transcript-config')
    }
  }

  return (
    <Page.Root>
      <Page.Header>New Transcript</Page.Header>
      <Page.Body className="flex flex-col justify-center items-center text-foreground flex-1">
        <AudioLines className="h-28 w-28 text-muted-foreground" />

        <div className="flex gap-2 items-center flex-col">
          <div>
            {supportedFormats.map((format) => (
              <span
                key={format}
                className="px-1 last:border-none border-r text-sm text-muted-foreground"
              >
                {format}
              </span>
            ))}
          </div>
          - or -
          <Button onClick={handleClick} size={'sm'} prefix={<Paperclip className="h-4 w-4" />}>
            Upload
          </Button>
        </div>
      </Page.Body>
    </Page.Root>
  )
}
