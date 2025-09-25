import { VercelRequest, VercelResponse } from '@vercel/node';
import { SolanaEventListener } from '../../src/services/solanaEventListener';
import { NotificationService } from '../../src/services/notificationService';
import { DatabaseService } from '../../src/services/databaseService';

/**
 * Webhook handler for Solana program events
 * Processes on-chain events and triggers notifications
 * ALL BUSINESS LOGIC IS ON-CHAIN - this just indexes and notifies
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const events = req.body.events || [];

        for (const event of events) {
            await processEvent(event);
        }

        res.status(200).json({ success: true, processed: events.length });
    } catch (error) {
        console.error('Solana events webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function processEvent(event: any) {
    const { type, data, signature, timestamp } = event;

    switch (type) {
        case 'GroupCreated':
            await handleGroupCreated(data, signature, timestamp);
            break;
        case 'MemberJoined':
            await handleMemberJoined(data, signature, timestamp);
            break;
        case 'ContributionMade':
            await handleContributionMade(data, signature, timestamp);
            break;
        case 'GracePeriodStarted':
            await handleGracePeriodStarted(data, signature, timestamp);
            break;
        case 'MemberSlashed':
            await handleMemberSlashed(data, signature, timestamp);
            break;
        case 'PayoutReleased':
            await handlePayoutReleased(data, signature, timestamp);
            break;
        case 'GroupFinalized':
            await handleGroupFinalized(data, signature, timestamp);
            break;
        default:
            console.log(`Unknown event type: ${type}`);
    }
}

async function handleGroupCreated(data: any, signature: string, timestamp: number) {
    // Index group creation
    await DatabaseService.indexGroupCreated(data, signature, timestamp);
    
    // Notify creator
    await NotificationService.sendGroupCreatedNotification(data.creator, data.group);
}

async function handleMemberJoined(data: any, signature: string, timestamp: number) {
    // Index member join
    await DatabaseService.indexMemberJoined(data, signature, timestamp);
    
    // Notify group members
    await NotificationService.sendMemberJoinedNotification(data.group, data.member);
}

async function handleContributionMade(data: any, signature: string, timestamp: number) {
    // Index contribution
    await DatabaseService.indexContribution(data, signature, timestamp);
    
    // Notify group members about contribution
    await NotificationService.sendContributionMadeNotification(data.group, data.contributor, data.amount);
}

async function handleGracePeriodStarted(data: any, signature: string, timestamp: number) {
    // Index grace period start
    await DatabaseService.indexGracePeriodStarted(data, signature, timestamp);
    
    // Send urgent notification to member
    await NotificationService.sendGracePeriodNotification(data.member, data.group, data.grace_until);
}

async function handleMemberSlashed(data: any, signature: string, timestamp: number) {
    // Index slash event
    await DatabaseService.indexMemberSlashed(data, signature, timestamp);
    
    // Notify member and group about slash
    await NotificationService.sendMemberSlashedNotification(data.member, data.group, data.slash_amount);
}

async function handlePayoutReleased(data: any, signature: string, timestamp: number) {
    // Index payout
    await DatabaseService.indexPayoutReleased(data, signature, timestamp);
    
    // Notify recipient about payout
    await NotificationService.sendPayoutReceivedNotification(data.recipient, data.group, data.net_amount);
}

async function handleGroupFinalized(data: any, signature: string, timestamp: number) {
    // Index group completion
    await DatabaseService.indexGroupFinalized(data, signature, timestamp);
    
    // Notify all members about completion
    await NotificationService.sendGroupCompletedNotification(data.group, data.final_trust_score);
}