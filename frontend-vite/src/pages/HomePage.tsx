import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWallet, SimpleWalletButton } from '../components/MinimalWalletProvider'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const HomePage = () => {
  const { connected } = useWallet()
  const [stats, setStats] = useState({ totalSaved: 0, activeMembers: 0, groupsCreated: 0 })
  const [featuredGroups, setFeaturedGroups] = useState<any[]>([])

  useEffect(() => {
    const loadStats = async () => {
      // Load platform stats
      setStats({
        totalSaved: 2500000,
        activeMembers: 15000,
        groupsCreated: 500
      })

      // Load featured groups (mock data for now)
      setFeaturedGroups([
        {
          id: '1',
          name: 'Tech Builders Group',
          target: 10000,
          raised: 7500,
          members: 25,
          category: 'Technology',
          model: { basic: true }
        },
        {
          id: '2', 
          name: 'Small Business Fund',
          target: 5000,
          raised: 4200,
          members: 15,
          category: 'Business',
          model: { trust: true }
        },
        {
          id: '3',
          name: 'Education Pool',
          target: 8000,
          raised: 3500,
          members: 32,
          category: 'Education',
          model: { superTrust: true }
        }
      ])
    }

    loadStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatGroupModel = (model: any) => {
    if (model.basic) return 'Basic'
    if (model.trust) return 'Trust'
    if (model.superTrust) return 'Super Trust'
    return 'Unknown'
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
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-scale">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient">
              OSEME
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-in-up opacity-90">
            The decentralized platform for community-driven savings and investment groups. 
            Join thousands building wealth together on Solana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            {connected ? (
              <>
                <Link 
                  to="/create"
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 animate-glow shadow-lg"
                >
                  <span className="flex items-center gap-2">
                    ✨ Create Group
                  </span>
                </Link>
                <Link 
                  to="/groups"
                  className="border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Browse Groups →
                </Link>
              </>
            ) : (
              <>
                <SimpleWalletButton className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 animate-glow shadow-lg border-none" />
                <Link 
                  to="/groups"
                  className="border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Browse Groups →
                </Link>
              </>
            )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center animate-slide-in-left" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-card-hover">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2">
                  {formatCurrency(stats.totalSaved)}
                </div>
                <div className="text-gray-300 font-medium">Total Saved</div>
              </div>
            </div>
            <div className="text-center animate-fade-in-scale" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-card-hover">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 mb-2">
                  {stats.activeMembers.toLocaleString()}+
                </div>
                <div className="text-gray-300 font-medium">Active Members</div>
              </div>
            </div>
            <div className="text-center animate-slide-in-right" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-card-hover">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                  {stats.groupsCreated}+
                </div>
                <div className="text-gray-300 font-medium">Groups Created</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/20 relative z-10">
        <div className="absolute inset-0 grid-dots opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold text-white text-center mb-16 animate-fade-in-scale">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              OSEME
            </span>
            ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 animate-card-hover animate-slide-in-left group" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <div className="text-5xl mb-6 animate-bounce-subtle">🔒</div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">
                Secure & Trustless
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Built on Solana blockchain with smart contracts ensuring transparency and security.
              </p>
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded group-hover:w-full transition-all duration-500"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 animate-card-hover animate-fade-in-scale group" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <div className="text-5xl mb-6 animate-float">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                Fast & Low Cost
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Lightning-fast transactions with minimal fees thanks to Solana's efficiency.
              </p>
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded group-hover:w-full transition-all duration-500"></div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 animate-card-hover animate-slide-in-right group" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="text-5xl mb-6 animate-pulse-glow">👥</div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-300 transition-colors">
                Community Driven
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Join like-minded individuals in achieving financial goals together.
              </p>
              <div className="mt-4 w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded group-hover:w-full transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Groups */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-scale">
            <h2 className="text-4xl font-bold text-white mb-6">
              Featured{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Groups
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Join an existing group or create your own and start building wealth with your community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGroups.map((group, index) => {
              // Handle both real Solana data and mock data structures
              const totalPool = group.totalPool ? (group.totalPool.toNumber() / 1e6) : (group.target || 0)
              const contributionAmount = group.contributionAmount ? (group.contributionAmount.toNumber() / 1e6) : ((group.raised || 0) / (group.members || 1))
              const progress = group.currentTurnIndex && group.totalMembers 
                ? Math.min((group.currentTurnIndex / group.totalMembers) * 100, 100)
                : Math.min(((group.raised || 0) / (group.target || 1)) * 100, 100)
              
              return (
                <Link
                  key={index}
                  to={`/groups/${group.groupId ? group.groupId.toNumber() : group.id}`}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-card-hover cursor-pointer relative overflow-hidden animate-slide-in-up"
                  style={{ 
                    animationDelay: `${0.1 * index}s`, 
                    animationFillMode: 'both' 
                  }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors">
                                          <h3 className="text-xl font-semibold text-white mb-2 relative z-10 group-hover:text-blue-300 transition-colors">
                      {group.name || `${formatGroupModel(group.model)} Group #${group.groupId ? group.groupId.toNumber() : group.id}`}
                    </h3>
                    </h3>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                      {formatGroupModel(group.model)}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6 relative z-10 group-hover:text-gray-300 transition-colors">
                    {group.totalMembers || group.members || 0} / {group.memberCap || (group.members || 0) + 5} members
                  </p>
                  
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Pool Size</span>
                      <span className="text-white font-medium">{formatCurrency(totalPool)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Contribution</span>
                      <span className="text-white font-medium">{formatCurrency(contributionAmount)}</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 animate-pulse-glow relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-float"></div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-purple-400 font-medium">{progress.toFixed(1)}% complete</div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center relative z-10">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        group.trustScore >= 90 ? 'bg-green-400' :
                        group.trustScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                      } animate-pulse`}></div>
                      <span className="text-xs text-gray-400">
                        Trust: {group.trustScore}/100
                      </span>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30">
                      ● Active
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
          
          <div className="text-center mt-12 animate-fade-in-scale" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <Link 
              to="/groups"
              className="inline-flex items-center px-8 py-4 border border-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/10 hover:border-white/40 transition-all duration-300 text-lg font-medium group"
            >
              <span className="mr-2">View All Groups</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage