import React from 'react'

const SimpleHomePage: React.FC = () => {
  console.log('SimpleHomePage rendering...')
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-white mb-6">
          Welcome to <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Oseme</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Decentralized savings groups on Solana blockchain
        </p>
        <div className="space-y-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
            Get Started
          </button>
          <p className="text-gray-400 text-sm">
            Connect your wallet to join savings groups
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleHomePage