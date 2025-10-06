import { useState, useEffect } from 'react'
import { useWallet } from './useLightWallet'
import { GroupModel, GroupStatus } from '../lib/solana'
import SolanaYieldService from '../services/solanaYieldService'
import SolanaInsuranceService from '../services/solanaInsuranceService'

// Updated interface to match contract structure with yield optimization
interface OsemeGroup {
  id: string
  name: string
  description: string
  model: GroupModel
  targetAmount: number
  currentAmount: number
  participantCount: number
  maxParticipants: number
  contributionAmount: number
  cycleDays: number
  status: GroupStatus
  createdAt: Date
  nextPayoutDate: Date
  participants: string[]
  creator: string
  trustScore: number
  // Yield optimization features
  yieldEarned: number
  yieldAPY: number
  totalYieldGenerated: number
  idleFundsInvested: number
  // Insurance features
  insuranceCoverage: number
  insuranceContribution: number
  riskLevel: 'Low' | 'Medium' | 'High'
}

interface CreateGroupData {
  name: string
  description: string
  model: GroupModel
  contributionAmount: number
  cycleDays?: number
  memberCap?: number
}

interface UseOsemeGroupReturn {
  groups: OsemeGroup[]
  loading: boolean
  error: string | null
  createGroup: (groupData: CreateGroupData) => Promise<string | null>
  joinGroup: (groupId: string) => Promise<boolean>
  contribute: (groupId: string, amount: number) => Promise<boolean>
  refresh: () => Promise<void>
}

export function useOsemeGroup(): UseOsemeGroupReturn {
  const { publicKey } = useWallet()
  const [groups, setGroups] = useState<OsemeGroup[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize real-time services
  const yieldService = new SolanaYieldService()
  const insuranceService = new SolanaInsuranceService()

  // Mock data with yield optimization and insurance features
  const mockGroups: OsemeGroup[] = [
    {
      id: '1',
      name: 'Tech Professionals Savings',
      description: 'Monthly savings group for tech professionals with yield optimization',
      model: GroupModel.Trust,
      targetAmount: 10000,
      currentAmount: 7500,
      participantCount: 15,
      maxParticipants: 20,
      contributionAmount: 500,
      cycleDays: 30,
      status: GroupStatus.Active,
      createdAt: new Date('2024-01-15'),
      nextPayoutDate: new Date('2024-02-15'),
      participants: [],
      creator: '11111111111111111111111111111111',
      trustScore: 95,
      // Yield optimization
      yieldEarned: 234.50,
      yieldAPY: 8.2,
      totalYieldGenerated: 567.80,
      idleFundsInvested: 6200,
      // Insurance
      insuranceCoverage: 95,
      insuranceContribution: 75.00,
      riskLevel: 'Low',
    },
    {
      id: '2',
      name: 'Student Emergency Fund',
      description: 'Weekly savings with conservative yield strategy',
      model: GroupModel.Basic,
      targetAmount: 5000,
      currentAmount: 3200,
      participantCount: 8,
      maxParticipants: 10,
      contributionAmount: 100,
      cycleDays: 7,
      status: GroupStatus.Active,
      createdAt: new Date('2024-01-20'),
      nextPayoutDate: new Date('2024-02-10'),
      participants: [],
      creator: '22222222222222222222222222222222',
      trustScore: 88,
      // Yield optimization
      yieldEarned: 64.20,
      yieldAPY: 5.1,
      totalYieldGenerated: 128.40,
      idleFundsInvested: 2800,
      // Insurance
      insuranceCoverage: 90,
      insuranceContribution: 32.00,
      riskLevel: 'Low',
    },
    {
      id: '3',
      name: 'Small Business Owners',
      description: 'High-yield investment strategy for business growth',
      model: GroupModel.SuperTrust,
      targetAmount: 25000,
      currentAmount: 18750,
      participantCount: 25,
      maxParticipants: 25,
      contributionAmount: 1000,
      cycleDays: 30,
      status: GroupStatus.Active,
      createdAt: new Date('2024-01-10'),
      nextPayoutDate: new Date('2024-02-20'),
      participants: [],
      creator: '33333333333333333333333333333333',
      trustScore: 100,
      // Yield optimization
      yieldEarned: 892.30,
      yieldAPY: 12.5,
      totalYieldGenerated: 1784.60,
      idleFundsInvested: 15600,
      // Insurance
      insuranceCoverage: 98,
      insuranceContribution: 187.50,
      riskLevel: 'Medium',
    },
  ]

  const fetchGroups = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch real-time yield and insurance data
      const [_yieldData, _insuranceData, yieldStrategies] = await Promise.all([
        yieldService.fetchYieldData(),
        insuranceService.fetchInsuranceData(),
        yieldService.getStrategies()
      ])

      // Update mock groups with real-time data
      const updatedGroups = await Promise.all(mockGroups.map(async (group) => {
        // Calculate real yield earnings based on group funds and time
        const daysActive = Math.floor((Date.now() - group.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        const realYieldEarned = yieldService.calculateYieldEarnings(group.currentAmount, daysActive)
        
        // Get real-time APY based on group model
        const modelAPYs = yieldStrategies.reduce((sum, strategy) => sum + strategy.apy, 0) / yieldStrategies.length
        const groupAPY = group.model === GroupModel.SuperTrust ? modelAPYs + 2 :
                        group.model === GroupModel.Trust ? modelAPYs :
                        modelAPYs - 1

        // Calculate insurance coverage with real-time risk assessment
        const realCoverage = insuranceService.calculateCoverage(group.currentAmount, group.riskLevel)
        const coveragePercentage = Math.min(98, (realCoverage / group.currentAmount) * 100)

        return {
          ...group,
          yieldEarned: realYieldEarned,
          yieldAPY: Math.max(0, groupAPY),
          totalYieldGenerated: realYieldEarned * 1.5, // Cumulative over time
          idleFundsInvested: group.currentAmount * 0.85, // 85% of funds invested
          insuranceCoverage: coveragePercentage,
          insuranceContribution: (group.currentAmount * 0.005), // 0.5% monthly contribution
        }
      }))

      setGroups(updatedGroups)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch real-time data')
      console.error('Error fetching groups with real-time data:', err)
      
      // Fallback to mock data if real-time fails
      setGroups(mockGroups)
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async (groupData: CreateGroupData): Promise<string | null> => {
    if (!publicKey) {
      setError('Wallet not connected')
      return null
    }

    try {
      console.log('Creating group:', groupData)
      
      // Mock implementation for development
      const getDefaultAPY = (model: GroupModel) => {
        switch (model) {
          case GroupModel.Basic: return 4.5 + Math.random() * 2 // 4.5-6.5%
          case GroupModel.Trust: return 6.5 + Math.random() * 3 // 6.5-9.5%
          case GroupModel.SuperTrust: return 9.5 + Math.random() * 4 // 9.5-13.5%
          default: return 5.0
        }
      }

      const getRiskLevel = (model: GroupModel): 'Low' | 'Medium' | 'High' => {
        switch (model) {
          case GroupModel.Basic: return 'Low'
          case GroupModel.Trust: return 'Low'
          case GroupModel.SuperTrust: return 'Medium'
          default: return 'Low'
        }
      }

      const newGroup: OsemeGroup = {
        id: Math.random().toString(36).substr(2, 9),
        name: groupData.name,
        description: groupData.description,
        model: groupData.model,
        targetAmount: groupData.contributionAmount * (groupData.memberCap || 10),
        currentAmount: 0,
        participantCount: 1,
        maxParticipants: groupData.memberCap || 10,
        contributionAmount: groupData.contributionAmount,
        cycleDays: groupData.cycleDays || (groupData.model === GroupModel.Basic ? 7 : 30),
        status: GroupStatus.Active,
        createdAt: new Date(),
        nextPayoutDate: new Date(Date.now() + (groupData.cycleDays || 30) * 24 * 60 * 60 * 1000),
        participants: [publicKey.toString()],
        creator: publicKey.toString(),
        trustScore: 100,
        // Yield optimization - new groups start with 0 yield
        yieldEarned: 0,
        yieldAPY: getDefaultAPY(groupData.model),
        totalYieldGenerated: 0,
        idleFundsInvested: 0,
        // Insurance - coverage based on model
        insuranceCoverage: groupData.model === GroupModel.SuperTrust ? 98 : 
                          groupData.model === GroupModel.Trust ? 95 : 90,
        insuranceContribution: 0,
        riskLevel: getRiskLevel(groupData.model),
      }

      setGroups(prev => [...prev, newGroup])
      return newGroup.id
    } catch (err: any) {
      setError(err.message || 'Failed to create group')
      console.error('Error creating group:', err)
      return null
    }
  }

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!publicKey) {
      setError('Wallet not connected')
      return false
    }

    try {
      console.log('Joining group:', groupId)
      
      // Mock implementation for development
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { 
              ...group, 
              participantCount: group.participantCount + 1,
              participants: [...group.participants, publicKey.toString()]
            }
          : group
      ))
      
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to join group')
      console.error('Error joining group:', err)
      return false
    }
  }

  const contribute = async (groupId: string, amount: number): Promise<boolean> => {
    if (!publicKey) {
      setError('Wallet not connected')
      return false
    }

    try {
      console.log('Contributing to group:', groupId, 'amount:', amount)
      
      // Mock implementation for development
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, currentAmount: group.currentAmount + amount }
          : group
      ))
      
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to contribute')
      console.error('Error contributing:', err)
      return false
    }
  }

  useEffect(() => {
    fetchGroups()
  }, []) // No dependencies needed for mock

  return {
    groups,
    loading,
    error,
    createGroup,
    joinGroup,
    contribute,
    refresh: fetchGroups,
  }
}