import { useAtomValue } from 'jotai'
import { FileInput } from './file-input'
import { stepAtom } from '@/state/main-state'
import { Process } from './process'
import { cn } from '@/lib/utils'
import { fileInputAtom } from '@/state/whisper-model-state'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'

export const Home = () => {
  const step = useAtomValue(stepAtom)

  const renderPage = () => {
    if (step === 'INPUT') {
      return <FileInput />
    }

    if (step === 'PROCESS') {
      return <Process />
    }

    if (step === 'PREVIEW') {
      return <div>preview</div>
    }

    return <div>SOMETHING WENT WRONG</div>
  }

  return (
    <div className="flex flex-col justify-center h-full flex-1">
      <AppHeader />
      <main
        className={cn(
          'media-player-wrapper flex flex-col border-[0.5px] flex-1 overflow-hidden relative place-items-stretch bg-background-200'
          // !isMobile && 'rounded-md mt-0 mr-2 mb-2 ml-0'
        )}
      >
        {renderPage()}
      </main>
    </div>
  )
}

const AppHeader = () => {
  const file = useAtomValue(fileInputAtom)
  return (
    <div className="header h-10 flex items-center gap-8 shrink-0 bg-background">
      <div
        style={{
          paddingLeft: '81px'
        }}
        className="flex"
      >
        {/* <SidebarTrigger className="[app-region:no-drag;]" /> */}
      </div>
      <div className="flex items-center gap-2 min-w-0 w-full">
        <div className="flex flex-shrink gap-2 w-full">
          <div className="[app-region:no-drag;] w-full flex justify-center items-center">
            {file?.name}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-1 mr-6">
        <Button variant={'tertiary'} size={'tiny'} className="[app-region:no-drag;]">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
