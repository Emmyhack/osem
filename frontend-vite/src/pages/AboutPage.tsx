import React, { useState, useEffect } from 'react'
import { Shield, Users, Zap, Globe } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const AboutPage: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100)
        return () => clearTimeout(timer)
    }, [])

    const values = [
        {
            icon: Shield,
            title: 'Security First',
            description: 'Built on Solana blockchain with smart contract transparency and audited security protocols.'
        },
        {
            icon: Users,
            title: 'Community Driven',
            description: 'Empowering communities through collaborative savings and mutual financial support.'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'Leveraging cutting-edge DeFi technology to revolutionize traditional savings methods.'
        },
        {
            icon: Globe,
            title: 'Global Access',
            description: 'Accessible worldwide with no geographical restrictions or traditional banking requirements.'
        }
    ]

    const team = [
        {
            name: 'Alex Chen',
            role: 'Founder & CEO',
            description: 'Former Goldman Sachs analyst with 10+ years in fintech and blockchain development.',
            avatar: 'AC'
        },
        {
            name: 'Sarah Johnson',
            role: 'CTO',
            description: 'Ex-Google engineer specializing in distributed systems and blockchain architecture.',
            avatar: 'SJ'
        },
        {
            name: 'Michael Rodriguez',
            role: 'Head of Product',
            description: 'Product leader from Stripe with expertise in financial services and user experience.',
            avatar: 'MR'
        },
        {
            name: 'Emily Zhang',
            role: 'Lead Developer',
            description: 'Full-stack developer with deep expertise in Solana smart contracts and DeFi protocols.',
            avatar: 'EZ'
        }
    ]

    const milestones = [
        { year: '2024', event: 'Oseme Founded', description: 'Vision to democratize savings through blockchain technology' },
        { year: '2024', event: 'MVP Development', description: 'Core platform development and smart contract architecture' },
        { year: '2024', event: 'Beta Launch', description: 'Limited beta release with early adopters and community feedback' },
        { year: '2025', event: 'Public Launch', description: 'Full platform launch with advanced features and global accessibility' }
    ]

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navigation />
            
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Hero Section */}
                <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-24 h-24 bg-blue-500/10 rounded-full animate-float"></div>
                        <div className="absolute bottom-20 right-10 w-20 h-20 bg-purple-500/10 rounded-full animate-bounce-subtle"></div>
                    </div>
                    
                    <div className="container-fluid relative z-10">
                        <div className="text-center animate-fade-in">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                                About <span className="text-gradient">Oseme</span>
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                                Revolutionizing community savings through blockchain technology and decentralized finance.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16 sm:py-20 bg-gray-800/50">
                    <div className="container-fluid">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div className="animate-slide-in-left">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gradient">
                                    Our Mission
                                </h2>
                                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6">
                                    Oseme empowers individuals and communities to build wealth together through transparent, 
                                    secure, and accessible savings groups powered by blockchain technology.
                                </p>
                                <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                                    We believe financial inclusion should be universal. By leveraging Solana's fast and 
                                    affordable blockchain, we're creating a new paradigm for collaborative savings that 
                                    transcends traditional banking limitations.
                                </p>
                            </div>
                            
                            <div className="relative animate-slide-in-right">
                                <div className="glass-card p-8 sm:p-12 rounded-2xl border-gradient">
                                    <div className="grid grid-cols-2 gap-6 sm:gap-8">
                                        <div className="text-center">
                                            <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">50K+</div>
                                            <div className="text-sm text-gray-300">Active Users</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">$2.1M</div>
                                            <div className="text-sm text-gray-300">Total Saved</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">1.2K</div>
                                            <div className="text-sm text-gray-300">Active Groups</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">98.5%</div>
                                            <div className="text-sm text-gray-300">Success Rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 sm:py-20">
                    <div className="container-fluid">
                        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                Our <span className="text-gradient">Values</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                                The principles that guide everything we do at Oseme.
                            </p>
                        </div>

                        <div className="grid-responsive max-w-6xl mx-auto">
                            {values.map((value, index) => (
                                <div
                                    key={value.title}
                                    className="glass-card p-6 sm:p-8 rounded-xl border-gradient hover:border-blue-500/30 transition-all duration-500 group animate-fade-in-scale"
                                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                >
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                                        <value.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 group-hover:text-gradient transition-all duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16 sm:py-20 bg-gray-800/30">
                    <div className="container-fluid">
                        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                Meet Our <span className="text-gradient">Team</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                                Passionate experts building the future of decentralized finance.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
                            {team.map((member, index) => (
                                <div
                                    key={member.name}
                                    className="glass-card p-6 rounded-xl text-center border-gradient hover:border-blue-500/30 transition-all duration-500 group animate-slide-in-up"
                                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                                        {member.avatar}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
                                        {member.name}
                                    </h3>
                                    <div className="text-blue-400 font-medium mb-4">{member.role}</div>
                                    <p className="text-sm text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                                        {member.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roadmap Section */}
                <section className="py-16 sm:py-20">
                    <div className="container-fluid">
                        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                Our <span className="text-gradient">Journey</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
                                Key milestones in building the future of community savings.
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row gap-6 mb-8 sm:mb-12 animate-slide-in-left"
                                    style={{ animationDelay: `${index * 0.2}s`, animationFillMode: 'both' }}
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {milestone.year}
                                        </div>
                                    </div>
                                    <div className="flex-1 glass-card p-6 rounded-xl border-gradient hover:border-blue-500/30 transition-all duration-300">
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                                            {milestone.event}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
                    <div className="container-fluid text-center">
                        <div className="animate-fade-in-scale">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                                Ready to <span className="text-gradient">Get Started?</span>
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto px-4">
                                Join thousands of users already building wealth together through Oseme's innovative savings platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                                <button className="btn-primary flex-1 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                    Start Saving
                                </button>
                                <button className="btn-secondary flex-1 hover:bg-gray-700 transition-all duration-300">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}

export default AboutPage