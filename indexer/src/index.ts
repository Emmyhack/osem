import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { EventParser } from '@coral-xyz/anchor';
import { DatabaseIndexer } from './services/databaseIndexer';
import { NotificationTrigger } from './services/notificationTrigger';

/**
 * Oseme Indexer - Listens to Solana program events and indexes to Postgres
 * NO BUSINESS LOGIC - all logic is on-chain, this just indexes for UI state
 */
class OsemeIndexer {
    private connection: Connection;
    private programs: Map<string, Program> = new Map();
    private dbIndexer: DatabaseIndexer;
    private notificationTrigger: NotificationTrigger;
    private isRunning = false;

    constructor() {
        const rpcEndpoint = process.env.SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
        this.connection = new Connection(rpcEndpoint, 'confirmed');
        this.dbIndexer = new DatabaseIndexer();
        this.notificationTrigger = new NotificationTrigger();
        
        this.initializePrograms();
    }

    private async initializePrograms() {
        // Initialize Anchor programs for event parsing
        const programIds = {
            osemeGroup: process.env.OSEME_GROUP_PROGRAM_ID!,
            osemeTrust: process.env.OSEME_TRUST_PROGRAM_ID!,
            osemeTreasury: process.env.OSEME_TREASURY_PROGRAM_ID!,
        };

        // Note: In production, load actual IDLs
        for (const [name, programId] of Object.entries(programIds)) {
            try {
                // Load program IDL and create program instance
                // const idl = await Program.fetchIdl(new PublicKey(programId), this.connection);
                // const program = new Program(idl, new PublicKey(programId), provider);
                // this.programs.set(name, program);
                console.log(`Initialized program ${name}: ${programId}`);
            } catch (error) {
                console.error(`Failed to initialize program ${name}:`, error);
            }
        }
    }

    async start() {
        if (this.isRunning) {
            console.log('Indexer is already running');
            return;
        }

        this.isRunning = true;
        console.log('Starting Oseme indexer...');

        // Listen to program logs
        await this.listenToProgramLogs();

        // Start periodic sync
        this.startPeriodicSync();

        console.log('Oseme indexer started successfully');
    }

    async stop() {
        this.isRunning = false;
        console.log('Stopping Oseme indexer...');
    }

    private async listenToProgramLogs() {
        const programIds = [
            process.env.OSEME_GROUP_PROGRAM_ID!,
            process.env.OSEME_TRUST_PROGRAM_ID!,
            process.env.OSEME_TREASURY_PROGRAM_ID!,
        ];

        for (const programId of programIds) {
            this.connection.onLogs(
                new PublicKey(programId),
                async (logs, context) => {
                    try {
                        await this.processLogs(programId, logs, context);
                    } catch (error) {
                        console.error(`Error processing logs for ${programId}:`, error);
                    }
                },
                'confirmed'
            );
        }
    }

    private async processLogs(programId: string, logs: any, context: any) {
        // Parse program logs for events
        const events = this.parseEventsFromLogs(programId, logs);
        
        for (const event of events) {
            // Index event to database
            await this.dbIndexer.indexEvent(event, context.signature);
            
            // Trigger notifications
            await this.notificationTrigger.handleEvent(event);
        }
    }

    private parseEventsFromLogs(programId: string, logs: any): any[] {
        const events: any[] = [];
        
        // Parse anchor events from logs
        // This would use the actual program IDL to parse events
        
        return events;
    }

    private startPeriodicSync() {
        // Periodic sync to catch any missed events
        setInterval(async () => {
            if (!this.isRunning) return;
            
            try {
                await this.performFullSync();
            } catch (error) {
                console.error('Periodic sync error:', error);
            }
        }, 60000); // Every minute
    }

    private async performFullSync() {
        // Implement full blockchain sync logic
        console.log('Performing periodic sync...');
        
        // Query recent transactions for our programs
        // Compare with database state
        // Index any missing events
    }

    async getIndexerStats() {
        return {
            isRunning: this.isRunning,
            programsLoaded: this.programs.size,
            latestBlock: await this.connection.getSlot(),
            dbStats: await this.dbIndexer.getStats(),
        };
    }
}

// Start indexer if run directly
if (require.main === module) {
    const indexer = new OsemeIndexer();
    
    indexer.start().catch(console.error);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
        await indexer.stop();
        process.exit(0);
    });
}

export { OsemeIndexer };