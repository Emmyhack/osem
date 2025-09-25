use anchor_lang::prelude::*;

#[error_code]
pub enum OsemeGroupError {
    #[msg("Basic group limit exceeded globally")]
    BasicGroupLimitExceeded,
    
    #[msg("Creator already has an active Basic group")]
    CreatorBasicGroupLimitExceeded,
    
    #[msg("Group is at member capacity")]
    GroupCapacityExceeded,
    
    #[msg("Group is not active")]
    GroupNotActive,
    
    #[msg("Not the current turn recipient")]
    NotCurrentTurnRecipient,
    
    #[msg("Contribution amount incorrect")]
    IncorrectContributionAmount,
    
    #[msg("Turn already completed")]
    TurnAlreadyCompleted,
    
    #[msg("Group not ready for finalization")]
    GroupNotReadyForFinalization,
    
    #[msg("Payout order is immutable after first contribution")]
    PayoutOrderImmutable,
    
    #[msg("Insufficient escrow balance for payout")]
    InsufficientEscrowBalance,
    
    #[msg("Grace period not started")]
    GracePeriodNotStarted,
    
    #[msg("Turn deadline not reached")]
    TurnDeadlineNotReached,
    
    #[msg("Member not found in group")]
    MemberNotFound,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Invalid group model for operation")]
    InvalidGroupModel,
    
    #[msg("USDC decimal calculation error")]
    UsdcCalculationError,
}