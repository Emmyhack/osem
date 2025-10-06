import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { useState, useEffect } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { OsemeProgram } from '../lib/oseme-program'

// Wrapper hook to provide the same interface as the old mock provider
export function useWallet() {
    const { 
        publicKey, 
        connected, 
        connecting, 
        connect: walletConnect, 
        disconnect: walletDisconnect,
        wallet
    } = useSolanaWallet()
    
    const { connection } = useConnection()
    const [balance, setBalance] = useState(0)
    const [program, setProgram] = useState<OsemeProgram | null>(null)

    // Initialize program
    useEffect(() => {
        const osemeProgram = new OsemeProgram(connection)
        setProgram(osemeProgram)
    }, [connection])

    // Fetch balance when wallet connects
    useEffect(() => {
        if (connected && publicKey) {
            const fetchBalance = async () => {
                try {
                    const lamports = await connection.getBalance(publicKey)
                    const solBalance = lamports / LAMPORTS_PER_SOL
                    setBalance(solBalance)
                } catch (error) {
                    console.error('Error fetching balance:', error)
                    setBalance(0)
                }
            }
            
            fetchBalance()
            
            // Set up periodic balance refresh (every 30 seconds)
            const interval = setInterval(fetchBalance, 30000)
            return () => clearInterval(interval)
        } else {
            setBalance(0)
        }
    }, [connected, publicKey, connection])

    // Initialize program when wallet connects
    useEffect(() => {
        if (connected && publicKey && program) {
            program.initialize({ publicKey })
        }
    }, [connected, publicKey, program])

    const connect = async () => {
        try {
            if (wallet) {
                await walletConnect()
            } else {
                // If no wallet is selected, this will trigger the wallet selection modal
                await walletConnect()
            }
        } catch (error) {
            console.error('Wallet connection failed:', error)
        }
    }

    const disconnect = async () => {
        try {
            await walletDisconnect()
            setBalance(0)
        } catch (error) {
            console.error('Wallet disconnection failed:', error)
        }
    }

    return {
        connected,
        publicKey,
        connecting,
        connect,
        disconnect,
        program,
        balance,
        wallet,
        connection
    }
}