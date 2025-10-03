import React from 'react'

const TestPage: React.FC = () => {
  console.log('TestPage rendering...')
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Oseme Test Page</h1>
        <p className="text-gray-300 text-lg">React is working!</p>
        <div className="mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Test Button
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestPage