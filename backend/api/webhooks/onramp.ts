import { VercelRequest, VercelResponse } from '@vercel/node';
import { validateWebhookSignature } from '../../src/services/webhookValidator';
import { NotificationService } from '../../src/services/notificationService';
import { DatabaseService } from '../../src/services/databaseService';

/**
 * Webhook handler for fiat on-ramp events
 * Processes USDC purchase completions and triggers notifications
 * NO CUSTODY - just webhook processing for balance updates
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Validate webhook signature
        const isValid = await validateWebhookSignature(
            req.body,
            req.headers['x-webhook-signature'] as string,
            'onramp'
        );

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid webhook signature' });
        }

        const { wallet_address, amount_usdc, transaction_id, status } = req.body;

        if (status === 'completed') {
            // Log the successful purchase
            await DatabaseService.logOnRampEvent({
                walletAddress: wallet_address,
                amountUsdc: amount_usdc,
                transactionId: transaction_id,
                status: 'completed'
            });

            // Send notification to user
            await NotificationService.sendOnRampSuccessNotification(
                wallet_address,
                amount_usdc
            );

            // Check if user has pending contributions they can now make
            await NotificationService.checkPendingContributions(wallet_address);
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('On-ramp webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}