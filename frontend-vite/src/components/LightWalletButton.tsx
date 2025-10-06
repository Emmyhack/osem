import { useWallet } from '../hooks/useLightWallet'

export function LightWalletButton({ className = '' }: { className?: string }) {
  const { connected, connecting, publicKey, balance, walletName, connect, disconnect } = useWallet()

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <div className="text-sm text-gray-300 flex items-center gap-2">
            <span className="text-green-400">●</span>
            {walletName}
          </div>
          <div className="text-xs text-gray-400">
            {balance.toFixed(3)} SOL
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-mono text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </div>
          <button
            onClick={disconnect}
            className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium ${className}`}
          >
            Disconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className={`px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors ${
        connecting ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {connecting ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Connecting...
        </div>
      ) : (
        'Connect Wallet'
      )}
    </button>
  )
}