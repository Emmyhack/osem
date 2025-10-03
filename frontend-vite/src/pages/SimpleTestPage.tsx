import { useState, useEffect } from 'react'

const SimpleTestPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toISOString())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toISOString())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <html>
      <head>
        <title>OSEM Dark Theme Test</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            background-color: #111827; 
            color: white; 
            font-family: Inter, sans-serif;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
          }
          
          /* Stars Background */
          .stars-background {
            background-image: 
              radial-gradient(2px 2px at 20px 30px, #ff6b6b, transparent),
              radial-gradient(2px 2px at 40px 70px, #4ecdc4, transparent),
              radial-gradient(1px 1px at 90px 40px, #45b7d1, transparent),
              radial-gradient(1px 1px at 130px 80px, #f9ca24, transparent),
              radial-gradient(2px 2px at 160px 30px, #f0932b, transparent),
              radial-gradient(1px 1px at 200px 90px, #eb4d4b, transparent),
              radial-gradient(1px 1px at 240px 20px, #6c5ce7, transparent),
              radial-gradient(2px 2px at 280px 60px, #a29bfe, transparent),
              radial-gradient(1px 1px at 320px 90px, #fd79a8, transparent),
              radial-gradient(1px 1px at 360px 40px, #00b894, transparent);
            background-repeat: repeat;
            background-size: 400px 400px;
            animation: stars-twinkle 8s ease-in-out infinite alternate;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
          
          /* Grid Background */
          .grid-background {
            background-image: 
              linear-gradient(rgba(75, 85, 99, 0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(75, 85, 99, 0.8) 1px, transparent 1px);
            background-size: 40px 40px;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            animation: grid-slide 20s linear infinite;
          }
          
          @keyframes stars-twinkle {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            25% { opacity: 0.8; transform: scale(1.1); }
            50% { opacity: 1; transform: scale(0.9); }
            75% { opacity: 0.7; transform: scale(1.05); }
          }
          
          @keyframes grid-slide {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(-20px) translateY(-20px); }
          }
          
          .content {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
          }
          
          .card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            max-width: 600px;
          }
          
          .title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            background: linear-gradient(to right, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .description {
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          
          .time {
            font-family: monospace;
            font-size: 0.875rem;
            opacity: 0.7;
            margin-top: 1rem;
          }
          
          .back-button {
            display: inline-block;
            background: linear-gradient(to right, #7c3aed, #ec4899);
            color: white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 1rem;
            transition: transform 0.2s;
          }
          
          .back-button:hover {
            transform: scale(1.05);
          }
        `}</style>
      </head>
      <body>
        <div className="stars-background"></div>
        <div className="grid-background"></div>
        
        <div className="content">
          <div className="card">
            <h1 className="title">🌟 OSEM Dark Theme</h1>
            <p className="description">
              If you can see this page with:
              <br />
              ✨ Dark background (#111827)
              <br />
              🌟 Colorful twinkling stars
              <br />
              📏 Animated grid lines
              <br />
              💎 Glass morphism card effects
              <br />
              <br />
              Then the dark theme is working perfectly!
            </p>
            <div className="time">Current time: {currentTime}</div>
            <a href="/" className="back-button">🏠 Back to OSEM Homepage</a>
          </div>
        </div>
      </body>
    </html>
  )
}

export default SimpleTestPage