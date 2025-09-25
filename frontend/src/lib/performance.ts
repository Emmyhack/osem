export const performanceConfig = {
  // Development optimizations
  dev: {
    // Disable heavy features in development
    disableAnimations: process.env.NODE_ENV === 'development',
    reduceMotion: true,
    skipNonCriticalRenders: true,
  },
  
  // Bundle optimization
  bundle: {
    // Critical CSS for above-the-fold content
    criticalCSS: [
      'navigation',
      'hero',
      'wallet-connection'
    ],
    
    // Defer non-critical components
    deferredComponents: [
      'features',
      'stats',
      'footer'
    ],
    
    // Preload critical resources
    preloadResources: [
      '/fonts/inter.woff2',
      '/api/groups/popular'
    ]
  },
  
  // Runtime optimizations  
  runtime: {
    // Debounce user inputs
    inputDebounceMs: 300,
    
    // Throttle scroll events
    scrollThrottleMs: 16,
    
    // Cache API responses
    cacheApiResponses: true,
    cacheTimeMs: 5 * 60 * 1000, // 5 minutes
  }
}

// Performance monitoring
export const trackPerformance = (name: string, fn: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${name}-start`)
    fn()
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    
    const measure = performance.getEntriesByName(name)[0]
    if (measure.duration > 100) { // Log slow operations
      console.warn(`Slow operation: ${name} took ${measure.duration.toFixed(2)}ms`)
    }
  } else {
    fn()
  }
}