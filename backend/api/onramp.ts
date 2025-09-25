import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

export interface OnRampAttempt {
    walletAddress: string;
    amountUsd: number;
    provider: string;
    sessionId: string;
    expectedUsdcAmount: number;
}

export class DatabaseService {
    private static pool: Pool | null = null;

    private static getPool(): Pool {
        if (!this.pool) {
            this.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            });
        }
        return this.pool;
    }

    static async logOnRampAttempt(attempt: OnRampAttempt): Promise<void> {
        const pool = this.getPool();

        try {
            await pool.query(
                `INSERT INTO onramp_attempts 
                (wallet_address, amount_usd, provider, session_id, expected_usdc_amount, created_at)
                VALUES ($1, $2, $3, $4, $5, NOW())`,
                [
                    attempt.walletAddress,
                    attempt.amountUsd,
                    attempt.provider,
                    attempt.sessionId,
                    attempt.expectedUsdcAmount
                ]
            );
        } catch (error) {
            console.error('Failed to log onramp attempt:', error);
            // Don't throw error to avoid breaking the main flow
        }
    }
}
import { PublicKey } from '@solana/web3.js';

export interface OnRampQuote {
    provider: string;
    amountUsd: number;
    expectedUsdcAmount: number;
    fees: number;
    estimatedTime: string;
}

export interface OnRampSession {
    sessionId: string;
    redirectUrl: string;
    expectedUsdcAmount: number;
    expiresAt: Date;
}

export interface OnRampOptions {
    provider?: string;
    currency?: string;
    userEmail?: string;
    userId?: string;
}

export class OnRampService {
    private initialized = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        // Initialize connection to on-ramp providers (MoonPay, etc.)
        this.initialized = true;
    }

    async createPurchase(
        walletAddress: string,
        amountUsd: number,
        options: OnRampOptions = {}
    ): Promise<OnRampSession> {
        // Validate wallet address
        try {
            new PublicKey(walletAddress);
        } catch (error) {
            throw new Error('Invalid Solana wallet address');
        }

        const provider = options.provider || 'moonpay';
        const sessionId = `osem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Calculate expected USDC amount (minus fees)
        const fees = amountUsd * 0.025; // 2.5% fee
        const expectedUsdcAmount = amountUsd - fees;

        // Create redirect URL for on-ramp provider
        const redirectUrl = this.buildProviderUrl(provider, {
            walletAddress,
            amountUsd,
            sessionId,
            currency: options.currency || 'USD',
            userEmail: options.userEmail,
        });

        return {
            sessionId,
            redirectUrl,
            expectedUsdcAmount,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
        };
    }

    async getQuote(amountUsd: number, provider?: string): Promise<OnRampQuote> {
        const selectedProvider = provider || 'moonpay';

        // Calculate fees and expected USDC amount
        const fees = amountUsd * 0.025; // 2.5% fee
        const expectedUsdcAmount = amountUsd - fees;

        return {
            provider: selectedProvider,
            amountUsd,
            expectedUsdcAmount,
            fees,
            estimatedTime: '5-10 minutes',
        };
    }

    private buildProviderUrl(provider: string, params: {
        walletAddress: string;
        amountUsd: number;
        sessionId: string;
        currency: string;
        userEmail?: string;
    }): string {
        const baseUrls = {
            moonpay: 'https://buy.moonpay.com',
            coinbase: 'https://pay.coinbase.com',
        };

        const baseUrl = baseUrls[provider as keyof typeof baseUrls] || baseUrls.moonpay;

        const urlParams = new URLSearchParams({
            apiKey: process.env.MOONPAY_API_KEY || 'test_key',
            currencyCode: 'USDC',
            baseCurrencyCode: params.currency,
            baseCurrencyAmount: params.amountUsd.toString(),
            walletAddress: params.walletAddress,
            externalTransactionId: params.sessionId,
            redirectURL: `${process.env.FRONTEND_URL}/onramp/success`,
        });

        if (params.userEmail) {
            urlParams.append('email', params.userEmail);
        }

        return `${baseUrl}?${urlParams.toString()}`;
    }
}