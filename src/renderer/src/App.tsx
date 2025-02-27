import { AppHeader } from '@/components/common/app-header'
import { MainView } from '@/pages/main-view'
import { ThemeProvider } from '@/components/common/providers'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { Provider } from 'jotai'
import { store } from '@/state/store'

export function App(): JSX.Element {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <ThemeProvider storageKey="vite-ui-theme">
          <div className="relative flex h-screen w-screen flex-col overflow-hidden">
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
          </div>
        </ThemeProvider>
      </SidebarProvider>
    </Provider>
  )
}

export default App
