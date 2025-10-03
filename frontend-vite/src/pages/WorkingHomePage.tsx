import React, { useEffect, useState } from 'react'
import CleanNavigation from '../components/CleanNavigation'

const WorkingHomePage: React.FC = () => {
  console.log('WorkingHomePage rendering...')
  
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <CleanNavigation />
      
      {/* Hero Section - Let's start simple */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-black">
        <div className="container mx-auto px-6 text-center">
          <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Build Wealth Together
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Join rotating savings groups on Solana. Pool funds with trusted members, 
              earn interest, and achieve your financial goals through community-powered savings.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="btn-primary text-lg px-8 py-4">
                Start Your First Group
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Join Existing Groups
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">$2.1M+</div>
                <div className="text-gray-400">Total Value Locked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
                <div className="text-gray-400">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1,200+</div>
                <div className="text-gray-400">Active Groups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">98.5%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent"></div>
      </section>
      
      {/* Simple Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose Oseme?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of decentralized savings with transparency, security, and community support.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Secure & Transparent</h3>
              <p className="text-gray-300">
                All transactions are recorded on the Solana blockchain, ensuring complete transparency and security.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Fast & Low Cost</h3>
              <p className="text-gray-300">
                Leverage Solana's speed and low fees for efficient group savings with minimal transaction costs.
              </p>
            </div>
            
            <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Community Driven</h3>
              <p className="text-gray-300">
                Build trust and achieve financial goals together with like-minded individuals in your community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WorkingHomePage