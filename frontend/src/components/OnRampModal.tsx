'use client'
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { X, CreditCard, ArrowRight, ExternalLink, Info } from 'lucide-react'
import { useUSDC } from '@/hooks/useUSDC'
import { toast } from 'react-hot-toast'

interface OnRampModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnRampModal({ isOpen, onClose }: OnRampModalProps) {
  const { connected, publicKey } = useWallet()
  const { createUSDCAccount, checkUSDCAccount } = useUSDC()
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSetupUSDC = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      setLoading(true)

      const hasAccount = await checkUSDCAccount()
      if (!hasAccount) {
        await createUSDCAccount()
        toast.success('USDC account created successfully!')
      } else {
        toast('USDC account already exists', {
          icon: 'ℹ️',
          style: {
            background: '#3b82f6',
            color: '#fff',
          },
        })
      }
    } catch (error) {
      console.error('Error setting up USDC:', error)
      toast.error('Failed to setup USDC account')
    } finally {
      setLoading(false)
    }
  }

  const onRampProviders = [
    {
      name: 'MoonPay',
      description: 'Buy USDC with credit card or bank transfer',
      fees: '1.5% + network fees',
      url: 'https://www.moonpay.com/buy/usdc',
      logo: '🌙'
    },
    {
      name: 'Ramp Network',
      description: 'Fast and secure fiat-to-crypto onramp',
      fees: '0.49% - 2.9%',
      url: 'https://ramp.network/',
      logo: '⚡'
    },
    {
      name: 'Coinbase',
      description: 'Transfer USDC from your Coinbase account',
      fees: 'Network fees only',
      url: 'https://www.coinbase.com/',
      logo: '🔵'
    },
    {
      name: 'Jupiter (DEX)',
      description: 'Swap other tokens for USDC on Solana',
      fees: '~0.3% swap fees',
      url: 'https://jup.ag/',
      logo: '🪐'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Get USDC</h2>
            <p className="text-gray-300 mt-1">Add funds to start saving</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* USDC Account Setup */}
          <div className="mb-8">
            <div className="flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-blue-400 font-medium mb-1">First Time Setup</h3>
                <p className="text-gray-300 text-sm mb-3">
                  You'll need a USDC token account on Solana to participate in groups.
                </p>
                <button
                  onClick={handleSetupUSDC}
                  disabled={loading || !connected}
                  className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Setup USDC Account'}
                </button>
              </div>
            </div>
          </div>

          {/* On-Ramp Options */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Choose a funding method</h3>

            {onRampProviders.map((provider, index) => (
              <div key={index} className="card-clean hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{provider.logo}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{provider.name}</h4>
                      <p className="text-gray-300 text-sm">{provider.description}</p>
                      <p className="text-gray-400 text-xs mt-1">Fees: {provider.fees}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center space-x-2 text-sm px-4 py-2"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testnet Notice */}
          <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-400 text-xl">⚠️</div>
              <div>
                <h4 className="text-yellow-400 font-medium mb-1">Testnet Notice</h4>
                <p className="text-gray-300 text-sm">
                  This is running on Solana Devnet. Use testnet faucets or DEX platforms
                  to get test USDC. Real money transactions are not processed.
                </p>
                <div className="mt-3 space-x-2">
                  <a
                    href="https://faucet.solana.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm px-4 py-2 inline-flex items-center space-x-2"
                  >
                    <span>SOL Faucet</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href="https://jup.ag/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm px-4 py-2 inline-flex items-center space-x-2"
                  >
                    <span>Swap on Jupiter</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          {connected && publicKey && (
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Your Wallet Address</h4>
              <div className="flex items-center space-x-2">
                <code className="text-gray-300 text-sm font-mono bg-gray-800 px-3 py-2 rounded flex-1">
                  {publicKey.toString()}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(publicKey.toString())
                    toast.success('Address copied!')
                  }}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Need help? Check our documentation or contact support.
            </p>
            <button onClick={onClose} className="btn-primary">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}