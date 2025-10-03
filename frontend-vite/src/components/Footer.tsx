import React from 'react'
import { Zap, Twitter, Github, Mail, Send, Heart, Globe, Shield, Code } from 'lucide-react'

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear()

    const footerSections = [
        {
            title: 'Platform',
            icon: Globe,
            links: [
                { label: 'How It Works', href: '#features' },
                { label: 'Group Types', href: '/groups' },
                { label: 'Security', href: '#security' },
                { label: 'Fees', href: '#fees' }
            ]
        },
        {
            title: 'Resources',
            icon: Code,
            links: [
                { label: 'Documentation', href: '/docs' },
                { label: 'API Reference', href: '/api' },
                { label: 'Smart Contracts', href: '/contracts' },
                { label: 'Whitepaper', href: '/whitepaper' }
            ]
        },
        {
            title: 'Support',
            icon: Shield,
            links: [
                { label: 'Help Center', href: '/help' },
                { label: 'Community', href: '/community' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Bug Reports', href: '/bugs' }
            ]
        }
    ]

    const socialLinks = [
        { icon: Twitter, href: 'https://twitter.com/oseme', label: 'Twitter' },
        { icon: Github, href: 'https://github.com/oseme', label: 'GitHub' },
        { icon: Mail, href: 'mailto:hello@oseme.io', label: 'Email' },
        { icon: Send, href: 'https://t.me/oseme', label: 'Telegram' }
    ]

    return (
        <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-shimmer"></div>
            
            <div className="container-fluid relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand section */}
                    <div className="lg:col-span-2 animate-fade-in">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-float">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gradient">Oseme</span>
                        </div>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
                            Revolutionizing traditional savings through blockchain technology.
                            Building wealth together, one group at a time.
                        </p>
                        
                        {/* Newsletter signup */}
                        <div className="mb-8">
                            <h4 className="text-white font-semibold mb-3 text-sm">Stay Updated</h4>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                                />
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {socialLinks.map((social, index) => {
                                const IconComponent = social.icon
                                return (
                                    <a 
                                        key={social.label}
                                        href={social.href} 
                                        className="w-10 h-10 bg-gray-800/50 hover:bg-blue-600/20 border border-gray-700/50 hover:border-blue-500/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 transition-all duration-300 card-hover"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        title={social.label}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer sections */}
                    {footerSections.map((section, sectionIndex) => {
                        const IconComponent = section.icon
                        return (
                            <div 
                                key={section.title}
                                className="animate-slide-in-up"
                                style={{ animationDelay: `${sectionIndex * 0.1 + 0.2}s`, animationFillMode: 'both' }}
                            >
                                <div className="flex items-center space-x-2 mb-6">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <IconComponent className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <h3 className="text-white font-semibold text-sm">{section.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={link.label}>
                                            <a 
                                                href={link.href} 
                                                className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                                                style={{ animationDelay: `${linkIndex * 0.05 + sectionIndex * 0.1 + 0.4}s` }}
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </div>

                {/* Bottom section */}
                <div className="border-t border-gray-700/50 mt-12 pt-8 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <span>© {currentYear} Oseme. All rights reserved.</span>
                                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                            </div>
                            <div className="flex items-center space-x-4">
                                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span>Built on</span>
                                <span className="text-gradient font-semibold">Solana</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer