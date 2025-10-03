import * as anchor from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor"
import { OsemeGroup } from "./idl/oseme_group"
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
// import { getAssociatedTokenAddress } from "@solana/spl-token"

// Enhanced Group Tiers with complete functionality
export enum GroupTier {
  Basic = "basic",
  Trust = "trust", 
  SuperTrust = "superTrust",
  Premium = "premium"
}

export interface GroupTierConfig {
  tier: GroupTier
  minContribution: number
  maxMembers: number
  cycleDuration: number // in days
  solStakeRequirement: number // SOL staking for basic participation
  usdcStakeRequirement: number // USDC staking for trust verification (Trust/SuperTrust only)
  insuranceCoverage: number
  yieldOptimization: boolean
  fiatOnRampEnabled: boolean
  marketYieldEnabled: boolean // Can stake be used in DeFi markets
  features: string[]
}

// Complete tier configurations
export const GROUP_TIER_CONFIGS: Record<GroupTier, GroupTierConfig> = {
  [GroupTier.Basic]: {
    tier: GroupTier.Basic,
    minContribution: 50, // $50 USDC minimum
    maxMembers: 20,
    cycleDuration: 30,
    solStakeRequirement: 1.0, // 1.0 SOL stake
    usdcStakeRequirement: 0, // No USDC staking required
    insuranceCoverage: 5000, // $5000 coverage
    yieldOptimization: false,
    fiatOnRampEnabled: true,
    marketYieldEnabled: false,
    features: [
      "Basic group savings",
      "Simple rotation payouts", 
      "Basic insurance coverage",
      "Fiat on-ramp support"
    ]
  },
  [GroupTier.Trust]: {
    tier: GroupTier.Trust,
    minContribution: 250, // $250 USDC minimum (requires KYC)
    maxMembers: 15,
    cycleDuration: 21,
    solStakeRequirement: 2.5, // 2.5 SOL stake
    usdcStakeRequirement: 500, // $500 USDC stake required for trust
    insuranceCoverage: 25000, // $25000 coverage
    yieldOptimization: true,
    fiatOnRampEnabled: true,
    marketYieldEnabled: true, // USDC stake can earn yield in markets
    features: [
      "Enhanced group savings with KYC verification",
      "$500 USDC trust stake required (earns market yield)",
      "Yield optimization on idle funds (+0% APY bonus)",
      "Advanced insurance coverage ($25K)",
      "Social media verification required",
      "Reduced platform fees (1.5%)",
      "Fiat on-ramp with better rates"
    ]
  },
  [GroupTier.SuperTrust]: {
    tier: GroupTier.SuperTrust,
    minContribution: 1000, // $1000 USDC minimum (requires credit score + institutional backing)
    maxMembers: 10,
    cycleDuration: 14,
    solStakeRequirement: 5.0, // 5 SOL stake
    usdcStakeRequirement: 2500, // $2500 USDC stake required for super trust
    insuranceCoverage: 100000, // $100000 coverage
    yieldOptimization: true,
    fiatOnRampEnabled: true,
    marketYieldEnabled: true, // USDC stake earns premium yield in markets
    features: [
      "Premium group savings with full verification",
      "$2500 USDC super trust stake required (earns premium market yield)",
      "Advanced yield strategies (+2% APY bonus)",
      "Comprehensive insurance coverage ($100K)",
      "Credit score + institutional backing required",
      "Priority customer support",
      "Lowest platform fees (1.0%)",
      "Multi-signature security"
    ]
  },
  [GroupTier.Premium]: {
    tier: GroupTier.Premium,
    minContribution: 5000, // $5000 USDC minimum (accredited investors only)
    maxMembers: 5,
    cycleDuration: 7,
    solStakeRequirement: 10.0, // 10 SOL stake
    usdcStakeRequirement: 10000, // $10000 USDC stake for premium trust
    insuranceCoverage: 500000, // $500000 coverage
    yieldOptimization: true,
    fiatOnRampEnabled: true,
    marketYieldEnabled: true, // USDC stake earns maximum yield in markets
    features: [
      "Elite group savings for accredited investors",
      "$10000 USDC premium trust stake required (earns maximum market yield)",
      "Professional yield management (+3.5% APY bonus)",
      "Maximum insurance coverage ($500K)",
      "Accredited investor + legal entity required",
      "Dedicated account manager",
      "Zero platform fees",
      "Enterprise fiat solutions",
      "Advanced DeFi strategies",
      "Exclusive platform benefits"
    ]
  }
}

// Trust and SuperTrust specific requirements
export interface TierRequirements {
  kyc: boolean
  creditScore?: number
  socialVerification: boolean
  institutionalBacking?: boolean
  accreditedInvestor?: boolean
  legalEntity?: boolean
  minTrustScore: number
  stakingHistory: boolean
}

export const TIER_REQUIREMENTS: Record<GroupTier, TierRequirements> = {
  [GroupTier.Basic]: {
    kyc: false,
    socialVerification: false,
    minTrustScore: 0,
    stakingHistory: false
  },
  [GroupTier.Trust]: {
    kyc: true,
    socialVerification: true,
    minTrustScore: 700,
    stakingHistory: false
  },
  [GroupTier.SuperTrust]: {
    kyc: true,
    creditScore: 650,
    socialVerification: true,
    institutionalBacking: true,
    minTrustScore: 850,
    stakingHistory: true
  },
  [GroupTier.Premium]: {
    kyc: true,
    creditScore: 750,
    socialVerification: true,
    institutionalBacking: true,
    accreditedInvestor: true,
    legalEntity: true,
    minTrustScore: 950,
    stakingHistory: true
  }
}

export interface UserProfile {
  address: string
  kycVerified: boolean
  socialMediaVerified: boolean
  creditScore?: number
  institutionalBacking: boolean
  accreditedInvestor: boolean
  legalEntity: boolean
  trustScore: number
  hasStakingHistory: boolean
  verificationLevel: GroupTier
}

export interface VerificationStep {
  type: 'kyc' | 'social' | 'credit' | 'institutional' | 'accredited' | 'entity'
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  estimatedTime: string
  completedAt?: Date
  error?: string
}

export interface VerificationFlow {
  tier: GroupTier
  userAddress: string
  steps: VerificationStep[]
  status: 'initiated' | 'in_progress' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
  estimatedCompletion: Date
}

export class TierVerificationService {
  static async checkTierEligibility(
    tier: GroupTier, 
    userProfile: UserProfile
  ): Promise<{ eligible: boolean; missingRequirements: string[] }> {
    const requirements = TIER_REQUIREMENTS[tier]
    const missing: string[] = []

    if (requirements.kyc && !userProfile.kycVerified) {
      missing.push('KYC verification required')
    }

    if (requirements.socialVerification && !userProfile.socialMediaVerified) {
      missing.push('Social media verification required')
    }

    if (requirements.creditScore && (!userProfile.creditScore || userProfile.creditScore < requirements.creditScore)) {
      missing.push(`Credit score of ${requirements.creditScore}+ required`)
    }

    if (requirements.institutionalBacking && !userProfile.institutionalBacking) {
      missing.push('Institutional backing/endorsement required')
    }

    if (requirements.accreditedInvestor && !userProfile.accreditedInvestor) {
      missing.push('Accredited investor status required')
    }

    if (requirements.legalEntity && !userProfile.legalEntity) {
      missing.push('Legal entity registration required')
    }

    if (userProfile.trustScore < requirements.minTrustScore) {
      missing.push(`Trust score of ${requirements.minTrustScore}+ required (current: ${userProfile.trustScore})`)
    }

    if (requirements.stakingHistory && !userProfile.hasStakingHistory) {
      missing.push('Previous staking/participation history required')
    }

    return {
      eligible: missing.length === 0,
      missingRequirements: missing
    }
  }

  static async initiateVerificationFlow(tier: GroupTier, userAddress: string): Promise<VerificationFlow> {
    const requirements = TIER_REQUIREMENTS[tier]
    const steps: VerificationStep[] = []

    if (requirements.kyc) {
      steps.push({
        type: 'kyc',
        title: 'Identity Verification',
        description: 'Complete KYC verification with government-issued ID',
        status: 'pending',
        estimatedTime: '5-10 minutes'
      })
    }

    if (requirements.socialVerification) {
      steps.push({
        type: 'social',
        title: 'Social Media Verification',
        description: 'Connect and verify your social media accounts',
        status: 'pending',
        estimatedTime: '2-5 minutes'
      })
    }

    if (requirements.creditScore) {
      steps.push({
        type: 'credit',
        title: 'Credit Score Verification',
        description: 'Verify your credit score through our partner',
        status: 'pending',
        estimatedTime: '1-2 minutes'
      })
    }

    if (requirements.institutionalBacking) {
      steps.push({
        type: 'institutional',
        title: 'Institutional Endorsement',
        description: 'Provide institutional backing or professional endorsement',
        status: 'pending',
        estimatedTime: '1-3 business days'
      })
    }

    if (requirements.accreditedInvestor) {
      steps.push({
        type: 'accredited',
        title: 'Accredited Investor Verification',
        description: 'Verify accredited investor status',
        status: 'pending',
        estimatedTime: '1-2 business days'
      })
    }

    if (requirements.legalEntity) {
      steps.push({
        type: 'entity',
        title: 'Legal Entity Registration',
        description: 'Register and verify legal entity status',
        status: 'pending',
        estimatedTime: '2-5 business days'
      })
    }

    return {
      tier,
      userAddress,
      steps,
      status: 'initiated',
      createdAt: new Date(),
      estimatedCompletion: this.calculateEstimatedCompletion(steps)
    }
  }

  private static calculateEstimatedCompletion(steps: VerificationStep[]): Date {
    const maxDays = Math.max(...steps.map(step => {
      if (step.estimatedTime.includes('business days')) {
        return parseInt(step.estimatedTime) || 1
      }
      return 0
    }), 1)

    const completion = new Date()
    completion.setDate(completion.getDate() + maxDays)
    return completion
  }
}

export class CompleteOsemeProgram {
  constructor(
    public program: Program<OsemeGroup>,
    public provider: anchor.AnchorProvider
  ) {}

  // Initialize the platform with all configurations
  async initializePlatform(authority: PublicKey) {
    const [platformPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      this.program.programId
    )

    const [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      this.program.programId
    )

    const [insurancePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("insurance")], 
      this.program.programId
    )

    // Create platform configuration
    const platformConfig = {
      maxGroupsPerUser: 10,
      minStakeAmount: new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL), // 1 SOL minimum
      platformFeeRate: 250, // 2.5% (in basis points)
      insuranceRate: 100, // 1% (in basis points)
      enableYieldOptimization: true
    }

    try {
      const tx = await this.program.methods
        .initPlatform(platformConfig)
        .accounts({
          authority,
          platformConfig: platformPda,
          systemProgram: SystemProgram.programId
        })
        .rpc()

      console.log("✅ Platform initialized:", tx)
      return { tx, platformPda, treasuryPda, insurancePda }
    } catch (error) {
      console.error("❌ Platform initialization failed:", error)
      throw error
    }
  }

  // Stake USDC for Trust/SuperTrust groups (must be called before createGroup)
  async stakeUSDCForTrust(
    creator: PublicKey,
    tier: GroupTier,
_usdcMint: PublicKey = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") // USDC mint
  ) {
    const config = GROUP_TIER_CONFIGS[tier]
    
    if (config.usdcStakeRequirement === 0) {
      throw new Error(`${tier} tier does not require USDC staking`)
    }

    const stakeAmount = config.usdcStakeRequirement
    const groupId = Math.floor(Math.random() * 1000000) // Generate unique group ID
    
    const [trustStakePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("trust_stake"), Buffer.from(groupId.toString()), creator.toBuffer()],
      this.program.programId
    )

    const [yieldVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("yield_vault"), trustStakePda.toBuffer()],
      this.program.programId
    )

    // Get creator's USDC token account (for future use)
    // const creatorUsdcAccount = await getAssociatedTokenAddress(usdcMint, creator)

    // Get or create vault USDC account (for future use)
    // const vaultUsdcAccount = await getAssociatedTokenAddress(usdcMint, yieldVaultPda, true)

    try {
      // Simulate USDC staking for trust verification since the method doesn't exist in IDL yet
      // In production, this would be replaced with actual on-chain staking
      const simulatedTx = `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log(`🔄 Simulating USDC trust stake for ${tier} tier:`)
      console.log(`   - Stake Amount: $${stakeAmount} USDC`)
      console.log(`   - Trust Stake PDA: ${trustStakePda.toString()}`)
      console.log(`   - Yield Vault PDA: ${yieldVaultPda.toString()}`)
      
      // TODO: Implement actual on-chain staking once program method is added
      // const tx = await this.program.methods
      //   .stakeUsdcForTrust(groupId, tier, new anchor.BN(stakeAmount * 1_000_000))
      //   .accounts({ ... })
      //   .rpc()
      
      const tx = simulatedTx

      console.log(`✅ USDC trust stake created for ${tier}:`, tx)
      
      // If market yield is enabled, deploy to DeFi protocols
      if (config.marketYieldEnabled) {
        await this.deployStakeToMarkets(yieldVaultPda, stakeAmount, tier)
      }

      return {
        tx,
        groupId,
        trustStakePda,
        yieldVaultPda,
        stakeAmount,
        canEarnYield: config.marketYieldEnabled
      }
    } catch (error) {
      console.error("❌ USDC trust staking failed:", error)
      throw error
    }
  }

  // Deploy staked USDC to DeFi markets for yield generation
  async deployStakeToMarkets(
    _yieldVaultPda: PublicKey,
    amount: number,
    tier: GroupTier
  ) {
    try {
      // Simulate deploying to different DeFi protocols based on tier
      const yieldStrategies = this.getYieldStrategiesForTier(tier)
      
      console.log(`🌾 Deploying $${amount} USDC to yield strategies:`, yieldStrategies)
      
      // In production, this would interact with actual DeFi protocols
      // For now, we simulate the deployment by just logging the strategies
      console.log(`🌾 Simulating deployment of $${amount} USDC to yield strategies:`, yieldStrategies)
      
      // Create a mock transaction ID for tracking
      const deploymentTx = `simulated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      console.log("✅ Stake deployment simulated:", deploymentTx)
      return { deploymentTx, strategies: yieldStrategies }
    } catch (error) {
      console.error("❌ Market deployment failed:", error)
      throw error
    }
  }

  // Get yield strategies based on tier
  private getYieldStrategiesForTier(tier: GroupTier) {
    switch (tier) {
      case GroupTier.Trust:
        return [
          { protocol: "Marinade", allocation: 0.6, expectedAPY: 6.5 },
          { protocol: "Solend", allocation: 0.4, expectedAPY: 5.2 }
        ]
      case GroupTier.SuperTrust:
        return [
          { protocol: "Marinade", allocation: 0.4, expectedAPY: 6.5 },
          { protocol: "Solend", allocation: 0.3, expectedAPY: 5.2 },
          { protocol: "Francium", allocation: 0.3, expectedAPY: 8.1 }
        ]
      case GroupTier.Premium:
        return [
          { protocol: "Marinade", allocation: 0.3, expectedAPY: 6.5 },
          { protocol: "Solend", allocation: 0.2, expectedAPY: 5.2 },
          { protocol: "Francium", allocation: 0.3, expectedAPY: 8.1 },
          { protocol: "Port Finance", allocation: 0.2, expectedAPY: 7.8 }
        ]
      default:
        return []
    }
  }

  // Create group with tier-specific configurations (now requires USDC staking for Trust+)
  async createGroup(
    creator: PublicKey,
    tier: GroupTier,
    customContribution?: number,
    trustStakeInfo?: { groupId: number; trustStakePda: PublicKey }
  ) {
    const config = GROUP_TIER_CONFIGS[tier]
    const contributionAmount = customContribution || config.minContribution

    // Validate contribution meets minimum
    if (contributionAmount < config.minContribution) {
      throw new Error(`Minimum contribution for ${tier} tier is $${config.minContribution}`)
    }

    // Validate USDC staking for Trust/SuperTrust tiers
    if (config.usdcStakeRequirement > 0 && !trustStakeInfo) {
      throw new Error(`${tier} tier requires USDC trust staking. Call stakeUSDCForTrust() first.`)
    }

    const groupId = trustStakeInfo?.groupId || Math.floor(Math.random() * 1000000)
    
    const [groupPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("group"), Buffer.from(groupId.toString())],
      this.program.programId
    )

    const [stakePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("stake"), groupPda.toBuffer()],
      this.program.programId
    )

    try {
      const createGroupAccounts: any = {
        creator,
        group: groupPda,
        stakeAccount: stakePda,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY
      }

      // Link trust stake for Trust/SuperTrust tiers
      if (trustStakeInfo) {
        createGroupAccounts.trustStake = trustStakeInfo.trustStakePda
      }

      // Create proper enum object based on tier
      let groupModelObj: any
      switch (tier) {
        case GroupTier.Basic:
          groupModelObj = { basic: {} }
          break
        case GroupTier.Trust:
          groupModelObj = { trust: {} }
          break
        case GroupTier.SuperTrust:
          groupModelObj = { superTrust: {} }
          break
        case GroupTier.Premium:
          groupModelObj = { premium: {} }
          break
        default:
          groupModelObj = { basic: {} }
      }
      
      const tx = await this.program.methods
        .createGroup(
          groupModelObj,
          config.cycleDuration,
          config.maxMembers,
          null // payoutOrder - will be determined by program logic
        )
        .accounts(createGroupAccounts)
        .rpc()

      console.log(`✅ ${tier} group created with trust stake:`, tx)
      return {
        tx,
        groupId,
        groupPda,
        stakePda,
        trustStakePda: trustStakeInfo?.trustStakePda,
        config,
        contributionAmount,
        trustStakeAmount: config.usdcStakeRequirement
      }
    } catch (error) {
      console.error("❌ Group creation failed:", error)
      throw error
    }
  }

  // Join group with stake requirements
  async joinGroup(
    member: PublicKey,
    groupPda: PublicKey,
    stakeAmount: number
  ) {
    const [memberPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("member"), groupPda.toBuffer(), member.toBuffer()],
      this.program.programId
    )

    try {
      const tx = await this.program.methods
        .joinGroup()
        .accounts({
          member,
          group: groupPda,
          user: memberPda,
          systemProgram: SystemProgram.programId
        })
        .rpc()

      console.log(`✅ Member joined group with ${stakeAmount} SOL stake:`, tx)
      return { tx, memberPda, stakeAmount }
    } catch (error) {
      console.error("❌ Join group failed:", error)
      throw error
    }
  }

  // Make contribution with automatic yield optimization
  async makeContribution(
    member: PublicKey,
    groupPda: PublicKey,
    amount: number,
    _enableYieldOptimization: boolean = false
  ) {
    const [contributionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("contribution"), groupPda.toBuffer(), member.toBuffer()],
      this.program.programId
    )

    const [yieldPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("yield"), groupPda.toBuffer()],
      this.program.programId
    )

    try {
      const tx = await this.program.methods
        .contribute(
          new anchor.BN(amount * 1_000_000) // USDC decimals
        )
        .accounts({
          member,
          group: groupPda,
          contributor: contributionPda
        })
        .rpc()

      console.log("✅ Contribution made:", tx)
      return { tx, contributionPda, yieldPda }
    } catch (error) {
      console.error("❌ Contribution failed:", error)
      throw error
    }
  }

  // Process payout with insurance coverage
  async processPayout(
    _authority: PublicKey,
    groupPda: PublicKey,
    recipient: PublicKey,
    _amount: number
  ) {
    const [payoutPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("payout"), groupPda.toBuffer(), recipient.toBuffer()],
      this.program.programId
    )

    const [_insurancePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("insurance")],
      this.program.programId
    )

    try {
      const tx = await this.program.methods
        .releasePayout()
        .accounts({
          group: groupPda,
          recipient
        })
        .rpc()

      console.log("✅ Payout processed:", tx)
      return { tx, payoutPda }
    } catch (error) {
      console.error("❌ Payout failed:", error)
      throw error
    }
  }

  // Get group information with complete details
  async getGroupInfo(groupPda: PublicKey) {
    try {
      const groupAccount = await this.program.account.group.fetch(groupPda)
      const tierConfig = GROUP_TIER_CONFIGS[groupAccount.model as unknown as GroupTier]
      return {
        id: groupAccount.groupId.toString(),
        tier: groupAccount.model,
        creator: groupAccount.creator,
        contributionAmount: groupAccount.contributionAmount?.toNumber() / 1_000_000 || 0,
        maxMembers: groupAccount.memberCap,
        currentMembers: groupAccount.totalMembers || 0,
        cycleDuration: tierConfig?.cycleDuration || 30,
        totalContributions: groupAccount.totalPool?.toNumber() / 1_000_000 || 0,
        currentCycle: groupAccount.currentTurnIndex,
        isActive: groupAccount.status ? true : false,
        createdAt: new Date((groupAccount.createdAt?.toNumber() || Date.now() / 1000) * 1000),
        config: tierConfig
      }
    } catch (error) {
      console.error("❌ Failed to fetch group info:", error)
      throw error
    }
  }

  // Get trust stake information and current yield
  async getTrustStakeInfo(trustStakePda: PublicKey) {
    try {
      // TODO: Replace with actual account fetch once trustStake account is added to the program
      // For now, simulate trust stake data based on PDA
      const simulatedTrustStake = this.simulateTrustStakeAccount(trustStakePda)
      
      const currentYield = await this.calculateTrustStakeYield(
        simulatedTrustStake.amount / 1_000_000,
        simulatedTrustStake.tier,
        simulatedTrustStake.createdAt
      )

      return {
        amount: simulatedTrustStake.amount / 1_000_000,
        tier: simulatedTrustStake.tier,
        creator: simulatedTrustStake.creator,
        groupId: simulatedTrustStake.groupId.toString(),
        currentYield,
        totalValue: (simulatedTrustStake.amount / 1_000_000) + currentYield,
        createdAt: new Date(simulatedTrustStake.createdAt.toNumber() * 1000),
        canWithdraw: false, // Only after group cycle completes
        yieldStrategies: this.getYieldStrategiesForTier(simulatedTrustStake.tier)
      }
    } catch (error) {
      console.error("❌ Failed to fetch trust stake info:", error)
      throw error
    }
  }

  // Simulate trust stake account until it's implemented in the program
  private simulateTrustStakeAccount(trustStakePda: PublicKey) {
    // Parse stake info from PDA address for simulation
    const pdaString = trustStakePda.toString()
    const hash = pdaString.slice(-8)
    const mockGroupId = parseInt(hash, 16) % 1000000
    
    return {
      amount: GROUP_TIER_CONFIGS[GroupTier.Trust].usdcStakeRequirement * 1_000_000,
      tier: GroupTier.Trust,
      creator: this.provider.publicKey || PublicKey.default,
      groupId: new anchor.BN(mockGroupId),
      createdAt: new anchor.BN(Math.floor(Date.now() / 1000) - 86400) // 1 day ago
    }
  }

  // Calculate current yield on trust stake
  private async calculateTrustStakeYield(
    stakeAmount: number,
    tier: GroupTier,
    createdAt: anchor.BN
  ): Promise<number> {
    const strategies = this.getYieldStrategiesForTier(tier)
    const daysStaked = Math.floor((Date.now() - (createdAt.toNumber() * 1000)) / (24 * 60 * 60 * 1000))
    
    // Calculate weighted average APY
    const avgAPY = strategies.reduce((sum, strategy) => 
      sum + (strategy.expectedAPY * strategy.allocation), 0
    )

    // Calculate daily yield
    const dailyYield = (avgAPY / 100) / 365
    const currentYield = stakeAmount * dailyYield * daysStaked

    return Math.max(0, currentYield)
  }

  // Withdraw trust stake (only after group cycle completion)
  async withdrawTrustStake(
    _creator: PublicKey,
    trustStakePda: PublicKey,
    groupPda: PublicKey
  ) {
    try {
      // Check if group cycle is completed
      const groupInfo = await this.getGroupInfo(groupPda)
      if (groupInfo.isActive) {
        throw new Error("Cannot withdraw trust stake while group cycle is active")
      }

      const [_yieldVaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("yield_vault"), trustStakePda.toBuffer()],
        this.program.programId
      )

      // Note: withdrawTrustStake method not yet implemented in IDL
      // Placeholder for trust stake withdrawal functionality
      // const tx = await this.program.methods
      //   .withdrawTrustStake()
      //   .accounts({
      //     creator,
      //     trustStake: trustStakePda,
      //     yieldVault: yieldVaultPda,
      //     group: groupPda,
      //     systemProgram: SystemProgram.programId
      //   })
      //   .rpc()
      
      console.log("✅ Trust stake withdrawal simulated (method not implemented in IDL)")
      const tx = "simulated-withdrawal-" + Date.now()
      
      const stakeInfo = await this.getTrustStakeInfo(trustStakePda)
      return {
        tx,
        withdrawnAmount: stakeInfo.amount,
        yieldEarned: stakeInfo.currentYield,
        totalWithdrawn: stakeInfo.totalValue
      }
    } catch (error) {
      console.error("❌ Trust stake withdrawal failed:", error)
      throw error
    }
  }

  // Get user's complete profile
  async getUserProfile(userPubkey: PublicKey) {
    try {
      // Find all groups where user is a member
      const memberAccounts = await this.program.account.member.all([
        {
          memcmp: {
            offset: 8, // After discriminator
            bytes: userPubkey.toBase58()
          }
        }
      ])

      const groups = []
      for (const memberAccount of memberAccounts) {
        const groupInfo = await this.getGroupInfo(memberAccount.account.group)
        groups.push({
          ...groupInfo,
          memberData: memberAccount.account,
          publicKey: memberAccount.publicKey
        })
      }

      return {
        publicKey: userPubkey,
        totalGroups: groups.length,
        totalContributions: groups.reduce((sum, g) => sum + (g.memberData.stakeAmount?.toNumber() || 0), 0) / 1_000_000,
        totalStaked: groups.reduce((sum, g) => sum + (g.memberData.stakeAmount?.toNumber() || 0), 0) / anchor.web3.LAMPORTS_PER_SOL,
        groups,
        creditScore: this.calculateCreditScore(groups)
      }
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error)
      throw error
    }
  }

  // Calculate user credit score based on activity
  private calculateCreditScore(groups: any[]): number {
    if (groups.length === 0) return 0

    let score = 500 // Base score
    
    // Add points for each group participation
    score += groups.length * 50
    
    // Add points for consistent contributions
    const avgContributions = groups.reduce((sum, g) => sum + (g.memberData.contributionCount || 0), 0) / groups.length
    score += avgContributions * 25
    
    // Add points for higher tier participation
    groups.forEach(g => {
      switch (g.tier) {
        case GroupTier.Premium: score += 200; break
        case GroupTier.SuperTrust: score += 150; break
        case GroupTier.Trust: score += 100; break
        case GroupTier.Basic: score += 50; break
      }
    })
    
    return Math.min(850, Math.max(300, score)) // Clamp between 300-850
  }
}

// Export for use in frontend
export default CompleteOsemeProgram