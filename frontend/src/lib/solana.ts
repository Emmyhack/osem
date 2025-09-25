import { Connection, PublicKey, Commitment } from '@solana/web3.js'
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import osemeGroupIdl from './idl/oseme_group.json'

// Program IDs
export const OSEME_GROUP_PROGRAM_ID = new PublicKey('GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef')
export const OSEME_TRUST_PROGRAM_ID = new PublicKey('TrustXYZ123456789abcdefghijklmnopqrstuvwxyz')
export const OSEME_TREASURY_PROGRAM_ID = new PublicKey('TreasuryABCDEFGHIJKLMNOPQRSTUVWXYZ123456')

// USDC Mint (devnet)
export const USDC_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU')

// Network configuration
export const SOLANA_NETWORK = process.env.NODE_ENV === 'production' ? 'mainnet-beta' : 'devnet'
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT ||
  (SOLANA_NETWORK === 'mainnet-beta'
    ? 'https://api.mainnet-beta.solana.com'
    : 'https://api.devnet.solana.com')

// Connection settings
export const CONNECTION_CONFIG: Commitment = 'confirmed'

// Create connection
export const getConnection = () => new Connection(RPC_ENDPOINT, CONNECTION_CONFIG)

// Get Anchor provider
export const getProvider = (wallet: AnchorWallet) => {
  const connection = getConnection()
  return new AnchorProvider(connection, wallet, {
    commitment: CONNECTION_CONFIG,
    preflightCommitment: CONNECTION_CONFIG,
  })
}

// Get program instance
export const getOsemeGroupProgram = (wallet: AnchorWallet) => {
  const provider = getProvider(wallet)
  return new Program(osemeGroupIdl as Idl, OSEME_GROUP_PROGRAM_ID, provider)
}

// PDA Seeds
export const PLATFORM_CONFIG_SEED = 'platform_config'
export const GROUP_SEED = 'group'
export const MEMBER_SEED = 'member'
export const ESCROW_VAULT_SEED = 'escrow_vault'
export const STAKE_VAULT_SEED = 'stake_vault'

// PDA derivation helpers
export const findPlatformConfigPDA = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(PLATFORM_CONFIG_SEED)],
    OSEME_GROUP_PROGRAM_ID
  )
}

export const findGroupPDA = (groupId: number) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(GROUP_SEED), Buffer.from(groupId.toString())],
    OSEME_GROUP_PROGRAM_ID
  )
}

export const findMemberPDA = (group: PublicKey, user: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(MEMBER_SEED), group.toBuffer(), user.toBuffer()],
    OSEME_GROUP_PROGRAM_ID
  )
}

export const findEscrowVaultPDA = (group: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(ESCROW_VAULT_SEED), group.toBuffer()],
    OSEME_GROUP_PROGRAM_ID
  )
}

export const findStakeVaultPDA = (group: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(STAKE_VAULT_SEED), group.toBuffer()],
    OSEME_GROUP_PROGRAM_ID
  )
}

// Group Model enum
export enum GroupModel {
  Basic = 'Basic',
  Trust = 'Trust',
  SuperTrust = 'SuperTrust'
}

// Group Status enum
export enum GroupStatus {
  Active = 'Active',
  Paused = 'Paused',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

// Type definitions
export interface PlatformConfig {
  authority: PublicKey
  feeBps: number
  trustSubscriptionPrice: number
  superTrustSubscriptionPrice: number
  basicGroupLimit: number
  basicPerCreatorLimit: number
  gracePeriodDays: number
  trustPenalty: number
  trustBonus: number
  stakeBonusBps: number
  kycThreshold: number
  bonusPool: number
  usdcMint: PublicKey
  bump: number
}

export interface Group {
  groupId: number
  model: GroupModel
  creator: PublicKey
  memberCap: number
  currentTurnIndex: number
  cycleDays: number
  payoutOrder: PublicKey[]
  escrowVault: PublicKey
  stakeVault?: PublicKey
  status: GroupStatus
  totalMembers: number
  currentTurnStart: number
  contributionAmount: number
  totalPool: number
  trustScore: number
  createdAt: number
  bump: number
}

export interface Member {
  group: PublicKey
  user: PublicKey
  stakeAmount: number
  contributedTurns: boolean[]
  missedCount: number
  trustDelta: number
  joinTimestamp: number
  isCreator: boolean
  bump: number
}