import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useLightWallet'
// Using existing UI components from the project
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`roun                  <div className="flex justify-between">
                    <span className="text-gray-400">Cycle Duration:</span>
                    <span className="text-white">{config.cycleDuration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stake Required:</span>
                    <span className="text-white">{config.solStakeRequirement} SOL</span>
                  </div>r ${className}`} {...props}>{children}</div>
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
const Button = ({ children, className = '', disabled = false, onClick, ...props }: any) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
)
import { GroupTier, GROUP_TIER_CONFIGS } from '../lib/CompleteOsemeProgram'
import { solanaFiatService } from '../services/SolanaFiatOnRampService'
import TierVerification from './TierVerification'
import USDCStaking from './USDCStaking'
import toast from 'react-hot-toast'

interface GroupCreationProps {
  onGroupCreated?: (groupData: any) => void
}

const GroupCreation = ({ onGroupCreated }: GroupCreationProps) => {
  const { publicKey, connected } = useWallet()
  const [selectedTier, setSelectedTier] = useState<GroupTier>(GroupTier.Basic)
  const [customContribution, setCustomContribution] = useState('')
  const [cycleDuration, setCycleDuration] = useState(30)
  const [maxMembers, setMaxMembers] = useState(20)
  const [loading, setLoading] = useState(false)
  const [userBalance, setUserBalance] = useState(0)
  const [tierVerified, setTierVerified] = useState(false)
  const [currentStep, setCurrentStep] = useState<'tier-selection' | 'verification' | 'staking' | 'group-details'>('tier-selection')
  const [stakeInfo, setStakeInfo] = useState<any>(null)

  // Load user's USDC balance
  useEffect(() => {
    const loadBalance = async () => {
      if (publicKey) {
        try {
          const balance = await solanaFiatService.getUSDCBalance(publicKey.toBase58())
          setUserBalance(balance)
        } catch (error) {
          console.error('Failed to load balance:', error)
        }
      }
    }

    loadBalance()
  }, [publicKey])

  // Update form when tier changes
  useEffect(() => {
    const config = GROUP_TIER_CONFIGS[selectedTier]
    setCustomContribution(config.minContribution.toString())
    setCycleDuration(config.cycleDuration)
    setMaxMembers(config.maxMembers)
    
    // Reset verification and staking states
    setTierVerified(false)
    setStakeInfo(null)
    
    // Determine the flow based on tier requirements
    if (selectedTier === GroupTier.Basic) {
      setCurrentStep('group-details')
      setTierVerified(true)
    } else {
      // Start with tier selection, then move to staking or verification
      setCurrentStep('tier-selection')
    }
  }, [selectedTier])

  // Handle staking completion
  const handleStakingComplete = (stakingData: any) => {
    setStakeInfo(stakingData)
    
    // Check if verification is needed based on tier type (non-Basic tiers typically require verification)
    if (selectedTier !== GroupTier.Basic) {
      setCurrentStep('verification')
    } else {
      setCurrentStep('group-details')
      setTierVerified(true)
    }
  }

  const handleCreateGroup = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    const config = GROUP_TIER_CONFIGS[selectedTier]
    const contributionAmount = parseFloat(customContribution)

    // Validate inputs
    if (contributionAmount < config.minContribution) {
      toast.error(`Minimum contribution for ${selectedTier} tier is $${config.minContribution}`)
      return
    }

    if (contributionAmount > userBalance && userBalance > 0) {
      toast.error(`Insufficient balance. You have $${userBalance.toFixed(2)} USDC`)
      return
    }

    setLoading(true)

    try {
      // Simulate group creation (in real implementation, this would call the Solana program)
      const groupData = {
        id: Math.floor(Math.random() * 1000000),
        tier: selectedTier,
        creator: publicKey.toBase58(),
        contributionAmount,
        maxMembers,
        cycleDuration,
        config,
        createdAt: new Date(),
        currentMembers: 1,
        isActive: true
      }

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success(`${selectedTier} group created successfully!`)
      
      if (onGroupCreated) {
        onGroupCreated(groupData)
      }

      // Reset form
      setCustomContribution(config.minContribution.toString())
      
    } catch (error) {
      console.error('Group creation failed:', error)
      toast.error('Failed to create group. Please try again.')
    } finally {
      setLoading(false)
    }
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

  const getTierIcon = (tier: GroupTier) => {
    switch (tier) {
      case GroupTier.Basic: return '🌱'
      case GroupTier.Trust: return '🛡️'
      case GroupTier.SuperTrust: return '👑'
      case GroupTier.Premium: return '💎'
      default: return '📦'
    }
  }

  const calculateEstimatedFees = () => {
    const amount = parseFloat(customContribution) || 0
    return amount * 0.025 // 2.5% platform fee
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Create New Savings Group</h1>
        <p className="text-gray-300 text-lg">
          Choose your group tier and start building financial security with friends
        </p>
        {connected && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">
              USDC Balance: ${userBalance.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Tier Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(GroupTier).map((tier) => {
          const config = GROUP_TIER_CONFIGS[tier]
          const isSelected = selectedTier === tier
          
          return (
            <Card 
              key={tier}
              className={`relative cursor-pointer transition-all duration-300 border-2 ${
                isSelected 
                  ? 'border-purple-500 bg-purple-500/10 scale-105' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
              }`}
              onClick={() => setSelectedTier(tier)}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getTierColor(tier)} flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{getTierIcon(tier)}</span>
                </div>
                <CardTitle className="text-center text-white capitalize">
                  {tier} Tier
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    ${config.minContribution}+
                  </div>
                  <div className="text-sm text-gray-400">Min Contribution</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Members:</span>
                    <span className="text-white">{config.maxMembers}</span>
                  </div>
                  <div className="flex justify-between">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stake Required:</span>
                    <span className="text-white">{config.solStakeRequirement} SOL</span>
                  </div>
                    <span className="text-gray-400">Stake Required:</span>
                    <span className="text-white">{config.solStakeRequirement} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Insurance:</span>
                    <span className="text-white">${config.insuranceCoverage.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-white/10">
                  <div className="text-xs text-gray-400 mb-2">Features:</div>
                  <div className="space-y-1">
                    {config.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-gray-300">
                        <span className="text-green-400">•</span>
                        {feature}
                      </div>
                    ))}
                    {config.features.length > 2 && (
                      <div className="text-xs text-purple-400">
                        +{config.features.length - 2} more features
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Configuration Form */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {getTierIcon(selectedTier)} Configure Your {selectedTier} Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contribution Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contribution Amount (USDC)
              </label>
              <input
                type="number"
                min={GROUP_TIER_CONFIGS[selectedTier].minContribution}
                value={customContribution}
                onChange={(e) => setCustomContribution(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={`Min: $${GROUP_TIER_CONFIGS[selectedTier].minContribution}`}
              />
              <div className="mt-1 text-xs text-gray-400">
                Estimated fees: ${calculateEstimatedFees().toFixed(2)}
              </div>
            </div>

            {/* Cycle Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cycle Duration (Days)
              </label>
              <select
                value={cycleDuration}
                onChange={(e) => setCycleDuration(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Maximum Members
              </label>
              <select
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {[...Array(GROUP_TIER_CONFIGS[selectedTier].maxMembers)].map((_, i) => (
                  <option key={i + 2} value={i + 2}>{i + 2} members</option>
                ))}
              </select>
            </div>
          </div>

          {/* Features Preview */}
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3">Your Group Will Include:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GROUP_TIER_CONFIGS[selectedTier].features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-green-400">✅</span>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-4 border border-purple-500/30">
            <h3 className="text-white font-medium mb-3">Group Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Tier</div>
                <div className="text-white font-semibold capitalize">{selectedTier}</div>
              </div>
              <div>
                <div className="text-gray-400">Contribution</div>
                <div className="text-green-400 font-semibold">${customContribution}</div>
              </div>
              <div>
                <div className="text-gray-400">Cycle</div>
                <div className="text-blue-400 font-semibold">{cycleDuration} days</div>
              </div>
              <div>
                <div className="text-gray-400">Max Members</div>
                <div className="text-purple-400 font-semibold">{maxMembers}</div>
              </div>
            </div>
          </div>

          {/* Multi-Step Flow */}
          {currentStep === 'staking' && (
            <USDCStaking
              selectedTier={selectedTier}
              onStakingComplete={handleStakingComplete}
              onSkip={() => setCurrentStep('verification')}
            />
          )}

          {currentStep === 'verification' && (
            <TierVerification
              selectedTier={selectedTier}
              onVerificationComplete={(verified) => {
                setTierVerified(verified)
                if (verified) {
                  setCurrentStep('group-details')
                }
              }}
              onTierChange={setSelectedTier}
            />
          )}

          {/* Action Buttons - only show for group-details step */}
          {currentStep === 'group-details' && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleCreateGroup}
                disabled={!connected || loading || !tierVerified}
                className={`flex-1 bg-gradient-to-r ${getTierColor(selectedTier)} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Group...
                  </div>
                ) : (
                  `Create ${selectedTier} Group`
                )}
              </Button>
              
              {!connected && (
                <div className="text-center text-gray-400 text-sm">
                  Please connect your wallet to create a group
                </div>
              )}
              
              {stakeInfo && (
                <div className="text-center text-green-400 text-sm">
                  ✅ USDC Trust Stake: ${stakeInfo.stakeAmount} (Earning {stakeInfo.estimatedYieldAPY}% APY)
                </div>
              )}
            </div>
          )}
          {/* Step Progress Indicator */}
          {selectedTier !== GroupTier.Basic && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${currentStep === 'tier-selection' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <div className="text-gray-400 text-sm">Tier Selection</div>
                
                {GROUP_TIER_CONFIGS[selectedTier].usdcStakeRequirement > 0 && (
                  <>
                    <div className="w-8 h-0.5 bg-gray-600"></div>
                    <div className={`w-3 h-3 rounded-full ${currentStep === 'staking' ? 'bg-blue-500' : currentStep === 'verification' || currentStep === 'group-details' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <div className="text-gray-400 text-sm">USDC Staking</div>
                  </>
                )}
                
                <>
                  <div className="w-8 h-0.5 bg-gray-600"></div>
                  <div className={`w-3 h-3 rounded-full ${currentStep === 'verification' ? 'bg-blue-500' : currentStep === 'group-details' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  <div className="text-gray-400 text-sm">Verification</div>
                </>
                
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className={`w-3 h-3 rounded-full ${currentStep === 'group-details' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                <div className="text-gray-400 text-sm">Group Details</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">💡 How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 text-xl">1️⃣</span>
              </div>
              <h3 className="text-white font-medium mb-2">Create Group</h3>
              <p className="text-gray-400">
                Set your contribution amount, cycle duration, and invite friends to join your savings circle.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 text-xl">2️⃣</span>
              </div>
              <h3 className="text-white font-medium mb-2">Members Contribute</h3>
              <p className="text-gray-400">
                Each member contributes the agreed amount every cycle. Funds are automatically managed and optimized.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 text-xl">3️⃣</span>
              </div>
              <h3 className="text-white font-medium mb-2">Receive Payouts</h3>
              <p className="text-gray-400">
                Members take turns receiving the full pot each cycle, plus any yield generated from DeFi strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GroupCreation