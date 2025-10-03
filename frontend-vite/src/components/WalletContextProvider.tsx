import React, { useState, useEffect } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
    PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

// Robust connection with timeout and error handling
const createRobustConnection = async (endpoint: string, timeout = 10000): Promise<string> => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error('Connection timeout'));
        }, timeout);

        // Test the connection
        const testConnection = async () => {
            try {
                const connection = new Connection(endpoint, 'confirmed');
                await connection.getVersion(); // Quick health check
                clearTimeout(timer);
                resolve(endpoint);
            } catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        };

        testConnection();
    });
};

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    console.log('WalletContextProvider initializing...')
    
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Configure network (devnet for development, mainnet for production)
    const network = import.meta.env.PROD
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Devnet;
    
    console.log('Network configured:', network)

    const endpoint = useMemo(() => {
        try {
            if (network === WalletAdapterNetwork.Mainnet) {
                const rpcEndpoint = import.meta.env.VITE_RPC_ENDPOINT || clusterApiUrl(network);
                console.log('Using RPC endpoint:', rpcEndpoint);
                return rpcEndpoint;
            }
            const devnetEndpoint = clusterApiUrl(network);
            console.log('Using devnet endpoint:', devnetEndpoint);
            return devnetEndpoint;
        } catch (error) {
            console.error('Error configuring RPC endpoint:', error);
            // Fallback to a basic devnet endpoint
            return 'https://api.devnet.solana.com';
        }
    }, [network]);

    const wallets = useMemo(
        () => {
            console.log('Initializing wallet adapters...')
            try {
                // Only use Phantom for now to simplify
                const adapters = [
                    new PhantomWalletAdapter(),
                ]
                console.log('Wallet adapters initialized successfully')
                return adapters
            } catch (error) {
                console.error('Error initializing wallet adapters:', error)
                return []
            }
        },
        []
    );

    // Test connection on component mount
    useEffect(() => {
        let isMounted = true;
        
        const initializeConnection = async () => {
            try {
                console.log('Testing connection to:', endpoint);
                await createRobustConnection(endpoint, 8000); // 8 second timeout
                
                if (isMounted) {
                    console.log('Connection successful!');
                    setIsReady(true);
                }
            } catch (error) {
                console.error('Connection failed:', error);
                if (isMounted) {
                    setError(`Failed to connect to Solana network: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    // Still set ready to true to allow fallback behavior
                    setIsReady(true);
                }
            }
        };

        initializeConnection();
        
        return () => {
            isMounted = false;
        };
    }, [endpoint]);

    // Loading state
    if (!isReady) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold mb-2">Connecting to Solana</h2>
                    <p className="text-gray-400">Initializing wallet provider...</p>
                </div>
            </div>
        );
    }

    // Error state with fallback
    if (error) {
        console.warn('WalletContextProvider warning:', error);
        // Continue with initialization but show warning
    }

    console.log('WalletContextProvider rendering with endpoint:', endpoint)
    
    try {
        return (
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect={false}>
                    <WalletModalProvider>
                        {error && (
                            <div className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-200 p-3 m-4 rounded-lg">
                                <div className="flex items-center">
                                    <span className="mr-2">⚠️</span>
                                    <span className="text-sm">Network connection issues detected. Some features may be limited.</span>
                                </div>
                            </div>
                        )}
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
    } catch (error) {
        console.error('Error rendering WalletContextProvider:', error);
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Wallet Connection Error</h2>
                    <p className="text-gray-300 mb-4">Failed to initialize wallet provider</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }
}