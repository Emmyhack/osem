import React from 'react'
import { SimpleWalletButton } from '../components/TempWalletProvider'

const SimpleHomePage: React.FC = () => {
  console.log('SimpleHomePage rendering...')
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">OSEME - Decentralized Thrift Platform</h1>
        
        <div className="text-center mb-8">
          <SimpleWalletButton />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Create Group</h3>
            <p className="text-gray-300 mb-4">Start a new savings group and invite friends</p>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded w-full">
              Create Group
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Join Group</h3>
            <p className="text-gray-300 mb-4">Find and join existing savings groups</p>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full">
              Browse Groups
            </button>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-gray-300 mb-4">Monitor your contributions and payouts</p>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full">
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleHomePage