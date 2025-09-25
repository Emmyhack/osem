-- Oseme Indexer Database Schema
-- Read-only database populated from Solana program events
-- All business logic is on-chain, this is for UI state and notifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (populated from wallet connections)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(44) NOT NULL UNIQUE,
    email VARCHAR(255),
    kyc_status VARCHAR(20) DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'approved', 'rejected')),
    cumulative_trust_score INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table (populated from GroupCreated events)
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    onchain_group_pubkey VARCHAR(44) NOT NULL UNIQUE,
    group_id BIGINT NOT NULL,
    model VARCHAR(20) NOT NULL CHECK (model IN ('basic', 'trust', 'super_trust')),
    creator_wallet VARCHAR(44) NOT NULL,
    member_cap INTEGER NOT NULL,
    cycle_days INTEGER NOT NULL,
    contribution_amount BIGINT, -- USDC amount in smallest unit
    total_pool BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    trust_score INTEGER DEFAULT 100,
    current_turn_index INTEGER DEFAULT 0,
    total_members INTEGER DEFAULT 0,
    current_turn_start TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (creator_wallet) REFERENCES users(wallet_address)
);

-- Group members table (populated from MemberJoined events)
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL,
    wallet_address VARCHAR(44) NOT NULL,
    stake_required BOOLEAN DEFAULT FALSE,
    stake_amount BIGINT DEFAULT 0,
    trust_score_before INTEGER DEFAULT 100,
    trust_score_after INTEGER,
    is_creator BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address),
    UNIQUE(group_id, wallet_address)
);

-- Turns table (generated from group payout order)
CREATE TABLE turns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL,
    turn_index INTEGER NOT NULL,
    recipient_wallet VARCHAR(44) NOT NULL,
    start_at TIMESTAMP WITH TIME ZONE,
    due_at TIMESTAMP WITH TIME ZONE,
    grace_until TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'grace', 'completed', 'slashed')),
    contribution_received BOOLEAN DEFAULT FALSE,
    payout_released BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (recipient_wallet) REFERENCES users(wallet_address),
    UNIQUE(group_id, turn_index)
);

-- Contributions table (populated from ContributionMade events)
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    turn_id UUID NOT NULL,
    from_wallet VARCHAR(44) NOT NULL,
    amount BIGINT NOT NULL,
    tx_signature VARCHAR(88) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (turn_id) REFERENCES turns(id),
    FOREIGN KEY (from_wallet) REFERENCES users(wallet_address)
);

-- Slashes table (populated from MemberSlashed events)
CREATE TABLE slashes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_member_id UUID NOT NULL,
    turn_id UUID NOT NULL,
    slash_amount BIGINT NOT NULL,
    remaining_stake BIGINT NOT NULL,
    reason VARCHAR(255) DEFAULT 'missed_contribution',
    tx_signature VARCHAR(88) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (group_member_id) REFERENCES group_members(id),
    FOREIGN KEY (turn_id) REFERENCES turns(id)
);

-- Fees table (populated from PayoutReleased events)
CREATE TABLE fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL,
    turn_id UUID NOT NULL,
    gross_amount BIGINT NOT NULL,
    platform_fee_amount BIGINT NOT NULL,
    creator_share_amount BIGINT DEFAULT 0,
    net_payout_amount BIGINT NOT NULL,
    tx_signature VARCHAR(88) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (turn_id) REFERENCES turns(id)
);

-- Bonuses table (populated from completion bonus events)
CREATE TABLE bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL,
    group_member_id UUID NOT NULL,
    bonus_type VARCHAR(20) NOT NULL CHECK (bonus_type IN ('stake_bonus', 'trust_bonus', 'subscription_rebate')),
    amount BIGINT NOT NULL,
    tx_signature VARCHAR(88),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (group_member_id) REFERENCES group_members(id)
);

-- Notifications table (for email/push notifications)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    payload JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit trail table (for admin actions and system events)
CREATE TABLE audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_wallet VARCHAR(44),
    payload JSONB,
    tx_signature VARCHAR(88),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (actor_wallet) REFERENCES users(wallet_address)
);

-- Subscription payments (populated from treasury events)
CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(44) NOT NULL,
    subscription_type VARCHAR(20) NOT NULL CHECK (subscription_type IN ('trust', 'super_trust')),
    amount BIGINT NOT NULL,
    tx_signature VARCHAR(88) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (wallet_address) REFERENCES users(wallet_address)
);

-- Platform stats (aggregated from events)
CREATE TABLE platform_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stat_date DATE NOT NULL UNIQUE,
    total_groups_created INTEGER DEFAULT 0,
    active_basic_groups INTEGER DEFAULT 0,
    active_trust_groups INTEGER DEFAULT 0,
    active_super_trust_groups INTEGER DEFAULT 0,
    total_volume_usdc BIGINT DEFAULT 0,
    total_fees_collected BIGINT DEFAULT 0,
    total_payouts_released BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_groups_creator ON groups(creator_wallet);
CREATE INDEX idx_groups_status ON groups(status);
CREATE INDEX idx_groups_model ON groups(model);
CREATE INDEX idx_groups_onchain_pubkey ON groups(onchain_group_pubkey);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_wallet ON group_members(wallet_address);
CREATE INDEX idx_turns_group ON turns(group_id);
CREATE INDEX idx_turns_recipient ON turns(recipient_wallet);
CREATE INDEX idx_turns_status ON turns(status);
CREATE INDEX idx_contributions_turn ON contributions(turn_id);
CREATE INDEX idx_contributions_from ON contributions(from_wallet);
CREATE INDEX idx_contributions_tx ON contributions(tx_signature);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_audits_entity ON audits(entity_type, entity_id);
CREATE INDEX idx_audits_actor ON audits(actor_wallet);

-- Views for common queries
CREATE VIEW active_groups AS
SELECT 
    g.*,
    u.email as creator_email,
    COUNT(gm.id) as current_members
FROM groups g
LEFT JOIN users u ON g.creator_wallet = u.wallet_address
LEFT JOIN group_members gm ON g.id = gm.group_id
WHERE g.status = 'active'
GROUP BY g.id, u.email;

CREATE VIEW group_dashboard AS
SELECT 
    g.id,
    g.onchain_group_pubkey,
    g.model,
    g.creator_wallet,
    g.member_cap,
    g.current_turn_index,
    g.trust_score,
    COUNT(gm.id) as total_members,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_turns,
    SUM(c.amount) as total_contributions,
    SUM(f.platform_fee_amount) as total_fees
FROM groups g
LEFT JOIN group_members gm ON g.id = gm.group_id
LEFT JOIN turns t ON g.id = t.group_id
LEFT JOIN contributions c ON t.id = c.turn_id
LEFT JOIN fees f ON t.id = f.turn_id
GROUP BY g.id;

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_platform_stats_updated_at BEFORE UPDATE ON platform_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();