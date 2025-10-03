import React, { useEffect, useRef, useState } from 'react'
import { TrendingUp, Users, Target, Shield } from 'lucide-react'

interface CountUpProps {
    end: number
    duration?: number
    prefix?: string
    suffix?: string
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0)
    const [hasStarted, setHasStarted] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true)
                    let startTimestamp: number | null = null
                    const step = (timestamp: number) => {
                        if (!startTimestamp) startTimestamp = timestamp
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
                        setCount(Math.floor(progress * end))
                        if (progress < 1) {
                            window.requestAnimationFrame(step)
                        }
                    }
                    window.requestAnimationFrame(step)
                }
            },
            { threshold: 0.1 }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [end, duration, hasStarted])

    return (
        <div ref={elementRef} className="tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    )
}

const StatsSection: React.FC = () => {
    const stats = [
        { 
            value: 2100000, 
            display: '$2.1M+', 
            label: 'Total Saved', 
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20',
            icon: TrendingUp,
            prefix: '$',
            suffix: 'M+',
            description: 'Collectively saved by our community'
        },
        { 
            value: 50000, 
            display: '50K+', 
            label: 'Active Members', 
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/20',
            icon: Users,
            suffix: 'K+',
            description: 'Trusted members worldwide'
        },
        { 
            value: 1200, 
            display: '1.2K+', 
            label: 'Groups Created', 
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/20',
            icon: Target,
            suffix: 'K+',
            description: 'Successful savings groups'
        },
        { 
            value: 98.5, 
            display: '98.5%', 
            label: 'Success Rate', 
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20',
            icon: Shield,
            suffix: '%',
            description: 'Goal completion rate'
        }
    ]

    return (
        <section className="section-clean bg-gray-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-green-900/10"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
            
            <div className="container-fluid relative z-10">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        Trusted by <span className="text-gradient">Thousands</span>
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                        Join a growing community of savers achieving their financial goals together
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon
                        return (
                            <div
                                key={stat.label}
                                className={`glass-card p-6 sm:p-8 rounded-2xl text-center card-hover animate-slide-in-up border-gradient ${stat.borderColor}`}
                                style={{ 
                                    animationDelay: `${index * 0.1}s`, 
                                    animationFillMode: 'both' 
                                }}
                            >
                                <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float`} style={{ animationDelay: `${index * 0.3}s` }}>
                                    <IconComponent className={`w-7 h-7 ${stat.color}`} />
                                </div>
                                
                                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${stat.color} font-mono`}>
                                    <CountUp 
                                        end={stat.value} 
                                        prefix={stat.prefix || ''}
                                        suffix={stat.suffix || ''}
                                        duration={2000 + (index * 200)}
                                    />
                                </div>
                                
                                <div className="text-white font-semibold mb-2 text-sm sm:text-base">
                                    {stat.label}
                                </div>
                                
                                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                                    {stat.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Additional trust indicators */}
                <div className="mt-12 sm:mt-16 text-center animate-fade-in-scale" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-gray-400 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>100% On-Chain</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <span>Audited Smart Contracts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                            <span>Community Governed</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StatsSection