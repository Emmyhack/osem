import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MinimalWalletProvider } from './components/MinimalWalletProvider'
import App from './App'
import './index.css'

console.log('🌟 Starting OSEM with unified Phantom wallet support...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MinimalWalletProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MinimalWalletProvider>
  </React.StrictMode>,
)

console.log('✨ OSEM dark theme app loaded successfully')