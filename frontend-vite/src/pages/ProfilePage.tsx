import React, { useEffect, useState } from 'react'
import { useWallet } from '../components/TempWalletProvider'
import { 
    Wallet, 
    Settings, 
    TrendingUp, 
    Users, 
    Clock, 
    Eye,
    EyeOff,
    Copy,
    ExternalLink,
    Edit3,
    Bell,
    Shield,
    HelpCircle
} from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const ProfilePage: React.FC = () => {
    const { connected, publicKey } = useWallet()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showBalance, setShowBalance] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // Mock user data
    const userData = {
        name: 'John Doe',
        joinDate: 'March 2024',
        totalSaved: 2450.75,
        activeGroups: 3,
        completedGroups: 12,
        totalEarnings: 345.20,
        currentStreak: 45,
        avatar: 'JD'
    }

    const mockGroups = [
        {
            id: 1,
            name: 'Tech Professionals Savings',
            members: 12,
            totalAmount: 12000,
            myContribution: 1000,
            progress: 75,
            nextPayout: '2024-01-15',
            status: 'active'
        },
        {
            id: 2,
            name: 'Family Emergency Fund',
            members: 8,
            totalAmount: 4800,
            myContribution: 600,
            progress: 100,
            nextPayout: '2024-01-01',
            status: 'completed'
        },
        {
            id: 3,
            name: 'Vacation Savings Circle',
            members: 15,
            totalAmount: 15000,
            myContribution: 850,
            progress: 45,
            nextPayout: '2024-02-10',
            status: 'active'
        }
    ]

    const activities = [
        { type: 'contribution', group: 'Tech Professionals', amount: 100, date: '2024-01-08' },
        { type: 'payout', group: 'Family Emergency Fund', amount: 600, date: '2024-01-01' },
        { type: 'joined', group: 'Vacation Savings Circle', amount: 0, date: '2023-12-15' },
        { type: 'contribution', group: 'Tech Professionals', amount: 100, date: '2023-12-08' }
    ]

    const copyAddress = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey.toString())
        }
    }

    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'contribution': return <TrendingUp className="w-4 h-4" />
            case 'payout': return <Wallet className="w-4 h-4" />
            case 'joined': return <Users className="w-4 h-4" />
            default: return <Clock className="w-4 h-4" />
        }
    }

    if (!connected) {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
                <Navigation />
                
                <div className="pt-20 pb-16">
                    <div className="container-fluid text-center">
                        <div className="animate-fade-in">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Wallet className="w-12 h-12 text-blue-400" />
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                                Connect Your <span className="text-gradient">Wallet</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto px-4">
                                Please connect your Solana wallet to access your profile and manage your savings groups.
                            </p>
                            <button className="btn-primary hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navigation />
            
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                {/* Profile Header */}
                <section className="relative pt-20 sm:pt-24 pb-8 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
                    <div className="container-fluid">
                        <div className="flex flex-col lg:flex-row items-start gap-8 animate-fade-in">
                            {/* Profile Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl sm:text-3xl">
                                        {userData.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                                            <h1 className="text-3xl sm:text-4xl font-bold">{userData.name}</h1>
                                            <button className="self-start sm:self-auto btn-secondary px-4 py-2 text-sm hover:bg-gray-700 transition-all duration-300">
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </button>
                                        </div>
                                        <p className="text-gray-300 mb-4">Member since {userData.joinDate}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm">
                                            <div className="flex items-center gap-2 glass-card px-3 py-1 rounded-full">
                                                <Wallet className="w-4 h-4 text-blue-400" />
                                                <span>{formatAddress(publicKey?.toString() || '')}</span>
                                                <button onClick={copyAddress} className="hover:text-blue-400 transition-colors">
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                                <ExternalLink className="w-4 h-4" />
                                                View on Explorer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="w-full lg:w-auto">
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                                    <div className="glass-card p-4 rounded-xl text-center border-gradient">
                                        <div className="text-2xl font-bold text-blue-400 mb-1">
                                            {showBalance ? `$${userData.totalSaved.toLocaleString()}` : '****'}
                                        </div>
                                        <div className="text-sm text-gray-300">Total Saved</div>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl text-center border-gradient">
                                        <div className="text-2xl font-bold text-green-400 mb-1">{userData.activeGroups}</div>
                                        <div className="text-sm text-gray-300">Active Groups</div>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl text-center border-gradient">
                                        <div className="text-2xl font-bold text-purple-400 mb-1">{userData.completedGroups}</div>
                                        <div className="text-sm text-gray-300">Completed</div>
                                    </div>
                                    <div className="glass-card p-4 rounded-xl text-center border-gradient">
                                        <div className="text-2xl font-bold text-cyan-400 mb-1">{userData.currentStreak}</div>
                                        <div className="text-sm text-gray-300">Day Streak</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowBalance(!showBalance)}
                                    className="mt-4 w-full btn-secondary hover:bg-gray-700 transition-all duration-300"
                                >
                                    {showBalance ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                    {showBalance ? 'Hide Balance' : 'Show Balance'}
                                </button>
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
                                { id: 'groups', label: 'My Groups', icon: Users },
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
                                    {/* Main Stats */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-6">Savings Overview</h3>
                                            <div className="grid sm:grid-cols-3 gap-6">
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-blue-400 mb-2">
                                                        ${showBalance ? userData.totalSaved.toLocaleString() : '****'}
                                                    </div>
                                                    <div className="text-gray-300">Total Saved</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-green-400 mb-2">
                                                        ${showBalance ? userData.totalEarnings.toLocaleString() : '***'}
                                                    </div>
                                                    <div className="text-gray-300">Total Earnings</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-3xl font-bold text-purple-400 mb-2">
                                                        {((userData.totalEarnings / userData.totalSaved) * 100).toFixed(1)}%
                                                    </div>
                                                    <div className="text-gray-300">Return Rate</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                                            <div className="space-y-4">
                                                {activities.slice(0, 5).map((activity, index) => (
                                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                                            {getActivityIcon(activity.type)}
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
                                                                {activity.group} • {activity.date}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-6">
                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                                            <div className="space-y-3">
                                                <button className="w-full btn-primary hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                                                    Join New Group
                                                </button>
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    Create Group
                                                </button>
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    Refer Friends
                                                </button>
                                            </div>
                                        </div>

                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-4">Achievements</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                                                    <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                                        🏆
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Early Adopter</div>
                                                        <div className="text-sm text-gray-400">First 1000 users</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
                                                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                                        💎
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">Consistent Saver</div>
                                                        <div className="text-sm text-gray-400">45-day streak</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'groups' && (
                            <div className="animate-fade-in">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">My Savings Groups</h2>
                                    <p className="text-gray-400">Manage your active and completed savings groups</p>
                                </div>

                                <div className="grid gap-6">
                                    {mockGroups.map((group, index) => (
                                        <div
                                            key={group.id}
                                            className="glass-card p-6 rounded-xl border-gradient hover:border-blue-500/30 transition-all duration-300 animate-slide-in-up"
                                            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                        <span>{group.members} members</span>
                                                        <span>Next payout: {group.nextPayout}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                                            group.status === 'active' 
                                                                ? 'bg-green-500/20 text-green-400' 
                                                                : 'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                            {group.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    View Details
                                                </button>
                                            </div>

                                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                                <div>
                                                    <div className="text-sm text-gray-400 mb-1">My Contribution</div>
                                                    <div className="text-lg font-bold text-blue-400">
                                                        ${group.myContribution.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400 mb-1">Total Pool</div>
                                                    <div className="text-lg font-bold text-green-400">
                                                        ${group.totalAmount.toLocaleString()}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400 mb-1">Progress</div>
                                                    <div className="text-lg font-bold text-purple-400">
                                                        {group.progress}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full bg-gray-800 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${group.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="animate-fade-in">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Activity History</h2>
                                    <p className="text-gray-400">Track all your savings and group activities</p>
                                </div>

                                <div className="glass-card p-6 rounded-xl border-gradient">
                                    <div className="space-y-4">
                                        {activities.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300 animate-slide-in-left"
                                                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                                            >
                                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                                                    {getActivityIcon(activity.type)}
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
                                                                {activity.group}
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
                                    <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
                                    <p className="text-gray-400">Manage your account preferences and security</p>
                                </div>

                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                <Bell className="w-5 h-5" />
                                                Notifications
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">Email Notifications</div>
                                                        <div className="text-sm text-gray-400">Receive updates via email</div>
                                                    </div>
                                                    <div className="relative">
                                                        <input type="checkbox" className="sr-only" defaultChecked />
                                                        <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer"></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">Push Notifications</div>
                                                        <div className="text-sm text-gray-400">Browser notifications</div>
                                                    </div>
                                                    <div className="relative">
                                                        <input type="checkbox" className="sr-only" />
                                                        <div className="w-10 h-6 bg-gray-600 rounded-full relative cursor-pointer"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                <Shield className="w-5 h-5" />
                                                Security
                                            </h3>
                                            <div className="space-y-4">
                                                <button className="w-full text-left p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                                    <div className="font-medium">Two-Factor Authentication</div>
                                                    <div className="text-sm text-gray-400">Add extra security to your account</div>
                                                </button>
                                                <button className="w-full text-left p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                                                    <div className="font-medium">Connected Wallets</div>
                                                    <div className="text-sm text-gray-400">Manage connected wallet addresses</div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-4">Privacy</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">Profile Visibility</div>
                                                        <div className="text-sm text-gray-400">Who can see your profile</div>
                                                    </div>
                                                    <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm">
                                                        <option>Public</option>
                                                        <option>Friends Only</option>
                                                        <option>Private</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">Show Balance</div>
                                                        <div className="text-sm text-gray-400">Display savings amounts</div>
                                                    </div>
                                                    <div className="relative">
                                                        <input type="checkbox" className="sr-only" defaultChecked />
                                                        <div className="w-10 h-6 bg-blue-500 rounded-full relative cursor-pointer"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass-card p-6 rounded-xl border-gradient">
                                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                                <HelpCircle className="w-5 h-5" />
                                                Support
                                            </h3>
                                            <div className="space-y-3">
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    Contact Support
                                                </button>
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    FAQ & Help Center
                                                </button>
                                                <button className="w-full btn-secondary hover:bg-gray-700 transition-all duration-300">
                                                    Report an Issue
                                                </button>
                                            </div>
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

export default ProfilePage