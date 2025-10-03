import { useState, useEffect } from 'react'

// Preloader for instant visual feedback
const DataPreloader = ({ onDataReady }: { onDataReady: (data: any) => void }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate progressive loading with immediate visual feedback
    const steps = [
      { delay: 0, progress: 20, message: 'Connecting to blockchain...' },
      { delay: 200, progress: 45, message: 'Fetching yield rates...' },
      { delay: 400, progress: 70, message: 'Loading protocol data...' },
      { delay: 600, progress: 90, message: 'Calculating metrics...' },
      { delay: 800, progress: 100, message: 'Ready!' }
    ]

    steps.forEach(step => {
      setTimeout(() => {
        setProgress(step.progress)
        if (step.progress === 100) {
          // Provide immediate mock data for instant display
          const mockData = {
            totalTVL: 1900000000,
            averageAPY: 8.2,
            totalYield: 156000,
            activeProtocols: 4
          }
          onDataReady(mockData)
        }
      }, step.delay)
    })
  }, [onDataReady])

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <div className="w-64 bg-gray-700 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-gray-300 text-sm">{progress}% loaded</div>
    </div>
  )
}

// Enhanced loading states with skeleton screens
export const EnhancedLoadingStates = {
  OverviewSkeleton: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white/5 border border-white/20 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-20 mx-auto mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-16 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  ),

  ProtocolSkeleton: () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white/10 p-4 rounded-lg">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/10 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-5 bg-white/10 rounded w-32"></div>
                <div className="h-4 bg-white/10 rounded w-20"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-12 bg-white/10 rounded"></div>
              <div className="h-12 bg-white/10 rounded"></div>
              <div className="h-12 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),

  RatesSkeleton: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white/10 p-4 rounded-lg">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-white/10 rounded w-16 mx-auto"></div>
            <div className="h-6 bg-white/10 rounded w-12 mx-auto"></div>
            <div className="h-3 bg-white/10 rounded w-8 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DataPreloader