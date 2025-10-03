import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWallet } from '../components/TempWalletProvider'
import { 
    ArrowLeft, 
    Users, 
    DollarSign, 
    TrendingUp, 
    Shield, 
    Clock,
    Target,
    MessageCircle,
    Bell,
    Settings,
    Download,
    Share2,
    Star,
    Crown
} from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const GroupDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { connected } = useWallet()
    const [isLoaded, setIsLoaded] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // Mock group data
    const groupData = {
        id: id || '1',
        name: 'Tech Professionals Savings Circle',
        description: 'A collaborative savings group for technology professionals looking to build emergency funds and invest in professional development.',
        category: 'Professional',
        riskLevel: 'Low',
        status: 'Active',
        targetAmount: 50000,
        currentAmount: 37500,
        members: 15,
        maxMembers: 20,
        contributionAmount: 500,
        frequency: 'Monthly',
        duration: '12 months',
        startDate: '2024-01-01',
        nextPayout: '2024-02-15',
        payoutFrequency: 'Bi-weekly',
        rating: 4.8,
        totalCycles: 24,
        currentCycle: 8,
        creator: {
            name: 'Sarah Johnson',
            avatar: 'SJ',
            joined: '2023-12-01',
            reputation: 4.9
        }
    }

    const members = [
        { name: 'Sarah Johnson', avatar: 'SJ', contribution: 500, position: 1, status: 'paid', isCreator: true },
        { name: 'Alex Chen', avatar: 'AC', contribution: 500, position: 2, status: 'paid' },
        { name: 'Michael Rodriguez', avatar: 'MR', contribution: 500, position: 3, status: 'paid' },
        { name: 'Emily Zhang', avatar: 'EZ', contribution: 500, position: 4, status: 'pending' },
        { name: 'David Kim', avatar: 'DK', contribution: 500, position: 5, status: 'paid' },
        { name: 'Lisa Wang', avatar: 'LW', contribution: 500, position: 6, status: 'paid' },
        { name: 'James Wilson', avatar: 'JW', contribution: 500, position: 7, status: 'paid' },
        { name: 'Maria Garcia', avatar: 'MG', contribution: 500, position: 8, status: 'pending' }
    ]

    const activities = [
        { type: 'payment', user: 'Alex Chen', amount: 500, date: '2024-01-15', cycle: 8 },
        { type: 'payout', user: 'Sarah Johnson', amount: 3750, date: '2024-01-14', cycle: 8 },
        { type: 'payment', user: 'Michael Rodriguez', amount: 500, date: '2024-01-13', cycle: 8 },
        { type: 'joined', user: 'New Member', amount: 0, date: '2024-01-10', cycle: 8 }
    ]

    const progress = (groupData.currentAmount / groupData.targetAmount) * 100

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navigation />
            
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Header */}
                <section className="relative pt-20 sm:pt-24 pb-8 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
                    <div className="container-fluid">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 animate-fade-in">
                            <button 
                                onClick={() => navigate('/groups')}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Back to Groups
                            </button>
                            <div className="flex items-center gap-4 ml-auto">
                                <button className="btn-secondary hover:bg-gray-700 transition-all duration-300">
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </button>
                                <button className="btn-secondary hover:bg-gray-700 transition-all duration-300">
                                    <Bell className="w-4 h-4 mr-2" />
                                    Notify
                                </button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 animate-slide-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                            {/* Group Info */}
                            <div className="lg:col-span-2">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl animate-float">
                                        {groupData.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
                                                {groupData.name}
                                            </h1>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                groupData.status === 'Active' 
                                                    ? 'bg-green-500/20 text-green-400' 
                                                    : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                                {groupData.status}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span className="text-sm text-gray-300">{groupData.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed mb-6">
                                            {groupData.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 glass-card px-3 py-1 rounded-full">
                                                <Shield className="w-4 h-4 text-blue-400" />
                                                <span>{groupData.riskLevel} Risk</span>
                                            </div>
                                            <div className="flex items-center gap-2 glass-card px-3 py-1 rounded-full">
                                                <Target className="w-4 h-4 text-purple-400" />
                                                <span>{groupData.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2 glass-card px-3 py-1 rounded-full">
                                                <Clock className="w-4 h-4 text-green-400" />
                                                <span>{groupData.frequency}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4">
                                <div className="glass-card p-6 rounded-xl border-gradient">
                                    <div className="text-center mb-4">
                                        <div className="text-2xl font-bold text-blue-400 mb-1">
                                            ${groupData.currentAmount.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-300">
                                            of ${groupData.targetAmount.toLocaleString()} goal
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 animate-shimmer"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-center text-sm text-gray-400">
                                        {progress.toFixed(1)}% Complete
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="glass-card p-4 rounded-xl text-center border-gradient">
                                        <div className="text-xl font-bold text-green-400 mb-1">{groupData.members}</div>
                                        <div className="text-xs text-gray-300">Members</div>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl text-center border-gradient">
                                        <div className="text-xl font-bold text-purple-400 mb-1">{groupData.currentCycle}</div>
                                        <div className="text-xs text-gray-300">Cycle</div>
                                    </div>
                                </div>

                                {connected ? (
                                    <button className="w-full btn-primary hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                        Join Group (${groupData.contributionAmount})
                                    </button>
                                ) : (
                                    <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                        Connect Wallet to Join
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Navigation Tabs */}
                <section className="border-b border-gray-800">
                    <div className="container-fluid">
                        <div className="flex overflow-x-auto">
                            {[
                                { id: 'overview', label: 'Overview', icon: TrendingUp },
                                { id: 'members', label: 'Members', icon: Users },
                                { id: 'activity', label: 'Activity', icon: Clock },
                                { id: 'settings', label: 'Settings', icon: Settings }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-300 whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-400'
                                            : 'border-transparent text-gray-400 hover:text-gray-200'
                                    }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tab Content */}
                <section className="py-8 sm:py-12">
                    <div className="container-fluid">
                        {activeTab === 'overview' && (
                            <div className="animate-fade-in">
                                <div className="grid lg:grid-cols-3 gap-8">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Group Details */}
                                        <div className="glass-card p-6 sm:p-8 rounded-xl border-gradient">
                                            <h3 className="text-2xl font-bold mb-6">Group Details</h3>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="text-sm text-gray-400 mb-1">Contribution Amount</div>
                                                        <div className="text-xl font-bold text-blue-400">
                                                            ${groupData.contributionAmount}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-400 mb-1">Frequency</div>
                                                        <div className="text-lg font-medium">{groupData.frequency}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-400 mb-1">Duration</div>
                                                        <div className="text-lg font-medium">{groupData.duration}</div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="text-sm text-gray-400 mb-1">Next Payout</div>
                                                        <div className="text-xl font-bold text-green-400">
                                                            {groupData.nextPayout}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-400 mb-1">Payout Frequency</div>
                                                        <div className="text-lg font-medium">{groupData.payoutFrequency}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-400 mb-1">Started</div>
                                                        <div className="text-lg font-medium">{groupData.startDate}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recent Activity */}
                                        <div className="glass-card p-6 sm:p-8 rounded-xl border-gradient">
                                            <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
                                            <div className="space-y-4">
                                                {activities.map((activity, index) => (
                                                    <div 
                                                        key={index}
                                                        className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300 animate-slide-in-left"
                                                        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                                    >
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            activity.type === 'payment' ? 'bg-green-500/20 text-green-400' :
                                                            activity.type === 'payout' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-purple-500/20 text-purple-400'
                                                        }`}>
                                                            {activity.type === 'payment' ? <TrendingUp className="w-5 h-5" /> :
                                                             activity.type === 'payout' ? <DollarSign className="w-5 h-5" /> :
                                                             <Users className="w-5 h-5" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium capitalize">{activity.type}</span>
                                                                {activity.amount > 0 && (
                                                                    <span className="text-green-400 font-medium">
                                                                        +${activity.amount}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                {activity.user} • Cycle {activity.cycle} • {activity.date}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-6">
                                        {/* Group Creator */}
                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-lg font-bold mb-4">Group Creator</h3>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {groupData.creator.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{groupData.creator.name}</span>
                                                        <Crown className="w-4 h-4 text-yellow-400" />
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        Joined {groupData.creator.joined}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Star className="w-4 h-4 text-yellow-400" />
                                                <span>{groupData.creator.reputation} reputation</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                                            <div className="space-y-3">
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    Message Group
                                                </button>
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Export Data
                                                </button>
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    Report Issue
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'members' && (
                            <div className="animate-fade-in">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Group Members</h2>
                                    <p className="text-gray-400">{groupData.members} of {groupData.maxMembers} members</p>
                                </div>

                                <div className="glass-card p-6 sm:p-8 rounded-xl border-gradient">
                                    <div className="grid gap-4">
                                        {members.map((member, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300 animate-slide-in-up"
                                                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {member.avatar}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">{member.name}</span>
                                                            {member.isCreator && <Crown className="w-4 h-4 text-yellow-400" />}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            Position #{member.position}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">
                                                        ${member.contribution}
                                                    </div>
                                                    <div className={`text-xs px-2 py-1 rounded-full ${
                                                        member.status === 'paid' 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-orange-500/20 text-orange-400'
                                                    }`}>
                                                        {member.status}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="animate-fade-in">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Activity History</h2>
                                    <p className="text-gray-400">Complete transaction history for this group</p>
                                </div>

                                <div className="glass-card p-6 sm:p-8 rounded-xl border-gradient">
                                    <div className="space-y-4">
                                        {[...activities, ...activities].map((activity, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300 animate-slide-in-left"
                                                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    activity.type === 'payment' ? 'bg-green-500/20 text-green-400' :
                                                    activity.type === 'payout' ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-purple-500/20 text-purple-400'
                                                }`}>
                                                    {activity.type === 'payment' ? <TrendingUp className="w-6 h-6" /> :
                                                     activity.type === 'payout' ? <DollarSign className="w-6 h-6" /> :
                                                     <Users className="w-6 h-6" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium capitalize">{activity.type}</span>
                                                                {activity.amount > 0 && (
                                                                    <span className="text-green-400 font-medium">
                                                                        +${activity.amount}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                {activity.user} • Cycle {activity.cycle}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {activity.date}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="animate-fade-in">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Group Settings</h2>
                                    <p className="text-gray-400">Manage group preferences and notifications</p>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="glass-card p-6 sm:p-8 rounded-xl border-gradient">
                                        <h3 className="text-xl font-bold mb-6">Notifications</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">Payment Reminders</div>
                                                    <div className="text-sm text-gray-400">Get notified before payments are due</div>
                                                </div>
                                                <div className="relative">
                                                    <input type="checkbox" className="sr-only" defaultChecked />
                                                    <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer"></div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">Payout Alerts</div>
                                                    <div className="text-sm text-gray-400">Notifications when payouts are processed</div>
                                                </div>
                                                <div className="relative">
                                                    <input type="checkbox" className="sr-only" defaultChecked />
                                                    <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass-card p-6 sm:p-8 rounded-xl border-gradient">
                                        <h3 className="text-xl font-bold mb-6">Group Actions</h3>
                                        <div className="space-y-3">
                                            <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                Leave Group
                                            </button>
                                            <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                Report Issue
                                            </button>
                                            <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                Export Data
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}

export default GroupDetailPage