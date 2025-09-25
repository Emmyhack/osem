# Oseme Development Guide

## Project Structure

```
oseme/
├── programs/                 # Solana Anchor programs
│   ├── oseme-group/         # Core group logic
│   ├── oseme-trust/         # Trust and staking logic
│   └── oseme-treasury/      # Fee and subscription management
├── frontend/                # Next.js 14 application
│   ├── src/app/            # App router pages
│   ├── src/components/     # React components
│   ├── src/lib/           # Utilities and configurations
│   └── src/hooks/         # Custom React hooks
├── backend/                # Serverless API functions
│   ├── api/               # Vercel API routes
│   └── src/services/      # Business logic services
├── indexer/               # Event indexing worker
│   ├── src/               # Indexer source code
│   └── schema.sql         # Database schema
├── docs/                  # Documentation
└── .github/              # CI/CD workflows
```

## Development Setup

### Prerequisites
- Node.js 18+ and yarn
- Rust 1.70+
- Solana CLI 1.16+
- Anchor CLI 0.29+
- PostgreSQL 15+
- Git

### Environment Setup
```bash
# Clone repository
git clone https://github.com/your-org/oseme.git
cd oseme

# Install dependencies
yarn install

# Set up environment files
cp .env.example .env.local
# Edit environment variables for your setup

# Start PostgreSQL
docker-compose up -d postgres

# Run database migrations
yarn db:migrate

# Start development servers
yarn dev
```

## Smart Contract Development

### Program Architecture

#### oseme-group Program
**Purpose**: Core thrift group functionality
**Key responsibilities**:
- Group creation and management
- Member joining and validation
- Contribution processing
- Payout distribution
- Group completion

**Key accounts**:
```rust
#[account]
pub struct PlatformConfig {
    pub authority: Pubkey,
    pub fee_bps: u16,
    pub basic_group_limit: u8,
    // ... other configuration
}

#[account]
pub struct Group {
    pub model: GroupModel,
    pub creator: Pubkey,
    pub payout_order: Vec<Pubkey>,
    pub escrow_vault: Pubkey,
    // ... other group data
}
```

#### oseme-trust Program
**Purpose**: Trust scoring and staking mechanics
**Key responsibilities**:
- Stake management
- Trust score calculation
- Grace period handling
- Member slashing
- Completion bonuses

#### oseme-treasury Program
**Purpose**: Platform economics
**Key responsibilities**:
- Fee collection and distribution
- Subscription management
- Creator revenue sharing
- Bonus pool management

### Adding New Instructions

1. **Define the instruction**:
```rust
// In instructions/new_instruction.rs
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct NewInstruction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    // ... other accounts
}

pub fn new_instruction(ctx: Context<NewInstruction>) -> Result<()> {
    // Implementation
    Ok(())
}
```

2. **Add to program**:
```rust
// In lib.rs
pub fn new_instruction(ctx: Context<NewInstruction>) -> Result<()> {
    instructions::new_instruction::handler(ctx)
}
```

3. **Write tests**:
```typescript
// In tests/
it("should execute new instruction correctly", async () => {
    await program.methods
        .newInstruction()
        .accounts({
            authority: provider.wallet.publicKey,
        })
        .rpc();
});
```

### Testing Smart Contracts

```bash
# Run all tests
anchor test

# Run specific test file
anchor test --skip-deploy tests/specific-test.ts

# Test with local validator
anchor test --skip-build --skip-deploy
```

### Deployment

```bash
# Build programs
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize platform (one-time)
anchor run initialize --provider.cluster devnet
```

## Frontend Development

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + custom hooks
- **Wallet Integration**: Solana wallet adapter
- **Forms**: React Hook Form + Zod validation

### Component Architecture

#### Core Components
```tsx
// WalletContextProvider: Wallet integration
export function WalletContextProvider({ children }) {
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

// GroupCard: Display group information
export function GroupCard({ group }: { group: Group }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{group.model} Group</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Group details */}
            </CardContent>
        </Card>
    );
}
```

#### Custom Hooks
```tsx
// useProgram: Access Anchor program
export function useProgram() {
    const { connection } = useConnection();
    const wallet = useWallet();
    
    return useMemo(() => {
        if (!wallet.publicKey) return null;
        
        const provider = new AnchorProvider(connection, wallet, {});
        return new Program(IDL, PROGRAM_ID, provider);
    }, [connection, wallet]);
}

// useGroup: Fetch group data
export function useGroup(groupId: string) {
    const program = useProgram();
    
    return useQuery({
        queryKey: ['group', groupId],
        queryFn: () => program?.account.group.fetch(groupId),
        enabled: !!program && !!groupId,
    });
}
```

### Adding New Features

1. **Create component**:
```tsx
// components/NewFeature.tsx
export function NewFeature() {
    const { publicKey } = useWallet();
    const program = useProgram();
    
    const handleAction = async () => {
        if (!program || !publicKey) return;
        
        try {
            await program.methods
                .newInstruction()
                .accounts({
                    user: publicKey,
                })
                .rpc();
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <Button onClick={handleAction}>
            New Action
        </Button>
    );
}
```

2. **Add route** (if needed):
```tsx
// app/new-feature/page.tsx
import { NewFeature } from '@/components/NewFeature';

export default function NewFeaturePage() {
    return (
        <main>
            <h1>New Feature</h1>
            <NewFeature />
        </main>
    );
}
```

3. **Write tests**:
```tsx
// __tests__/NewFeature.test.tsx
import { render, screen } from '@testing-library/react';
import { NewFeature } from '@/components/NewFeature';

test('renders new feature component', () => {
    render(<NewFeature />);
    expect(screen.getByText('New Action')).toBeInTheDocument();
});
```

## Backend Development

### API Structure
```
backend/
├── api/
│   ├── webhooks/
│   │   ├── onramp.ts      # Fiat on-ramp webhooks
│   │   ├── kyc.ts         # KYC verification webhooks
│   │   └── solana-events.ts # Solana event processing
│   └── admin/
│       └── stats.ts       # Platform statistics
└── src/
    └── services/
        ├── notificationService.ts
        ├── databaseService.ts
        └── webhookValidator.ts
```

### Adding New API Endpoints

1. **Create endpoint**:
```typescript
// api/new-endpoint.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { validateInput } from '../src/services/validation';

export default async function handler(
    req: VercelRequest, 
    res: VercelResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const validatedData = validateInput(req.body);
        
        // Process request
        const result = await processRequest(validatedData);
        
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
```

2. **Add service**:
```typescript
// src/services/newService.ts
export class NewService {
    static async processRequest(data: any) {
        // Implementation
        return result;
    }
}
```

3. **Write tests**:
```typescript
// __tests__/api/new-endpoint.test.ts
import handler from '../../api/new-endpoint';
import { createMocks } from 'node-mocks-http';

describe('/api/new-endpoint', () => {
    it('should process request successfully', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: { /* test data */ },
        });
        
        await handler(req, res);
        
        expect(res._getStatusCode()).toBe(200);
    });
});
```

## Database Development

### Schema Management

The database schema is defined in `indexer/schema.sql`. To modify:

1. **Add migration**:
```sql
-- migrations/001_add_new_table.sql
CREATE TABLE new_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. **Update schema**:
```sql
-- Add to schema.sql
-- New table definition
```

3. **Update indexer**:
```typescript
// indexer/src/eventHandlers.ts
async function handleNewEvent(eventData: any) {
    await db.query(`
        INSERT INTO new_table (data) 
        VALUES ($1)
    `, [eventData]);
}
```

### Working with the Database

```typescript
// Database service usage
import { DatabaseService } from './databaseService';

// Insert new record
await DatabaseService.createUser({
    walletAddress: 'ABC123...',
    email: 'user@example.com',
});

// Query records
const groups = await DatabaseService.getActiveGroups();

// Update records
await DatabaseService.updateGroupStatus(groupId, 'completed');
```

## Testing

### Test Structure
```
__tests__/
├── programs/           # Anchor program tests
├── frontend/          # React component tests
├── backend/           # API endpoint tests
├── integration/       # End-to-end tests
└── acceptance/        # Business requirement tests
```

### Running Tests

```bash
# All tests
yarn test

# Specific test suites
yarn test:programs     # Anchor tests
yarn test:frontend     # React tests
yarn test:backend      # API tests
yarn test:integration  # E2E tests

# With coverage
yarn test:coverage
```

### Writing Tests

#### Program Tests
```typescript
describe("Group Creation", () => {
    it("should create Basic group successfully", async () => {
        await program.methods
            .createGroup({ basic: {} }, null, null, null)
            .accounts({
                group: groupPda,
                creator: creator.publicKey,
                // ... other accounts
            })
            .signers([creator])
            .rpc();
            
        const groupAccount = await program.account.group.fetch(groupPda);
        expect(groupAccount.model).to.deep.equal({ basic: {} });
    });
});
```

#### Frontend Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateGroupModal } from '@/components/CreateGroupModal';

test('should validate group creation form', async () => {
    render(<CreateGroupModal isOpen={true} onClose={() => {}} />);
    
    fireEvent.click(screen.getByText('Create Group'));
    
    await waitFor(() => {
        expect(screen.getByText('Please select a group model')).toBeInTheDocument();
    });
});
```

## Code Quality

### Linting and Formatting
```bash
# Lint all code
yarn lint

# Format code
yarn format

# Type checking
yarn type-check
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.rs": ["rustfmt"]
  }
}
```

### Code Standards

#### TypeScript
- Use strict TypeScript configuration
- Prefer type over interface for simple types
- Use meaningful variable names
- Add JSDoc comments for public APIs

#### Rust
- Follow Rust naming conventions
- Use `Result<T>` for error handling
- Add comprehensive error types
- Document public functions

#### React
- Use functional components with hooks
- Prefer composition over inheritance
- Extract custom hooks for reusable logic
- Use TypeScript for all components

## Debugging

### Smart Contract Debugging
```bash
# View program logs
solana logs <program_id>

# Check account data
solana account <account_address>

# Transaction details
solana confirm <transaction_signature> -v
```

### Frontend Debugging
```typescript
// Debug wallet connection
console.log('Wallet connected:', wallet.connected);
console.log('Public key:', wallet.publicKey?.toString());

// Debug program calls
try {
    const tx = await program.methods.contribute(amount).rpc();
    console.log('Transaction signature:', tx);
} catch (error) {
    console.error('Program error:', error);
}
```

### Backend Debugging
```typescript
// API debugging
console.log('Request body:', req.body);
console.log('Headers:', req.headers);

// Database debugging
const query = 'SELECT * FROM groups WHERE id = $1';
console.log('Executing query:', query, [groupId]);
```

## Performance Optimization

### Smart Contracts
- Minimize account sizes
- Use efficient data structures
- Batch operations where possible
- Optimize instruction data

### Frontend
- Use React.memo for expensive components
- Implement proper loading states
- Cache program accounts
- Optimize bundle size

### Backend
- Use connection pooling for database
- Implement request caching
- Optimize database queries
- Use CDN for static assets

## Security Best Practices

### Smart Contracts
- Validate all inputs
- Use safe math operations
- Implement proper access controls
- Audit all state changes

### Frontend
- Validate user inputs
- Sanitize data display
- Use HTTPS in production
- Implement CSP headers

### Backend
- Validate webhook signatures
- Use parameterized queries
- Implement rate limiting
- Log security events

## Deployment

### Development
```bash
# Deploy to devnet
yarn deploy:dev
```

### Production
```bash
# Deploy to mainnet
yarn deploy:prod
```

### Environment Variables
Ensure all required environment variables are set:
- Database connections
- API keys
- Program IDs
- Webhook secrets

## Contributing

### Pull Request Process
1. Create feature branch from `main`
2. Make changes with tests
3. Run full test suite
4. Update documentation
5. Submit pull request
6. Address review feedback
7. Merge after approval

### Commit Messages
Use conventional commits:
```
feat: add new group creation flow
fix: resolve contribution validation bug
docs: update API documentation
test: add integration tests for payouts
```

### Code Review Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Error handling implemented
- [ ] Type safety maintained

## Resources

### Documentation
- [Anchor Book](https://anchor-lang.com)
- [Solana Docs](https://docs.solana.com)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)

### Tools
- [Solana Explorer](https://explorer.solana.com)
- [Anchor Playground](https://beta.solpg.io)
- [Solana Beach](https://solanabeach.io)

### Community
- [Solana Discord](https://discord.gg/solana)
- [Anchor Discord](https://discord.gg/anchor)
- [Oseme Discord](https://discord.gg/oseme)