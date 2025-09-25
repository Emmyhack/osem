'use client'
import { useState } from 'react'

interface CreateGroupFormProps {
    onSubmit: (data: {
        name: string
        contribution: number
        frequency: string
        maxMembers: number
    }) => void
}

export function CreateGroupForm({ onSubmit }: CreateGroupFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        contribution: '',
        frequency: 'Monthly',
        maxMembers: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            name: formData.name,
            contribution: parseFloat(formData.contribution),
            frequency: formData.frequency,
            maxMembers: parseInt(formData.maxMembers)
        })
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card-clean">
                <h3 className="text-2xl font-bold text-white mb-6">
                    Create Your Savings Group
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Group Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            placeholder="Enter group name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Contribution Amount (USDC)</label>
                        <input
                            type="number"
                            value={formData.contribution}
                            onChange={(e) => setFormData(prev => ({ ...prev, contribution: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            placeholder="100"
                            step="0.01"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Payment Frequency</label>
                        <select 
                            value={formData.frequency}
                            onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        >
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-2">Maximum Members</label>
                        <input
                            type="number"
                            value={formData.maxMembers}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: e.target.value }))}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                            placeholder="10"
                            min="2"
                            max="50"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full">
                        Create Group
                    </button>
                </form>
            </div>
        </div>
    )
}