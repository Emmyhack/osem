# Oseme Test Plan

- Anchor unit/integration tests for all business logic
- Frontend integration tests (on-chain flows)
- Acceptance scenarios:
  - Basic group #6 fails when 5 active
  - Basic creator cannot create second Basic until first completes
  - Payout only if contributions/slashes satisfy due amount
  - Missed payment → grace → slash event/trust decrease
  - Trust/Super-Trust creator receives 75%/90% of payout fee
  - Completion triggers bonuses/rebate if trust ≥95%
  - Stake withdrawal blocked before completion; allowed after
  - On-ramp webhook credits wallet and allows contribution
  - Admin can adjust fee_bps/bonus_bps/caps with audit trail
  - USDC decimal math correct; no dust leakage