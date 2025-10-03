#!/bin/bash

echo "🚀 Starting OSEM Development Server..."
echo "🔧 Cleaning up any existing servers..."

# Kill any existing vite processes
pkill -f "vite" 2>/dev/null || true
pkill -f "node.*vite" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true

# Wait a moment for processes to clean up
sleep 2

echo "✨ Starting fresh server..."

# Navigate to the correct directory and start the server
cd /home/dextonicx/osem/frontend-vite

echo "📍 Current directory: $(pwd)"
echo "🎯 Starting OSEM with dark theme + stars + grid lines..."

# Start the development server
npm run dev

echo "🎉 OSEM Development Server is now running!"
echo "🌟 Features: Dark theme with colorful stars and animated grid lines"
echo "🚀 DeFi Features: Yield optimization and insurance reserve dashboard"