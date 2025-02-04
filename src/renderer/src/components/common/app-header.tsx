import { MoveLeft, MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAtomValue } from 'jotai'
import { pageHistory } from '@/state/state'

export const AppHeader = () => {
  const { undo, canRedo, redo, canUndo } = useAtomValue(pageHistory)

  return (
    <div className="bg-background-200 h-10 flex items-center gap-8 shrink-0 drag">
      <div
        style={{
          paddingLeft: '81px'
        }}
        className="flex gap-2 items-center"
      >
        <SidebarTrigger className="drag-none" />

        <Button
          disabled={!canUndo}
          className="px-0 text-muted-foreground disabled:text-muted drag-none disabled:bg-background-200 disabled:border-none"
          size={'tiny'}
          shape="square"
          variant={'tertiary'}
          onClick={undo}
        >
          <MoveLeft className="h-4 w-4" />
        </Button>

        <Button
          className="px-0 disabled:text-muted drag-none disabled:bg-background-200 disabled:border-none"
          size={'tiny'}
          shape="square"
          disabled={!canRedo}
          variant={'tertiary'}
          onClick={redo}
        >
          <MoveRight className="h-4 w-4 text-muted" />
        </Button>
      </div>

      <div className="flex-1 flex flex-row items-center gap-2 mr-4"></div>
    </div>
  )
}
