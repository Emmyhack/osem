import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import YieldOptimization from '../src/components/YieldOptimization'

// Mock CSS module
jest.mock('../index.css', () => ({}))

const YieldOptimizationWrapper = () => (
  <BrowserRouter>
    <YieldOptimization />
  </BrowserRouter>
)

describe('YieldOptimization Component', () => {
  test('renders yield optimization dashboard', () => {
    render(<YieldOptimizationWrapper />)
    
    // Check for main heading
    expect(screen.getByText(/Yield Optimization Engine/i)).toBeInTheDocument()
    
    // Check for key metrics
    expect(screen.getByText(/Idle Funds/i)).toBeInTheDocument()
    expect(screen.getByText(/Total Yield/i)).toBeInTheDocument()
    expect(screen.getByText(/Average APY/i)).toBeInTheDocument()
    expect(screen.getByText(/Active Strategies/i)).toBeInTheDocument()
    
    // Check for strategies table
    expect(screen.getByText(/Active Yield Strategies/i)).toBeInTheDocument()
    expect(screen.getByText(/Marinade Finance/i)).toBeInTheDocument()
    expect(screen.getByText(/Jupiter/i)).toBeInTheDocument()
    expect(screen.getByText(/Drift/i)).toBeInTheDocument()
    
    // Check for risk management section
    expect(screen.getByText(/Risk Management/i)).toBeInTheDocument()
    expect(screen.getByText(/Maximum Single Protocol/i)).toBeInTheDocument()
    expect(screen.getByText(/Emergency Withdrawal/i)).toBeInTheDocument()
  })

  test('displays real-time yield data', () => {
    render(<YieldOptimizationWrapper />)
    
    // Check for currency formatting
    expect(screen.getByText(/\$8,947,234/)).toBeInTheDocument()
    expect(screen.getByText(/\$234,567/)).toBeInTheDocument()
    
    // Check for percentage formatting
    expect(screen.getByText(/9.2%/)).toBeInTheDocument()
    expect(screen.getByText(/6.8%/)).toBeInTheDocument()
    expect(screen.getByText(/12.4%/)).toBeInTheDocument()
  })

  test('shows protocol allocations and risk levels', () => {
    render(<YieldOptimizationWrapper />)
    
    // Check for allocation percentages
    expect(screen.getByText(/35%/)).toBeInTheDocument()
    expect(screen.getByText(/20%/)).toBeInTheDocument()
    expect(screen.getByText(/15%/)).toBeInTheDocument()
    expect(screen.getByText(/25%/)).toBeInTheDocument()
    
    // Check for risk levels
    expect(screen.getAllByText(/Low/)).toHaveLength(3)
    expect(screen.getAllByText(/Medium/)).toHaveLength(2)
    
    // Check for status badges
    expect(screen.getAllByText(/Active/)).toHaveLength(4)
    expect(screen.getByText(/Monitoring/)).toBeInTheDocument()
  })

  test('displays performance timeframe selector', () => {
    render(<YieldOptimizationWrapper />)
    
    expect(screen.getByText('24h')).toBeInTheDocument()
    expect(screen.getByText('7d')).toBeInTheDocument()
    expect(screen.getByText('30d')).toBeInTheDocument()
    expect(screen.getByText('90d')).toBeInTheDocument()
  })
})