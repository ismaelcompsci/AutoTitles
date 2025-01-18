import { Home } from './components/home/home'
import { ThemeProvider } from './components/providers'
import { Toaster } from './components/ui/toaster'
import { Stack } from './components/ui/stack'

function App(): JSX.Element {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="h-screen w-screen bg-background-100">
        <Stack
          direction={'column'}
          justify="center"
          className="min-h-screen h-full bg-background text-foreground"
        >
          <Home />
        </Stack>
        <Toaster richColors position="top-right" />
      </div>
    </ThemeProvider>
  )
}

export default App
