import { useState, useEffect } from 'react'
import SolanaYieldService, { YieldStrategy, YieldData } from '../services/solanaYieldService'
import { LiveTVLChart, ProtocolDistributionChart, APYComparisonChart } from './RealTimeChart'
import { solanaDataService } from '../services/SolanaDataService'

const YieldOptimization = () => {
  const [yieldData, setYieldData] = useState<YieldData>({
    totalIdleFunds: 0,
    totalYieldGenerated: 0,
    averageAPY: 0,
    activeStrategies: 0,
    monthlyYield: 0,
    compoundingFrequency: 'Daily'
  })

  const [strategies, setStrategies] = useState<YieldStrategy[]>([])
  const [loading, setLoading] = useState(true)
  const [yieldService] = useState(() => new SolanaYieldService())
  const [realTimePools, setRealTimePools] = useState<any[]>([])

  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d')

  // Load real-time data on mount
  useEffect(() => {
    const loadRealTimeData = async () => {
      setLoading(true)
      try {
        const [realYieldData, realStrategies] = await Promise.all([
          yieldService.fetchYieldData(),
          yieldService.getStrategies()
        ])
        
        // Fetch real Solana protocol data
        const [marinadeData, jupiterData, driftData, kaminoData] = await Promise.all([
          solanaDataService.getMarinadeData(),
          solanaDataService.getJupiterData(), 
          solanaDataService.getDriftData(),
          solanaDataService.getKaminoData()
        ])

        // Transform real data to pool format
        const pools = [
          { protocol: 'Marinade Finance', tvl: marinadeData.tvl, apy: marinadeData.apy, volume24h: marinadeData.volume24h },
          { protocol: 'Jupiter', tvl: jupiterData.tvl, apy: jupiterData.apy, volume24h: jupiterData.volume24h },
          { protocol: 'Drift Protocol', tvl: driftData.tvl, apy: driftData.apy, volume24h: driftData.volume24h },
          { protocol: 'Kamino Finance', tvl: kaminoData.tvl, apy: kaminoData.apy, volume24h: kaminoData.volume24h }
        ]

        setYieldData(realYieldData)
        setStrategies(realStrategies)
        setRealTimePools(pools)
      } catch (error) {
        console.error('Error loading real-time yield data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRealTimeData()
  }, [yieldService])

  useEffect(() => {
    // Real-time yield updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const [updatedYieldData, updatedStrategies] = await Promise.all([
          yieldService.fetchYieldData(),
          yieldService.getStrategies()
        ])

        // Update real Solana protocol data
        const [marinadeData, jupiterData, driftData, kaminoData] = await Promise.all([
          solanaDataService.getMarinadeData(),
          solanaDataService.getJupiterData(),
          solanaDataService.getDriftData(),
          solanaDataService.getKaminoData()
        ])

        const pools = [
          { protocol: 'Marinade Finance', tvl: marinadeData.tvl, apy: marinadeData.apy, volume24h: marinadeData.volume24h },
          { protocol: 'Jupiter', tvl: jupiterData.tvl, apy: jupiterData.apy, volume24h: jupiterData.volume24h },
          { protocol: 'Drift Protocol', tvl: driftData.tvl, apy: driftData.apy, volume24h: driftData.volume24h },
          { protocol: 'Kamino Finance', tvl: kaminoData.tvl, apy: kaminoData.apy, volume24h: kaminoData.volume24h }
        ]
        
        setYieldData(updatedYieldData)
        setStrategies(updatedStrategies)
        setRealTimePools(pools)
      } catch (error) {
        console.error('Error updating real-time data:', error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [yieldService])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-400 bg-green-500/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'High': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-500/20'
      case 'Paused': return 'text-yellow-400 bg-yellow-500/20'
      case 'Monitoring': return 'text-blue-400 bg-blue-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            🚀 Yield Optimization Engine
          </h2>
          <p className="text-gray-300">Maximizing returns on idle group funds through DeFi protocols</p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm text-gray-400">Performance:</span>
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

      {/* Yield Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-400">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                💎
              </div>
              <h3 className="text-sm font-medium">Idle Funds</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(yieldData.totalIdleFunds)}
              </div>
              <div className="text-xs text-purple-400">
                Optimizing across {yieldData.activeStrategies} strategies
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
              <h3 className="text-sm font-medium">Total Yield</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(yieldData.totalYieldGenerated)}
              </div>
              <div className="text-xs text-green-400 flex items-center gap-1">
                +{formatCurrency(yieldData.monthlyYield)} this month
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
                {formatPercentage(yieldData.averageAPY)}
              </div>
              <div className="text-xs text-blue-400">
                {yieldData.compoundingFrequency} compounding
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-orange-400">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-2">
                ⚡
              </div>
              <h3 className="text-sm font-medium">Active Strategies</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {yieldData.activeStrategies}
              </div>
              <div className="text-xs text-orange-400">
                Diversified protocols
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yield Strategies Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden mb-8">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📊 Active Yield Strategies
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left text-gray-300 font-medium p-4">Protocol</th>
                <th className="text-left text-gray-300 font-medium p-4">Strategy</th>
                <th className="text-left text-gray-300 font-medium p-4">APY</th>
                <th className="text-left text-gray-300 font-medium p-4">TVL</th>
                <th className="text-left text-gray-300 font-medium p-4">Allocation</th>
                <th className="text-left text-gray-300 font-medium p-4">Risk</th>
                <th className="text-left text-gray-300 font-medium p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy, index) => (
                <tr key={strategy.id} className={`${index % 2 === 0 ? 'bg-white/5' : ''} hover:bg-white/10 transition-colors`}>
                  <td className="p-4">
                    <div className="font-medium text-white">{strategy.protocol}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-300">{strategy.name}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-green-400">
                      {formatPercentage(strategy.apy)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-300">
                      {formatCurrency(strategy.tvl)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${strategy.allocation}%` }}
                        ></div>
                      </div>
                      <span className="text-blue-400 text-sm">
                        {strategy.allocation}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(strategy.riskLevel)}`}>
                      {strategy.riskLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
                      {strategy.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Performance Charts */}
      <div className="space-y-6 mb-8">
        <LiveTVLChart pools={realTimePools} />
        
        <div className="grid lg:grid-cols-2 gap-6">
          <ProtocolDistributionChart pools={realTimePools} />
          <APYComparisonChart pools={realTimePools} />
        </div>
      </div>

      {/* Risk Management */}
      <div className="grid lg:grid-cols-1 gap-8">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            ⚖️ Real-time Protocol Performance
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realTimePools.map((pool, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 mb-2">{pool.protocol}</div>
                <div className="text-lg font-bold text-white mb-1">
                  ${(pool.tvl / 1000000).toFixed(1)}M TVL
                </div>
                <div className="text-sm text-green-400">
                  {pool.apy.toFixed(2)}% APY
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  ${(pool.volume24h / 1000000).toFixed(1)}M 24h Volume
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            ⚖️ Risk Management
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-300">Maximum Single Protocol</span>
              <span className="text-blue-400 font-semibold">35%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-300">High Risk Allocation</span>
              <span className="text-yellow-400 font-semibold">≤ 10%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-300">Rebalancing Frequency</span>
              <span className="text-green-400 font-semibold">Weekly</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-gray-300">Emergency Withdrawal</span>
              <span className="text-green-400 font-semibold">24/7 Available</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-300">Insurance Coverage</span>
              <span className="text-purple-400 font-semibold">100% Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YieldOptimization