import { AppHeader } from './components/common/app-header'
import { MainView } from './components/pages/main-view'
import { ThemeProvider } from './components/common/providers'
import { WavesurferProvider } from './components/common/wavesurfer-provider'
import { TailwindIndicator } from './components/tailwind-indicator'
import { SidebarProvider } from './components/ui/sidebar'
import { Toaster } from './components/ui/toaster'
import { AppSidebar } from './components/sidebar/app-sidebar'

export function App(): JSX.Element {
  return (
    <SidebarProvider>
      <ThemeProvider storageKey="vite-ui-theme">
        <div className="relative flex h-screen w-screen flex-col overflow-hidden">
          <WavesurferProvider>
            <AppHeader />

            {/* main */}
            <main className="isolate flex size-full overflow-hidden bg-background-200">
              <div className="relative flex h-full bg-background-200">
                {/* <div className="w-48" /> */}
                <AppSidebar />
              </div>
              {/* <SidebarInset> */}
              <MainView />
              {/* </SidebarInset> */}
            </main>

            <TailwindIndicator />
            <Toaster richColors position="bottom-right" />
          </WavesurferProvider>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  )
}

export default App
