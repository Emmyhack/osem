import { Connection, PublicKey, SystemProgram } from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'

// Mock program for development - prevents loading issues
export class OsemeProgram {
  public connection: Connection
  private isInitialized = false

  constructor(connection?: Connection) {
    this.connection = connection || new Connection('https://api.devnet.solana.com', 'confirmed')
  }

  async initialize(wallet: any): Promise<boolean> {
    try {
      this.isInitialized = !!wallet?.publicKey
      return this.isInitialized
    } catch {
      return false
    }
  }

  // Mock group creation - returns success immediately
  async createGroup(
    model: 'basic' | 'trust' | 'superTrust',
    contributionAmount: number,
    cycleDays?: number,
    memberCap?: number
  ): Promise<{ success: boolean; groupId?: number; signature?: string }> {
    if (!this.isInitialized) {
      return { success: false }
    }

    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const groupId = Math.floor(Math.random() * 1000000)
    const mockSignature = `mock_tx_${Date.now()}`
    
    return { 
      success: true, 
      groupId, 
      signature: mockSignature 
    }
  }

  // Mock join group
  async joinGroup(groupId: number): Promise<{ success: boolean; signature?: string }> {
    if (!this.isInitialized) {
      return { success: false }
    }

    await new Promise(resolve => setTimeout(resolve, 800))
    return { 
      success: true, 
      signature: `mock_join_${groupId}_${Date.now()}` 
    }
  }

  // Mock contribution
  async contribute(groupId: number, amount: number): Promise<{ success: boolean; signature?: string }> {
    if (!this.isInitialized) {
      return { success: false }
    }

    await new Promise(resolve => setTimeout(resolve, 1200))
    return { 
      success: true, 
      signature: `mock_contrib_${groupId}_${amount}_${Date.now()}` 
    }
  }

  // Mock get group data
  async getGroup(groupId: number): Promise<any> {
    if (!this.isInitialized) return null

    // Return mock group data
    return {
      groupId: new BN(groupId),
      model: { basic: {} },
      creator: new PublicKey('11111111111111111111111111111112'),
      memberCap: 10,
      currentTurnIndex: 3,
      cycleDays: 7,
      payoutOrder: [
        new PublicKey('11111111111111111111111111111112'),
        new PublicKey('11111111111111111111111111111113'),
        new PublicKey('11111111111111111111111111111114'),
      ],
      status: { active: {} },
      totalMembers: 8,
      currentTurnStart: new BN(Date.now() / 1000),
      contributionAmount: new BN(100 * 1e6), // $100
      totalPool: new BN(800 * 1e6), // $800
      trustScore: 95,
      createdAt: new BN((Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000),
    }
  }

  // Mock get member data
  async getMember(groupId: number, userPubkey?: PublicKey): Promise<any> {
    if (!this.isInitialized) return null

    return {
      group: new PublicKey('11111111111111111111111111111112'),
      user: userPubkey || new PublicKey('11111111111111111111111111111112'),
      stakeAmount: new BN(50 * 1e6),
      contributedTurns: [true, true, true, false, false],
      missedCount: 0,
      trustDelta: 2,
      joinTimestamp: new BN((Date.now() - 20 * 24 * 60 * 60 * 1000) / 1000),
      isCreator: false,
    }
  }

  // Mock get all groups
  async getAllGroups(): Promise<any[]> {
    const mockGroups = []
    for (let i = 1; i <= 12; i++) {
      const progress = Math.floor(Math.random() * 100)
      const members = Math.floor(Math.random() * 50) + 5
      mockGroups.push({
        groupId: new BN(i),
        model: i % 3 === 0 ? { trust: {} } : i % 3 === 1 ? { superTrust: {} } : { basic: {} },
        creator: new PublicKey('11111111111111111111111111111112'),
        memberCap: Math.floor(Math.random() * 50) + 10,
        totalMembers: members,
        contributionAmount: new BN((Math.floor(Math.random() * 500) + 50) * 1e6),
        totalPool: new BN((Math.floor(Math.random() * 50000) + 5000) * 1e6),
        trustScore: Math.floor(Math.random() * 40) + 60,
        status: { active: {} },
        currentTurnIndex: Math.floor(progress / 10),
        cycleDays: 7,
        createdAt: new BN((Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) / 1000),
      })
    }
    return mockGroups
  }

  // Check if user is member
  async isGroupMember(groupId: number): Promise<boolean> {
    return this.isInitialized && Math.random() > 0.7 // 30% chance user is member
  }

  // Get group stats
  async getGroupStats(groupId: number): Promise<{
    totalContributions: number
    currentTurn: number
    nextPayoutDate: Date | null
    completionPercentage: number
  }> {
    const group = await this.getGroup(groupId)
    if (!group) {
      return {
        totalContributions: 0,
        currentTurn: 0,
        nextPayoutDate: null,
        completionPercentage: 0
      }
    }

    const totalContributions = group.totalPool.toNumber() / 1e6
    const currentTurn = group.currentTurnIndex
    const completionPercentage = Math.min((currentTurn / group.totalMembers) * 100, 100)
    
    const turnStartMs = group.currentTurnStart.toNumber() * 1000
    const cycleDurationMs = group.cycleDays * 24 * 60 * 60 * 1000
    const nextPayoutDate = new Date(turnStartMs + cycleDurationMs)

    return {
      totalContributions,
      currentTurn,
      nextPayoutDate,
      completionPercentage
    }
  }

  // Get user's groups
  async getUserGroups(): Promise<any[]> {
    const allGroups = await this.getAllGroups()
    return allGroups.slice(0, Math.floor(Math.random() * 5) + 1) // User is in 1-5 groups
  }
}