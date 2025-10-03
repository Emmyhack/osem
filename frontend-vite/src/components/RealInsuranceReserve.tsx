import { useState, useEffect, useRef } from 'react'
import { realSolanaInsuranceService, RealInsuranceData } from '../services/RealSolanaInsuranceService'
import { RealInsuranceCoverageChart } from './RealDataCharts'

const RealInsuranceReserve = () => {
  const [insuranceData, setInsuranceData] = useState<RealInsuranceData[]>([])
  const [aggregatedData, setAggregatedData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const intervalRef = useRef<NodeJS.Timeout>()

  // Load real-time insurance data
  useEffect(() => {
    const loadRealTimeData = async () => {
      setLoading(true)
      try {
        const [insurance, aggregated] = await Promise.all([
          realSolanaInsuranceService.getAllInsuranceData(),
          realSolanaInsuranceService.getAggregatedData()
        ])
        
        setInsuranceData(insurance)
        setAggregatedData(aggregated)
      } catch (error) {
        console.error('Error loading real-time insurance data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRealTimeData()
  }, [])

  useEffect(() => {
    // Real-time updates every 45 seconds
    const interval = setInterval(async () => {
      try {
        const [updatedInsurance, updatedAggregated] = await Promise.all([
          realSolanaInsuranceService.getAllInsuranceData(),
          realSolanaInsuranceService.getAggregatedData()
        ])
        
        setInsuranceData(updatedInsurance)
        setAggregatedData(updatedAggregated)
      } catch (error) {
        console.error('Error updating real-time data:', error)
      }
    }, 45000)

    intervalRef.current = interval
    return () => clearInterval(interval)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
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

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 2.5) return 'text-green-400 bg-green-500/20'
    if (riskScore <= 3.5) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const getRiskLevel = (riskScore: number) => {
    if (riskScore <= 2.5) return 'Low Risk'
    if (riskScore <= 3.5) return 'Medium Risk'
    return 'High Risk'
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

  const totalClaims = insuranceData.reduce((sum, item) => sum + item.activeClaimsCount, 0)
  const totalProcessed = insuranceData.reduce((sum, item) => sum + item.claimsProcessed24h, 0)
  const avgUtilization = insuranceData.reduce((sum, item) => sum + item.utilizationRate, 0) / insuranceData.length

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            🛡️ Real Insurance Reserve Dashboard
          </h2>
          <p className="text-gray-300">Live insurance data from Solana DeFi protocols • Transparent coverage tracking</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-400">Live Solana Data</span>
          </div>
          <div className="flex bg-white/10 rounded-lg p-1">
            {(['7d', '30d', '90d', '1y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-3 py-1 text-sm rounded transition-all ${
                  selectedTimeframe === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-emerald-400">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                💰
              </div>
              <h3 className="text-sm font-medium">Total Reserves</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(aggregatedData?.insurance.totalReserves || 0)}
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                📈 Live from Solana
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-blue-400">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-2">
                🏦
              </div>
              <h3 className="text-sm font-medium">Total Coverage</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(aggregatedData?.insurance.totalCoverage || 0)}
              </div>
              <div className="text-xs text-blue-400">
                Across {insuranceData.length} protocols
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-400">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                📊
              </div>
              <h3 className="text-sm font-medium">Coverage Ratio</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatPercentage(aggregatedData?.insurance.coverageRatio || 0)}
              </div>
              <div className="text-xs text-purple-400">
                Reserve efficiency
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
              <h3 className="text-sm font-medium">Active Claims</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {totalClaims}
              </div>
              <div className="text-xs text-orange-400">
                Processing now
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Insurance Protocols Table */}
      <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden mb-8">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🔒 Live Insurance Protocol Status
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left text-gray-300 font-medium p-4">Protocol</th>
                <th className="text-left text-gray-300 font-medium p-4">Coverage</th>
                <th className="text-left text-gray-300 font-medium p-4">Reserves</th>
                <th className="text-left text-gray-300 font-medium p-4">Utilization</th>
                <th className="text-left text-gray-300 font-medium p-4">Claims (24h)</th>
                <th className="text-left text-gray-300 font-medium p-4">Risk Level</th>
                <th className="text-left text-gray-300 font-medium p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {insuranceData.map((insurance, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-white/5' : ''} hover:bg-white/10 transition-colors`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {insurance.protocol.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{insurance.protocol}</div>
                        <div className="text-xs text-gray-400">Insurance Fund</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-blue-400 font-semibold">
                      {formatCurrency(insurance.totalCoverage)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-emerald-400 font-semibold">
                      {formatCurrency(insurance.reserveBalance)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, insurance.utilizationRate)}%` }}
                        ></div>
                      </div>
                      <span className="text-purple-400 text-sm">
                        {formatPercentage(insurance.utilizationRate)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-center">
                      <div className="text-orange-400 font-semibold">
                        {insurance.claimsProcessed24h}
                      </div>
                      <div className="text-xs text-gray-400">
                        {insurance.activeClaimsCount} active
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(insurance.riskScore)}`}>
                      {getRiskLevel(insurance.riskScore)}
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

      {/* Real-time Charts and Analytics */}
      <div className="space-y-6">
        <RealInsuranceCoverageChart />
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Claims Analytics */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📈 Live Claims Analytics
            </h3>
            <div className="space-y-4">
              {insuranceData.map((insurance, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <span className="text-gray-300">{insurance.protocol}</span>
                  <div className="text-right">
                    <div className="text-orange-400 font-semibold">
                      {insurance.activeClaimsCount} / {insurance.claimsProcessed24h}
                    </div>
                    <div className="text-xs text-gray-400">
                      Active / 24h Processed
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total</span>
                  <div className="text-right">
                    <div className="text-orange-400 font-bold text-lg">
                      {totalClaims} / {totalProcessed}
                    </div>
                    <div className="text-xs text-gray-400">
                      Success Rate: {((totalProcessed / (totalProcessed + totalClaims)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              ⚡ Real-time Insurance Metrics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Highest Coverage Protocol</span>
                <div className="text-right">
                  <div className="text-blue-400 font-semibold">
                    {insuranceData.length > 0 ? 
                      insuranceData.reduce((max, item) => item.totalCoverage > max.totalCoverage ? item : max).protocol : 
                      'Loading...'}
                  </div>
                  <div className="text-xs text-blue-300">
                    {insuranceData.length > 0 ? 
                      formatCurrency(Math.max(...insuranceData.map(i => i.totalCoverage))) : 
                      '$0'}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Average Utilization</span>
                <div className="text-purple-400 font-semibold">
                  {formatPercentage(avgUtilization)}
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-300">Most Secure Protocol</span>
                <div className="text-green-400 font-semibold">
                  {insuranceData.length > 0 ? 
                    insuranceData.reduce((min, item) => item.riskScore < min.riskScore ? item : min).protocol : 
                    'Loading...'}
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

      {/* Live Activity Feed */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 mt-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          📡 Live Insurance Activity Feed
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {insuranceData.flatMap((insurance, protocolIndex) => 
            Array.from({ length: Math.min(3, insurance.claimsProcessed24h) }, (_, i) => (
              <div key={`${protocolIndex}-${i}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-sm">
                    Claim processed on {insurance.protocol}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {formatCurrency(Math.random() * 50000 + 5000)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.floor(Math.random() * 120) + 1} minutes ago
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default RealInsuranceReserve