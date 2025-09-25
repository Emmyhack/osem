'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, DollarSign } from 'lucide-react'

interface Group {
    id: string
    contributionAmount: number
    model: string
}

interface ContributeModalProps {
    isOpen: boolean
    onClose: () => void
    group: Group
    onContribute: (amount: number) => Promise<void>
    getBalance?: () => Promise<number>
}

export function ContributeModal({
    isOpen,
    onClose,
    group,
    onContribute,
    getBalance
}: ContributeModalProps) {
    const [amount, setAmount] = useState('')
    const [balance, setBalance] = useState<number | null>(null)
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)

    const requiredAmount = group.contributionAmount / 1e6 // Convert from lamports to USDC

    useEffect(() => {
        if (isOpen && getBalance) {
            getBalance().then(setBalance).catch(() => setBalance(0))
        }
    }, [isOpen, getBalance])

    const handleContribute = async () => {
        setError('')
        const amountValue = parseFloat(amount)

        // Validate amount
        if (isNaN(amountValue) || amountValue <= 0) {
            setError('Please enter a valid amount')
            return
        }

        if (amountValue !== requiredAmount) {
            setError(`Amount must be exactly ${requiredAmount} USDC`)
            return
        }

        // Check balance if available
        if (balance !== null && balance < group.contributionAmount) {
            setError('Insufficient USDC balance')
            return
        }

        setIsLoading(true)
        try {
            await onContribute(group.contributionAmount)
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to contribute')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        Contribute to Group
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Group Info */}
                    <div className="card-clean">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Required Amount</h3>
                                <p className="text-gray-300">{requiredAmount} USDC</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-400">
                            Model: <span className="text-blue-400">{group.model}</span>
                        </div>
                    </div>

                    {/* Balance Display */}
                    {balance !== null && (
                        <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                            <span className="text-gray-300">Your Balance:</span>
                            <span className="text-white font-medium">
                                {(balance / 1e6).toFixed(2)} USDC
                            </span>
                        </div>
                    )}

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-gray-300">
                            Contribution Amount (USDC)
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder={requiredAmount.toString()}
                            className="bg-gray-700 border-gray-600 text-white"
                            step="0.01"
                            min="0"
                        />
                        <p className="text-sm text-gray-400">
                            Exact amount required: {requiredAmount} USDC
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleContribute}
                            disabled={isLoading || !amount}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Contributing...
                                </>
                            ) : (
                                'Contribute'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}