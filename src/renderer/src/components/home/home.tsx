import { useAtomValue } from 'jotai'
import { FileInput } from './file-input'
import { stepAtom } from '@/state/main-state'
import { Transcribe } from './transcribe'

export const Home = () => {
  const step = useAtomValue(stepAtom)

  const renderPage = () => {
    if (step === 'INPUT') {
      return <FileInput />
    }

    if (step === 'TRANSCRIBE') {
      return <Transcribe />
    }

    return <div>SOMETHING WENT WRONG</div>
  }

  return renderPage()
}
