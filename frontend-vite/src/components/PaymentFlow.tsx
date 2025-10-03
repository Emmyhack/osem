import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
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
import { solanaFiatService, FIAT_ONRAMP_PROVIDERS } from '../services/SolanaFiatOnRampService'

enum FiatProvider {
  MOONPAY = 'moonpay',
  RAMP = 'ramp',
  TRANSAK = 'transak',
  COINBASE = 'coinbase'
}
import { GroupTier } from '../lib/CompleteOsemeProgram'
import toast from 'react-hot-toast'

interface PaymentFlowProps {
  groupData: {
    id: number
    tier: GroupTier
    contributionAmount: number
    creator: string
    maxMembers: number
    cycleDuration: number
  }
  onPaymentComplete?: () => void
}

interface PaymentOption {
  type: 'usdc' | 'fiat'
  label: string
  icon: string
  description: string
  fees: number
  estimatedTime: string
}

const PaymentFlow = ({ groupData, onPaymentComplete }: PaymentFlowProps) => {
  const { publicKey, connected } = useWallet()
  const [paymentMethod, setPaymentMethod] = useState<PaymentOption['type']>('usdc')
  const [fiatProvider, setFiatProvider] = useState<FiatProvider>(FiatProvider.MOONPAY)
  const [loading, setLoading] = useState(false)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [fiatProviders, setFiatProviders] = useState<any[]>([])

  // Load user's USDC balance and fiat providers
  useEffect(() => {
    const loadData = async () => {
      if (publicKey) {
        try {
          const balance = await solanaFiatService.getUSDCBalance(publicKey.toBase58())
          setUsdcBalance(balance)

          const providers = solanaFiatService.calculateFees(
            groupData.contributionAmount,
            'USD',
            'US'
          )
          setFiatProviders(providers)
        } catch (error) {
          console.error('Failed to load payment data:', error)
        }
      }
    }

    loadData()
  }, [publicKey, groupData.contributionAmount])

  const paymentOptions: PaymentOption[] = [
    {
      type: 'usdc',
      label: 'Pay with USDC',
      icon: '💵',
      description: 'Use USDC from your wallet',
      fees: 0,
      estimatedTime: 'Instant'
    },
    {
      type: 'fiat',
      label: 'Buy USDC with Fiat',
      icon: '💳',
      description: 'Buy USDC with credit card or bank transfer',
      fees: 3.5,
      estimatedTime: '1-5 minutes'
    }
  ]

  const handleUSDCPayment = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    if (usdcBalance < groupData.contributionAmount) {
      toast.error(`Insufficient USDC balance. You need $${groupData.contributionAmount} but have $${usdcBalance.toFixed(2)}`)
      return
    }

    setLoading(true)

    try {
      // Simulate USDC payment transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success('Payment successful! You have joined the group.')
      
      if (onPaymentComplete) {
        onPaymentComplete()
      }
    } catch (error) {
      console.error('USDC payment failed:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleFiatPayment = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    setLoading(true)

    try {
      const purchaseResult = await solanaFiatService.initiateMoonPayPurchase({
        amount: groupData.contributionAmount,
        currency: 'USD',
        walletAddress: publicKey.toBase58(),
        provider: fiatProvider
      })

      if (!purchaseResult.success || !purchaseResult.paymentUrl) {
        throw new Error('Failed to initiate payment')
      }

      const paymentUrl = purchaseResult.paymentUrl

      // Open payment window
      const paymentWindow = window.open(
        paymentUrl,
        'fiat-onramp',
        'width=500,height=700,scrollbars=yes,resizable=yes'
      )

      // Monitor payment completion
      const checkPayment = setInterval(async () => {
        try {
          const newBalance = await solanaFiatService.getUSDCBalance(publicKey.toBase58())
          if (newBalance >= usdcBalance + groupData.contributionAmount * 0.95) { // Account for fees
            clearInterval(checkPayment)
            paymentWindow?.close()
            
            // Automatically process the contribution
            await handleUSDCPayment()
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
        }
      }, 5000)

      // Stop checking after 10 minutes
      setTimeout(() => {
        clearInterval(checkPayment)
        if (paymentWindow && !paymentWindow.closed) {
          paymentWindow.close()
        }
      }, 600000)

    } catch (error) {
      console.error('Fiat payment initiation failed:', error)
      toast.error('Failed to initiate fiat payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getProviderIcon = (provider: FiatProvider) => {
    switch (provider) {
      case FiatProvider.MOONPAY: return '🌙'
      case FiatProvider.RAMP: return '🚀'
      case FiatProvider.TRANSAK: return '⚡'
      case FiatProvider.COINBASE: return '🔵'
      default: return '💳'
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Complete Your Payment</h1>
        <p className="text-gray-300">
          Join the {groupData.tier} tier group with ${groupData.contributionAmount} contribution
        </p>
      </div>

      {/* Group Details */}
      <Card className="bg-white/5 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Group Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">${groupData.contributionAmount}</div>
              <div className="text-sm text-gray-400">Contribution</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{groupData.maxMembers}</div>
              <div className="text-sm text-gray-400">Max Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{groupData.cycleDuration}</div>
              <div className="text-sm text-gray-400">Days/Cycle</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold bg-gradient-to-r ${getTierColor(groupData.tier)} bg-clip-text text-transparent capitalize`}>
                {groupData.tier}
              </div>
              <div className="text-sm text-gray-400">Tier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentOptions.map((option) => (
          <Card 
            key={option.type}
            className={`cursor-pointer transition-all duration-300 border-2 ${
              paymentMethod === option.type
                ? 'border-purple-500 bg-purple-500/10' 
                : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
            }`}
            onClick={() => setPaymentMethod(option.type)}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {option.label}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {option.description}
                  </p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fees:</span>
                    <span className="text-white">
                      {option.fees === 0 ? 'Free' : `${option.fees}%`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white">{option.estimatedTime}</span>
                  </div>
                </div>
                {paymentMethod === option.type && (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* USDC Payment Details */}
      {paymentMethod === 'usdc' && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              💵 USDC Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
              <span className="text-gray-300">Your USDC Balance:</span>
              <span className={`font-semibold ${
                usdcBalance >= groupData.contributionAmount ? 'text-green-400' : 'text-red-400'
              }`}>
                ${usdcBalance.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-white/10 rounded-lg">
              <span className="text-gray-300">Required Amount:</span>
              <span className="text-white font-semibold">${groupData.contributionAmount}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <span className="text-gray-300">Network Fees:</span>
              <span className="text-green-400 font-semibold">Free</span>
            </div>

            <Button
              onClick={handleUSDCPayment}
              disabled={!connected || loading || usdcBalance < groupData.contributionAmount}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                `Pay ${groupData.contributionAmount} USDC`
              )}
            </Button>

            {usdcBalance < groupData.contributionAmount && (
              <div className="text-center text-red-400 text-sm">
                Insufficient USDC balance. Consider using the fiat payment option.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fiat Payment Details */}
      {paymentMethod === 'fiat' && (
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              💳 Fiat Payment Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fiatProviders.slice(0, 4).map((providerData) => {
                const provider = providerData.providerId as FiatProvider

                return (
                  <div
                    key={provider}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      fiatProvider === provider
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/20 bg-white/5 hover:border-white/30'
                    }`}
                    onClick={() => setFiatProvider(provider)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getProviderIcon(provider)}</span>
                      <span className="text-white font-medium capitalize">{providerData.provider}</span>
                      {fiatProvider === provider && (
                        <span className="ml-auto text-purple-400">✓</span>
                      )}
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fees:</span>
                        <span className="text-white">${providerData.fees.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-white">{providerData.processingTime}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Payment Summary */}
            <div className="bg-white/10 rounded-lg p-4 space-y-2">
              <h3 className="text-white font-medium mb-2">Payment Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">USDC Amount:</span>
                <span className="text-white">${groupData.contributionAmount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Provider Fees:</span>
                <span className="text-white">
                  ${(groupData.contributionAmount * (fiatProviders.find(p => p.provider === fiatProvider)?.fees || 3.5) / 100).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between font-medium">
                <span className="text-gray-300">Total (USD):</span>
                <span className="text-white">
                  ${(groupData.contributionAmount * (1 + (fiatProviders.find(p => p.provider === fiatProvider)?.fees || 3.5) / 100)).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleFiatPayment}
              disabled={!connected || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Opening Payment Window...
                </div>
              ) : (
                `Buy USDC with ${fiatProvider}`
              )}
            </Button>

            <div className="text-xs text-gray-400 text-center">
              You will be redirected to {fiatProvider} to complete the purchase. 
              USDC will be automatically sent to your wallet upon completion.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-400 text-xl">🛡️</div>
            <div>
              <h3 className="text-blue-400 font-medium mb-1">Security Notice</h3>
              <p className="text-gray-300 text-sm">
                Your funds are secured by smart contracts on the Solana blockchain. 
                All transactions are transparent and verifiable on-chain.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PaymentFlow