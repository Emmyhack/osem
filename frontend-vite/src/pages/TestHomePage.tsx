import React from 'react'
import { useWallet, SimpleWalletButton } from '../components/TempWalletProvider'
import CleanNavigation from '../components/CleanNavigation'

const TestHomePage: React.FC = () => {
  console.log('TestHomePage rendering...')
  const { connected, publicKey } = useWallet()
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <CleanNavigation />
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">OSEME Test Page</h1>
          
          <div className="mb-8">
            <SimpleWalletButton />
            {connected && (
              <p className="mt-4 text-green-400">
                Connected: {publicKey}
              </p>
            )}
          </div>
          <p className="text-xl text-gray-300 mb-8">
            If you can see this, the basic React app is working!
          </p>
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Status Check</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-green-900/30 border border-green-500/30 p-4 rounded">
                <span className="text-green-400">✅ React Loading</span>
              </div>
              <div className="bg-green-900/30 border border-green-500/30 p-4 rounded">
                <span className="text-green-400">✅ Tailwind CSS</span>
              </div>
              <div className="bg-green-900/30 border border-green-500/30 p-4 rounded">
                <span className="text-green-400">✅ TypeScript</span>
              </div>
              <div className="bg-green-900/30 border border-green-500/30 p-4 rounded">
                <span className="text-green-400">✅ Routing</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg mr-4">
              Test Button
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg">
              Another Button
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestHomePage