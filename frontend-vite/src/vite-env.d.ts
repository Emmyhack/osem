/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RPC_ENDPOINT: string
  readonly VITE_OSEME_GROUP_PROGRAM_ID: string
  readonly VITE_OSEME_TREASURY_PROGRAM_ID: string
  readonly VITE_OSEME_TRUST_PROGRAM_ID: string
  readonly VITE_CIRCLE_API_KEY: string
  readonly VITE_CIRCLE_ENVIRONMENT: 'sandbox' | 'production'
  readonly PROD: boolean
  readonly DEV: boolean
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global type declarations
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean
      connect(): Promise<{ publicKey: { toString(): string } }>
      disconnect(): Promise<void>
      signTransaction(transaction: any): Promise<any>
      signAllTransactions(transactions: any[]): Promise<any[]>
    }
  }
}

export {}