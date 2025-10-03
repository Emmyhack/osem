import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../components/MinimalWalletProvider'
import NavigationIntegrated from '../components/NavigationIntegrated'
import Footer from '../components/Footer'
import RealYieldOptimization from '../components/RealYieldOptimization'
import RealInsuranceReserve from '../components/RealInsuranceReserve'
import { RealDataDashboard } from '../components/RealDataCharts'

const DashboardPage = () => {
  const { connected, publicKey, connect } = useWallet()
  const [userGroups, setUserGroups] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'yield' | 'insurance' | 'analytics'>('overview')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const loadDashboard = async () => {
      if (!connected || !publicKey) {
        return
      }

      try {
        // Mock data for now - replace with actual Solana program calls later
        setUserGroups([
          {
            id: '1',
            name: 'Tech Builders Group',
            members: 25,
            target: 10000,
            raised: 7500,
            status: 'active'
          },
          {
            id: '2', 
            name: 'DeFi Savers',
            members: 15,
            target: 5000,
            raised: 5000,
            status: 'completed'
          }
        ])
        
        // Mock balance - replace with actual balance fetch
        setBalance(12.34)
      } catch (error) {
        console.error('Error loading dashboard:', error)
      }
    }

    loadDashboard()
  }, [connected, publicKey])

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Dark Theme with Colorful Stars */}
        <div className="absolute inset-0 stars-background"></div>
        <div className="absolute inset-0 stars-background-large opacity-60"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="absolute inset-0 grid-background-fine opacity-40"></div>
        <div className="absolute inset-0 grid-dots opacity-20"></div>
        
        {/* Subtle Dark Overlays for Depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30"></div>
        
        <NavigationIntegrated />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center animate-fade-in-scale animate-glow">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-8 animate-pulse-glow flex items-center justify-center text-4xl">
              📊
            </div>
            <h1 className="text-4xl font-bold text-white mb-6 animate-slide-in-up">
              Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-300 mb-8 text-lg animate-slide-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              Connect your wallet to view your groups and activity
            </p>
            <button
              onClick={connect}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 animate-glow shadow-lg animate-slide-in-up"
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
      
      {/* Subtle Dark Overlays for Depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30"></div>
      
      <NavigationIntegrated />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8 animate-slide-in-up">
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-300 text-xl">Manage your groups and track your contributions</p>
          <div className="mt-6 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl animate-glow">
            <p className="text-blue-200 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <span>
                <strong className="text-white">Connected</strong> | 
                <strong className="text-white"> Balance:</strong> {balance} SOL
              </span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-slide-in-up animate-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Groups</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-purple-400">{userGroups.length}</p>
            <p className="text-sm text-gray-400">Groups you're participating in</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-slide-in-up animate-glow" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Contributed</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-green-400">${(Math.random() * 5000 + 1000).toFixed(0)}</p>
            <p className="text-sm text-gray-400">Across all groups</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-slide-in-up animate-glow" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Received</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-blue-400">${(Math.random() * 3000 + 500).toFixed(0)}</p>
            <p className="text-sm text-gray-400">From payouts</p>
          </div>
        </div>

        {/* Navigation Tabs */}
                  <nav className="flex space-x-8 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'groups' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              My Groups
            </button>
            <button
              onClick={() => setActiveTab('yield')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'yield' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              🚀 Yield Optimization
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'insurance' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              🛡️ Insurance Reserve
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'analytics' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              📊 Live Analytics
            </button>
          </nav>

        {/* Tab Content */}
        <div className="animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 animate-glow">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    📈 Recent Activity
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-purple-400">Recent Contributions</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-gray-300">Tech Professionals Group</span>
                          <span className="text-green-400 font-semibold">+$250.00</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-gray-300">Students Support Circle</span>
                          <span className="text-green-400 font-semibold">+$75.00</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-300">Business Network</span>
                          <span className="text-green-400 font-semibold">+$500.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-blue-400">Yield Earnings</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-gray-300">Marinade Staking</span>
                          <span className="text-blue-400 font-semibold">+$12.45</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                          <span className="text-gray-300">Jupiter Perps</span>
                          <span className="text-blue-400 font-semibold">+$23.80</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-300">Kamino Lending</span>
                          <span className="text-blue-400 font-semibold">+$8.92</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 animate-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-purple-400">💎</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">8.7%</div>
                      <div className="text-sm text-purple-400">Average Yield</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 animate-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-green-400">🛡️</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">100%</div>
                      <div className="text-sm text-green-400">Insured Funds</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 animate-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-blue-400">⚡</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">24/7</div>
                      <div className="text-sm text-blue-400">Monitoring</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-orange-500/20 animate-glow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-orange-400">🎯</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-sm text-orange-400">Active Strategies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 animate-glow">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">Your Groups</h2>
                <p className="text-gray-300">Manage your group participations and contributions</p>
              </div>

              <div className="p-6">
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
                            <p className="text-purple-400 font-semibold">${(group.contributionAmount.toNumber() / 1e6).toFixed(2)}/month</p>
                            <p className="text-gray-400 text-sm">{group.totalMembers} members</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                      📋
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No Groups Yet</h3>
                    <p className="text-gray-400 mb-4">Join or create your first group to get started</p>
                    <Link to="/groups" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all inline-block">
                      Browse Groups
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'yield' && <RealYieldOptimization />}
          
          {activeTab === 'insurance' && <RealInsuranceReserve />}
          
          {activeTab === 'analytics' && <RealDataDashboard />}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default DashboardPage