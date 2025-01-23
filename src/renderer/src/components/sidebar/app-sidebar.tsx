import { Home, MoveLeft, MoveRight, Settings } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Button } from '../ui/button'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="group-data-[side=left]:border-none">
      <SidebarContent>
        <div className="px-3.5">
          <div className="h-10 mt-0 flex items-center px-[1px]">
            <div className="flex-1 flex" />
            <Button className="px-0" size={'tiny'} shape="square" variant={'tertiary'}>
              <MoveLeft className="h-4 w-4 text-muted-foreground" />
            </Button>

            <Button className="px-0" size={'tiny'} shape="square" variant={'tertiary'}>
              <MoveRight className="h-4 w-4 text-muted" />
            </Button>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
