// Performance monitoring for yield data loading
class YieldPerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  private startTimes: Map<string, number> = new Map()
  
  startTimer(operation: string) {
    this.startTimes.set(operation, performance.now())
  }
  
  endTimer(operation: string) {
    const startTime = this.startTimes.get(operation)
    if (startTime) {
      const duration = performance.now() - startTime
      this.metrics.set(operation, duration)
      console.log(`⏱️ ${operation}: ${duration.toFixed(2)}ms`)
      this.startTimes.delete(operation)
      return duration
    }
    return 0
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
  
  getAverageLoadTime() {
    const times = Array.from(this.metrics.values())
    return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0
  }
  
  reportPerformance() {
    const metrics = this.getMetrics()
    const avgTime = this.getAverageLoadTime()
    
    console.table({
      'Average Load Time': `${avgTime.toFixed(2)}ms`,
      'Data Fetch': `${(metrics['data_fetch'] || 0).toFixed(2)}ms`,
      'Rate Fetch': `${(metrics['rate_fetch'] || 0).toFixed(2)}ms`,
      'Pool Fetch': `${(metrics['pool_fetch'] || 0).toFixed(2)}ms`,
      'UI Render': `${(metrics['ui_render'] || 0).toFixed(2)}ms`
    })
    
    // Performance recommendations
    if (avgTime > 2000) {
      console.warn('🐌 Slow loading detected. Consider:')
      console.warn('- Enabling more aggressive caching')
      console.warn('- Using faster RPC endpoints')
      console.warn('- Implementing data preloading')
    } else if (avgTime < 500) {
      console.info('🚀 Excellent performance!')
    }
  }
  
  clear() {
    this.metrics.clear()
    this.startTimes.clear()
  }
}

// Data loading optimization utilities
export class LoadingOptimizer {
  private static instance: LoadingOptimizer
  private performanceMonitor = new YieldPerformanceMonitor()
  private cache = new Map<string, { data: any; timestamp: number; hits: number }>()
  
  static getInstance() {
    if (!LoadingOptimizer.instance) {
      LoadingOptimizer.instance = new LoadingOptimizer()
    }
    return LoadingOptimizer.instance
  }
  
  // Preload critical data
  async preloadCriticalData() {
    this.performanceMonitor.startTimer('preload')
    
    try {
      // Preload essential data that's needed immediately
      const criticalOperations = [
        this.preloadYieldRates(),
        this.preloadProtocolOverview(),
        this.preloadUserSettings()
      ]
      
      await Promise.allSettled(criticalOperations)
      this.performanceMonitor.endTimer('preload')
      
    } catch (error) {
      console.warn('Preload failed:', error)
    }
  }
  
  private async preloadYieldRates() {
    // Preload basic yield rates for immediate display
    const mockRates = {
      marinade: 6.5,
      solend: 5.2,
      francium: 8.1,
      portFinance: 7.8
    }
    
    this.cache.set('yield_rates_preload', {
      data: mockRates,
      timestamp: Date.now(),
      hits: 0
    })
  }
  
  private async preloadProtocolOverview() {
    // Preload protocol overview data
    const mockOverview = {
      totalTVL: 1900000000,
      averageAPY: 7.8,
      activeProtocols: 4,
      totalParticipants: 45000
    }
    
    this.cache.set('protocol_overview_preload', {
      data: mockOverview,
      timestamp: Date.now(),
      hits: 0
    })
  }
  
  private async preloadUserSettings() {
    // Preload user preferences for faster settings load
    const defaultSettings = {
      refreshInterval: 30000,
      preferredCurrency: 'USD',
      notifications: true
    }
    
    this.cache.set('user_settings_preload', {
      data: defaultSettings,
      timestamp: Date.now(),
      hits: 0
    })
  }
  
  // Smart caching with usage tracking
  getCachedData(key: string) {
    const cached = this.cache.get(key)
    if (cached) {
      cached.hits++
      return cached.data
    }
    return null
  }
  
  setCachedData(key: string, data: any, ttl: number = 30000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    })
    
    // Auto-cleanup expired entries
    setTimeout(() => {
      this.cache.delete(key)
    }, ttl)
  }
  
  // Performance monitoring
  startOperation(name: string) {
    this.performanceMonitor.startTimer(name)
  }
  
  endOperation(name: string) {
    return this.performanceMonitor.endTimer(name)
  }
  
  getPerformanceReport() {
    return this.performanceMonitor.reportPerformance()
  }
  
  // Cache analytics
  getCacheStats() {
    const stats = {
      totalEntries: this.cache.size,
      hitCounts: {} as Record<string, number>,
      totalHits: 0
    }
    
    for (const [key, value] of this.cache.entries()) {
      stats.hitCounts[key] = value.hits
      stats.totalHits += value.hits
    }
    
    return stats
  }
  
  // Cleanup
  cleanup() {
    this.cache.clear()
    this.performanceMonitor.clear()
  }
}

// Hook for using the loading optimizer
export const useLoadingOptimizer = () => {
  const optimizer = LoadingOptimizer.getInstance()
  
  return {
    preload: () => optimizer.preloadCriticalData(),
    startTimer: (name: string) => optimizer.startOperation(name),
    endTimer: (name: string) => optimizer.endOperation(name),
    getCached: (key: string) => optimizer.getCachedData(key),
    setCached: (key: string, data: any, ttl?: number) => optimizer.setCachedData(key, data, ttl),
    getStats: () => optimizer.getCacheStats(),
    cleanup: () => optimizer.cleanup()
  }
}

export default LoadingOptimizer