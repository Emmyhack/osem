'use client'
import { Users, DollarSign, Clock, Shield, Star, ArrowRight } from 'lucide-react'

interface GroupCardProps {
    group: {
        id: string
        name: string
        members: number
        maxMembers: number
        contribution: number
        frequency: string
        trustScore: number
        category: string
    }
    onJoin: (groupId: string) => void
}

export function GroupCard({ group, onJoin }: GroupCardProps) {
    return (
        <div className="card-clean">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                        {group.name}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                        {group.category}
                    </span>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                    <span className="text-gray-300">Members</span>
                    <span className="text-white font-medium">
                        {group.members}/{group.maxMembers}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-300">Contribution</span>
                    <span className="text-white font-medium">
                        ${group.contribution} {group.frequency}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-300">Trust Score</span>
                    <div className="flex items-center space-x-1">
                        <span className="text-green-400 font-medium">
                            {group.trustScore}%
                        </span>
                        <Star className="w-4 h-4 text-green-400" />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Group Progress</span>
                    <span>{Math.round((group.members / group.maxMembers) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Join Button */}
            <button 
                onClick={() => onJoin(group.id)}
                className="btn-primary w-full flex items-center justify-center space-x-2"
            >
                <span>Join Group</span>
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    )
}