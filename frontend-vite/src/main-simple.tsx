import ReactDOM from 'react-dom/client'
import './index.css'

// Minimal App component
function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl font-bold text-white mb-6">
          Welcome to <span className="text-blue-500">Oseme</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Decentralized savings groups on Solana blockchain
        </p>
        <div className="space-y-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors">
            Get Started
          </button>
          <p className="text-gray-400 text-sm">
            Website is now working!
          </p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)