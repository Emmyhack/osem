import React, { useState } from 'react'
import { useWallet } from './TempWalletProvider'
import { GroupModel } from '../lib/solana'
import { X, Users, DollarSign, Clock, AlertCircle, Info } from 'lucide-react'

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateGroup: (groupData: {
    name: string
    description: string
    model: GroupModel
    contributionAmount: number
    cycleDays?: number
    memberCap?: number
  }) => Promise<string | null>
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup
}) => {
  const { connected } = useWallet()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: GroupModel.Basic,
    contributionAmount: 100,
    cycleDays: 7,
    memberCap: 10
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected) {
      setError('Please connect your wallet first')
      return
    }

    if (!formData.name.trim()) {
      setError('Group name is required')
      return
    }

    if (formData.contributionAmount <= 0) {
      setError('Contribution amount must be greater than 0')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await onCreateGroup({
        name: formData.name.trim(),
        description: formData.description.trim(),
        model: formData.model,
        contributionAmount: formData.contributionAmount,
        cycleDays: formData.cycleDays,
        memberCap: formData.memberCap
      })

      if (result) {
        // Reset form
        setFormData({
          name: '',
          description: '',
          model: GroupModel.Basic,
          contributionAmount: 100,
          cycleDays: 7,
          memberCap: 10
        })
        onClose()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create group')
    } finally {
      setLoading(false)
    }
  }

  const getModelInfo = (model: GroupModel) => {
    switch (model) {
      case GroupModel.Basic:
        return {
          title: 'Basic Group',
          description: 'Simple rotating savings with no additional features',
          maxMembers: 20,
          cycleDays: 7
        }
      case GroupModel.Trust:
        return {
          title: 'Trust Group',
          description: 'Enhanced features with trust scoring and flexible cycles',
          maxMembers: 50,
          cycleDays: 'Configurable'
        }
      case GroupModel.SuperTrust:
        return {
          title: 'Super Trust Group',
          description: 'Premium features with maximum flexibility and stake bonuses',
          maxMembers: 100,
          cycleDays: 'Fully Configurable'
        }
    }
  }

  if (!isOpen) return null

  const modelInfo = getModelInfo(formData.model)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create Savings Group</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-white font-medium mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your group's purpose"
              rows={3}
            />
          </div>

          {/* Group Model */}
          <div>
            <label className="block text-white font-medium mb-2">
              Group Model
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.values(GroupModel).map((model) => {
                const info = getModelInfo(model)
                return (
                  <div
                    key={model}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      formData.model === model
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => setFormData({ ...formData, model })}
                  >
                    <div className="text-white font-medium mb-1">{info.title}</div>
                    <div className="text-gray-400 text-sm mb-2">{info.description}</div>
                    <div className="text-xs text-gray-500">
                      Max: {info.maxMembers} members
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg flex items-start">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-blue-400 text-sm">
                <strong>{modelInfo.title}:</strong> {modelInfo.description}
              </div>
            </div>
          </div>

          {/* Contribution Amount */}
          <div>
            <label className="block text-white font-medium mb-2">
              Contribution Amount (USDC) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={formData.contributionAmount}
                onChange={(e) => setFormData({ ...formData, contributionAmount: Number(e.target.value) })}
                className="w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Member Cap */}
          <div>
            <label className="block text-white font-medium mb-2">
              Maximum Members
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={formData.memberCap}
                onChange={(e) => setFormData({ ...formData, memberCap: Number(e.target.value) })}
                className="w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10"
                min="2"
                max={modelInfo.maxMembers}
              />
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Max allowed: {modelInfo.maxMembers} for {modelInfo.title}
            </div>
          </div>

          {/* Cycle Days (for Trust/SuperTrust) */}
          {formData.model !== GroupModel.Basic && (
            <div>
              <label className="block text-white font-medium mb-2">
                Cycle Days
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={formData.cycleDays}
                  onChange={(e) => setFormData({ ...formData, cycleDays: Number(e.target.value) })}
                  className="w-full pl-10 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7"
                  min="1"
                  max="30"
                />
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Days between each payout turn (1-30 days)
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading || !connected}
            >
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGroupModal