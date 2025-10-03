import React, { createContext, useContext } from 'react'

// Simple mock wallet context for now
interface WalletContextType {
  connected: boolean
  connecting: boolean
  publicKey: string | null
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  publicKey: null,
  connect: () => {},
  disconnect: () => {}
})

export const useWallet = () => useContext(WalletContext)

export function SimpleWalletProvider({ children }: { children: React.ReactNode }) {
  const walletValue: WalletContextType = {
    connected: false,
    connecting: false,
    publicKey: null,
    connect: () => console.log('Connect wallet clicked'),
    disconnect: () => console.log('Disconnect wallet clicked')
  }

  return (
    <WalletContext.Provider value={walletValue}>
      {children}
    </WalletContext.Provider>
  )
}