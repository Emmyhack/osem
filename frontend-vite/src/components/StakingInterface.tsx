import { useState, useEffect } from 'react'
import { useWallet } from './MinimalWalletProvider'
// Using existing UI components from the project
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
import { GroupTier, GROUP_TIER_CONFIGS } from '../lib/CompleteOsemeProgram'
import toast from 'react-hot-toast'

interface StakingInterfaceProps {
  groupData: {
    id: number
    tier: GroupTier
    contributionAmount: number
    maxMembers: number
    cycleDuration: number
  }
  onStakingComplete?: () => void
}

interface StakePosition {
  amount: number
  lockedUntil: Date
  rewards: number
  apy: number
}

const StakingInterface = ({ groupData, onStakingComplete }: StakingInterfaceProps) => {
  const { publicKey, connected } = useWallet()
  const [solBalance, setSolBalance] = useState(0)
  const [stakeAmount, setStakeAmount] = useState('')
  const [selectedDuration, setSelectedDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [currentStakes, setCurrentStakes] = useState<StakePosition[]>([])
  const [totalStaked, setTotalStaked] = useState(0)
  const [pendingRewards, setPendingRewards] = useState(0)

  const tierConfig = GROUP_TIER_CONFIGS[groupData.tier]
  const minimumStake = tierConfig.solStakeRequirement

  // Stake duration options with APY rates
  const stakeDurations = [
    { days: 7, apy: 5.2, label: '1 Week' },
    { days: 14, apy: 6.8, label: '2 Weeks' },
    { days: 30, apy: 8.5, label: '1 Month' },
    { days: 60, apy: 10.2, label: '2 Months' },
    { days: 90, apy: 12.0, label: '3 Months' },
    { days: 180, apy: 15.5, label: '6 Months' }
  ]

  // Load user's SOL balance and staking data
  useEffect(() => {
    const loadStakingData = async () => {
      if (publicKey) {
        try {
          // Simulate loading SOL balance
          const balance = Math.random() * 10 + 2 // 2-12 SOL
          setSolBalance(balance)

          // Simulate existing stakes
          const mockStakes: StakePosition[] = [
            {
              amount: 2.5,
              lockedUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
              rewards: 0.12,
              apy: 8.5
            },
            {
              amount: 1.0,
              lockedUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
              rewards: 0.08,
              apy: 10.2
            }
          ]
          setCurrentStakes(mockStakes)
          
          const total = mockStakes.reduce((sum, stake) => sum + stake.amount, 0)
          setTotalStaked(total)
          
          const rewards = mockStakes.reduce((sum, stake) => sum + stake.rewards, 0)
          setPendingRewards(rewards)

        } catch (error) {
          console.error('Failed to load staking data:', error)
        }
      }
    }

    loadStakingData()
  }, [publicKey])

  const handleStake = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    const amount = parseFloat(stakeAmount)
    
    if (amount < minimumStake) {
      toast.error(`Minimum stake for ${groupData.tier} tier is ${minimumStake} SOL`)
      return
    }

    if (amount > solBalance) {
      toast.error(`Insufficient SOL balance. You have ${solBalance.toFixed(2)} SOL`)
      return
    }

    setLoading(true)

    try {
      // Simulate staking transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      const selectedDurationConfig = stakeDurations.find(d => d.days === selectedDuration)!
      const newStake: StakePosition = {
        amount,
        lockedUntil: new Date(Date.now() + selectedDuration * 24 * 60 * 60 * 1000),
        rewards: 0,
        apy: selectedDurationConfig.apy
      }

      setCurrentStakes(prev => [...prev, newStake])
      setTotalStaked(prev => prev + amount)
      setSolBalance(prev => prev - amount)
      setStakeAmount('')

      toast.success(`Successfully staked ${amount} SOL for ${selectedDuration} days!`)
      
      if (onStakingComplete) {
        onStakingComplete()
      }

    } catch (error) {
      console.error('Staking failed:', error)
      toast.error('Staking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnstake = async (stakeIndex: number) => {
    const stake = currentStakes[stakeIndex]
    
    if (stake.lockedUntil > new Date()) {
      toast.error('Stake is still locked. Please wait until the lock period ends.')
      return
    }

    setLoading(true)

    try {
      // Simulate unstaking transaction
      await new Promise(resolve => setTimeout(resolve, 1500))

      setCurrentStakes(prev => prev.filter((_, index) => index !== stakeIndex))
      setTotalStaked(prev => prev - stake.amount)
      setPendingRewards(prev => prev - stake.rewards)
      setSolBalance(prev => prev + stake.amount + stake.rewards)

      toast.success(`Successfully unstaked ${stake.amount} SOL + ${stake.rewards} SOL rewards!`)

    } catch (error) {
      console.error('Unstaking failed:', error)
      toast.error('Unstaking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculateProjectedRewards = () => {
    const amount = parseFloat(stakeAmount) || 0
    const duration = stakeDurations.find(d => d.days === selectedDuration)!
    return (amount * duration.apy / 100 * selectedDuration / 365)
  }

  const getTierColor = (tier: GroupTier) => {
    switch (tier) {
      case GroupTier.Basic: return 'from-green-500 to-emerald-600'
      case GroupTier.Trust: return 'from-blue-500 to-cyan-600'  
      case GroupTier.SuperTrust: return 'from-purple-500 to-violet-600'
      case GroupTier.Premium: return 'from-orange-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Stake SOL to Participate</h1>
        <p className="text-gray-300">
          Stake SOL to join your {groupData.tier} tier group and earn rewards
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-blue-400 text-sm">
            SOL Balance: {solBalance.toFixed(2)} SOL
          </span>
        </div>
      </div>

      {/* Staking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">{totalStaked.toFixed(2)}</div>
            <div className="text-gray-400">Total Staked SOL</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{pendingRewards.toFixed(4)}</div>
            <div className="text-gray-400">Pending Rewards</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/5 border-white/20">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-400">{minimumStake}</div>
            <div className="text-gray-400">Required Stake</div>
          </CardContent>
        </Card>
      </div>

      {/* New Stake Form */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Create New Stake Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stake Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stake Amount (SOL)
            </label>
            <input
              type="number"
              min={minimumStake}
              max={solBalance}
              step="0.1"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={`Min: ${minimumStake} SOL`}
            />
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-gray-400">Available: {solBalance.toFixed(2)} SOL</span>
              <span className="text-gray-400">Min required: {minimumStake} SOL</span>
            </div>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Staking Duration
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stakeDurations.map((duration) => (
                <div
                  key={duration.days}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedDuration === duration.days
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/20 bg-white/5 hover:border-white/30'
                  }`}
                  onClick={() => setSelectedDuration(duration.days)}
                >
                  <div className="text-center">
                    <div className="text-white font-medium">{duration.label}</div>
                    <div className="text-green-400 font-bold">{duration.apy}% APY</div>
                    <div className="text-xs text-gray-400">{duration.days} days</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projected Rewards */}
          {stakeAmount && (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4 border border-green-500/30">
              <h3 className="text-white font-medium mb-2">Projected Rewards</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Stake Amount</div>
                  <div className="text-white font-semibold">{stakeAmount} SOL</div>
                </div>
                <div>
                  <div className="text-gray-400">Est. Rewards</div>
                  <div className="text-green-400 font-semibold">{calculateProjectedRewards().toFixed(4)} SOL</div>
                </div>
              </div>
            </div>
          )}

          {/* Stake Button */}
          <Button
            onClick={handleStake}
            disabled={!connected || loading || !stakeAmount || parseFloat(stakeAmount) < minimumStake}
            className={`w-full bg-gradient-to-r ${getTierColor(groupData.tier)} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Staking {stakeAmount} SOL...
              </div>
            ) : (
              `Stake ${stakeAmount || '0'} SOL`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current Stakes */}
      {currentStakes.length > 0 && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Your Stake Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentStakes.map((stake, index) => {
                const isUnlocked = stake.lockedUntil <= new Date()
                const daysRemaining = Math.max(0, Math.ceil((stake.lockedUntil.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
                
                return (
                  <div key={index} className="p-4 bg-white/10 rounded-lg border border-white/20">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-white font-semibold">{stake.amount} SOL</div>
                            <div className="text-sm text-gray-400">Staked Amount</div>
                          </div>
                          <div>
                            <div className="text-green-400 font-semibold">{stake.rewards.toFixed(4)} SOL</div>
                            <div className="text-sm text-gray-400">Rewards Earned</div>
                          </div>
                          <div>
                            <div className="text-blue-400 font-semibold">{stake.apy}%</div>
                            <div className="text-sm text-gray-400">APY</div>
                          </div>
                        </div>
                        
                        <div className={`text-sm ${isUnlocked ? 'text-green-400' : 'text-orange-400'}`}>
                          {isUnlocked ? '🟢 Ready to unstake' : `🟡 Locked for ${daysRemaining} more days`}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleUnstake(index)}
                        disabled={!isUnlocked || loading}
                        size="sm"
                        className={`${
                          isUnlocked 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-gray-500 cursor-not-allowed'
                        } text-white`}
                      >
                        {isUnlocked ? 'Unstake' : `${daysRemaining}d left`}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staking Benefits */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">🎯 Staking Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-white font-medium">Group Participation</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Access to savings group with tier benefits
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Voting rights on group decisions
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-green-400">✓</span>
                  Priority in payout cycles
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-white font-medium">Additional Rewards</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  Earn SOL rewards while participating
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  Compound rewards automatically
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-purple-400">✓</span>
                  Unlock higher tier benefits over time
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StakingInterface