// This file is deprecated - use MinimalWalletProvider instead
// Keeping as fallback export only

import { MinimalWalletProvider } from './MinimalWalletProvider';

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
    // Redirect to MinimalWalletProvider
    return <MinimalWalletProvider>{children}</MinimalWalletProvider>;
}