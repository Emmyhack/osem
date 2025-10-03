import React, { useState } from 'react'
import { X, Users, DollarSign, Calendar, Shield } from 'lucide-react'
import { GroupModel } from '../lib/solana'

interface CreateGroupFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateGroupData) => Promise<void>
}

interface CreateGroupData {
  name: string
  description: string
  model: GroupModel
  contributionAmount: number
  cycleDays?: number
  memberCap?: number
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateGroupData>({
    name: '',
    description: '',
    model: GroupModel.Basic,
    contributionAmount: 100,
    cycleDays: 7,
    memberCap: 10,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      onClose()
      setFormData({
        name: '',
        description: '',
        model: GroupModel.Basic,
        contributionAmount: 100,
        cycleDays: 7,
        memberCap: 10,
      })
    } catch (error) {
      console.error('Error creating group:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const modelOptions = [
    {
      value: GroupModel.Basic,
      label: 'Basic',
      description: 'Free model with 7-day cycles, up to 10 members',
      icon: Users,
    },
    {
      value: GroupModel.Trust,
      label: 'Trust',
      description: 'Premium model with flexible cycles, requires stake',
      icon: Shield,
    },
    {
      value: GroupModel.SuperTrust,
      label: 'Super Trust',
      description: 'Advanced model for large groups, enhanced features',
      icon: Shield,
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Create New Group</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter group name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe your group's purpose and goals"
            />
          </div>

          {/* Group Model */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Group Model *
            </label>
            <div className="grid gap-4">
              {modelOptions.map((option) => {
                const Icon = option.icon
                return (
                  <label
                    key={option.value}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.model === option.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      value={option.value}
                      checked={formData.model === option.value}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value as GroupModel })}
                      className="sr-only"
                    />
                    <Icon className="w-6 h-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-white">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.description}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Contribution Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Contribution Amount (USDC) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.contributionAmount}
              onChange={(e) => setFormData({ ...formData, contributionAmount: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
            />
          </div>

          {/* Advanced Options */}
          {formData.model !== GroupModel.Basic && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Cycle Days
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formData.cycleDays}
                  onChange={(e) => setFormData({ ...formData, cycleDays: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Maximum Members
                </label>
                <input
                  type="number"
                  min="2"
                  max={formData.model === GroupModel.SuperTrust ? 100 : 50}
                  value={formData.memberCap}
                  onChange={(e) => setFormData({ ...formData, memberCap: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? 'Creating...' : 'Create Group'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGroupForm