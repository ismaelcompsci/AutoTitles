import { AudioLines, Loader2, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { filterModelListByTab, getMediaDuration, supportedFormats } from '@/lib/utils'
import { useSetAtom } from 'jotai'
import { pageAtom, transcribeJobListAtom } from '@/state/state'
import { Page } from '@/components/ui/page'
import { useEffect, useState } from 'react'
import { ModelItem } from 'src/shared/models'
import React from 'react'

export const HomeView = () => {
  const setPage = useSetAtom(pageAtom)
  const setTranscribeJobList = useSetAtom(transcribeJobListAtom)

  const [downloadedModels, setDownloadedModels] = useState<ModelItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleClick = async () => {
    await window.api.clearQueue()

    const { filePaths } = await window.api.showOpenDialog({
      message: 'Select Video file to caption',
      properties: ['openFile', 'createDirectory'],
      filters: [{ name: 'Video Files', extensions: supportedFormats }]
    })

    const filePath = filePaths[0]
    const media = `file://${filePath}`

    const duration = await getMediaDuration(media)

    if (filePath) {
      await window.api.createJob({
        data: { originalMediaFilePath: media, duration: duration },
        type: 'Transcribe'
      })

      const transcribeJobs = await window.api.getJobList({ type: 'Transcribe' })
      setTranscribeJobList(transcribeJobs)
      setPage('transcript-config')
    }
  }

  useEffect(() => {
    // Initial load
    const loadModels = async () => {
      const modelList = await window.api.getModelList()
      const downloadedModels = filterModelListByTab(modelList, 'downloaded')[0]?.items ?? []

      setDownloadedModels(downloadedModels)
      setIsLoading(false)
    }

    loadModels()
  }, [])

  const hasModels = downloadedModels.length > 0

  return (
    <Page.Root>
      <Page.Header>New Transcript</Page.Header>
      <Page.Body className="flex flex-col justify-center items-center text-foreground flex-1 p-8 space-y-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading models...</p>
          </div>
        ) : !hasModels ? (
          <div className="flex flex-col justify-center items-center space-y-6 text-center">
            <span>Download a model to get started</span>
            <Button
              onClick={() => setPage('model-manager')}
              className="bg-primary hover:bg-primary/90 transition-colors"
            >
              Go To Model Manager
            </Button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-6 text-center">
            <AudioLines className="h-32 w-32 text-muted-foreground opacity-70" />

            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                {supportedFormats.map((format, index) => (
                  <React.Fragment key={format}>
                    {index > 0 && <span className="text-xs">•</span>}
                    <span className="text-sm">{format}</span>
                  </React.Fragment>
                ))}
              </div>

              <div className="flex flex-col items-center space-y-2">
                <Button
                  onClick={handleClick}
                  size={'sm'}
                  prefix={<Paperclip className="h-4 w-4" />}
                >
                  Choose file
                </Button>
              </div>
            </div>
          </div>
        )}
      </Page.Body>
    </Page.Root>
  )
}
