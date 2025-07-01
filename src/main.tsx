import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AppConfigProvider } from './context/AppConfigContext'

// Get the base URL from environment
const getBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/' // Local development in private repo
  }
  return '/ksa-aict-dashboard' // Production in public repo
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppConfigProvider>
      <BrowserRouter basename={getBaseUrl()}>
        <App />
      </BrowserRouter>
    </AppConfigProvider>
  </React.StrictMode>,
)
