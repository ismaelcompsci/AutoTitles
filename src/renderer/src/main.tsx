import { scan } from 'react-scan' // import this BEFORE react
import './globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'jotai'
import { store } from './state/store'

// if (typeof window !== 'undefined') {
//   scan({
//     enabled: true,
//     log: true // logs render info to console (default: false)
//   })
// }

const Root = () => {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  )
}

const root = document.getElementById('root') as HTMLElement
root.style.background = 'hsl(240, 3%, 6%)'
ReactDOM.createRoot(root).render(<Root />)
