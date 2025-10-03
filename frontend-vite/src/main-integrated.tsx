import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from './hooks/useWalletProvider'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx starting with integrated app...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </WalletProvider>
  </React.StrictMode>,
)

console.log('Integrated app initialized successfully')