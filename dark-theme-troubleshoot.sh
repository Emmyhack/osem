#!/bin/bash

echo "🔍 OSEM Dark Theme Troubleshooting Script"
echo "========================================"
echo ""

# 1. Check if the server is running
echo "📡 1. Checking if development server is running..."
SERVER_CHECK=$(lsof -i :3000 2>/dev/null | grep LISTEN)
if [[ -n "$SERVER_CHECK" ]]; then
    echo "   ✅ Server is running on port 3000"
    echo "   📍 URL: http://localhost:3000/"
else
    echo "   ❌ No server running on port 3000"
    echo "   🚀 Starting server..."
    cd /home/dextonicx/osem/frontend-vite
    npm run dev &
    sleep 5
    echo "   ✅ Server should now be running at http://localhost:3000/"
fi

echo ""

# 2. Check if the correct files exist
echo "📁 2. Checking critical files..."
FILES=(
    "/home/dextonicx/osem/frontend-vite/src/main.tsx"
    "/home/dextonicx/osem/frontend-vite/src/App.tsx"
    "/home/dextonicx/osem/frontend-vite/src/pages/HomePage.tsx"
    "/home/dextonicx/osem/frontend-vite/src/index.css"
)

for file in "${FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "   ✅ Found: $(basename $file)"
    else
        echo "   ❌ Missing: $(basename $file)"
    fi
done

echo ""

# 3. Check if CSS contains dark theme classes
echo "🎨 3. Checking dark theme CSS classes..."
CSS_FILE="/home/dextonicx/osem/frontend-vite/src/index.css"

CSS_CLASSES=("stars-background" "grid-background" "bg-gray-900")

for class in "${CSS_CLASSES[@]}"; do
    if grep -q "$class" "$CSS_FILE" 2>/dev/null; then
        echo "   ✅ Found CSS class: $class"
    else
        echo "   ❌ Missing CSS class: $class"
    fi
done

echo ""

# 4. Check HomePage structure
echo "🏠 4. Checking HomePage structure..."
HOMEPAGE="/home/dextonicx/osem/frontend-vite/src/pages/HomePage.tsx"

HOMEPAGE_ELEMENTS=("bg-gray-900" "stars-background" "grid-background")

for element in "${HOMEPAGE_ELEMENTS[@]}"; do
    if grep -q "$element" "$HOMEPAGE" 2>/dev/null; then
        echo "   ✅ HomePage contains: $element"
    else
        echo "   ❌ HomePage missing: $element"
    fi
done

echo ""

# 5. Test URL accessibility
echo "🌐 5. Testing URL accessibility..."
if command -v curl &> /dev/null; then
    HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null)
    if [[ "$HTTP_RESPONSE" == "200" ]]; then
        echo "   ✅ http://localhost:3000/ is accessible (HTTP 200)"
    else
        echo "   ❌ http://localhost:3000/ returned HTTP $HTTP_RESPONSE"
    fi
else
    echo "   ℹ️  curl not available, skipping HTTP test"
fi

echo ""

# 6. Browser recommendations
echo "🌐 6. Browser Access Recommendations:"
echo "   1. Open your browser (Chrome, Firefox, Edge, Safari)"
echo "   2. Navigate to: http://localhost:3000/"
echo "   3. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) for hard refresh"
echo "   4. Clear browser cache if needed"
echo ""

echo "🎯 Expected Dark Theme Features:"
echo "   🌟 Dark gray background (#111827)"
echo "   ✨ Colorful twinkling stars (red, cyan, blue, yellow, etc.)"
echo "   📏 Animated grid lines in background"
echo "   💎 Glass morphism effects on cards"
echo "   🚀 Smooth animations throughout"
echo ""

echo "💡 If you're still seeing a different website:"
echo "   1. Check that you're on http://localhost:3000/ (not a different port)"
echo "   2. Try opening in incognito/private browsing mode"
echo "   3. Clear all browser cache and cookies"
echo "   4. Try a different browser"
echo "   5. Check browser developer tools (F12) for any console errors"
echo ""

echo "📞 Quick Tests:"
echo "   • Pure HTML test: http://localhost:3000/test-dark-theme.html"
echo "   • Main app: http://localhost:3000/"
echo ""

echo "✅ Troubleshooting complete!"
echo "🎨 The dark theme should be visible at http://localhost:3000/"