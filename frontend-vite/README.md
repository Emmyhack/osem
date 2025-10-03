# Oseme Frontend - Vite Edition

A modern, high-performance React application built with Vite for the Oseme decentralized thrift platform.

## 🚀 Features

- ⚡ **Vite**: Lightning-fast development server and optimized builds
- 🔗 **React Router**: Client-side routing for SPA navigation
- 🎨 **Tailwind CSS**: Utility-first CSS framework
- 💰 **Solana Integration**: Wallet adapter and web3.js integration
- 🔐 **TypeScript**: Full type safety
- 🧪 **Vitest**: Fast unit testing
- 📱 **PWA Ready**: Progressive Web App capabilities
- 🎯 **Performance Optimized**: Code splitting, lazy loading, and bundle analysis

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Testing**: Vitest, Testing Library
- **PWA**: Vite Plugin PWA

## 📦 Installation

1. Navigate to the frontend-vite directory:
   ```bash
   cd frontend-vite
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🏗️ Build

```bash
# Development build
npm run build

# Production build
NODE_ENV=production npm run build

# Preview production build
npm run preview
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📊 Bundle Analysis

```bash
npm run analyze
```

## 🌐 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_PROGRAM_ID=your_program_id_here
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   └── ...
├── pages/              # Route components
│   ├── HomePage.tsx
│   ├── GroupsPage.tsx
│   └── ...
├── lib/                # Utilities and configurations
├── hooks/              # Custom React hooks
├── test/               # Test utilities
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🚀 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Tree Shaking**: Dead code elimination
- **Modern Bundling**: ESBuild for fast builds
- **PWA Caching**: Service worker for offline functionality
- **Bundle Analysis**: Visualize bundle size and dependencies

## 🎨 Styling

The project uses Tailwind CSS with custom utilities:

- `glass-modern`: Glass morphism effect
- `btn-primary`: Primary button styles
- `section-clean`: Clean section spacing
- `card-hover`: Interactive card effects

## 🔗 Solana Integration

- Wallet connection with multiple wallet support
- Transaction handling with proper error management
- Real-time balance updates
- Smart contract interaction ready

## 📱 PWA Features

- Offline functionality
- Install prompt
- Background sync
- Push notifications (when implemented)

## 🔧 Development

### Hot Reload
Vite provides instant hot module replacement (HMR) for rapid development.

### TypeScript
Full TypeScript support with strict type checking.

### Linting
ESLint configuration for code quality.

### Testing
Vitest for fast unit tests with React Testing Library.

## 🚀 Deployment

The app can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your repository
- **GitHub Pages**: Use GitHub Actions
- **AWS S3 + CloudFront**: Upload build files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)