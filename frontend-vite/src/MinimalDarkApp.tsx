import React from 'react'

const MinimalDarkApp = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Theme with Colorful Stars */}
      <div className="absolute inset-0 stars-background"></div>
      <div className="absolute inset-0 stars-background-large opacity-60"></div>
      <div className="absolute inset-0 grid-background"></div>
      <div className="absolute inset-0 grid-background-fine opacity-40"></div>
      <div className="absolute inset-0 grid-dots opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center max-w-2xl animate-glow">
          <h1 className="text-6xl font-bold text-white mb-6">
            🌟 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              OSEM
            </span>
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">Dark Theme Test</h2>
          
          <div className="space-y-4 text-left text-white">
            <p>✅ <strong>Dark Background:</strong> You should see a dark gray background (#111827)</p>
            <p>🌟 <strong>Colorful Stars:</strong> Twinkling stars in red, cyan, blue, yellow, orange, purple, pink, green</p>
            <p>📏 <strong>Grid Lines:</strong> Subtle animated grid patterns in the background</p>
            <p>💎 <strong>Glass Effect:</strong> This card should have backdrop blur and transparency</p>
            <p>✨ <strong>Animations:</strong> Stars should twinkle and grids should slide smoothly</p>
          </div>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
            <h3 className="text-purple-300 font-semibold mb-2">🎯 Success Indicators:</h3>
            <p className="text-white text-sm">
              If you can see this page with all the features above, 
              then the OSEM dark theme is working perfectly!
            </p>
          </div>
          
          <div className="mt-6 text-xs text-gray-400 font-mono">
            Current Time: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MinimalDarkApp