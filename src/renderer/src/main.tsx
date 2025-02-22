// import { scan } from 'react-scan' // import this BEFORE react
import './globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// if (typeof window !== 'undefined') {
//   scan({
//     enabled: true,
//     log: true // logs render info to console (default: false)
//   })
// }

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
