import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { DashboardPage } from './components/general/dashboard'
import { TailwindIndicator } from './components/tailwind-indicator'
import { Toaster } from './components/ui/toaster'

function App(): JSX.Element {
  return (
    <>
      <Toaster richColors position="bottom-right" />
      <TailwindIndicator />
      <Router>
        <Routes>
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
