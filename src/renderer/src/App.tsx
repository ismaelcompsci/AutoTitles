import { AppHeader } from './components/common/app-header'
import { MainView } from './components/pages/main-view'
import { ThemeProvider } from './components/common/providers'
import { WavesurferProvider } from './components/common/wavesurfer-provider'
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
              <div className="relative flex h-full pr-2 bg-background-200">
                <AppSidebar />
              </div>

              <MainView />
            </main>

            {/* <TailwindIndicator /> */}
            <Toaster richColors position="bottom-right" />
          </WavesurferProvider>
        </div>
      </ThemeProvider>
    </SidebarProvider>
  )
}

export default App
