# Oseme Architecture

## Overview
Oseme is a decentralized thrift (esusu) platform built on Solana that enables users to create and participate in rotating savings groups. The platform operates with three distinct group models: Basic, Trust, and Super-Trust, each with different features and requirements.

## Core Principles
- **All user actions are on-chain** - No off-chain business logic or custody
- **Non-custodial** - Funds held in on-chain escrow PDAs, not by backend
- **Event-driven** - Backend only processes events for notifications and indexing
- **USDC-only** - All transactions use USDC for consistency and stability
- **Immutable rules** - Group parameters and payout orders are immutable once set

## System Architecture

### On-Chain Programs (Solana/Anchor)

#### 1. Oseme Group Program (`oseme-group`)
**Primary responsibility**: Core thrift group logic, escrow management, contribution processing

**Key accounts**:
- `PlatformConfig`: Global platform parameters (fees, limits, subscription prices)
- `Group`: Individual group state (model, members, turn tracking, escrow)
- `Member`: Per-user group membership data (stakes, contributions, trust scores)
- `EscrowVault`: USDC escrow for group contributions

**Key instructions**:
- `init_platform`: Initialize platform configuration (admin only)
- `create_group`: Create new thrift group (Basic/Trust/Super-Trust)
- `join_group`: Join existing group (with stake for Trust/Super-Trust)
- `contribute`: Make USDC contribution to current turn
- `release_payout`: Release escrowed funds to turn recipient
- `finalize_group`: Complete group and enable stake withdrawals

#### 2. Oseme Trust Program (`oseme-trust`)
**Primary responsibility**: Staking, trust scoring, slashing, bonuses, fee sharing

**Key accounts**:
- `StakeVault`: Per-group staking vault for Trust/Super-Trust models
- `UserTrust`: Long-term user trust scores across all groups
- `CreatorRevenue`: Accumulated fee shares for group creators

**Key instructions**:
- `stake_deposit`: Deposit stake when joining Trust/Super-Trust group
- `start_grace`: Begin grace period for missed contribution
- `slash_member`: Deduct missed contribution from member's stake
- `withdraw_stake`: Withdraw stake after group completion
- `distribute_bonuses`: Award completion bonuses to compliant members
- `withdraw_creator_fees`: Withdraw accumulated creator fee shares

#### 3. Oseme Treasury Program (`oseme-treasury`)
**Primary responsibility**: Platform fee collection, subscription management, bonus pools

**Key accounts**:
- `Treasury`: Main platform treasury for fee collection
- `BonusPool`: Pool for completion bonuses
- `Subscription`: User subscription records for Trust/Super-Trust

**Key instructions**:
- `collect_fees`: Collect platform fees from payouts
- `pay_subscription`: Pay subscription fee for Trust/Super-Trust creation
- `fund_bonus_pool`: Admin function to fund completion bonuses
- `process_rebate`: Process subscription rebates for high-trust groups

### Off-Chain Components

#### Frontend (Next.js 14)
**Location**: `/frontend`
**Technology**: React, TypeScript, Tailwind CSS, shadcn/ui, Solana wallet adapter

**Key features**:
- Wallet connection (Phantom, Solflare, Backpack)
- Group creation and management interfaces
- Contribution flow with balance checking
- Real-time group status updates
- Fiat on-ramp integration
- Admin panel for platform management
- PWA-ready for mobile usage
- Responsive design with accessibility (WCAG AA)

**Core components**:
- `WalletContextProvider`: Solana wallet integration
- `GroupCreationModal`: Group creation wizard
- `ContributeModal`: Contribution interface with validation
- `OnRampModal`: Fiat-to-USDC purchase flow
- `AdminPanel`: Platform configuration management

#### Backend APIs (Serverless)
**Location**: `/backend`
**Technology**: Vercel/Cloudflare Workers, Node.js, TypeScript

**Purpose**: Webhook processing and notification delivery only - NO CUSTODY

**API endpoints**:
- `POST /api/webhooks/onramp`: Process fiat on-ramp completion events
- `POST /api/webhooks/kyc`: Handle KYC verification callbacks
- `POST /api/webhooks/solana-events`: Process Solana program events for notifications

**Services**:
- `NotificationService`: Email and push notification delivery
- `OnRampService`: Fiat on-ramp provider integration
- `DatabaseService`: Postgres operations for indexing

#### Indexer Worker
**Location**: `/indexer`
**Technology**: Node.js, TypeScript, Postgres, Prisma

**Purpose**: Listen to Solana program events and populate read-only database

**Responsibilities**:
- Monitor Solana program logs for events
- Parse and store event data in Postgres
- Generate derived data for UI (group statistics, user dashboards)
- Trigger notifications for time-sensitive events

**Event handling**:
- `GroupCreated`: Index new group creation
- `MemberJoined`: Track group membership
- `ContributionMade`: Record contributions and update balances
- `PayoutReleased`: Track payouts and fee distributions
- `MemberSlashed`: Record slashing events and trust score changes
- `GroupFinalized`: Handle group completion and bonus distribution

#### Database (Postgres)
**Purpose**: Read-only data store populated by indexer for UI state

**Key tables**:
- `users`: Wallet addresses, KYC status, cumulative trust scores
- `groups`: Group metadata, status, onchain pubkeys
- `group_members`: Membership records with stakes and trust scores
- `turns`: Turn schedule and status tracking
- `contributions`: Contribution history with transaction signatures
- `fees`: Fee collection and distribution records
- `notifications`: User notification queue and delivery status

## Business Logic Flow

### Group Models

#### Basic Model
- **Cost**: Free to create
- **Limits**: 
  - Global: Maximum 5 active Basic groups platform-wide
  - Per-creator: Maximum 1 active Basic group per creator
- **Members**: Maximum 5 members per group
- **Cycles**: Fixed 7-day turns
- **Stake**: No staking required
- **Fees**: Platform fee only (no creator share)
- **Payout order**: System-assigned and immutable

#### Trust Model
- **Cost**: Subscription fee (configurable, default 100 USDC)
- **Members**: Up to 30 members per group
- **Cycles**: Configurable cycle length (creator sets)
- **Stake**: Required for all members except creator
- **Fees**: Platform fee with 75% going to creator
- **Payout order**: Creator-defined and immutable after first contribution
- **Features**: Grace periods, slashing, completion bonuses, rebates

#### Super-Trust Model
- **Cost**: Higher subscription fee (configurable, default 500 USDC)
- **Members**: Up to 100 members per group
- **Cycles**: Configurable cycle length (creator sets)
- **Stake**: Required for all members except creator
- **Fees**: Platform fee with 90% going to creator
- **Features**: Same as Trust model with higher limits and creator share

### Contribution and Payout Flow

1. **Turn Start**: Timer begins for current turn recipient
2. **Contribution Period**: Members contribute required USDC amount
3. **Grace Period**: If contribution missed, 2-day grace period begins
4. **Slashing**: After grace period, missing amount deducted from stake
5. **Payout**: When turn requirements satisfied, funds released minus fees
6. **Next Turn**: Process advances to next member in payout order

### Fee Structure
- **Platform Fee**: Configurable basis points (default 2.5%) on all payouts
- **Creator Share**: 
  - Basic: 0%
  - Trust: 75% of platform fee
  - Super-Trust: 90% of platform fee
- **Subscription Rebate**: 5% of subscription fee if group trust score ≥95%

### Trust Scoring
- **Initial Score**: 100 per group, 100 cumulative per user
- **Penalties**: Configurable reduction for missed payments (default -5)
- **Bonuses**: Configurable increase for completion (default +2)
- **Stake Bonus**: Percentage of stake awarded to compliant members

## Security Architecture

### Smart Contract Security
- **PDA Seeds**: Predictable and collision-resistant
- **Signer Validation**: All instructions validate required signers
- **Reentrancy Guards**: Prevent reentrancy attacks
- **Overflow Protection**: Safe math operations with anchor_lang
- **Access Controls**: Role-based permissions for admin functions

### API Security
- **Webhook Signatures**: HMAC validation for all webhook calls
- **Rate Limiting**: Prevent abuse of webhook endpoints
- **Input Validation**: Joi schemas for all API inputs
- **CORS Configuration**: Restrict cross-origin requests

### Data Privacy
- **No PII Storage**: Only wallet addresses and transaction data
- **Email Encryption**: Optional email notifications with consent
- **Audit Trails**: All admin actions logged with signatures

## Integration Points

### Fiat On-Ramp
- **Purpose**: Enable USDC purchases directly to user wallets
- **Flow**: 
  1. User initiates purchase through OnRampModal
  2. Redirect to payment provider
  3. Provider sends webhook on completion
  4. Backend processes webhook and sends notification
  5. User can now contribute to groups

### KYC Integration
- **Trigger**: Required for transactions above configurable threshold
- **Flow**:
  1. KYC provider redirects with verification status
  2. Webhook updates user KYC status in database
  3. Frontend shows KYC status and requirements

### Notification System
- **Channels**: Email, push notifications, in-app
- **Triggers**: All major on-chain events
- **Priority Levels**: Normal vs urgent (grace periods)
- **Delivery Tracking**: Status and retry logic

## Deployment Architecture

### Development Environment
- **Solana**: Devnet
- **Frontend**: Vercel preview deployments
- **Backend**: Vercel serverless functions
- **Database**: Neon Postgres (dev instance)
- **Indexer**: Local development with devnet RPC

### Production Environment
- **Solana**: Mainnet with backup RPC endpoints
- **Frontend**: Vercel production with custom domain
- **Backend**: Cloudflare Workers for global distribution
- **Database**: Postgres cluster with read replicas
- **Indexer**: Distributed workers with Helius webhooks
- **Monitoring**: DataDog for metrics and alerting

### CI/CD Pipeline
1. **Code Changes**: Push to GitHub triggers workflow
2. **Testing**: Run Anchor tests, frontend tests, linting
3. **Build**: Compile programs, build frontend and backend
4. **Deploy Dev**: Automatic deployment to devnet environment
5. **Manual Approval**: Required for mainnet deployment
6. **Deploy Prod**: Deploy to mainnet with health checks
7. **Monitoring**: Automated verification of deployment health

## Scalability Considerations

### On-Chain Scalability
- **Account Size Limits**: Fixed-size accounts with pagination for large lists
- **Transaction Batching**: Group operations where possible
- **State Compression**: Efficient encoding of group and member data

### Off-Chain Scalability
- **Database Indexing**: Optimized queries for common operations
- **Caching**: Redis for frequently accessed data
- **CDN**: Static asset distribution
- **Horizontal Scaling**: Stateless API design for easy scaling

### Performance Targets
- **Transaction Confirmation**: <30 seconds average
- **UI Load Time**: <2 seconds initial load
- **Webhook Processing**: <5 seconds end-to-end
- **Database Queries**: <100ms for common operations

## Monitoring and Observability

### Metrics
- **On-Chain**: Transaction success rates, account sizes, fee collection
- **API**: Response times, error rates, webhook delivery success
- **Database**: Query performance, connection pool usage
- **User**: Active groups, contribution rates, completion rates

### Alerting
- **Critical**: Program upgrade failures, treasury balance low
- **Warning**: High error rates, slow response times
- **Info**: Daily activity summaries, weekly statistics

### Dashboards
- **Technical**: System health, performance metrics
- **Business**: Group statistics, fee collection, user growth
- **Security**: Failed transactions, suspicious activity patterns
