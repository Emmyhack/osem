import { createContext, useContext, useState, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

// Simple wallet context without Solana wallet adapter for now
interface SimpleWalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const SimpleWalletContext = createContext<SimpleWalletContextType | null>(null);

export function useWallet() {
  const context = useContext(SimpleWalletContext);
  if (!context) {
    throw new Error('useWallet must be used within SimpleWalletProvider');
  }
  return context;
}

export function SimpleWalletProvider({ children }: { children: ReactNode }) {
  console.log('SimpleWalletProvider initializing...')
  
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const connect = async () => {
    setConnecting(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnected(true);
      setPublicKey('MOCK_WALLET_ADDRESS');
      console.log('Mock wallet connected');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setPublicKey(null);
    console.log('Wallet disconnected');
  };

  const value: SimpleWalletContextType = {
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
  };

  return (
    <SimpleWalletContext.Provider value={value}>
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
    </SimpleWalletContext.Provider>
  );
}

// Simple wallet button component
export function SimpleWalletButton({ className }: { className?: string }) {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();

  if (connected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">
          {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}
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
      {connecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}