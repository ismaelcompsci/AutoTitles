import { Home } from './components/home/home'
import { ThemeProvider } from './components/providers'
import { Toaster } from './components/ui/toaster'

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-screen bg-background-100">
        <Home />
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  )
}

export default App
