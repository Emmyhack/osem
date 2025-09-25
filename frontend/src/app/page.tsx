export default function HomePage() {import { Navigation } from '@/components/Navigation'

  return (import { Hero } from '@/components/Hero'

    <main className="min-h-screen bg-gray-900 text-white">import { Features } from '@/components/Features'

      {/* Simple Header */}import { GroupsOverview } from '@/components/GroupsOverview'

      <div className="container mx-auto px-6 py-8">import { StatsSection } from '@/components/StatsSection'

        <div className="flex items-center space-x-3 mb-8">import { Footer } from '@/components/Footer'

          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">

            <span className="text-white font-bold">O</span>export default function HomePage() {

          </div>  return (

          <span className="text-2xl font-bold">Oseme</span>    <main className="min-h-screen">

        </div>      <Navigation />

      <Hero />

        {/* Simple Hero */}      <Features />

        <div className="text-center py-20">      <GroupsOverview />

          <h1 className="text-5xl font-bold mb-6">      <StatsSection />

            Save Together, <span className="text-blue-400">Build Wealth</span>      <Footer />

          </h1>    </main>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">  )

            Join the future of community savings powered by blockchain technology.}
          </p>
          
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Get Started
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Simple Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">$2.1M+</div>
            <div className="text-gray-400">Total Saved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
            <div className="text-gray-400">Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">1.2K+</div>
            <div className="text-gray-400">Groups</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">98.5%</div>
            <div className="text-gray-400">Success Rate</div>
          </div>
        </div>

        {/* Loading indicator for full version */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">Loading full platform...</p>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </main>
  )
}