# Oseme User Guide

## Getting Started

### What is Oseme?
Oseme is a decentralized thrift (esusu) platform built on Solana that enables you to create and participate in rotating savings groups. Unlike traditional thrift groups, Oseme operates entirely on-chain with USDC, providing transparency, security, and automated management.

### Key Benefits
- **Decentralized**: No central authority controls your funds
- **Transparent**: All transactions are visible on the blockchain
- **Automated**: Smart contracts handle contributions and payouts
- **Secure**: Funds held in non-custodial escrow
- **Global**: Participate from anywhere in the world

## Group Models

### Basic Model (Free)
- **Cost**: Free to create
- **Members**: Up to 5 people
- **Turns**: 7 days each
- **Stake**: No staking required
- **Fees**: Platform fee only (2.5%)
- **Limits**: Max 5 active Basic groups globally, 1 per creator

**Best for**: Small groups of friends or family trying out thrift savings

### Trust Model (100 USDC subscription)
- **Cost**: 100 USDC subscription fee
- **Members**: Up to 30 people
- **Turns**: Customizable cycle length
- **Stake**: Required for all members (except creator)
- **Fees**: Platform fee with 75% going to creator
- **Features**: Grace periods, trust scoring, completion bonuses

**Best for**: Established communities with higher trust and longer-term savings goals

### Super-Trust Model (500 USDC subscription)
- **Cost**: 500 USDC subscription fee
- **Members**: Up to 100 people
- **Turns**: Customizable cycle length
- **Stake**: Required for all members (except creator)
- **Fees**: Platform fee with 90% going to creator
- **Features**: All Trust features with higher limits and earnings

**Best for**: Large communities, organizations, or experienced thrift organizers

## Getting Started

### 1. Connect Your Wallet
1. Visit [oseme.com](https://oseme.com)
2. Click "Connect Wallet"
3. Choose your preferred wallet (Phantom, Solflare, or Backpack)
4. Approve the connection

### 2. Get USDC
If you don't have USDC:
1. Click "Buy USDC" in your dashboard
2. Choose your payment method (credit card, bank transfer)
3. Complete the purchase (USDC goes directly to your wallet)
4. Wait for confirmation (usually 1-5 minutes)

### 3. Join or Create a Group

#### Joining a Group
1. Browse available groups in the "Explore" section
2. Check the group details (contribution amount, schedule, members)
3. Click "Join Group"
4. For Trust/Super-Trust groups: Approve stake deposit
5. Confirm your participation

#### Creating a Group
1. Click "Create Group"
2. Choose your group model (Basic, Trust, or Super-Trust)
3. Set group parameters:
   - Member capacity
   - Contribution amount
   - Cycle length (Trust/Super-Trust only)
   - Payout order (Trust/Super-Trust only)
4. Pay subscription fee if required
5. Share group link with potential members

## How Thrift Groups Work

### The Cycle
1. **Group Formation**: Creator sets up group and members join
2. **Turn Rotation**: Each member takes a turn being the recipient
3. **Contributions**: All members contribute the set amount during each turn
4. **Payout**: The turn recipient gets the collected amount (minus fees)
5. **Next Turn**: Process repeats until everyone has received a payout

### Example: 5-Person Basic Group
- Contribution: 100 USDC per person per turn
- Platform fee: 2.5% (2.5 USDC)
- Net payout: 497.5 USDC per turn
- Total turns: 5 (one for each member)

**Turn 1**: Alice receives ~497.5 USDC
**Turn 2**: Bob receives ~497.5 USDC  
**Turn 3**: Carol receives ~497.5 USDC
**Turn 4**: David receives ~497.5 USDC
**Turn 5**: Eve receives ~497.5 USDC

## Making Contributions

### When to Contribute
- Check your dashboard for upcoming contribution deadlines
- You'll receive notifications 24 hours before deadlines
- Contribute any time during the turn window

### How to Contribute
1. Go to your group dashboard
2. Click "Contribute" on the active turn
3. Verify the amount (automatically filled)
4. Approve the transaction in your wallet
5. Wait for confirmation

### Grace Periods (Trust/Super-Trust Only)
If you miss a contribution:
1. **Grace period starts**: You have 2 additional days to contribute
2. **Grace notifications**: You'll receive urgent notifications
3. **After grace period**: Your stake will be slashed for the missing amount
4. **Turn continues**: The group doesn't wait - the cycle continues

## Trust Scoring

### How Trust Scores Work
- **Starting score**: 100 points for each group
- **Penalties**: -5 points for each missed contribution (after grace)
- **Bonuses**: +2 points to your overall account score for completing groups
- **Impact**: Higher trust scores unlock better opportunities

### Benefits of High Trust Scores
- Access to exclusive groups
- Lower stake requirements
- Priority in popular groups
- Completion bonuses

## Fees and Economics

### Platform Fees
- **All groups**: 2.5% fee on every payout
- **Basic**: 100% goes to platform
- **Trust**: 75% goes to group creator, 25% to platform
- **Super-Trust**: 90% goes to group creator, 10% to platform

### Subscription Rebates
If your group maintains a trust score ≥95% at completion:
- **Trust groups**: 5% of subscription fee returned (5 USDC)
- **Super-Trust groups**: 5% of subscription fee returned (25 USDC)

### Completion Bonuses (Trust/Super-Trust)
Members who never default receive a bonus:
- Percentage of your stake (typically 1%)
- Funded by platform bonus pool
- Paid automatically at group completion

## Safety and Security

### Your Funds Are Safe
- **Non-custodial**: Oseme never holds your funds
- **Smart contract escrow**: Funds held in audited smart contracts
- **Transparent**: All transactions visible on Solana blockchain
- **Immutable rules**: Group rules cannot be changed after creation

### Best Practices
1. **Verify group details** before joining
2. **Only join groups with people you trust** (especially for Basic groups)
3. **Keep enough USDC** for all contributions in advance
4. **Enable notifications** to never miss deadlines
5. **Understand the commitment** - you must contribute for all turns

### Risk Considerations
- **Market risk**: USDC value fluctuations (minimal but possible)
- **Default risk**: Other members might default (mitigated by stakes in Trust groups)
- **Smart contract risk**: While audited, smart contracts carry inherent risks
- **Network risk**: Solana network congestion could delay transactions

## Troubleshooting

### Common Issues

#### "Insufficient balance" error
- **Cause**: Not enough USDC in your wallet
- **Solution**: Buy more USDC or transfer from another wallet

#### "Transaction failed" error
- **Cause**: Network congestion or insufficient SOL for transaction fees
- **Solution**: Try again in a few minutes, ensure you have SOL for fees

#### "Not your turn" message
- **Cause**: Trying to claim payout when it's not your turn
- **Solution**: Wait for your scheduled turn

#### Missing notifications
- **Cause**: Notifications not enabled or email not verified
- **Solution**: Check notification settings in your profile

### Getting Help

#### Self-Service
1. Check the FAQ section
2. Review transaction history in your dashboard
3. Verify transaction status on Solana explorer

#### Community Support
1. Join our Discord community
2. Ask questions in the help channel
3. Learn from experienced users

#### Direct Support
1. Email: support@oseme.com
2. Response time: 24-48 hours
3. Include transaction signatures for faster resolution

## Advanced Features

### Group Analytics
- View group performance statistics
- Track contribution compliance rates
- Monitor trust score trends
- Export transaction history

### Creator Tools
- Manage multiple groups
- Track fee earnings
- Access creator analytics
- Withdraw accumulated fees

### Admin Features (Platform Admins)
- Adjust platform parameters
- Pause groups for investigation
- Manage dispute resolution
- Monitor platform health

## Mobile Usage

### Progressive Web App (PWA)
1. Visit oseme.com on your mobile browser
2. Add to home screen when prompted
3. Use like a native app
4. Supports push notifications

### Mobile Wallet Integration
- Deep links to mobile wallets
- Seamless transaction signing
- Biometric authentication support
- Offline transaction queuing

## Privacy and Data

### What We Collect
- Wallet addresses (public information)
- Email addresses (optional, for notifications)
- Transaction history (public on blockchain)
- Usage analytics (anonymous)

### What We Don't Collect
- Personal identity information (unless KYC required)
- Private keys or seed phrases
- Off-chain financial information

### KYC Requirements
Required for:
- Transactions above 1000 USDC (configurable)
- Creating Trust/Super-Trust groups
- Certain jurisdictions

### Data Rights
- Access your data
- Delete your account
- Export transaction history
- Opt out of notifications

## Frequently Asked Questions

### General Questions

**Q: What happens if someone doesn't pay?**
A: In Basic groups, the group may stall. In Trust/Super-Trust groups, the defaulter's stake covers the missing payment and the cycle continues.

**Q: Can I leave a group early?**
A: You can only leave before the first contribution. After that, you're committed to the full cycle.

**Q: What if I need emergency access to my funds?**
A: Thrift groups are savings commitments. Plan accordingly and only commit funds you won't need immediately.

**Q: How are disputes resolved?**
A: Most disputes are prevented by smart contract automation. For exceptional cases, platform admins can pause groups for investigation.

### Technical Questions

**Q: Why Solana instead of Ethereum?**
A: Solana offers faster transactions and lower fees, making micro-payments economical.

**Q: What if Solana network goes down?**
A: Groups pause automatically. When the network resumes, all funds and states are preserved.

**Q: Can I use other cryptocurrencies?**
A: Only USDC is supported for consistency and stability.

### Financial Questions

**Q: How do I minimize fees?**
A: Join Trust/Super-Trust groups where creators share fee revenue, or become a creator yourself.

**Q: Are there any hidden fees?**
A: No hidden fees. Only the transparent platform fee and standard Solana transaction fees (~$0.001).

**Q: What's the minimum contribution amount?**
A: Set by group creators, typically starting from 10 USDC.

## Legal and Compliance

### Terms of Service
- Review our terms before using the platform
- Updated periodically - check for changes
- Binding agreement for all users

### Regulatory Compliance
- KYC/AML procedures where required
- Sanctions screening for restricted territories
- Reporting requirements compliance

### Risk Disclosure
- Cryptocurrency investments carry risk
- Smart contract technology is experimental
- Platform is not FDIC insured
- Regulatory environment is evolving

---

## Contact and Support

**Website**: [oseme.com](https://oseme.com)
**Email**: support@oseme.com
**Discord**: [discord.gg/oseme](https://discord.gg/oseme)
**Twitter**: [@OsemePlatform](https://twitter.com/OsemePlatform)

**Documentation**: [docs.oseme.com](https://docs.oseme.com)
**Status Page**: [status.oseme.com](https://status.oseme.com)
**Blog**: [blog.oseme.com](https://blog.oseme.com)

---

*Last updated: September 2025*
*Version: 1.0*