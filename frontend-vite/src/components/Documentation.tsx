import { useState } from 'react'
import Navigation from './Navigation'
import { GroupTier, GROUP_TIER_CONFIGS } from '../lib/CompleteOsemeProgram'

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
const Button = ({ children, className = '', disabled = false, onClick, ...props }: any) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
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

const Documentation = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'staking' | 'yield' | 'security' | 'faq'>('overview')

  const sections = [
    { id: 'overview', title: '📋 Overview', icon: '📋' },
    { id: 'staking', title: '💰 USDC Staking', icon: '💰' },
    { id: 'yield', title: '🌾 Yield Generation', icon: '🌾' },
    { id: 'security', title: '🔒 Security', icon: '🔒' },
    { id: 'faq', title: '❓ FAQ', icon: '❓' }
  ]

  const getTierColor = (tier: GroupTier) => {
    switch (tier) {
      case GroupTier.Basic: return 'from-green-500 to-emerald-600'
      case GroupTier.Trust: return 'from-blue-500 to-cyan-600'  
      case GroupTier.SuperTrust: return 'from-purple-500 to-violet-600'
      case GroupTier.Premium: return 'from-orange-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Theme with Colorful Stars */}
      <div className="absolute inset-0 stars-background"></div>
      <div className="absolute inset-0 stars-background-large opacity-60"></div>
      <div className="absolute inset-0 grid-background"></div>
      <div className="absolute inset-0 grid-background-fine opacity-40"></div>
      <div className="absolute inset-0 grid-dots opacity-20"></div>
      
      {/* Subtle Dark Overlays for Depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/20 via-transparent to-gray-800/30"></div>
      
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20 relative z-10 p-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">OSEME Documentation</h1>
          <p className="text-gray-300">Complete guide to USDC staking and trust-based group savings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/20 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">📋 What is OSEME?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        OSEME is a revolutionary trust-based group savings platform built on Solana that combines 
                        traditional rotating savings (susu/tanda) with modern DeFi yield generation.
                      </p>
                      
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-2">🎯 Key Features</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• <strong>Trust-Based Staking:</strong> USDC stake requirements for group creator verification</li>
                          <li>• <strong>DeFi Yield:</strong> Staked funds earn yield in established protocols</li>
                          <li>• <strong>Multi-Tier System:</strong> Different levels with varying requirements and benefits</li>
                          <li>• <strong>Automated Management:</strong> Smart contracts handle distribution and yield</li>
                          <li>• <strong>Real-Time Tracking:</strong> Live yield monitoring and analytics</li>
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-white/10 p-4 rounded-lg">
                          <h5 className="text-white font-semibold mb-2">For Group Creators</h5>
                          <p className="text-sm text-gray-400">
                            Stake USDC to build trust, create groups, and earn yield on your stake 
                            while the group cycle runs.
                          </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-lg">
                          <h5 className="text-white font-semibold mb-2">For Group Members</h5>
                          <p className="text-sm text-gray-400">
                            Join verified groups with confidence, knowing creators have skin in 
                            the game through their USDC stake.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tier Comparison */}
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">🏆 Tier Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(GROUP_TIER_CONFIGS).map(([tier, config]) => (
                        <div key={tier} className="bg-white/10 p-4 rounded-lg">
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 bg-gradient-to-r ${getTierColor(tier as GroupTier)} text-white`}>
                            {tier}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">USDC Stake:</span>
                              <span className="text-white font-medium">
                                ${config.usdcStakeRequirement.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Max Members:</span>
                              <span className="text-white">{config.maxMembers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Cycle:</span>
                              <span className="text-white">{config.cycleDuration} days</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Yield:</span>
                              <span className={`font-medium ${config.marketYieldEnabled ? 'text-green-400' : 'text-gray-400'}`}>
                                {config.marketYieldEnabled ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* USDC Staking Section */}
            {activeSection === 'staking' && (
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">💰 USDC Staking System</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        The USDC staking system is the cornerstone of trust in OSEME. Group creators 
                        must stake USDC amounts corresponding to their chosen tier to verify their 
                        commitment and build member confidence.
                      </p>

                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-2">✅ How It Works</h4>
                        <ol className="space-y-2 text-sm list-decimal list-inside">
                          <li>Select your desired group tier (Trust, SuperTrust, or Premium)</li>
                          <li>Stake the required USDC amount to a secure smart contract</li>
                          <li>Your staked USDC is deployed to DeFi protocols to earn yield</li>
                          <li>Create your group and manage the savings cycle</li>
                          <li>Earn yield on your stake throughout the group duration</li>
                          <li>Withdraw your stake + yield when the cycle completes</li>
                        </ol>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-white font-semibold mb-3">🔐 Stake Requirements</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-white/10 rounded">
                              <span>Trust Tier:</span>
                              <Badge className="bg-blue-500/20 text-blue-400">$500 USDC</Badge>
                            </div>
                            <div className="flex justify-between p-2 bg-white/10 rounded">
                              <span>SuperTrust Tier:</span>
                              <Badge className="bg-purple-500/20 text-purple-400">$2,500 USDC</Badge>
                            </div>
                            <div className="flex justify-between p-2 bg-white/10 rounded">
                              <span>Premium Tier:</span>
                              <Badge className="bg-orange-500/20 text-orange-400">$10,000 USDC</Badge>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-white font-semibold mb-3">📈 Expected Returns</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-white/10 rounded">
                              <span>Trust (Conservative):</span>
                              <Badge className="bg-green-500/20 text-green-400">~6.2% APY</Badge>
                            </div>
                            <div className="flex justify-between p-2 bg-white/10 rounded">
                              <span>SuperTrust (Balanced):</span>
                              <Badge className="bg-green-500/20 text-green-400">~7.8% APY</Badge>
                            </div>
                            <div className="flex justify-between p-2 bg-white/10 rounded">
                              <span>Premium (Optimized):</span>
                              <Badge className="bg-green-500/20 text-green-400">~8.9% APY</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                        <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Important Notes</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Stakes are locked during the group cycle duration</li>
                          <li>• Yield rates vary based on DeFi market conditions</li>
                          <li>• Emergency withdrawal may incur penalties</li>
                          <li>• All yields belong to the stake owner (group creator)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Yield Generation Section */}
            {activeSection === 'yield' && (
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">🌾 DeFi Yield Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        Staked USDC is automatically deployed across multiple battle-tested DeFi protocols 
                        to generate yield while maintaining security and liquidity.
                      </p>

                      <div className="space-y-4">
                        {[
                          {
                            name: 'Marinade Finance',
                            description: 'Liquid staking protocol for SOL with native USDC pools',
                            apy: '6.5%',
                            risk: 'Low',
                            allocation: 'Up to 60%',
                            color: 'bg-blue-500/20 text-blue-400'
                          },
                          {
                            name: 'Solend Protocol', 
                            description: 'Leading lending protocol on Solana with USDC lending markets',
                            apy: '5.2%',
                            risk: 'Low',
                            allocation: 'Up to 40%',
                            color: 'bg-green-500/20 text-green-400'
                          },
                          {
                            name: 'Francium DeFi',
                            description: 'Yield farming protocol with leveraged liquidity provision',
                            apy: '8.1%',
                            risk: 'Medium',
                            allocation: 'Up to 30%',
                            color: 'bg-purple-500/20 text-purple-400'
                          },
                          {
                            name: 'Port Finance',
                            description: 'Money market protocol with variable rate lending',
                            apy: '7.8%',
                            risk: 'Medium',
                            allocation: 'Up to 20%',
                            color: 'bg-orange-500/20 text-orange-400'
                          }
                        ].map((protocol, index) => (
                          <div key={index} className="bg-white/10 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="text-white font-semibold">{protocol.name}</h5>
                                <p className="text-sm text-gray-400">{protocol.description}</p>
                              </div>
                              <Badge className={protocol.color}>
                                {protocol.risk} Risk
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Current APY:</span>
                                <div className="text-green-400 font-semibold">{protocol.apy}</div>
                              </div>
                              <div>
                                <span className="text-gray-400">Max Allocation:</span>
                                <div className="text-white font-semibold">{protocol.allocation}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-400 font-semibold mb-2">🎯 Strategy Optimization</h4>
                        <p className="text-sm mb-2">
                          Each tier uses a different allocation strategy to balance risk and returns:
                        </p>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Trust:</strong> Conservative approach focusing on Marinade + Solend</li>
                          <li>• <strong>SuperTrust:</strong> Balanced diversification across 3 protocols</li>
                          <li>• <strong>Premium:</strong> Optimized allocation across all 4 protocols</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">🔒 Security & Risk Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-300 space-y-4">
                      <p>
                        Security is paramount in OSEME. We implement multiple layers of protection 
                        to safeguard user funds and ensure platform integrity.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                          <h5 className="text-white font-semibold mb-3">🛡️ Smart Contract Security</h5>
                          <div className="space-y-2 text-sm bg-white/10 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Audited smart contracts</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Multi-signature controls</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Time-locked upgrades</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Emergency pause mechanisms</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-white font-semibold mb-3">🔐 User Protection</h5>
                          <div className="space-y-2 text-sm bg-white/10 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Non-custodial design</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Transaction limits</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Real-time monitoring</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Slippage protection</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <h4 className="text-red-400 font-semibold mb-2">⚠️ Risk Factors</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• <strong>Smart Contract Risk:</strong> Potential bugs in protocol code</li>
                          <li>• <strong>DeFi Protocol Risk:</strong> Third-party protocol vulnerabilities</li>
                          <li>• <strong>Market Risk:</strong> Volatile yield rates and asset prices</li>
                          <li>• <strong>Liquidity Risk:</strong> Temporary inability to withdraw during high demand</li>
                        </ul>
                      </div>

                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                        <h4 className="text-green-400 font-semibold mb-2">🔧 Risk Mitigation</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Diversification across multiple protocols reduces single points of failure</li>
                          <li>• Conservative allocation strategies for lower-tier stakes</li>
                          <li>• Regular rebalancing based on protocol performance</li>
                          <li>• Insurance coverage for select DeFi protocols</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* FAQ Section */}
            {activeSection === 'faq' && (
              <div className="space-y-6">
                <Card className="bg-white/5 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">❓ Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          question: 'Why do I need to stake USDC to create a group?',
                          answer: 'USDC staking builds trust by ensuring group creators have financial commitment. It demonstrates good faith and reduces the risk of abandonment, while also earning you yield during the group cycle.'
                        },
                        {
                          question: 'What happens to my staked USDC?',
                          answer: 'Your staked USDC is deployed to established DeFi protocols to earn yield. You keep all the yield generated, and your original stake is returned when the group cycle completes successfully.'
                        },
                        {
                          question: 'Can I withdraw my stake early?',
                          answer: 'Stakes are locked during the active group cycle to maintain trust. Emergency withdrawals may be possible but could incur penalties and affect your group members.'
                        },
                        {
                          question: 'What if a DeFi protocol fails?',
                          answer: 'We diversify across multiple protocols to minimize risk. Each tier has different allocation strategies, with conservative approaches for lower tiers. Some protocols also have insurance coverage.'
                        },
                        {
                          question: 'How are yield rates determined?',
                          answer: 'Yield rates fluctuate based on market conditions in each DeFi protocol. We provide estimated APYs based on historical performance, but actual returns may vary.'
                        },
                        {
                          question: 'Can I change my tier after staking?',
                          answer: 'You can upgrade your tier by staking additional USDC, but downgrading requires completing the current cycle. Tier changes affect your group features and yield strategies.'
                        },
                        {
                          question: 'What fees are involved?',
                          answer: 'OSEME charges a small platform fee (typically 1-2% of yield earned). Each tier has different fee structures, with lower fees for higher tiers as an incentive for larger stakes.'
                        },
                        {
                          question: 'Is my data private?',
                          answer: 'We prioritize privacy and only collect necessary data for platform operation. All financial data is encrypted, and we never share personal information with third parties.'
                        }
                      ].map((faq, index) => (
                        <div key={index} className="bg-white/10 p-4 rounded-lg">
                          <h5 className="text-white font-semibold mb-2">{faq.question}</h5>
                          <p className="text-gray-300 text-sm">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">💬 Need More Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">
                      Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <div className="flex gap-3">
                      <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                        Contact Support
                      </Button>
                      <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                        Join Discord
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Documentation