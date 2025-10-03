import { useState, useEffect } from 'react'
import { useWallet } from './MinimalWalletProvider'
import { GroupTier, GROUP_TIER_CONFIGS } from '../lib/CompleteOsemeProgram'
import { usdcStakingService } from '../services/USDCStakingService'
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

interface USDCStakingProps {
  selectedTier: GroupTier
  onStakingComplete: (stakeInfo: any) => void
  onSkip?: () => void
}

const USDCStaking = ({ selectedTier, onStakingComplete, onSkip }: USDCStakingProps) => {
  const { publicKey, connected } = useWallet()
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [stakeInfo, setStakeInfo] = useState<any>(null)

  const tierConfig = GROUP_TIER_CONFIGS[selectedTier]
  const requiredStake = tierConfig.usdcStakeRequirement
  const canEarnYield = tierConfig.marketYieldEnabled

  // Load USDC balance
  useEffect(() => {
    const loadBalance = async () => {
      if (publicKey) {
        try {
          const balance = await usdcStakingService.getUSDCBalance(publicKey.toBase58())
          setUsdcBalance(balance)
        } catch (error) {
          console.error('Failed to load USDC balance:', error)
        }
      }
    }

    loadBalance()
  }, [publicKey])

  // Skip staking if not required for this tier
  if (requiredStake === 0) {
    return null
  }

  const handleStakeUSDC = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    if (usdcBalance < requiredStake) {
      toast.error(`Insufficient USDC balance. You need $${requiredStake} but have $${usdcBalance.toFixed(2)}`)
      return
    }

    setLoading(true)

    try {
      // Simulate USDC staking transaction
      await new Promise(resolve => setTimeout(resolve, 3000))

      const mockStakeInfo = {
        groupId: Math.floor(Math.random() * 1000000),
        trustStakePda: 'mock-trust-stake-pda',
        yieldVaultPda: 'mock-yield-vault-pda',
        stakeAmount: requiredStake,
        canEarnYield,
        estimatedYieldAPY: getEstimatedYield(),
        createdAt: new Date(),
        tx: 'mock-transaction-signature'
      }

      setStakeInfo(mockStakeInfo)
      setUsdcBalance(prev => prev - requiredStake)
      
      toast.success(`Successfully staked $${requiredStake} USDC for ${selectedTier} tier trust!`)
      
      if (onStakingComplete) {
        onStakingComplete(mockStakeInfo)
      }

    } catch (error) {
      console.error('USDC staking failed:', error)
      toast.error('USDC staking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getEstimatedYield = () => {
    switch (selectedTier) {
      case GroupTier.Trust: return 6.2
      case GroupTier.SuperTrust: return 7.8
      case GroupTier.Premium: return 8.9
      default: return 0
    }
  }

  const getYieldStrategies = () => {
    switch (selectedTier) {
      case GroupTier.Trust:
        return [
          { name: 'Marinade Staking', allocation: 60, apy: 6.5 },
          { name: 'Solend Lending', allocation: 40, apy: 5.2 }
        ]
      case GroupTier.SuperTrust:
        return [
          { name: 'Marinade Staking', allocation: 40, apy: 6.5 },
          { name: 'Solend Lending', allocation: 30, apy: 5.2 },
          { name: 'Francium Farming', allocation: 30, apy: 8.1 }
        ]
      case GroupTier.Premium:
        return [
          { name: 'Marinade Staking', allocation: 30, apy: 6.5 },
          { name: 'Solend Lending', allocation: 20, apy: 5.2 },
          { name: 'Francium Farming', allocation: 30, apy: 8.1 },
          { name: 'Port Finance', allocation: 20, apy: 7.8 }
        ]
      default:
        return []
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

  if (!connected) {
    return (
      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg mb-2">Wallet Required</h3>
          <p className="text-gray-400">Please connect your wallet to stake USDC</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Stake USDC for Trust</h1>
        <p className="text-gray-300">
          {selectedTier} tier requires ${requiredStake} USDC stake to verify group creator trust
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">
            USDC Balance: ${usdcBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Staking Overview */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className={`text-white bg-gradient-to-r ${getTierColor(selectedTier)} bg-clip-text text-transparent`}>
            {selectedTier} Trust Stake Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-3xl font-bold text-white">${requiredStake.toLocaleString()}</div>
              <div className="text-sm text-gray-400">USDC Required</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-3xl font-bold text-green-400">{getEstimatedYield()}%</div>
              <div className="text-sm text-gray-400">Est. APY</div>
            </div>
            
            <div className="text-center p-4 bg-white/10 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{tierConfig.cycleDuration}</div>
              <div className="text-sm text-gray-400">Lock Period (Days)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yield Strategies */}
      {canEarnYield && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">🌾 DeFi Yield Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-sm mb-4">
              Your staked USDC will be deployed to these DeFi protocols to earn yield:
            </p>
            <div className="space-y-3">
              {getYieldStrategies().map((strategy, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{strategy.name}</div>
                    <div className="text-gray-400 text-sm">{strategy.allocation}% allocation</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{strategy.apy}% APY</div>
                    <div className="text-gray-400 text-xs">Current rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Stake Display */}
      {stakeInfo && (
        <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              ✅ Trust Stake Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Staked Amount</div>
                <div className="text-white font-semibold">${stakeInfo.stakeAmount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-400">Est. APY</div>
                <div className="text-green-400 font-semibold">{stakeInfo.estimatedYieldAPY}%</div>
              </div>
              <div>
                <div className="text-gray-400">Lock Period</div>
                <div className="text-blue-400 font-semibold">{tierConfig.cycleDuration} days</div>
              </div>
              <div>
                <div className="text-gray-400">Status</div>
                <div className="text-green-400 font-semibold">✅ Earning Yield</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        {!stakeInfo ? (
          <>
            <Button
              onClick={handleStakeUSDC}
              disabled={loading || usdcBalance < requiredStake}
              className={`w-full bg-gradient-to-r ${getTierColor(selectedTier)} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Staking ${requiredStake} USDC...
                </div>
              ) : (
                `Stake $${requiredStake} USDC for ${selectedTier} Trust`
              )}
            </Button>

            {usdcBalance < requiredStake && (
              <div className="text-center text-red-400 text-sm">
                Insufficient USDC balance. You need ${(requiredStake - usdcBalance).toFixed(2)} more USDC.
              </div>
            )}

            {onSkip && (
              <Button
                onClick={onSkip}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4"
              >
                Skip for now (Basic tier only)
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={() => onStakingComplete(stakeInfo)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Continue to Group Creation
          </Button>
        )}
      </div>

      {/* Info Section */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 text-xl">ℹ️</div>
            <div>
              <h3 className="text-blue-400 font-medium mb-1">How Trust Staking Works</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Your USDC stake builds trust and credibility as group creator</li>
                <li>• Staked funds are deployed to DeFi protocols to earn yield</li>
                <li>• You keep all yield earned during the group cycle</li>
                <li>• Stake is returned when group cycle completes successfully</li>
                <li>• Higher stakes unlock better group features and lower fees</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default USDCStaking