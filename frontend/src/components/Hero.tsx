'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { ArrowRight, Shield, Users, DollarSign, Zap, Star, Globe, TrendingUp, ChevronDown, CreditCard } from 'lucide-react'
import { OnRampModal } from './OnRampModal'

export function Hero() {
    const { connected } = useWallet()
    const [mounted, setMounted] = useState(false)
    const [showOnRamp, setShowOnRamp] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const stats = [
        { value: '$2.1M+', label: 'Total Value Locked', icon: DollarSign },
        { value: '50K+', label: 'Active Members', icon: Users },
        { value: '1,200+', label: 'Active Groups', icon: Globe },
        { value: '98.5%', label: 'Success Rate', icon: TrendingUp }
    ]

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
                <div className="animate-pulse text-center">
                    <div className="h-16 bg-white/10 rounded mb-8 max-w-4xl mx-auto"></div>
                    <div className="h-8 bg-white/10 rounded mb-8 max-w-2xl mx-auto"></div>
                    <div className="h-12 bg-white/10 rounded w-48 mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <section className="relative min-h-screen bg-gray-900 text-white flex items-center">
            {/* Clean gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900"></div>

            {/* Content */}
            <div className="relative z-10 w-full pt-20">
                <div className="container mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 mb-8 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <span className="text-sm font-medium text-blue-400">Built on Solana • DeFi Savings</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="block text-white mb-4">Save Together,</span>
                        <span className="block text-gradient-clean">Build Wealth</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join the future of community savings. Transparent, secure, and profitable group savings
                        powered by blockchain technology.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        {connected ? (
                            <>
                                <button
                                    onClick={() => {
                                        document.getElementById('groups')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <span>Browse Groups</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setShowOnRamp(true)}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>Get USDC</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <WalletMultiButton className="!btn-primary" />
                                <button
                                    onClick={() => {
                                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                                    }}
                                    className="btn-secondary"
                                >
                                    Learn More
                                </button>
                            </>
                        )}
                    </div>

                    {/* Clean Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* OnRamp Modal */}
            <OnRampModal
                isOpen={showOnRamp}
                onClose={() => setShowOnRamp(false)}
            />
        </section>
    )
}