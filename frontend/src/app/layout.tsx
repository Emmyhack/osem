import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '@/components/WalletContextProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oseme - Decentralized Thrift Platform',
  description: 'Join rotating savings groups on Solana with USDC',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </WalletContextProvider>
      </body>
    </html>
  )
}