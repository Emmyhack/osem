#!/bin/bash

echo "🔍 OSEM Server Status Check"
echo "=========================="

# Check for running processes
echo "📡 Checking for running servers..."
PROCESSES=$(lsof -i :3000-3010 2>/dev/null | grep LISTEN || echo "No servers running")

if [[ "$PROCESSES" == "No servers running" ]]; then
    echo "❌ No OSEM servers are currently running"
    echo ""
    echo "🚀 To start the server, run:"
    echo "   ./start-osem.sh"
    echo "   or"
    echo "   cd /home/dextonicx/osem/frontend-vite && npm run dev"
else
    echo "✅ Found running servers:"
    echo "$PROCESSES"
    echo ""
    echo "🌐 Available URLs:"
    
    # Extract port numbers and show URLs
    PORTS=$(echo "$PROCESSES" | grep -o ':[0-9]*' | grep -o '[0-9]*' | sort -u)
    
    for PORT in $PORTS; do
        echo "   📍 http://localhost:$PORT/"
    done
fi

echo ""
echo "🎨 Expected Features:"
echo "   🌟 Dark theme with colorful stars"
echo "   📏 Animated grid lines"  
echo "   🚀 Yield optimization dashboard"
echo "   🛡️ Insurance reserve transparency"