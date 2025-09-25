import nodemailer from 'nodemailer';
import webpush from 'web-push';
import { Pool } from 'pg';

interface User {
    id: string;
    wallet_address: string;
    email?: string;
    created_at: Date;
}

interface Group {
    id: string;
    pubkey: string;
    name: string;
    created_at: Date;
}

interface GroupMember {
    id: string;
    group_id: string;
    wallet_address: string;
    joined_at: Date;
}

interface Notification {
    user_id: string;
    type: string;
    title: string;
    message: string;
    payload: any;
}

interface Turn {
    id: string;
    group_id: string;
    recipient_wallet: string;
    due_at: Date;
}

interface PushSubscription {
    user_id: string;
    endpoint: string;
    p256dh: string;
    auth: string;
}

export class DatabaseService {
    private static pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    static async getUserByWallet(walletAddress: string): Promise<User | null> {
        const result = await this.pool.query(
            'SELECT * FROM users WHERE wallet_address = $1',
            [walletAddress]
        );
        return result.rows[0] || null;
    }

    static async getUserById(userId: string): Promise<User | null> {
        const result = await this.pool.query(
            'SELECT * FROM users WHERE id = $1',
            [userId]
        );
        return result.rows[0] || null;
    }

    static async getGroupByPubkey(pubkey: string): Promise<Group | null> {
        const result = await this.pool.query(
            'SELECT * FROM groups WHERE pubkey = $1',
            [pubkey]
        );
        return result.rows[0] || null;
    }

    static async getGroupMembers(groupId: string): Promise<GroupMember[]> {
        const result = await this.pool.query(
            'SELECT * FROM group_members WHERE group_id = $1',
            [groupId]
        );
        return result.rows;
    }

    static async createNotification(notification: Notification): Promise<void> {
        await this.pool.query(
            'INSERT INTO notifications (user_id, type, title, message, payload, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
            [notification.user_id, notification.type, notification.title, notification.message, JSON.stringify(notification.payload)]
        );
    }

    static async getPushSubscriptions(userId: string): Promise<PushSubscription[]> {
        const result = await this.pool.query(
            'SELECT * FROM push_subscriptions WHERE user_id = $1',
            [userId]
        );
        return result.rows;
    }

    static async getPendingContributions(walletAddress: string): Promise<any[]> {
        const result = await this.pool.query(
            'SELECT * FROM pending_contributions WHERE wallet_address = $1 AND status = $2',
            [walletAddress, 'pending']
        );
        return result.rows;
    }

    static async getUpcomingTurns(): Promise<Turn[]> {
        const result = await this.pool.query(
            'SELECT * FROM turns WHERE due_at > NOW() AND due_at <= NOW() + INTERVAL \'24 hours\' AND status = $1',
            ['active']
        );
        return result.rows;
    }
};

export class NotificationService {
    private static emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!,
        },
    });

    static {
        // Configure web push
        webpush.setVapidDetails(
            'mailto:' + process.env.VAPID_EMAIL!,
            process.env.VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!
        );
    }

    /**
     * Send notification when group is created
     */
    static async sendGroupCreatedNotification(creatorWallet: string, groupPubkey: string) {
        const user = await DatabaseService.getUserByWallet(creatorWallet);
        if (!user) return;

        const notification = {
            type: 'group_created',
            title: 'Group Created Successfully',
            message: 'Your thrift group has been created and is ready for members to join.',
            payload: { groupPubkey }
        };

        await this.sendNotification(user.id, notification);
    }

    /**
     * Send notification when member joins group
     */
    static async sendMemberJoinedNotification(groupPubkey: string, memberWallet: string) {
        const group = await DatabaseService.getGroupByPubkey(groupPubkey);
        if (!group) return;

        const groupMembers = await DatabaseService.getGroupMembers(group.id);

        const notification = {
            type: 'member_joined',
            title: 'New Member Joined',
            message: `A new member has joined your thrift group. Total members: ${groupMembers.length}`,
            payload: { groupPubkey, memberWallet }
        };

        // Notify all existing members
        for (const member of groupMembers) {
            if (member.wallet_address !== memberWallet) {
                const user = await DatabaseService.getUserByWallet(member.wallet_address);
                if (user) {
                    await this.sendNotification(user.id, notification);
                }
            }
        }
    }

    /**
     * Send notification when contribution is made
     */
    static async sendContributionMadeNotification(groupPubkey: string, contributorWallet: string, amount: number) {
        const group = await DatabaseService.getGroupByPubkey(groupPubkey);
        if (!group) return;

        const groupMembers = await DatabaseService.getGroupMembers(group.id);

        const notification = {
            type: 'contribution_made',
            title: 'Contribution Received',
            message: `A contribution of ${amount / 1000000} USDC has been made to your group.`,
            payload: { groupPubkey, contributorWallet, amount }
        };

        // Notify all group members
        for (const member of groupMembers) {
            const user = await DatabaseService.getUserByWallet(member.wallet_address);
            if (user) {
                await this.sendNotification(user.id, notification);
            }
        }
    }

    /**
     * Send urgent notification when grace period starts
     */
    static async sendGracePeriodNotification(memberWallet: string, groupPubkey: string, graceUntil: number) {
        const user = await DatabaseService.getUserByWallet(memberWallet);
        if (!user) return;

        const graceEndDate = new Date(graceUntil * 1000);

        const notification = {
            type: 'grace_period_started',
            title: '⚠️ URGENT: Payment Grace Period',
            message: `You have until ${graceEndDate.toLocaleDateString()} to make your contribution or face slashing.`,
            payload: { groupPubkey, graceUntil }
        };

        await this.sendNotification(user.id, notification, true); // High priority
    }

    /**
     * Send notification when member is slashed
     */
    static async sendMemberSlashedNotification(memberWallet: string, groupPubkey: string, slashAmount: number) {
        const user = await DatabaseService.getUserByWallet(memberWallet);
        if (!user) return;

        const notification = {
            type: 'member_slashed',
            title: 'Payment Slashed from Stake',
            message: `${slashAmount / 1000000} USDC has been deducted from your stake due to missed payment.`,
            payload: { groupPubkey, slashAmount }
        };

        await this.sendNotification(user.id, notification);

        // Also notify group members
        const group = await DatabaseService.getGroupByPubkey(groupPubkey);
        if (group) {
            const groupMembers = await DatabaseService.getGroupMembers(group.id);

            const groupNotification = {
                type: 'member_slashed_group',
                title: 'Member Payment Slashed',
                message: 'A group member was slashed for missing payment. The cycle continues.',
                payload: { groupPubkey, memberWallet, slashAmount }
            };

            for (const member of groupMembers) {
                if (member.wallet_address !== memberWallet) {
                    const memberUser = await DatabaseService.getUserByWallet(member.wallet_address);
                    if (memberUser) {
                        await this.sendNotification(memberUser.id, groupNotification);
                    }
                }
            }
        }
    }

    /**
     * Send notification when payout is received
     */
    static async sendPayoutReceivedNotification(recipientWallet: string, groupPubkey: string, netAmount: number) {
        const user = await DatabaseService.getUserByWallet(recipientWallet);
        if (!user) return;

        const notification = {
            type: 'payout_received',
            title: '💰 Payout Received!',
            message: `You received ${netAmount / 1000000} USDC from your thrift group payout.`,
            payload: { groupPubkey, netAmount }
        };

        await this.sendNotification(user.id, notification);
    }

    /**
     * Send notification when group completes
     */
    static async sendGroupCompletedNotification(groupPubkey: string, finalTrustScore: number) {
        const group = await DatabaseService.getGroupByPubkey(groupPubkey);
        if (!group) return;

        const groupMembers = await DatabaseService.getGroupMembers(group.id);

        const notification = {
            type: 'group_completed',
            title: '🎉 Group Completed!',
            message: `Your thrift group has completed successfully with a trust score of ${finalTrustScore}.`,
            payload: { groupPubkey, finalTrustScore }
        };

        // Notify all group members
        for (const member of groupMembers) {
            const user = await DatabaseService.getUserByWallet(member.wallet_address);
            if (user) {
                await this.sendNotification(user.id, notification);
            }
        }
    }

    /**
     * Send notification when on-ramp purchase completes
     */
    static async sendOnRampSuccessNotification(walletAddress: string, amountUsdc: number) {
        const user = await DatabaseService.getUserByWallet(walletAddress);
        if (!user) return;

        const notification = {
            type: 'onramp_success',
            title: 'USDC Purchase Successful',
            message: `${amountUsdc / 1000000} USDC has been added to your wallet and is ready for contributions.`,
            payload: { amountUsdc }
        };

        await this.sendNotification(user.id, notification);
    }

    /**
     * Check if user has pending contributions they can now make
     */
    static async checkPendingContributions(walletAddress: string) {
        const pendingContributions = await DatabaseService.getPendingContributions(walletAddress);

        if (pendingContributions.length > 0) {
            const user = await DatabaseService.getUserByWallet(walletAddress);
            if (user) {
                const notification = {
                    type: 'pending_contributions',
                    title: 'Ready to Contribute',
                    message: `You have ${pendingContributions.length} pending contributions that you can now make.`,
                    payload: { pendingCount: pendingContributions.length }
                };

                await this.sendNotification(user.id, notification);
            }
        }
    }

    /**
     * Send contribution reminder notifications
     */
    static async sendContributionReminders() {
        const upcomingTurns = await DatabaseService.getUpcomingTurns();

        for (const turn of upcomingTurns) {
            const hoursUntilDue = (new Date(turn.due_at).getTime() - Date.now()) / (1000 * 60 * 60);

            if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
                const user = await DatabaseService.getUserByWallet(turn.recipient_wallet);
                if (user) {
                    const notification = {
                        type: 'contribution_reminder',
                        title: 'Contribution Due Soon',
                        message: `Your thrift group contribution is due in ${Math.round(hoursUntilDue)} hours.`,
                        payload: {
                            turnId: turn.id,
                            groupId: turn.group_id,
                            hoursRemaining: Math.round(hoursUntilDue)
                        }
                    };

                    await this.sendNotification(user.id, notification);
                }
            }
        }
    }

    /**
     * Core notification sending function
     */
    private static async sendNotification(
        userId: string,
        notification: any,
        highPriority: boolean = false
    ) {
        try {
            // Save to database
            await DatabaseService.createNotification({
                user_id: userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                payload: notification.payload
            });

            const user = await DatabaseService.getUserById(userId);
            if (!user) return;

            // Send email if user has email
            if (user.email) {
                await this.sendEmail(user.email, notification, highPriority);
            }

            // Send push notification if user has subscriptions
            const pushSubscriptions = await DatabaseService.getPushSubscriptions(userId);
            for (const subscription of pushSubscriptions) {
                await this.sendPushNotification(subscription, notification, highPriority);
            }

        } catch (error) {
            console.error('Failed to send notification:', error);
        }
    }

    /**
     * Send email notification
     */
    private static async sendEmail(email: string, notification: any, highPriority: boolean) {
        const subject = highPriority ? `🚨 ${notification.title}` : notification.title;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: ${highPriority ? '#ef4444' : '#3b82f6'};">
                    ${notification.title}
                </h2>
                <p style="font-size: 16px; line-height: 1.5;">
                    ${notification.message}
                </p>
                <div style="margin-top: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        This notification was sent from Oseme, your decentralized thrift platform.
                        <br>
                        <a href="${process.env.FRONTEND_URL}" style="color: #3b82f6;">Visit Dashboard</a>
                    </p>
                </div>
            </div>
        `;

        await this.emailTransporter.sendMail({
            from: process.env.FROM_EMAIL!,
            to: email,
            subject,
            html
        });
    }

    /**
     * Send push notification
     */
    private static async sendPushNotification(subscription: any, notification: any, highPriority: boolean) {
        const payload = JSON.stringify({
            title: notification.title,
            body: notification.message,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            tag: notification.type,
            requireInteraction: highPriority,
            actions: [
                {
                    action: 'view',
                    title: 'View Dashboard'
                }
            ],
            data: notification.payload
        });

        await webpush.sendNotification(subscription, payload);
    }
}