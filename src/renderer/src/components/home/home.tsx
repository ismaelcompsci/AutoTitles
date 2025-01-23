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

  return renderPage()
  // </main>
  // </div>
}
