'use client'
import { Shield, Users, TrendingUp, Lock, Globe, Activity, CheckCircle, ArrowRight, Star, Wallet, Coins } from 'lucide-react'

export function Features() {
    const features = [
        {
            icon: Shield,
            title: "USDC Stability",
            description: "Protect against volatility with stable USDC-based savings",
            benefits: ["No volatility risk", "Instant liquidation", "USD peg stability"]
        },
        {
            icon: Lock,
            title: "Smart Contracts",
            description: "Eliminate trust issues with transparent blockchain automation",
            benefits: ["Trustless execution", "Open source code", "Audited security"]
        },
        {
            icon: TrendingUp,
            title: "Yield Generation",
            description: "Earn passive income on idle funds through DeFi strategies",
            benefits: ["Automated strategies", "Compound growth", "Optimized returns"]
        },
        {
            icon: Users,
            title: "Insurance Coverage",
            description: "Community-backed insurance pool for emergency protection",
            benefits: ["Risk pooling", "Emergency fund", "Community support"]
        },
        {
            icon: Activity,
            title: "Real-time Tracking",
            description: "Monitor your savings and earnings with live blockchain data",
            benefits: ["Live updates", "Performance metrics", "Transparent reporting"]
        },
        {
            icon: Globe,
            title: "Mobile Optimized",
            description: "Access your savings anywhere with our mobile-first design",
            benefits: ["Mobile responsive", "Cross-platform", "Offline access"]
        }
    ]

    const trustMetrics = [
        { icon: Shield, label: 'Smart Contract Audits', value: '100%' },
        { icon: Activity, label: 'Network Uptime', value: '99.99%' },
        { icon: Users, label: 'Active Communities', value: '1,200+' },
        { icon: Coins, label: 'Total Value Locked', value: '$12.5M' }
    ]

    return (
        <section id="features" className="section-clean bg-gray-800">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Why Choose Oseme
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Experience the future of decentralized savings with cutting-edge blockchain technology,
                        institutional-grade security, and lightning-fast performance on Solana.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <div key={index} className="card-clean">
                            {/* Icon */}
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Benefits List */}
                            <div className="space-y-3 mb-6">
                                {feature.benefits.map((benefit, benefitIndex) => (
                                    <div key={benefitIndex} className="flex items-center space-x-3">
                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                        <span className="text-gray-300 text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Learn More */}
                            <div className="flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors cursor-pointer">
                                <span className="text-sm">Learn more</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Metrics */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            Trusted by the Community
                        </h3>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Built with enterprise-grade security and transparency at every level
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {trustMetrics.map((metric, index) => (
                            <div key={index} className="text-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <metric.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-blue-400 mb-2">{metric.value}</div>
                                <div className="text-sm text-gray-400">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="text-center">
                    <div className="card-clean max-w-4xl mx-auto">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <Star className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-3xl font-bold text-white">Ready to Start Building Wealth?</h3>
                            <Star className="w-6 h-6 text-yellow-400" />
                        </div>
                        <p className="text-gray-300 mb-8 text-lg">
                            Join thousands of users already saving and earning with Oseme's revolutionary DeFi platform
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn-primary flex items-center justify-center space-x-2">
                                <Wallet className="w-5 h-5" />
                                <span>Connect Wallet</span>
                            </button>
                            <button className="btn-secondary flex items-center justify-center space-x-2">
                                <span>View Documentation</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
