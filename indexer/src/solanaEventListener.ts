import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet, Idl } from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

/**
 * Solana Event Listener Service
 * Listens to on-chain program events and triggers webhooks
 * ALL BUSINESS LOGIC IS ON-CHAIN - this just indexes events
 */
export class SolanaEventListener {
    private connection: Connection;
    private programs: Map<string, Program> = new Map();
    private isListening: boolean = false;

    constructor() {
        this.connection = new Connection(
            process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
            'confirmed'
        );
    }

    async initialize() {
        // Initialize program clients
        await this.initializePrograms();
        
        // Start listening to events
        await this.startListening();
    }

    private async initializePrograms() {
        // Mock wallet for reading program state
        const mockWallet = {
            publicKey: new PublicKey('11111111111111111111111111111111'),
            signTransaction: async () => { throw new Error('Mock wallet cannot sign'); },
            signAllTransactions: async () => { throw new Error('Mock wallet cannot sign'); },
        } as Wallet;

        const provider = new AnchorProvider(this.connection, mockWallet, {});

        // Load program IDLs and create program instances
        // In production, these would be loaded from actual IDL files
        const groupProgramId = new PublicKey(process.env.GROUP_PROGRAM_ID!);
        const trustProgramId = new PublicKey(process.env.TRUST_PROGRAM_ID!);
        const treasuryProgramId = new PublicKey(process.env.TREASURY_PROGRAM_ID!);

        // For now, we'll use mock IDLs - in production these would be real
        const mockIdl = { instructions: [], accounts: [], events: [] } as Idl;

        this.programs.set('group', new Program(mockIdl, groupProgramId, provider));
        this.programs.set('trust', new Program(mockIdl, trustProgramId, provider));
        this.programs.set('treasury', new Program(mockIdl, treasuryProgramId, provider));
    }

    private async startListening() {
        if (this.isListening) return;

        this.isListening = true;
        console.log('Starting Solana event listener...');

        // Listen to all programs
        for (const [programName, program] of this.programs) {
            this.listenToProgram(programName, program);
        }

        // Also listen to raw transaction logs for additional context
        this.listenToTransactionLogs();
    }

    private listenToProgram(programName: string, program: Program) {
        // Listen to program logs
        this.connection.onLogs(
            program.programId,
            (logs, context) => {
                this.processLogs(programName, logs, context);
            },
            'confirmed'
        );

        console.log(`Listening to ${programName} program: ${program.programId.toBase58()}`);
    }

    private listenToTransactionLogs() {
        // Listen to all transaction logs for additional context
        this.connection.onLogs(
            'all',
            (logs, context) => {
                // Filter for our program transactions
                const relevantLogs = logs.logs.filter(log => 
                    Array.from(this.programs.values()).some(program =>
                        log.includes(program.programId.toBase58())
                    )
                );

                if (relevantLogs.length > 0) {
                    this.processTransactionLogs(logs, context);
                }
            },
            'confirmed'
        );
    }

    private async processLogs(programName: string, logs: any, context: any) {
        try {
            // Parse program logs for events
            const events = this.parseEventsFromLogs(programName, logs.logs);
            
            for (const event of events) {
                await this.handleEvent(event, logs.signature, context.slot);
            }

        } catch (error) {
            console.error(`Error processing ${programName} logs:`, error);
        }
    }

    private async processTransactionLogs(logs: any, context: any) {
        try {
            // Additional transaction processing if needed
            console.log(`Transaction processed: ${logs.signature}`);
        } catch (error) {
            console.error('Error processing transaction logs:', error);
        }
    }

    private parseEventsFromLogs(programName: string, logs: string[]): any[] {
        const events: any[] = [];

        for (const log of logs) {
            try {
                // Parse different event types based on log patterns
                if (log.includes('GroupCreated')) {
                    events.push(this.parseGroupCreatedEvent(log));
                } else if (log.includes('MemberJoined')) {
                    events.push(this.parseMemberJoinedEvent(log));
                } else if (log.includes('ContributionMade')) {
                    events.push(this.parseContributionMadeEvent(log));
                } else if (log.includes('GracePeriodStarted')) {
                    events.push(this.parseGracePeriodStartedEvent(log));
                } else if (log.includes('MemberSlashed')) {
                    events.push(this.parseMemberSlashedEvent(log));
                } else if (log.includes('PayoutReleased')) {
                    events.push(this.parsePayoutReleasedEvent(log));
                } else if (log.includes('GroupFinalized')) {
                    events.push(this.parseGroupFinalizedEvent(log));
                }
            } catch (error) {
                console.error('Error parsing event from log:', log, error);
            }
        }

        return events.filter(event => event !== null);
    }

    private parseGroupCreatedEvent(log: string): any | null {
        // Parse log format: "Program log: GroupCreated: {data}"
        const match = log.match(/GroupCreated:\s*(.+)/);
        if (match) {
            try {
                return {
                    type: 'GroupCreated',
                    data: JSON.parse(match[1]),
                };
            } catch {
                return null;
            }
        }
        return null;
    }

    private parseMemberJoinedEvent(log: string): any | null {
        const match = log.match(/MemberJoined:\s*(.+)/);
        if (match) {
            try {
                return {
                    type: 'MemberJoined',
                    data: JSON.parse(match[1]),
                };
            } catch {
                return null;
            }
        }
        return null;
    }

    private parseContributionMadeEvent(log: string): any | null {
        const match = log.match(/ContributionMade:\s*(.+)/);
        if (match) {
            try {
                return {
                    type: 'ContributionMade',
                    data: JSON.parse(match[1]),
                };
            } catch {
                return null;
            }
        }
        return null;
    }

    private parseGracePeriodStartedEvent(log: string): any | null {
        const match = log.match(/GracePeriodStarted:\s*(.+)/);
        if (match) {
            try {
                return {
                    type: 'GracePeriodStarted',
                    data: JSON.parse(match[1]),
                };
            } catch {
                return null;
            }
        }
        return null;
    }

    private parseMemberSlashedEvent(log: string): any | null {
        const match = log.match(/MemberSlashed:\s*(.+)/);
        if (match) {
            try {
                return {
                    type: 'MemberSlashed',
                    data: JSON.parse(match[1]),
                };
            } catch {
                return null;
            }
        }
        return null;
    }

    private parsePayoutReleasedEvent(log: string): any | null {
        const match = log.match(/PayoutReleased:\s*(.+)/);
        if (match) {
            try {
                return {
                    type: 'PayoutReleased',
                    data: JSON.parse(match[1]),
                };
            } catch {
                return null;
            }
        }
        return null;
    }

    private parseGroupFinalizedEvent(log: string): any | null {
        const match = log.match(/GroupFinalized:\s*(.+)/);
        if (match) {
            try {
                return {
                    type: 'GroupFinalized',
                    data: JSON.parse(match[1]),
                };
            } catch {
                return null;
            }
        }
        return null;
    }

    private async handleEvent(event: any, signature: string, slot: number) {
        try {
            // Send event to webhook handler
            const webhookPayload = {
                events: [{
                    ...event,
                    signature,
                    slot,
                    timestamp: Math.floor(Date.now() / 1000),
                }]
            };

            // Call internal webhook handler
            await fetch(`${process.env.BACKEND_URL}/api/webhooks/solana-events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Internal-Source': 'event-listener',
                },
                body: JSON.stringify(webhookPayload),
            });

            console.log(`Event processed: ${event.type} - ${signature}`);

        } catch (error) {
            console.error('Error handling event:', error);
        }
    }

    async stop() {
        this.isListening = false;
        // In a real implementation, you'd properly close WebSocket connections
        console.log('Stopped Solana event listener');
    }

    async getAccountUpdates(accountPubkey: string, callback: (account: any) => void) {
        // Listen to specific account updates
        return this.connection.onAccountChange(
            new PublicKey(accountPubkey),
            callback,
            'confirmed'
        );
    }

    async getSlotUpdates(callback: (slot: number) => void) {
        // Listen to slot updates
        return this.connection.onSlotChange(callback);
    }
}