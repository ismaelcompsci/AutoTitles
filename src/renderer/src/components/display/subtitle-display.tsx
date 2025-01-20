import { DisplayTop } from './display-top'
import { DisplayBottom } from './display-bottom'

export const WhisperSubtitleDisplay = () => {
  return (
    <div className="flex flex-col h-screen">
      <DisplayTop />
      <DisplayBottom />
    </div>
  )
}
