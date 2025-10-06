import React, { useState, useEffect } from 'react'
import { useWallet } from '../hooks/useLightWallet'
import { LightWalletButton } from './LightWalletButton'
import { Menu, X, Zap, Wallet } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Navigation: React.FC = () => {
    const { connected, publicKey } = useWallet()
    const location = useLocation()
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

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Groups', href: '/groups' },
        { label: 'Dashboard', href: '/complete' },
        { label: 'Staking', href: '/staking' },
        { label: 'Yield', href: '/yield' },
        { label: 'Settings', href: '/settings' },
        { label: 'Docs', href: '/docs' },
    ]

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
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled ? 'nav-clean' : 'bg-transparent'
        }`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white">Oseme</span>
                            <div className="text-xs text-gray-400">Thrift & Savings</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <div className="flex items-center space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`text-gray-300 hover:text-white transition-colors font-medium ${
                                        location.pathname === item.href ? 'text-blue-400' : ''
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Wallet Connection */}
                        <div className="flex items-center space-x-4">
                            {connected && publicKey ? (
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30">
                                        <Wallet className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                                        </span>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="text-gray-300 hover:text-white transition-colors font-medium"
                                    >
                                        Profile
                                    </Link>
                                </div>
                            ) : (
                                <LightWalletButton />
                            )}
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
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={`text-gray-300 hover:text-white transition-colors px-4 py-2 ${
                                        location.pathname === item.href ? 'text-blue-400' : ''
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {connected && publicKey && (
                                <>
                                    <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg border border-green-500/30 mx-4">
                                        <Wallet className="w-4 h-4" />
                                        <span className="text-sm font-medium">
                                            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                                        </span>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="text-gray-300 hover:text-white transition-colors px-4 py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                </>
                            )}

                            {!connected && (
                                <div className="pt-4 border-t border-gray-700">
                                    <LightWalletButton />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navigation