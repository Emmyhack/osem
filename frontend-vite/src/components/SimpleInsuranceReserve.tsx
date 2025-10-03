import { useState } from 'react'

const SimpleInsuranceReserve = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

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
  const reserveData = {
    totalReserve: 2500000,
    totalCoverage: 12800000,
    claimsPaid: 145000,
    activeGroups: 1280,
    reserveUtilization: 19.5,
    riskDistribution: {
      low: 65.2,
      medium: 24.8,
      high: 10.0
    },
    monthlyGrowth: 8.7,
    coverageRatio: 512.0
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-glow">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            🛡️ Insurance Reserve Dashboard
          </h2>
          <p className="text-gray-300">Transparent coverage and reserve fund management</p>
        </div>
        
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-sm text-gray-400">Timeframe:</span>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 rounded-lg p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-emerald-400">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-2">
                💰
              </div>
              <h3 className="text-sm font-medium">Total Reserve</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(reserveData.totalReserve)}
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                📈 +{formatPercentage(reserveData.monthlyGrowth)} this month
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (reserveData.totalReserve / 5000000) * 100)}%` }}
            ></div>
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
                {formatCurrency(reserveData.totalCoverage)}
              </div>
              <div className="text-xs text-blue-400">
                Across {reserveData.activeGroups.toLocaleString()} groups
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Coverage Ratio: {formatPercentage(reserveData.coverageRatio)}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-purple-400">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2">
                📊
              </div>
              <h3 className="text-sm font-medium">Utilization Rate</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatPercentage(reserveData.reserveUtilization)}
              </div>
              <div className="text-xs text-purple-400">
                Reserve efficiency
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${reserveData.reserveUtilization}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="text-red-400">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-2">
                💸
              </div>
              <h3 className="text-sm font-medium">Claims Paid</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {formatCurrency(reserveData.claimsPaid)}
              </div>
              <div className="text-xs text-red-400">
                Total payouts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            ⚖️ Risk Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-white">Low Risk Groups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${reserveData.riskDistribution.low}%` }}
                  ></div>
                </div>
                <span className="text-green-400 text-sm w-12 text-right">
                  {formatPercentage(reserveData.riskDistribution.low)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-white">Medium Risk Groups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${reserveData.riskDistribution.medium}%` }}
                  ></div>
                </div>
                <span className="text-yellow-400 text-sm w-12 text-right">
                  {formatPercentage(reserveData.riskDistribution.medium)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-white">High Risk Groups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${reserveData.riskDistribution.high}%` }}
                  ></div>
                </div>
                <span className="text-red-400 text-sm w-12 text-right">
                  {formatPercentage(reserveData.riskDistribution.high)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            🔍 Transparency Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Reserve Sufficiency</span>
              <span className="text-green-400 font-semibold">Excellent</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Audit Status</span>
              <span className="text-green-400 font-semibold">✓ Current</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Last Audit</span>
              <span className="text-blue-400">Dec 2024</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-gray-300">Smart Contract</span>
              <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                View on Explorer →
              </button>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-300">Data Updates</span>
              <span className="text-green-400 text-sm">Live monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Analytics Placeholder */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          📊 Insurance Analytics Overview
        </h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📈</div>
            <p>Insurance coverage analytics</p>
            <p className="text-sm">Real-time coverage and claims tracking</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleInsuranceReserve