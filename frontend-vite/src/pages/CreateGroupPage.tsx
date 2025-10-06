import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../hooks/useLightWallet'
import NavigationIntegrated from '../components/NavigationIntegrated'
import Footer from '../components/Footer'

const CreateGroupPage = () => {
  const navigate = useNavigate()
  const { connected, publicKey, connect } = useWallet()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    model: 'basic' as 'basic' | 'trust' | 'superTrust',
    contributionAmount: '',
    cycleDays: '',
    memberCap: '',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) {
      await connect()
      return
    }

    setLoading(true)
    try {
      // Mock group creation - replace with actual Solana program calls later
      const mockGroupId = Math.random().toString(36).substr(2, 9)
      console.log('Group created successfully with ID:', mockGroupId)
      console.log('Form data:', formData)
      console.log('Connected wallet:', publicKey.toString())
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert(`Group created successfully! Group ID: ${mockGroupId}`)
      navigate(`/groups/${mockGroupId}`)
    } catch (error) {
      console.error('Error creating group:', error)
      alert('Error creating group')
    } finally {
      setLoading(false)
    }
  }

  const getModelInfo = (model: string) => {
    const info = {
      basic: {
        title: 'Basic Model',
        description: 'Simple rotating savings group with 7-day cycles.',
        features: ['No stake required', 'Fixed 7-day cycles', 'Up to 20 members', 'Basic features'],
        memberRange: { min: 2, max: 20 }
      },
      trust: {
        title: 'Trust Model',
        description: 'Enhanced group with trust scoring and flexible cycles.',
        features: ['Stake required', 'Flexible cycles', 'Up to 50 members', 'Trust scoring'],
        memberRange: { min: 5, max: 50 }
      },
      superTrust: {
        title: 'Super Trust Model', 
        description: 'Premium model with maximum flexibility and features.',
        features: ['Higher stake required', 'Custom cycles', 'Up to 100 members', 'Advanced features'],
        memberRange: { min: 10, max: 100 }
      }
    }
    return info[model as keyof typeof info]
  }

  const modelInfo = getModelInfo(formData.model)

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Theme with Colorful Stars */}
      <div className="absolute inset-0 stars-background"></div>
      <div className="absolute inset-0 stars-background-large opacity-60"></div>
      <div className="absolute inset-0 grid-large opacity-80"></div>
      <div className="absolute inset-0 grid-background-fine opacity-50"></div>
      
      {/* Subtle Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-transparent to-gray-800/60"></div>
      
      <NavigationIntegrated />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-8 animate-pulse-glow flex items-center justify-center text-3xl">
            🎯
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Create a New{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-gradient">
              Group
            </span>
          </h1>
          <p className="text-gray-300 text-xl">Start building wealth with your community</p>
        </div>

        {!connected ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center animate-fade-in-scale animate-glow">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6 animate-pulse-glow flex items-center justify-center text-2xl">
              🔗
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 animate-slide-in-up">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-8 text-lg animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              You need to connect your wallet to create a group
            </p>
            <button
              onClick={connect}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 animate-glow shadow-lg animate-slide-in-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              🔗 Connect Wallet
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Group Model Selection */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
              <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🏗️</span>
                Group Model
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['basic', 'trust', 'superTrust'] as const).map((model) => {
                  const info = getModelInfo(model)
                  return (
                    <div
                      key={model}
                      className={`p-6 rounded-xl border cursor-pointer transition-all transform hover:scale-105 ${
                        formData.model === model
                          ? 'border-purple-500 bg-purple-500/20 animate-glow'
                          : 'border-white/20 hover:border-white/40 bg-white/5'
                      }`}
                      onClick={() => setFormData({ ...formData, model })}
                    >
                      <h4 className="text-lg font-semibold text-white mb-2">{info.title}</h4>
                      <p className="text-gray-400 text-sm mb-3">{info.description}</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {info.features.map((feature, idx) => (
                          <li key={idx}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Group Configuration */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Group Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Contribution Amount (USDC) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={formData.contributionAmount}
                    onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="100"
                  />
                  <p className="text-gray-400 text-sm mt-1">Amount each member contributes per cycle</p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Member Cap
                  </label>
                  <input
                    type="number"
                    min={modelInfo.memberRange.min}
                    max={modelInfo.memberRange.max}
                    value={formData.memberCap}
                    onChange={(e) => setFormData({ ...formData, memberCap: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder={`${modelInfo.memberRange.min}-${modelInfo.memberRange.max}`}
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Maximum members ({modelInfo.memberRange.min}-{modelInfo.memberRange.max} for {modelInfo.title})
                  </p>
                </div>

                {formData.model !== 'basic' && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Cycle Duration (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={formData.cycleDays}
                      onChange={(e) => setFormData({ ...formData, cycleDays: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="7"
                    />
                    <p className="text-gray-400 text-sm mt-1">Days between payouts (default: 7)</p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-white font-medium mb-2">
                    Group Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                    placeholder="Describe your group's purpose and goals..."
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-white">{modelInfo.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contribution:</span>
                    <span className="text-white">
                      ${formData.contributionAmount || '0'} USDC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Members:</span>
                    <span className="text-white">
                      {formData.memberCap || modelInfo.memberRange.max}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cycle Duration:</span>
                    <span className="text-white">
                      {formData.cycleDays || (formData.model === 'basic' ? '7' : '7')} days
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Pool:</span>
                    <span className="text-white">
                      ${((parseFloat(formData.contributionAmount) || 0) * 
                        (parseInt(formData.memberCap) || modelInfo.memberRange.max)).toLocaleString()} USDC
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee:</span>
                    <span className="text-white">2.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || !formData.contributionAmount}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Group...' : 'Create Group'}
              </button>
              <p className="text-gray-400 text-sm mt-3">
                You'll be prompted to sign the transaction in your wallet
              </p>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default CreateGroupPage