# Oseme Deployment Guide

## Prerequisites

### Development Environment
- Node.js 18+ and yarn
- Rust 1.70+ and Cargo
- Solana CLI 1.16+
- Anchor CLI 0.29+
- Docker and Docker Compose
- Git

### Production cd programs && yarn test:integration

# Test frontend integration
cd frontend && yarn test:integrationirements
- Vercel or Cloudflare Workers account
- Postgres database (Neon, Supabase, or self-hosted)
- Domain name and SSL certificate
- SMTP server for email notifications
- Push notification service (FCM/APNS)
- Fiat on-ramp provider API keys

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/oseme.git
cd oseme
```

### 2. Install Dependencies
```bash
# Install Anchor dependencies
cd programs && anchor build

# Install frontend dependencies
cd ../frontend && yarn install

# Install backend dependencies
cd ../backend && yarn install

# Install indexer dependencies
cd ../indexer && yarn install
```

### 3. Environment Configuration

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID_GROUP=GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef
NEXT_PUBLIC_PROGRAM_ID_TRUST=TrstABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef
NEXT_PUBLIC_PROGRAM_ID_TREASURY=TrsryABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
NEXT_PUBLIC_API_BASE_URL=https://api.oseme.com
NEXT_PUBLIC_ONRAMP_PROVIDER=moonpay
NEXT_PUBLIC_ENVIRONMENT=development
```

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/oseme_dev
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=oseme_dev
POSTGRES_USER=oseme_user
POSTGRES_PASSWORD=secure_password

# Solana
SOLANA_NETWORK=devnet
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
PROGRAM_ID_GROUP=GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef
PROGRAM_ID_TRUST=TrstABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef
PROGRAM_ID_TREASURY=TrsryABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef

# Email notifications
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@oseme.com

# Push notifications
VAPID_EMAIL=admin@oseme.com
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# Webhook security
WEBHOOK_SECRET_ONRAMP=your_onramp_webhook_secret
WEBHOOK_SECRET_KYC=your_kyc_webhook_secret

# On-ramp provider
ONRAMP_PROVIDER=moonpay
ONRAMP_API_KEY=your_moonpay_api_key
ONRAMP_SECRET_KEY=your_moonpay_secret_key
ONRAMP_ENVIRONMENT=sandbox

# KYC provider
KYC_PROVIDER=sumsub
KYC_API_KEY=your_sumsub_api_key
KYC_SECRET_KEY=your_sumsub_secret_key

# App URLs
FRONTEND_URL=http://localhost:3000
API_BASE_URL=http://localhost:3001
```

#### Indexer (.env)
```env
# Database (same as backend)
DATABASE_URL=postgresql://user:password@localhost:5432/oseme_dev

# Solana
SOLANA_NETWORK=devnet
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
SOLANA_WS_ENDPOINT=wss://api.devnet.solana.com

# Programs to monitor
PROGRAM_ID_GROUP=GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef
PROGRAM_ID_TRUST=TrstABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef
PROGRAM_ID_TREASURY=TrsryABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef

# Monitoring
LOG_LEVEL=info
METRICS_PORT=9090

# Webhook endpoints for notifications
WEBHOOK_URL=http://localhost:3001/api/webhooks/solana-events
WEBHOOK_SECRET=your_webhook_secret
```

## Local Development

### 1. Start Local Postgres
```bash
docker run --name oseme-postgres \
  -e POSTGRES_USER=oseme_user \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=oseme_dev \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Run Database Migrations
```bash
cd indexer
yarn migrate
```

### 3. Start Local Validator (Optional)
```bash
solana-test-validator \
  --reset \
  --ledger .anchor/test-ledger \
  --bpf-program EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v usdc.so
```

### 4. Deploy Programs to Local/Devnet
```bash
cd programs

# Build programs
anchor build

# Deploy to devnet (or local validator)
anchor deploy --provider.cluster devnet
```

### 5. Initialize Platform
```bash
cd programs
anchor run initialize-platform
```

### 6. Start Development Services
```bash
# Terminal 1: Frontend
cd frontend && yarn dev

# Terminal 2: Backend APIs
cd backend && yarn dev

# Terminal 3: Indexer
cd indexer && yarn dev

# Terminal 4: Database admin (optional)
docker exec -it oseme-postgres psql -U oseme_user -d oseme_dev
```

## Testing

### Unit Tests
```bash
# Anchor program tests
cd programs && anchor test

# Frontend tests
cd frontend && yarn test

# Backend tests
cd backend && yarn test
```

### Integration Tests
```bash
# Full integration test suite
cd programs && pyarn test:integration

# Frontend integration tests
cd frontend && pyarn test:integration
```

### End-to-End Tests
```bash
# Start all services first
yarn dev:all

# Run E2E tests
yarn test:e2e
```

## Production Deployment

### 1. Database Setup (Production)

#### Option A: Neon (Recommended)
```bash
# Create Neon project
npx neon-cli create-project oseme-prod

# Get connection string
npx neon-cli connection-string oseme-prod
```

#### Option B: Self-hosted Postgres
```bash
# Create RDS instance or self-hosted Postgres
# Ensure connection pooling and read replicas for scale
```

### 2. Deploy Smart Contracts to Mainnet

```bash
# Switch to mainnet
solana config set --url mainnet-beta

# Ensure you have a keypair with sufficient SOL
solana balance

# Build and deploy programs
cd programs
anchor build
anchor deploy --provider.cluster mainnet-beta

# Initialize platform on mainnet
anchor run initialize-platform --provider.cluster mainnet-beta
```

### 3. Deploy Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI
yarn add -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SOLANA_NETWORK production
vercel env add NEXT_PUBLIC_RPC_ENDPOINT https://api.mainnet-beta.solana.com
vercel env add NEXT_PUBLIC_PROGRAM_ID_GROUP <mainnet_program_id>
# ... set all other environment variables
```

### 4. Deploy Backend (Vercel Serverless)

```bash
cd backend

# Deploy backend APIs
vercel --prod

# Set environment variables
vercel env add DATABASE_URL <production_database_url>
vercel env add SOLANA_NETWORK mainnet-beta
# ... set all other environment variables
```

### 5. Deploy Indexer (VPS/Cloud)

```bash
# Option A: Docker deployment
cd indexer
docker build -t oseme-indexer .
docker run -d \
  --name oseme-indexer-prod \
  --env-file .env.production \
  oseme-indexer

# Option B: PM2 on VPS
yarn add -g pm2
cd indexer
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 6. Configure CDN and DNS

```bash
# Set up Cloudflare or AWS CloudFront
# Point domain to Vercel deployment
# Configure SSL certificates
# Set up rate limiting and DDoS protection
```

## Security Configuration

### 1. Webhook Security
```bash
# Generate secure webhook secrets
openssl rand -hex 32  # For each webhook endpoint

# Configure HMAC validation in backend
# Rotate secrets regularly
```

### 2. Database Security
```bash
# Enable SSL connections
# Configure IP allowlisting
# Set up read replicas
# Enable backup and point-in-time recovery
# Configure monitoring and alerting
```

### 3. API Security
```bash
# Configure CORS properly
# Set up rate limiting
# Enable request logging
# Configure monitoring and alerting
```

## Monitoring Setup

### 1. Application Monitoring
```bash
# DataDog (recommended)
yarn add @datadog/datadog-ci
DD_API_KEY=<your_api_key> yarn deploy:prod

# Or Sentry for error tracking
yarn add @sentry/nextjs @sentry/node
```

### 2. Infrastructure Monitoring
```bash
# Set up uptime monitoring
# Configure performance monitoring
# Set up log aggregation
# Configure alerting rules
```

### 3. Business Metrics
```bash
# Track key metrics:
# - Active groups by model
# - Total volume processed
# - Fee collection
# - User growth
# - Transaction success rates
```

## Maintenance

### Regular Tasks
- Monitor transaction success rates
- Review and rotate API keys monthly
- Update dependencies quarterly
- Backup database daily
- Monitor disk space and performance
- Review security logs weekly

### Program Updates
```bash
# For program upgrades:
1. Deploy new program version
2. Test on devnet thoroughly
3. Coordinate upgrade with frontend
4. Monitor for issues post-deployment
5. Rollback plan ready
```

### Database Maintenance
```bash
# Regular tasks:
- Vacuum and analyze tables weekly
- Update statistics monthly
- Monitor query performance
- Archive old notification data
- Maintain proper indexing
```

## Troubleshooting

### Common Issues

#### RPC Rate Limits
```bash
# Solution: Use multiple RPC endpoints
# Configure retry logic with exponential backoff
# Consider paid RPC providers for production
```

#### Transaction Failures
```bash
# Debug steps:
1. Check transaction signature in explorer
2. Review program logs
3. Verify account states
4. Check for insufficient funds or authorization
```

#### Database Connection Issues
```bash
# Debug steps:
1. Check connection string
2. Verify firewall rules
3. Monitor connection pool usage
4. Check for long-running queries
```

### Emergency Procedures

#### Program Emergency Stop
```bash
# If critical bug found:
1. Pause affected programs via admin instruction
2. Notify users via all channels
3. Investigate issue
4. Deploy fix
5. Resume operations
```

#### Database Recovery
```bash
# In case of data loss:
1. Stop all write operations
2. Restore from latest backup
3. Replay missed transactions from blockchain
4. Verify data integrity
5. Resume operations
```

## Support and Documentation

### Internal Documentation
- Keep deployment logs
- Document all configuration changes
- Maintain runbook for common operations
- Update this guide with any changes

### User Support
- Monitor support channels
- Document common user issues
- Maintain FAQ
- Provide clear error messages in UI

### Developer Resources
- API documentation
- SDK examples
- Integration guides
- Community resources