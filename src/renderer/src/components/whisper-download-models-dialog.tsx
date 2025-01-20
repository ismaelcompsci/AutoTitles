import { Modal } from '@/components/ui/modal'
import { downloadedModelsAtom, showDownloadModalDialogAtom } from '@/state/whisper-model-state'
import { Button } from './ui/button'
import { models, modelSizes, WhisperModel } from '@/util/models'
import { Separator } from './ui/separator'
import { Download, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Gauge } from './ui/gauge'
import { useAtom } from 'jotai'
import { toast } from 'sonner'

export const WhisperDownloadModelsDialog = () => {
  const [showDownloadModalDialog, setShowDownloadModalDialog] = useAtom(showDownloadModalDialogAtom)
  const [downloadedModels, setDownloadedModels] = useAtom(downloadedModelsAtom)
  const [download, setDownload] = useState({
    model: '',
    totalBytes: 0,
    bytesReceived: 0,
    loading: false,
    id: ''
  })

  useEffect(() => {
    window.api.onDownloadStarted(({ totalBytes }) => {
      setDownload((p) => ({ ...p, loading: true, totalBytes: totalBytes }))
    })
    window.api.onDownloadProgress(({ bytesReceived }) => {
      setDownload((p) => ({ ...p, loading: true, bytesReceived: bytesReceived }))
    })
    window.api.onDownloadCompleted(({ filePath, model }) => {
      setDownloadedModels((p) => {
        const exists = p.find((m) => m.name === model && m.path === filePath)

        if (exists) {
          return [...p]
        }

        return [...p, { name: model, path: filePath }]
      })
      setDownload((p) => ({ ...p, loading: false }))
    })
  }, [])

  const handleDownloadClick = async (model: WhisperModel) => {
    const { alreadyExisted, downloadId } = await window.api.downloadWhisperModel({ model: model })

    if (alreadyExisted) {
      // VALIDATE THIS IS TRUE USER COULD HAVE DELETED AN STATE IS OUT OF SYNC NOW
      toast.error(`${model} is already installed`)
      return
    }

    setDownload({
      model: model,
      totalBytes: 0,
      bytesReceived: 0,
      loading: true,
      id: downloadId
    })
  }

  const handelCancelDownload = () => {
    setDownload({
      model: '',
      totalBytes: 0,
      bytesReceived: 0,
      loading: false,
      id: ''
    })
  }

  const filteredModels = useMemo(() => {
    const names = downloadedModels.map((dm) => dm.name)
    return models.filter((model) => !names.includes(model))
  }, [downloadedModels])

  const percentage = (download.bytesReceived / download.totalBytes) * 100
  const progress = isNaN(percentage) ? 0 : Math.ceil(percentage)

  return (
    <Modal.Modal open={showDownloadModalDialog} onOpenChange={setShowDownloadModalDialog}>
      <Modal.Content>
        <Modal.Body>
          <Modal.Header>
            <Modal.Title>Whisper Model Download</Modal.Title>
          </Modal.Header>

          <div className="border rounded-md overflow-y-scroll max-h-96">
            <div className="px-3">
              {filteredModels.map((model, i) => {
                const size = modelSizes[model]
                const isRecommended = model === 'medium.en'
                const isDownloading = download.model === model && download.loading

                return (
                  <div key={`${model}-${i}`}>
                    <div className="grid grid-cols-5 h-10 items-center">
                      <span>{model}</span>
                      {isRecommended ? (
                        <span className="pl-2 text-xs text-muted-foreground"> recommended</span>
                      ) : undefined}

                      <p className="col-start-4 text-sm text-muted-foreground">{size}</p>

                      {isDownloading ? (
                        <div className="relative">
                          <Gauge showValue size="small" value={progress} />

                          <Button
                            onClick={handelCancelDownload}
                            size={'tiny'}
                            variant={'secondary'}
                            className="absolute right-0 top-0 border-none hover:bg-background-100"
                          >
                            <X className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          disabled={download.loading}
                          onClick={() => handleDownloadClick(model)}
                          className="col-start-5 mx-auto"
                          size={'tiny'}
                          variant={'secondary'}
                        >
                          <Download className="h-2.5 w-2.5" />
                        </Button>
                      )}
                    </div>

                    {i !== models.length - 1 && <Separator />}
                  </div>
                )
              })}
            </div>
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Modal.Cancel>Cancel</Modal.Cancel>
          <Modal.Action disabled={download.loading}>Done</Modal.Action>
        </Modal.Actions>
      </Modal.Content>
    </Modal.Modal>
  )
}
