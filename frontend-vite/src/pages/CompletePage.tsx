import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Zap, ArrowRight, Users, DollarSign, Globe, TrendingUp, Shield, Rocket, Heart, Star, ChevronRight } from 'lucide-react'

const CompletePage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const connectWallet = () => {
    setWalletConnected(!walletConnected)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* NAVIGATION */}
      <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Oseme</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-blue-400 font-medium">Home</Link>
              <Link to="/groups" className="text-gray-300 hover:text-white font-medium">Groups</Link>
              <Link to="/about" className="text-gray-300 hover:text-white font-medium">About</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white font-medium">Profile</Link>
              <button
                onClick={connectWallet}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  walletConnected 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {walletConnected ? 'Connected' : 'Connect Wallet'}
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-blue-400 font-medium">Home</Link>
                <Link to="/groups" className="text-gray-300 hover:text-white font-medium">Groups</Link>
                <Link to="/about" className="text-gray-300 hover:text-white font-medium">About</Link>
                <Link to="/profile" className="text-gray-300 hover:text-white font-medium">Profile</Link>
                <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg w-full">
                  {walletConnected ? 'Connected' : 'Connect Wallet'}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-black overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent leading-tight">
                Build Wealth Together
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Join rotating savings groups on Solana. Pool funds with trusted members, 
                earn interest, and achieve your financial goals through community-powered savings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                  <span>Start Your First Group</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-600 hover:border-blue-500 text-white font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-600/10 transition-all duration-300">
                  Explore Groups
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {[
                  { value: '$2.1M+', label: 'Total Value Locked', icon: DollarSign, color: 'text-green-400' },
                  { value: '50K+', label: 'Active Members', icon: Users, color: 'text-blue-400' },
                  { value: '1,200+', label: 'Active Groups', icon: Globe, color: 'text-purple-400' },
                  { value: '98.5%', label: 'Success Rate', icon: TrendingUp, color: 'text-yellow-400' }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className={`w-16 h-16 ${stat.color.replace('text-', 'bg-').replace('400', '500/20')} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent"></div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-gray-900 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Why Choose Oseme?
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience the power of decentralized savings with transparency, security, and community support.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: 'Secure & Transparent',
                  description: 'All transactions are recorded on the Solana blockchain, ensuring complete transparency and security for every member.',
                  color: 'blue'
                },
                {
                  icon: Rocket,
                  title: 'Fast & Low Cost',
                  description: 'Leverage Solana\'s lightning-fast speed and ultra-low fees for efficient group savings with minimal transaction costs.',
                  color: 'green'
                },
                {
                  icon: Heart,
                  title: 'Community Driven',
                  description: 'Build trust and achieve financial goals together with like-minded individuals in your community worldwide.',
                  color: 'purple'
                }
              ].map((feature, index) => (
                <div key={index} className="group">
                  <div className={`bg-gradient-to-br from-gray-800 to-gray-900 p-10 rounded-3xl hover:from-gray-700 hover:to-gray-800 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl border border-gray-700 hover:border-${feature.color}-500/50`}>
                    <div className={`w-20 h-20 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GROUPS OVERVIEW SECTION */}
        <section className="py-24 bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
                Active Groups
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join thousands of active savings groups or create your own. Start building wealth with your community today.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              {[
                { name: 'Tech Professionals', members: '24/30', amount: '$15,000', progress: 75, category: 'Professional' },
                { name: 'Young Entrepreneurs', members: '18/20', amount: '$8,500', progress: 90, category: 'Business' },
                { name: 'Family Savers', members: '12/15', amount: '$22,000', progress: 60, category: 'Family' },
                { name: 'Student Circle', members: '28/30', amount: '$5,200', progress: 85, category: 'Education' },
                { name: 'Real Estate Investors', members: '15/20', amount: '$45,000', progress: 40, category: 'Investment' },
                { name: 'Creative Community', members: '20/25', amount: '$12,800', progress: 70, category: 'Creative' }
              ].map((group, index) => (
                <div key={index} className="bg-gray-900 p-8 rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border border-gray-700 hover:border-blue-500/50 group">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {group.name}
                      </h3>
                      <span className="text-sm px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                        {group.category}
                      </span>
                    </div>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Members</span>
                      <span className="text-white font-medium">{group.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pool Amount</span>
                      <span className="text-green-400 font-bold">{group.amount}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-blue-400">{group.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                    <span>Join Group</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/groups" className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 border border-gray-600 hover:border-blue-500">
                <span>View All Groups</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-black py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Oseme</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Building the future of decentralized savings, one group at a time.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6">Platform</h4>
                <ul className="space-y-3">
                  <li><Link to="/groups" className="text-gray-400 hover:text-white transition-colors">Browse Groups</Link></li>
                  <li><Link to="/groups" className="text-gray-400 hover:text-white transition-colors">Create Group</Link></li>
                  <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6">Resources</h4>
                <ul className="space-y-3">
                  <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-6">Connect</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Telegram</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Oseme. All rights reserved. Built on Solana.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default CompletePage