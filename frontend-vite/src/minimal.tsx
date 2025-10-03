import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

function MinimalApp() {
  console.log('Minimal app rendering...')
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">OSEME - Minimal Test</h1>
      <p className="text-xl">If you can see this, the basic app is working!</p>
      <div className="mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
          Test Button
        </button>
      </div>
    </div>
  )
}

console.log('Starting minimal app...')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>,
)

console.log('Minimal app initialized')