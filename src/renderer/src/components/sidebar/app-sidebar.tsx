import { AudioWaveform, Home, Package } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { useSetAtom } from 'jotai'
import { Page, pageAtom } from '@/state/state'

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
    title: 'Model Manager',
    page: 'model-manager',
    icon: Package
  }
]

export function AppSidebar() {
  const setPage = useSetAtom(pageAtom)

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <div className="px-3.5">
          <div className="h-10 mt-0 flex items-center px-[1px]">
            <div className="flex-1 flex" />
            {/* STUFF HERE */}
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="group hover:text-gray-1000 text-gray-900"
                    asChild
                    onClick={() => setPage(item.page as Page)}
                  >
                    <div>
                      <item.icon className="" />
                      <span>{item.title}</span>
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
