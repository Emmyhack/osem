use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef");

pub mod instructions;
pub mod state;
pub mod errors;
pub mod events;

use instructions::*;
use state::*;
use errors::*;

#[program]
pub mod oseme_group {
    use super::*;

    /// Initialize platform configuration (admin only)
    pub fn init_platform(ctx: Context<InitPlatform>, config: PlatformConfig) -> Result<()> {
        instructions::init_platform(ctx, config)
    }

    /// Create a new thrift group
    pub fn create_group(
        ctx: Context<CreateGroup>,
        model: GroupModel,
        cycle_days: Option<u32>,
        member_cap: Option<u8>,
        payout_order: Option<Vec<Pubkey>>,
    ) -> Result<()> {
        instructions::create_group(ctx, model, cycle_days, member_cap, payout_order)
    }

    /// Join an existing group
    pub fn join_group(ctx: Context<JoinGroup>) -> Result<()> {
        instructions::join_group(ctx)
    }

    /// Make a contribution to the current turn
    pub fn contribute(ctx: Context<Contribute>, amount: u64) -> Result<()> {
        instructions::contribute(ctx, amount)
    }

    /// Release payout to the current turn recipient
    pub fn release_payout(ctx: Context<ReleasePayout>) -> Result<()> {
        instructions::release_payout(ctx)
    }

    /// Finalize a completed group
    pub fn finalize_group(ctx: Context<FinalizeGroup>) -> Result<()> {
        instructions::finalize_group(ctx)
    }

    /// Admin function to pause a group
    pub fn pause_group(ctx: Context<PauseGroup>) -> Result<()> {
        instructions::pause_group(ctx)
    }

    /// Admin function to resume a paused group
    pub fn resume_group(ctx: Context<ResumeGroup>) -> Result<()> {
        instructions::resume_group(ctx)
    }
}