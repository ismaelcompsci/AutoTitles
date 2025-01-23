import { useAtomValue } from 'jotai'
import { FileInput } from './file-input'
import { stepAtom } from '@/state/main-state'
import { Process } from './process'
import { cn } from '@/lib/utils'
import { AppHeader } from '../common/app-header'

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
