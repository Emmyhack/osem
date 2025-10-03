import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useWallet } from '../components/MinimalWalletProvider'
import NavigationIntegrated from '../components/NavigationIntegrated'
import Footer from '../components/Footer'

const GroupDetailPageIntegrated = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { connected, publicKey, connect } = useWallet()
  const [group, setGroup] = useState<any>(null)
  const [member, setMember] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contributing, setContributing] = useState(false)
  const [joining, setJoining] = useState(false)
  const [contributionAmount, setContributionAmount] = useState('')

  useEffect(() => {
    const loadGroupData = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        // Mock group data based on ID
        const mockGroupData = {
          id: id,
          name: `Group ${id}`,
          description: 'A community savings group',
          target: 10000,
          raised: 7500,
          members: 25,
          cycle: 30,
          status: 'active',
          creator: publicKey?.toString() || 'Unknown'
        }
        
        const mockMemberData = {
          isJoined: Math.random() > 0.5,
          contributedAmount: 250,
          isCreator: Math.random() > 0.7
        }
        
        setGroup(mockGroupData)
        setMember(mockMemberData)
      } catch (error) {
        console.error('Error loading group:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGroupData()
  }, [id, connected, publicKey])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatGroupModel = (model: any) => {
    if (model?.basic) return 'Basic'
    if (model?.trust) return 'Trust'
    if (model?.superTrust) return 'Super Trust'
    return 'Unknown'
  }

  const handleJoinGroup = async () => {
    if (!connected) {
      await connect()
      return
    }

    if (!connected || !id) return

    setJoining(true)
    try {
      // Mock join group functionality
      console.log('Joining group:', id, 'with wallet:', publicKey?.toString())
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Successfully joined the group!')
      
      // Update member data
      setMember((prev: any) => ({ ...prev, isJoined: true }))
    } catch (error) {
      console.error('Error joining group:', error)
      alert('Error joining group. Please try again.')
    } finally {
      setJoining(false)
    }
  }

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !id || !contributionAmount) return

    setContributing(true)
    try {
      const amount = parseFloat(contributionAmount)
      console.log('Contributing:', amount, 'to group:', id, 'from wallet:', publicKey?.toString())
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Contribution successful!')
      setContributionAmount('')
      
      // Update group data
      setGroup((prev: any) => ({ 
        ...prev, 
        raised: prev.raised + amount 
      }))
      
      // Update member contribution
      setMember((prev: any) => ({ 
        ...prev, 
        contributedAmount: (prev.contributedAmount || 0) + amount 
      }))
    } catch (error) {
      console.error('Error contributing:', error)
      alert('Error making contribution. Please try again.')
    } finally {
      setContributing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <NavigationIntegrated />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 animate-pulse">
            <div className="h-8 bg-white/10 rounded mb-4"></div>
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <NavigationIntegrated />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Group Not Found</h1>
            <p className="text-gray-400 mb-6">The group you're looking for doesn't exist or hasn't been loaded yet.</p>
            <Link
              to="/groups"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              ← Back to Groups
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const totalPool = group.totalPool.toNumber() / 1e6
  const contributionAmountRequired = group.contributionAmount.toNumber() / 1e6
  const progress = Math.min((group.currentTurnIndex / group.totalMembers) * 100, 100)
  const turnStartMs = group.currentTurnStart.toNumber() * 1000
  const cycleDurationMs = group.cycleDays * 24 * 60 * 60 * 1000
  const nextPayoutDate = new Date(turnStartMs + cycleDurationMs)
  const isMember = member !== null
  const canJoin = !isMember && group.totalMembers < group.memberCap

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <NavigationIntegrated />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back Button */}
        <button
          onClick={() => navigate('/groups')}
          className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors"
        >
          ← Back to Groups
        </button>

        {/* Group Header */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-white">
                  {formatGroupModel(group.model)} Group #{group.groupId.toNumber()}
                </h1>
                <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Model</span>
                  <div className="text-white font-semibold">{formatGroupModel(group.model)}</div>
                </div>
                <div>
                  <span className="text-gray-400">Members</span>
                  <div className="text-white font-semibold">{group.totalMembers}/{group.memberCap}</div>
                </div>
                <div>
                  <span className="text-gray-400">Trust Score</span>
                  <div className={`font-semibold ${
                    group.trustScore >= 90 ? 'text-green-400' :
                    group.trustScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {group.trustScore}/100
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Cycle</span>
                  <div className="text-white font-semibold">{group.cycleDays} days</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!connected ? (
                <button
                  onClick={connect}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Connect Wallet
                </button>
              ) : isMember ? (
                <span className="px-6 py-3 bg-green-500/20 text-green-300 rounded-lg font-semibold border border-green-500/30">
                  ✓ Member
                </span>
              ) : canJoin ? (
                <button
                  onClick={handleJoinGroup}
                  disabled={joining}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {joining ? 'Joining...' : 'Join Group'}
                </button>
              ) : (
                <span className="px-6 py-3 bg-gray-500/20 text-gray-400 rounded-lg font-semibold">
                  Group Full
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Group Progress</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Turn</span>
                  <span className="text-white">{group.currentTurnIndex + 1} of {group.totalMembers}</span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">{progress.toFixed(1)}% Complete</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Total Pool</h3>
                  <p className="text-2xl font-bold text-white">{formatCurrency(totalPool)}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Next Payout</h3>
                  <p className="text-lg text-white">{nextPayoutDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Contribution Form */}
            {isMember && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-6">Make Contribution</h2>
                
                <form onSubmit={handleContribute} className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Contribution Amount (USDC)
                    </label>
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      placeholder={contributionAmountRequired.toString()}
                      min="0.01"
                      step="0.01"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      required
                    />
                    <p className="text-gray-400 text-sm mt-1">
                      Required: {formatCurrency(contributionAmountRequired)}
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={contributing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {contributing ? 'Contributing...' : 'Contribute'}
                  </button>
                </form>
              </div>
            )}

            {/* Group Rules */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Group Rules</h2>
              
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <div>
                    <strong>Contribution Schedule:</strong> Each member contributes {formatCurrency(contributionAmountRequired)} every {group.cycleDays} days
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <div>
                    <strong>Payout Order:</strong> Members receive payouts in predetermined order based on join sequence
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <div>
                    <strong>Trust Score:</strong> Missing payments reduces group trust score and individual standing
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">•</span>
                  <div>
                    <strong>Completion:</strong> All members must complete their cycles for successful group completion
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Group Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Group Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Group ID</span>
                  <span className="text-white">#{group.groupId.toNumber()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">
                    {new Date(group.createdAt.toNumber() * 1000).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pool</span>
                  <span className="text-white">{formatCurrency(totalPool)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Per Contribution</span>
                  <span className="text-white">{formatCurrency(contributionAmountRequired)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cycle Duration</span>
                  <span className="text-white">{group.cycleDays} days</span>
                </div>
              </div>
            </div>

            {/* Member Status */}
            {isMember && member && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Your Status</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contributions Made</span>
                    <span className="text-white">{member.contributedTurns.filter(Boolean).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Missed Payments</span>
                    <span className="text-white">{member.missedCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trust Delta</span>
                    <span className={member.trustDelta >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {member.trustDelta > 0 ? '+' : ''}{member.trustDelta}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white">
                      {new Date(member.joinTimestamp.toNumber() * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default GroupDetailPageIntegrated