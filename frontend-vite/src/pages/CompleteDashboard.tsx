import { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useLightWallet'
import GroupCreation from '../components/GroupCreation'
import PaymentFlow from '../components/PaymentFlow'
import StakingInterface from '../components/StakingInterface'
import GroupsOverview from '../components/GroupsOverview'
// Using existing UI components from the project
const Card = ({ children, className = '', onClick, ...props }: any) => (
  <div className={`rounded-lg border ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick} {...props}>{children}</div>
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
import RealDataCharts from '../components/RealDataCharts'
import RealYieldOptimization from '../components/RealYieldOptimization'
import RealInsuranceReserve from '../components/RealInsuranceReserve'
import { GroupTier } from '../lib/CompleteOsemeProgram'

interface UserGroup {
  id: number
  tier: GroupTier
  contributionAmount: number
  creator: string
  maxMembers: number
  cycleDuration: number
  currentMembers: number
  isActive: boolean
  createdAt: Date
  userRole: 'creator' | 'member' | 'pending'
  nextPayoutDate?: Date
  totalCollected?: number
  hasStaked?: boolean
}

interface UserStats {
  totalContributed: number
  totalReceived: number
  activeGroups: number
  completedCycles: number
  stakingRewards: number
  insuranceCoverage: number
}

type ActiveTab = 'dashboard' | 'create' | 'groups' | 'analytics' | 'yield' | 'insurance'

const CompleteDashboard = () => {
  const { publicKey, connected } = useWallet()
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')
  const [userGroups, setUserGroups] = useState<UserGroup[]>([])
  const [userStats, setUserStats] = useState<UserStats>({
    totalContributed: 0,
    totalReceived: 0,
    activeGroups: 0,
    completedCycles: 0,
    stakingRewards: 0,
    insuranceCoverage: 0
  })
  const [pendingPayment, setPendingPayment] = useState<UserGroup | null>(null)
  const [pendingStaking, setPendingStaking] = useState<UserGroup | null>(null)

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (publicKey) {
        try {
          // Simulate loading user groups and stats
          const mockGroups: UserGroup[] = [
            {
              id: 1001,
              tier: GroupTier.Trust,
              contributionAmount: 250,
              creator: publicKey.toBase58(),
              maxMembers: 15,
              cycleDuration: 30,
              currentMembers: 8,
              isActive: true,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              userRole: 'creator',
              nextPayoutDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
              totalCollected: 2000,
              hasStaked: true
            },
            {
              id: 1002,
              tier: GroupTier.Basic,
              contributionAmount: 100,
              creator: 'other-user',
              maxMembers: 20,
              cycleDuration: 14,
              currentMembers: 12,
              isActive: true,
              createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
              userRole: 'member',
              nextPayoutDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              totalCollected: 1200,
              hasStaked: true
            }
          ]
          setUserGroups(mockGroups)

          const mockStats: UserStats = {
            totalContributed: 1250,
            totalReceived: 800,
            activeGroups: 2,
            completedCycles: 3,
            stakingRewards: 45.67,
            insuranceCoverage: 50000
          }
          setUserStats(mockStats)

        } catch (error) {
          console.error('Failed to load user data:', error)
        }
      }
    }

    loadUserData()
  }, [publicKey])

  const handleGroupCreated = (groupData: any) => {
    // Add new group to user groups
    const newGroup: UserGroup = {
      ...groupData,
      userRole: 'creator' as const,
      currentMembers: 1,
      hasStaked: false
    }
    setUserGroups(prev => [newGroup, ...prev])
    
    // Set up payment flow
    setPendingPayment(newGroup)
    setActiveTab('dashboard')
  }

  const handlePaymentComplete = () => {
    if (pendingPayment) {
      // Mark group as having payment completed and set up staking
      setPendingStaking(pendingPayment)
      setPendingPayment(null)
    }
  }

  const handleStakingComplete = () => {
    if (pendingStaking) {
      // Mark group as fully active
      setUserGroups(prev => prev.map(group => 
        group.id === pendingStaking.id 
          ? { ...group, hasStaked: true }
          : group
      ))
      setPendingStaking(null)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'create', label: 'Create Group', icon: '➕' },
    { id: 'groups', label: 'My Groups', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'yield', label: 'Yield Farming', icon: '🌾' },
    { id: 'insurance', label: 'Insurance', icon: '🛡️' }
  ]

  const getTierColor = (tier: GroupTier) => {
    switch (tier) {
      case GroupTier.Basic: return 'text-green-400'
      case GroupTier.Trust: return 'text-blue-400'
      case GroupTier.SuperTrust: return 'text-purple-400'
      case GroupTier.Premium: return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8 text-center max-w-md">
          <CardContent>
            <h1 className="text-2xl font-bold text-white mb-4">Welcome to OSEM</h1>
            <p className="text-gray-300 mb-6">
              Connect your wallet to access the complete savings and investment platform
            </p>
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-sm text-gray-400">
              Please connect your wallet using the button in the navigation
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
      {/* Navigation Tabs */}
      <div className="border-b border-white/20 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white bg-purple-500/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Pending Actions Banner */}
        {(pendingPayment || pendingStaking) && (
          <div className="max-w-7xl mx-auto mb-6">
            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <h3 className="text-white font-medium">Action Required</h3>
                      <p className="text-gray-300 text-sm">
                        {pendingPayment && 'Complete payment to join your group'}
                        {pendingStaking && 'Stake SOL to fully activate your group membership'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      if (pendingPayment) setActiveTab('dashboard')
                      if (pendingStaking) setActiveTab('dashboard')
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Complete Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Show pending flows */}
            {pendingPayment && (
              <PaymentFlow 
                groupData={pendingPayment} 
                onPaymentComplete={handlePaymentComplete}
              />
            )}
            
            {pendingStaking && !pendingPayment && (
              <StakingInterface 
                groupData={pendingStaking}
                onStakingComplete={handleStakingComplete}
              />
            )}

            {/* Normal dashboard when no pending actions */}
            {!pendingPayment && !pendingStaking && (
              <>
                {/* Welcome Header */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Welcome back! 👋
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Manage your savings groups, track earnings, and explore opportunities
                  </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">
                        ${userStats.totalContributed.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Contributed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        ${userStats.totalReceived.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Received</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {userStats.activeGroups}
                      </div>
                      <div className="text-sm text-gray-400">Active Groups</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {userStats.completedCycles}
                      </div>
                      <div className="text-sm text-gray-400">Completed</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {userStats.stakingRewards.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">SOL Rewards</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/5 border-white/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        ${userStats.insuranceCoverage.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Coverage</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Active Groups Summary */}
                {userGroups.length > 0 && (
                  <Card className="bg-white/5 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        👥 Your Active Groups
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userGroups.map((group) => (
                          <div key={group.id} className="p-4 bg-white/10 rounded-lg border border-white/20">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className={`font-semibold capitalize ${getTierColor(group.tier)}`}>
                                    {group.tier} Group #{group.id}
                                  </span>
                                  <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                                    {group.userRole}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="text-gray-400">Contribution</div>
                                    <div className="text-white font-medium">${group.contributionAmount}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">Members</div>
                                    <div className="text-white font-medium">
                                      {group.currentMembers}/{group.maxMembers}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">Next Payout</div>
                                    <div className="text-white font-medium">
                                      {group.nextPayoutDate?.toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">Status</div>
                                    <div className={`font-medium ${
                                      group.hasStaked ? 'text-green-400' : 'text-orange-400'
                                    }`}>
                                      {group.hasStaked ? '🟢 Active' : '🟡 Pending Stake'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => setActiveTab('groups')}
                                size="sm"
                                className="bg-purple-500 hover:bg-purple-600 text-white"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-500/30 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('create')}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">➕</div>
                      <h3 className="text-white font-semibold mb-2">Create New Group</h3>
                      <p className="text-gray-300 text-sm">Start a savings circle with friends</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border-blue-500/30 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('yield')}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">🌾</div>
                      <h3 className="text-white font-semibold mb-2">Yield Farming</h3>
                      <p className="text-gray-300 text-sm">Earn rewards on your deposits</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-purple-500/20 to-violet-600/20 border-purple-500/30 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('insurance')}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">🛡️</div>
                      <h3 className="text-white font-semibold mb-2">Insurance</h3>
                      <p className="text-gray-300 text-sm">Protect your investments</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-r from-orange-500/20 to-red-600/20 border-orange-500/30 cursor-pointer hover:scale-105 transition-transform" onClick={() => setActiveTab('analytics')}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">📈</div>
                      <h3 className="text-white font-semibold mb-2">Analytics</h3>
                      <p className="text-gray-300 text-sm">Track performance and trends</p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        )}

        {/* Other Tabs */}
        {activeTab === 'create' && (
          <GroupCreation onGroupCreated={handleGroupCreated} />
        )}
        
        {activeTab === 'groups' && (
          <GroupsOverview />
        )}
        
        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto">
            <RealDataCharts />
          </div>
        )}
        
        {activeTab === 'yield' && (
          <div className="max-w-7xl mx-auto">
            <RealYieldOptimization />
          </div>
        )}
        
        {activeTab === 'insurance' && (
          <div className="max-w-7xl mx-auto">
            <RealInsuranceReserve />
          </div>
        )}
      </div>
    </div>
  )
}

export default CompleteDashboard