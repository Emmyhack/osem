import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { PublicKey, Connection } from '@solana/web3.js'
import { OsemeProgram } from '../lib/oseme-program'

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  program: OsemeProgram | null
  balance: number
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  publicKey: null,
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
  program: null,
  balance: 0
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [program, setProgram] = useState<OsemeProgram | null>(null)
  const [balance, setBalance] = useState(0)

  // Initialize program
  useEffect(() => {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
    const osemeProgram = new OsemeProgram(connection)
    setProgram(osemeProgram)
  }, [])

  const connect = async () => {
    setConnecting(true)
    try {
      console.log('Connecting wallet...')
      
      // Simulate wallet selection and connection process
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Generate different realistic mock public keys for variety
      const mockKeys = [
        '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
        'A9mUU4qviSctJVPJdBJWkb28deg915LYJKrzQ19ji3FM',
        '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
      ]
      
      const randomKey = mockKeys[Math.floor(Math.random() * mockKeys.length)]
      const mockPublicKey = new PublicKey(randomKey)
      setPublicKey(mockPublicKey)
      setConnected(true)
      
      // Generate realistic balance (0.5 to 15 SOL)
      const mockBalance = 0.5 + Math.random() * 14.5
      setBalance(Math.round(mockBalance * 100) / 100)
      
      console.log('✅ Wallet connected successfully!')
      console.log('📍 Address:', mockPublicKey.toString())
      console.log('💰 Balance:', mockBalance.toFixed(2), 'SOL')
      
      // Initialize program with mock wallet
      if (program) {
        console.log('🔄 Initializing OSEME program...')
        await program.initialize({ publicKey: mockPublicKey })
        console.log('✅ Program initialized successfully!')
      }
      
      // Simulate additional setup
      await new Promise(resolve => setTimeout(resolve, 300))
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error)
      setConnected(false)
      setPublicKey(null)
      setBalance(0)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    console.log('🔌 Disconnecting wallet...')
    setConnected(false)
    setPublicKey(null)
    setBalance(0)
    setProgram(null)
    console.log('✅ Wallet disconnected successfully!')
  }

  const value = {
    connected,
    publicKey,
    connecting,
    connect,
    disconnect,
    program,
    balance
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}