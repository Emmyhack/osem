import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContributeModal } from '@/components/ContributeModal'
import '@testing-library/jest-dom'

// Integration tests for ContributeModal component
describe('ContributeModal Integration', () => {
    const mockGroup = {
        id: '1',
        contributionAmount: 100000000, // 100 USDC in lamports
        model: 'Trust Group'
    }

    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        group: mockGroup,
        onContribute: jest.fn(),
        getBalance: jest.fn().mockResolvedValue(200000000) // 200 USDC
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders modal with correct group information', async () => {
        render(<ContributeModal {...defaultProps} />)

        expect(screen.getByText('Contribute to Group')).toBeInTheDocument()
        expect(screen.getByText('100 USDC')).toBeInTheDocument()
        expect(screen.getByText('Trust Group')).toBeInTheDocument()
    })

    test('displays wallet balance when available', async () => {
        render(<ContributeModal {...defaultProps} />)

        await waitFor(() => {
            expect(screen.getByText('200.00 USDC')).toBeInTheDocument()
        })
    })

    test('validates contribution amount', async () => {
        render(<ContributeModal {...defaultProps} />)

        const input = screen.getByLabelText(/amount/i)
        const contributeButton = screen.getByRole('button', { name: /contribute/i })

        // Test invalid amount
        fireEvent.change(input, { target: { value: '50' } })
        fireEvent.click(contributeButton)

        expect(screen.getByText('Amount must be exactly 100 USDC')).toBeInTheDocument()
    })

    test('calls onContribute with correct amount', async () => {
        const onContribute = jest.fn().mockResolvedValue(undefined)
        render(<ContributeModal {...defaultProps} onContribute={onContribute} />)

        const input = screen.getByLabelText(/amount/i)
        const contributeButton = screen.getByRole('button', { name: /contribute/i })

        fireEvent.change(input, { target: { value: '100' } })
        fireEvent.click(contributeButton)

        await waitFor(() => {
            expect(onContribute).toHaveBeenCalledWith(100000000)
        })
    })

    test('shows insufficient balance error', async () => {
        const getBalance = jest.fn().mockResolvedValue(50000000) // 50 USDC
        render(<ContributeModal {...defaultProps} getBalance={getBalance} />)

        const input = screen.getByLabelText(/amount/i)
        const contributeButton = screen.getByRole('button', { name: /contribute/i })

        fireEvent.change(input, { target: { value: '100' } })
        fireEvent.click(contributeButton)

        expect(screen.getByText('Insufficient USDC balance')).toBeInTheDocument()
    })
})