import { useState, useEffect, useCallback, useMemo } from 'react'
import { useWallet } from './MinimalWalletProvider'
import Navigation from './Navigation'
import { usdcStakingService } from '../services/USDCStakingService'
import { fastYieldService } from '../services/FastYieldService'
import { useLoadingOptimizer } from '../utils/LoadingOptimizer'
import { EnhancedLoadingStates } from './DataPreloader'

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

// Loading skeleton component
const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-white/10 rounded ${className}`}></div>
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

const OptimizedYieldTracker = () => {
  const { publicKey, connected } = useWallet()
  const { preload, startTimer, endTimer, getCached, setCached } = useLoadingOptimizer()
  
  // Separate loading states for different data sections
  const [loadingStates, setLoadingStates] = useState({
    overview: true,
    protocols: true,
    historical: true,
    rates: true
  })
  
  const [yieldMetrics, setYieldMetrics] = useState<YieldMetrics | null>(null)
  const [_historicalData, setHistoricalData] = useState<HistoricalYield[]>([])
  const [selectedTimeframe, _setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [realTimeRates, setRealTimeRates] = useState<any>({})
  const [realPoolData, setRealPoolData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Memoized data processing
  const processedMetrics = useMemo(() => {
    if (!realPoolData.length) return null
    
    const totalTVL = realPoolData.reduce((sum, pool) => sum + pool.tvl, 0)
    const avgAPY = realPoolData.reduce((sum, pool) => sum + pool.apy, 0) / realPoolData.length
    const totalYield24h = realPoolData.reduce((sum, pool) => sum + pool.yieldGenerated24h, 0)
    
    return {
      totalValueLocked: totalTVL,
      totalYieldGenerated: totalYield24h * 30, // Estimate monthly
      averageAPY: avgAPY,
      activeStakes: realPoolData.length,
      protocolBreakdown: realPoolData.map(pool => ({
        protocol: pool.protocol,
        tvl: pool.tvl,
        apy: pool.apy,
        allocation: Math.round((pool.tvl / totalTVL) * 100),
        risk: pool.protocol.includes('Marinade') || pool.protocol.includes('Solend') ? 'Low' as const :
              pool.protocol.includes('Jupiter') ? 'High' as const : 'Medium' as const
      }))
    }
  }, [realPoolData])

  // Optimized data fetching with parallel requests and error handling
  const fetchYieldRates = useCallback(async () => {
    startTimer('rate_fetch')
    
    try {
      // Check cache first
      const cached = getCached('yield_rates_preload')
      if (cached) {
        setRealTimeRates(cached)
        setLoadingStates(prev => ({ ...prev, rates: false }))
        endTimer('rate_fetch')
        
        // Update with real data in background
        setTimeout(async () => {
          try {
            const rates = await fastYieldService.getCurrentYieldRates()
            setRealTimeRates(rates)
            setCached('yield_rates_live', rates, 15000)
          } catch (error) {
            console.warn('Background rate update failed:', error)
          }
        }, 100)
        return
      }
      
      // Use fast service for immediate response
      const rates = await fastYieldService.getCurrentYieldRates()
      setRealTimeRates(rates)
      setCached('yield_rates_live', rates, 15000)
      setLoadingStates(prev => ({ ...prev, rates: false }))
      
    } catch (error) {
      console.warn('Failed to fetch yield rates:', error)
      // Fallback to USDC staking service
      try {
        const fallbackRates = await usdcStakingService.getCurrentYieldRates()
        setRealTimeRates(fallbackRates)
      } catch (fallbackError) {
        console.error('All rate services failed:', fallbackError)
      }
      setLoadingStates(prev => ({ ...prev, rates: false }))
    } finally {
      endTimer('rate_fetch')
    }
  }, [startTimer, endTimer, getCached, setCached])

  const fetchPoolData = useCallback(async () => {
    startTimer('pool_fetch')
    
    try {
      // Check for cached overview data first
      const cachedOverview = getCached('protocol_overview_preload')
      if (cachedOverview) {
        // Use cached data to immediately populate basic metrics
        const mockProtocols = [
          { protocol: 'Marinade Finance', tvl: cachedOverview.totalTVL * 0.4, apy: 6.8, allocation: 40, yieldGenerated24h: 0 },
          { protocol: 'Jupiter Exchange', tvl: cachedOverview.totalTVL * 0.3, apy: 14.2, allocation: 30, yieldGenerated24h: 0 },
          { protocol: 'Raydium AMM', tvl: cachedOverview.totalTVL * 0.2, apy: 9.1, allocation: 20, yieldGenerated24h: 0 },
          { protocol: 'Orca Protocol', tvl: cachedOverview.totalTVL * 0.1, apy: 7.5, allocation: 10, yieldGenerated24h: 0 }
        ]
        
        setRealPoolData(mockProtocols)
        setLoadingStates(prev => ({ ...prev, protocols: false, overview: false }))
      }
      
      // Use progressive data loading for enhanced display
      const aggregatedData = await fastYieldService.getProgressiveData()
      setRealPoolData(aggregatedData.pools.protocols)
      setCached('pool_data_live', aggregatedData.pools.protocols, 20000)
      
    } catch (error) {
      console.error('Failed to fetch pool data:', error)
      setError('Failed to load pool data')
    } finally {
      setLoadingStates(prev => ({ ...prev, protocols: false, overview: false }))
      endTimer('pool_fetch')
    }
  }, [startTimer, endTimer, getCached, setCached])

  const fetchHistoricalData = useCallback(async () => {
    try {
      // Simulate faster historical data generation
      const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 
                   selectedTimeframe === '90d' ? 90 : 365
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
      
      setHistoricalData(data)
      setLoadingStates(prev => ({ ...prev, historical: false }))
    } catch (error) {
      console.error('Failed to generate historical data:', error)
      setLoadingStates(prev => ({ ...prev, historical: false }))
    }
  }, [selectedTimeframe])

  // Initial data load with aggressive optimization
  useEffect(() => {
    if (!connected || !publicKey) return

    startTimer('total_load')
    setError(null)
    setLoadingStates({
      overview: true,
      protocols: true,
      historical: true,
      rates: true
    })

    // Preload critical data immediately
    preload()
    
    // Start parallel data fetching
    Promise.allSettled([
      fetchYieldRates(),
      fetchPoolData(),
      fetchHistoricalData()
    ]).then(() => {
      endTimer('total_load')
    })

  }, [connected, publicKey, fetchYieldRates, fetchPoolData, fetchHistoricalData, preload, startTimer, endTimer])

  // Auto-refresh rates every 30 seconds
  useEffect(() => {
    if (!connected) return
    
    const interval = setInterval(() => {
      fetchYieldRates()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [connected, fetchYieldRates])

  // Update metrics when processed data changes
  useEffect(() => {
    if (processedMetrics) {
      setYieldMetrics(processedMetrics)
    }
  }, [processedMetrics])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      fastYieldService.clearCache()
    }
  }, [])

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: amount > 1000000 ? 'compact' : 'standard'
    }).format(amount)
  }

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(2)}%`
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Dark Theme with Colorful Stars */}
        <div className="absolute inset-0 stars-background"></div>
        <div className="absolute inset-0 stars-background-large opacity-60"></div>
        <div className="absolute inset-0 grid-background"></div>
        <div className="absolute inset-0 grid-background-fine opacity-40"></div>
        <div className="absolute inset-0 grid-dots opacity-20"></div>
        
        {/* Subtle Dark Overlays for Depth */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30"></div>
        
        <Navigation />
        
        <div className="max-w-4xl mx-auto pt-20 relative z-10 p-6">
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
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Theme with Colorful Stars */}
      <div className="absolute inset-0 stars-background"></div>
      <div className="absolute inset-0 stars-background-large opacity-60"></div>
      <div className="absolute inset-0 grid-background"></div>
      <div className="absolute inset-0 grid-background-fine opacity-40"></div>
      <div className="absolute inset-0 grid-dots opacity-20"></div>
      
      {/* Subtle Dark Overlays for Depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30"></div>
      
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20 relative z-10 p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Yield Tracker</h1>
          <p className="text-gray-300">Real-time DeFi yield monitoring and analytics</p>
          <div className="mt-4 flex justify-center items-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live Data</span>
            </div>
            {error && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-red-400 text-sm">Connection Issues</span>
              </div>
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6 text-center">
              {loadingStates.overview ? (
                <>
                  <LoadingSkeleton className="h-8 w-24 mx-auto mb-1" />
                  <LoadingSkeleton className="h-4 w-16 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {yieldMetrics ? formatCurrency(yieldMetrics.totalValueLocked) : '$0'}
                  </div>
                  <div className="text-gray-400 text-sm">Total Value Locked</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6 text-center">
              {loadingStates.overview ? (
                <>
                  <LoadingSkeleton className="h-8 w-24 mx-auto mb-1" />
                  <LoadingSkeleton className="h-4 w-20 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {yieldMetrics ? formatCurrency(yieldMetrics.totalYieldGenerated) : '$0'}
                  </div>
                  <div className="text-gray-400 text-sm">Monthly Yield Est.</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6 text-center">
              {loadingStates.overview ? (
                <>
                  <LoadingSkeleton className="h-8 w-16 mx-auto mb-1" />
                  <LoadingSkeleton className="h-4 w-16 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {yieldMetrics ? formatPercentage(yieldMetrics.averageAPY) : '0%'}
                  </div>
                  <div className="text-gray-400 text-sm">Average APY</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-6 text-center">
              {loadingStates.overview ? (
                <>
                  <LoadingSkeleton className="h-8 w-8 mx-auto mb-1" />
                  <LoadingSkeleton className="h-4 w-20 mx-auto" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {yieldMetrics ? yieldMetrics.activeStakes : 0}
                  </div>
                  <div className="text-gray-400 text-sm">Active Protocols</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Protocol Breakdown */}
        <Card className="bg-white/5 border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🏦 Protocol Breakdown
              {loadingStates.protocols && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStates.protocols ? (
              <EnhancedLoadingStates.ProtocolSkeleton />
            ) : yieldMetrics ? (
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
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${protocol.allocation}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-4">No protocol data available</div>
                <p className="text-gray-500">Please check your connection and try again</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-Time Rates */}
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              ⚡ Live Protocol Rates
              {loadingStates.rates && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStates.rates ? (
              <EnhancedLoadingStates.RatesSkeleton />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(realTimeRates).map(([protocol, rate]) => (
                  <div key={protocol} className="text-center p-4 bg-white/10 rounded-lg transform hover:scale-105 transition-transform">
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
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default OptimizedYieldTracker