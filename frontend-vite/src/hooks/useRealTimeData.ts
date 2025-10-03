import { useState, useEffect, useCallback } from 'react'
import SolanaYieldService, { YieldData, YieldStrategy } from '../services/solanaYieldService'
import SolanaInsuranceService, { InsuranceData, RiskDistribution, ClaimActivity } from '../services/solanaInsuranceService'

export interface RealTimeDataState {
  yieldData: YieldData | null
  yieldStrategies: YieldStrategy[]
  insuranceData: InsuranceData | null
  riskDistribution: RiskDistribution | null
  claimActivity: ClaimActivity[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

export function useRealTimeData() {
  const [state, setState] = useState<RealTimeDataState>({
    yieldData: null,
    yieldStrategies: [],
    insuranceData: null,
    riskDistribution: null,
    claimActivity: [],
    loading: true,
    error: null,
    lastUpdated: null
  })

  const [yieldService] = useState(() => new SolanaYieldService())
  const [insuranceService] = useState(() => new SolanaInsuranceService())

  const fetchAllData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const [
        yieldData,
        yieldStrategies,
        insuranceData,
        riskDistribution,
        claimActivity
      ] = await Promise.all([
        yieldService.fetchYieldData(),
        yieldService.getStrategies(),
        insuranceService.fetchInsuranceData(),
        insuranceService.getRiskDistribution(),
        insuranceService.getRealtimeClaimActivity()
      ])

      setState({
        yieldData,
        yieldStrategies,
        insuranceData,
        riskDistribution,
        claimActivity,
        loading: false,
        error: null,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Error fetching real-time data:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch real-time data'
      }))
    }
  }, [yieldService, insuranceService])

  const fetchYieldDataOnly = useCallback(async () => {
    try {
      const [yieldData, yieldStrategies] = await Promise.all([
        yieldService.fetchYieldData(),
        yieldService.getStrategies()
      ])

      setState(prev => ({
        ...prev,
        yieldData,
        yieldStrategies,
        lastUpdated: new Date()
      }))
    } catch (error) {
      console.error('Error fetching yield data:', error)
    }
  }, [yieldService])

  const fetchInsuranceDataOnly = useCallback(async () => {
    try {
      const [insuranceData, claimActivity] = await Promise.all([
        insuranceService.fetchInsuranceData(),
        insuranceService.getRealtimeClaimActivity()
      ])

      setState(prev => ({
        ...prev,
        insuranceData,
        claimActivity,
        lastUpdated: new Date()
      }))
    } catch (error) {
      console.error('Error fetching insurance data:', error)
    }
  }, [insuranceService])

  // Initial load
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  // Real-time updates - yield data every 10 seconds
  useEffect(() => {
    const yieldInterval = setInterval(fetchYieldDataOnly, 10000)
    return () => clearInterval(yieldInterval)
  }, [fetchYieldDataOnly])

  // Real-time updates - insurance data every 5 seconds
  useEffect(() => {
    const insuranceInterval = setInterval(fetchInsuranceDataOnly, 5000)
    return () => clearInterval(insuranceInterval)
  }, [fetchInsuranceDataOnly])

  return {
    ...state,
    refresh: fetchAllData,
    refreshYield: fetchYieldDataOnly,
    refreshInsurance: fetchInsuranceDataOnly,
    calculateYieldEarnings: (principal: number, days: number) => 
      yieldService.calculateYieldEarnings(principal, days),
    calculateInsuranceCoverage: (amount: number, riskLevel: 'Low' | 'Medium' | 'High') =>
      insuranceService.calculateCoverage(amount, riskLevel)
  }
}

// Export individual hooks for specific use cases
export function useYieldData() {
  const { yieldData, yieldStrategies, loading, error, refreshYield, calculateYieldEarnings } = useRealTimeData()
  
  return {
    yieldData,
    strategies: yieldStrategies,
    loading,
    error,
    refresh: refreshYield,
    calculateEarnings: calculateYieldEarnings
  }
}

export function useInsuranceData() {
  const { 
    insuranceData, 
    riskDistribution, 
    claimActivity, 
    loading, 
    error, 
    refreshInsurance, 
    calculateInsuranceCoverage 
  } = useRealTimeData()
  
  return {
    insuranceData,
    riskDistribution,
    claimActivity,
    loading,
    error,
    refresh: refreshInsurance,
    calculateCoverage: calculateInsuranceCoverage
  }
}