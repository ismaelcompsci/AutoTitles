import { AudioWaveform, Home, Package } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { useAtomValue, useSetAtom } from 'jotai'
import { Page, pageAtom, pageHistory } from '@/state/state'
import { Button } from '../ui/button'
import { ArrowLeftIcon, ArrowRightIcon, Share2Icon } from '@radix-ui/react-icons'

const items = [
  {
    title: 'Home',
    page: 'home',
    icon: Home
  },
  {
    title: 'Transcription',
    page: 'transcript',
    icon: AudioWaveform
  },
  {
    title: 'Export Manager',
    page: 'export',
    icon: Share2Icon
  },
  {
    title: 'Model Manager',
    page: 'model-manager',
    icon: Package
  }
]

export function AppSidebar() {
  const setPage = useSetAtom(pageAtom)

  return (
    <Sidebar variant="inset" className="p-0">
      <SidebarContent>
        <div className="px-3.5">
          <div className="min-h-[40px] mt-0 flex items-center px-[1px]">
            <div className="flex-1 flex" />
            {/* STUFF HERE */}
            <SidebarTrigger className="drag-none" />
            <HistoryControls />
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className=""
                    asChild
                    onClick={() => setPage(item.page as Page)}
                  >
                    <div className="group/item">
                      <item.icon className="group-hover/item:text-primary text-gray-900" />
                      <span className="text-xs">{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export const HistoryControls = () => {
  const { undo, canRedo, redo, canUndo } = useAtomValue(pageHistory)
  return (
    <div className="flex flex-items items-center">
      <Button
        className="text-muted-foreground disabled:text-muted drag-none disabled:bg-background-200 disabled:border-none"
        disabled={!canUndo}
        size={'tiny'}
        variant={'tertiary'}
        onClick={undo}
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </Button>

      <Button
        className="text-muted-foreground disabled:text-muted drag-none disabled:bg-background-200 disabled:border-none"
        size={'tiny'}
        disabled={!canRedo}
        variant={'tertiary'}
        onClick={redo}
      >
        <ArrowRightIcon className="h-4 w-4 text-muted" />
      </Button>
    </div>
  )
}
