use anchor_lang::prelude::*;

/// Platform configuration account
#[account]
pub struct PlatformConfig {
    pub authority: Pubkey,
    pub fee_bps: u16,                    // Platform fee in basis points
    pub trust_subscription_price: u64,   // Trust model subscription in USDC
    pub super_trust_subscription_price: u64, // Super-Trust model subscription in USDC
    pub basic_group_limit: u8,           // Max active Basic groups globally
    pub basic_per_creator_limit: u8,     // Max Basic groups per creator
    pub grace_period_days: u8,           // Grace period in days (default 2)
    pub trust_penalty: i8,               // Trust score penalty for missed payments (default -5)
    pub trust_bonus: i8,                 // Trust score bonus for completion (default +2)
    pub stake_bonus_bps: u16,            // Stake bonus in basis points for compliant members
    pub kyc_threshold: u64,              // KYC required above this USDC amount
    pub bonus_pool: u64,                 // Platform bonus pool for stake bonuses
    pub usdc_mint: Pubkey,               // USDC mint address
    pub bump: u8,
}

/// Group account
#[account]
pub struct Group {
    pub group_id: u64,
    pub model: GroupModel,
    pub creator: Pubkey,
    pub member_cap: u8,
    pub current_turn_index: u8,
    pub cycle_days: u32,                 // Days per turn (Basic: 7, configurable for Trust/Super-Trust)
    pub payout_order: Vec<Pubkey>,       // Immutable after first contribution
    pub escrow_vault: Pubkey,            // Escrow PDA for contributions
    pub stake_vault: Option<Pubkey>,     // Stake PDA for Trust/Super-Trust models
    pub status: GroupStatus,
    pub total_members: u8,
    pub current_turn_start: i64,         // Unix timestamp
    pub contribution_amount: u64,        // USDC amount per contribution
    pub total_pool: u64,                 // Total USDC pool size
    pub trust_score: u8,                 // Group trust score (starts at 100)
    pub created_at: i64,
    pub bump: u8,
}

/// Member account (per group membership)
#[account]
pub struct Member {
    pub group: Pubkey,
    pub user: Pubkey,
    pub stake_amount: u64,               // Staked amount for Trust/Super-Trust
    pub contributed_turns: Vec<bool>,    // Bitmap of completed contributions
    pub missed_count: u8,                // Number of missed payments
    pub trust_delta: i8,                 // Trust score change for this group
    pub join_timestamp: i64,
    pub is_creator: bool,
    pub bump: u8,
}

/// Escrow vault for group contributions
#[account]
pub struct EscrowVault {
    pub group: Pubkey,
    pub vault_authority: Pubkey,
    pub current_balance: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GroupModel {
    Basic,
    Trust,
    SuperTrust,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GroupStatus {
    Active,
    Paused,
    Completed,
    Cancelled,
}

impl PlatformConfig {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        2 + // fee_bps
        8 + // trust_subscription_price
        8 + // super_trust_subscription_price
        1 + // basic_group_limit
        1 + // basic_per_creator_limit
        1 + // grace_period_days
        1 + // trust_penalty
        1 + // trust_bonus
        2 + // stake_bonus_bps
        8 + // kyc_threshold
        8 + // bonus_pool
        32 + // usdc_mint
        1; // bump
}

impl Group {
    pub const MAX_MEMBERS: usize = 100; // Super-Trust max
    
    pub const LEN: usize = 8 + // discriminator
        8 + // group_id
        1 + // model
        32 + // creator
        1 + // member_cap
        1 + // current_turn_index
        4 + // cycle_days
        4 + 32 * Self::MAX_MEMBERS + // payout_order (Vec<Pubkey>)
        32 + // escrow_vault
        33 + // stake_vault (Option<Pubkey>)
        1 + // status
        1 + // total_members
        8 + // current_turn_start
        8 + // contribution_amount
        8 + // total_pool
        1 + // trust_score
        8 + // created_at
        1; // bump
}

impl Member {
    pub const MAX_TURNS: usize = 100; // Super-Trust max members
    
    pub const LEN: usize = 8 + // discriminator
        32 + // group
        32 + // user
        8 + // stake_amount
        4 + Self::MAX_TURNS / 8 + // contributed_turns (bitmap)
        1 + // missed_count
        1 + // trust_delta
        8 + // join_timestamp
        1 + // is_creator
        1; // bump
}

impl EscrowVault {
    pub const LEN: usize = 8 + // discriminator
        32 + // group
        32 + // vault_authority
        8 + // current_balance
        1; // bump
}