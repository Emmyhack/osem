'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Users, Clock, DollarSign, Shield, Star, ArrowRight, Plus, Wallet, Activity } from 'lucide-react'
import { useOsemeGroup } from '@/hooks/useOsemeGroup'
import { useUSDC } from '@/hooks/useUSDC'
import { GroupModel } from '@/lib/solana'
import { toast } from 'react-hot-toast'

export function GroupsOverview() {
    const { connected, publicKey } = useWallet()
    const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'my-groups'>('browse')
    const [allGroups, setAllGroups] = useState<any[]>([])
    const [userGroups, setUserGroups] = useState<any[]>([])
    const [usdcBalance, setUsdcBalance] = useState(0)
    const [loading, setLoading] = useState(false)

    // Form states
    const [groupName, setGroupName] = useState('')
    const [contributionAmount, setContributionAmount] = useState('')
    const [groupModel, setGroupModel] = useState<GroupModel>(GroupModel.Basic)
    const [memberCap, setMemberCap] = useState('10')
    const [cycleDays, setCycleDays] = useState('7')

    const {
        createGroup,
        joinGroup,
        fetchAllGroups,
        fetchUserGroups,
        contribute
    } = useOsemeGroup()

    const {
        getUSDCBalance,
        createUSDCAccount,
        checkUSDCAccount
    } = useUSDC()

    // Load data when wallet connects
    useEffect(() => {
        if (connected && publicKey) {
            loadData()
        }
    }, [connected, publicKey])

    const loadData = async () => {
        if (!connected) return

        setLoading(true)
        try {
            // Load USDC balance
            const balance = await getUSDCBalance()
            setUsdcBalance(balance)

            // Load all groups
            const groups = await fetchAllGroups()
            setAllGroups(groups)

            // Load user's groups
            const userGroupsData = await fetchUserGroups()
            setUserGroups(userGroupsData)
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!connected || !publicKey) {
            toast.error('Please connect your wallet')
            return
        }

        if (!groupName || !contributionAmount) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setLoading(true)

            // Check if user has USDC account
            const hasUSDCAccount = await checkUSDCAccount()
            if (!hasUSDCAccount) {
                toast('Creating USDC account...', { icon: 'ℹ️' })
                await createUSDCAccount()
            }

            const result = await createGroup(
                groupModel,
                parseFloat(contributionAmount),
                parseInt(memberCap),
                parseInt(cycleDays)
            )

            if (result) {
                // Reset form
                setGroupName('')
                setContributionAmount('')
                setMemberCap('10')
                setCycleDays('7')

                // Reload data
                await loadData()

                // Switch to my groups tab
                setActiveTab('my-groups')
            }
        } catch (error) {
            console.error('Error creating group:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleJoinGroup = async (groupPDA: any) => {
        if (!connected || !publicKey) {
            toast.error('Please connect your wallet')
            return
        }

        try {
            setLoading(true)

            // Check if user has USDC account
            const hasUSDCAccount = await checkUSDCAccount()
            if (!hasUSDCAccount) {
                toast('Creating USDC account...', { icon: 'ℹ️' })
                await createUSDCAccount()
            }

            await joinGroup(groupPDA)
            await loadData() // Reload data
        } catch (error) {
            console.error('Error joining group:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleContribute = async (groupPDA: any, amount: number) => {
        if (!connected || !publicKey) {
            toast.error('Please connect your wallet')
            return
        }

        try {
            setLoading(true)
            await contribute(groupPDA, amount)
            await loadData() // Reload data
        } catch (error) {
            console.error('Error making contribution:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatUSDC = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount)
    }

    const getModelColor = (model: string) => {
        switch (model) {
            case 'Basic': return 'bg-blue-500/20 text-blue-400'
            case 'Trust': return 'bg-purple-500/20 text-purple-400'
            case 'SuperTrust': return 'bg-yellow-500/20 text-yellow-400'
            default: return 'bg-gray-500/20 text-gray-400'
        }
    }

    if (!connected) {
        return (
            <section id="groups" className="section-clean bg-gray-800">
                <div className="container mx-auto px-6 text-center">
                    <div className="card-clean max-w-md mx-auto">
                        <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Connect Your Wallet
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Connect your Solana wallet to create or join savings groups
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section id="groups" className="section-clean bg-gray-800">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Savings Groups
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        Join existing groups or create your own. Start building wealth with trusted community members.
                    </p>

                    {/* USDC Balance */}
                    <div className="inline-flex items-center px-4 py-2 bg-green-500/20 rounded-full border border-green-500/30">
                        <DollarSign className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-green-400 font-medium">
                            USDC Balance: {formatUSDC(usdcBalance)}
                        </span>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('browse')}
                            className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'browse'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Browse Groups
                        </button>
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'create'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Create Group
                        </button>
                        <button
                            onClick={() => setActiveTab('my-groups')}
                            className={`px-6 py-3 rounded-md font-medium transition-colors ${activeTab === 'my-groups'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            My Groups ({userGroups.length})
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center mb-8">
                        <Activity className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                        <p className="text-gray-300 mt-2">Processing...</p>
                    </div>
                )}

                {/* Tab Content */}
                {activeTab === 'browse' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {allGroups.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400">No groups available yet. Be the first to create one!</p>
                            </div>
                        ) : (
                            allGroups.map((group, index) => (
                                <div key={index} className="card-clean">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                Group #{group.groupData.groupId.toString()}
                                            </h3>
                                            <span className={`inline-block px-3 py-1 text-sm rounded-full ${getModelColor(Object.keys(group.groupData.model)[0])
                                                }`}>
                                                {Object.keys(group.groupData.model)[0]}
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Members</span>
                                            <span className="text-white font-medium">
                                                {group.groupData.totalMembers}/{group.groupData.memberCap}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Contribution</span>
                                            <span className="text-white font-medium">
                                                {formatUSDC(group.groupData.contributionAmount / 1_000_000)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Cycle</span>
                                            <span className="text-white font-medium">
                                                {group.groupData.cycleDays} days
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleJoinGroup(group.groupPDA)}
                                        disabled={loading || group.groupData.totalMembers >= group.groupData.memberCap}
                                        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>
                                            {group.groupData.totalMembers >= group.groupData.memberCap ? 'Group Full' : 'Join Group'}
                                        </span>
                                        {group.groupData.totalMembers < group.groupData.memberCap && (
                                            <ArrowRight className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'create' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="card-clean">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                Create Your Savings Group
                            </h3>

                            <form onSubmit={handleCreateGroup} className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Group Name</label>
                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter group name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Group Model</label>
                                    <select
                                        value={groupModel}
                                        onChange={(e) => setGroupModel(e.target.value as GroupModel)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value={GroupModel.Basic}>Basic (Free)</option>
                                        <option value={GroupModel.Trust}>Trust (100 USDC stake)</option>
                                        <option value={GroupModel.SuperTrust}>Super Trust (500 USDC stake)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">Contribution Amount (USDC)</label>
                                    <input
                                        type="number"
                                        value={contributionAmount}
                                        onChange={(e) => setContributionAmount(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="100"
                                        min="1"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2">Maximum Members</label>
                                        <input
                                            type="number"
                                            value={memberCap}
                                            onChange={(e) => setMemberCap(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                            min="2"
                                            max="100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-2">Cycle Days</label>
                                        <input
                                            type="number"
                                            value={cycleDays}
                                            onChange={(e) => setCycleDays(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                                            min="1"
                                            max="365"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>{loading ? 'Creating...' : 'Create Group'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'my-groups' && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {userGroups.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400">You haven't joined any groups yet.</p>
                                <button
                                    onClick={() => setActiveTab('browse')}
                                    className="btn-primary mt-4"
                                >
                                    Browse Groups
                                </button>
                            </div>
                        ) : (
                            userGroups.map((group, index) => (
                                <div key={index} className="card-clean">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                Group #{group.groupData.groupId.toString()}
                                            </h3>
                                            <span className={`inline-block px-3 py-1 text-sm rounded-full ${getModelColor(Object.keys(group.groupData.model)[0])
                                                }`}>
                                                {Object.keys(group.groupData.model)[0]}
                                            </span>
                                            {group.memberData.isCreator && (
                                                <span className="ml-2 inline-block px-2 py-1 bg-gold-500/20 text-yellow-400 text-xs rounded-full">
                                                    Creator
                                                </span>
                                            )}
                                        </div>
                                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Your Turn</span>
                                            <span className="text-white font-medium">
                                                {group.groupData.currentTurnIndex + 1}/{group.groupData.totalMembers}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Contribution</span>
                                            <span className="text-white font-medium">
                                                {formatUSDC(group.groupData.contributionAmount / 1_000_000)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-300">Status</span>
                                            <span className="text-green-400 font-medium">
                                                {Object.keys(group.groupData.status)[0]}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleContribute(group.groupPDA, group.groupData.contributionAmount / 1_000_000)}
                                        disabled={loading}
                                        className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                        <DollarSign className="w-4 h-4" />
                                        <span>Contribute</span>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}