import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { usdcStakingService } from '../services/USDCStakingService'

// UI Components
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`rounded-lg border ${className}`} {...props}>{children}</div>
)
const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>
)
const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>
)
const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-2 ${className}`} {...props}>{children}</div>
)
const Badge = ({ children, className = '', ...props }: any) => (
  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`} {...props}>
    {children}
  </div>
)

interface YieldMetrics {
  totalValueLocked: number
  totalYieldGenerated: number
  averageAPY: number
  activeStakes: number
  protocolBreakdown: Array<{
    protocol: string
    tvl: number
    apy: number
    allocation: number
    risk: 'Low' | 'Medium' | 'High'
  }>
}

interface HistoricalYield {
  date: Date
  totalValue: number
  yieldEarned: number
  apy: number
}

const YieldTracker = () => {
  const { publicKey, connected } = useWallet()
  const [yieldMetrics, setYieldMetrics] = useState<YieldMetrics | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalYield[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [realTimeRates, setRealTimeRates] = useState<any>({})

  // Load yield data
  useEffect(() => {
    const loadYieldData = async () => {
      if (!connected || !publicKey) return

      setLoading(true)
      try {
        // Get real-time rates
        const rates = await usdcStakingService.getCurrentYieldRates()
        setRealTimeRates(rates)

        // Mock comprehensive yield metrics
        const mockMetrics: YieldMetrics = {
          totalValueLocked: 47850.50,
          totalYieldGenerated: 3127.45,
          averageAPY: 7.2,
          activeStakes: 3,
          protocolBreakdown: [
            {
              protocol: 'Marinade Finance',
              tvl: 19140.20,
              apy: rates.marinade || 6.5,
              allocation: 40,
              risk: 'Low'
            },
            {
              protocol: 'Solend Protocol',
              tvl: 14355.15,
              apy: rates.solend || 5.2,
              allocation: 30,
              risk: 'Low'
            },
            {
              protocol: 'Francium DeFi',
              tvl: 9570.10,
              apy: rates.francium || 8.1,
              allocation: 20,
              risk: 'Medium'
            },
            {
              protocol: 'Port Finance',
              tvl: 4785.05,
              apy: rates.portFinance || 7.8,
              allocation: 10,
              risk: 'Medium'
            }
          ]
        }

        setYieldMetrics(mockMetrics)

        // Generate historical data
        const historical = generateHistoricalData(selectedTimeframe)
        setHistoricalData(historical)

      } catch (error) {
        console.error('Failed to load yield data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadYieldData()
    
    // Update rates every 30 seconds
    const interval = setInterval(loadYieldData, 30000)
    return () => clearInterval(interval)

  }, [connected, publicKey, selectedTimeframe])

  const generateHistoricalData = (timeframe: string): HistoricalYield[] => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365
    const data: HistoricalYield[] = []
    const baseValue = 45000
    
    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const variance = (Math.random() - 0.5) * 0.1
      const totalValue = baseValue + (days - i) * 25 + (variance * baseValue * 0.02)
      const yieldEarned = totalValue - baseValue
      const apy = 6.5 + variance * 2
      
      data.push({
        date,
        totalValue,
        yieldEarned: Math.max(0, yieldEarned),
        apy: Math.max(0, apy)
      })
    }
    
    return data
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(2)}%`
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
              <p className="text-gray-400">Please connect your wallet to view yield tracking data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto pt-20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Yield Tracker</h1>
          <p className="text-gray-300">Real-time DeFi yield monitoring and analytics</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Live Data</span>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center mb-8">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {yieldMetrics && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {formatCurrency(yieldMetrics.totalValueLocked)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Value Locked</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {formatCurrency(yieldMetrics.totalYieldGenerated)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Yield Generated</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {formatPercentage(yieldMetrics.averageAPY)}
                  </div>
                  <div className="text-gray-400 text-sm">Average APY</div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {yieldMetrics.activeStakes}
                  </div>
                  <div className="text-gray-400 text-sm">Active Stakes</div>
                </CardContent>
              </Card>
            </div>

            {/* Protocol Breakdown */}
            <Card className="bg-white/5 border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white">🏦 Protocol Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yieldMetrics.protocolBreakdown.map((protocol, index) => (
                    <div key={index} className="bg-white/10 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {protocol.protocol.split(' ')[0].charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">{protocol.protocol}</div>
                            <div className="text-gray-400 text-sm">{protocol.allocation}% allocation</div>
                          </div>
                        </div>
                        <Badge className={getRiskColor(protocol.risk)}>
                          {protocol.risk} Risk
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">TVL:</span>
                          <div className="text-white font-semibold">{formatCurrency(protocol.tvl)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Current APY:</span>
                          <div className="text-green-400 font-semibold">{formatPercentage(protocol.apy)}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Est. Daily Yield:</span>
                          <div className="text-blue-400 font-semibold">
                            {formatCurrency((protocol.tvl * protocol.apy / 100) / 365)}
                          </div>
                        </div>
                      </div>

                      {/* Allocation Bar */}
                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${protocol.allocation}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historical Performance */}
            <Card className="bg-white/5 border-white/20 mb-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">📈 Historical Performance</CardTitle>
                  <div className="flex gap-2">
                    {(['7d', '30d', '90d', '1y'] as const).map(timeframe => (
                      <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          selectedTimeframe === timeframe
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Performance Summary */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Performance Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-gray-400">Period Start:</span>
                        <span className="text-white font-semibold">
                          {historicalData.length > 0 ? historicalData[0].date.toLocaleDateString() : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-gray-400">Total Return:</span>
                        <span className="text-green-400 font-semibold">
                          {historicalData.length > 0 
                            ? formatCurrency(historicalData[historicalData.length - 1].yieldEarned)
                            : '$0.00'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                        <span className="text-gray-400">Best APY:</span>
                        <span className="text-blue-400 font-semibold">
                          {historicalData.length > 0 
                            ? formatPercentage(Math.max(...historicalData.map(d => d.apy)))
                            : '0.00%'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Yield Growth Visualization</h4>
                    <div className="bg-white/10 rounded-lg p-4 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">📊</div>
                        <div>Interactive chart coming soon</div>
                        <div className="text-sm mt-1">Real-time yield visualization</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-Time Rates */}
            <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  ⚡ Live Protocol Rates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(realTimeRates).map(([protocol, rate]) => (
                    <div key={protocol} className="text-center p-4 bg-white/10 rounded-lg">
                      <div className="text-sm text-gray-400 capitalize mb-1">
                        {protocol === 'portFinance' ? 'Port Finance' : protocol}
                      </div>
                      <div className="text-xl font-bold text-green-400">
                        {formatPercentage(rate as number)}
                      </div>
                      <div className="text-xs text-gray-500">APY</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

      </div>
    </div>
  )
}

export default YieldTracker