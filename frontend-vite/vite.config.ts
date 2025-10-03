import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

// Suppress console warnings for sourcemap issues
const originalConsoleWarn = console.warn
console.warn = (...args: any[]) => {
  const message = args.join(' ')
  if (message.includes('Sourcemap for') && message.includes('points to missing source files')) {
    return // Suppress sourcemap warnings
  }
  originalConsoleWarn(...args)
}

// Custom plugin to suppress sourcemap warnings and handle WalletConnect issues
const suppressSourcemapWarnings = () => ({
  name: 'suppress-sourcemap-warnings',
  configResolved() {
    const originalWarn = console.warn
    const originalError = console.error
    
    console.warn = (...args: any[]) => {
      const message = args.join(' ')
      if (message.includes('Sourcemap for') || message.includes('points to missing source files')) {
        return
      }
      originalWarn(...args)
    }
    
    console.error = (...args: any[]) => {
      const message = args.join(' ')
      if (message.includes('does not provide an export named') && message.includes('@walletconnect')) {
        return // Suppress WalletConnect export errors
      }
      originalError(...args)
    }
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  logLevel: 'info',
  plugins: [
    suppressSourcemapWarnings(),
    nodePolyfills({
      // Enable polyfills for specific Node.js modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports
      protocolImports: true,
      // Include additional polyfills
      include: ['buffer', 'process', 'util', 'events', 'stream'],
      // Exclude problematic modules
      exclude: ['fs'],
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.devnet\.solana\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'solana-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300, // 5 minutes
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Oseme - Decentralized Thrift Platform',
        short_name: 'Oseme',
        description: 'Join rotating savings groups on Solana with USDC',
        theme_color: '#2563eb',
        background_color: '#111827',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress sourcemap warnings from node_modules
        if (warning.code === 'SOURCEMAP_ERROR') return
        if (warning.message?.includes('node_modules')) return
        if (warning.message?.includes('points to missing source files')) return
        // Suppress module resolution warnings from wallet connect packages
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.message?.includes('@walletconnect')) return
        if (warning.code === 'MISSING_EXPORT' && warning.message?.includes('@walletconnect')) return
        warn(warning)
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          solana: [
            '@solana/web3.js',
            '@coral-xyz/anchor',
          ],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
          ],
        },
      },
    },
    sourcemap: true,
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@solana/web3.js',
      '@coral-xyz/anchor',
      'buffer',
      'process',
      'util',
    ],
    exclude: [
      '@solana/wallet-adapter-wallets',
      '@solana/wallet-adapter-react',
      '@solana/wallet-adapter-base',
      '@walletconnect/time',
      '@walletconnect/window-getters',
      '@walletconnect/window-metadata',
      '@reown/appkit'
    ],
  },
})