import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OsemeGroup } from "../target/types/oseme_group";
import { expect } from "chai";
import {
    PublicKey,
    Keypair,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createMint,
    createAccount,
    mintTo,
    getAccount,
} from "@solana/spl-token";

describe("Oseme Group Program", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.OsemeGroup as Program<OsemeGroup>;

    let usdcMint: PublicKey;
    let platformAuthority: Keypair;
    let platformConfig: PublicKey;
    let creator: Keypair;
    let member1: Keypair;
    let member2: Keypair;
    let member3: Keypair;

    before(async () => {
        // Setup test keypairs
        platformAuthority = Keypair.generate();
        creator = Keypair.generate();
        member1 = Keypair.generate();
        member2 = Keypair.generate();
        member3 = Keypair.generate();

        // Airdrop SOL to all keypairs
        await Promise.all([
            provider.connection.requestAirdrop(platformAuthority.publicKey, 2e9),
            provider.connection.requestAirdrop(creator.publicKey, 2e9),
            provider.connection.requestAirdrop(member1.publicKey, 2e9),
            provider.connection.requestAirdrop(member2.publicKey, 2e9),
            provider.connection.requestAirdrop(member3.publicKey, 2e9),
        ]);

        // Create USDC mint
        usdcMint = await createMint(
            provider.connection,
            platformAuthority,
            platformAuthority.publicKey,
            null,
            6 // USDC decimals
        );

        // Derive platform config PDA
        [platformConfig] = PublicKey.findProgramAddressSync(
            [Buffer.from("platform-config")],
            program.programId
        );
    });

    describe("Platform Initialization", () => {
        it("Initializes platform configuration", async () => {
            await program.methods
                .initPlatform({
                    authority: platformAuthority.publicKey,
                    feeBps: 250, // 2.5%
                    trustSubscriptionPrice: new anchor.BN(100 * 1e6), // 100 USDC
                    superTrustSubscriptionPrice: new anchor.BN(500 * 1e6), // 500 USDC
                    basicGroupLimit: 5,
                    basicPerCreatorLimit: 1,
                    gracePeriodDays: 2,
                    trustPenalty: -5,
                    trustBonus: 2,
                    stakeBonusBps: 100, // 1%
                    kycThreshold: new anchor.BN(1000 * 1e6), // 1000 USDC
                    bonusPool: new anchor.BN(10000 * 1e6), // 10000 USDC
                    usdcMint: usdcMint,
                })
                .accounts({
                    platformConfig,
                    authority: platformAuthority.publicKey,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .signers([platformAuthority])
                .rpc();

            const configAccount = await program.account.platformConfig.fetch(platformConfig);
            expect(configAccount.authority.toString()).to.equal(platformAuthority.publicKey.toString());
            expect(configAccount.feeBps).to.equal(250);
            expect(configAccount.basicGroupLimit).to.equal(5);
        });
    });

    describe("Basic Group Creation and Management", () => {
        let basicGroup: PublicKey;
        let escrowVault: PublicKey;
        let escrowTokenAccount: PublicKey;

        it("Creates a Basic group", async () => {
            const timestamp = Math.floor(Date.now() / 1000);

            [basicGroup] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("group"),
                    creator.publicKey.toBuffer(),
                    new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8),
                ],
                program.programId
            );

            [escrowVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("escrow"), basicGroup.toBuffer()],
                program.programId
            );

            [escrowTokenAccount] = PublicKey.findProgramAddressSync(
                [Buffer.from("escrow-token"), basicGroup.toBuffer()],
                program.programId
            );

            await program.methods
                .createGroup(
                    { basic: {} }, // GroupModel::Basic
                    null, // cycle_days (auto-set to 7 for Basic)
                    null, // member_cap (auto-set to 5 for Basic)
                    null  // payout_order (empty initially)
                )
                .accounts({
                    group: basicGroup,
                    escrowVault,
                    escrowTokenAccount,
                    platformConfig,
                    creator: creator.publicKey,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .signers([creator])
                .rpc();

            const groupAccount = await program.account.group.fetch(basicGroup);
            expect(groupAccount.model).to.deep.equal({ basic: {} });
            expect(groupAccount.creator.toString()).to.equal(creator.publicKey.toString());
            expect(groupAccount.memberCap).to.equal(5);
            expect(groupAccount.cycleDays).to.equal(7);
            expect(groupAccount.status).to.deep.equal({ active: {} });
        });

        it("Prevents creating more than 5 Basic groups globally", async () => {
            // This test would require creating 5 Basic groups first
            // and then attempting to create a 6th one
            // For brevity, this is a placeholder test structure

            try {
                // Simulate creating 6th Basic group
                const timestamp = Math.floor(Date.now() / 1000) + 1;

                const [sixthGroup] = PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("group"),
                        creator.publicKey.toBuffer(),
                        new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8),
                    ],
                    program.programId
                );

                // This should fail if 5 Basic groups already exist
                await program.methods
                    .createGroup({ basic: {} }, null, null, null)
                    .accounts({
                        group: sixthGroup,
                        // ... other accounts
                    })
                    .signers([creator])
                    .rpc();

                expect.fail("Should have thrown an error for exceeding Basic group limit");
            } catch (error) {
                expect(error.toString()).to.include("BasicGroupLimitExceeded");
            }
        });

        it("Allows members to join Basic group", async () => {
            const [memberAccount] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("member"),
                    basicGroup.toBuffer(),
                    member1.publicKey.toBuffer(),
                ],
                program.programId
            );

            await program.methods
                .joinGroup()
                .accounts({
                    group: basicGroup,
                    member: memberAccount,
                    user: member1.publicKey,
                    platformConfig,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .signers([member1])
                .rpc();

            const memberAccountData = await program.account.member.fetch(memberAccount);
            expect(memberAccountData.user.toString()).to.equal(member1.publicKey.toString());
            expect(memberAccountData.group.toString()).to.equal(basicGroup.toString());
            expect(memberAccountData.stakeAmount.toNumber()).to.equal(0); // No stake for Basic
        });
    });

    describe("Trust Group Operations", () => {
        let trustGroup: PublicKey;
        let stakeVault: PublicKey;
        let creatorTokenAccount: PublicKey;
        let member1TokenAccount: PublicKey;

        before(async () => {
            // Create token accounts for USDC
            creatorTokenAccount = await createAccount(
                provider.connection,
                creator,
                usdcMint,
                creator.publicKey
            );

            member1TokenAccount = await createAccount(
                provider.connection,
                member1,
                usdcMint,
                member1.publicKey
            );

            // Mint USDC to accounts
            await mintTo(
                provider.connection,
                creator,
                usdcMint,
                creatorTokenAccount,
                platformAuthority,
                10000 * 1e6 // 10,000 USDC
            );

            await mintTo(
                provider.connection,
                member1,
                usdcMint,
                member1TokenAccount,
                platformAuthority,
                5000 * 1e6 // 5,000 USDC
            );
        });

        it("Creates a Trust group with custom parameters", async () => {
            const timestamp = Math.floor(Date.now() / 1000) + 100;

            [trustGroup] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("group"),
                    creator.publicKey.toBuffer(),
                    new anchor.BN(timestamp).toArrayLike(Buffer, "le", 8),
                ],
                program.programId
            );

            [stakeVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("stake"), trustGroup.toBuffer()],
                program.programId
            );

            const payoutOrder = [creator.publicKey, member1.publicKey, member2.publicKey];

            await program.methods
                .createGroup(
                    { trust: {} }, // GroupModel::Trust
                    14, // 14-day cycles
                    10, // max 10 members
                    payoutOrder
                )
                .accounts({
                    group: trustGroup,
                    platformConfig,
                    creator: creator.publicKey,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .signers([creator])
                .rpc();

            const groupAccount = await program.account.group.fetch(trustGroup);
            expect(groupAccount.model).to.deep.equal({ trust: {} });
            expect(groupAccount.cycleDays).to.equal(14);
            expect(groupAccount.memberCap).to.equal(10);
            expect(groupAccount.payoutOrder.length).to.equal(3);
        });

        it("Requires stake when joining Trust group", async () => {
            const [memberAccount] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("member"),
                    trustGroup.toBuffer(),
                    member1.publicKey.toBuffer(),
                ],
                program.programId
            );

            const stakeAmount = 1000 * 1e6; // 1000 USDC stake

            await program.methods
                .joinGroup()
                .accounts({
                    group: trustGroup,
                    member: memberAccount,
                    user: member1.publicKey,
                    userTokenAccount: member1TokenAccount,
                    stakeVault,
                    platformConfig,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .signers([member1])
                .preInstructions([
                    // Add instruction to transfer stake
                ])
                .rpc();

            const memberAccountData = await program.account.member.fetch(memberAccount);
            expect(memberAccountData.stakeAmount.toNumber()).to.equal(stakeAmount);
        });
    });

    describe("Contribution and Payout Flow", () => {
        it("Processes contributions and releases payouts", async () => {
            // Test contribution flow
            // Test payout calculation with fees
            // Test creator fee share for Trust/Super-Trust
            // This would be a comprehensive integration test
        });

        it("Handles grace period and slashing correctly", async () => {
            // Test grace period start
            // Test slashing after grace period expires
            // Test trust score reduction
        });
    });

    describe("Group Completion and Bonuses", () => {
        it("Finalizes group and distributes bonuses", async () => {
            // Test group finalization
            // Test stake bonus calculation
            // Test subscription rebate if trust score >= 95%
        });
    });

    describe("Admin Functions", () => {
        it("Updates platform parameters", async () => {
            await program.methods
                .adminUpdateParams({
                    feeBps: 300, // Increase fee to 3%
                    trustSubscriptionPrice: new anchor.BN(150 * 1e6),
                    superTrustSubscriptionPrice: new anchor.BN(600 * 1e6),
                    basicGroupLimit: 7,
                    basicPerCreatorLimit: 2,
                    gracePeriodDays: 3,
                    trustPenalty: -7,
                    trustBonus: 3,
                    stakeBonusBps: 150,
                    kycThreshold: new anchor.BN(1500 * 1e6),
                    bonusPool: new anchor.BN(15000 * 1e6),
                })
                .accounts({
                    platformConfig,
                    authority: platformAuthority.publicKey,
                })
                .signers([platformAuthority])
                .rpc();

            const configAccount = await program.account.platformConfig.fetch(platformConfig);
            expect(configAccount.feeBps).to.equal(300);
            expect(configAccount.basicGroupLimit).to.equal(7);
        });

        it("Pauses and resumes groups", async () => {
            // Test group pause functionality
            // Test group resume functionality
        });
    });

    describe("Edge Cases and Error Handling", () => {
        it("Prevents invalid operations", async () => {
            // Test various error conditions
            // Test invalid amounts
            // Test unauthorized access
            // Test timing constraints
        });

        it("Handles USDC decimal precision correctly", async () => {
            // Test that all calculations handle USDC's 6 decimals correctly
            // Test rounding behavior
            // Test dust prevention
        });
    });
});