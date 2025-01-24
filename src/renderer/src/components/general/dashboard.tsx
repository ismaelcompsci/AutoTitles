import { cn } from '@/lib/utils'
import { AppHeader } from '../common/app-header'
import { Home } from '../home/home'
import { ThemeProvider } from '../providers'
import { Route, Routes } from 'react-router-dom'
import { SidebarProvider } from '../ui/sidebar'
import { AppSidebar } from '../sidebar/app-sidebar'
import { Settings } from '../settings/settings'

export const DashboardPage = () => {
  return (
    <SidebarProvider className="text-sm bg-background-100 flex flex-row w-full h-full min-h-full items-stretch">
      <ThemeProvider storageKey="vite-ui-theme">
        <AppSidebar />
        <div className="flex flex-col justify-center h-full flex-1">
          <AppHeader />
          <main
            className={cn(
              'media-player-wrapper flex flex-col border-[0.5px] flex-1 overflow-hidden relative place-items-stretch bg-background-200'
            )}
          >
            <Routes location={'/home'}>
              <Route path="/home" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  )
}
