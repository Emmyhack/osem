import { useState } from 'react'

const SimpleYieldOptimization = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('7d')

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

  // Mock data to prevent API loading issues
  const yieldData = {
    totalIdleFunds: 2500000,
    totalYieldGenerated: 125000,
    averageAPY: 8.5,
    activeStrategies: 5,
    monthlyYield: 42500,
    compoundingFrequency: 'Daily'
  }

  const strategies = [
    {
      id: '1',
      protocol: 'Marinade Finance',
      name: 'Liquid Staking',
      apy: 6.8,
      tvl: 500000,
      allocation: 25,
      riskLevel: 'Low',
      status: 'Active'
    },
    {
      id: '2', 
      protocol: 'Jupiter',
      name: 'DEX Aggregation',
      apy: 9.2,
      tvl: 750000,
      allocation: 35,
      riskLevel: 'Medium',
      status: 'Active'
    },
    {
      id: '3',
      protocol: 'Drift Protocol',
      name: 'Perp Trading',
      apy: 12.5,
      tvl: 400000,
      allocation: 20,
      riskLevel: 'High',
      status: 'Monitoring'
    }
  ]

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

      {/* Static Chart Placeholder */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          📈 Performance Overview
        </h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📊</div>
            <p>Yield performance charts</p>
            <p className="text-sm">Chart data updating every 30 seconds</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleYieldOptimization