use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitPlatform<'info> {
    #[account(
        init,
        payer = authority,
        space = PlatformConfig::LEN,
        seeds = [b"platform-config"],
        bump
    )]
    pub platform_config: Account<'info, PlatformConfig>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn init_platform(ctx: Context<InitPlatform>, config: PlatformConfig) -> Result<()> {
    let platform_config = &mut ctx.accounts.platform_config;
    
    platform_config.authority = ctx.accounts.authority.key();
    platform_config.fee_bps = config.fee_bps;
    platform_config.trust_subscription_price = config.trust_subscription_price;
    platform_config.super_trust_subscription_price = config.super_trust_subscription_price;
    platform_config.basic_group_limit = config.basic_group_limit;
    platform_config.basic_per_creator_limit = config.basic_per_creator_limit;
    platform_config.grace_period_days = config.grace_period_days;
    platform_config.trust_penalty = config.trust_penalty;
    platform_config.trust_bonus = config.trust_bonus;
    platform_config.stake_bonus_bps = config.stake_bonus_bps;
    platform_config.kyc_threshold = config.kyc_threshold;
    platform_config.bonus_pool = config.bonus_pool;
    platform_config.usdc_mint = config.usdc_mint;
    platform_config.bump = ctx.bumps.platform_config;
    
    Ok(())
}