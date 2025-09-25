'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

// Import wallet adapter CSS
require('@solana/wallet-adapter-react-ui/styles.css');

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    // Configure network (devnet for development, mainnet for production)
    const network = process.env.NODE_ENV === 'production'
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Devnet;

    const endpoint = useMemo(() => {
        if (network === WalletAdapterNetwork.Mainnet) {
            return process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(network);
        }
        return clusterApiUrl(network);
    }, [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#1f2937',
                                color: '#f3f4f6',
                                border: '1px solid #374151',
                            },
                        }}
                    />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}