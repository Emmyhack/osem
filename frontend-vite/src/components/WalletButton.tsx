import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '../hooks/useRealWallet'

export function WalletButton() {
    const { connected } = useWallet()

    if (connected) {
        return (
            <WalletDisconnectButton 
                style={{
                    backgroundColor: '#ef4444',
                    borderRadius: '0.5rem',
                    height: 'auto',
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                }}
            />
        )
    }

    return (
        <WalletMultiButton 
            style={{
                backgroundColor: '#2563eb',
                borderRadius: '0.5rem',
                height: 'auto',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
            }}
        />
    )
}