// Performance monitoring utilities for the Vite app

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  bundleSize?: number
  memoryUsage?: number
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeMetrics()
    this.setupObservers()
  }

  private initializeMetrics() {
    // Mark app start time
    performance.mark('app-start')
    
    // Log initial metrics
    if (import.meta.env.DEV) {
      console.log('🚀 Oseme Performance Monitor initialized')
    }
  }

  private setupObservers() {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.renderTime = entry.startTime
            if (import.meta.env.DEV) {
              console.log(`🎨 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`)
            }
          }
        })
      })

      try {
        paintObserver.observe({ entryTypes: ['paint'] })
        this.observers.push(paintObserver)
      } catch (error) {
        console.warn('Paint observer not supported')
      }

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          if (import.meta.env.DEV) {
            console.log(`📊 Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`)
          }
        }
      })

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (error) {
        console.warn('LCP observer not supported')
      }

      // Layout shifts
      const clsObserver = new PerformanceObserver((list) => {
        let clsScore = 0
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value
          }
        })
        if (clsScore > 0 && import.meta.env.DEV) {
          console.log(`📐 Cumulative Layout Shift: ${clsScore.toFixed(4)}`)
        }
      })

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (error) {
        console.warn('CLS observer not supported')
      }
    }
  }

  markAppReady() {
    performance.mark('app-ready')
    
    try {
      performance.measure('app-load-time', 'app-start', 'app-ready')
      const measure = performance.getEntriesByName('app-load-time')[0]
      this.metrics.loadTime = measure.duration

      if (import.meta.env.DEV) {
        console.log(`⚡ App load time: ${measure.duration.toFixed(2)}ms`)
      }
    } catch (error) {
      console.warn('Performance measurement failed:', error)
    }
  }

  measureInteraction(name: string, startTime: number) {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    if (import.meta.env.DEV && duration > 100) {
      console.log(`🐌 Slow interaction "${name}": ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }

  measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB
      
      if (import.meta.env.DEV) {
        console.log(`🧠 Memory usage: ${this.metrics.memoryUsage.toFixed(2)}MB`)
      }
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions
export function measureAsync<T>(
  name: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const startTime = performance.now()
    try {
      const result = await asyncFn()
      const duration = performance.now() - startTime
      
      if (import.meta.env.DEV) {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`)
      }
      
      resolve(result)
    } catch (error) {
      const duration = performance.now() - startTime
      
      if (import.meta.env.DEV) {
        console.log(`❌ ${name} failed after: ${duration.toFixed(2)}ms`)
      }
      
      reject(error)
    }
  })
}

export function measureRender(componentName: string) {
  return (_target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value
    
    descriptor.value = function (...args: any[]) {
      const startTime = performance.now()
      const result = method.apply(this, args)
      const duration = performance.now() - startTime
      
      if (import.meta.env.DEV && duration > 16) {
        console.log(`🎭 ${componentName}.${propertyName} render: ${duration.toFixed(2)}ms`)
      }
      
      return result
    }
    
    return descriptor
  }
}

// Bundle analyzer helper
export function logBundleInfo() {
  if (import.meta.env.DEV) {
    console.log('📦 Bundle Analysis:')
    console.log('- Run `npm run analyze` to see detailed bundle breakdown')
    console.log('- Use browser DevTools > Network to monitor chunk loading')
    console.log('- Check Lighthouse for performance scores')
  }
}

// Memory leak detection
export function detectMemoryLeaks() {
  if (import.meta.env.DEV && 'memory' in performance) {
    const initialMemory = (performance as any).memory.usedJSHeapSize
    
    return {
      check: () => {
        const currentMemory = (performance as any).memory.usedJSHeapSize
        const diff = currentMemory - initialMemory
        
        if (diff > 10 * 1024 * 1024) { // 10MB threshold
          console.warn(`🚨 Potential memory leak detected: +${(diff / 1024 / 1024).toFixed(2)}MB`)
        }
        
        return diff
      }
    }
  }
  
  return { check: () => 0 }
}