# Oseme - Decentralized Thrift Platform

[![CI/CD](https://github.com/yourusername/oseme/workflows/CI/badge.svg)](https://github.com/yourusername/oseme/actions)
[![Security Audit](https://img.shields.io/badge/security-audited-green.svg)](./docs/SECURITY.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A fully decentralized thrift (esusu) platform built on Solana, enabling trust-based rotating savings groups with USDC escrow, automatic payouts, and reputation staking.

## 🌟 Features

- **Three Group Models**: Basic, Trust, and Super-Trust with increasing benefits
- **On-Chain Everything**: All business logic secured by Solana blockchain
- **USDC Native**: Stable currency with precise decimal handling
- **Trust & Reputation**: Stake-based participation with slashing mechanisms
- **Automatic Payouts**: Smart contract-managed rotating distributions
- **Fee Sharing**: Revenue distribution to stakers and platform
- **Fiat On-Ramp**: Direct USDC purchase integration
- **Real-time Notifications**: Event-driven alerts for all activities

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Blockchain    │
│   (Next.js)     │    │  (Serverless)   │    │   (Solana)      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Wallet UI     │    │ • Webhooks      │    │ • oseme-group   │
│ • Group Mgmt    │◄──►│ • Notifications │◄──►│ • oseme-trust   │
│ • Real-time     │    │ • On-ramp       │    │ • oseme-treasury│
│   Updates       │    │   Integration   │    │ • USDC Escrow   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │    Indexer      │
                    │  (Event Sync)   │
                    ├─────────────────┤
                    │ • Event Listen  │
                    │ • DB Population │
                    │ • State Cache   │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Yarn 3+
- Rust 1.70+
- Solana CLI 1.17+
- Anchor CLI 0.29+
- PostgreSQL 14+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/oseme.git
cd oseme

# Install dependencies
yarn install

# Setup Solana environment
solana config set --url devnet
solana-keygen new

# Build smart contracts
anchor build

# Setup database
psql -f indexer/schema.sql

# Start development environment
yarn dev
```

## 📚 Documentation

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design and technical decisions
- **[Development Guide](./docs/DEVELOPMENT.md)** - Local setup and contribution workflow
- **[User Guide](./docs/USER_GUIDE.md)** - How to use the platform
- **[API Documentation](./docs/API.md)** - Backend API reference
- **[Security Audit](./docs/SECURITY.md)** - Security measures and audit checklist
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions
- **[Test Plan](./docs/TESTS.md)** - Testing strategy and scenarios

## 🎯 Group Models

### Basic Groups
- **Entry**: Free to create, max 5 members
- **Cycles**: Fixed 7-day turns
- **Fees**: 2.5% platform fee
- **Limits**: Max 5 active Basic groups globally

### Trust Groups
- **Entry**: 100 USDC subscription + stake
- **Cycles**: Configurable cycle length
- **Fees**: 2.5% platform fee (75% to creator)
- **Features**: Grace periods, slashing, bonuses

### Super-Trust Groups
- **Entry**: 500 USDC subscription + stake
- **Cycles**: Configurable cycle length
- **Fees**: 2.5% platform fee (90% to creator)
- **Features**: All Trust features + higher limits

## 🧪 Testing

```bash
# Run all tests
yarn test

# Smart contract tests
cd programs && anchor test

# Frontend tests
cd frontend && yarn test

# Acceptance tests
yarn test:acceptance
```

## 📈 Deployment

### Development
```bash
anchor deploy --provider.cluster devnet
yarn deploy:dev
```

### Production
```bash
anchor deploy --provider.cluster mainnet-beta
yarn deploy:prod
```

## 🤝 Contributing

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for contribution guidelines.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Built with ❤️ for the Solana ecosystem**
