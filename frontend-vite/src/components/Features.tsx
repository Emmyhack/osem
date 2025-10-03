import React from 'react'
import { Shield, Users, TrendingUp, Lock, Globe, Activity } from 'lucide-react'

const Features: React.FC = () => {
    const features = [
        {
            icon: Shield,
            title: 'Blockchain Security',
            description: 'Your funds are secured by Solana blockchain technology with smart contract transparency.'
        },
        {
            icon: Users,
            title: 'Community-Driven',
            description: 'Join savings groups with like-minded individuals and build wealth together.'
        },
        {
            icon: TrendingUp,
            title: 'Guaranteed Returns',
            description: 'Earn predictable returns through our rotating savings group system.'
        },
        {
            icon: Lock,
            title: 'Trust System',
            description: 'Advanced trust scoring ensures reliable participants in your savings groups.'
        },
        {
            icon: Globe,
            title: 'Global Access',
            description: 'Access from anywhere in the world with just a wallet connection.'
        },
        {
            icon: Activity,
            title: 'Real-time Tracking',
            description: 'Monitor your savings progress and group activities in real-time.'
        }
    ]

    return (
        <section id="features" className="section-clean bg-gray-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>
            
            <div className="container-fluid relative z-10">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                        Why Choose <span className="text-gradient">Oseme</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                        Experience the future of savings with our blockchain-powered platform
                        designed for transparency, security, and community growth.
                    </p>
                </div>

                <div className="grid-responsive max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="glass-card p-6 sm:p-8 rounded-xl card-hover group animate-fade-in-scale border-gradient hover:border-blue-500/30 transition-all duration-500"
                            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-gradient transition-all duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12 sm:mt-16 animate-slide-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                    <button className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                        Get Started Today
                    </button>
                </div>
            </div>
        </section>
    )
}

export default Features