# Copilot Instructions

- All user actions must be on-chain.
- Scaffold programs, frontend, backend, indexer, docs, CI/CD.
- No off-chain business logic except notifications/webhooks.
- Use Anchor for Solana programs.
- Frontend: Next.js 14, wallet adapter, Tailwind, shadcn/ui.
- Backend: serverless, only for webhooks/notifications.
- Indexer: event-driven, read-only from blockchain.
- Database: Postgres, populated by indexer.
- Notifications: event-driven, email/push.
- Fiat on-ramp: direct USDC to wallet.
- CI/CD: GitHub Actions.
- Document everything.
