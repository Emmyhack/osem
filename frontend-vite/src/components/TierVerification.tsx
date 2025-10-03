import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { GroupTier, TierVerificationService, UserProfile as ImportedUserProfile } from '../lib/CompleteOsemeProgram'
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

// Use the imported UserProfile type
type UserProfile = ImportedUserProfile

interface TierVerificationProps {
  selectedTier: GroupTier
  onVerificationComplete: (verified: boolean) => void
  onTierChange: (tier: GroupTier) => void
}

const TierVerification = ({ selectedTier, onVerificationComplete, onTierChange }: TierVerificationProps) => {
  const { publicKey, connected } = useWallet()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [verificationSteps, setVerificationSteps] = useState<any[]>([])

  // Load user profile and check tier eligibility
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!publicKey) return

      // Mock user profile - in production this would come from your backend/blockchain
      const mockProfile: UserProfile = {
        address: publicKey.toBase58(),
        kycVerified: false,
        socialMediaVerified: false,
        creditScore: 720,
        institutionalBacking: false,
        accreditedInvestor: false,
        legalEntity: false,
        trustScore: 650,
        hasStakingHistory: false,
        verificationLevel: GroupTier.Basic
      }

      setUserProfile(mockProfile)
      await checkTierEligibility(mockProfile)
    }

    loadUserProfile()
  }, [publicKey, selectedTier])

  const checkTierEligibility = async (profile: UserProfile) => {
    if (!profile) return

    try {
      const eligibilityCheck = await TierVerificationService.checkTierEligibility(selectedTier, profile)
      setVerificationStatus(eligibilityCheck)

      if (eligibilityCheck.eligible) {
        onVerificationComplete(true)
        toast.success(`You're eligible for ${selectedTier} tier!`)
      } else {
        onVerificationComplete(false)
        
        // Initiate verification flow for missing requirements
        const verificationFlow = await TierVerificationService.initiateVerificationFlow(
          selectedTier, 
          profile.address
        )
        setVerificationSteps(verificationFlow.steps)
      }
    } catch (error) {
      console.error('Tier eligibility check failed:', error)
      toast.error('Failed to check tier eligibility')
    }
  }

  const handleVerificationStep = async (stepType: string) => {
    if (!userProfile) return

    setLoading(true)
    
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update user profile based on step
      const updatedProfile = { ...userProfile }
      
      switch (stepType) {
        case 'kyc':
          updatedProfile.kycVerified = true
          toast.success('KYC verification completed!')
          break
        case 'social':
          updatedProfile.socialMediaVerified = true
          toast.success('Social media verification completed!')
          break
        case 'credit':
          updatedProfile.creditScore = 750
          toast.success('Credit score verified!')
          break
        case 'institutional':
          updatedProfile.institutionalBacking = true
          toast.success('Institutional backing verified!')
          break
        case 'accredited':
          updatedProfile.accreditedInvestor = true
          toast.success('Accredited investor status verified!')
          break
        case 'entity':
          updatedProfile.legalEntity = true
          toast.success('Legal entity status verified!')
          break
      }

      setUserProfile(updatedProfile)
      
      // Update verification steps
      setVerificationSteps(prev => 
        prev.map(step => 
          step.type === stepType 
            ? { ...step, status: 'completed', completedAt: new Date() }
            : step
        )
      )

      // Recheck eligibility
      await checkTierEligibility(updatedProfile)

    } catch (error) {
      console.error('Verification step failed:', error)
      toast.error(`${stepType} verification failed`)
    } finally {
      setLoading(false)
    }
  }

  const getStepIcon = (stepType: string) => {
    switch (stepType) {
      case 'kyc': return '🆔'
      case 'social': return '📱'
      case 'credit': return '💳'
      case 'institutional': return '🏢'
      case 'accredited': return '💼'
      case 'entity': return '⚖️'
      default: return '✅'
    }
  }

  const getStepStatus = (status: string) => {
    switch (status) {
      case 'completed': return { color: 'text-green-400', icon: '✅' }
      case 'in_progress': return { color: 'text-yellow-400', icon: '⏳' }
      case 'failed': return { color: 'text-red-400', icon: '❌' }
      default: return { color: 'text-gray-400', icon: '⭕' }
    }
  }

  const getTierColor = (tier: GroupTier) => {
    switch (tier) {
      case GroupTier.Basic: return 'from-green-500 to-emerald-600'
      case GroupTier.Trust: return 'from-blue-500 to-cyan-600'
      case GroupTier.SuperTrust: return 'from-purple-500 to-violet-600'
      case GroupTier.Premium: return 'from-orange-500 to-red-600'
    }
  }

  if (!connected || !userProfile) {
    return (
      <Card className="bg-white/5 border-white/20">
        <CardContent className="p-6 text-center">
          <h3 className="text-white text-lg mb-2">Wallet Required</h3>
          <p className="text-gray-400">Please connect your wallet to verify tier eligibility</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tier Requirements Overview */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className={`text-white bg-gradient-to-r ${getTierColor(selectedTier)} bg-clip-text text-transparent`}>
            {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Tier Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verificationStatus && (
            <div className="mb-4">
              {verificationStatus.eligible ? (
                <div className="flex items-center gap-2 text-green-400">
                  <span className="text-xl">✅</span>
                  <span>You meet all requirements for {selectedTier} tier!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-400">
                  <span className="text-xl">⚠️</span>
                  <span>Additional verification required for {selectedTier} tier</span>
                </div>
              )}
            </div>
          )}

          {/* Current Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className={`text-xl mb-1 ${userProfile.kycVerified ? 'text-green-400' : 'text-gray-400'}`}>
                {userProfile.kycVerified ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-400">KYC Verified</div>
            </div>
            
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className={`text-xl mb-1 ${userProfile.socialMediaVerified ? 'text-green-400' : 'text-gray-400'}`}>
                {userProfile.socialMediaVerified ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-400">Social Verified</div>
            </div>
            
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold text-white mb-1">
                {userProfile.trustScore}
              </div>
              <div className="text-xs text-gray-400">Trust Score</div>
            </div>
            
            <div className="text-center p-3 bg-white/10 rounded-lg">
              <div className="text-lg font-bold text-white mb-1">
                {userProfile.creditScore || 'N/A'}
              </div>
              <div className="text-xs text-gray-400">Credit Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      {verificationSteps.length > 0 && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Complete Verification Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationSteps.map((step) => {
                const status = getStepStatus(step.status)
                
                return (
                  <div key={step.type} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{getStepIcon(step.type)}</div>
                      <div>
                        <h3 className="text-white font-medium">{step.title}</h3>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                        <p className="text-gray-500 text-xs">Est. time: {step.estimatedTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`${status.color} text-xl`}>{status.icon}</span>
                      
                      {step.status === 'pending' && (
                        <Button
                          onClick={() => handleVerificationStep(step.type)}
                          disabled={loading}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Verifying...
                            </div>
                          ) : (
                            'Start Verification'
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Alternative Tier Suggestion */}
            {verificationStatus && !verificationStatus.eligible && (
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <h3 className="text-yellow-400 font-medium mb-2">Consider a Different Tier</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Based on your current verification status, you might want to start with a lower tier:
                </p>
                
                <div className="flex gap-2">
                  {selectedTier !== GroupTier.Basic && (
                    <Button
                      onClick={() => onTierChange(GroupTier.Basic)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2"
                    >
                      Switch to Basic Tier
                    </Button>
                  )}
                  
                  {selectedTier === GroupTier.SuperTrust && (
                    <Button
                      onClick={() => onTierChange(GroupTier.Trust)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2"
                    >
                      Switch to Trust Tier
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tier Benefits Reminder */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
        <CardContent className="p-4">
          <h3 className="text-white font-medium mb-2">
            Why Upgrade to {selectedTier} Tier? 
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="text-gray-300">
              <span className="text-green-400">✓</span> Higher insurance coverage
            </div>
            <div className="text-gray-300">
              <span className="text-green-400">✓</span> Better yield optimization
            </div>
            <div className="text-gray-300">
              <span className="text-green-400">✓</span> Lower platform fees
            </div>
            <div className="text-gray-300">
              <span className="text-green-400">✓</span> Priority support
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TierVerification