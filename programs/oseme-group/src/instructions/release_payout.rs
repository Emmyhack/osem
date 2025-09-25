use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer, transfer};
use crate::state::*;
use crate::errors::*;
use crate::events::*;

#[derive(Accounts)]
pub struct ReleasePayout<'info> {
    #[account(mut)]
    pub group: Account<'info, Group>,
    
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
        constraint = recipient_token_account.mint == platform_config.usdc_mint,
        constraint = recipient_token_account.owner == recipient.key()
    )]
    pub recipient_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: Recipient pubkey is validated against payout order
    pub recipient: AccountInfo<'info>,
    
    #[account(
        seeds = [b"platform-config"],
        bump = platform_config.bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ReleasePayout>, turn_index: u8) -> Result<()> {
    let group = &mut ctx.accounts.group;
    let escrow_vault = &mut ctx.accounts.escrow_vault;
    let platform_config = &ctx.accounts.platform_config;
    let clock = Clock::get()?;
    
    // Verify group is active
    if group.status != GroupStatus::Active {
        return Err(OsemeGroupError::GroupNotActive.into());
    }
    
    // Verify turn index matches current turn
    if turn_index != group.current_turn_index {
        return Err(OsemeGroupError::NotCurrentTurnRecipient.into());
    }
    
    // Verify recipient is correct for this turn
    let expected_recipient = group.payout_order.get(turn_index as usize)
        .ok_or(OsemeGroupError::NotCurrentTurnRecipient)?;
    
    if ctx.accounts.recipient.key() != *expected_recipient {
        return Err(OsemeGroupError::NotCurrentTurnRecipient.into());
    }
    
    // Verify sufficient contributions received
    let required_amount = group.contribution_amount
        .checked_mul(group.total_members as u64)
        .ok_or(OsemeGroupError::UsdcCalculationError)?;
    
    if escrow_vault.current_balance < required_amount {
        return Err(OsemeGroupError::InsufficientEscrowBalance.into());
    }
    
    // Calculate fees
    let gross_amount = required_amount;
    let platform_fee = gross_amount
        .checked_mul(platform_config.fee_bps as u64)
        .ok_or(OsemeGroupError::UsdcCalculationError)?
        .checked_div(10000)
        .ok_or(OsemeGroupError::UsdcCalculationError)?;
    
    // Calculate creator fee share based on model
    let creator_fee = match group.model {
        GroupModel::Basic => 0,
        GroupModel::Trust => platform_fee
            .checked_mul(75)
            .ok_or(OsemeGroupError::UsdcCalculationError)?
            .checked_div(100)
            .ok_or(OsemeGroupError::UsdcCalculationError)?,
        GroupModel::SuperTrust => platform_fee
            .checked_mul(90)
            .ok_or(OsemeGroupError::UsdcCalculationError)?
            .checked_div(100)
            .ok_or(OsemeGroupError::UsdcCalculationError)?,
    };
    
    let net_amount = gross_amount
        .checked_sub(platform_fee)
        .ok_or(OsemeGroupError::UsdcCalculationError)?;
    
    // Transfer net amount to recipient
    let group_key = group.key();
    let seeds = &[
        b"escrow",
        group_key.as_ref(),
        &[escrow_vault.bump]
    ];
    let signer_seeds = &[&seeds[..]];
    
    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.recipient_token_account.to_account_info(),
            authority: escrow_vault.to_account_info(),
        },
        signer_seeds
    );
    transfer(transfer_ctx, net_amount)?;
    
    // Update escrow balance
    escrow_vault.current_balance = escrow_vault.current_balance
        .checked_sub(gross_amount)
        .ok_or(OsemeGroupError::UsdcCalculationError)?;
    
    // Move to next turn
    group.current_turn_index = group.current_turn_index
        .checked_add(1)
        .ok_or(OsemeGroupError::UsdcCalculationError)?;
    
    group.current_turn_start = clock.unix_timestamp;
    
    // Emit payout event
    emit!(PayoutReleased {
        group: group.key(),
        recipient: ctx.accounts.recipient.key(),
        turn_index,
        gross_amount,
        platform_fee,
        creator_fee,
        net_amount,
        timestamp: clock.unix_timestamp,
    });
    
    msg!("Payout of {} USDC released to {}", net_amount, ctx.accounts.recipient.key());
    
    // Check if group is completed
    if group.current_turn_index >= group.total_members {
        group.status = GroupStatus::Completed;
        msg!("Group completed after {} turns", group.total_members);
    }
    
    Ok(())
}