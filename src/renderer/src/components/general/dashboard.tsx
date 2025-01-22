import { Home } from '../home/home'
import { ThemeProvider } from '../providers'
import { Route, Routes } from 'react-router-dom'

export const DashboardPage = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="text-sm bg-background-100 flex flex-row w-full h-full min-h-full items-stretch">
        <Routes>
          <Route path="*" element={<Home />}></Route>
        </Routes>
      </div>
    </ThemeProvider>
  )
}
