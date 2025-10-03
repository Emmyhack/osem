import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

interface WalletContextState {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  connect(): Promise<void>;
  disconnect(): void;
  sendTransaction?: (transaction: Transaction, connection: Connection) => Promise<string>;
}

const WalletContext = createContext<WalletContextState>({} as WalletContextState);

export function useWallet(): WalletContextState {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: ReactNode;
}

export function MinimalWalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      
      // Check if Phantom is installed
      const solana = (window as any).solana;
      if (typeof window !== 'undefined' && solana && solana.isPhantom) {
        const response = await solana.connect();
        setPublicKey(new PublicKey(response.publicKey.toString()));
        setConnected(true);
        console.log('Connected to Phantom wallet:', response.publicKey.toString());
      } else {
        // Fallback to window.open for wallet installation
        window.open('https://phantom.app/', '_blank');
        throw new Error('Phantom wallet not installed');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    const solana = (window as any).solana;
    if (typeof window !== 'undefined' && solana) {
      solana.disconnect();
    }
    setConnected(false);
    setPublicKey(null);
  }, []);

  const sendTransaction = useCallback(async (transaction: Transaction, connection: Connection) => {
    const solana = (window as any).solana;
    if (!connected || !publicKey || !solana) {
      throw new Error('Wallet not connected');
    }

    const signed = await solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    return signature;
  }, [connected, publicKey]);

  const value: WalletContextState = {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
    sendTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Simple wallet button component
export function SimpleWalletButton({ className }: { className?: string }) {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors ${className}`}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className={`px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 ${className}`}
    >
      {connecting ? 'Connecting...' : 'Connect Phantom'}
    </button>
  );
}

