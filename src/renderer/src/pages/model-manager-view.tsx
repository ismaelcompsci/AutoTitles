import { useEffect, useState } from 'react'
import { Page } from '@/components/ui/page'
import { motion } from 'motion/react'
import { Check, Component, Download, Trash, X } from 'lucide-react'
import { DownloadEvent, ModelCategory, ModelItem } from 'src/shared/models'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn, filterModelListByTab } from '@/lib/utils'
import { Gauge } from '@/components/ui/gauge'
import { toast } from 'sonner'

const tabs = [
  { id: 'all', name: 'All' },
  { id: 'downloaded', name: 'Downloaded' },
  { id: 'multilingual', name: 'Multilingual' },
  { id: 'english', name: 'English Only' }
]

type DownloadState = { status: string; progress?: number; error?: string; id: string }
export const ModelManagerView = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [modelList, setModelList] = useState<ModelCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadProgress, setDownloadProgress] = useState<Record<string, DownloadState>>({})

  const filteredModelList = filterModelListByTab(modelList, activeTab)

  useEffect(() => {
    // Initial load
    const loadModels = async () => {
      const modelList = await window.api.getModelList()
      setModelList(modelList)
      setIsLoading(false)
    }

    loadModels()

    // Download event handlers
    const handleDownloadProgress = (event: DownloadEvent) => {
      setDownloadProgress((prev) => ({
        ...prev,
        [event.url]: {
          status: 'downloading',
          progress: event.progress,
          id: event.id
        }
      }))
    }

    const handleDownloadEnd = (event: DownloadEvent) => {
      setDownloadProgress((prev) => ({
        ...prev,
        [event.url]: { status: 'completed', progress: 100, id: event.id }
      }))

      window.api.getModelList().then(setModelList)
    }

    const handleDownloadError = (event: DownloadEvent) => {
      setDownloadProgress((prev) => ({
        ...prev,
        [event.url]: { status: 'error', error: event.error, id: '', progress: 0 }
      }))
    }

    const handleDownloadCancelled = (event: DownloadEvent) => {
      setDownloadProgress((prev) => ({
        ...prev,
        [event.url]: { status: 'completed', progress: 0, id: event.id }
      }))
    }

    const handleModelListUpdated = (list: ModelCategory[]) => {
      setModelList(list)
    }

    // Setup listeners
    const subs = [
      window.api.onDownloadStarted(handleDownloadProgress),
      window.api.onDownloadProgress(handleDownloadProgress),
      window.api.onDownloadCompleted(handleDownloadEnd),
      window.api.onDownloadError(handleDownloadError),
      window.api.onDownloadCancelled(handleDownloadCancelled),
      window.api.onModelListUpdated(handleModelListUpdated)
    ]

    return () => subs.forEach((s) => s())
  }, [])

  if (isLoading) {
    return <></>
  }

  return (
    <Page.Root>
      <Page.Header>Model Manager</Page.Header>
      <Page.Body className="space-y-8 p-6 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} defaultValue="all">
          <TabsList className="justify-start">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {filteredModelList.map((category) => (
                <div
                  key={category.id}
                  className="mt-6 flex size-full flex-col gap-7 overflow-y-auto pb-6"
                >
                  <h2 className="text-2xl font-bold capitalize text-gray-900">
                    {category.id} Models
                  </h2>

                  <div className="grid grid-cols-1 gap-2 rounded-lg sm:grid-cols-2 2xl:grid-cols-3">
                    {category.items.map((model) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        download={downloadProgress[model.url]}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </Page.Body>
    </Page.Root>
  )
}

export const ModelIcon = ({ model, className }: { model: ModelItem; className?: string }) => {
  const color = {
    multilingual: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500',
    english: 'bg-gradient-to-r from-cyan-700 via-blue-500 to-indigo-600'
  }

  const iconColor = color[model.type]
  return (
    <div
      className={cn(
        'p-1.5 rounded-md',
        'bg-white/5',
        'group-hover:bg-white/10',
        'transition-colors duration-200',
        iconColor,
        className
      )}
    >
      <Component className="size-full" />
    </div>
  )
}

type ModelProps = { model: ModelItem; download?: DownloadState }
export const ModelCard = ({ model, download }: ModelProps) => {
  return (
    <div className="group relative flex w-full flex-col gap-2.5 overflow-hidden rounded-lg border border-default px-5 py-4 text-sm bg-background-200 shadow-md">
      <div className="flex flex-row items-center gap-2">
        <ModelIcon model={model} />
        <div>
          <p>{model.label}</p>
          <p className="text-muted-foreground">{model.size}</p>
        </div>

        <div className="w-24 ml-auto">
          <DownloadButton model={model} download={download} />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{model.description}</p>
    </div>
  )
}

export const DownloadButton = ({ model, download }: ModelProps) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const startDownload = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    setIsHovering(false)

    const downloadDir = await window.api.getModelDownloadsFolder()
    await window.api.download({
      url: model.url,
      saveAsFilename: `ggml-${model.id}.bin`,
      directory: downloadDir
    })
  }

  const stopDownload = async () => {
    if (download) {
      await window.api.cancel({ id: download.id })
      setIsDownloading(false)
    }
  }

  const deleteDownload = async () => {
    const { response } = await window.api.showMessageBox({
      type: 'question',
      buttons: ['Remove Model', 'Cancel'],
      cancelId: 1,
      defaultId: 0,
      message: `Are you sure you want to delete ${model.label} from your disk?`
    })

    if (response === 0) {
      await window.api.deleteModel(model.id)
      toast.success('Model Deleted')
    }
  }

  useEffect(() => {
    if (download?.progress === 100) setIsDownloading(false)
  }, [download?.progress])

  return (
    <div className="flex justify-center relative">
      {isDownloading || download?.status === 'downloading' ? (
        <>
          <X
            onClick={stopDownload}
            className="absolute w-4 h-4 -top-2 right-0 text-gray-900 hover:text-primary hover:cursor-pointer"
          />
          <Gauge size={'tiny'} value={download?.progress ?? 0} />
        </>
      ) : (
        <motion.button
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
          initial={{ opacity: 0 }}
          disabled={isDownloading}
          animate={{ opacity: 1, transition: { duration: 0.075 } }}
          exit={{ opacity: 0, width: 22, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', bounce: 0.2 }}
          className={cn(
            'rounded-full w-6 h-6 flex items-center justify-center hover:bg-gray-200',
            model.disabled ? '' : 'bg-green-200 text-green-900 hover:bg-green-300',
            !model.disabled && isHovering && ' hover:bg-red-200 hover:text-red-900'
          )}
          onClick={model.disabled ? startDownload : deleteDownload}
        >
          {model.disabled ? (
            <div>
              <Download className="w-3 h-3" />
            </div>
          ) : isHovering ? (
            <div className="flex items-center gap-1">
              <Trash className="w-3 h-3" />
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Check className="w-3 h-3" />
            </div>
          )}
        </motion.button>
      )}
    </div>
  )
}
