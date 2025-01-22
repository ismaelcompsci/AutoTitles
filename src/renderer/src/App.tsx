import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { DashboardPage } from './components/general/dashboard'
import { TailwindIndicator } from './components/tailwind-indicator'
import { Toaster } from 'sonner'

function App(): JSX.Element {
  return (
    <>
      <Toaster richColors position="top-right" />
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
