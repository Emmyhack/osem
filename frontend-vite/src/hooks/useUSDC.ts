import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token'
import { getCurrentUSDC } from '../lib/solana'

interface USDCBalance {
  balance: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useUSDC(): USDCBalance {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = async () => {
    if (!publicKey || !connection) {
      setBalance(0)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const usdcMint = getCurrentUSDC()
      const tokenAddress = await getAssociatedTokenAddress(usdcMint, publicKey)
      
      const tokenAccount = await getAccount(connection, tokenAddress)
      const usdcBalance = Number(tokenAccount.amount) / 1e6 // USDC has 6 decimals
      
      setBalance(usdcBalance)
    } catch (err: any) {
      // If account doesn't exist, balance is 0
      if (err.message?.includes('could not find account')) {
        setBalance(0)
      } else {
        setError(err.message || 'Failed to fetch USDC balance')
        console.error('Error fetching USDC balance:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBalance()
  }, [publicKey, connection])

  return {
    balance,
    loading,
    error,
    refresh: fetchBalance,
  }
}