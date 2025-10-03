import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import InsuranceReserve from '../src/components/InsuranceReserve'

// Mock the services
vi.mock('../src/services/solanaInsuranceService', () => {
  const mockInsuranceService = {
    fetchInsuranceData: vi.fn().mockResolvedValue({
      totalReserve: 2500000,
      totalCoverage: 12800000,
      avgClaimAmount: 8450,
      monthlyClaims: 47,
      utilizationRate: 5.7,
      coverageRatio: 512,
      responseTime: 2.3,
      successRate: 99.7
    }),
    getRiskDistribution: vi.fn().mockResolvedValue({
      lowRisk: { percentage: 65.2 },
      mediumRisk: { percentage: 28.3 },
      highRisk: { percentage: 6.5 }
    }),
    getRealtimeClaimActivity: vi.fn().mockResolvedValue([
      { type: 'claim_processed', amount: 5000, timestamp: new Date() },
      { type: 'policy_created', amount: 1000, timestamp: new Date() }
    ])
  }
  
  return {
    default: vi.fn().mockImplementation(() => mockInsuranceService)
  }
})

// Mock the InsuranceCharts component
vi.mock('../src/components/InsuranceCharts', () => ({
  LiveInsuranceDashboard: () => <div data-testid="live-insurance-dashboard">Insurance Dashboard</div>
}))

const InsuranceReserveWrapper = () => (
  <BrowserRouter>
    <InsuranceReserve />
  </BrowserRouter>
)

describe('InsuranceReserve Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders insurance reserve dashboard', async () => {
    render(<InsuranceReserveWrapper />)
    
    // Wait for async data to load
    await waitFor(() => {
      // Check for main heading
      expect(screen.getByText(/Insurance Reserve Dashboard/i)).toBeInTheDocument()
    })
    
    // Check for key metrics
    expect(screen.getByText(/Total Reserve/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Coverage/i)).toBeInTheDocument()
    expect(screen.getByText(/Utilization Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/Claims Paid/i)).toBeInTheDocument()
    
    // Check for transparency section
    expect(screen.getByText(/Transparency Metrics/i)).toBeInTheDocument()
    expect(screen.getByText(/Reserve Sufficiency/i)).toBeInTheDocument()
    expect(screen.getByText(/Coverage Ratio/i)).toBeInTheDocument()
    expect(screen.getByText(/Audit Status/i)).toBeInTheDocument()
  })

  test('displays real-time reserve data', async () => {
    render(<InsuranceReserveWrapper />)
    
    // Wait for data to load and check for currency formatting
    await waitFor(() => {
      // The component formats currency, so we look for partial matches
      expect(screen.getByText(/2,500,000/)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/12,800,000/)).toBeInTheDocument()
    
    // Check for percentage formatting  
    expect(screen.getByText(/5.7%/)).toBeInTheDocument()
  })

  test('shows risk distribution and live activity', async () => {
    render(<InsuranceReserveWrapper />)
    
    // Wait for data to load
    await waitFor(() => {
      // Check for risk distribution section
      expect(screen.getByText(/Risk Distribution/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Low Risk Groups/i)).toBeInTheDocument()
    expect(screen.getByText(/Medium Risk Groups/i)).toBeInTheDocument()
    expect(screen.getByText(/High Risk Groups/i)).toBeInTheDocument()
    
    // Check for live activity feed
    expect(screen.getByText(/Live Reserve Activity/i)).toBeInTheDocument()
  })

  test('displays timeframe selector', async () => {
    render(<InsuranceReserveWrapper />)
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('7d')).toBeInTheDocument()
    })
    
    expect(screen.getByText('30d')).toBeInTheDocument()  
    expect(screen.getByText('90d')).toBeInTheDocument()
    expect(screen.getByText('1y')).toBeInTheDocument()
  })

  test('shows live insurance analytics dashboard', async () => {
    render(<InsuranceReserveWrapper />)
    
    // Wait for component to render and check for the live insurance dashboard
    await waitFor(() => {
      expect(screen.getByText(/Live Insurance Analytics/i)).toBeInTheDocument()
    })
    
    expect(screen.getByTestId('live-insurance-dashboard')).toBeInTheDocument()
  })

  test('displays transparency and audit information', async () => {
    render(<InsuranceReserveWrapper />)
    
    // Wait for data to load and check for transparency metrics
    await waitFor(() => {
      expect(screen.getByText(/Excellent/i)).toBeInTheDocument()
    })
    
    expect(screen.getByText(/Current/i)).toBeInTheDocument()
    expect(screen.getByText(/Dec 2024/i)).toBeInTheDocument()
    expect(screen.getByText(/View on Explorer/i)).toBeInTheDocument()
    expect(screen.getByText(/Real-time/i)).toBeInTheDocument()
  })
})
