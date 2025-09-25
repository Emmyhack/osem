'use client'
import { Zap, Twitter, Github, Mail, ExternalLink } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-800 border-t border-gray-700">
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Oseme</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Revolutionizing traditional savings through blockchain technology.
                            Building wealth together, one group at a time.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Platform section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'How It Works', href: '#' },
                                { label: 'Group Types', href: '#groups' },
                                { label: 'Security', href: '#' },
                                { label: 'Fees', href: '#' }
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Documentation', href: '#' },
                                { label: 'API Reference', href: '#' },
                                { label: 'Smart Contracts', href: '#' },
                                { label: 'Whitepaper', href: '#' }
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Help Center', href: '#' },
                                { label: 'Community', href: '#' },
                                { label: 'Contact Us', href: '#' },
                                { label: 'Bug Reports', href: '#' }
                            ].map((item) => (
                                <li key={item.label}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="border-t border-gray-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                            <span>© 2024 Oseme. All rights reserved.</span>
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>

                        <div className="text-sm text-gray-400">
                            Built on <span className="text-blue-400 font-semibold">Solana</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}