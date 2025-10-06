import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useLightWallet'
import { GroupTier } from '../lib/CompleteOsemeProgram'
import Navigation from './Navigation'
import toast from 'react-hot-toast'

// UI Components
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`rounded-lg border ${className}`} {...props}>{children}</div>
)
const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>
)
const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>
)
const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-2 ${className}`} {...props}>{children}</div>
)
const Button = ({ children, className = '', disabled = false, onClick, size, ...props }: any) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${
      size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2'
    } ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
)
const Badge = ({ children, className = '', ...props }: any) => (
  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`} {...props}>
    {children}
  </div>
)

interface StakePosition {
  id: string
  groupId?: string
  tier: GroupTier
  stakeAmount: number
  currentValue: number
  yieldEarned: number
  yieldAPY: number
  createdAt: Date
  lockEndDate: Date
  status: 'active' | 'locked' | 'withdrawable' | 'completed'
  strategies: Array<{
    name: string
    allocation: number
    currentAPY: number
    value: number
  }>
}

const StakingDashboard = () => {
  const { publicKey, connected } = useWallet()
  const [stakes, setStakes] = useState<StakePosition[]>([])
  const [loading, setLoading] = useState(false)
  const [totalStaked, setTotalStaked] = useState(0)
  const [totalYieldEarned, setTotalYieldEarned] = useState(0)
  const [selectedStake, setSelectedStake] = useState<StakePosition | null>(null)

  // Load user's staking positions
  useEffect(() => {
    const loadStakes = async () => {
      if (!connected || !publicKey) return

      setLoading(true)
      try {
        // Simulate loading stakes - replace with actual blockchain calls
        const mockStakes: StakePosition[] = [
          {
            id: 'stake-1',
            groupId: 'group-123',
            tier: GroupTier.Trust,
            stakeAmount: 500,
            currentValue: 523.45,
            yieldEarned: 23.45,
            yieldAPY: 6.2,
            createdAt: new Date('2024-01-15'),
            lockEndDate: new Date('2024-04-15'),
            status: 'active',
            strategies: [
              { name: 'Marinade Staking', allocation: 60, currentAPY: 6.5, value: 314.07 },
              { name: 'Solend Lending', allocation: 40, currentAPY: 5.2, value: 209.38 }
            ]
          },
          {
            id: 'stake-2',
            tier: GroupTier.SuperTrust,
            stakeAmount: 2500,
            currentValue: 2687.23,
            yieldEarned: 187.23,
            yieldAPY: 7.8,
            createdAt: new Date('2024-02-01'),
            lockEndDate: new Date('2024-05-01'),
            status: 'active',
            strategies: [
              { name: 'Marinade Staking', allocation: 40, currentAPY: 6.5, value: 1074.89 },
              { name: 'Solend Lending', allocation: 30, currentAPY: 5.2, value: 806.17 },
              { name: 'Francium Farming', allocation: 30, currentAPY: 8.1, value: 806.17 }
            ]
          }
        ]

        setStakes(mockStakes)
        setTotalStaked(mockStakes.reduce((sum, stake) => sum + stake.stakeAmount, 0))
        setTotalYieldEarned(mockStakes.reduce((sum, stake) => sum + stake.yieldEarned, 0))

      } catch (error) {
        console.error('Failed to load stakes:', error)
        toast.error('Failed to load staking positions')
      } finally {
        setLoading(false)
      }
    }

    loadStakes()
  }, [connected, publicKey])

  const handleWithdraw = async (stake: StakePosition) => {
    if (stake.status !== 'withdrawable') {
      toast.error('Stake is still locked or active in group')
      return
    }

    setLoading(true)
    try {
      // Simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`Successfully withdrew ${stake.currentValue.toFixed(2)} USDC`)
      
      // Remove from stakes
      setStakes(prev => prev.filter(s => s.id !== stake.id))
      
    } catch (error) {
      console.error('Withdrawal failed:', error)
      toast.error('Withdrawal failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier: GroupTier) => {
    switch (tier) {
      case GroupTier.Trust: return 'from-blue-500 to-cyan-600'
      case GroupTier.SuperTrust: return 'from-purple-500 to-violet-600'
      case GroupTier.Premium: return 'from-orange-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status: StakePosition['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'locked': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'withdrawable': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Dark Theme with Colorful Stars */}
        <div className="absolute inset-0 stars-background"></div>
        <div className="absolute inset-0 stars-background-large opacity-60"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="absolute inset-0 grid-background-fine opacity-40"></div>
        <div className="absolute inset-0 grid-dots opacity-20"></div>
        
        {/* Subtle Dark Overlays for Depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30"></div>
        
        <Navigation />
        
        <div className="max-w-4xl mx-auto pt-20 relative z-10 p-6">
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
              <p className="text-gray-400">Please connect your wallet to view your staking dashboard</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Theme with Colorful Stars */}
      <div className="absolute inset-0 stars-background"></div>
      <div className="absolute inset-0 stars-background-large opacity-60"></div>
      <div className="absolute inset-0 grid-background"></div>
      <div className="absolute inset-0 grid-background-fine opacity-40"></div>
      <div className="absolute inset-0 grid-dots opacity-20"></div>
      
      {/* Subtle Dark Overlays for Depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30"></div>
      
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 relative z-10 p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Staking Dashboard</h1>
          <p className="text-gray-300">Manage your USDC trust stakes and track yield earnings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-1">
                ${totalStaked.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Total Staked</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">
                ${totalYieldEarned.toFixed(2)}
              </div>
              <div className="text-gray-400 text-sm">Total Yield Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">
                {stakes.length}
              </div>
              <div className="text-gray-400 text-sm">Active Stakes</div>
            </CardContent>
          </Card>
        </div>

        {/* Stakes List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : stakes.length === 0 ? (
            <Card className="bg-white/5 border-white/20">
              <CardContent className="p-8 text-center">
                <div className="text-gray-400 text-lg mb-4">No staking positions found</div>
                <p className="text-gray-500">Create a Trust or SuperTrust group to start staking USDC</p>
              </CardContent>
            </Card>
          ) : (
            stakes.map((stake) => (
              <Card key={stake.id} className="bg-white/5 border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className={`bg-gradient-to-r ${getTierColor(stake.tier)} bg-clip-text text-transparent`}>
                      {stake.tier} Tier Stake
                      {stake.groupId && (
                        <span className="ml-2 text-gray-400 text-sm">
                          Group #{stake.groupId}
                        </span>
                      )}
                    </CardTitle>
                    <Badge className={getStatusColor(stake.status)}>
                      {stake.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Stake Details */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Staked Amount</div>
                          <div className="text-xl font-bold text-white">
                            ${stake.stakeAmount.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Current Value</div>
                          <div className="text-xl font-bold text-green-400">
                            ${stake.currentValue.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Yield Earned</div>
                          <div className="text-lg font-semibold text-green-400">
                            +${stake.yieldEarned.toFixed(2)}
                          </div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">Current APY</div>
                          <div className="text-lg font-semibold text-blue-400">
                            {stake.yieldAPY}%
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/10 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Lock Period</span>
                          <span className="text-sm text-white">
                            {getDaysRemaining(stake.lockEndDate)} days remaining
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ 
                              width: `${Math.max(10, 100 - (getDaysRemaining(stake.lockEndDate) / 90) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Yield Strategies */}
                    <div>
                      <h4 className="text-white font-medium mb-3">DeFi Yield Strategies</h4>
                      <div className="space-y-2">
                        {stake.strategies.map((strategy, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                            <div>
                              <div className="text-white text-sm font-medium">{strategy.name}</div>
                              <div className="text-gray-400 text-xs">{strategy.allocation}% allocation</div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 text-sm font-semibold">
                                {strategy.currentAPY}% APY
                              </div>
                              <div className="text-gray-300 text-xs">
                                ${strategy.value.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    {stake.status === 'withdrawable' && (
                      <Button
                        onClick={() => handleWithdraw(stake)}
                        disabled={loading}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
                      >
                        {loading ? 'Withdrawing...' : 'Withdraw'}
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => setSelectedStake(stake)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                    >
                      View Details
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Stake Details Modal */}
        {selectedStake && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="bg-gray-900 border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Stake Details</CardTitle>
                  <Button
                    onClick={() => setSelectedStake(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Stake ID:</span>
                      <div className="text-white font-mono">{selectedStake.id}</div>
                    </div>
                    {selectedStake.groupId && (
                      <div>
                        <span className="text-gray-400">Group ID:</span>
                        <div className="text-white font-mono">{selectedStake.groupId}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <div className="text-white">{selectedStake.createdAt.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Lock End:</span>
                      <div className="text-white">{selectedStake.lockEndDate.toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <h5 className="text-white font-medium mb-2">Yield History</h5>
                    <div className="text-gray-400 text-sm">
                      Yield tracking and detailed analytics coming soon...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}

export default StakingDashboard