# OSEM Devnet Deployment Configuration

## Solana Program Deployment

### 1. Setup Environment
```bash
# Install Solana CLI if not already installed
curl --proto '=https' --tlsv1.2 -sSf https://release.solana.com/v1.18.22/install | sh
source ~/.profile

# Set to devnet
solana config set --url https://api.devnet.solana.com

# Generate a new keypair for deployment (save this securely!)
solana-keygen new --outfile ~/.config/solana/devnet-keypair.json

# Request devnet SOL for deployment
solana airdrop 5 --keypair ~/.config/solana/devnet-keypair.json
```

### 2. Build and Deploy Programs

#### OSEM Group Program
```bash
cd programs/oseme-group

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get the program ID (save this for frontend configuration)
solana address -k target/deploy/oseme_group-keypair.json
```

#### OSEM Treasury Program
```bash
cd programs/oseme-treasury

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get the program ID
solana address -k target/deploy/oseme_treasury-keypair.json
```

#### OSEM Trust Program
```bash
cd programs/oseme-trust

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Get the program ID
solana address -k target/deploy/oseme_trust-keypair.json
```

### 3. Initialize Platform

```bash
# Run initialization script (after updating with deployed program IDs)
anchor run init-platform --provider.cluster devnet
```

## Frontend Deployment Configuration

### 1. Environment Variables
Create `/frontend-vite/.env.production`:

```env
# Solana Configuration
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_SOLANA_COMMITMENT=confirmed

# Program IDs (update with actual deployed program IDs)
VITE_OSEME_GROUP_PROGRAM_ID=YOUR_DEPLOYED_GROUP_PROGRAM_ID
VITE_OSEME_TREASURY_PROGRAM_ID=YOUR_DEPLOYED_TREASURY_PROGRAM_ID
VITE_OSEME_TRUST_PROGRAM_ID=YOUR_DEPLOYED_TRUST_PROGRAM_ID

# USDC Token Address (devnet)
VITE_USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU

# Platform Configuration
VITE_PLATFORM_FEE=0.025
VITE_MIN_STAKE_AMOUNT=1.0
VITE_MAX_GROUP_SIZE=50

# Fiat On-Ramp API Keys (for production, use environment-specific keys)
VITE_MOONPAY_API_KEY=pk_test_your_moonpay_key
VITE_RAMP_HOST_API_KEY=your_ramp_key
VITE_TRANSAK_API_KEY=your_transak_key
VITE_COINBASE_APP_ID=your_coinbase_app_id

# Analytics and Monitoring
VITE_ENABLE_ANALYTICS=true
VITE_APP_VERSION=1.0.0-devnet
```

### 2. Build and Deploy Frontend

#### Option A: Vercel Deployment
```bash
cd frontend-vite

# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Go to Project Settings > Environment Variables
# Add all variables from .env.production
```

#### Option B: Netlify Deployment
```bash
cd frontend-vite

# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
```

#### Option C: AWS S3 + CloudFront
```bash
cd frontend-vite

# Build the project
npm run build

# Upload to S3 bucket (configure S3 bucket for static website hosting)
aws s3 sync dist/ s3://your-osem-devnet-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Backend Deployment (Optional - for webhooks and notifications)

### Vercel Serverless Functions
```bash
cd backend

# Deploy to Vercel
vercel --prod

# Environment variables needed:
# - SOLANA_RPC_URL
# - DATABASE_URL (if using database)
# - WEBHOOK_SECRET
# - Email service credentials
```

## Database Setup (PostgreSQL)

### 1. Create Database Schema
```sql
-- Run the schema.sql file
psql -d your_database -f indexer/schema.sql
```

### 2. Deploy Indexer

#### Option A: Railway
```bash
cd indexer

# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway new
railway add
railway up

# Set environment variables:
# - DATABASE_URL
# - SOLANA_RPC_URL
# - PROGRAM_IDS (comma-separated)
```

#### Option B: Heroku
```bash
cd indexer

# Create Heroku app
heroku create osem-devnet-indexer

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:essential-0

# Set environment variables
heroku config:set SOLANA_RPC_URL=https://api.devnet.solana.com
heroku config:set PROGRAM_IDS=your,program,ids,here

# Deploy
git push heroku main
```

## Testing the Deployment

### 1. Frontend Testing Checklist
- [ ] Wallet connection works
- [ ] Group creation flow completes
- [ ] Payment processing works (test with small amounts)
- [ ] Staking interface functions properly
- [ ] Real-time data displays correctly
- [ ] All navigation and UI components work
- [ ] Mobile responsiveness verified

### 2. Smart Contract Testing
```bash
# Run integration tests against devnet
anchor test --provider.cluster devnet

# Manual testing commands
solana program show YOUR_PROGRAM_ID
solana account YOUR_ACCOUNT_ADDRESS --output json
```

### 3. End-to-End Flow Testing
1. Connect wallet with devnet SOL
2. Create a new group (any tier)
3. Complete payment flow
4. Stake SOL for group participation
5. Verify group appears in dashboard
6. Check analytics and insurance data
7. Test fiat on-ramp integration

## Monitoring and Maintenance

### 1. Monitoring Tools
- **Solana Explorer**: https://explorer.solana.com/?cluster=devnet
- **Program monitoring**: Check program accounts and transactions
- **Frontend monitoring**: Vercel/Netlify analytics
- **Database monitoring**: Railway/Heroku metrics

### 2. Maintenance Tasks
- Monitor devnet SOL balance for continued operations
- Check program account data integrity
- Update RPC endpoints if needed
- Monitor and rotate API keys regularly

### 3. Upgrade Path
```bash
# To upgrade programs
anchor build
anchor upgrade YOUR_PROGRAM_ID --provider.cluster devnet

# To update frontend
npm run build
vercel --prod
```

## Security Considerations

### 1. Private Key Management
- Store deployment keypairs securely
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Enable 2FA on all service accounts

### 2. Smart Contract Security
- Audit all programs before mainnet deployment
- Implement proper access controls
- Use program-derived addresses (PDAs) correctly
- Validate all user inputs

### 3. Frontend Security
- Validate all user inputs
- Implement proper error handling
- Use HTTPS for all communications
- Sanitize displayed data to prevent XSS

## Production Readiness Checklist

Before moving to mainnet:
- [ ] Complete security audit of smart contracts
- [ ] Load testing of all components
- [ ] Backup and recovery procedures tested
- [ ] Monitoring and alerting systems in place
- [ ] Legal compliance review completed
- [ ] User documentation finalized
- [ ] Customer support processes established

## Troubleshooting Common Issues

### Program Deployment Fails
```bash
# Check SOL balance
solana balance

# Increase compute budget if needed
solana program deploy --max-len 200000 target/deploy/your_program.so

# Check program buffer account
solana program show --buffers
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check environment variables
npm run build -- --verbose
```

### RPC Rate Limiting
- Switch to paid RPC provider (QuickNode, Alchemy, etc.)
- Implement request caching
- Use connection pooling

### Database Connection Issues
- Check connection string format
- Verify network access permissions
- Monitor connection pool usage