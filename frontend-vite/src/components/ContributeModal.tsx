import React, { useState } from 'react'
import { useWallet } from './TempWalletProvider'
import { useUSDC } from '../hooks/useUSDCMock'
import { X, DollarSign, Users, AlertCircle } from 'lucide-react'

interface ContributeModalProps {
  isOpen: boolean
  onClose: () => void
  group: {
    id: string
    name: string
    contributionAmount: number
    participantCount: number
    maxParticipants: number
  }
  onContribute: (groupId: string, amount: number) => Promise<boolean>
}

const ContributeModal: React.FC<ContributeModalProps> = ({
  isOpen,
  onClose,
  group,
  onContribute
}) => {
  const { connected, publicKey } = useWallet()
  const { balance, loading: balanceLoading } = useUSDC()
  const [amount, setAmount] = useState<number>(group.contributionAmount)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleContribute = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first')
      return
    }

    if (amount <= 0) {
      setError('Amount must be greater than 0')
      return
    }

    if (amount > balance) {
      setError('Insufficient USDC balance')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const success = await onContribute(group.id, amount)
      if (success) {
        onClose()
      } else {
        setError('Failed to make contribution')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to make contribution')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Make Contribution</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">{group.name}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Required Amount
              </span>
              <span className="text-white">${group.contributionAmount} USDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Members
              </span>
              <span className="text-white">{group.participantCount}/{group.maxParticipants}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white font-medium mb-2">
            Contribution Amount (USDC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            <button
              onClick={() => setAmount(group.contributionAmount)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 text-sm hover:text-blue-300"
            >
              Required
            </button>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-400">
              Your Balance: {balanceLoading ? '...' : `${balance.toFixed(2)} USDC`}
            </span>
            {amount > balance && (
              <span className="text-red-400">Insufficient funds</span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleContribute}
            className="flex-1 btn-primary"
            disabled={loading || !connected || amount <= 0 || amount > balance}
          >
            {loading ? 'Contributing...' : 'Contribute'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContributeModal