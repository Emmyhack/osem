use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer, transfer};
use crate::state::*;
use crate::errors::*;
use crate::events::*;

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    
    #[account(
        mut,
        seeds = [b"member", group.key().as_ref(), contributor.key().as_ref()],
        bump = member.bump
    )]
    pub member: Account<'info, Member>,
    
    #[account(
        mut,
        seeds = [b"escrow", group.key().as_ref()],
        bump = escrow_vault.bump
    )]
    pub escrow_vault: Account<'info, EscrowVault>,
    
    #[account(
        mut,
        seeds = [b"escrow-token", group.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        constraint = contributor_token_account.mint == platform_config.usdc_mint
    )]
    pub contributor_token_account: Account<'info, TokenAccount>,
    
    #[account(
        seeds = [b"platform-config"],
        bump = platform_config.bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    
    #[account(mut)]
    pub contributor: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Contribute>, amount: u64) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let member = &mut ctx.accounts.member;
    let escrow_vault = &mut ctx.accounts.escrow_vault;
    let clock = Clock::get()?;
    
    // Verify group is active
    if group.status != GroupStatus::Active {
        return Err(OsemeGroupError::GroupNotActive.into());
    }
    
    // Verify it's the contributor's turn or they can contribute
    let current_recipient = group.payout_order.get(group.current_turn_index as usize)
        .ok_or(OsemeGroupError::NotCurrentTurnRecipient)?;
    
    // For Basic model, only current recipient contributes
    // For Trust/SuperTrust, any member can contribute
    match group.model {
        GroupModel::Basic => {
            if ctx.accounts.contributor.key() != *current_recipient {
                return Err(OsemeGroupError::NotCurrentTurnRecipient.into());
            }
        },
        _ => {
            // Trust/SuperTrust: verify member is in group
            if member.group != group.key() || member.user != ctx.accounts.contributor.key() {
                return Err(OsemeGroupError::MemberNotFound.into());
            }
        }
    }
    
    // Verify contribution amount
    if amount != group.contribution_amount {
        return Err(OsemeGroupError::IncorrectContributionAmount.into());
    }
    
    // Check if turn deadline has passed
    let turn_duration = group.cycle_days as i64 * 24 * 60 * 60; // Convert days to seconds
    let turn_deadline = group.current_turn_start + turn_duration;
    
    if clock.unix_timestamp > turn_deadline {
        return Err(OsemeGroupError::TurnDeadlineNotReached.into());
    }
    
    // Transfer USDC to escrow
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.contributor_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.contributor.to_account_info(),
        }
    );
    transfer(transfer_ctx, amount)?;
    
    // Update escrow balance
    escrow_vault.current_balance = escrow_vault.current_balance
        .checked_add(amount)
        .ok_or(OsemeGroupError::UsdcCalculationError)?;
    
    // Mark contribution in member record
    if (member.contributed_turns.len() as u8) <= group.current_turn_index {
        member.contributed_turns.resize((group.current_turn_index + 1) as usize, false);
    }
    member.contributed_turns[group.current_turn_index as usize] = true;
    
    // Emit contribution event
    emit!(ContributionMade {
        group: group.key(),
        contributor: ctx.accounts.contributor.key(),
        turn_index: group.current_turn_index,
        amount,
        escrow_balance: escrow_vault.current_balance,
        timestamp: clock.unix_timestamp,
    });
    
    msg!("Contribution of {} USDC made by {}", amount, ctx.accounts.contributor.key());
    Ok(())
}