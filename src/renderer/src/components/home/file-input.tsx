import { AudioLines, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Stack } from '../ui/stack'
import { WhisperInputDialog } from '../whisper-input-dialog'
import { WhisperDownloadModelsDialog } from '../whisper-download-models-dialog'

const supportedFormats = ['MP3', 'WAV', 'M4A', 'AAC', 'FLAC', 'OGG', 'OPUS', 'MP4', 'MOV', 'MKV']

export const FileInput = () => {
  const [file, setFile] = useState<File | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setIsModalOpen(true)
    }
  }

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setFile(null)
      setIsModalOpen(false)
      return
    }

    setIsModalOpen(open)
  }

  return (
    <Stack direction={'column'} justify="center" className="text-foreground">
      {!file && (
        <Stack justify="center" align="center">
          <AudioLines className="h-28 w-28 text-muted-foreground" />

          <Stack gap={2}>
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
            <Button onClick={handleClick} size={'sm'} prefix={<Upload className="h-4 w-4" />}>
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
          </Stack>
        </Stack>
      )}

      <WhisperInputDialog file={file} open={isModalOpen} onOpenChange={handleModalOpenChange} />

      <WhisperDownloadModelsDialog />
    </Stack>
  )
}
