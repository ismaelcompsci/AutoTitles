import { SidebarTrigger } from '@/components/ui/sidebar'
import { HistoryControls } from '../sidebar/app-sidebar'

export const AppHeader = () => {
  return (
    <div className="bg-background-200 h-10 flex items-center gap-8 shrink-0 drag">
      <div
        style={{
          paddingLeft: '81px'
        }}
        className="flex gap-2 items-center"
      >
        <SidebarTrigger className="drag-none" />

        <HistoryControls />
      </div>

      <div className="flex-1 flex flex-row items-center gap-2 mr-4"></div>
    </div>
  )
}
