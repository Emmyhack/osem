import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useWallet } from '../hooks/useWalletProvider'
import NavigationIntegrated from '../components/NavigationIntegrated'
import Footer from '../components/Footer'

const GroupsPage = () => {
  const { connected, program, connect } = useWallet()
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'basic' | 'trust' | 'superTrust'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadGroups = async () => {
      if (!program) {
        setLoading(false)
        return
      }

      try {
        const allGroups = await program.getAllGroups()
        setGroups(allGroups)
      } catch (error) {
        console.error('Error loading groups:', error)
      } finally {
        setLoading(false)
      }
    }

    loadGroups()
  }, [program])

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

  const getModelColor = (model: any) => {
    if (model.basic) return 'bg-blue-500/20 text-blue-300'
    if (model.trust) return 'bg-purple-500/20 text-purple-300'
    if (model.superTrust) return 'bg-pink-500/20 text-pink-300'
    return 'bg-gray-500/20 text-gray-300'
  }

  const filteredGroups = groups.filter(group => {
    const matchesFilter = filter === 'all' || 
      (filter === 'basic' && group.model.basic) ||
      (filter === 'trust' && group.model.trust) ||
      (filter === 'superTrust' && group.model.superTrust)
    
    const matchesSearch = searchTerm === '' || 
      group.groupId.toString().includes(searchTerm.toLowerCase()) ||
      formatGroupModel(group.model).toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  return (
          <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Dark Theme with Colorful Stars */}
        <div className="absolute inset-0 stars-background"></div>
        <div className="absolute inset-0 stars-background-large opacity-60"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="absolute inset-0 grid-dots opacity-30"></div>
        
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-transparent to-gray-800/60"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-32 left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-60 right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-xl animate-bounce-subtle"></div>
      <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow"></div>
      
      <NavigationIntegrated />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Savings Groups</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Join rotating savings groups or create your own. Build wealth together through community-driven savings.
          </p>
          
          {connected ? (
            <Link
              to="/create"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all"
            >
              <span className="mr-2">➕</span>
              Create New Group
            </Link>
          ) : (
            <button
              onClick={connect}
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Connect Wallet to Create Group
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-96">
              <input
                type="text"
                placeholder="Search by group ID or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-white/10 rounded-lg p-1">
              {[
                { id: 'all', label: 'All Groups' },
                { id: 'basic', label: 'Basic' },
                { id: 'trust', label: 'Trust' },
                { id: 'superTrust', label: 'Super Trust' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === tab.id
                      ? 'bg-white text-gray-900'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
                <div className="h-6 bg-white/10 rounded mb-4"></div>
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3 mb-4"></div>
                <div className="h-2 bg-white/10 rounded mb-4"></div>
                <div className="h-10 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm ? 'No groups found matching your search' : 'No groups available'}
            </div>
            {connected && (
              <Link
                to="/create"
                className="inline-flex items-center px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Create the First Group
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group, index) => {
              const totalPool = group.totalPool.toNumber() / 1e6
              const contributionAmount = group.contributionAmount.toNumber() / 1e6
              const progress = Math.min((group.currentTurnIndex / group.totalMembers) * 100, 100)
              const daysAgo = Math.floor((Date.now() - group.createdAt.toNumber() * 1000) / (24 * 60 * 60 * 1000))
              
              return (
                <Link
                  key={index}
                  to={`/groups/${group.groupId.toNumber()}`}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {formatGroupModel(group.model)} Group #{group.groupId.toNumber()}
                      </h3>
                      <p className="text-gray-400 text-sm">Created {daysAgo} days ago</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${getModelColor(group.model)}`}>
                      {formatGroupModel(group.model)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Contribution Amount</span>
                      <span className="text-white font-medium">{formatCurrency(contributionAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Pool Size</span>
                      <span className="text-white font-medium">{formatCurrency(totalPool)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Members</span>
                      <span className="text-white font-medium">
                        {group.totalMembers} / {group.memberCap}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Trust Score</span>
                      <span className={`font-medium ${
                        group.trustScore >= 90 ? 'text-green-400' :
                        group.trustScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {group.trustScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">{progress.toFixed(1)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Turn {group.currentTurnIndex + 1} of {group.totalMembers}
                    </span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                      Active
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && filteredGroups.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all">
              Load More Groups
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default GroupsPage