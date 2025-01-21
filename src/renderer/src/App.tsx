import { Home } from './components/home/home'
import { ThemeProvider } from './components/providers'
import { TailwindIndicator } from './components/tailwind-indicator'
import { Toaster } from './components/ui/toaster'

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-screen bg-background-100">
        <Home />
        <Toaster richColors position="top-right" />
        <TailwindIndicator />
      </div>
    </ThemeProvider>
  )
}

export default App
