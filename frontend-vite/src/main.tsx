import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from './hooks/useWalletProvider'
import App from './App'
import './index.css'

console.log('🌟 Starting OSEM with dark theme...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WalletProvider>
  </React.StrictMode>,
)

console.log('✨ OSEM dark theme app loaded successfully')