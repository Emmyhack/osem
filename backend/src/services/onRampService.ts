import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface OnRampProvider {
    name: string;
    initialize(config: OnRampConfig): Promise<void>;
    createPurchaseSession(params: PurchaseParams): Promise<PurchaseSession>;
    handleWebhook(payload: any): Promise<WebhookResult>;
}

export interface OnRampConfig {
    apiKey: string;
    apiSecret: string;
    environment: 'sandbox' | 'production';
    webhookSecret: string;
    callbackUrl: string;
}

export interface PurchaseParams {
    walletAddress: string;
    amountUsd: number;
    currency: string;
    userEmail?: string;
    userId?: string;
}

export interface PurchaseSession {
    sessionId: string;
    redirectUrl: string;
    expectedUsdcAmount: number;
    expiresAt: Date;
}

export interface WebhookResult {
    type: 'purchase_completed' | 'purchase_failed' | 'purchase_pending';
    sessionId: string;
    walletAddress: string;
    usdcAmount: number;
    transactionHash?: string;
    error?: string;
}

/**
 * Moonpay Integration for Fiat On-Ramp
 * Direct USDC purchase to user wallet
 */
export class MoonpayProvider implements OnRampProvider {
    name = 'Moonpay';
    private config!: OnRampConfig;
    private baseUrl: string = '';

    async initialize(config: OnRampConfig): Promise<void> {
        this.config = config;
        this.baseUrl = config.environment === 'production'
            ? 'https://api.moonpay.com'
            : 'https://api.moonpay.com/v1';
    }

    async createPurchaseSession(params: PurchaseParams): Promise<PurchaseSession> {
        const response = await fetch(`${this.baseUrl}/v1/transactions`, {
            method: 'POST',
            headers: {
                'Authorization': `Api-Key ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress: params.walletAddress,
                currencyCode: 'usdc',
                baseCurrencyAmount: params.amountUsd,
                baseCurrencyCode: params.currency || 'usd',
                redirectURL: this.config.callbackUrl,
                email: params.userEmail,
                externalCustomerId: params.userId,
            }),
        });

        const data = await response.json();

        return {
            sessionId: data.id,
            redirectUrl: data.redirectURL,
            expectedUsdcAmount: data.quoteCurrencyAmount * 1000000, // Convert to smallest unit
            expiresAt: new Date(data.expiresAt),
        };
    }

    async handleWebhook(payload: any): Promise<WebhookResult> {
        const { type, data } = payload;

        switch (type) {
            case 'transaction_updated':
                if (data.status === 'completed') {
                    return {
                        type: 'purchase_completed',
                        sessionId: data.id,
                        walletAddress: data.walletAddress,
                        usdcAmount: data.quoteCurrencyAmount * 1000000,
                        transactionHash: data.cryptoTransactionId,
                    };
                } else if (data.status === 'failed') {
                    return {
                        type: 'purchase_failed',
                        sessionId: data.id,
                        walletAddress: data.walletAddress,
                        usdcAmount: 0,
                        error: data.failureReason,
                    };
                } else {
                    return {
                        type: 'purchase_pending',
                        sessionId: data.id,
                        walletAddress: data.walletAddress,
                        usdcAmount: data.quoteCurrencyAmount * 1000000,
                    };
                }
            default:
                throw new Error(`Unknown webhook type: ${type}`);
        }
    }
}

/**
 * Ramp Network Integration for Fiat On-Ramp
 * Alternative provider for USDC purchases
 */
export class RampProvider implements OnRampProvider {
    name = 'Ramp';
    private config!: OnRampConfig;
    private baseUrl: string = '';

    async initialize(config: OnRampConfig): Promise<void> {
        this.config = config;
        this.baseUrl = config.environment === 'production'
            ? 'https://api.ramp.network'
            : 'https://api-testnet.ramp.network';
    }

    async createPurchaseSession(params: PurchaseParams): Promise<PurchaseSession> {
        const response = await fetch(`${this.baseUrl}/api/host-api/purchase`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userAddress: params.walletAddress,
                swapAsset: 'SOLANA_USDC',
                fiatCurrency: params.currency || 'USD',
                fiatValue: params.amountUsd,
                userEmailAddress: params.userEmail,
                webhookStatusUrl: this.config.callbackUrl,
            }),
        });

        const data = await response.json();

        return {
            sessionId: data.purchase.id,
            redirectUrl: data.widgetUrl,
            expectedUsdcAmount: data.purchase.cryptoAmount * 1000000,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        };
    }

    async handleWebhook(payload: any): Promise<WebhookResult> {
        const { type, purchase } = payload;

        switch (type) {
            case 'RELEASED':
                return {
                    type: 'purchase_completed',
                    sessionId: purchase.id,
                    walletAddress: purchase.userAddress,
                    usdcAmount: purchase.cryptoAmount * 1000000,
                    transactionHash: purchase.cryptoTxHash,
                };
            case 'CANCELLED':
            case 'EXPIRED':
                return {
                    type: 'purchase_failed',
                    sessionId: purchase.id,
                    walletAddress: purchase.userAddress,
                    usdcAmount: 0,
                    error: `Purchase ${type.toLowerCase()}`,
                };
            default:
                return {
                    type: 'purchase_pending',
                    sessionId: purchase.id,
                    walletAddress: purchase.userAddress,
                    usdcAmount: purchase.cryptoAmount * 1000000,
                };
        }
    }
}

/**
 * Main On-Ramp Service
 * Manages multiple providers and direct USDC purchases
 */
export class OnRampService {
    private providers: Map<string, OnRampProvider> = new Map();
    private defaultProvider: string = 'moonpay';

    async initialize() {
        // Initialize Moonpay
        const moonpay = new MoonpayProvider();
        await moonpay.initialize({
            apiKey: process.env.MOONPAY_API_KEY!,
            apiSecret: process.env.MOONPAY_API_SECRET!,
            environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            webhookSecret: process.env.MOONPAY_WEBHOOK_SECRET!,
            callbackUrl: `${process.env.BACKEND_URL}/api/webhooks/moonpay`,
        });
        this.providers.set('moonpay', moonpay);

        // Initialize Ramp
        const ramp = new RampProvider();
        await ramp.initialize({
            apiKey: process.env.RAMP_API_KEY!,
            apiSecret: process.env.RAMP_API_SECRET!,
            environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            webhookSecret: process.env.RAMP_WEBHOOK_SECRET!,
            callbackUrl: `${process.env.BACKEND_URL}/api/webhooks/ramp`,
        });
        this.providers.set('ramp', ramp);
    }

    async createPurchase(
        walletAddress: string,
        amountUsd: number,
        options: {
            provider?: string;
            currency?: string;
            userEmail?: string;
            userId?: string;
        } = {}
    ): Promise<PurchaseSession> {
        const provider = this.providers.get(options.provider || this.defaultProvider);
        if (!provider) {
            throw new Error(`Provider ${options.provider} not found`);
        }

        // Validate wallet address
        try {
            new PublicKey(walletAddress);
        } catch {
            throw new Error('Invalid Solana wallet address');
        }

        // Validate amount (minimum $10, maximum $50,000)
        if (amountUsd < 10 || amountUsd > 50000) {
            throw new Error('Amount must be between $10 and $50,000');
        }

        const session = await provider.createPurchaseSession({
            walletAddress,
            amountUsd,
            currency: options.currency || 'USD',
            userEmail: options.userEmail,
            userId: options.userId,
        });

        // Log purchase session creation
        console.log(`Created purchase session: ${session.sessionId} for ${walletAddress}`);

        return session;
    }

    async handleWebhook(providerName: string, payload: any): Promise<WebhookResult> {
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`Provider ${providerName} not found`);
        }

        return provider.handleWebhook(payload);
    }

    async verifyUsdcBalance(walletAddress: string): Promise<number> {
        try {
            const connection = new Connection(
                process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
            );

            const wallet = new PublicKey(walletAddress);
            const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mainnet

            // Get all token accounts for this wallet
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet, {
                mint: usdcMint,
            });

            if (tokenAccounts.value.length === 0) {
                return 0;
            }

            // Sum all USDC balances
            const totalBalance = tokenAccounts.value.reduce((total, account) => {
                const amount = account.account.data.parsed.info.tokenAmount.uiAmount || 0;
                return total + amount;
            }, 0);

            return Math.floor(totalBalance * 1000000); // Convert to smallest unit
        } catch (error) {
            console.error('Error verifying USDC balance:', error);
            return 0;
        }
    }

    getAvailableProviders(): string[] {
        return Array.from(this.providers.keys());
    }

    async getQuote(amountUsd: number, provider?: string): Promise<{
        provider: string;
        amountUsd: number;
        expectedUsdc: number;
        fees: number;
        exchangeRate: number;
    }> {
        // For now, return a simple quote
        // In production, you'd fetch real-time quotes from providers
        const usdcRate = 1.0; // 1 USD = 1 USDC (approximately)
        const fees = amountUsd * 0.025; // 2.5% fee example
        const expectedUsdc = (amountUsd - fees) * usdcRate;

        return {
            provider: provider || this.defaultProvider,
            amountUsd,
            expectedUsdc: Math.floor(expectedUsdc * 1000000),
            fees: Math.floor(fees * 1000000),
            exchangeRate: usdcRate,
        };
    }
}