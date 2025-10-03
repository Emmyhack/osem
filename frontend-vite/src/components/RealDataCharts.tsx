import { useEffect, useState, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { realSolanaInsuranceService, RealInsuranceData, RealPoolData } from '../services/RealSolanaInsuranceService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)

// Real-time TVL Chart with live Solana data
export const RealTimeTVLChart = () => {
  const [tvlHistory, setTvlHistory] = useState<Array<{time: string, value: number}>>([])
  const [currentTVL, setCurrentTVL] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const updateTVLData = async () => {
      try {
        const aggregatedData = await realSolanaInsuranceService.getAggregatedData()
        const newTVL = aggregatedData.pools.totalTVL
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        
        setCurrentTVL(newTVL)
        setTvlHistory(prev => {
          const newHistory = [...prev, { time: currentTime, value: newTVL }]
          return newHistory.length > 20 ? newHistory.slice(-20) : newHistory
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to update TVL data:', error)
      }
    }

    // Initial load
    updateTVLData()
    
    // Update every 30 seconds
    intervalRef.current = setInterval(updateTVLData, 30000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const chartData = {
    labels: tvlHistory.map(item => item.time),
    datasets: [
      {
        label: 'Total Value Locked',
        data: tvlHistory.map(item => item.value),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        borderColor: '#10b981',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `TVL: $${(context.parsed.y / 1000000).toFixed(1)}M`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: function(value: any) {
            return '$' + (value / 1000000).toFixed(0) + 'M'
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeOutQuart' as const
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Live Total Value Locked</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-yellow-400">Loading...</span>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Total Value Locked</h3>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              ${(currentTVL / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-400">Real-time TVL</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>
      </div>
      <div style={{ height: '250px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

// Real Insurance Coverage Chart
export const RealInsuranceCoverageChart = () => {
  const [insuranceData, setInsuranceData] = useState<RealInsuranceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const updateInsuranceData = async () => {
      try {
        const data = await realSolanaInsuranceService.getAllInsuranceData()
        setInsuranceData(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to update insurance data:', error)
      }
    }

    updateInsuranceData()
    intervalRef.current = setInterval(updateInsuranceData, 45000) // Update every 45 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Insurance Coverage by Protocol</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    )
  }

  const chartData = {
    labels: insuranceData.map(item => item.protocol),
    datasets: [
      {
        data: insuranceData.map(item => item.totalCoverage),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(16, 185, 129, 0.8)',   // Green  
          'rgba(245, 158, 11, 0.8)',   // Orange
          'rgba(139, 92, 246, 0.8)'    // Purple
        ],
        borderColor: [
          '#3b82f6',
          '#10b981', 
          '#f59e0b',
          '#8b5cf6'
        ],
        borderWidth: 2
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
          font: { size: 12 },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        callbacks: {
          label: function(context: any) {
            const total = insuranceData.reduce((sum, item) => sum + item.totalCoverage, 0)
            const percentage = ((context.parsed * 100) / total).toFixed(1)
            const value = (context.parsed / 1000000).toFixed(1)
            return `${context.label}: $${value}M (${percentage}%)`
          }
        }
      }
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Insurance Coverage by Protocol</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-400">Live Data</span>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  )
}

// Real Pool APY Comparison
export const RealPoolAPYChart = () => {
  const [poolData, setPoolData] = useState<RealPoolData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const updatePoolData = async () => {
      try {
        const data = await realSolanaInsuranceService.getAllPoolData()
        setPoolData(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to update pool data:', error)
      }
    }

    updatePoolData()
    intervalRef.current = setInterval(updatePoolData, 30000) // Update every 30 seconds
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Live Pool APY Comparison</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        </div>
      </div>
    )
  }

  const chartData = {
    labels: poolData.map(item => item.protocol.split(' ')[0]),
    datasets: [
      {
        label: 'APY (%)',
        data: poolData.map(item => item.apy),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f3f4f6',
        bodyColor: '#d1d5db',
        callbacks: {
          label: function(context: any) {
            const poolInfo = poolData[context.dataIndex]
            return [
              `APY: ${context.parsed.y.toFixed(2)}%`,
              `TVL: $${(poolInfo.tvl / 1000000).toFixed(1)}M`,
              `24h Volume: $${(poolInfo.volume24h / 1000000).toFixed(1)}M`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
          drawBorder: false
        },
        ticks: {
          color: '#9ca3af',
          font: { size: 11 },
          callback: function(value: any) {
            return value + '%'
          }
        }
      }
    },
    animation: {
      duration: 750,
      easing: 'easeOutQuart' as const
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Pool APY Comparison</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-purple-400">Real-time APY</span>
        </div>
      </div>
      <div style={{ height: '250px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}

// Comprehensive Real Data Dashboard
export const RealDataDashboard = () => {
  const [aggregatedData, setAggregatedData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const updateAggregatedData = async () => {
      try {
        const data = await realSolanaInsuranceService.getAggregatedData()
        setAggregatedData(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to update aggregated data:', error)
      }
    }

    updateAggregatedData()
    intervalRef.current = setInterval(updateAggregatedData, 60000) // Update every minute
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  if (isLoading || !aggregatedData) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Total TVL</div>
          <div className="text-2xl font-bold text-green-400">
            ${(aggregatedData.pools.totalTVL / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-green-300">Live from Solana</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Avg APY</div>
          <div className="text-2xl font-bold text-blue-400">
            {aggregatedData.pools.averageAPY.toFixed(1)}%
          </div>
          <div className="text-xs text-blue-300">Across all pools</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Insurance Coverage</div>
          <div className="text-2xl font-bold text-purple-400">
            ${(aggregatedData.insurance.totalCoverage / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-purple-300">Total protected</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="text-sm text-gray-400 mb-1">Active Participants</div>
          <div className="text-2xl font-bold text-orange-400">
            {aggregatedData.pools.totalParticipants.toLocaleString()}
          </div>
          <div className="text-xs text-orange-300">Real users</div>
        </div>
      </div>

      {/* Charts */}
      <RealTimeTVLChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealInsuranceCoverageChart />
        <RealPoolAPYChart />
      </div>

      {/* Protocol Performance Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          🔥 Live Protocol Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-gray-300 font-medium p-3">Protocol</th>
                <th className="text-left text-gray-300 font-medium p-3">TVL</th>
                <th className="text-left text-gray-300 font-medium p-3">APY</th>
                <th className="text-left text-gray-300 font-medium p-3">24h Volume</th>
                <th className="text-left text-gray-300 font-medium p-3">Participants</th>
                <th className="text-left text-gray-300 font-medium p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedData.pools.protocols.map((pool: RealPoolData, index: number) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    <div className="font-medium text-white">{pool.protocol}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-green-400 font-semibold">
                      ${(pool.tvl / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-blue-400 font-semibold">
                      {pool.apy.toFixed(2)}%
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-purple-400">
                      ${(pool.volume24h / 1000000).toFixed(1)}M
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-orange-400">
                      {pool.participants.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RealDataDashboard