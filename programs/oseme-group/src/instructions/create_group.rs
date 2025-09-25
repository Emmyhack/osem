use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::errors::*;
use crate::events::*;

#[derive(Accounts)]
#[instruction(model: GroupModel)]
pub struct CreateGroup<'info> {
    #[account(
        init,
        payer = creator,
        space = Group::LEN,
        seeds = [b"group", creator.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub group: Account<'info, Group>,
    
    #[account(
        init,
        payer = creator,
        space = EscrowVault::LEN,
        seeds = [b"escrow", group.key().as_ref()],
        bump
    )]
    pub escrow_vault: Account<'info, EscrowVault>,
    
    #[account(
        init,
        payer = creator,
        token::mint = platform_config.usdc_mint,
        token::authority = escrow_vault,
        seeds = [b"escrow-token", group.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        seeds = [b"platform-config"],
        bump = platform_config.bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_group(
    ctx: Context<CreateGroup>,
    model: GroupModel,
    cycle_days: Option<u32>,
    member_cap: Option<u8>,
    payout_order: Option<Vec<Pubkey>>,
) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let escrow_vault = &mut ctx.accounts.escrow_vault;
    let platform_config = &ctx.accounts.platform_config;
    let clock = Clock::get()?;
    
    // Validate model-specific constraints
    match model {
        GroupModel::Basic => {
            // TODO: Check global Basic group limit
            // TODO: Check per-creator Basic group limit
            
            if member_cap.unwrap_or(5) > 5 {
                return Err(OsemeGroupError::GroupCapacityExceeded.into());
            }
            
            group.cycle_days = 7; // Fixed 7 days for Basic
            group.member_cap = member_cap.unwrap_or(5);
        },
        GroupModel::Trust => {
            group.cycle_days = cycle_days.unwrap_or(7);
            group.member_cap = member_cap.unwrap_or(30).min(30);
        },
        GroupModel::SuperTrust => {
            group.cycle_days = cycle_days.unwrap_or(7);
            group.member_cap = member_cap.unwrap_or(100).min(100);
        },
    }
    
    // Initialize group
    group.group_id = clock.unix_timestamp as u64;
    group.model = model.clone();
    group.creator = ctx.accounts.creator.key();
    group.current_turn_index = 0;
    group.payout_order = payout_order.unwrap_or_default();
    group.escrow_vault = ctx.accounts.escrow_vault.key();
    group.stake_vault = None; // Set later for Trust/SuperTrust models
    group.status = GroupStatus::Active;
    group.total_members = 0;
    group.current_turn_start = clock.unix_timestamp;
    group.contribution_amount = 0; // Set when first member joins
    group.total_pool = 0;
    group.trust_score = 100;
    group.created_at = clock.unix_timestamp;
    group.bump = ctx.bumps.group;
    
    // Initialize escrow vault
    escrow_vault.group = group.key();
    escrow_vault.vault_authority = ctx.accounts.escrow_vault.key();
    escrow_vault.current_balance = 0;
    escrow_vault.bump = ctx.bumps.escrow_vault;
    
    // Emit event
    emit!(GroupCreated {
        group: group.key(),
        creator: group.creator,
        model: match model {
            GroupModel::Basic => 0,
            GroupModel::Trust => 1,
            GroupModel::SuperTrust => 2,
        },
        member_cap: group.member_cap,
        cycle_days: group.cycle_days,
        contribution_amount: group.contribution_amount,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}