import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { LightWalletProvider } from './hooks/useLightWallet'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element not found')
}

const root = createRoot(container)
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LightWalletProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LightWalletProvider>
    </ErrorBoundary>
  </React.StrictMode>
)