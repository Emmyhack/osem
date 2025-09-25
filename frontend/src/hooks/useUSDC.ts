import { useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TokenAccountNotFoundError
} from '@solana/spl-token'
import { toast } from 'react-hot-toast'
import { USDC_MINT, getConnection } from '../lib/solana'

export const useUSDC = () => {
  const { publicKey, sendTransaction } = useWallet()

  const getUSDCBalance = useCallback(async () => {
    if (!publicKey) return 0

    try {
      const connection = getConnection()
      const tokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey)

      try {
        const account = await getAccount(connection, tokenAccount)
        // Convert from smallest unit (6 decimals for USDC)
        return Number(account.amount) / 1_000_000
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          return 0
        }
        throw error
      }
    } catch (error) {
      console.error('Error getting USDC balance:', error)
      return 0
    }
  }, [publicKey])

  const createUSDCAccount = useCallback(async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet')
      return null
    }

    try {
      const connection = getConnection()
      const tokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey)

      // Check if account already exists
      try {
        await getAccount(connection, tokenAccount)
        return tokenAccount // Account already exists
      } catch (error) {
        if (!(error instanceof TokenAccountNotFoundError)) {
          throw error
        }
      }

      // Create the associated token account
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey, // payer
          tokenAccount, // associated token account
          publicKey, // owner
          USDC_MINT // mint
        )
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      toast.success('USDC account created successfully!')
      return tokenAccount
    } catch (error) {
      console.error('Error creating USDC account:', error)
      toast.error('Failed to create USDC account')
      return null
    }
  }, [publicKey, sendTransaction])

  const checkUSDCAccount = useCallback(async () => {
    if (!publicKey) return false

    try {
      const connection = getConnection()
      const tokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey)

      try {
        await getAccount(connection, tokenAccount)
        return true
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          return false
        }
        throw error
      }
    } catch (error) {
      console.error('Error checking USDC account:', error)
      return false
    }
  }, [publicKey])

  const requestUSDCTestnet = useCallback(async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      // This is a placeholder for testnet USDC faucet
      // In production, users would need to use a real USDC on-ramp
      toast('For testnet USDC, please use the official Solana faucet or DEX')

      // You could implement a custom testnet faucet here
      // or redirect to an existing one
    } catch (error) {
      console.error('Error requesting testnet USDC:', error)
      toast.error('Failed to request testnet USDC')
    }
  }, [publicKey])

  return {
    getUSDCBalance,
    createUSDCAccount,
    checkUSDCAccount,
    requestUSDCTestnet,
  }
}