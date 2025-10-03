import { useState, useEffect, useRef } from 'react'
import { realSolanaInsuranceService, RealPoolData } from '../services/RealSolanaInsuranceService'
import { RealTimeTVLChart, RealPoolAPYChart } from './RealDataCharts'

const RealYieldOptimization = () => {
  const [poolData, setPoolData] = useState<RealPoolData[]>([])
  const [aggregatedData, setAggregatedData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const intervalRef = useRef<NodeJS.Timeout>()

  // Load real-time data on mount
  useEffect(() => {
    const loadRealTimeData = async () => {
      setLoading(true)
      try {
        const [pools, aggregated] = await Promise.all([
          realSolanaInsuranceService.getAllPoolData(),
          realSolanaInsuranceService.getAggregatedData()
        ])
        
        setPoolData(pools)
        setAggregatedData(aggregated)
      } catch (error) {
        console.error('Error loading real-time yield data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRealTimeData()
  }, [])

  useEffect(() => {
    // Real-time yield updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const [updatedPools, updatedAggregated] = await Promise.all([
          realSolanaInsuranceService.getAllPoolData(),
          realSolanaInsuranceService.getAggregatedData()
        ])
        
        setPoolData(updatedPools)
        setAggregatedData(updatedAggregated)
      } catch (error) {
        console.error('Error updating real-time data:', error)
      }
    }, 30000)

    intervalRef.current = interval
    return () => clearInterval(interval)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      realSolanaInsuranceService.cleanup()
    }
  }, [])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toFixed(0)}`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getRiskColor = (apy: number) => {
    if (apy < 8) return 'text-green-400 bg-green-500/20'
    if (apy < 12) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const getRiskLevel = (apy: number) => {
    if (apy < 8) return 'Low'
    if (apy < 12) return 'Medium'
    return 'High'
  }

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            🚀 Real Yield Optimization Engine
          </h2>
          <p className="text-gray-300">Live data from Solana DeFi protocols • Maximizing returns on group funds</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Live Solana Data</span>
          </div>
          <div className="flex bg-white/10 rounded-lg p-1">
            {(['24h', '7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-3 py-1 text-sm rounded transition-all ${
                  selectedTimeframe === period
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Yield Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-400">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                💎
              </div>
              <h3 className="text-sm font-medium">Total TVL</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(aggregatedData?.pools.totalTVL || 0)}
              </div>
              <div className="text-xs text-purple-400">
                Across {poolData.length} protocols
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-green-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-400">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-2">
                📈
              </div>
              <h3 className="text-sm font-medium">24h Yield</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(aggregatedData?.pools.totalYield24h || 0)}
              </div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                Generated today
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-blue-400">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                🎯
              </div>
              <h3 className="text-sm font-medium">Average APY</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatPercentage(aggregatedData?.pools.averageAPY || 0)}
              </div>
              <div className="text-xs text-blue-400">
                Real-time rates
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-orange-400">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-2">
                👥
              </div>
              <h3 className="text-sm font-medium">Total Users</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {(aggregatedData?.pools.totalParticipants || 0).toLocaleString()}
              </div>
              <div className="text-xs text-orange-400">
                Active participants
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Protocol Strategies Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden mb-8">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🔥 Live Solana Protocol Strategies
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left text-gray-300 font-medium p-4">Protocol</th>
                <th className="text-left text-gray-300 font-medium p-4">APY</th>
                <th className="text-left text-gray-300 font-medium p-4">TVL</th>
                <th className="text-left text-gray-300 font-medium p-4">24h Volume</th>
                <th className="text-left text-gray-300 font-medium p-4">Participants</th>
                <th className="text-left text-gray-300 font-medium p-4">Risk Level</th>
                <th className="text-left text-gray-300 font-medium p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {poolData.map((pool, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-white/5' : ''} hover:bg-white/10 transition-colors`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {pool.protocol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{pool.protocol}</div>
                        <div className="text-xs text-gray-400">Live on Solana</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-green-400 text-lg">
                      {formatPercentage(pool.apy)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-white font-semibold">
                      {formatCurrency(pool.tvl)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-purple-400">
                      {formatCurrency(pool.volume24h)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-blue-400">
                      {pool.participants.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pool.apy)}`}>
                      {getRiskLevel(pool.apy)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">Live</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Charts */}
      <div className="space-y-6">
        <RealTimeTVLChart />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <RealPoolAPYChart />
          
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              ⚡ Real-time Yield Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Highest APY Pool</span>
                <div className="text-right">
                  <div className="text-green-400 font-semibold">
                    {poolData.length > 0 ? poolData.reduce((max, pool) => pool.apy > max.apy ? pool : max).protocol : 'Loading...'}
                  </div>
                  <div className="text-xs text-green-300">
                    {poolData.length > 0 ? formatPercentage(Math.max(...poolData.map(p => p.apy))) : '0%'}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Total 24h Volume</span>
                <div className="text-purple-400 font-semibold">
                  {formatCurrency(poolData.reduce((sum, pool) => sum + pool.volume24h, 0))}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Most Popular Protocol</span>
                <div className="text-blue-400 font-semibold">
                  {poolData.length > 0 ? poolData.reduce((max, pool) => pool.participants > max.participants ? pool : max).protocol : 'Loading...'}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Last Data Update</span>
                <div className="text-green-400 text-sm">
                  {aggregatedData ? new Date(aggregatedData.lastUpdate).toLocaleTimeString() : 'Loading...'}
                </div>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-300">Data Source</span>
                <div className="text-orange-400 font-semibold text-sm">
                  Solana Mainnet
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealYieldOptimization