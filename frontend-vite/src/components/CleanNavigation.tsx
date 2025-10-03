import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet, SimpleWalletButton } from './TempWalletProvider'
import { Menu, X, Zap } from 'lucide-react'

const CleanNavigation: React.FC = () => {
    const { connected } = useWallet()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { label: 'Home', href: '/' },
        { label: 'Groups', href: '/groups' },
        { label: 'About', href: '/about' },
    ]

    return (
        <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Oseme</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={`text-sm font-medium transition-colors duration-200 ${
                                    location.pathname === item.href
                                        ? 'text-blue-400'
                                        : 'text-gray-300 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <SimpleWalletButton className="!px-4 !py-2 !text-sm" />
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-800">
                        <div className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-sm font-medium transition-colors duration-200 ${
                                        location.pathname === item.href
                                            ? 'text-blue-400'
                                            : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="pt-2">
                                <SimpleWalletButton className="w-full" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default CleanNavigation