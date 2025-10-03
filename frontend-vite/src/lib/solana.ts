import { Connection, PublicKey, clusterApiUrl, Cluster } from '@solana/web3.js'

export const SOLANA_NETWORK = (import.meta.env.VITE_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet'
const getCluster = (network: 'devnet' | 'mainnet'): Cluster => {
  return network === 'mainnet' ? 'mainnet-beta' : 'devnet'
}
export const connection = new Connection(
  import.meta.env.VITE_RPC_ENDPOINT || clusterApiUrl(getCluster(SOLANA_NETWORK)), 
  'confirmed'
)

// USDC mint addresses
export const USDC_MINT = {
  devnet: new PublicKey('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr'),
  mainnet: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
}

// Program ID (replace with actual deployed program ID)
export const PROGRAM_ID = new PublicKey('GrpABCDEFGHIJKLMNOPQRSTUVWXYZ123456789abcdef')

export const getCurrentUSDC = () => {
  return SOLANA_NETWORK === 'mainnet' ? USDC_MINT.mainnet : USDC_MINT.devnet
}

// Group models and status enums
export enum GroupModel {
  Basic = 'Basic',
  Trust = 'Trust',
  SuperTrust = 'SuperTrust'
}

export enum GroupStatus {
  Active = 'Active',
  Paused = 'Paused',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}
