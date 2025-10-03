import React, { useState, useEffect } from 'react'
import { useWallet, SimpleWalletButton } from './TempWalletProvider'
import { ArrowRight, Users, DollarSign, Globe, TrendingUp, CreditCard } from 'lucide-react'

const Hero: React.FC = () => {
    const { connected } = useWallet()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const stats = [
        { value: '$2.1M+', label: 'Total Value Locked', icon: DollarSign },
        { value: '50K+', label: 'Active Members', icon: Users },
        { value: '1,200+', label: 'Active Groups', icon: Globe },
        { value: '98.5%', label: 'Success Rate', icon: TrendingUp }
    ]

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

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
        <section className="relative min-h-screen bg-gray-900 text-white flex items-center overflow-hidden">
            {/* Enhanced gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/30"></div>
            
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-bounce-subtle" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-cyan-500/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full pt-16 sm:pt-20">
                <div className="container-fluid text-center">
                    {/* Badge with animation */}
                    <div className="inline-flex items-center px-4 py-2 mb-6 sm:mb-8 bg-blue-500/10 rounded-full border border-blue-500/20 animate-fade-in-scale backdrop-blur-sm">
                        <span className="text-xs sm:text-sm font-medium text-blue-400">Built on Solana • DeFi Savings</span>
                    </div>

                    {/* Main Heading with responsive text */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-slide-in-up">
                        <span className="block text-white mb-2 sm:mb-4">Save Together,</span>
                        <span className="block text-gradient animate-gradient">
                            Build Wealth
                        </span>
                    </h1>

                    {/* Subtitle with responsive text */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                        Join the future of community savings. Transparent, secure, and profitable group savings
                        powered by blockchain technology.
                    </p>

                    {/* Action Buttons with staggered animation */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4 animate-slide-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                        {connected ? (
                            <>
                                <button
                                    onClick={() => scrollToSection('groups')}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <span>Browse Groups</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    className="btn-secondary flex items-center space-x-2"
                                    onClick={() => {
                                        // This would open an OnRamp modal in a real implementation
                                        console.log('Opening OnRamp modal')
                                    }}
                                >
                                    <CreditCard className="w-4 h-4" />
                                    <span>Get USDC</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <SimpleWalletButton className="btn-primary" />
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="btn-secondary"
                                >
                                    Learn More
                                </button>
                            </>
                        )}
                    </div>

                    {/* Enhanced Stats with animations */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto px-4 animate-fade-in-scale" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                        {stats.map((stat, index) => (
                            <div 
                                key={stat.label} 
                                className="text-center p-4 rounded-xl glass-card hover:glass-modern transition-all duration-300 group animate-slide-in-up"
                                style={{ animationDelay: `${0.8 + index * 0.1}s`, animationFillMode: 'both' }}
                            >
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-400 font-medium group-hover:text-gray-300 transition-colors duration-300">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero