import React, { useState } from 'react'
import { useWallet, SimpleWalletButton } from '../components/TempWalletProvider'
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import ContributeModal from '../components/ContributeModal'
import CreateGroupModal from '../components/CreateGroupModal'
import { useOsemeGroup } from '../hooks/useOsemeGroup'
import { Search, Users, DollarSign, TrendingUp, Lock, Plus } from 'lucide-react'

const GroupsPage: React.FC = () => {
    const { connected } = useWallet()
    const { groups, loading, error, createGroup, joinGroup, contribute } = useOsemeGroup()
    const [searchTerm, setSearchTerm] = useState('')
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showContributeModal, setShowContributeModal] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState<any>(null)

    const handleCreateGroup = async (groupData: any) => {
        const result = await createGroup(groupData)
        if (result) {
            setShowCreateModal(false)
        }
        return result
    }

    const handleJoinGroup = async (groupId: string) => {
        return await joinGroup(groupId)
    }

    const handleContribute = async (groupId: string, amount: number) => {
        return await contribute(groupId, amount)
    }

    const openContributeModal = (group: any) => {
        setSelectedGroup(group)
        setShowContributeModal(true)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Navigation />
            
            <div className="container mx-auto px-6 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Savings Groups
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-6">
                        Join rotating savings groups or create your own. Build wealth together through community-driven savings.
                    </p>
                    {connected && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary inline-flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create New Group</span>
                        </button>
                    )}
                </div>

                {!connected ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-white">Connect Your Wallet</h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto px-4">
                            Connect your Solana wallet to view and join active savings groups.
                        </p>
                        <SimpleWalletButton className="btn-primary text-base px-8 py-4" />
                    </div>
                ) : (
                    <div>
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex-1 w-full sm:max-w-md">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search groups..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
                                        <div className="h-6 bg-gray-700 rounded mb-4"></div>
                                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-400 mb-4">{error}</div>
                                <button className="btn-primary">Retry</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groups.map((group) => (
                                    <div key={group.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-1">
                                                    {group.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {group.description}
                                                </p>
                                            </div>
                                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                                                Active
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 flex items-center">
                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                    Contribution
                                                </span>
                                                <span className="text-white font-medium">
                                                    ${group.contributionAmount} USDC
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    Members
                                                </span>
                                                <span className="text-white font-medium">
                                                    {group.participantCount}/{group.maxParticipants}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400 flex items-center">
                                                    <TrendingUp className="w-4 h-4 mr-1" />
                                                    Progress
                                                </span>
                                                <span className="text-white font-medium">
                                                    ${group.currentAmount}/${group.targetAmount}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                                            <div 
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${(group.currentAmount / group.targetAmount) * 100}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleJoinGroup(group.id)}
                                                className="btn-primary flex-1"
                                            >
                                                Join Group
                                            </button>
                                            <button 
                                                onClick={() => openContributeModal(group)}
                                                className="btn-secondary px-4"
                                            >
                                                Contribute
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />

            {/* Modals */}
            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateGroup={handleCreateGroup}
            />

            {selectedGroup && (
                <ContributeModal
                    isOpen={showContributeModal}
                    onClose={() => setShowContributeModal(false)}
                    group={selectedGroup}
                    onContribute={handleContribute}
                />
            )}
        </div>
    )
}

export default GroupsPage