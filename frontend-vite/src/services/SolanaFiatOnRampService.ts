import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token'

// Popular Solana fiat on-ramp providers
export interface FiatOnRampProvider {
  id: string
  name: string
  logo: string
  supportedCountries: string[]
  supportedCurrencies: string[]
  minAmount: number
  maxAmount: number
  fees: {
    percentage: number
    fixed: number
  }
  processingTime: string
  features: string[]
  apiEndpoint?: string
}

export const FIAT_ONRAMP_PROVIDERS: FiatOnRampProvider[] = [
  {
    id: 'moonpay',
    name: 'MoonPay',
    logo: '🌙',
    supportedCountries: ['US', 'EU', 'UK', 'AU', 'CA'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD'],
    minAmount: 20,
    maxAmount: 20000,
    fees: {
      percentage: 4.5,
      fixed: 0
    },
    processingTime: '5-15 minutes',
    features: ['Credit Card', 'Bank Transfer', 'Apple Pay', 'Google Pay'],
    apiEndpoint: 'https://api.moonpay.com'
  },
  {
    id: 'ramp',
    name: 'Ramp Network',
    logo: '🚀',
    supportedCountries: ['US', 'EU', 'UK'],
    supportedCurrencies: ['USD', 'EUR', 'GBP'],
    minAmount: 50,
    maxAmount: 10000,
    fees: {
      percentage: 2.9,
      fixed: 0
    },
    processingTime: '3-10 minutes',
    features: ['Credit Card', 'Open Banking', 'Instant Transfer'],
    apiEndpoint: 'https://api.ramp.network'
  },
  {
    id: 'transak',
    name: 'Transak',
    logo: '💳',
    supportedCountries: ['US', 'EU', 'UK', 'IN', 'AU'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'AUD'],
    minAmount: 30,
    maxAmount: 50000,
    fees: {
      percentage: 5.0,
      fixed: 0
    },
    processingTime: '10-30 minutes',
    features: ['Credit Card', 'Bank Transfer', 'UPI (India)', 'Local Banking'],
    apiEndpoint: 'https://api.transak.com'
  },
  {
    id: 'coinbase',
    name: 'Coinbase Pay',
    logo: '🔷',
    supportedCountries: ['US', 'EU', 'UK', 'CA'],
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD'],
    minAmount: 25,
    maxAmount: 25000,
    fees: {
      percentage: 3.99,
      fixed: 0.99
    },
    processingTime: '1-5 minutes',
    features: ['Coinbase Account', 'Instant Transfer', 'Advanced Security'],
    apiEndpoint: 'https://api.coinbase.com'
  }
]

// USDC mint address on Solana
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')

export interface FiatPurchaseRequest {
  amount: number
  currency: string
  walletAddress: string
  provider: string
  userEmail?: string
  userId?: string
}

export interface FiatPurchaseResponse {
  success: boolean
  transactionId?: string
  paymentUrl?: string
  estimatedFees: number
  estimatedTotal: number
  processingTime: string
  error?: string
}

class SolanaFiatOnRampService {
  private connection: Connection
  
  constructor(rpcUrl: string = 'https://api.devnet.solana.com') {
    this.connection = new Connection(rpcUrl, 'confirmed')
  }

  // Get best provider for user's requirements
  getBestProvider(
    amount: number,
    currency: string,
    country: string
  ): FiatOnRampProvider | null {
    const availableProviders = FIAT_ONRAMP_PROVIDERS.filter(provider => 
      provider.supportedCountries.includes(country) &&
      provider.supportedCurrencies.includes(currency) &&
      amount >= provider.minAmount &&
      amount <= provider.maxAmount
    )

    if (availableProviders.length === 0) return null

    // Sort by lowest total cost (percentage + fixed fees)
    return availableProviders.sort((a, b) => {
      const costA = (amount * a.fees.percentage / 100) + a.fees.fixed
      const costB = (amount * b.fees.percentage / 100) + b.fees.fixed
      return costA - costB
    })[0]
  }

  // Calculate fees for all available providers
  calculateFees(amount: number, currency: string, country: string) {
    const availableProviders = FIAT_ONRAMP_PROVIDERS.filter(provider => 
      provider.supportedCountries.includes(country) &&
      provider.supportedCurrencies.includes(currency) &&
      amount >= provider.minAmount &&
      amount <= provider.maxAmount
    )

    return availableProviders.map(provider => {
      const percentageFee = amount * provider.fees.percentage / 100
      const totalFees = percentageFee + provider.fees.fixed
      const netAmount = amount - totalFees
      
      return {
        provider: provider.name,
        providerId: provider.id,
        fees: {
          percentage: percentageFee,
          fixed: provider.fees.fixed,
          total: totalFees
        },
        netAmount,
        processingTime: provider.processingTime,
        features: provider.features
      }
    }).sort((a, b) => a.fees.total - b.fees.total)
  }

  // Initiate fiat purchase (MoonPay integration)
  async initiateMoonPayPurchase(request: FiatPurchaseRequest): Promise<FiatPurchaseResponse> {
    try {
      const provider = FIAT_ONRAMP_PROVIDERS.find(p => p.id === 'moonpay')
      if (!provider) throw new Error('MoonPay provider not found')

      // Validate wallet address
      try {
        new PublicKey(request.walletAddress)
      } catch {
        throw new Error('Invalid Solana wallet address')
      }

      const percentageFee = request.amount * provider.fees.percentage / 100
      const totalFees = percentageFee + provider.fees.fixed
      const estimatedTotal = request.amount + totalFees

      // Generate MoonPay URL (in production, you'd use their SDK)
      const moonPayUrl = this.generateMoonPayUrl({
        amount: request.amount,
        currency: request.currency,
        walletAddress: request.walletAddress,
        userEmail: request.userEmail
      })

      return {
        success: true,
        transactionId: `mp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentUrl: moonPayUrl,
        estimatedFees: totalFees,
        estimatedTotal,
        processingTime: provider.processingTime
      }
    } catch (error) {
      console.error('MoonPay purchase initiation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        estimatedFees: 0,
        estimatedTotal: request.amount,
        processingTime: 'N/A'
      }
    }
  }

  // Initiate Ramp Network purchase
  async initiateRampPurchase(request: FiatPurchaseRequest): Promise<FiatPurchaseResponse> {
    try {
      const provider = FIAT_ONRAMP_PROVIDERS.find(p => p.id === 'ramp')
      if (!provider) throw new Error('Ramp provider not found')

      const percentageFee = request.amount * provider.fees.percentage / 100
      const totalFees = percentageFee + provider.fees.fixed
      const estimatedTotal = request.amount + totalFees

      const rampUrl = this.generateRampUrl({
        amount: request.amount,
        currency: request.currency,
        walletAddress: request.walletAddress
      })

      return {
        success: true,
        transactionId: `ramp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paymentUrl: rampUrl,
        estimatedFees: totalFees,
        estimatedTotal,
        processingTime: provider.processingTime
      }
    } catch (error) {
      console.error('Ramp purchase initiation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        estimatedFees: 0,
        estimatedTotal: request.amount,
        processingTime: 'N/A'
      }
    }
  }

  // Generate MoonPay widget URL
  private generateMoonPayUrl(params: {
    amount: number
    currency: string
    walletAddress: string
    userEmail?: string
  }): string {
    const baseUrl = 'https://buy.moonpay.com'
    const urlParams = new URLSearchParams({
      apiKey: process.env.VITE_MOONPAY_API_KEY || 'pk_test_123',
      currencyCode: 'USDC',
      baseCurrencyCode: params.currency,
      baseCurrencyAmount: params.amount.toString(),
      walletAddress: params.walletAddress,
      colorCode: '#8b5cf6',
      theme: 'dark'
    })

    if (params.userEmail) {
      urlParams.append('email', params.userEmail)
    }

    return `${baseUrl}?${urlParams.toString()}`
  }

  // Generate Ramp widget URL
  private generateRampUrl(params: {
    amount: number
    currency: string
    walletAddress: string
  }): string {
    const baseUrl = 'https://buy.ramp.network'
    const urlParams = new URLSearchParams({
      hostApiKey: process.env.VITE_RAMP_API_KEY || 'ramp_test_123',
      swapAsset: 'SOLANA_USDC',
      fiatCurrency: params.currency,
      fiatValue: params.amount.toString(),
      userAddress: params.walletAddress,
      hostAppName: 'OSEM',
      hostLogoUrl: 'https://osem.app/logo.png',
      variant: 'embedded'
    })

    return `${baseUrl}?${urlParams.toString()}`
  }

  // Verify transaction on Solana
  async verifyTransaction(signature: string): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(signature)
      return transaction !== null && transaction.meta?.err === null
    } catch (error) {
      console.error('Transaction verification failed:', error)
      return false
    }
  }

  // Get USDC balance for wallet
  async getUSDCBalance(walletAddress: string): Promise<number> {
    try {
      const walletPubkey = new PublicKey(walletAddress)
      const associatedTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        walletPubkey
      )

      const balance = await this.connection.getTokenAccountBalance(associatedTokenAccount)
      return balance.value.uiAmount || 0
    } catch (error) {
      console.error('USDC balance fetch failed:', error)
      return 0
    }
  }

  // Create USDC account if it doesn't exist
  async ensureUSDCAccount(walletAddress: string): Promise<string> {
    try {
      const walletPubkey = new PublicKey(walletAddress)
      const associatedTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        walletPubkey
      )

      // Check if account exists
      const accountInfo = await this.connection.getAccountInfo(associatedTokenAccount)
      
      if (accountInfo === null) {
        // Account doesn't exist, need to create it
        const transaction = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            walletPubkey, // payer
            associatedTokenAccount, // associated token account
            walletPubkey, // owner
            USDC_MINT // mint
          )
        )

        const { blockhash } = await this.connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash
        transaction.feePayer = walletPubkey

        // Return serialized transaction for user to sign
        return transaction.serialize({ requireAllSignatures: false }).toString('base64')
      }

      return associatedTokenAccount.toBase58()
    } catch (error) {
      console.error('USDC account creation failed:', error)
      throw error
    }
  }

  // Get transaction history for wallet
  async getTransactionHistory(walletAddress: string, limit: number = 10) {
    try {
      const walletPubkey = new PublicKey(walletAddress)
      const signatures = await this.connection.getSignaturesForAddress(walletPubkey, { limit })
      
      const transactions = []
      for (const sig of signatures) {
        const tx = await this.connection.getTransaction(sig.signature)
        if (tx) {
          transactions.push({
            signature: sig.signature,
            blockTime: tx.blockTime,
            status: tx.meta?.err ? 'failed' : 'success',
            fee: tx.meta?.fee || 0,
            slot: tx.slot
          })
        }
      }

      return transactions
    } catch (error) {
      console.error('Transaction history fetch failed:', error)
      return []
    }
  }
}

export const solanaFiatService = new SolanaFiatOnRampService(
  process.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
)

export default SolanaFiatOnRampService