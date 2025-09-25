'use client'
import { useState, useEffect, useRef } from 'react'
import { TrendingUp, Users, DollarSign, Globe, Star, Award } from 'lucide-react'

interface CounterProps {
    end: number
    duration?: number
    prefix?: string
    suffix?: string
}

function Counter({ end, duration = 2000, prefix = '', suffix = '' }: CounterProps) {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTime: number | null = null
        const startValue = 0

        const animate = (currentTime: number) => {
            if (startTime === null) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue)

            setCount(currentCount)

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setCount(end)
            }
        }

        requestAnimationFrame(animate)
    }, [isVisible, end, duration])

    return (
        <div ref={ref} className="text-gradient-primary">
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    )
}

export function StatsSection() {
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.1 }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => observer.disconnect()
    }, [])

    const stats = [
        {
            icon: Users,
            label: 'Active Members',
            value: 50000,
            suffix: '+',
            description: 'Verified users building wealth',
            gradient: 'gradient-primary'
        },
        {
            icon: DollarSign,
            label: 'Total Savings',
            value: 2000000,
            prefix: '$',
            suffix: '+',
            description: 'USDC secured on-chain',
            gradient: 'gradient-success'
        },
        {
            icon: Globe,
            label: 'Active Groups',
            value: 1200,
            suffix: '+',
            description: 'Savings circles worldwide',
            gradient: 'gradient-accent'
        },
        {
            icon: TrendingUp,
            label: 'Success Rate',
            value: 98.5,
            suffix: '%',
            description: 'Successful payouts',
            gradient: 'gradient-warning'
        },
        {
            icon: Award,
            label: 'Avg. Monthly Savings',
            value: 450,
            prefix: '$',
            description: 'Per active member',
            gradient: 'gradient-secondary'
        },
        {
            icon: Star,
            label: 'User Rating',
            value: 4.9,
            suffix: '/5',
            description: 'Community satisfaction',
            gradient: 'gradient-primary'
        }
    ]

    return (
        <section ref={ref} className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden" id="analytics">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-pattern opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'}`}>
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/30 mb-6">
                        <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="text-purple-600 font-semibold">Platform Analytics</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="text-gradient-primary">Trusted by Thousands</span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Join a thriving community of savers who have collectively built wealth through our decentralized thrift platform.
                        Real numbers, real impact, real financial transformation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={stat.label}
                                className={`group glass rounded-3xl p-8 text-center hover-lift transition-all duration-700 ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'
                                    }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`w-20 h-20 ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-10 h-10 text-white" />
                                </div>

                                <div className="text-5xl font-bold mb-3">
                                    <Counter
                                        end={stat.value}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                        duration={2500}
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3">{stat.label}</h3>
                                <p className="text-gray-600 leading-relaxed">{stat.description}</p>

                                {/* Animated border */}
                                <div className="mt-6 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        )
                    })}
                </div>

                {/* Call to action */}
                <div className={`text-center mt-16 transition-all duration-1000 ${isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="glass rounded-3xl p-12 max-w-4xl mx-auto border border-white/30">
                        <h3 className="text-3xl md:text-4xl font-bold mb-6">
                            <span className="text-gradient-primary">Ready to Join the Movement?</span>
                        </h3>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            Be part of the financial revolution that's helping thousands build wealth through traditional African savings methods,
                            enhanced with cutting-edge blockchain technology.
                        </p>
                        <button className="group relative inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-white transition-all duration-300 rounded-full gradient-primary shadow-glow hover-lift transform hover:scale-105">
                            <span className="relative z-10 flex items-center">
                                Start Your Journey
                                <TrendingUp className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}