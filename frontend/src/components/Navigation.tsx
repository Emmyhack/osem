'use client'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { Menu, X, Zap, Users, Shield, TrendingUp, ExternalLink, Globe, Activity, Star } from 'lucide-react'

export function Navigation() {
    const { connected, publicKey } = useWallet()
    const [mounted, setMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setMounted(true)

        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!mounted) {
        return (
            <nav className="fixed top-0 w-full z-50 glass-modern border-b border-white/10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="h-10 w-32 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-10 w-40 bg-white/10 rounded animate-pulse"></div>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'nav-clean' : 'bg-transparent'
            }`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white">Oseme</span>
                            <div className="text-xs text-gray-400">Thrift & Savings</div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <div className="flex items-center space-x-8">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Features
                            </a>
                            <a href="#groups" className="text-gray-300 hover:text-white transition-colors font-medium">
                                Groups
                            </a>
                            <a href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">
                                About
                            </a>
                        </div>

                        {/* Wallet Connection */}
                        <div className="flex items-center space-x-4">
                            <WalletMultiButton className="!bg-blue-600 !text-white !font-medium !px-6 !py-2 !rounded-lg !border-none hover:!bg-blue-700 !transition-colors !duration-200" />
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden mt-6 pb-6 border-t border-gray-700">
                        <div className="flex flex-col space-y-4 pt-6">
                            <a href="#features" className="text-gray-300 hover:text-white transition-colors px-4 py-2">
                                Features
                            </a>
                            <a href="#groups" className="text-gray-300 hover:text-white transition-colors px-4 py-2">
                                Groups
                            </a>
                            <a href="#about" className="text-gray-300 hover:text-white transition-colors px-4 py-2">
                                About
                            </a>

                            <div className="pt-4 border-t border-gray-700">
                                <WalletMultiButton className="!w-full !bg-blue-600 !text-white !font-medium !px-6 !py-3 !rounded-lg !border-none hover:!bg-blue-700 !transition-colors !duration-200" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}