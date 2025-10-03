import React from 'react'
import { Users, Plus, Clock, Star } from 'lucide-react'

const GroupsOverview: React.FC = () => {
    const mockGroups = [
        {
            name: "Tech Innovators Pool",
            members: 8,
            target: 5000,
            current: 3200,
            cycle: "Weekly",
            rating: 4.8,
            status: "Active"
        },
        {
            name: "Young Professionals",
            members: 12,
            target: 10000,
            current: 7500,
            cycle: "Monthly", 
            rating: 4.9,
            status: "Active"
        },
        {
            name: "Crypto Builders",
            members: 6,
            target: 3000,
            current: 1800,
            cycle: "Bi-weekly",
            rating: 4.7,
            status: "Recruiting"
        }
    ]

    return (
        <section id="groups" className="section-clean bg-gray-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/5 to-blue-900/5"></div>
            
            <div className="container-fluid relative z-10">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                        Active <span className="text-gradient">Savings Groups</span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
                        Join existing groups or create your own. All powered by smart contracts for maximum security and transparency.
                    </p>
                </div>

                {/* Groups Grid */}
                <div className="grid-responsive max-w-6xl mx-auto mb-12 sm:mb-16">
                    {mockGroups.map((group, index) => (
                        <div
                            key={group.name}
                            className="glass-card p-6 rounded-xl card-hover group animate-slide-in-up border-gradient hover:border-blue-500/30"
                            style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'both' }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                                        <Users className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-gradient transition-all duration-300">
                                            {group.name}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                                            <Star className="w-4 h-4 text-yellow-400" />
                                            <span>{group.rating}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    group.status === 'Active' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                    {group.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Progress</span>
                                    <span className="text-white">${group.current.toLocaleString()} / ${group.target.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ 
                                            width: `${(group.current / group.target) * 100}%`,
                                            animationDelay: `${index * 0.2 + 0.5}s`
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center space-x-1 text-gray-400">
                                    <Users className="w-4 h-4" />
                                    <span>{group.members} members</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{group.cycle}</span>
                                </div>
                            </div>

                            <button className="w-full mt-4 py-2 px-4 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50">
                                Join Group
                            </button>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center animate-fade-in-scale" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                    <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto border-gradient">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
                            <Plus className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
                            Create Your Own Group
                        </h3>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            Start a new savings group with your friends or community. Set your own terms and watch your collective wealth grow.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn-primary px-6 py-3 hover:shadow-lg hover:shadow-blue-500/25">
                                Connect Wallet
                            </button>
                            <button className="btn-secondary px-6 py-3">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GroupsOverview