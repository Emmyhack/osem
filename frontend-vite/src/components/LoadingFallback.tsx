import React from 'react'

interface LoadingFallbackProps {
  message?: string
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-lg">{message}</p>
      </div>
    </div>
  )
}

export default LoadingFallback