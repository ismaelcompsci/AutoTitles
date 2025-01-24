import { AudioLines, Paperclip } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '../ui/button'
import { WhisperInputConfiguration } from './whisper-input-configuration'
import { WhisperDownloadModelsDialog } from './whisper-download-models-dialog'
import { supportedFormats } from '@/lib/utils'
import { fileInputAtom } from '@/state/whisper-model-state'
import { useAtom } from 'jotai'

export const FileInput = () => {
  const [file, setFile] = useAtom(fileInputAtom)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center text-foreground flex-1">
      {!file ? (
        <div className="flex flex-col justify-center items-center">
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
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={supportedFormats.map((format) => `.${format.toLowerCase()}`).join(',')}
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </Button>
          </div>
        </div>
      ) : (
        <WhisperInputConfiguration file={file} />
      )}

      <WhisperDownloadModelsDialog />
    </div>
  )
}
