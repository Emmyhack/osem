import { useCallback } from 'react'
import { useWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { BN } from '@coral-xyz/anchor'
import { toast } from 'react-hot-toast'
import {
  getOsemeGroupProgram,
  findGroupPDA,
  findMemberPDA,
  findEscrowVaultPDA,
  findStakeVaultPDA,
  findPlatformConfigPDA,
  GroupModel,
  USDC_MINT,
  getConnection
} from '../lib/solana'

export const useOsemeGroup = () => {
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()

  const createGroup = useCallback(async (
    model: GroupModel,
    contributionAmount: number,
    memberCap: number = 10,
    cycleDays: number = 7
  ) => {
    if (!anchorWallet || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const program = getOsemeGroupProgram(anchorWallet)
      const connection = getConnection()

      // Generate a unique group ID (in production, this would be managed by the platform)
      const groupId = Math.floor(Math.random() * 1000000)

      // Find PDAs
      const [groupPDA] = findGroupPDA(groupId)
      const [escrowVaultPDA] = findEscrowVaultPDA(groupPDA)
      const [stakeVaultPDA] = findStakeVaultPDA(groupPDA)

      // Build transaction
      const tx = await program.methods
        .createGroup(
          { [model.toLowerCase()]: {} },
          cycleDays,
          memberCap,
          null // payout order will be set dynamically
        )
        .accounts({
          group: groupPDA,
          creator: publicKey,
          escrowVault: escrowVaultPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      toast.success('Group created successfully!')
      return { groupId, txSignature: tx, groupPDA }
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Failed to create group')
      throw error
    }
  }, [anchorWallet, publicKey])

  const joinGroup = useCallback(async (groupPDA: PublicKey) => {
    if (!anchorWallet || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const program = getOsemeGroupProgram(anchorWallet)

      // Find member PDA
      const [memberPDA] = findMemberPDA(groupPDA, publicKey)

      const tx = await program.methods
        .joinGroup()
        .accounts({
          group: groupPDA,
          member: memberPDA,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      toast.success('Successfully joined the group!')
      return tx
    } catch (error) {
      console.error('Error joining group:', error)
      toast.error('Failed to join group')
      throw error
    }
  }, [anchorWallet, publicKey])

  const contribute = useCallback(async (groupPDA: PublicKey, amount: number) => {
    if (!anchorWallet || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const program = getOsemeGroupProgram(anchorWallet)
      const connection = getConnection()

      // Find PDAs
      const [memberPDA] = findMemberPDA(groupPDA, publicKey)
      const [escrowVaultPDA] = findEscrowVaultPDA(groupPDA)

      // Get user's USDC token account
      const userTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      )

      // Convert amount to smallest unit (USDC has 6 decimals)
      const amountInSmallestUnit = new BN(amount * 1_000_000)

      const tx = await program.methods
        .contribute(amountInSmallestUnit)
        .accounts({
          group: groupPDA,
          member: memberPDA,
          user: publicKey,
          userTokenAccount,
          escrowVault: escrowVaultPDA,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()

      toast.success('Contribution made successfully!')
      return tx
    } catch (error) {
      console.error('Error making contribution:', error)
      toast.error('Failed to make contribution')
      throw error
    }
  }, [anchorWallet, publicKey])

  const releasePayout = useCallback(async (groupPDA: PublicKey, recipientPublicKey: PublicKey) => {
    if (!anchorWallet || !publicKey) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      const program = getOsemeGroupProgram(anchorWallet)

      // Find PDAs
      const [escrowVaultPDA] = findEscrowVaultPDA(groupPDA)

      // Get recipient's USDC token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        recipientPublicKey
      )

      const tx = await program.methods
        .releasePayout()
        .accounts({
          group: groupPDA,
          escrowVault: escrowVaultPDA,
          recipientTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()

      toast.success('Payout released successfully!')
      return tx
    } catch (error) {
      console.error('Error releasing payout:', error)
      toast.error('Failed to release payout')
      throw error
    }
  }, [anchorWallet, publicKey])

  const fetchGroup = useCallback(async (groupPDA: PublicKey) => {
    if (!anchorWallet) return null

    try {
      const program = getOsemeGroupProgram(anchorWallet)
      const groupData = await program.account.group.fetch(groupPDA)
      return groupData
    } catch (error) {
      console.error('Error fetching group:', error)
      return null
    }
  }, [anchorWallet])

  const fetchMember = useCallback(async (groupPDA: PublicKey, userPublicKey: PublicKey) => {
    if (!anchorWallet) return null

    try {
      const program = getOsemeGroupProgram(anchorWallet)
      const [memberPDA] = findMemberPDA(groupPDA, userPublicKey)
      const memberData = await program.account.member.fetch(memberPDA)
      return memberData
    } catch (error) {
      console.error('Error fetching member:', error)
      return null
    }
  }, [anchorWallet])

  const fetchUserGroups = useCallback(async () => {
    if (!anchorWallet || !publicKey) return []

    try {
      const program = getOsemeGroupProgram(anchorWallet)

      // Fetch all member accounts for this user
      const memberAccounts = await program.account.member.all([
        {
          memcmp: {
            offset: 8 + 32, // Skip discriminator + group pubkey
            bytes: publicKey.toBase58(),
          },
        },
      ])

      // Fetch the corresponding group data
      const groups = await Promise.all(
        memberAccounts.map(async (memberAccount) => {
          const groupData = await program.account.group.fetch(memberAccount.account.group as PublicKey)
          return {
            groupPDA: memberAccount.account.group,
            groupData,
            memberData: memberAccount.account,
          }
        })
      )

      return groups
    } catch (error) {
      console.error('Error fetching user groups:', error)
      return []
    }
  }, [anchorWallet, publicKey])

  const fetchAllGroups = useCallback(async () => {
    if (!anchorWallet) return []

    try {
      const program = getOsemeGroupProgram(anchorWallet)
      const groupAccounts = await program.account.group.all()

      return groupAccounts.map((account) => ({
        groupPDA: account.publicKey,
        groupData: account.account,
      }))
    } catch (error) {
      console.error('Error fetching all groups:', error)
      return []
    }
  }, [anchorWallet])

  return {
    createGroup,
    joinGroup,
    contribute,
    releasePayout,
    fetchGroup,
    fetchMember,
    fetchUserGroups,
    fetchAllGroups,
  }
}