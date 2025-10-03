import React from 'react'
import CleanNavigation from '../components/CleanNavigation'
import { Shield, Zap, Users, Globe, Award, Heart } from 'lucide-react'

const AboutPage: React.FC = () => {
  console.log('AboutPage rendering...')

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <CleanNavigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            About Oseme
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Revolutionizing traditional savings circles with blockchain technology, 
            transparency, and global accessibility.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              We believe everyone deserves access to financial tools that help them build wealth. 
              Oseme transforms traditional rotating savings and credit associations (ROSCAs) into 
              a transparent, secure, and globally accessible platform powered by Solana blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Trust & Security</h3>
              <p className="text-gray-300">
                Smart contracts ensure transparent, immutable transactions that build trust among participants.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <Globe className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Global Access</h3>
              <p className="text-gray-300">
                Connect with savings groups worldwide, breaking down geographical barriers to financial inclusion.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl text-center">
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-300">
                Leverage Solana's speed and low fees for efficient, cost-effective group savings management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Our Values</h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="flex items-start space-x-4">
              <Users className="w-12 h-12 text-blue-400 mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-3">Community First</h3>
                <p className="text-gray-300 leading-relaxed">
                  We prioritize building strong, supportive communities where members help each other achieve financial goals together.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Award className="w-12 h-12 text-green-400 mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-300 leading-relaxed">
                  We strive for the highest standards in security, user experience, and platform reliability.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Shield className="w-12 h-12 text-purple-400 mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-3">Transparency</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every transaction, rule, and process is transparent and verifiable on the blockchain.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Heart className="w-12 h-12 text-red-400 mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-semibold mb-3">Empowerment</h3>
                <p className="text-gray-300 leading-relaxed">
                  We empower individuals to take control of their financial future through collective savings and mutual support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Built for the Future</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Oseme is built by a team of blockchain developers, financial experts, and community organizers 
              passionate about democratizing access to financial tools.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">Join the Revolution</h3>
            <p className="text-xl text-gray-300 mb-8">
              Ready to be part of the decentralized savings revolution? Start your financial journey with Oseme today.
            </p>
            <button className="btn-primary text-lg px-8 py-4">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold">Oseme</span>
          </div>
          <p className="text-gray-400">
            Building the future of decentralized savings, one group at a time.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default AboutPage