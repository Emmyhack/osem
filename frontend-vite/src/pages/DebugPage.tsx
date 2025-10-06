const DebugPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dark Theme with Colorful Stars */}
      <div className="absolute inset-0 stars-background"></div>
      <div className="absolute inset-0 stars-background-large opacity-60"></div>
      <div className="absolute inset-0 grid-background"></div>
      <div className="absolute inset-0 grid-background-fine opacity-40"></div>
      <div className="absolute inset-0 grid-dots opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌟 OSEM Dark Theme Test
          </h1>
          <div className="space-y-4 text-white">
            <p>✅ If you see this with a dark background and colorful stars, the theme is working!</p>
            <p>🌟 Stars should be twinkling in multiple colors</p>
            <p>📏 Grid lines should be subtly animated in the background</p>
            <p>🎨 This card should have glass morphism effects</p>
          </div>
          
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
              <h3 className="text-purple-300 font-semibold">Purple Test</h3>
              <p className="text-white text-sm">Accent colors working</p>
            </div>
            <div className="bg-cyan-500/20 p-4 rounded-lg border border-cyan-500/30">
              <h3 className="text-cyan-300 font-semibold">Cyan Test</h3>
              <p className="text-white text-sm">Colors are vibrant</p>
            </div>
          </div>
          
          <a 
            href="/" 
            className="inline-block mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            🏠 Back to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}

export default DebugPage