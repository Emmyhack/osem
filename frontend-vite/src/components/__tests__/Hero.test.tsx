import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import Hero from '../Hero'

// Mock the wallet adapter
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    connected: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
  }),
}))

// Mock the wallet adapter UI
vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Connect Wallet</button>,
}))

// Wrapper component for Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
)

describe('Hero Component', () => {
  it('renders without crashing', () => {
    render(
      <RouterWrapper>
        <Hero />
      </RouterWrapper>
    )
    
    expect(screen.getByText('Save Together,')).toBeInTheDocument()
    expect(screen.getByText('Build Wealth')).toBeInTheDocument()
  })

  it('displays the main heading', () => {
    render(
      <RouterWrapper>
        <Hero />
      </RouterWrapper>
    )
    
    expect(screen.getByText('Save Together,')).toBeInTheDocument()
    expect(screen.getByText('Build Wealth')).toBeInTheDocument()
  })

  it('shows wallet connection button when not connected', () => {
    render(
      <RouterWrapper>
        <Hero />
      </RouterWrapper>
    )
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  it('displays statistics section', () => {
    render(
      <RouterWrapper>
        <Hero />
      </RouterWrapper>
    )
    
    expect(screen.getByText('$2.1M+')).toBeInTheDocument()
    expect(screen.getByText('50K+')).toBeInTheDocument()
    expect(screen.getByText('1,200+')).toBeInTheDocument()
    expect(screen.getByText('98.5%')).toBeInTheDocument()
  })
})