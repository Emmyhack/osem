use anchor_lang::prelude::*;

#[event]
pub struct GroupCreated {
    pub group: Pubkey,
    pub creator: Pubkey,
    pub model: u8, // GroupModel as u8
    pub member_cap: u8,
    pub cycle_days: u32,
    pub contribution_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct MemberJoined {
    pub group: Pubkey,
    pub member: Pubkey,
    pub stake_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct ContributionMade {
    pub group: Pubkey,
    pub member: Pubkey,
    pub turn_index: u8,
    pub amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct PayoutReleased {
    pub group: Pubkey,
    pub recipient: Pubkey,
    pub turn_index: u8,
    pub gross_amount: u64,
    pub fee_amount: u64,
    pub net_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct GracePeriodStarted {
    pub group: Pubkey,
    pub member: Pubkey,
    pub turn_index: u8,
    pub deadline: i64,
    pub timestamp: i64,
}

#[event]
pub struct GroupFinalized {
    pub group: Pubkey,
    pub final_trust_score: u8,
    pub total_members: u8,
    pub timestamp: i64,
}

#[event]
pub struct GroupPaused {
    pub group: Pubkey,
    pub admin: Pubkey,
    pub reason: String,
    pub timestamp: i64,
}

#[event]
pub struct GroupResumed {
    pub group: Pubkey,
    pub admin: Pubkey,
    pub timestamp: i64,
}