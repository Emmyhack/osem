import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../components/MinimalWalletProvider'
import NavigationIntegrated from '../components/NavigationIntegrated'
import Footer from '../components/Footer'

const ProfilePageIntegrated = () => {
  const { connected, publicKey, connect } = useWallet()
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'activity' | 'settings'>('overview')
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState(0)
  const [userGroups, setUserGroups] = useState<any[]>([])
  const [userStats] = useState({
    totalContributed: 0,
    totalReceived: 0,
    activeGroups: 0,
    completedGroups: 0,
    joinDate: 'January 2024',
    streak: 42,
    totalYieldEarned: 567.80,
    currentAPY: 8.7,
    insuranceCoverage: 12500,
    monthlyYield: 45.23
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (connected && publicKey) {
          // Mock user groups data
          const groups = [
            {
              id: '1',
              name: 'Tech Builders Group',
              members: 25,
              target: 10000,
              raised: 7500,
              status: 'active',
              userRole: 'member'
            },
            {
              id: '2',
              name: 'DeFi Savers',
              members: 15,
              target: 5000,
              raised: 5000,
              status: 'completed',
              userRole: 'creator'
            }
          ]
          setUserGroups(groups)
          
          // Mock balance
          setBalance(12.34)
        }
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }

    loadUserData()
  }, [connected, publicKey])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const mockActivities = [
    { type: 'contribution', group: 'Tech Savings Group', amount: 150, date: '2 hours ago', status: 'completed' },
    { type: 'payout', group: 'Emergency Fund Circle', amount: 800, date: '1 day ago', status: 'received' },
    { type: 'join', group: 'Vacation Fund', amount: 0, date: '3 days ago', status: 'joined' },
    { type: 'contribution', group: 'Investment Club', amount: 200, date: '1 week ago', status: 'completed' },
    { type: 'achievement', group: 'Platform', amount: 0, date: '2 weeks ago', status: 'earned' }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution': return '💰'
      case 'payout': return '🎯'
      case 'join': return '🤝'
      case 'achievement': return '🏆'
      default: return '📊'
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Dark Theme with Colorful Stars */}
        <div className="absolute inset-0 stars-background"></div>
        <div className="absolute inset-0 stars-background-large opacity-60"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="absolute inset-0 grid-background-fine opacity-40"></div>
        <div className="absolute inset-0 grid-dots opacity-20"></div>
        
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-transparent to-gray-800/60"></div>
        
        <NavigationIntegrated />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center animate-fade-in-scale animate-glow">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto mb-8 animate-pulse-glow flex items-center justify-center text-4xl">
              👤
            </div>
            <h1 className="text-4xl font-bold text-white mb-6 animate-slide-in-up">
              Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Profile
              </span>
            </h1>
            <p className="text-gray-300 mb-8 text-lg animate-slide-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              Connect your wallet to access your profile and manage your account
            </p>
            <button
              onClick={connect}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 animate-glow shadow-lg animate-slide-in-up"
              style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
            >
              <span className="flex items-center gap-2">
                🔗 Connect Wallet
              </span>
            </button>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Theme with Colorful Stars */}
      <div className="absolute inset-0 stars-background"></div>
      <div className="absolute inset-0 stars-background-large opacity-60"></div>
      <div className="absolute inset-0 grid-background"></div>
      <div className="absolute inset-0 grid-background-fine opacity-40"></div>
      <div className="absolute inset-0 grid-dots opacity-20"></div>
      
      {/* Subtle Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-transparent to-gray-800/60"></div>
      
      <NavigationIntegrated />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Profile Header */}
        <div className="mb-8 animate-slide-in-up">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 animate-glow">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-3xl animate-pulse-glow">
                  👤
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Your Profile
                    </span>
                  </h1>
                  <p className="text-gray-300 mb-2">Member since {userStats.joinDate}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">
                      🔗 {publicKey ? formatAddress(publicKey.toString()) : 'Connected'}
                    </span>
                    <span className="text-gray-400">Balance: {balance} SOL</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-emerald-500/20 animate-glow">
                  <div className="text-2xl font-bold text-emerald-400">
                    {showBalance ? formatCurrency(userStats.totalContributed) : '****'}
                  </div>
                  <div className="text-xs text-gray-300">Total Contributed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-teal-500/20 animate-glow">
                  <div className="text-2xl font-bold text-teal-400">{userStats.activeGroups}</div>
                  <div className="text-xs text-gray-300">Active Groups</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-purple-500/20 animate-glow">
                  <div className="text-2xl font-bold text-purple-400">{userStats.currentAPY}%</div>
                  <div className="text-xs text-gray-300">Current APY</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-cyan-500/20 animate-glow">
                  <div className="text-2xl font-bold text-cyan-400">{userStats.completedGroups}</div>
                  <div className="text-xs text-gray-300">Completed</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-violet-500/20 animate-glow">
                  <div className="text-2xl font-bold text-violet-400">{userStats.streak}</div>
                  <div className="text-xs text-gray-300">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex overflow-x-auto">
              {[
                { id: 'overview' as const, label: 'Overview', icon: '📊' },
                { id: 'groups' as const, label: 'My Groups', icon: '👥' },
                { id: 'activity' as const, label: 'Activity', icon: '⚡' },
                { id: 'settings' as const, label: 'Settings', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    📈 Financial Overview
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400 mb-2">
                        {showBalance ? formatCurrency(userStats.totalContributed) : '****'}
                      </div>
                      <div className="text-gray-300">Total Contributed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-2">
                        {showBalance ? formatCurrency(userStats.totalReceived) : '****'}
                      </div>
                      <div className="text-gray-300">Total Received</div>
                    </div>
                  </div>
                  
                  {/* Yield & Insurance Stats */}
                  <div className="border-t border-white/10 pt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400">🚀</span>
                            <span className="text-sm font-medium text-white">Yield Earnings</span>
                          </div>
                          <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">+8.7% APY</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-400 mb-1">
                          {showBalance ? formatCurrency(567.80) : '****'}
                        </div>
                        <div className="text-xs text-gray-400">This month: +{formatCurrency(45.23)}</div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 border border-green-500/20">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">🛡️</span>
                            <span className="text-sm font-medium text-white">Insurance Coverage</span>
                          </div>
                          <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">100%</span>
                        </div>
                        <div className="text-2xl font-bold text-green-400 mb-1">
                          {showBalance ? formatCurrency(12500) : '****'}
                        </div>
                        <div className="text-xs text-gray-400">Risk Level: Low</div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="mt-6 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {showBalance ? '👁️ Hide Balance' : '🔒 Show Balance'}
                  </button>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    ⚡ Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {mockActivities.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-white capitalize">{activity.type}</div>
                              <div className="text-sm text-gray-400">{activity.group}</div>
                            </div>
                            <div className="text-right">
                              {activity.amount > 0 && (
                                <div className="font-bold text-emerald-400">
                                  {formatCurrency(activity.amount)}
                                </div>
                              )}
                              <div className="text-xs text-gray-500">{activity.date}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🚀 Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Link 
                      to="/groups"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      👥 Browse Groups
                    </Link>
                    <Link 
                      to="/create"
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      ➕ Create Group
                    </Link>
                    <Link 
                      to="/dashboard"
                      className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      📊 Dashboard
                    </Link>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🏆 Achievements
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <div className="font-medium text-white">Early Adopter</div>
                        <div className="text-sm text-gray-400">First 1000 users</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
                      <span className="text-2xl">💎</span>
                      <div>
                        <div className="font-medium text-white">Consistent Saver</div>
                        <div className="text-sm text-gray-400">{userStats.streak}-day streak</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                👥 My Groups
              </h2>
              
              {userGroups.length > 0 ? (
                <div className="space-y-4">
                  {userGroups.map((group, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">{group.name}</h3>
                          <p className="text-gray-400 text-sm">{group.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-semibold">${(group.contributionAmount.toNumber() / 1e6).toFixed(2)}/month</p>
                          <p className="text-gray-400 text-sm">{group.totalMembers} members</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Groups Yet</h3>
                  <p className="text-gray-400 mb-6">Join or create your first group to get started</p>
                  <Link 
                    to="/groups"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
                  >
                    Browse Groups
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                ⚡ Activity History
              </h2>
              <div className="space-y-4">
                {mockActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                    <span className="text-3xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white capitalize">{activity.type}</div>
                          <div className="text-sm text-gray-400">{activity.group}</div>
                        </div>
                        <div className="text-right">
                          {activity.amount > 0 && (
                            <div className="font-bold text-emerald-400">
                              {formatCurrency(activity.amount)}
                            </div>
                          )}
                          <div className="text-xs text-gray-500">{activity.date}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  🔔 Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Email Notifications</div>
                      <div className="text-sm text-gray-400">Receive updates via email</div>
                    </div>
                    <button className="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-all"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Push Notifications</div>
                      <div className="text-sm text-gray-400">Browser notifications</div>
                    </div>
                    <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-all"></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  🛡️ Privacy & Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Show Balance</div>
                      <div className="text-sm text-gray-400">Display your savings amounts</div>
                    </div>
                    <button 
                      onClick={() => setShowBalance(!showBalance)}
                      className={`w-12 h-6 rounded-full relative ${showBalance ? 'bg-emerald-500' : 'bg-gray-600'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${showBalance ? 'right-0.5' : 'left-0.5'}`}></div>
                    </button>
                  </div>
                  <button className="w-full text-left p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="font-medium text-white">Two-Factor Authentication</div>
                    <div className="text-sm text-gray-400">Add extra security to your account</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ProfilePageIntegrated