import { Home, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/home',
    icon: Home
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings
  }
]

export function AppSidebar() {
  const { setOpen } = useSidebar()

  return (
    <Sidebar>
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
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <Link to={item.url}>
                      <item.icon className="" />
                      <span>{item.title}</span>
                    </Link>
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
