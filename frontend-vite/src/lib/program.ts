import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { Program, AnchorProvider, Wallet, BN } from '@coral-xyz/anchor'
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import IDL from './idl'

// Types from IDL
export interface GroupModel {
  basic?: {}
  trust?: {}
  superTrust?: {}
}

export interface GroupStatus {
  active?: {}
  paused?: {}
  completed?: {}
  cancelled?: {}
}

export interface GroupAccount {
  groupId: BN
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
  currentTurnStart: BN
  contributionAmount: BN
  totalPool: BN
  trustScore: number
  createdAt: BN
  bump: number
}

export interface MemberAccount {
  group: PublicKey
  user: PublicKey
  stakeAmount: BN
  contributedTurns: boolean[]
  missedCount: number
  trustDelta: number
  joinTimestamp: BN
  isCreator: boolean
  bump: number
}

export class OsemeProgram {
  public connection: Connection
  public program: Program<any> | null = null
  public wallet: Wallet | null = null
  private programId = new PublicKey('GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef')
  private usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') // Mainnet USDC

  constructor(connection?: Connection) {
    // Use devnet as fallback to prevent loading issues
    this.connection = connection || new Connection(
      'https://api.devnet.solana.com',
      { 
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 10000 // 10 second timeout
      }
    )
  }

  async initialize(wallet: Wallet): Promise<boolean> {
    try {
      if (!wallet?.publicKey) {
        console.warn('No wallet connected')
        return false
      }

      this.wallet = wallet
      const provider = new AnchorProvider(this.connection, wallet, {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed'
      })

      this.program = new Program(IDL as any, this.programId, provider)
      return true
    } catch (error) {
      console.error('Program initialization error:', error)
      return false
    }
  }

  // Safe wrapper for program calls
  private async safeCall<T, F>(operation: () => Promise<T>, fallback: F): Promise<T | F> {
    try {
      if (!this.program || !this.wallet?.publicKey) {
        return fallback
      }
      return await operation()
    } catch (error) {
      console.error('Program call error:', error)
      return fallback
    }
  }

  // Get platform config PDA
  getPlatformConfigPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('platform-config')],
      this.programId
    )
  }

  // Get group PDA
  getGroupPDA(groupId: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('group'),
        new BN(groupId).toArrayLike(Buffer, 'le', 8)
      ],
      this.programId
    )
  }

  // Get member PDA
  getMemberPDA(groupPubkey: PublicKey, userPubkey: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('member'),
        groupPubkey.toBuffer(),
        userPubkey.toBuffer()
      ],
      this.programId
    )
  }

  // Get escrow vault PDA
  getEscrowVaultPDA(groupPubkey: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('escrow'),
        groupPubkey.toBuffer()
      ],
      this.programId
    )
  }

  // Create a new group
  async createGroup(
    model: 'basic' | 'trust' | 'superTrust',
    contributionAmount: number,
    cycleDays?: number,
    memberCap?: number
  ): Promise<{ success: true; groupId: number; signature: string } | { success: false }> {
    return this.safeCall(async () => {
      if (!this.program || !this.wallet?.publicKey) {
        throw new Error('Program not initialized')
      }

      // Generate unique group ID
      const groupId = Math.floor(Date.now() / 1000)
      const [groupPDA] = this.getGroupPDA(groupId)
      const [platformConfigPDA] = this.getPlatformConfigPDA()

      const tx = await this.program.methods
        .createGroup(
          { [model.toLowerCase()]: {} },
          cycleDays || null,
          memberCap || null,
          new BN(contributionAmount * 1_000_000) // Convert to USDC minor units
        )
        .accounts({
          group: groupPDA,
          creator: this.wallet.publicKey,
          escrowVault: groupPDA, // Using group PDA as vault for simplicity
          platformConfig: platformConfigPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      return { success: true, groupId, signature: tx }
    }, { success: false })
  }

  // Join an existing group
  async joinGroup(groupId: number): Promise<{ success: true; signature: string } | { success: false }> {
    return this.safeCall(async () => {
      if (!this.program || !this.wallet?.publicKey) {
        throw new Error('Program not initialized')
      }

      const [groupPDA] = this.getGroupPDA(groupId)
      const [memberPDA] = this.getMemberPDA(groupPDA, this.wallet.publicKey)

      const tx = await this.program.methods
        .joinGroup()
        .accounts({
          group: groupPDA,
          member: memberPDA,
          user: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      return { success: true, signature: tx }
    }, { success: false })
  }

  // Make a contribution
  async contribute(groupId: number, amount: number): Promise<{ success: true; signature: string } | { success: false }> {
    return this.safeCall(async () => {
      if (!this.program || !this.wallet?.publicKey) {
        throw new Error('Program not initialized')
      }

      const [groupPDA] = this.getGroupPDA(groupId)
      const [memberPDA] = this.getMemberPDA(groupPDA, this.wallet.publicKey)
      const [escrowVaultPDA] = this.getEscrowVaultPDA(groupPDA)

      // Get token accounts
      const contributorTokenAccount = await getAssociatedTokenAddress(
        this.usdcMint,
        this.wallet.publicKey
      )
      const escrowTokenAccount = await getAssociatedTokenAddress(
        this.usdcMint,
        escrowVaultPDA,
        true
      )

      const tx = await this.program.methods
        .contribute(new BN(amount * 1e6)) // Convert to USDC units
        .accounts({
          group: groupPDA,
          member: memberPDA,
          contributor: this.wallet.publicKey,
          contributorTokenAccount,
          escrowVault: escrowVaultPDA,
          escrowTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()

      return { success: true, signature: tx }
    }, { success: false })
  }

  // Get group data
  async getGroup(groupId: number): Promise<GroupAccount | null> {
    return this.safeCall(async () => {
      if (!this.program) return null
      
      const [groupPDA] = this.getGroupPDA(groupId)
      const account = await this.program.account.group.fetch(groupPDA)
      return account as GroupAccount
    }, null)
  }

  // Get member data
  async getMember(groupId: number, userPubkey?: PublicKey): Promise<MemberAccount | null> {
    return this.safeCall(async () => {
      if (!this.program) return null
      
      const user = userPubkey || this.wallet?.publicKey
      if (!user) return null

      const [groupPDA] = this.getGroupPDA(groupId)
      const [memberPDA] = this.getMemberPDA(groupPDA, user)
      
      const account = await this.program.account.member.fetch(memberPDA)
      return account as MemberAccount
    }, null)
  }

  // Get all groups (mock implementation for demo)
  async getAllGroups(): Promise<GroupAccount[]> {
    return this.safeCall(async () => {
      // In a real implementation, this would fetch from program accounts
      // For now, return mock data to prevent loading issues
      return []
    }, [])
  }

  // Get user's groups
  async getUserGroups(_userPubkey?: PublicKey): Promise<GroupAccount[]> {
    return this.safeCall(async () => {
      // Mock implementation
      return []
    }, [])
  }

  // Check if user is member of group
  async isGroupMember(groupId: number, userPubkey?: PublicKey): Promise<boolean> {
    return this.safeCall(async () => {
      const member = await this.getMember(groupId, userPubkey)
      return member !== null
    }, false)
  }

  // Get group stats
  async getGroupStats(groupId: number): Promise<{
    totalContributions: number
    currentTurn: number
    nextPayoutDate: Date | null
    completionPercentage: number
  }> {
    return this.safeCall(async () => {
      const group = await this.getGroup(groupId)
      if (!group) {
        return {
          totalContributions: 0,
          currentTurn: 0,
          nextPayoutDate: null,
          completionPercentage: 0
        }
      }

      const totalContributions = group.totalPool.toNumber() / 1e6 // Convert from USDC units
      const currentTurn = group.currentTurnIndex
      const completionPercentage = (currentTurn / group.totalMembers) * 100
      
      // Calculate next payout date
      const turnStartMs = group.currentTurnStart.toNumber() * 1000
      const cycleDurationMs = group.cycleDays * 24 * 60 * 60 * 1000
      const nextPayoutDate = new Date(turnStartMs + cycleDurationMs)

      return {
        totalContributions,
        currentTurn,
        nextPayoutDate,
        completionPercentage
      }
    }, {
      totalContributions: 0,
      currentTurn: 0,
      nextPayoutDate: null,
      completionPercentage: 0
    })
  }
}