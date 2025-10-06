import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { OsemeProgram } from '../lib/oseme-program'

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  program: OsemeProgram | null
  balance: number
  walletName: string | null
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
  program: null,
  balance: 0,
  walletName: null
})

export const useWallet = () => useContext(WalletContext)

interface LightWalletProviderProps {
  children: ReactNode
}

// Lightweight wallet provider that connects directly to Phantom/Solflare
export function LightWalletProvider({ children }: LightWalletProviderProps) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [program, setProgram] = useState<OsemeProgram | null>(null)
  const [balance, setBalance] = useState(0)
  const [walletName, setWalletName] = useState<string | null>(null)
  
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed')

  // Initialize program
  useEffect(() => {
    const osemeProgram = new OsemeProgram(connection)
    setProgram(osemeProgram)
  }, [])

  // Check if wallet is already connected on load
  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  // Fetch balance when connected
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance()
      const interval = setInterval(fetchBalance, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [connected, publicKey])

  const checkIfWalletConnected = async () => {
    try {
      const phantom = (window as any)?.solana
      const solflare = (window as any)?.solflare
      
      if (phantom?.isConnected) {
        setConnected(true)
        setPublicKey(new PublicKey(phantom.publicKey.toString()))
        setWalletName('Phantom')
      } else if (solflare?.isConnected) {
        setConnected(true)
        setPublicKey(new PublicKey(solflare.publicKey.toString()))
        setWalletName('Solflare')
      }
    } catch (error) {
      console.log('No wallet found or not connected')
    }
  }

  const fetchBalance = async () => {
    if (!publicKey || !connected) return
    
    try {
      const lamports = await connection.getBalance(publicKey)
      const solBalance = lamports / LAMPORTS_PER_SOL
      setBalance(Math.round(solBalance * 1000) / 1000) // Round to 3 decimals
    } catch (error) {
      console.error('Error fetching balance:', error)
      setBalance(0)
    }
  }

  const connect = async () => {
    if (connecting) return
    
    setConnecting(true)
    
    try {
      // Try Phantom first
      const phantom = (window as any)?.solana
      if (phantom && phantom.isPhantom) {
        console.log('🦊 Connecting to Phantom...')
        const response = await phantom.connect()
        setPublicKey(new PublicKey(response.publicKey.toString()))
        setConnected(true)
        setWalletName('Phantom')
        
        if (program) {
          await program.initialize({ publicKey: new PublicKey(response.publicKey.toString()) })
        }
        
        console.log('✅ Phantom connected:', response.publicKey.toString())
        return
      }

      // Try Solflare if Phantom not available
      const solflare = (window as any)?.solflare
      if (solflare) {
        console.log('⚡ Connecting to Solflare...')
        const response = await solflare.connect()
        setPublicKey(new PublicKey(response.publicKey.toString()))
        setConnected(true)
        setWalletName('Solflare')
        
        if (program) {
          await program.initialize({ publicKey: new PublicKey(response.publicKey.toString()) })
        }
        
        console.log('✅ Solflare connected:', response.publicKey.toString())
        return
      }

      // No wallet found - redirect to install
      console.log('❌ No wallet detected')
      const installChoice = confirm('No Solana wallet detected!\n\nWould you like to install Phantom wallet?\n\nClick OK for Phantom or Cancel to try Solflare')
      
      if (installChoice) {
        window.open('https://phantom.app/', '_blank')
      } else {
        window.open('https://solflare.com/', '_blank')
      }
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error)
      alert('Failed to connect wallet. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      const phantom = (window as any)?.solana
      const solflare = (window as any)?.solflare
      
      if (phantom && walletName === 'Phantom') {
        await phantom.disconnect()
      } else if (solflare && walletName === 'Solflare') {
        await solflare.disconnect()
      }
      
      setConnected(false)
      setPublicKey(null)
      setBalance(0)
      setWalletName(null)
      
      console.log('✅ Wallet disconnected')
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
    }
  }

  const value = {
    connected,
    publicKey,
    connecting,
    connect,
    disconnect,
    program,
    balance,
    walletName
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}