import { useState, useEffect } from 'react'
import { useWallet } from '../components/TempWalletProvider'

interface USDCBalance {
  balance: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useUSDC(): USDCBalance {
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = async () => {
    if (!publicKey || !connected) {
      setBalance(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock balance - random number between 100-1000 USDC
      const mockBalance = Math.floor(Math.random() * 900) + 100
      setBalance(mockBalance)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch USDC balance')
      console.error('Error fetching USDC balance:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [publicKey, connected])

  return {
    balance,
    loading,
    error,
    refresh: fetchBalance,
  }
}