import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import toast from 'react-hot-toast'

// UI Components
const Card = ({ children, className = '', ...props }: any) => (
  <div className={`rounded-lg border ${className}`} {...props}>{children}</div>
)
const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>{children}</div>
)
const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>{children}</h3>
)
const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-2 ${className}`} {...props}>{children}</div>
)
const Button = ({ children, className = '', disabled = false, onClick, size, ...props }: any) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${
      size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2'
    } ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
)
const Badge = ({ children, className = '', ...props }: any) => (
  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`} {...props}>
    {children}
  </div>
)

interface StrategyPreference {
  protocol: string
  enabled: boolean
  maxAllocation: number
  minYieldThreshold: number
  riskTolerance: 'Low' | 'Medium' | 'High'
}

interface NotificationSettings {
  yieldAlerts: boolean
  stakeExpiry: boolean
  newOpportunities: boolean
  riskWarnings: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

interface AutoCompoundSettings {
  enabled: boolean
  threshold: number // Minimum yield amount to trigger auto-compound
  frequency: 'Daily' | 'Weekly' | 'Monthly'
  reinvestmentStrategy: 'Same' | 'Rebalance' | 'BestAPY'
}

const StakingSettings = () => {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'strategies' | 'notifications' | 'autocompound' | 'security'>('strategies')
  
  // Strategy Preferences
  const [strategies, setStrategies] = useState<StrategyPreference[]>([
    {
      protocol: 'Marinade Finance',
      enabled: true,
      maxAllocation: 50,
      minYieldThreshold: 5.0,
      riskTolerance: 'Low'
    },
    {
      protocol: 'Solend Protocol',
      enabled: true,
      maxAllocation: 30,
      minYieldThreshold: 4.0,
      riskTolerance: 'Low'
    },
    {
      protocol: 'Francium DeFi',
      enabled: true,
      maxAllocation: 20,
      minYieldThreshold: 7.0,
      riskTolerance: 'Medium'
    },
    {
      protocol: 'Port Finance',
      enabled: false,
      maxAllocation: 15,
      minYieldThreshold: 6.0,
      riskTolerance: 'Medium'
    }
  ])

  // Notification Settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    yieldAlerts: true,
    stakeExpiry: true,
    newOpportunities: true,
    riskWarnings: true,
    emailNotifications: false,
    pushNotifications: true
  })

  // Auto-compound Settings
  const [autoCompound, setAutoCompound] = useState<AutoCompoundSettings>({
    enabled: true,
    threshold: 10,
    frequency: 'Weekly',
    reinvestmentStrategy: 'Rebalance'
  })

  const [riskProfile, setRiskProfile] = useState<'Conservative' | 'Balanced' | 'Aggressive'>('Balanced')

  // Load user preferences
  useEffect(() => {
    const loadSettings = async () => {
      if (!connected || !publicKey) return

      setLoading(true)
      try {
        // Mock loading user preferences - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Settings would be loaded from user account or local storage
        console.log('Settings loaded for:', publicKey.toBase58())
        
      } catch (error) {
        console.error('Failed to load settings:', error)
        toast.error('Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [connected, publicKey])

  const handleSaveSettings = async () => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      // Mock saving settings
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Settings saved successfully!')
      
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const updateStrategy = (index: number, field: keyof StrategyPreference, value: any) => {
    const updated = [...strategies]
    updated[index] = { ...updated[index], [field]: value }
    setStrategies(updated)
  }

  const updateNotifications = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const updateAutoCompound = (field: keyof AutoCompoundSettings, value: any) => {
    setAutoCompound(prev => ({ ...prev, [field]: value }))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400'
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400'
      case 'High': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="bg-white/5 border-white/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
              <p className="text-gray-400">Please connect your wallet to access staking settings</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto pt-20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Staking Settings</h1>
          <p className="text-gray-300">Configure your DeFi strategy preferences and risk management</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/10 rounded-lg">
          {[
            { id: 'strategies', label: '🎯 Strategies', icon: '🎯' },
            { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
            { id: 'autocompound', label: '🔄 Auto-Compound', icon: '🔄' },
            { id: 'security', label: '🔒 Security', icon: '🔒' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Strategy Preferences Tab */}
        {activeTab === 'strategies' && (
          <div className="space-y-6">
            
            {/* Risk Profile */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">🎯 Risk Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Conservative', 'Balanced', 'Aggressive'].map(profile => (
                    <button
                      key={profile}
                      onClick={() => setRiskProfile(profile as any)}
                      className={`p-4 rounded-lg border transition-all ${
                        riskProfile === profile
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-white/20 bg-white/10 text-gray-300 hover:border-white/40'
                      }`}
                    >
                      <div className="font-semibold mb-1">{profile}</div>
                      <div className="text-sm text-gray-400">
                        {profile === 'Conservative' && 'Lower risk, stable returns'}
                        {profile === 'Balanced' && 'Moderate risk, balanced returns'}
                        {profile === 'Aggressive' && 'Higher risk, maximum returns'}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Protocol Preferences */}
            <Card className="bg-white/5 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">🏦 Protocol Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategies.map((strategy, index) => (
                    <div key={index} className="bg-white/10 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={strategy.enabled}
                              onChange={(e) => updateStrategy(index, 'enabled', e.target.checked)}
                              className="mr-2"
                            />
                            <span className="text-white font-medium">{strategy.protocol}</span>
                          </label>
                          <Badge className={getRiskColor(strategy.riskTolerance)}>
                            {strategy.riskTolerance} Risk
                          </Badge>
                        </div>
                      </div>
                      
                      {strategy.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Max Allocation (%)</label>
                            <input
                              type="range"
                              min="5"
                              max="100"
                              value={strategy.maxAllocation}
                              onChange={(e) => updateStrategy(index, 'maxAllocation', parseInt(e.target.value))}
                              className="w-full"
                            />
                            <div className="text-white text-sm mt-1">{strategy.maxAllocation}%</div>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Min Yield Threshold (%)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={strategy.minYieldThreshold}
                              onChange={(e) => updateStrategy(index, 'minYieldThreshold', parseFloat(e.target.value))}
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Risk Tolerance</label>
                            <select
                              value={strategy.riskTolerance}
                              onChange={(e) => updateStrategy(index, 'riskTolerance', e.target.value)}
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-white"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">🔔 Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-3">Alert Types</h4>
                  <div className="space-y-3">
                    {Object.entries({
                      yieldAlerts: 'Yield rate changes',
                      stakeExpiry: 'Stake expiry warnings',
                      newOpportunities: 'New investment opportunities',
                      riskWarnings: 'Risk level changes'
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center p-3 bg-white/10 rounded-lg">
                        <input
                          type="checkbox"
                          checked={notifications[key as keyof NotificationSettings] as boolean}
                          onChange={(e) => updateNotifications(key as keyof NotificationSettings, e.target.checked)}
                          className="mr-3"
                        />
                        <span className="text-white">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 bg-white/10 rounded-lg">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => updateNotifications('emailNotifications', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-white">Email notifications</span>
                    </label>
                    <label className="flex items-center p-3 bg-white/10 rounded-lg">
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={(e) => updateNotifications('pushNotifications', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="text-white">Push notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Auto-Compound Tab */}
        {activeTab === 'autocompound' && (
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">🔄 Auto-Compound Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <label className="flex items-center p-4 bg-white/10 rounded-lg">
                  <input
                    type="checkbox"
                    checked={autoCompound.enabled}
                    onChange={(e) => updateAutoCompound('enabled', e.target.checked)}
                    className="mr-3"
                  />
                  <div>
                    <span className="text-white font-medium">Enable Auto-Compound</span>
                    <div className="text-gray-400 text-sm">Automatically reinvest earned yield</div>
                  </div>
                </label>

                {autoCompound.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Minimum Threshold ($)</label>
                      <input
                        type="number"
                        value={autoCompound.threshold}
                        onChange={(e) => updateAutoCompound('threshold', parseFloat(e.target.value))}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Frequency</label>
                      <select
                        value={autoCompound.frequency}
                        onChange={(e) => updateAutoCompound('frequency', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Strategy</label>
                      <select
                        value={autoCompound.reinvestmentStrategy}
                        onChange={(e) => updateAutoCompound('reinvestmentStrategy', e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                      >
                        <option value="Same">Same protocols</option>
                        <option value="Rebalance">Rebalance portfolio</option>
                        <option value="BestAPY">Highest APY</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">🔒 Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-400 mb-2">
                    <span>⚠️</span>
                    <span className="font-medium">Security Notice</span>
                  </div>
                  <p className="text-yellow-300 text-sm">
                    Your staked funds are secured by smart contracts. Always verify transaction details before signing.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="text-white font-medium mb-2">🔐 Transaction Limits</h4>
                    <p className="text-gray-400 text-sm mb-3">Set daily limits for automated transactions</p>
                    <input
                      type="number"
                      placeholder="Daily limit ($)"
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
                    />
                  </div>

                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="text-white font-medium mb-2">📱 Multi-Factor Authentication</h4>
                    <p className="text-gray-400 text-sm mb-3">Enable additional security for large transactions</p>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      Configure MFA
                    </Button>
                  </div>

                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="text-white font-medium mb-2">🚨 Emergency Controls</h4>
                    <p className="text-gray-400 text-sm mb-3">Quick actions for emergency situations</p>
                    <div className="flex gap-3">
                      <Button className="bg-red-500 hover:bg-red-600 text-white">
                        Pause All Stakes
                      </Button>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        Withdraw All
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white font-semibold px-8 py-3 rounded-lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}

export default StakingSettings