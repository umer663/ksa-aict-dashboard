import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AppConfigProvider } from './context/AppConfigContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppConfigProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </AppConfigProvider>
  </React.StrictMode>,
)
